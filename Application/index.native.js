import { Navigation } from "react-native-navigation";
import App from "./src/App";

Navigation.registerComponent('HomeScreen', () => App);
Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: 'HomeScreen'
             }
           }
         ]
       }
     }
  });
});