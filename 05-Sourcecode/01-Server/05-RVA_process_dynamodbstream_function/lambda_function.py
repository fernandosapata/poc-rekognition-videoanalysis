from __future__ import print_function

import json
import boto3

print('Loading function')

lambda_client = boto3.client('lambda', region_name='us-west-2')
dynamodb_client = boto3.resource('dynamodb')
videos_results_table = dynamodb_client.Table('RVA_VIDEOS_RESULTS_TABLE')


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event))
    initial_percentage=60.0
    final_percentage=90.0

    results_array=[]

    for record in event['Records']:
        row = record['dynamodb']['NewImage']
        iot_topic=row['Topic']['S']

        # Check if we have already seen this iot topic to make sure we won't mess with other simutaneous process.
        element = None
        for v in results_array:
            if v['iot_topic'] == iot_topic:
                element = v
                break
        if element is None:
            element = {'iot_topic':iot_topic, 'number_of_items':0, 'max_completed_items':0}
            results_array.append(element)

        local_sum=0
        part_dict=row['Parts']['M']
        element['number_of_items']=len(part_dict)
        for key, value in part_dict.iteritems():
            if value['S'] == "COMPLETED":
                local_sum+=1
        if local_sum > element['max_completed_items']:
            element['max_completed_items'] = local_sum

        if element['max_completed_items'] == 0:
            #  it means this is a fresh record
            videos_results_table.put_item(Item={
                'Identifier': row['Identifier']['S'],
                'FaceDetails': {
                    'Smile' : {'Positive': 0, 'Negative': 0},
                    'Eyeglasses' : {'Positive': 0, 'Negative': 0},
                    'Sunglasses' : {'Positive': 0, 'Negative': 0},
                    'Gender' : {'Male': 0, 'Female': 0},
                    'Beard' : {'Positive': 0, 'Negative': 0},
                    'Mustache' : {'Positive': 0, 'Negative': 0},
                    'EyesOpen' : {'Positive': 0, 'Negative': 0},
                    'MouthOpen' : {'Positive': 0, 'Negative': 0},
                    'Emotions' : {'HAPPY': 0, 'SAD': 0, 'ANGRY': 0, 'DISGUSTED': 0, 'CONFUSED': 0, 'SURPRISED': 0}
                }
            })

    for element in results_array:
        calculated_value = int(round(initial_percentage + (((final_percentage-initial_percentage)/element['number_of_items'])*element['max_completed_items'])))
        print("iot_topic:%s - %d" % (element['iot_topic'], calculated_value))
        lambda_client.invoke(
            FunctionName='RVA_IoT_publish_message_function',
            InvocationType='Event',
            LogType='None',
            Payload=json.dumps({
                'topic': element['iot_topic'],
                'type': 'status',
                'payload': {'message': 'Analyzing frames', 'percentage': calculated_value}
            })
        )
    return 'Successfully processed {} records.'.format(len(event['Records']))
