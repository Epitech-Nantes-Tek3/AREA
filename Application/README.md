![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

# Mobile application

The AREA mobile application is a client that allow you to connect to our work of Action/Reaction.

You can create an account with Facebook or with your e-mail address.

Next you can connect your different accounts to our app (strava, twitch, spotify, ...)

Finally, you can create areas to will allow you to select one action (ex: When it's rainy outside) that will trigger a reaction of your choice (ex: Send me an e-mail)

You can see and remove them on the homescreen. All your active areas are saved on our server and will be automatically triggered by our server even you don't have the app opened on your phone.

## Testing

---

We use Detox framework to test react-native mobile application.

### Write tests

---

You can write more test in file : `Application/e2e/starter.test.js`. Write your tests at the en of the file. You can find more documentation about test [here](https://wix.github.io/Detox/docs/introduction/getting-started/).

### Pre-requirement

---

- Use a connected device or an emulator.
- Build the application: `npx react-native run-android`

### Test

---

- Run npm: `npm start`
- Run tests: `npx detox test --configuration android.emu.debug`
