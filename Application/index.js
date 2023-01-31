import { Navigation } from "react-native-navigation";
import AddArea from "./src/Screens/AddArea";
import ConnexionScreen from "./src/Screens/ConnexionScreen";
import HomeScreen from "./src/Screens/HomeScreen";
import SignInScreen from "./src/Screens/SignInScreen";
import SettingsScreen from "./src/Screens/SettingsScreen";

Navigation.registerComponent('ConnexionScreen', () => ConnexionScreen);
Navigation.registerComponent('SignInScreen', () => SignInScreen);
Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('AddArea', () => AddArea);
Navigation.registerComponent('SettingsScreen', () => SettingsScreen);
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
