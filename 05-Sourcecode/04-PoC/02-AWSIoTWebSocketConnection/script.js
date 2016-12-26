(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var awsConfiguration = {
   poolId: 'us-west-2:702dd19c-6b9e-4022-838c-136776efcc64', 
   region: 'us-west-2',
   credentialsAccessKeyId: '',
   credentialsSecretKey: '',
   credentialsSessionToken: ''   
};
module.exports = awsConfiguration;

},{}],2:[function(require,module,exports){

// Loading AWS' SDKs
var AWS = require('aws-sdk');
var AWSConfiguration = require('./aws-configuration.js');

// Authentication
AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWSConfiguration.poolId
  }),
  region: AWSConfiguration.region
});

// Services initialization
var AWSIoTData = require('aws-iot-device-sdk');
var Lambda = new AWS.Lambda({region: AWSConfiguration.region, apiVersion: '2015-03-31'});
var CognitoIdentity = new AWS.CognitoIdentity();
var MQTTClient;

AWS.config.credentials.get(function(err, data) {
   if (!err) {
      console.log('retrieved identity: ' + AWS.config.credentials.identityId);                  
      obtainCredentials();      
   } else {
      console.log('error retrieving identity:' + err);
   }
});

function obtainCredentials(){
	var params = {
	    IdentityId: AWS.config.credentials.identityId
	};
	CognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
		if (!err) {
	    	AWSConfiguration.credentialsAccessKeyId = data.Credentials.AccessKeyId;
	        AWSConfiguration.credentialsSecretKey = data.Credentials.SecretKey;
	        AWSConfiguration.credentialsSessionToken = data.Credentials.SessionToken;            
	        registerIoTThing();
	     } else {
	        console.log('error retrieving credentials: ' + err);
	        alert('error retrieving credentials: ' + err);
	     }
	}); 
}

// Call a lambda function to create a thing and attach the required certificate
function registerIoTThing(){
	var pullParams = {
		FunctionName : 'RVA_IoT_create_thing_function',
		InvocationType : 'RequestResponse',
		LogType: 'None',
		Payload: JSON.stringify({identityId: AWS.config.credentials.identityId})
	};

	Lambda.invoke(pullParams, function(error, data) {
	  	if (error) {
		    console.log(error);
		} else {
		    console.log(JSON.parse(data.Payload));
		    connectToIoT();
		}
	}); 
} 

function connectToIoT(){
	MQTTClient = AWSIoTData.device({
	   region: AWS.config.region,
	   clientId: AWS.config.credentials.identityId,
	   protocol: 'wss',	   
	   host: 'a38hzh4n6y7p5j.iot.us-west-2.amazonaws.com',
	   port: 443,
	   maximumReconnectTimeMs: 2000,
	   debug: true,
	   accessKeyId: AWSConfiguration.credentialsAccessKeyId,
	   secretKey: AWSConfiguration.credentialsSecretKey,
	   sessionToken: AWSConfiguration.credentialsSessionToken
	});

	//
	// Install connect/reconnect event handlers.
	//
	MQTTClient.on('connect', window.mqttClientConnectHandler);
	MQTTClient.on('reconnect', window.mqttClientReconnectHandler);
	MQTTClient.on('message', window.mqttClientMessageHandler);
}

//
// Connect handler; update div visibility and fetch latest shadow documents.
// Subscribe to lifecycle events on the first connect event.
//
window.mqttClientConnectHandler = function() {
   console.log('connect');
   //
   // Subscribe to our current topic.
   //
   MQTTClient.subscribe("private-topic/" + AWS.config.credentials.identityId);
   console.log("private-topic/" + AWS.config.credentials.identityId);
};

//
// Reconnect handler; update div visibility.
//
window.mqttClientReconnectHandler = function() {
   console.log('reconnect');   
};


//
// Message handler for lifecycle events; create/destroy divs as clients
// connect/disconnect.
//
window.mqttClientMessageHandler = function(topic, payload) {
   console.log('message: ' + topic + ':' + payload.toString());   
};


},{"./aws-configuration.js":1,"aws-iot-device-sdk":"aws-iot-device-sdk","aws-sdk":"aws-sdk"}]},{},[2]);
