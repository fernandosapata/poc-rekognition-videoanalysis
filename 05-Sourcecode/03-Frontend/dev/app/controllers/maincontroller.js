
var AWSIoTData = require('aws-iot-device-sdk');
var AWS = require('aws-sdk');

app.controller('rekognition', ['$scope', 'AWSIotWebsocket', 'AWSS3', function($scope, AWSIotWebsocket, AWSS3) {

    $scope.init = function(){
        //Usage of AWSIotWebsocket
        AWSIotWebsocket.init(
            function() {
               console.log('connect');
               AWSIotWebsocket.subscribeToPrivateTopic();
            },
            function() {
               console.log('reconnect');
            },
            function(topic, payload) {
                payload_string = payload.toString();
                console.log('message: ' + topic + ':' + payload_string);
                json = JSON.parse(payload_string);
                if(json.type == 'status'){
                    $scope.message = json.payload.message;
                    $scope.loading = json.payload.percentage;
                    $scope.$apply();
                }
            }
        );
        AWSIotWebsocket.setupWebSocket();
    }

    $scope.uploadFile = function(){
        $scope.loadingStart = true;
        //Usage of AWSS3
        AWSS3.init();
        AWSS3.uploadFile(
            document.getElementById('uploadFile'),
            "tmp/",
            function(err, data) {
                if (err) {
                    $scope.loadingStart = false;
                    return alert(err.message);
                }
            }
        );

    };
}]);