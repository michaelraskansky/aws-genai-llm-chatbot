import json
import os

import boto3

from genai_core.utils.appsync import direct_send_to_client
from genai_core.types import ChatbotAction
from ..types import Direction

sns = boto3.client("sns")

topic_arn = os.environ["MESSAGES_TOPIC_ARN"]
direct = True if "DIRECT_SEND" in os.environ else False


def send_to_client(detail, topic_arn=None):
    if "direction" not in detail:
        detail["direction"] = Direction.OUT.value

    if not topic_arn:
        topic_arn = os.environ["MESSAGES_TOPIC_ARN"]

    if direct and detail["action"] == ChatbotAction.LLM_NEW_TOKEN.value:
        direct_send_to_client(detail)
    else:
        sns.publish(
            TopicArn=topic_arn,
            Message=json.dumps(detail),
        )
