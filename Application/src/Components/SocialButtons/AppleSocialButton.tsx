import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  appleStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
    height: 40,
    width: 220,
    borderRadius: 10,
    marginTop: 12
  },
  imageIconStyle: {
    padding: 10,
    marginLeft: 15,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    tintColor: "white"
  },
  textStyle: {
    color: "white",
    marginLeft: 20,
    marginRight: 20,
    fontFamily: "Poppins-Medium"
  }
});

interface AppleProps {
  buttonViewStyle?: any
  buttonText: string
  logoStyle?: any
  textStyle?: any
  onPress: any
}

export default function AppleSocialButton(props: AppleProps) {
  return (
    <TouchableOpacity
        style={[styles.appleStyle, props.buttonViewStyle ]}
        onPress={props.onPress}
    >
        <Image
            source={require("./apple.png")}
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
