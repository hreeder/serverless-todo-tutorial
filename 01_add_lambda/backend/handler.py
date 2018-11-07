import json


def post(event, context):
    input_data = json.loads(event['body'])

    body = {
        "input": input_data
    }

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True
        },
        "body": json.dumps(body)
    }

    return response
