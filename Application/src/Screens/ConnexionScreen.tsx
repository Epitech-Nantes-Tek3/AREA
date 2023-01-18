import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, Platform, Dimensions, TextInput, View, TouchableOpacity, ScaledSize } from "react-native";
import Separator, { Line } from "../Components/Separator";
import { Globals } from "../Common/Globals";
import FacebookSocialButton from "../Components/SocialButtons/FacebookButton";
import GoogleSocialButton from "../Components/SocialButtons/GoogleSocialButton";
import AppleSocialButton from "../Components/SocialButtons/AppleSocialButton";
import { NavigatorPush } from "../Navigator";
import { Options } from "react-native-navigation";


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
        console.log("Connect user", userMail, userPass)
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
        NavigatorPush("SignInScreen", options, {}, "mainStack")
    }

    function SocialButtons() {
        return (
            <View style={styles.socialContainer}>
                <FacebookSocialButton onPress={connectWithFacebook} buttonViewStyle={[styles.socialButtons, {width: percentageWidthInputs}]} buttonText="Se connecter avec Facebook" />
                <GoogleSocialButton onPress={connectWithGoogle} buttonViewStyle={[styles.socialButtons, {width: percentageWidthInputs}]} buttonText="Se connecter avec Google" />
                {Platform.OS === "ios" &&
                <AppleSocialButton onPress={connectWithApple} buttonViewStyle={[styles.socialButtons, {width: percentageWidthInputs}]}  buttonText="Se connecter avec Apple" />}
            </View>
        )
    }

    function SignUp() {
        if (Platform.OS === "web") {
            return (
                <View style={signStyles.webContainer}>
                    <Text style={signStyles.webNoAccountText}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={navigateToSubscribe} style={[styles.inputBorderStyle, styles.connectInside, {width: percentageWidthInputs}]}>
                        <Text style={styles.connectText}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return(
            <View style={signStyles.mobileContainer}>
                <Line height={0.5} width={"60%"} borderWidth={0.5} borderColor={Globals.Colors.main} />
                <View style={signStyles.textContainer}>
                    <Text style={signStyles.mobileNoAccountText}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={navigateToSubscribe}>
                        <Text style={signStyles.mobileSignInText}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function Circles() {
        return (
            <View>
                <View style={circles.bigCircle}/>
                <View style={circles.smallCircle}/>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {(Platform.OS === "ios" || Platform.OS == "android") &&
                <Circles/>
            }
            <View style={{flex: 10}}>
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
                        placeholderTextColor={"#7B7B7B"}
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
                        placeholderTextColor={"#7B7B7B"}
                        secureTextEntry={true}
                        autoComplete="password"
                        autoCorrect={false}
                        returnKeyType="done"
                    />
                    <Text style={styles.forgottenText} onPress={forgotPassword}>Un oubli ?</Text>
                    <TouchableOpacity
                        style={[styles.inputBorderStyle, styles.connectInside]}
                        onPress={connectionAction}>
                        <Text style={styles.connectText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
                <Separator width={percentageWidthSeparator} text="ou"/>
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

const circles = StyleSheet.create({
    bigCircle: {
        width: 406,
        height: 406,
        borderRadius: 500,
        backgroundColor: Globals.Colors.main,
        position: "absolute",
        top: -244,
        left: -55,
        opacity: 0.4
    },
    smallCircle: {
        width: 342,
        height: 342,
        borderRadius: 500,
        backgroundColor: Globals.Colors.main,
        position: "absolute",
        top: -203,
        left: 179,
        opacity: 0.4
    }
})