# Mobile application


## Testing
___
We use Detox framework to test react-native mobile application.

### Write tests
___
You can write more test in file : `Application/e2e/starter.test.js`. Write your tests at the en of the file. You can find more documentation about test [here](https://wix.github.io/Detox/docs/introduction/getting-started/).

### Pre-requirement
___
Use a connected device or an emulator.

### Test
___
Run npm: `npm start`

Build the application: `npx react-native run-android`

Run tests: `npx detox test --configuration android.emu.debug`
