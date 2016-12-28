
var AWSIoTData = require('aws-iot-device-sdk');
var AWS = require('aws-sdk');

app.controller('rekognition', ['$scope', 'AWSIotWebsocket', 'AWSS3', function($scope, AWSIotWebsocket, AWSS3) {

    $scope.uploadFile = function(){
        $scope.loadingStart = true;
        //Usage of AWSS3
        AWSS3.init();
        AWSS3.uploadFile(
            document.getElementById('uploadFile'),
            "test/",
            function(err, data) {
                if (err) {
                  return alert('There was an error uploading your file: ', err.message);
                }
//                alert('Successfully uploaded file.');
                $scope.loading =  20;
                $scope.message = "Successfully uploaded video";
                $scope.$apply();
            }
        );

        //Usage of AWSIotWebsocket
        AWSIotWebsocket.init(
            function() {
               console.log('connect');
               //
               // Subscribe to our current topic.
               //
               AWSIotWebsocket.subscribeToPrivateTopic();
            },
            function() {
               console.log('reconnect');
            },
            function(topic, payload) {
                console.log('message: ' + topic + ':' + payload.toString());
                var data = {status: []},
                string = payload.toString(),
                json = JSON.parse(string),
                push = data.status.push(json);
                $scope.message = data.status[0].message;
                $scope.loading = data.status[0].percentage;
                $scope.$apply();
            }
        );
        AWSIotWebsocket.setupWebSocket();
    };
}]);