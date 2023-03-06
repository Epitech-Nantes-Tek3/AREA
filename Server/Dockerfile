FROM node:latest

# Install dependencies
RUN mkdir /app/
WORKDIR /app/
COPY ./package.json /app/package.json
RUN yarn

# Copy project
COPY ./Services/ /app/Services/
COPY ./app.js /app/
COPY ./config.js /app/
COPY ./firebaseFunctions.js /app/
COPY ./firebaseConfig.js /app/
COPY ./twitchConfig.js /app/
COPY ./serviceAccountKey.json /app/
CMD npm run dev