// AWS config
var AWSConfiguration = {
   // AWS Cognito related
   poolId: 'us-west-2:702dd19c-6b9e-4022-838c-136776efcc64',
   region: 'us-west-2',
   // AWS S3 related
   bucket: 'poc-rekognition-video',
   // AWS IoT related
   credentialsAccessKeyId: '',
   credentialsSecretKey: '',
   credentialsSessionToken: '',
   protocol: 'wss',
   host: 'a38hzh4n6y7p5j.iot.us-west-2.amazonaws.com',
   port: 443,
   // WebSocket communication
   privateTopic: ''
};

// Authentication
var AWS = require('aws-sdk');

AWS.config.update({
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: AWSConfiguration.poolId
    }),
    region: AWSConfiguration.region
});

// Angular
var app = angular.module('rekognition',[]);