#/bin/bash -xe

if [ $(whoami) != "root" ]; then
    echo "You must be root to execute this script file"
    exit 1
fi

# Install required dependencies
yum update -y
yum install -y jq git

# Download project
cd /tmp
rm -rf poc-rekognition-videoanalysis
git clone https://github.com/PauloMigAlmeida/poc-rekognition-videoanalysis.git

# install and configure ffmpeg
tar -xJf poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/dependencies/ffmpeg-git-64bit-static.tar.xz -C /opt/
ln -fs /opt/ffmpeg-git-20161225-64bit-static/ffmpeg /usr/bin/

# configure preprocess-service
mkdir -p /opt/poc-rekognition-videoanalysis/tmp/videos /opt/poc-rekognition-videoanalysis/tmp/images
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/opt/poc-rekognition-videoanalysis/preprocess-service.sh /opt/poc-rekognition-videoanalysis/
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/etc/init.d/preprocess-service /etc/init.d/

chmod 755 /opt/poc-rekognition-videoanalysis/preprocess-service.sh
chmod 755 /etc/init.d/preprocess-service

chkconfig preprocess-service on
