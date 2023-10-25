# Start the image with alpine 3.13
FROM debian:buster
# Getting nginx end Tsl (openssl for it)
RUN apt update; apt install curl -y; curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -; apt install -y nodejs;
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN npm install -g npm

RUN mkdir /root/React
COPY . /root/React
COPY init.sh /root/React
WORKDIR /root/React

RUN apt install openssl -y
RUN mkdir -p /etc/ssl_volume
# RUN npm install react-scripts

EXPOSE 3000

# ENTRYPOINT ["npm", "start"]
ENTRYPOINT [ "sh", "init.sh"]
# ENTRYPOINT ["sleep", "1000000000000"]
