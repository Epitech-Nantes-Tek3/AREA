import {Navigation, Options} from 'react-native-navigation';

export function NavigatorshowModal(
  name: string,
  options: Options = {},
  props: any = {},
) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: name,
            options: options,
            passProps: props,
          },
        },
      ],
    },
  });
}

export function NavigatorPush(
  name: string,
  options: Options = {},
  props: any = {},
  componentId: string
) {
  Navigation.push(componentId, {
    component: {
      name: name,
      options: options,
      passProps: props,
    },
  });
}

export function NavigatorPop(
  componentId: string) {
  Navigation.pop(componentId)
}