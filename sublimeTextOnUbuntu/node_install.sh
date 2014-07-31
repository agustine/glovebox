apt-get -y install python 
apt-get -y install build-essential 
apt-get -y install gcc 
apt-get -y install g++ 
apt-get -y install curl
tar -zxf node-v0.10.29.tar.gz 
cd node-v0.10.29
./configure –prefix=/usr/node 
make -j 5
make install 
curl -L https://npmjs.org/install.sh | sh
