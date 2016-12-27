app.service('AWSS3', function() {
    // get service reference as 'this' has another meaning withing the function when using angularjs
    var self = this;

    // Services
    var s3;

    this.init = function(){
        self.s3 = new AWS.S3({apiVersion: '2006-03-01', params: {Bucket: AWSConfiguration.bucket}});
    };

    this.uploadFile = function(inputFileElement, prefix, callback){
        var files = inputFileElement.files;
        if(!files.length) return alert('Please choose a file to upload first.');

        var file = files[0];
        var fileName = file.name;

        self.s3.upload({
            Key: prefix + fileName,
            Body: file
          }, callback);
    };

});