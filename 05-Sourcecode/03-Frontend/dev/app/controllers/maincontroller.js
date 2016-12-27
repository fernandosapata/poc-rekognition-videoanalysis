AWS.config.update({
  region: 'us-west-2',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-west-2:702dd19c-6b9e-4022-838c-136776efcc64'
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: "poc-rekognition-video"}
});

// Angular
var app = angular.module('rekognition',[]);

app.controller('rekognition', ['$scope', function($scope) {

    $scope.uploadFile = function(){
    	var files = document.getElementById('uploadFile').files;
    	if(!files.length) return alert('Please choose a file to upload first.');

    	var file = files[0];
      	$scope.loadingStart = true;
      	$scope.loading = 0;
      	var fileName = file.name;
        $scope.loading = 30;
      	s3.upload({
    	    Key: 'test/' + fileName,
    	    Body: file,
    	    ACL: 'public-read'
    	  }, function(err, data) {
    		    if (err) {
    		      return alert('There was an error uploading your file: ', err.message);
    		    }
    		    else{
    		    alert('Successfully uploaded file.');
    		    $scope.loading = 100;
    		    }
    		}
    	);
    };
}]);