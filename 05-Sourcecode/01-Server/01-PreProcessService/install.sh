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
git clone --depth=1 https://github.com/PauloMigAlmeida/poc-rekognition-videoanalysis.git

# install and configure ffmpeg
tar -xJf poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/dependencies/ffmpeg-git-64bit-static.tar.xz -C /opt/
ln -fs /opt/ffmpeg-git-20161225-64bit-static/ffmpeg /usr/bin/

# Install preprocess-service
mkdir -p /opt/poc-rekognition-videoanalysis/tmp/videos /opt/poc-rekognition-videoanalysis/tmp/images
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/opt/poc-rekognition-videoanalysis/preprocess-service.sh /opt/poc-rekognition-videoanalysis/
chmod 755 /opt/poc-rekognition-videoanalysis/preprocess-service.sh

# Install opencv
yum install -y python27-numpy git cmake gcc-c++
cd /tmp
git clone https://github.com/Itseez/opencv.git --depth=1
cd opencv/
cmake .
make
sudo make install
cd ..
rm -Rf /tmp/opencv
ln -s /usr/local/lib/python2.7/dist-packages/cv2.so /usr/lib/python2.7/dist-packages/

# Install facedetect
cd /tmp
git clone https://github.com/PauloMigAlmeida/facedetect.git --depth=1
cd facedetect
cp facedetect /usr/bin
cd ..
rm -Rf /tmp/facedetect
chmod 755 /usr/bin/facedetect


# Install and configure supervisord
easy_install supervisor
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/etc/supervisord.conf /etc/supervisord.conf
mv poc-rekognition-videoanalysis/05-Sourcecode/01-Server/01-PreProcessService/etc/init.d/supervisor /etc/init.d/
chmod 755 /etc/init.d/supervisor
chkconfig --add supervisor
chkconfig supervisor on
service supervisor start
