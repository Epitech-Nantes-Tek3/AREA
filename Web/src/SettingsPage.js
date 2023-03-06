/**
 * @file SettingsPage.js
 * @description This file contains the settings page of the application
 * @module SettingsPage
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import ProfileImage from './assets/avatar.png';
import GoogleImage from './assets/google.png';
import SpotifyImage from './assets/spotify.png';
import TwitterImage from './assets/twitter.png';
import TwitchImage from './assets/twitch.png';
import StravaImage from './assets/strava.png';
import LocationImage from './assets/locate.png';
import DeconnexionImage from './assets/deconnexion.png';
import ArrowRight from './assets/arrowRight.png';
import { addDataIntoCache, getDataFromCache } from './Common/CacheManagement'
import { authWithCache } from './Common/Login';
import { useLocation } from 'react-router-dom';
import { auth } from './firebaseConfig';

const querystring = require('querystring-es3');

/**
 * @description Styles of the page
 * @constant {Object} styles - Styles of the page
 */
const styles = {
    profile: {
        position: 'relative',
        backgroundColor: '#5281B7',
        width: "20%",
        height: 100,
        left: "40%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 15,
        marginBottom: 10
    },
    profilePicture: {
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 100,
        left: "5%",
    },
    profileEmail: {
        position: 'relative',
    },
    profileRectEmail: {
        position: 'relative',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    location: {
        position: 'relative',
        backgroundColor: '#5281B7',
        width: "20%",
        height: 50,
        left: "40%",
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 15,
        marginBottom: 10
    },
    locationText: {
        position: 'relative',
    },
    locationImage: {
        position: 'relative',
        width: 30,
        height: 30,
    },
    connexionServices: {
        position: 'relative',
        width: "20%",
        left: "40%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 15,
        marginBottom: 10
    },
    service: {
        position: 'relative',
        backgroundColor: '#5281B7',
        height: 50,
        width: "100%",
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    serviceImage: {
        position: 'relative',
        width: 30,
        height: 30,
    },
    serviceArrow: {
        position: 'relative',
        width: 15,
        height: 30,
    },
    deconnexion: {
        position: 'relative',
        backgroundColor: '#5281B7',
        height: 50,
        width: "20%",
        left: "40%",
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
        marinTop: 10
    },
    header: {
        position: 'relative',
        height: 50,
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 15,
        marginBottom: 10,
    },
    headerTitle: {
        position: 'relative',
        color: '#000000',
        fontSize: 32,
        fontWeight: 'bold',
    },
    headerBackButton: {
        position: 'relative',
        width: 15,
        height: 30,
        transform: 'rotate(180deg)',
        paddingLeft: 10,
    },
    subHeader: {
        position: 'relative',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerHomeText: {
        position: 'relative',
    }
}

/**
 * @description Settings page of the application
 * @function SettingsPage - The settings page
 * @param {Object} props contains the user information and allAreas
 * @returns The html page
 */
export default function SettingsPage(props) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        try {
            authWithCache(props.setUserInformation, props);
            console.log("Already logged in")
        } catch (error) {
            console.log("Unable to login" + error);
            navigate("/auth")
        }
    }, [])
    useEffect(() => {
        updateIP({target:{value: props.userInformation.ip}})
    }, [props.userInformation.id])
    /**
     * It returns a div with a profile picture and an email address
     * @function Profile - The profile div
     * @returns A div with a profile picture and the email of the user.
     */
    function Profile() {
        return (
            <div style={styles.profile}>
                <img src={ProfileImage} style={styles.profilePicture}></img>
                <div style={styles.profileRectEmail}>
                    <div style={styles.profileEmail}>{props.userInformation.mail}</div>
                </div>
            </div>
        )
    }

    /**
     * Generates a random string containing numbers and letters
     * @function generateRandomString
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    var generateRandomString = function (length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    /**
     * It returns a div with an image and a text element
     * @function Location - The location div
     * @returns A div with a location image and a text that says the city of the
     * user.
     */
    function Location() {
        return (
            <div style={styles.location}>
                <img src={LocationImage} style={styles.locationImage}></img>
                <p style={styles.locationText}>{(props.userInformation.coord.city == null) ? props.userInformation.coord.city : "UNDEFINED"}</p>
            </div>
        )
    }


    /**
     * Ensure the log in of the user on Spotify
     * @function spotifyConnexion
     * @async
     */
    async function spotifyConnexion() {
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
        ].join(' ');

        try {
            await fetch(props.userInformation.ip + "/spotify").then(response => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({uid: props.userInformation.id})
                }
                const uid = props.userInformation.id
                fetch(props.userInformation.ip + "/spotify/post/", requestOptions)
                .then(response => {
                        response.json().then(data => {

                    })
                })
                response.json().then(data => {
                    var clientID = data

                    const url = 'https://accounts.spotify.com/authorize?' +
                        querystring.stringify({
                            response_type: 'code',
                            client_id: clientID,
                            scope: scopes,
                            show_dialog: true,
                            redirect_uri: 'http://localhost:8080/spotify/callback',
                            state: generateRandomString(16)
                        })
                    console.log(url)
                    window.open(url, 'popup', 'width=600,height=800')
                })
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * It returns a div with an image, a text and another image
     * @function Service - The service div
     * @param props - the props object
     * @returns A div with an image, a text and an arrow.
     */
    function Service(props) {
        return (
            <div id={props.service} style={styles.service} onMouseOver={updateCursor} onMouseOut={updateCursor} onClick={props.onPress}>
                <img src={props.image} style={styles.serviceImage}></img>
                <p style={styles.serviceText}>Connexion à {props.service}</p>
                <img src={ArrowRight} style={styles.serviceArrow}></img>
            </div>
        )
    }
    /**
     * Authenticates the user with Strava API.
     * @async
     * @function stravaConnection
    */
    async function stravaConnection() {
         console.log('strava connection');
         console.log(props);
         await fetch(props.userInformation.ip + '/strava/auth/' + props.userInformation.id, {
             method: 'GET',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             }
         })
         .then((response) => {
             response.json().then(async (data) => {
                 window.open(data, 'popup', 'width=600,height=800')
             });
         });
     }

    /**
     * Authenticates the user with Twitch API.
     * @function twitchConnexion
    */
    function twitchConnexion() {
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
     * Encode Uri
     * @function encodeQueryString
     * @param {*} params contains the elements to be added to the url.
     * @returns a string separated by an "&".
     */
    function encodeUrlScope(params)
    {
        let items = []
        for (let key in params) {
            let value = encodeURIComponent(params[key])
            items.push(`${key}=${value}`)
        }
        return items.join("&")
    }


    /**
     * Authenticates the user with Twitch OAuth and send an access token to the back.
     * @async
     * @function twitchAuth
     * @param {string} scopes - The list of scopes to be authorized by the user.
     * @param {string} twitch_oauth_url - The URL for the Twitch OAuth endpoint.
     * @param {string} response_type - The response type for the authorization request.
    */
    async function twitchAuth(scopes, twitch_oauth_url, response_type) {
        var url = "";
        try {
            await fetch(props.userInformation.ip + "/twitch/get").then(response => {
                response.json().then(async data => {
                    const params = {
                        client_id: data.clientId,
                        redirect_uri: data.redirect_url,
                        scope : scopes,
                        response_type: response_type
                    }
                    url = `${twitch_oauth_url}?${encodeUrlScope(params)}`
                    window.open(url, 'popup', 'width=600,height=800')
                    // await Linking.openURL(url).catch((err) => console.log('An error occurred', err))
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({uid: props.userInformation.id})
                    }
                    fetch(props.userInformation.ip + "/twitch/post/", requestOptions)
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
     * It returns a div with a style of connexionServices, which contains 5
     * Service components
     * @function ServicesAuth - The services auth div
     * @returns A div with the className connexionServices and a list of Service
     * components.
     */
    function ServicesAuth() {
        return (
            <div style={styles.connexionServices}>
                <Service image={GoogleImage} service="Google"onPress={googleConnexion}/>
                <Service image={SpotifyImage} service="Spotify" onPress={spotifyConnexion} />
                <Service image={TwitterImage} service="Twitter" onPress={twitterConnexion}/>
                <Service image={TwitchImage} service="Twitch" onPress={twitchConnexion} />
                <Service image={StravaImage} service="Strava" onPress={stravaConnection}/>
            </div>
        )
    }
    /**
     * Empty for the moment
     * @function stravaConnexion
    */
    function stravaConnexion() {
    }

    /**
     * Empty for the moment
     * @function twitterConnexion
     * @async
    */
    async function twitterConnexion() {
        try {
            await fetch(props.userInformation.ip + "/twitter/get").then(response => {
                response.json().then(async data => {
                    const params = {
                        consumerKey: data.appKey,
                        consumerSecret: data.appSecret,
                        callbackUrl: 'http://localhost:8080/twitter/sign',
                        uid: props.userInformation.id
                    }
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({params: params})
                    }
                    await fetch(props.userInformation.ip + "/twitter/login/", requestOptions)
                    .then(response => {
                        response.json().then(async data => {
                            if (data) {
                                 window.open(data.body, 'popup', 'width=600,height=800')
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
     * Empty for the moment
     * @function googleConnexion
    */
    function googleConnexion() {
    }

    /**
     * It returns a div with a clickable image and a text
     * @function Deconnexion - The deconnexion div
     * @returns A deconnexion button
     */
    function Deconnexion() {
        return (
            <div style={styles.deconnexion} onClick={() => { auth.signOut().then(() => {console.log('disconnected')}) ; addDataIntoCache("area", {}); navigate('/auth') }} onMouseOver={updateCursor} onMouseOut={updateCursor}>
                <img src={DeconnexionImage}></img>
                <p>Deconnexion</p>
                <p></p>
            </div>
        )
    }
    /**
     * The function goHome() is called when the user clicks on the "Home" button
     * @function goHome - The function that is called when the user clicks on the
     * "Home" button
     */
    function goHome() {
        navigate('/home');
    }
    /**
     * If the cursor is a pointer, make it default. If the cursor is default, make
     * it a pointer.
     * @function updateCursor - The function that is called when the user hovers
     * over a div
     */
    function updateCursor() {
        var cursor = document.getElementById('global');
        if (cursor.style.cursor === 'pointer') {
            cursor.style.cursor = 'default';
        } else {
            cursor.style.cursor = 'pointer';
        }
    }
    /**
     * This function returns a div with a Google image, a title, and a blank div
     * @function Header - The header div
     * @returns A div with a header image, a header title, and a div.
     */
    function Header() {
        return (
            <div style={styles.header}>
                <div style={styles.subHeader} onClick={goHome} onMouseOver={updateCursor} onMouseOut={updateCursor}>
                    <img src={ArrowRight} style={styles.headerBackButton}></img>
                    <p style={styles.headerHomeText}>Home</p>
                </div>
                <div style={styles.headerTitle}>Settings</div>
                <div></div>
            </div>
        )
    }

    const [color, setColor] = useState('black')

    /**
     * It fetches a resource, but if the fetch takes longer than the timeout, it
     * aborts the fetch
     * @function fetchWithTimeout
     * @param {string} resource - The URL to fetch.
     * @param {*} [options] - An object containing any custom settings that you want
     * to apply to the request.
     * @returns A function that takes two parameters, resource and options.
     */
    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 8000 } = options;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    }

    /**
     * It updates the IP address of the user in the state of the application
     * @function updateIP
     * @param event - the event that triggered the function
     */
    function updateIP(event) {
        setColor("black")
        console.log(event.target.value)
        try {
            fetchWithTimeout(event.target.value + "/testConnexion", { timeout: 500 }).then(response => {
                if (response.status == 200) {
                    setColor("#5281B7")
                } else {
                    setColor("red")
                }
                console.log(response)
            }).catch(error => {
                setColor("red")
                console.log(error)
            })
        } catch (error) {
            setColor("red")
            console.log(error)
        }
        props.setUserInformation({
            mail: props.userInformation.mail,
            locationAccept: props.userInformation.locationAccept,
            coord: {
                latitude: props.userInformation.coord.latitude,
                longitude: props.userInformation.coord.longitude,
                city: props.userInformation.coord.city
            },
            id: props.userInformation.id,
            services: {
                spotifyId: props.userInformation.spotifyId,
                googleId: props.userInformation.googleId,
                twitterId: props.userInformation.twitterId,
                twitchId: props.userInformation.twitchId,
                stravaId: props.userInformation.stravaId
            },
            ip: event.target.value
        })
    }

    const ipStyle = {
        ip: {
            position: 'relative',
            backgroundColor: color,
            width: "20%",
            height: 50,
            left: "40%",
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderRadius: 15,
            marginBottom: 10
        },
    }
    return (
        <div id='global' style={{ textAlign: 'center' }}>
            <Header />
            <Profile />
            <div style={ipStyle.ip}>
                <div>
                    {props.userInformation.ip}
                </div>
            </div>
            <Location />
            <ServicesAuth />
            <Deconnexion />
        </div>
    )
}
