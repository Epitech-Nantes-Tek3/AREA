FROM timbru31/java-node:latest
COPY . /usr/app
WORKDIR /usr/app
RUN apt-get update -y && apt-get upgrade -y
RUN npm install --quite -g react-scripts
# RUN  add-apt-repository ppa:openjdk-r/ppa && apt-get update && apt install openjdk-11-jdk
RUN wget https://dl.google.com/android/android-sdk_r24.4.1-linux.tgz && \
    tar xzf android-sdk_r24.4.1-linux.tgz && \
    rm android-sdk_r24.4.1-linux.tgz && \
    (echo y | android-sdk-linux/tools/android -s update sdk --no-ui --filter platform-tools,tools -a ) && \
    (echo y | android-sdk-linux/tools/android -s update sdk --no-ui --filter extra-android-m2repository,extra-android-support,extra-google-google_play_services,extra-google-m2repository -a) && \
    (echo y | android-sdk-linux/tools/android -s update sdk --no-ui --filter build-tools-23.0.2,android-24 -a)

# ARG ANDROID_SDK_VERSION
# ARG ANDROID_PLATFORM
# ARG BUILD_TOOLS_VERSION
# RUN \
#   dpkg --add-architecture i386 \
#   && apt-get update \
#   && apt-get install -y \
#     openjdk-11-jdk \
#     libc6:i386 \
#     libncurses5:i386 \
#     libstdc++6:i386 \
#     lib32z1 \
#     libbz2-1.0:i386 \
#     unzip \
#   && rm -rf /var/lib/apt/lists/*
ENV ANDROID_HOME=/usr/app/android
# # https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
# RUN \
#   curl -fsSLO --compressed "https://dl.google.com/android/repository/commandlinetools-linux-9123335_latest.zip" \
#   && ls -la && unzip -d $ANDROID_HOME commandlinetools-linux-9123335_latest.zip \
#   && rm commandlinetools-linux-9123335_latest.zip
# RUN \
#   yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses > /dev/null \
#   && yes | $ANDROID_HOME/tools/bin/sdkmanager --install "platforms;android-$ANDROID_PLATFORM" "build-tools;$BUILD_TOOLS_VERSION" "system-images;android-$ANDROID_PLATFORM;google_apis_playstore;x86"
# ENV PATH="${PATH}:${ANDROID_HOME}/emulator"
# ENV PATH="${PATH}:${ANDROID_HOME}/tools"
# ENV PATH="${PATH}:${ANDROID_HOME}/tools/bin"
# ENV PATH="${PATH}:${ANDROID_HOME}/platform-tools"

RUN cd android && ./gradlew assembleDebug