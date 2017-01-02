from __future__ import print_function

import json
import boto3

print('Loading function')

lambda_client = boto3.client('lambda', region_name='us-west-2')

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event))
    initial_percentage=60.0
    final_percentage=90.0
    number_of_items=0
    max_completed_items=0
    iot_topic=''

    for record in event['Records']:
        row = record['dynamodb']['NewImage']
        iot_topic=row['Topic']['S']
        local_sum=0
        part_dict=row['Parts']['M']
        number_of_items=len(part_dict)
        for key, value in part_dict.iteritems():
            if value['S'] == "COMPLETED":
                local_sum+=1
        if local_sum > max_completed_items:
            max_completed_items = local_sum

    calculated_value = int(round(initial_percentage + (((final_percentage-initial_percentage)/number_of_items)*max_completed_items)))
    #print("I should update the frontend with the following value: %d" % calculated_value)
    lambda_client.invoke(
        FunctionName='RVA_IoT_publish_message_function',
        InvocationType='Event',
        LogType='None',
        Payload=json.dumps({
            'topic': iot_topic,
            'type': 'status',
            'payload': {'message': 'Analyzing frames', 'percentage': calculated_value}
        })
    )
    return 'Successfully processed {} records.'.format(len(event['Records']))
