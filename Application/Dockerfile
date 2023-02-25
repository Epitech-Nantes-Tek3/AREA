FROM reactnativecommunity/react-native-android:6.2

# Install dependencies
RUN mkdir /app/
WORKDIR /app/
COPY ./package.json /app/package.json
RUN yarn

# Copy project
COPY . /app/

# Create android release
RUN cd android && ./gradlew assembleRelease

# Move apk file to common volume
RUN mkdir /release
RUN rm -rf /release/client.apk
RUN cp /app/android/app/build/outputs/apk/release/app-release.apk /release/client.apk