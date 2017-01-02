from __future__ import print_function

import json
import urllib
import boto3
import os

s3 = boto3.resource('s3')
lambda_client = boto3.client('lambda', region_name='us-west-2')

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    records = json.loads(event['Records'][0]['Sns']['Message'])
    bucket = records['Records'][0]['s3']['bucket']['name']
    key = urllib.unquote_plus(records['Records'][0]['s3']['object']['key'].encode('utf8'))
    try:
        s3_object = s3.Object(bucket, key)
        lambda_client.invoke(
            FunctionName='RVA_IoT_publish_message_function',
            InvocationType='Event',
            LogType='None',
            Payload=json.dumps({
                'topic': s3_object.metadata['topic'],
                'type': 'status',
                'payload': {'message': 'file has been enqueued', 'percentage': 30}
            })
        )
        return {'status' : 'OK'}
    except Exception as e:
        print(e)
        raise e
