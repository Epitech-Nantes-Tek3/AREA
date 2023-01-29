import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, ImageSourcePropType, GestureResponderEvent, ScrollView } from "react-native";
import { SERVICES } from "../Common/Areas";
import { Globals } from "../Common/Globals";
import { Service } from "../Common/Interfaces";
import Geolocation from 'react-native-geolocation-service';

interface SettingsProps {
    hasAuthorization: boolean
}

interface Location {
    latitude: number
    longitude: number
    city: string
}

export default function SettingsScreen(props: SettingsProps) {
    let email = "hugo.perez@gmail.com"
    const [location, setLocation] = useState<Location>({latitude: 47.218371, longitude: -1.553621, city: "Nantes"})

    function getLocalization() {
        if (props.hasAuthorization) {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log(position)
                    // Add reverse geocoding
                    setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude, city: "Nantes"})
                },
                (error) => {
                  // See error code charts below.
                  console.error(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            )
        }
    }

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

    function SingleConnexionBlock(props: SingleBlockProps) {
        return (
            <TouchableOpacity style={[styles.connexionContainer, styles.shadows]} onPress={props.onPress}>
                <Image source={props.leftImage} style={{width: 32, height: 32, position: "absolute", left: 0}}/>
                <Text style={{fontFamily: "Poppins-Medium", fontSize: 18, marginLeft: 16}}>{props.text}</Text>
                <Image source={props.rightImage} style={{width: 7, height: 12, position: "absolute", right: 0}}/>
            </TouchableOpacity>
        )
    }

    function ConnexionBlocks() {
        return (
            <View style={{width: "90%", alignItems: "center", marginTop: 10, backgroundColor: "white", borderRadius: 10,}}>
                <SingleConnexionBlock leftImage={require("../assets/logo/google.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Google"} onPress={() => console.log("Google")} />
                <SingleConnexionBlock leftImage={require("../assets/logo/spotify.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Spotify"} onPress={() => console.log("Spotify")} />
                <SingleConnexionBlock leftImage={require("../assets/logo/twitter.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Twitter"} onPress={() => console.log("Twitter")} />
                <SingleConnexionBlock leftImage={require("../assets/logo/strava.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Strava"} onPress={() => console.log("Strava")} />
                <SingleConnexionBlock leftImage={require("../assets/logo/twitch.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Twitch"} onPress={() => console.log("Twitch")} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{width: "100%"}} contentContainerStyle={{flexDirection: "column", alignItems: "center"}}>
                <ProfileInfo />
                <SingleBlock leftImage={require("../assets/locate.png")} text={"Localisation : " + location.city} onPress={getLocalization} />
                <ConnexionBlocks/>
            </ScrollView>
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
    },
    connexionContainer: {
        width: "90%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 4
    }
})