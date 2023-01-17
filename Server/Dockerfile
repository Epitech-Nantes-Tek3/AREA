# syntax=docker/dockerfile:1
FROM node:latest
COPY . /usr/app
WORKDIR /usr/app
RUN npm install
EXPOSE 5000

# FROM itporbit/react-native-android
# WORKDIR /Application
# RUN apk add --no-cache yarn musl-dev linux-headers
# EXPOSE 5000
# COPY . .
# CMD ["yarn", "install"]