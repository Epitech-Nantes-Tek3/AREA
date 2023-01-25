import React from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, ImageSourcePropType, GestureResponderEvent } from "react-native";
import { SERVICES } from "../Common/Areas";
import { Globals } from "../Common/Globals";
import { Service } from "../Common/Interfaces";

export default function SettingsScreen() {
    let email = "hugo.perez@gmail.com"
    let localisation = "Nantes"

    function ProfileInfo() {
        return (
            <View style={[styles.profileContainer, styles.shadows]}>
                <Image source={require("../assets/avatar.png")} style={{width: 65, height: 65, borderRadius: 50, borderColor: "white", borderWidth: 1, marginHorizontal: 20}}/>
                <Text style={{fontFamily: "Poppins-Bold", fontSize: 16, color: "white"}}>{email}</Text>
            </View>
        )
    }

    interface SingleBlockProps {
        leftImage: ImageSourcePropType
        text: string
        rightImage?: ImageSourcePropType
        onPress?: ((event: GestureResponderEvent) => void) | undefined
    }

    function SingleBlock(props: SingleBlockProps) {
        return (
            <TouchableOpacity style={[styles.localisationContainer, styles.shadows]} onPress={props.onPress}>
                <Image source={props.leftImage} style={{width: 36, height: 36, position: "absolute", left: 16}}/>
                <Text style={{fontFamily: "Poppins-Medium", fontSize: 18, marginLeft: 16}}>{props.text}</Text>
            </TouchableOpacity>
        )
    }

    function ConnexionBlocks() {
        return (
            <View style={{width: "100%", alignItems: "center", marginTop: 10}}>
                <SingleBlock leftImage={require("../assets/logo/google.png")} text={"Connexion à Google"} onPress={() => console.log("Google")} />
                <SingleBlock leftImage={require("../assets/logo/spotify.png")} text={"Connexion à Spotify"} onPress={() => console.log("Spotify")} />
                <SingleBlock leftImage={require("../assets/logo/twitter.png")} text={"Connexion à Twitter"} onPress={() => console.log("Twitter")} />
                <SingleBlock leftImage={require("../assets/logo/strava.png")} text={"Connexion à Strava"} onPress={() => console.log("Strava")} />
                <SingleBlock leftImage={require("../assets/logo/twitch.png")} text={"Connexion à Twitch"} onPress={() => console.log("Twitch")} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileInfo />
            <SingleBlock leftImage={require("../assets/locate.png")} text={"Localisation : " + localisation} onPress={() => console.log("Localisation")} />
            <ConnexionBlocks/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Globals.Colors.lightBackground,
        alignItems: "center"
    },
    profileContainer: {
        width: "90%",
        height: 100,
        backgroundColor: "#5281B7",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 26
    },
    shadows: {
        shadowColor: 'black',
        shadowOpacity: 0.06,
        shadowOffset: {
            width: 0,
            height: 4
        },
    },
    localisationContainer: {
        width: "90%",
        height: 60,
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 8
    }
})