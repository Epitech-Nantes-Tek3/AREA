import React, { Dispatch, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, ImageSourcePropType, GestureResponderEvent, ScrollView, Alert, TextInput, Linking } from "react-native";
import { Globals } from "../Common/Globals";
import Geolocation from 'react-native-geolocation-service';
import { SettingsProps } from "../Common/Interfaces";
import { LoginManager } from 'react-native-fbsdk-next';
import { HomeScreenProps } from "../Common/Interfaces";
import { NavigatorPop, NavigatorPush } from "../Navigator";
import { Navigation, Options } from "react-native-navigation";

interface Location {
    latitude: number
    longitude: number
    city: string
}

export default function SettingsScreen(props: SettingsProps) {
    const [location, setLocation] = useState<Location>({latitude: props.userInfo.coord.latitude, longitude: props.userInfo.coord.longitude, city: props.userInfo.coord.city})
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [ip, setIp] = useState<string>(props.userInfo.ip)

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
            },
            ip: props.userInfo.ip
        })
    }, [location])

    useEffect(() => {
        getIpStatus()
        // getAddressFromCoordinates(props.userInfo.coord.latitude, props.userInfo.coord.longitude)
    }, [])
    /**
     * Gets the elements of the url and encodes them to work with "éàè..." characters
     * @function encodeQueryString
     * @param {*} params contains the elements to be added to the url.
     * @returns return an encode string.
     */
    function encodeQueryString(params: any) {
        const queryString = new URLSearchParams();
        for (let paramName in params) {
            queryString.append(paramName, params[paramName]);
        }
        return queryString.toString();
    }

    /**
     * Encode Uri 
     * @function encodeQueryString
     * @param {*} params contains the elements to be added to the url.
     * @returns a string separated by an "&".
     */
    function encodeUrlScope(params: any) 
    {
        let items = []
        for (let key in params) {
            let value = encodeURIComponent(params[key])
            items.push(`${key}=${value}`)
        }
        return items.join("&")
    }
        
    // Get the city of the user with Reverse Geocoding from Google
    async function getAddressFromCoordinates(lat: number, long: number) {
        fetch("https://api-adresse.data.gouv.fr/reverse/?lon=" + long + "&lat=" + lat)
            .then((res) => {
                res.json()
                    .then((jsonRes) => {
                        if (jsonRes && jsonRes.features && jsonRes.features[0] && jsonRes.features[0].properties)
                            setLocation({latitude: lat, longitude: long, city: jsonRes.features[0].properties.city});
                        else {
                            setLocation({latitude: lat, longitude: long, city: location.city});
                            Alert.alert("Erreur",
                                "Une erreur a été rencontrée en essayant de trouver votre ville à partir de votre localisation. Vos données ont tout de même été mises à jour.",
                                [
                                    {
                                      text: "Ok",
                                      style: "default"
                                    },
                                ]
                            )
                        }
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
                    getAddressFromCoordinates(position.coords.latitude, position.coords.longitude).then(async () => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                uid: props.userInfo.id
                            })
                        }
                        try {
                            await fetch(props.userInfo.ip + "/register/position", requestOptions).then(response => {
                                console.log(JSON.parse(JSON.stringify(response)))
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    })
                    .catch((err) => console.error(err))
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

    function getIpStatus() {
        console.log("getIpStatus")
        try {
            fetch(ip + "/testConnexion").then(response => {
                if (response.status == 200)
                    setIsConnected(true)
            }).catch(error => {
                console.error(error);
                setIsConnected(false)
            })
        } catch (error) {
            console.error(error);
            setIsConnected(false)
        }
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
            },
            ip: ip
        })
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
                },
                ip: props.userInfo.ip
            })
        }

         /**
         * Generates a random string containing numbers and letters
         * @function generateRandomString
         * @param  {number} length The length of the string
         * @return {string} The generated string
         */
        var generateRandomString = function(length : number) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        /**
         * Ensure the spotify connexion of the user
         * @function spotifyConnexion
         */
        async function spotifyConnexion() {
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
                },
                ip: props.userInfo.ip
            })
            const scopes = [
                'ugc-image-upload',
                'user-read-playback-state',
                'user-modify-playback-state',
                'user-read-currently-playing',
                'streaming',
                'app-remote-control',
                'user-read-email',
                'user-read-private',
                'playlist-read-collaborative',
                'playlist-modify-public',
                'playlist-read-private',
                'playlist-modify-private',
                'user-library-modify',
                'user-library-read',
                'user-top-read',
                'user-read-playback-position',
                'user-read-recently-played',
                'user-follow-read',
                'user-follow-modify'
              ].join(' ')

            try {
                await fetch(ip + "/spotify").then(response => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({uid: props.userInfo.id})
                    }
                    const uid = props.userInfo.id
                    fetch(ip + "/spotify/post/", requestOptions)
                    .then(response => {
                            response.json().then(data => {

                        })
                    })
                    response.json().then(data => {
                        console.log(data)
                        var clientID = data

                        const url = new URL('https://accounts.spotify.com/en/authorize?');

                        url.searchParams.append('response_type', 'code');
                        url.searchParams.append('client_id', clientID);
                        url.searchParams.append('scope', scopes);
                        url.searchParams.append('redirect_uri', 'http://localhost:8080/spotify/callback');
                        url.searchParams.append('state', generateRandomString(16));
                        url.searchParams.append('show_dialog', "true");

                        Linking.openURL(url.href).catch((err) => console.log('An error occurred', err))
                    })
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            }

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
                },
                ip: props.userInfo.ip
            
            })
            twitterAuth()
        }
        /**
         * Authenticates the user with Twitter OAuth.
         * @async
         * @function twitterAuth
        */    
        async function twitterAuth() {
            try {
                await fetch(ip + "/twitter/get").then(response => {
                    response.json().then(async data => {
                        const params = {
                            consumerKey: data.appKey,
                            consumerSecret: data.appSecret,
                            callbackUrl: 'http://localhost:8080/twitter/sign',
                            uid: props.userInfo.id
                        }
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({params: params})
                        }
                        await fetch(ip + "/twitter/login/", requestOptions)
                        .then(response => {
                            response.json().then(async data => {
                                if (data) {
                                    await Linking.openURL(data.body).catch((err) => console.log('An error occurred', err))
                                }
                            })
                        })
                    })
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            }
            
        }

        /**
         * Authenticates the user with Twitch API.
         * @async
         * @function twitchConnexion
        */ 
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
                },
                ip: props.userInfo.ip
            })
                const scopes = [
                    "analytics:read:extensions",
                    "analytics:read:games",
                    "moderator:read:followers",
                    "channel:manage:moderators",
                    "channel:manage:predictions",
                    "channel:manage:polls",
                    "user:manage:whispers"
                ].join(" ");
                const twitch_oauth_url = "https://id.twitch.tv/oauth2/authorize"
                const response_type = "token"
        
                twitchAuth(scopes, twitch_oauth_url, response_type)
            }
        /**
         * Authenticates the user with Twitch OAuth and send an access token to the back.
         * @async
         * @function twitchAuth
         * @param {string} scopes - The list of scopes to be authorized by the user.
         * @param {string} twitch_oauth_url - The URL for the Twitch OAuth endpoint.
         * @param {string} response_type - The response type for the authorization request.
        */    
        async function twitchAuth(scopes:string, twitch_oauth_url:string, response_type:string) {
            var url = "";
            try {
                await fetch(ip + "/twitch/get").then(response => {
                    response.json().then(async data => {
                        const params = {
                            client_id: data.clientId,
                            redirect_uri: data.redirect_url,
                            scope : scopes,
                            response_type: response_type
                        }
                        url = `${twitch_oauth_url}?${encodeUrlScope(params)}`
                        await Linking.openURL(url).catch((err) => console.log('An error occurred', err))
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({uid: props.userInfo.id})
                        }
                        const uid = props.userInfo.id
                        fetch(ip + "/twitch/post/", requestOptions)
                        .then(response => {
                                response.json().then(data => {

                            })
                        })
                    })
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            }
            
        }
        /**
         * Authenticates the user with Strava OAuth and send an accessToken / athleteId to the back.
         * @async
         * @function stravaConnexion
        */    
        async function stravaConnexion() {
            let token = "ImTestingATokenItIsSoFunnyStrava"
            var params = {};
            await fetch(ip + "/strava/auth/" + props.userInfo.id).then(response => {
                response.json().then(async data => {
                    await Linking.openURL(data).catch((err) => console.log('An error occurred', err))
                });
            });
   
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
                },
                ip: props.userInfo.ip
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

    function disconnect() {
        LoginManager.logOut();
        console.log("Déconnexion de Facebook");
        Navigation.popToRoot("mainStack");
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentScrollview}>
                <ProfileInfo />
                <SingleBlock leftImage={require("../assets/locate.png")} text={"Localisation : " + (location.city === "" ? "Inconnue" : location.city)} onPress={getLocalization} />
                <View style={[styles.localisationContainer, styles.shadows, {backgroundColor: isConnected ? "lightgreen" : "pink"}]}>
                    <Image source={require("../assets/ipLogo.png")} style={[styles.logoList, { left: 16, tintColor: "#5281B7" }]}/>
                    <TextInput
                        style={styles.textList}
                        onChangeText={(text) => setIp(text)}
                        value={ip}
                        placeholder={"Adresse ip"}
                        placeholderTextColor={"#7B7B7B"}
                        keyboardType="numbers-and-punctuation"
                        textContentType="URL"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={getIpStatus}
                        testID="ipAddress"
                    />
                </View>
                <ConnexionBlocks/>
                <SingleBlock leftImage={require("../assets/trash.png")} text={"Déconnexion"} onPress={disconnect} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    ipInput: {
        width: "80%",
        padding: 10,
        fontFamily: "Poppins-Medium",
        fontSize: 16,
    },
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
        marginLeft: 16,
        color: "black"
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