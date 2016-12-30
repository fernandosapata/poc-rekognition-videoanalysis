import boto3
import os

client = boto3.client('iot')

def lambda_handler(event, context):

    identity_id = event["identityId"]

    #talk to David regarding this
    response = client.create_thing(
        thingName=identity_id,
        attributePayload={
            'attributes': {
                'identityId': identity_id
            },
            'merge': True
        }
    )

    response = client.attach_thing_principal(
        thingName=identity_id,
        principal=os.environ['principal']
    )

    return 'OK'
