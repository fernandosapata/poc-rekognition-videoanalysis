from __future__ import print_function

import json
import urllib
import boto3
import os

s3 = boto3.resource('s3')
lambda_client = boto3.client('lambda', region_name='us-west-2')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))
    etag = urllib.unquote_plus(event['Records'][0]['s3']['object']['eTag'].encode('utf8'))
    path, filename = os.path.split(os.path.abspath(key))
    extension = os.path.splitext(filename)[1]
    try:
        s3_object = s3.Object(bucket, key)
        s3.meta.client.copy_object(
            Bucket=bucket, Key=('videos/%s/video%s' % (etag, extension)),
            CopySource={'Bucket': bucket, 'Key': key}, MetadataDirective = 'COPY')
        lambda_client.invoke(
            FunctionName='RVA_IoT_publish_message_function',
            InvocationType='Event',
            LogType='None',
            Payload=json.dumps({
                'topic': s3_object.metadata['topic'],
                'type': 'status',
                'payload': {'message': 'Upload completed', 'percentage': 20}
            })
        )
        s3.meta.client.delete_object(Bucket=bucket, Key=key)
        return {'status' : 'OK'}
    except Exception as e:
        print(e)
        raise e
