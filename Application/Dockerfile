FROM reactnativecommunity/react-native-android:6.2

COPY . /usr/app
WORKDIR /usr/app
RUN yarn
RUN cd android && ./gradlew assembleDebug
RUN mkdir /release
ENTRYPOINT cp /usr/app/android/app/build/outputs/apk/debug/app-debug.apk /release/client.apk