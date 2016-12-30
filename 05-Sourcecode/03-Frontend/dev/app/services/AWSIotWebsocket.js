app.service('AWSIotWebsocket', function() {
    // get service reference as 'this' has another meaning withing the function when using angularjs
    var self = this;

    // Loading AWS' SDKs
    var AWSIoTData = require('aws-iot-device-sdk');

    // Services
    var lambda;
    var cognitoIdentity;
    var mqttClient;

    // Callbacks
    var mqttClientConnectHandler, mqttClientReconnectHandler, mqttClientMessageHandler;

    this.init = function(mqttClientConnectHandler, mqttClientReconnectHandler, mqttClientMessageHandler){
        // Services initialization
        self.lambda = new AWS.Lambda({region: AWSConfiguration.region, apiVersion: '2015-03-31'});
        self.cognitoIdentity = new AWS.CognitoIdentity();

        // Callbacks initialization
        self.mqttClientConnectHandler = mqttClientConnectHandler;
        self.mqttClientReconnectHandler = mqttClientReconnectHandler;
        self.mqttClientMessageHandler = mqttClientMessageHandler;
    }

    this.obtainCredentials = function() {
        var params = {
            IdentityId: AWS.config.credentials.identityId
        };
        self.cognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
            if (!err) {
                AWSConfiguration.credentialsAccessKeyId = data.Credentials.AccessKeyId;
                AWSConfiguration.credentialsSecretKey = data.Credentials.SecretKey;
                AWSConfiguration.credentialsSessionToken = data.Credentials.SessionToken;
                self.connectToIoT();
            } else {
                console.log('error retrieving credentials: ' + err);
            }
        });
    };

    this.connectToIoT = function() {
        self.mqttClient = AWSIoTData.device({
            region: AWS.config.region,
            clientId: AWS.config.credentials.identityId,
            protocol: AWSConfiguration.protocol,
            host: AWSConfiguration.host,
            port: AWSConfiguration.port,
            maximumReconnectTimeMs: 2000,
            debug: false,
            accessKeyId: AWSConfiguration.credentialsAccessKeyId,
            secretKey: AWSConfiguration.credentialsSecretKey,
            sessionToken: AWSConfiguration.credentialsSessionToken
        });

        //
        // Install connect/reconnect event handlers.
        //
        self.mqttClient.on('connect', self.mqttClientConnectHandler);
        self.mqttClient.on('reconnect', self.mqttClientReconnectHandler);
        self.mqttClient.on('message', self.mqttClientMessageHandler);
    };

    this.subscribeToPrivateTopic = function(){
        self.mqttClient.subscribe("private-topic/" + AWS.config.credentials.identityId);
        console.log("private-topic/" + AWS.config.credentials.identityId);
    };

    this.setupWebSocket = function(x) {
        AWS.config.credentials.get(function(err, data) {
            if (!err) {
                console.log('retrieved identity: ' + AWS.config.credentials.identityId);
                self.obtainCredentials();
            } else {
                console.log('error retrieving identity:' + err);
            }
        });
    };


});