import WebView from "react-native-webview";

interface propsWebPage {
    url: string
}

export default function WebPage(props: propsWebPage) {
  return (
    <WebView
      source={{
        uri: props.url,
      }}
    />
  );
}