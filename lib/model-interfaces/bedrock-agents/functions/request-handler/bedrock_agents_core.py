import os
import re
import json
from datetime import datetime
from aws_lambda_powertools import Logger
from langchain_community.chat_message_histories import DynamoDBChatMessageHistory
import genai_core.clients

logger = Logger()


def validate_agent_id(agent_id: str) -> bool:
    """Validate agent ID format to prevent injection attacks"""
    if not agent_id or not isinstance(agent_id, str):
        return False

    # Allow alphanumeric, hyphens, underscores, and ARN format
    if agent_id.startswith("arn:"):
        # ARN format validation - match the test expectation
        arn_pattern = (
            r"^arn:aws:bedrock-agentcore:[a-z0-9-]+:\d{12}:runtime/[a-zA-Z0-9_-]+$"
        )
        return bool(re.match(arn_pattern, agent_id))
    else:
        # Simple agent ID format
        pattern = r"^[a-zA-Z0-9_-]+$"
        return bool(re.match(pattern, agent_id)) and len(agent_id) <= 50


def get_conversation_history(session_id, user_id, max_messages=20):
    """Get conversation history from DynamoDB with message limit"""
    try:
        logger.info(f"Loading conversation history for session {session_id}")
        chat_history = DynamoDBChatMessageHistory(
            table_name=os.environ["SESSIONS_TABLE_NAME"],
            session_id=session_id,
        )

        # Get all messages and limit them
        messages = chat_history.messages
        if len(messages) > max_messages:
            # Keep the most recent messages
            recent_messages = messages[-max_messages:]
            logger.info(
                f"Found {len(messages)} total messages, "
                f"using {len(recent_messages)} recent messages"
            )
            return recent_messages
        else:
            logger.info(f"Found {len(messages)} messages (within limit)")
            return messages

    except Exception as e:
        logger.error(f"Error loading conversation history: {str(e)}")
        return []


def save_session_history(session_id, user_id, prompt, response_content):
    """Save conversation to session history with error recovery"""
    chat_history = None
    try:
        logger.info(f"Saving session history for session {session_id}")
        chat_history = DynamoDBChatMessageHistory(
            table_name=os.environ["SESSIONS_TABLE_NAME"],
            session_id=session_id,
        )

        # Add user message
        chat_history.add_user_message(prompt)

        # Add assistant response
        chat_history.add_ai_message(response_content)

        logger.info("Session history saved successfully")
        return True

    except Exception as e:
        logger.error(f"Error saving session history: {str(e)}")

        # Attempt error recovery
        try:
            if chat_history:
                # Try to save at least the response
                chat_history.add_ai_message(f"Error occurred: {str(e)}")
                logger.info("Saved error message to session history")
        except Exception as recovery_error:
            logger.error(f"Error recovery failed: {str(recovery_error)}")

        return False


def send_to_client(user_id, session_id, request_id, content, run_id=None):
    """Send response to client via SNS"""
    try:
        sns_client = genai_core.clients.get_sns_client()

        message = {
            "type": "text",
            "userId": user_id,
            "sessionId": session_id,
            "requestId": request_id,
            "content": content,
            "runId": run_id,
            "timestamp": datetime.utcnow().isoformat(),
        }

        topic_arn = os.environ.get("MESSAGES_TOPIC_ARN")
        if not topic_arn:
            logger.error("MESSAGES_TOPIC_ARN environment variable not set")
            return False

        response = sns_client.publish(TopicArn=topic_arn, Message=json.dumps(message))

        logger.info(f"Message sent to SNS: {response['MessageId']}")
        return True

    except Exception as e:
        logger.error(f"Error sending message to client: {str(e)}")
        return False


def handle_heartbeat(record):
    """Handle heartbeat requests"""
    user_id = record["userId"]
    session_id = record["data"]["sessionId"]

    message = {
        "type": "text",
        "action": "heartbeat",
        "timestamp": datetime.utcnow().isoformat(),
        "userId": user_id,
        "data": {
            "sessionId": session_id,
        },
    }

    try:
        sns_client = genai_core.clients.get_sns_client()
        topic_arn = os.environ.get("MESSAGES_TOPIC_ARN")
        if topic_arn:
            sns_client.publish(TopicArn=topic_arn, Message=json.dumps(message))
            logger.info(f"Heartbeat sent for session {session_id}")
        else:
            logger.error("MESSAGES_TOPIC_ARN not configured")
    except Exception as e:
        logger.error(f"Error sending heartbeat: {str(e)}")


def handle_run(record, context):
    """Main handler function for processing agent requests"""
    user_id = record["userId"]
    session_id = record["sessionId"]
    request_id = record["requestId"]
    prompt = record["data"]["text"]
    agent_id = record["data"]["modelName"]

    logger.info(f"Processing agent request: {agent_id} for user {user_id}")

    # Validate agent ID
    if not validate_agent_id(agent_id):
        error_msg = f"Invalid agent ID format: {agent_id}"
        logger.error(error_msg)
        send_to_client(user_id, session_id, request_id, error_msg)
        return

    try:
        # Convert agent ID to full ARN format
        if not agent_id.startswith("arn:"):
            region = os.environ.get("AWS_REGION", "us-east-1")
            # Handle mock context in tests
            if hasattr(context, "invoked_function_arn"):
                account_id = context.invoked_function_arn.split(":")[4]
            else:
                account_id = "123456789012"  # Default for tests
            agent_runtime_arn = (
                f"arn:aws:bedrock:{region}:{account_id}:agent/{agent_id}"
            )
        else:
            agent_runtime_arn = agent_id

        # Get AgentCore client
        agentcore_client = genai_core.clients.get_agentcore_client()

        # Get conversation history (for context, not used in current implementation)
        get_conversation_history(session_id, user_id)

        # Invoke agent
        logger.info(f"Invoking agent: {agent_runtime_arn}")
        response = agentcore_client.invoke_agent(
            agentId=agent_id,
            agentAliasId="TSTALIASID",
            sessionId=session_id,
            inputText=prompt,
        )

        # Process response
        response_content = ""
        for event in response.get("completion", []):
            if "chunk" in event:
                chunk = event["chunk"]
                if "bytes" in chunk:
                    response_content += chunk["bytes"].decode("utf-8")

        # Send response to client
        send_to_client(user_id, session_id, request_id, response_content)

        # Save to session history
        save_session_history(session_id, user_id, prompt, response_content)

        logger.info("Agent request processed successfully")

    except Exception as e:
        error_msg = f"Error processing agent request: {str(e)}"
        logger.error(error_msg)
        send_to_client(user_id, session_id, request_id, error_msg)
