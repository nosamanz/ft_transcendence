# Start the image with alpine 3.13
FROM debian:buster
# Getting nginx end Tsl (openssl for it)
RUN apt update; apt install curl -y; curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -; apt install -y nodejs;
RUN apt install gcc -y
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN npm install -g npm
RUN apt install postgresql-client -y

RUN mkdir -p /etc/ssl_volume

RUN mkdir /root/Nestjs
COPY . /root/Nestjs/
WORKDIR /root/Nestjs/

RUN npm install -g @nestjs/cli
RUN npm install @nestjs/common @nestjs/websockets
RUN npm install @nestjs/platform-socket.io

RUN npm install -g prisma
RUN prisma generate

RUN gcc run.c -o run

# EXPOSE is just for inform the reader that ı use for that docker container port 80
# it is actually can be seen in "docker inspect [image]" as a port
EXPOSE	80
ENTRYPOINT ["./run"]
# ENTRYPOINT ["sleep", "1000000000"]
