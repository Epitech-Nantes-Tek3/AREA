FROM node:latest
COPY . /usr/app
WORKDIR /usr/app
RUN npm install --quite -g react-scripts