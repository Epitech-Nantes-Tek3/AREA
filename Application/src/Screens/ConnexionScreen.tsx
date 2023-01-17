import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, Platform, Dimensions, TextInput, View, TouchableOpacity, ScaledSize } from "react-native";
import Separator from "../Components/Separator";
import { Globals } from "../Common/Globals";
import { AppleButton } from '../modules/react-native-apple-authentication';

export default function ConnexionScreen() {
    // Sets different sizes to be good on both web and mobile
    const percentageWidthLogo: number = Platform.OS === "web" ? 10 : 30
    const percentageWidthInputs: string = Platform.OS === "web" ? "30%" : "80%"
    const percentageWidthSeparator: string = Platform.OS === "web" ? "40%" : "90%"

    // Gets the size of the current window
    const window: ScaledSize = Dimensions.get("window")

    // Hooks allowing use to get/set user infos
    const [userMail, setUserMail] = useState("")
    const [userPass, setUserPass] = useState("")


    function forgotPassword() {
        console.log("Act on forgot password")
    }

    function connectionAction() {
        console.log("Connect user")
    }

    function onAppleButtonPress() {
        console.log("Connect with Apple")
    }

    function SocialButtons() {
        return (
            <View style={styles.socialContainer}>
                {(Platform.OS === "ios" || Platform.OS === "macos") &&
                    <AppleButton
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.CONTINUE}
                        style={[styles.socialButtons, {width: percentageWidthInputs}]}
                        onPress={onAppleButtonPress}
                    />
                }
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../assets/logo.png")}
                style={
                    [
                        styles.image,
                        {
                            width: window.width / 100 * percentageWidthLogo,
                            height: window.width / 100 * percentageWidthLogo
                        }
                    ]
            }/>
            <View style={[styles.inputContainer, {width: percentageWidthInputs}]}>
                <TextInput
                    style={[styles.inputBorderStyle, styles.inputInside]}
                    onChangeText={(text) => setUserMail(text)}
                    value={userMail}
                    placeholder={"Email"}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    autoCorrect={false}
                    returnKeyType="next"

                />
                <TextInput
                    style={[styles.inputBorderStyle, styles.inputInside]}
                    onChangeText={(text) => setUserPass(text)}
                    value={userPass}
                    placeholder="Mot de passe"
                    secureTextEntry={true}
                    autoComplete="password"
                    autoCorrect={false}
                    returnKeyType="done"
                />
                <Text style={styles.forgottenText} onPress={forgotPassword}>Un oubli ?</Text>
                <TouchableOpacity
                    style={[styles.inputBorderStyle, styles.connectInside]}
                    onPress={connectionAction}>
                    <Text>Se connecter</Text>
                </TouchableOpacity>
            </View>
            <Separator width={percentageWidthSeparator} text="ou"/>
            <SocialButtons/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Globals.Colors.lightBackground,
    },
    image: {
        alignSelf: "center",
        marginTop: 41
    },
    inputContainer: {
        marginTop: 70,
        alignSelf: "center"
    },
    inputBorderStyle: {
        height: 50,
        margin: 8,
        borderWidth: 1,
        borderRadius: 8,
       
    },
    inputInside: {
        padding: 10,
        borderColor: Globals.Colors.dark,
    },
    forgottenText: {
        textAlign: "right",
        paddingRight: 5,
        color: Globals.Colors.dark,
        marginBottom: 8,
        fontSize: 12
    },
    connectInside: {
        borderColor: Globals.Colors.main,
        backgroundColor: Globals.Colors.main,
        justifyContent: "center",
        alignItems: "center"
    },
    socialContainer: {
        alignItems: "center"
    },
    socialButtons: {
        height: 50,
        marginBottom: 16,
    }
})