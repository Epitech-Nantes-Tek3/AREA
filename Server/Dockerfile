# syntax=docker/dockerfile:1
FROM node:latest
COPY . /usr/app
WORKDIR /usr/app
RUN npm install --quiet -g npm@9.3.0

# FROM itporbit/react-native-android
# WORKDIR /Application
# RUN apk add --no-cache yarn musl-dev linux-headers
# CMD ["yarn", "install"]