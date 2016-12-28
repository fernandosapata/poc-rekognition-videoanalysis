import boto3

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
        principal='arn:aws:iot:us-west-2:603806363984:cert/ccc8208ca5963c3fadbe86d58805b084cd3e6f64ae9c95894fe9ba97e8dbb832'
    )

    return 'OK'