#/bin/bash -xe

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
  		BUCKET_NAME=$(echo $QUEUE_MESSAGE | jq -r '.Body | fromjson | .Records[0].s3.bucket.name')
		OBJECT_KEY=$(echo $QUEUE_MESSAGE | jq -r '.Body | fromjson | .Records[0].s3.object.key')
		RECEIPT_HANDLE=$(echo $QUEUE_MESSAGE | jq -r '.ReceiptHandle')
		VIDEO_PATH=$(dirname $OBJECT_KEY)
		IMAGE_PATH=images/$(basename $(dirname $OBJECT_KEY))
		mkdir -p $VIDEO_PATH $IMAGE_PATH
		aws s3 cp s3://$BUCKET_NAME/$OBJECT_KEY $VIDEO_PATH/
		ffmpeg -i $OBJECT_KEY -vf fps=$FFMPEG_FRAMES_PER_SECOND $IMAGE_PATH/output_%d.png
		aws s3 sync $IMAGE_PATH/ s3://$BUCKET_NAME/$IMAGE_PATH/
		aws sqs delete-message --queue-url $QUEUE_URL --receipt-handle $RECEIPT_HANDLE --region $EC2_REGION
		rm -Rf videos/* images/*
	else
		echo "[$(date +%Y-%m-%d:%H:%M:%S)] - No messages so far"
  	fi	
done	
