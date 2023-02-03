FROM node:latest

# Install dependencies
RUN mkdir /app/
WORKDIR /app/
COPY ./package.json /app/package.json
RUN yarn

# Copy project
COPY ./Services/ /app/Services/
COPY ./views/ /app/views/
COPY ./app.js /app/
COPY ./config.js /app/
COPY ./firebaseFunctions.js /app
