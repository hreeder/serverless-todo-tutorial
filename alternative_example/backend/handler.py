import boto3
import datetime
import json
import os
import time
import uuid

dynamodb = boto3.resource('dynamodb')


def get(event, context):
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    data = table.scan()
    body = {
        "items": data['Items']
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


def post(event, context):
    input_data = json.loads(event['body'])
    
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    item = {
        'id': str(uuid.uuid4()),
        'title': input_data['title'],
        'completed': False,
        'created_at': str(time.mktime(datetime.datetime.utcnow().timetuple()))
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

def put(event, context):
    item_id = event['pathParameters']['id']
    input_data = json.loads(event['body'])

    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    item = table.get_item(Key={"id": item_id})['Item']

    item.update(input_data)

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

def delete(event, context):
    item_id = event['pathParameters']['id']
    
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    item = table.delete_item(Key={"id": item_id})

    response = {
        "statusCode": 204,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True
        },
        "body": ""
    }

    return response
    
