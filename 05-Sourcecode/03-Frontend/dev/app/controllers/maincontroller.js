var app = angular.module('rekognition',[]);

app.controller('upload', ['$scope', function($scope) {
  $scope.uploadFile = function(files) {
      var fd = new FormData();
      fd.append("file", files[0]);

      $http.post(uploadUrl, fd, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
      }).success("right").error( "error" );
  };
}]);