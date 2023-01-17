import { Navigation } from "react-native-navigation";
import ConnexionScreen from "./src/Screens/ConnexionScreen";

Navigation.registerComponent('ConnexionScreen', () => ConnexionScreen);
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
