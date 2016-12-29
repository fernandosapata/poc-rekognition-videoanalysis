import paho.mqtt.client as paho
import os
import tempfile
import ssl
import boto3

# Constants section
AWS_IOT_ENDPOINT = os.environ['AWS_IOT_ENDPOINT']
AWS_IOT_PORT = os.environ['AWS_IOT_PORT']
AWS_IOT_CERTIFICATE_BUCKET = os.environ['AWS_IOT_CERTIFICATE_BUCKET']
AWS_IOT_CERTIFICATE_CA_KEYNAME = os.environ['AWS_IOT_CERTIFICATE_CA_KEYNAME']
AWS_IOT_CERTIFICATE_PUBLIC_KEYNAME = os.environ['AWS_IOT_CERTIFICATE_PUBLIC_KEYNAME']
AWS_IOT_CERTIFICATE_PRIVATE_KEYNAME = os.environ['AWS_IOT_CERTIFICATE_PRIVATE_KEYNAME']

# Flow variables section
conn_flag = False

def get_filename(keyname):
    path, filename = os.path.split(os.path.abspath(keyname))
    return '%s/%s' % (tempfile.gettempdir(), filename)

# Services declaration
s3 = boto3.resource('s3')
s3.meta.client.download_file(AWS_IOT_CERTIFICATE_BUCKET, AWS_IOT_CERTIFICATE_CA_KEYNAME, get_filename(AWS_IOT_CERTIFICATE_CA_KEYNAME))
s3.meta.client.download_file(AWS_IOT_CERTIFICATE_BUCKET, AWS_IOT_CERTIFICATE_PUBLIC_KEYNAME, get_filename(AWS_IOT_CERTIFICATE_PUBLIC_KEYNAME))
s3.meta.client.download_file(AWS_IOT_CERTIFICATE_BUCKET, AWS_IOT_CERTIFICATE_PRIVATE_KEYNAME, get_filename(AWS_IOT_CERTIFICATE_PRIVATE_KEYNAME))


def on_connect(client, userdata, flags, rc):
    global conn_flag
    conn_flag = True
    print("Connection returned result: " + str(rc) )

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

# MQTT connection section
mqttc = paho.Client()
mqttc.on_connect = on_connect
mqttc.on_message = on_message
mqttc.tls_set(AWS_IOT_CERTIFICATE_CA_KEYNAME, certfile=AWS_IOT_CERTIFICATE_PUBLIC_KEYNAME,
              keyfile=AWS_IOT_CERTIFICATE_PRIVATE_KEYNAME, cert_reqs=ssl.CERT_REQUIRED,
              tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)
mqttc.connect(AWS_IOT_ENDPOINT, AWS_IOT_PORT, keepalive=60)
mqttc.loop_start()


def lambda_handler(event, context):
    topic = event["topic"]

    if conn_flag == True:
        mqttc.publish(topic, "message_to_publish", qos=1)
        print("message sent: payload: " + "message_to_publish")
    else:
        print("waiting for connection...")

    return 'OK'

if __name__ == '__main__':
    lambda_handler({'topic': 'private-topic/us-west-2:7cf0c5d4-bf1d-4366-8ef3-6719b608634b'}, None)