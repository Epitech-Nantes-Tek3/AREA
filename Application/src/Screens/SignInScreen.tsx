import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, Platform, Dimensions, TextInput, View, TouchableOpacity, ScaledSize, Alert } from "react-native";
import Separator, { Line } from "../Components/Separator";
import { Globals } from "../Common/Globals";
import FacebookSocialButton from "../Components/SocialButtons/FacebookButton";
import GoogleSocialButton from "../Components/SocialButtons/GoogleSocialButton";
import AppleSocialButton from "../Components/SocialButtons/AppleSocialButton";
import { NavigatorPop, NavigatorPush } from "../Navigator";
import Circles from "../Components/Circles";
import { HomeScreenProps } from "../Common/Interfaces";
import { Options } from "react-native-navigation";


export default function SignInScreen() {
    // Gets the size of the current window
    const window: ScaledSize = Dimensions.get("window")

    // Hooks allowing use to get/set user infos
    const [userMail, setUserMail] = useState("")
    const [userPass, setUserPass] = useState("")
    const [userValidPass, setUserValidPass] = useState("")

    // Options to push the next screen
    const options: Options = {
        popGesture: false,
        topBar: {
            visible: false
        }
    }

    function connectionAction() {
        if (userPass !== userValidPass)
            Alert.alert("Not the same")
        else {
            console.log("Subscribe user", userMail, userPass, userValidPass)
            const props: HomeScreenProps = {
                userMail: userMail
            }
            NavigatorPush("HomeScreen", "mainStack", options, props)
        }
    }

    function connectWithApple() {
        console.log("Subscribe with Apple")
        const props: HomeScreenProps = {
            userMail: userMail
        }
        NavigatorPush("HomeScreen", "mainStack", options, props)
    }

    function connectWithGoogle() {
        console.log("Subscribe with Google")
        const props: HomeScreenProps = {
            userMail: userMail
        }
        NavigatorPush("HomeScreen", "mainStack", options, props)
    }

    function connectWithFacebook() {
        console.log("Subscribe with Facebook")
        const props: HomeScreenProps = {
            userMail: userMail
        }
        NavigatorPush("HomeScreen", "mainStack", options, props)
    }

    function navigateToConnexion() {
        NavigatorPop("mainStack")
    }

    function SocialButtons() {
        return (
            <View style={styles.socialContainer}>
                <FacebookSocialButton onPress={connectWithFacebook} buttonViewStyle={[styles.socialButtons, {width: "80%"}]} buttonText="S'inscrire avec Facebook" />
                <GoogleSocialButton onPress={connectWithGoogle} buttonViewStyle={[styles.socialButtons, {width: "80%"}]} buttonText="S'inscrire avec Google" />
                {Platform.OS === "ios" &&
                <AppleSocialButton onPress={connectWithApple} buttonViewStyle={[styles.socialButtons, {width: "80%"}]}  buttonText="S'inscrire avec Apple" />}
            </View>
        )
    }

    function SignUp() {
        return(
            <View style={signStyles.mobileContainer}>
                <Line height={0.5} width={"60%"} borderWidth={0.5} borderColor={Globals.Colors.main} />
                <View style={signStyles.textContainer}>
                    <Text style={signStyles.mobileNoAccountText}>Déjà un compte ? </Text>
                    <TouchableOpacity onPress={navigateToConnexion}>
                        <Text style={signStyles.mobileSignInText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
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
                        returnKeyType="next"
                    />
                    <TextInput
                        style={[styles.inputBorderStyle, styles.inputInside]}
                        onChangeText={(text) => setUserValidPass(text)}
                        value={userValidPass}
                        placeholder="Valider le mot de passe"
                        placeholderTextColor={"#7B7B7B"}
                        secureTextEntry={true}
                        autoComplete="password"
                        autoCorrect={false}
                        returnKeyType="done"
                    />
                    <TouchableOpacity
                        style={[styles.inputBorderStyle, styles.connectInside]}
                        onPress={connectionAction}>
                        <Text style={styles.connectText}>S'inscrire</Text>
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
        marginTop: 35
    },
    inputContainer: {
        marginTop: 30,
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