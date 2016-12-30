#!/bin/bash -xe

cd /opt/poc-rekognition-videoanalysis/tmp
rm -Rf videos/* images/*

# Parameter section
FFMPEG_FRAMES_PER_SECOND=3
SQS_MAX_NUMBER_OF_MESSAGES=1
SQS_WAIT_TIME_SECONDS=2

# Constants section
EC2_AVAIL_ZONE=`curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone`
EC2_REGION="`echo \"$EC2_AVAIL_ZONE\" | sed -e 's:\([0-9][0-9]*\)[a-z]*\$:\\1:'`"
QUEUE_URL=$(aws sqs get-queue-url --queue-name "RVA-VIDEO-PROCESS-IN"  --region $EC2_REGION --output text)

while :
do
  	QUEUE_MESSAGE=$(aws sqs receive-message --queue-url $QUEUE_URL --region $EC2_REGION --max-number-of-messages $SQS_MAX_NUMBER_OF_MESSAGES --wait-time-seconds $SQS_WAIT_TIME_SECONDS --query "Messages[0].{Body:Body, ReceiptHandle:ReceiptHandle}")

  	if [ "$QUEUE_MESSAGE" != "null" ] ; then
  	    # Extract SQS meaningful values
  		BUCKET_NAME=$(echo $QUEUE_MESSAGE | jq -r '.Body | fromjson | .Message | fromjson | .Records[0].s3.bucket.name')
		OBJECT_KEY=$(echo $QUEUE_MESSAGE | jq -r '.Body | fromjson | .Message | fromjson | .Records[0].s3.object.key')
		RECEIPT_HANDLE=$(echo $QUEUE_MESSAGE | jq -r '.ReceiptHandle')

		# Update processing status before processing
		IOT_TOPIC=$(aws s3api head-object --bucket $BUCKET_NAME --key $OBJECT_KEY | jq -r '.Metadata.topic')
		aws lambda invoke --invocation-type Event --function-name RVA_IoT_publish_message_function --region $EC2_REGION --payload '{"topic": "$IOT_TOPIC", "type": "status", "payload": {"message": "Extracting frames from video", "percentage": 40}}' /dev/null

		# Create the required folder structure and download video from S3
		VIDEO_PATH=$(dirname $OBJECT_KEY)
		IMAGE_PATH=images/$(basename $(dirname $OBJECT_KEY))
		mkdir -p $VIDEO_PATH $IMAGE_PATH
		aws s3 cp s3://$BUCKET_NAME/$OBJECT_KEY $VIDEO_PATH/

		# Extract thumbnails from video and upload it back to S3
		ffmpeg -i $OBJECT_KEY -vf fps=$FFMPEG_FRAMES_PER_SECOND $IMAGE_PATH/output_%d.png

		# Update processing status after processing
		aws lambda invoke --invocation-type Event --function-name RVA_IoT_publish_message_function --region $EC2_REGION --payload '{"topic": "$IOT_TOPIC", "type": "status", "payload": {"message": "Analyzing frames", "percentage": 60}}' /dev/null

		aws s3 sync $IMAGE_PATH/ s3://$BUCKET_NAME/$IMAGE_PATH/

		# Clean up the mess
		aws sqs delete-message --queue-url $QUEUE_URL --receipt-handle $RECEIPT_HANDLE --region $EC2_REGION
		rm -Rf videos/* images/*
	else
		echo "[$(date +%Y-%m-%d:%H:%M:%S)] - No messages so far"
  	fi
done
