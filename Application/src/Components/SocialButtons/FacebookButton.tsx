import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image, View, GestureResponderEvent} from "react-native";

const styles = StyleSheet.create({
  facebookStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#485a96",
    height: 40,
    width: 220,
    borderRadius: 10,
    position: "relative",
    marginTop: 12
  },
  imageIconStyle: {
    padding: 10,
    marginLeft: 15,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignSelf: "center"
  },
  textStyle: {
    color: "#fff",
    marginLeft: 20,
    marginRight: 20,
    fontFamily: "Poppins-Medium"
  }
});

interface FacebookProps {
    buttonViewStyle?: any
    buttonText: string
    logoStyle?: any
    textStyle?: any
    onPress: any
}

export default function FacebookSocialButton(props: FacebookProps) {
    return (
        <TouchableOpacity
            style={[styles.facebookStyle, props.buttonViewStyle ]}
            onPress={props.onPress}
        >
            <Image
                source={require("./facebook.png")}
                style={[styles.imageIconStyle, props.logoStyle]}
            />
            <Text style={[styles.textStyle, props.textStyle]}>
                {props.buttonText
                ? props.buttonText
                : "Se connecter avec Facebook"}
            </Text>
        </TouchableOpacity>
    );
}