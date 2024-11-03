from aws_lambda_powertools import Logger
import boto3
from langchain_aws import ChatBedrockConverse
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from .base import MultiModalModelBase
from genai_core.types import ChatbotMessageType
import os
from genai_core.clients import get_bedrock_client
import json
from base64 import b64encode
from genai_core.registry import registry

logger = Logger()
s3 = boto3.resource("s3")


def get_system_prompt():
    return f"""
    You are an AI assistant designed to help public sector employees working for
    the government of Israel solve problems and answer questions.
    Your responses should always be in {os.environ.get("LANGUAGE", "Hebrew")} and never
    translated into any other language.
    Use only the data provided to answer the user's query accurately.
    If you don't know the answer, clearly state that you do not know.
    Do not invent or fabricate information.
    Maintain a professional and respectful tone at all times, considering the specific
    needs of government employees
    """


def get_image_message(file: dict, user_id: str, file_name: str):
    if file["key"] is None:
        raise Exception("Invalid S3 Key " + file["key"])

    key = "private/" + user_id + "/" + file["key"]
    logger.info(
        "Fetching image", bucket=os.environ["CHATBOT_FILES_BUCKET_NAME"], key=key
    )

    response = s3.Object(os.environ["CHATBOT_FILES_BUCKET_NAME"], key)

    # check if the file is pdf
    if file["key"].endswith(".pdf"):
        doc = response.get()["Body"].read()
        return [{
            "document": {
                "format": "pdf",
                "name": file_name,
                "source": {
                    "bytes": doc
                }
            }
        }]
    else:
        img = str(b64encode(response.get()["Body"].read()), "ascii")
        return [{
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": img,
            },
        }]


def to_base_messages(msg):
    if msg["role"] == "user":
        return HumanMessage(content=msg["content"])
    elif msg["role"] == "assistant":
        return AIMessage(content=msg["content"])
    else:
        raise Exception("Invalid message type")


class Claude3(MultiModalModelBase):
    model_id: str
    client: any

    def __init__(self, model_id: str):
        self.model_id = model_id
        self.client = get_bedrock_client()

    def format_prompt(
        self, prompt: str, messages: list, files: list, user_id: str
    ) -> str:
        prompts = []

        # Chat history
        for message in messages:
            if message.type.lower() == ChatbotMessageType.Human.value.lower():
                user_msg = {
                    "role": "user",
                    "content": [{"type": "text", "text": message.content}],
                }
                prompts.append(user_msg)
                message_files = message.additional_kwargs.get("files", [])
                for idx, message_file in enumerate(message_files):
                    user_msg["content"].extend(
                        get_image_message(message_file, user_id, f"history_file_{idx}"))
            if message.type.lower() == ChatbotMessageType.AI.value.lower():
                prompts.append({"role": "assistant", "content": message.content})

        # User prompt
        user_msg = {
            "role": "user",
            "content": [{"type": "text", "text": prompt}],
        }
        prompts.append(user_msg)
        for idx, file in enumerate(files):
            user_msg["content"].extend(get_image_message(
                file, user_id, f"session_file_{idx}"))

        return {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 512,
            "messages": prompts,
            "temperature": 0.3,
        }

    def handle_run(self, prompt: str, model_kwargs: dict):
        logger.info("Incoming request for claude", model_kwargs=model_kwargs)
        messages = [to_base_messages(msg) for msg in prompt["messages"]]
        logger.info("prompt messages", messages=messages)

        llm = ChatBedrockConverse(
            client=self.client,
            model=self.model_id,
            disable_streaming=True
        )
        if "temperature" in model_kwargs:
            llm.temperature = model_kwargs["temperature"]
        if "topP" in model_kwargs:
            llm.top_p = model_kwargs["topP"]
        if "maxTokens" in model_kwargs:
            llm.max_tokens = model_kwargs["maxTokens"]
        logger.info("Prompt", prompt=prompt)
        messages.insert(0, SystemMessage(get_system_prompt()))
        ai_message = llm.invoke(messages)

        return ai_message.content

    def clean_prompt(self, p) -> str:
        for m in p["messages"]:
            if m["role"] == "user" and type(m["content"]) == type([]):  # noqa: E721
                for c in m["content"]:
                    if "document" in c:
                        c["document"]["source"]["bytes"] = ""
                    elif c["type"] == "image":
                        c["source"]["data"] = ""
        return json.dumps(p)


registry.register(r"^bedrock.anthropic.claude-3.*", Claude3)
