from __future__ import print_function

import json
import urllib
import boto3
import os

s3 = boto3.client('s3')

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))
    etag = urllib.unquote_plus(event['Records'][0]['s3']['object']['eTag'].encode('utf8'))
    path, filename = os.path.split(os.path.abspath(key))
    try:
        s3.copy_object(Bucket=bucket, Key=('videos/%s/%s' % (etag, filename)), CopySource={'Bucket': bucket, 'Key': key})
        s3.delete_object(Bucket=bucket, Key=key)
        return {'status' : 'OK'}
    except Exception as e:
        print(e)
        raise e
