#/bin/bash -xe

# Install required dependencies
yum update -y
yum install -y jq git

# Download project
cd /tmp
git clone https://github.com/PauloMigAlmeida/poc-rekognition-videoanalysis.git

# install and configure ffmpeg
tar -xJf poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/dependencies/ffmpeg-git-64bit-static.tar.xz -C /opt/
ln -s /opt/ffmpeg-git-20161225-64bit-static/ffmpeg /usr/local/bin/

# configure preprocess-service
mkdir -p /opt/poc-rekognition-videoanalysis/tmp/videos /opt/poc-rekognition-videoanalysis/tmp/images
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/opt/poc-rekognition-videoanalysis/preprocess-service.sh /opt/poc-rekognition-videoanalysis/
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/etc/init.d/preprocess-service /etc/init.d/
chkconfig preprocess-service on
