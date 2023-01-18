import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  googleStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: "#848484",
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
    resizeMode: "stretch"
  },
  textStyle: {
    color: "#575757",
    marginLeft: 15,
    marginRight: 20,
    fontFamily: "Poppins-Medium"
  }
});

interface GoogleProps {
  buttonViewStyle?: any
  buttonText: string
  logoStyle?: any
  textStyle?: any
  onPress: any
}

export default function GoogleSocialButton(props: GoogleProps) {
  return (
    <TouchableOpacity
        style={[styles.googleStyle, props.buttonViewStyle ]}
        onPress={props.onPress}
    >
        <Image
            source={require("./google.png")}
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
