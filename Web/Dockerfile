FROM node:latest
COPY . /usr/app
WORKDIR /usr/app
RUN yarn install
RUN mkdir -p /release
RUN ln -s /release/client.apk /usr/app/public/client.apk