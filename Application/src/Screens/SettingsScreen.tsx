import React, { Dispatch, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, ImageSourcePropType, GestureResponderEvent, ScrollView } from "react-native";
import { Globals } from "../Common/Globals";
import Geolocation from 'react-native-geolocation-service';
import { UserInfo } from "../Common/Interfaces";



interface SettingsProps {
    userInfo: UserInfo
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>
    hasAuthorization: boolean
}

interface Location {
    latitude: number
    longitude: number
    city: string
}

export default function SettingsScreen(props: SettingsProps) {
    const [location, setLocation] = useState<Location>({latitude: props.userInfo.coord.latitude, longitude: props.userInfo.coord.longitude, city: props.userInfo.coord.city})

    useEffect(() => {
        props.setUserInfo({
            mail: props.userInfo.mail,
            coord: {
                latitude: location.latitude,
                longitude: location.longitude,
                city: location.city
            },
            id: props.userInfo.id,
            services: {
                spotifyId: props.userInfo.services.spotifyId,
                googleId: props.userInfo.services.googleId,
                twitterId: props.userInfo.services.twitterId,
                twitchId: props.userInfo.services.twitchId,
                stravaId: props.userInfo.services.stravaId
            }
        })
    }, [location])

    // Get the city of the user with Reverse Geocoding from Google
    async function getAddressFromCoordinates(lat: number, long: number) {
        fetch("https://api-adresse.data.gouv.fr/reverse/?lon=" + long + "&lat=" + lat)
            .then((res) => {
                res.json()
                    .then((jsonRes) => {
                        setLocation({latitude: lat, longitude: long, city: jsonRes.features[0].properties.city});
                    })
            })
            .catch((err) => console.warn(err)
        ).catch((err) => console.warn(err))
    }

    // Get the coordinates of the user
    async function getLocalization() {
        if (props.hasAuthorization) {
            Geolocation.getCurrentPosition(
                async (position) => {
                    await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude)
                },
                (error) => {
                  console.error(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            )
        }
    }

    function ProfileInfo() {
        return (
            <View style={[styles.profileContainer, styles.shadows]}>
                <Image source={require("../assets/avatar.png")} style={styles.avatarIcon}/>
                <Text style={styles.emailText}>{props.userInfo.mail}</Text>
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
                <Image source={props.leftImage} style={[styles.logoList, { left: 16 }]}/>
                <Text style={styles.textList}>{props.text}</Text>
            </TouchableOpacity>
        )
    }

    function SingleConnexionBlock(props: SingleBlockProps) {
        return (
            <TouchableOpacity style={[styles.connexionContainer, styles.shadows]} onPress={props.onPress}>
                <Image source={props.leftImage} style={styles.logoList}/>
                <Text style={styles.textList}>{props.text}</Text>
                <Image source={props.rightImage} style={styles.rightArrow}/>
            </TouchableOpacity>
        )
    }

    function ConnexionBlocks() {
        function googleConnexion() {
            let token = "ImTestingATokenItIsSoFunnyGoogle"
            props.setUserInfo({
                mail: props.userInfo.mail,
                coord: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city
                },
                id: props.userInfo.id,
                services: {
                    spotifyId: props.userInfo.services.spotifyId,
                    googleId: token,
                    twitterId: props.userInfo.services.twitterId,
                    twitchId: props.userInfo.services.twitchId,
                    stravaId: props.userInfo.services.stravaId
                }
            })
        }

        function spotifyConnexion() {
            let token = "ImTestingATokenItIsSoFunnySpotify"
            props.setUserInfo({
                mail: props.userInfo.mail,
                coord: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city
                },
                id: props.userInfo.id,
                services: {
                    spotifyId: token,
                    googleId: props.userInfo.services.googleId,
                    twitterId: props.userInfo.services.twitterId,
                    twitchId: props.userInfo.services.twitchId,
                    stravaId: props.userInfo.services.stravaId
                }
            })
        }

        function twitterConnexion() {
            let token = "ImTestingATokenItIsSoFunnyTwitter"
            props.setUserInfo({
                mail: props.userInfo.mail,
                coord: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city
                },
                id: props.userInfo.id,
                services: {
                    spotifyId: props.userInfo.services.spotifyId,
                    googleId: props.userInfo.services.googleId,
                    twitterId: token,
                    twitchId: props.userInfo.services.twitchId,
                    stravaId: props.userInfo.services.stravaId
                }
            })
        }

        function twitchConnexion() {
            let token = "ImTestingATokenItIsSoFunnyTwitch"
            props.setUserInfo({
                mail: props.userInfo.mail,
                coord: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city
                },
                id: props.userInfo.id,
                services: {
                    spotifyId: props.userInfo.services.spotifyId,
                    googleId: props.userInfo.services.googleId,
                    twitterId: props.userInfo.services.twitterId,
                    twitchId: token,
                    stravaId: props.userInfo.services.stravaId
                }
            })
        }

        function stravaConnexion() {
            let token = "ImTestingATokenItIsSoFunnyStrava"
            props.setUserInfo({
                mail: props.userInfo.mail,
                coord: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city
                },
                id: props.userInfo.id,
                services: {
                    spotifyId: props.userInfo.services.spotifyId,
                    googleId: props.userInfo.services.googleId,
                    twitterId: props.userInfo.services.twitterId,
                    twitchId: props.userInfo.services.twitchId,
                    stravaId: token
                }
            })
        }





        return (
            <View style={styles.mainConnexion}>
                <SingleConnexionBlock leftImage={require("../assets/logo/google.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Google"} onPress={googleConnexion} />
                <SingleConnexionBlock leftImage={require("../assets/logo/spotify.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Spotify"} onPress={spotifyConnexion} />
                <SingleConnexionBlock leftImage={require("../assets/logo/twitter.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Twitter"} onPress={twitterConnexion} />
                <SingleConnexionBlock leftImage={require("../assets/logo/strava.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Strava"} onPress={stravaConnexion} />
                <SingleConnexionBlock leftImage={require("../assets/logo/twitch.png")} rightImage={require("../assets/arrowRight.png")} text={"Connexion à Twitch"} onPress={twitchConnexion} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentScrollview}>
                <ProfileInfo />
                <SingleBlock leftImage={require("../assets/locate.png")} text={"Localisation : " + (location.city === "" ? "Unknown" : location.city)} onPress={getLocalization} />
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
    },
    contentScrollview: {
        flexDirection: "column",
        alignItems: "center"
    },
    scrollView: {
        width: "100%"
    },
    mainConnexion: {
        width: "90%",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "white",
        borderRadius: 10
    },
    logoList: {
        width: 32,
        height: 32,
        position: "absolute",
        left: 0
    },
    textList: {
        fontFamily: "Poppins-Medium",
        fontSize: 18,
        marginLeft: 16
    },
    rightArrow: {
        width: 7,
        height: 12,
        position: "absolute",
        right: 0
    },
    avatarIcon: {
        width: 65,
        height: 65,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 1,
        marginHorizontal: 20
    },
    emailText: {
        fontFamily: "Poppins-Bold",
        fontSize: 16,
        color: "white"
    }
})