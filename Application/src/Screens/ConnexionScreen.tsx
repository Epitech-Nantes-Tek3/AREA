import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, Platform, Dimensions, TextInput, View, TouchableOpacity, ScaledSize } from "react-native";
import Separator, { Line } from "../Components/Separator";
import { Globals } from "../Common/Globals";
import FacebookSocialButton from "../Components/SocialButtons/FacebookButton";
import GoogleSocialButton from "../Components/SocialButtons/GoogleSocialButton";
import AppleSocialButton from "../Components/SocialButtons/AppleSocialButton";
import { NavigatorPush } from "../Navigator";
import { Options } from "react-native-navigation";
import Circles from "../Components/Circles";
import { ip} from "../../env";

export default function ConnexionScreen() {
    // Gets the size of the current window
    const window: ScaledSize = Dimensions.get("window")

    // Hooks allowing use to get/set user infos
    const [userMail, setUserMail] = useState("")
    const [userPass, setUserPass] = useState("")

    function forgotPassword() {
        console.log("Act on forgot password")
    }

    async function connectionAction() {
        console.log("Connect user", userMail, userPass)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: userMail, password: userPass})
        }

        try {
            await fetch(ip + "login", requestOptions).then(response => {
                response.json().then(data => {
                    console.log(data);
                })
            });
        } catch (error) {
            console.log(error);
        }
    }

    function connectWithApple() {
        console.log("Connect with Apple")
    }

    function connectWithGoogle() {
        console.log("Connect with Google")
    }

    function connectWithFacebook() {
        console.log("Connect with Facebook")
    }

    function navigateToSubscribe() {
        const options: Options = {
            topBar: {
                visible: false
            },
            popGesture: false
        }
        NavigatorPush("SignInScreen", "mainStack", options)
    }

    function SocialButtons() {
        return (
            <View style={styles.socialContainer}>
                <FacebookSocialButton onPress={connectWithFacebook} buttonViewStyle={[styles.socialButtons, {width: "80%"}]} buttonText="Se connecter avec Facebook" />
                <GoogleSocialButton onPress={connectWithGoogle} buttonViewStyle={[styles.socialButtons, {width: "80%"}]} buttonText="Se connecter avec Google" />
                {Platform.OS === "ios" &&
                <AppleSocialButton onPress={connectWithApple} buttonViewStyle={[styles.socialButtons, {width: "80%"}]}  buttonText="Se connecter avec Apple" />}
            </View>
        )
    }

    function SignUp() {
        return(
            <View style={signStyles.mobileContainer}>
                <Line height={0.5} width={"60%"} borderWidth={0.5} borderColor={Globals.Colors.main} />
                <View style={signStyles.textContainer}>
                    <Text style={signStyles.mobileNoAccountText}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={navigateToSubscribe}>
                        <Text style={signStyles.mobileSignInText} testID='inscription-redirect'>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Circles/>
            <View style={{flex: 10}}>
                <Image
                    source={require("../assets/logo.png")}
                    style={
                        [
                            styles.image,
                            {
                                width: window.width / 100 * 30,
                                height: window.width / 100 * 30
                            }
                        ]
                }/>
                <View style={[styles.inputContainer, {width: "80%"}]}>
                    <TextInput
                        style={[styles.inputBorderStyle, styles.inputInside]}
                        onChangeText={(text) => setUserMail(text)}
                        value={userMail}
                        placeholder={"Email"}
                        placeholderTextColor={"#7B7B7B"}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoComplete="email"
                        autoCorrect={false}
                        returnKeyType="next"
                        testID="emailAddress"
                    />
                    <TextInput
                        style={[styles.inputBorderStyle, styles.inputInside]}
                        onChangeText={(text) => setUserPass(text)}
                        value={userPass}
                        placeholder="Mot de passe"
                        placeholderTextColor={"#7B7B7B"}
                        secureTextEntry={true}
                        autoComplete="password"
                        autoCorrect={false}
                        returnKeyType="done"
                        testID="pwdpassword"
                    />
                    <Text style={styles.forgottenText} onPress={forgotPassword}>Un oubli ?</Text>
                    <TouchableOpacity
                        style={[styles.inputBorderStyle, styles.connectInside]}
                        onPress={connectionAction}>
                        <Text style={styles.connectText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
                <Separator width={"90%"} text="ou"/>
                <SocialButtons/>
            </View>
            <SignUp/>
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
        marginTop: 40,
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
        fontSize: 12,
        fontFamily: "Poppins-Medium"
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
        borderRadius: 10,
    },
    bottomLine: {
        alignSelf: "center"
    },
    connectText: {
        fontSize: 16,
        fontFamily: "Poppins-Medium"
    }
})

const signStyles = StyleSheet.create({
    webContainer: {
        alignSelf: "center",
        flexDirection: "column",
        marginTop: 25,
        alignItems: "center",
        width: "100%"
    },
    webNoAccountText: {
        color: "#6E8387",
        fontFamily: "Poppins-Medium",
        fontSize: 20
    },
    mobileContainer: {
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    textContainer: {
        alignSelf: "center",
        flexDirection: "row",
        marginTop: "2%",
        alignItems: "center",
        width: "100%",
        justifyContent: "center"
    },
    mobileNoAccountText: {
        color: "#6E8387",
        fontFamily: "Poppins-Medium",
        fontSize: 18
    },
    mobileSignInText: {
        color: "#95B8D1",
        fontFamily: "Poppins-Bold",
        fontSize: 18
    }
})