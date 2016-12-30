import boto3
import json

# Services declaration
s3 = boto3.resource('s3')
iot_data = boto3.client('iot-data', region_name='us-west-2')

def lambda_handler(event, context):
    topic = event["topic"]
    payload = {"type": event['type'], 'payload': event['payload']}
    response = iot_data.publish(
        topic=topic,
        qos=1,
        payload=json.dumps(payload)
    )
    print response
    return 'OK'

if __name__ == '__main__':
    from random import randint
    lambda_handler({
        'topic': 'private-topic/us-west-2:...',
        'type': 'status',
        'payload': {
            "message": "Testando 124",
            "percentage": randint(0,100)
        }
    }, None)