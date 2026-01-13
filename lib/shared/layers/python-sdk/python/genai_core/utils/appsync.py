import json
import os
from urllib.parse import urlparse
import boto3
from botocore.awsrequest import AWSRequest
from botocore.auth import SigV4Auth
from aws_lambda_powertools import Logger, Tracer
import requests
import datetime

logger = Logger()
tracer = Tracer()
session = boto3.Session()

AWS_REGION = os.environ["AWS_REGION"]
APPSYNC_ENDPOINT = os.environ["APPSYNC_ENDPOINT"]


def query(user_id, session_id, data_object):
    # Convert to JSON string
    data_json = json.dumps(data_object, ensure_ascii=True, separators=(",", ":"))

    return (
        {"sessionId": session_id, "userId": user_id, "data": data_json},
        """mutation PublishResponse($sessionId: String, $userId: String, $data: String) {
            publishResponse(
                sessionId: $sessionId,
                userId: $userId,
                data: $data
            ) {
                data
                sessionId
                userId
            }
        }""",
    )


@tracer.capture_method
def direct_send_to_client(data):
    logger.debug("Received message to send to client", data=data)
    (query_vaiables, query_string) = query(
        user_id=data["userId"],
        session_id=data["data"]["sessionId"],
        data_object=data,
    )
    method = "POST"
    service = "appsync"
    url = APPSYNC_ENDPOINT
    region = AWS_REGION
    host = urlparse(APPSYNC_ENDPOINT).netloc

    # Create the request with the current timestamp
    request = AWSRequest(
        method, url, headers={"Host": host, "Content-Type": "application/json"}
    )

    # Set the timestamp in the request context
    request.context["timestamp"] = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    # Get the SigV4 signer
    signer = SigV4Auth(session.get_credentials(), service, region)

    # Add logging before signing
    payload = json.dumps({"query": query_string.strip(), "variables": query_vaiables})
    request.data = payload.encode("utf-8")

    # Add auth headers
    signer.add_auth(request)

    try:
        response = requests.request(
            method,
            url,
            headers=dict(request.headers),
            data=payload,
            timeout=5,
        )
        logger.debug("Request URL", url=url)
        logger.debug("Request Payload", payload=payload)
        logger.debug("Response Status", status=response.status_code)
        logger.debug("Response Body", body=json.loads(response.content.decode("utf-8")))

        if response.status_code != 200:
            logger.error("Error Response Headers", headers=response.headers)
            logger.error(
                "Error Response Body",
                query_string=query_string,
                response=json.loads(response.content.decode("utf-8")),
            )

        return response
    except Exception as e:
        logger.error(f"Error: {e}")
        raise
