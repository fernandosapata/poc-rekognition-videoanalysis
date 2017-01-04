#!/bin/bash -xe

cd /opt/poc-rekognition-videoanalysis/tmp
rm -Rf videos/* images/*

# Parameter section
FFMPEG_FRAMES_PER_SECOND=1/3
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
		aws lambda invoke --invocation-type Event --function-name RVA_IoT_publish_message_function --region $EC2_REGION --payload "{\"topic\": \"$IOT_TOPIC\", \"type\": \"status\", \"payload\": {\"message\": \"Extracting frames from video\", \"percentage\": 40}}" /dev/null

		# Create the required folder structure and download video from S3
		FILE_IDENTIFIER=$(basename $(dirname $OBJECT_KEY))
		VIDEO_PATH=$(dirname $OBJECT_KEY)
		IMAGE_PATH=images/$FILE_IDENTIFIER
		mkdir -p $VIDEO_PATH $IMAGE_PATH
		aws s3 cp s3://$BUCKET_NAME/$OBJECT_KEY $VIDEO_PATH/

		# Extract thumbnails from video and upload it back to S3
		ffmpeg -i $OBJECT_KEY -vf fps=$FFMPEG_FRAMES_PER_SECOND $IMAGE_PATH/output_%d.png

		# Update processing status after processing
		aws lambda invoke --invocation-type Event --function-name RVA_IoT_publish_message_function --region $EC2_REGION --payload "{\"topic\": \"$IOT_TOPIC\", \"type\": \"status\", \"payload\": {\"message\": \"Uploading frames\", \"percentage\": 50}}" /dev/null

		LIST_OF_IMAGES=( $(find $IMAGE_PATH -maxdepth 1 -type f) )
		FILE_COUNTER=0
		SUBSET_OF_IMAGES=''
		for IDX in `seq 0 $((${#LIST_OF_IMAGES[@]}-1))`
		do						
			# Check whether or not this frame contains a face to avoid calling rekognition in vain
			if facedetect --data-dir "/usr/local/share/OpenCV/" -q "${LIST_OF_IMAGES[$IDX]}"; then
			    SUBSET_OF_IMAGES="$SUBSET_OF_IMAGES ${LIST_OF_IMAGES[$IDX]}"
			    FILE_COUNTER=$((FILE_COUNTER+1))
			    
			    if [[ "$FILE_COUNTER" -eq 10 ]] || [[ "$IDX" -eq $((${#LIST_OF_IMAGES[@]}-1)) ]]
			    then
			        INVENTORY_FILENAME="$(date +%s%N | md5sum | awk '{print $1}').txt"
			        echo $SUBSET_OF_IMAGES > "$IMAGE_PATH/$INVENTORY_FILENAME"
			        SUBSET_OF_IMAGES=''
			        FILE_COUNTER=0
			    fi
			else
			    rm -f ${LIST_OF_IMAGES[$IDX]}
			fi
		done

		# Generating process item which will be put into DynamoDB in order to keep track of the process
		DYNAMODB_PAYLOAD=$(mktemp --suffix "dynamodb.json")
		echo "{\"Identifier\" : {\"S\": \"$FILE_IDENTIFIER\"}, \"Status\" : {\"S\": \"PROCESSING\"}, \"Topic\" : {\"S\": \"$IOT_TOPIC\"}, \"Parts\" : {\"M\":{" >> $DYNAMODB_PAYLOAD
		LIST_OF_BATCHES=( $(find $IMAGE_PATH -maxdepth 1 -type f -name *.txt) )
		for IDX in `seq 0 $((${#LIST_OF_BATCHES[@]}-1))`
		do
		    echo "\"${LIST_OF_BATCHES[$IDX]}\" : {\"S\": \"PROCESSING\"}" >> $DYNAMODB_PAYLOAD
			if [[ "$IDX" -ne $((${#LIST_OF_BATCHES[@]}-1)) ]]
			then
		    	    echo "," >> $DYNAMODB_PAYLOAD
			fi
		done
		echo '}}}' >> $DYNAMODB_PAYLOAD
		aws dynamodb put-item --table-name RVA_PROCESS_TABLE --item file://$DYNAMODB_PAYLOAD --return-consumed-capacity TOTAL --region $EC2_REGION

        # Make sure we have uploaded all images before the inventory files due to lambda invocation
		aws s3 sync $IMAGE_PATH/ s3://$BUCKET_NAME/$IMAGE_PATH/ --exclude "*.txt"
		aws s3 sync $IMAGE_PATH/ s3://$BUCKET_NAME/$IMAGE_PATH/ --exclude "*.png"

        # Update processing status after processing
		aws lambda invoke --invocation-type Event --function-name RVA_IoT_publish_message_function --region $EC2_REGION --payload "{\"topic\": \"$IOT_TOPIC\", \"type\": \"status\", \"payload\": {\"message\": \"Analyzing frames\", \"percentage\": 60}}" /dev/null

		# Clean up the mess
		aws sqs delete-message --queue-url $QUEUE_URL --receipt-handle $RECEIPT_HANDLE --region $EC2_REGION
		rm -Rf videos/* images/* $DYNAMODB_PAYLOAD
	else
		echo "[$(date +%Y-%m-%d:%H:%M:%S)] - No messages so far"
  	fi
done

#{
#  "Type": "Notification",
#  "MessageId": "819171ca-adeb-5175-a1d9-212ecd7ac525",
#  "TopicArn": "arn:aws:sns:us-west-2:603806363984:RVA_ENQUEUE_FILE_TOPIC",
#  "Subject": "Amazon S3 Notification",
#  "Message": "{\"Records\":[{\"eventVersion\":\"2.0\",\"eventSource\":\"aws:s3\",\"awsRegion\":\"us-west-2\",\"eventTime\":\"2017-01-02T14:06:09.579Z\",\"eventName\":\"ObjectCreated:Copy\",\"userIdentity\":{\"principalId\":\"AWS:AROAIUSK3EOFDIEH2JQ2C:RVA_preprocess_file_function\"},\"requestParameters\":{\"sourceIPAddress\":\"54.218.39.202\"},\"responseElements\":{\"x-amz-request-id\":\"AAAAF8BAFC738C9E\",\"x-amz-id-2\":\"S/XXjvFVriDfh8k6c/bmbkOgIFhoEgxUzik/jHzVUNC22IvqDo2jORsahfYfiZYh9FPCGzOfKZU=\"},\"s3\":{\"s3SchemaVersion\":\"1.0\",\"configurationId\":\"4cf0131d-e63d-4062-895d-ce467018e87a\",\"bucket\":{\"name\":\"poc-rekognition-video\",\"ownerIdentity\":{\"principalId\":\"A29QYEKP7C64KV\"},\"arn\":\"arn:aws:s3:::poc-rekognition-video\"},\"object\":{\"key\":\"videos/323c7c0416b3499d1a046c8d639fa980-9/credibilit_party.mp4\",\"size\":42165907,\"sequencer\":\"00586A5E4F9D47BA68\"}}}]}",
#  "Timestamp": "2017-01-02T14:06:09.660Z",
#  "SignatureVersion": "1",
#  "Signature": "B39Hm7WkvE01ai8QzRxP1c4LSuSmHEW3xAl4HcfhCk8af71FtOamUcjtP1F0s71/F3q75huuthZ5dJrr41qsWUfTW5enjHUmn9svtodgPPqRHeS4R5jhOd46sY66xPl0hiCumV4O+QeIuvAuRWKaMb3RypqWVI1/q+zxWPwv2TH+h9uSSMEdbQhzUDykIEOPNPrTbRpypzUI3Hr918bXj4wu6ZB/2GrY+wNfp9Cnwjl+tJ2LczoNBC31Dbu8KmmwKyjD+gJNjjK4nzf+m4gfpTpKr/Cx1utVN3mPVyfd99slQbreg5eY+eYd41rr7Ho4Bam6yzBRIvMOjifaov3/dA==",
#  "SigningCertURL": "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-b95095beb82e8f6a046b3aafc7f4149a.pem",
#  "UnsubscribeURL": "https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:603806363984:RVA_ENQUEUE_FILE_TOPIC:14dabe1d-d6c6-41bd-a8f3-a19b2b07d50f"
#}
