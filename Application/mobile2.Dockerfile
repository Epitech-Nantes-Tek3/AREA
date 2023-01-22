FROM archlinux:latest

RUN (printf "\nen_US.UTF-8 UTF-8\n" >> /etc/locale.gen) && (/usr/bin/locale-gen)
RUN sed -i "/\[multilib\]/,/Include/"'s/^#//' /etc/pacman.conf

RUN pacman -Syy

RUN pacman -S jdk11-openjdk --noconfirm
ENV JAVA_HOME=/usr/lib/jvm/default

RUN pacman -S --noconfirm sudo audit binutils make git fakeroot
RUN useradd builduser -m
RUN passwd -d builduser
RUN printf 'builduser ALL=(ALL) ALL\n' | tee -a /etc/sudoers
RUN sudo -u builduser bash -c 'cd ~ && git clone https://aur.archlinux.org/android-sdk.git && cd android-sdk && makepkg -si --noconfirm'
RUN sudo -u builduser bash -c 'cd ~ && git clone https://aur.archlinux.org/android-sdk-build-tools.git  && cd android-sdk-build-tools && makepkg -si --noconfirm'
RUN sudo -u builduser bash -c 'cd ~ && git clone https://aur.archlinux.org/android-sdk-platform-tools.git  && cd android-sdk-platform-tools && makepkg -si --noconfirm'

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/emulator
ENV PATH=$PATH:$ANDROID_HOME/tools
ENV PATH=$PATH:$ANDROID_HOME/tools/bin
ENV PATH=$PATH:$ANDROID_HOME/platform-tools

RUN yes | sdkmanager --update
RUN yes | sdkmanager --licenses
# RUN yes | sdkmanager "build-tools;27.0.3" "platforms;android-27"

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# RUN mkdir -p /usr/src/app/android/gradle/wrapper/ \
#     && curl -fl https://downloads.gradle.org/distributions/gradle-5.1.1-all.zip \
#        -o /usr/src/app/android/gradle/wrapper/gradle-all.zip

RUN pacman -S npm --noconfirm

# COPY package.json /tmp/package.json
# RUN cd /tmp && npm install --no-progress --ignore-optional && npm audit fix
# RUN cp -a /tmp/node_modules /usr/src/app/

COPY . /usr/src/app/
WORKDIR /usr/src/app/android/

CMD ["./gradlew", "assembleRelease"]
