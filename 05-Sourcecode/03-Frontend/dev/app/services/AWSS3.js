app.service('AWSS3', function() {
    // get service reference as 'this' has another meaning withing the function when using angularjs
    var self = this;

    // Services
    var s3;

    this.init = function(){
        self.s3 = new AWS.S3({apiVersion: '2006-03-01', params: {Bucket: AWSConfiguration.bucket, useDualstack: true}});
    };

    this.uploadFile = function(inputFileElement, prefix, callback){
        var files = inputFileElement.files;
        if(!files.length) {
            alert('Please choose a file to upload first.');
            return;
        }

        var file = files[0];
        var fileName = file.name;

        if(!fileName.toLowerCase().endsWith(AWSConfiguration.fileExtension)){
            return callback({'message':'At this time only ' + AWSConfiguration.fileExtension + ' video files are accepted'});
        }

        if(file.size > AWSConfiguration.fileUploadLimit){
            return callback({'message':'Please choose a file smaller than 100 megabytes.'});
        }

        self.s3.upload({
            Key: prefix + fileName,
            Body: file,
            Metadata: {
                topic: AWSConfiguration.privateTopic
            }
          }, callback);
    };

});