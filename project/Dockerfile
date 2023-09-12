# Start the image with alpine 3.13
FROM debian:buster
# Getting nginx end Tsl (openssl for it)
RUN apt update; apt install curl -y; curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -; apt install -y nodejs;
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN npm install -g npm
RUN apt install postgresql-client -y

RUN mkdir /root/Back /root/Front
COPY Front /root/Front/
COPY SRCS/* /root/Back/
WORKDIR /root/Back

RUN npm install -g @nestjs/cli
RUN npm install @nestjs/common @nestjs/websockets
RUN npm install @nestjs/platform-socket.io

# EXPOSE	443
ENTRYPOINT ["npm", "run", "start:dev"]
