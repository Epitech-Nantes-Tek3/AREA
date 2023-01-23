import { Navigation } from "react-native-navigation";
import ConnexionScreen from "./src/Screens/ConnexionScreen";
import SignInScreen from "./src/Screens/SignInScreen";

Navigation.registerComponent('ConnexionScreen', () => ConnexionScreen);
Navigation.registerComponent('SignInScreen', () => SignInScreen);
Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
    root: {
      stack: {
        id: 'mainStack',
        children: [
          {
            component: {
              name: 'ConnexionScreen',
              options: {
                topBar: {
                  visible: false
                }
              }
            }
          }
        ]
      }
    }
  });
});
