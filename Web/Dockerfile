FROM node:latest

# Install dependencies
RUN mkdir /app/
WORKDIR /app/
COPY ./package.json /app/package.json
RUN yarn

# Copy project
COPY ./public/ /app/public/
COPY ./src/ /app/src/

# Create common folder
RUN mkdir /release

# Create symbolic link to the apk app
RUN ln -s /release/client.apk /app/public/client.apk

EXPOSE 3000

CMD npm start