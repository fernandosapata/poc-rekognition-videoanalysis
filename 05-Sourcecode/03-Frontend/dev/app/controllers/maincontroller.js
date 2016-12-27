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


//    carousel
    $scope.contents = [
        {'h1': 'Party',
        'p': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius odio a rhoncus cursus. Mauris gravida lorem diam!',
        'img': './app/img/party2.jpg'
        },
        {'h1': 'Friends',
        'p': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius odio a rhoncus cursus. Mauris gravida lorem diam!',
        'img': './app/img/friends.jpg'
        },
        {'h1': 'Marriage',
        'p': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius odio a rhoncus cursus. Mauris gravida lorem diam!',
        'img': 'https://cdn.colorlib.com/activello/wp-content/uploads/sites/10/2012/03/photo-1437915015400-137312b61975-1920x550.jpg'
        },
      ];
    $scope.currentIndex = 0;
    $scope.setCurrentSlideIndex = function (index) {
        $scope.currentIndex = index;
    };
    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };
}]);