import boto3
import json
import os
import uuid

dynamodb = boto3.resource('dynamodb')


def post(event, context):
    input_data = json.loads(event['body'])
    
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    item = {
        'id': str(uuid.uuid4()),
        'text': input_data['item']
    }

    table.put_item(Item=item)

    # Response
    body = {
        "input": input_data,
        "item": item
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
