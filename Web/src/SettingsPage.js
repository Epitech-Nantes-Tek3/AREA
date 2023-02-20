/**
 * @file SettingsPage.js
 * @description This file contains the settings page of the application
 * @module SettingsPage
 */

import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { ip } from "./env"
import ProfileImage from './assets/avatar.png';
import GoogleImage from './assets/google.png';
import SpotifyImage from './assets/spotify.png';
import TwitterImage from './assets/twitter.png';
import TwitchImage from './assets/twitch.png';
import StravaImage from './assets/strava.png';
import LocationImage from './assets/locate.png';
import DeconnexionImage from './assets/deconnexion.png';
import ArrowRight from './assets/arrowRight.png';
import { addDataIntoCache } from './Common/CacheManagement'
import { authWithCache } from './Common/Login';

const querystring  = require('querystring');
const locationURL = require('location-href')

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

    useEffect(() => {
        try {
            authWithCache(props.setUserInformation, props, ip);
            console.log("Already logged in")
        } catch (error) {
            console.log("Unable to login" + error);
            navigate("/auth")
        }
    }, [])
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
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    var generateRandomString = function(length) {
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
     * Ensure the log in of the user in the services
     * @param {string} serviceName the name of the service where you want to register
     */
    async function LogWith(serviceName) {
        if (serviceName === 'Spotify') {
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
                await fetch(ip + "/spotify").then(response => {
                    response.json().then(data => {
                        var clientID = data

                        const url = 'https://accounts.spotify.com/authorize?' +
                            querystring.stringify({
                            response_type: 'code',
                            client_id: clientID,
                            scope: scopes,
                            show_dialog : true,
                            redirect_uri: 'http://localhost:8080/spotify/callback',
                            state : generateRandomString(16)
                        })

                        window.open(url, 'popup', 'width=600,height=800')
                    })
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            }
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
            <div id={props.service} style={styles.service} onMouseOver={updateCursor} onMouseOut={updateCursor} onClick={()=> LogWith(props.service)}>
                <img src={props.image} style={styles.serviceImage}></img>
                <p style={styles.serviceText}>Connexion à {props.service}</p>
                <img src={ArrowRight} style={styles.serviceArrow}></img>
            </div>
        )
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
                <Service image={GoogleImage} service="Google" />
                <Service image={SpotifyImage} service="Spotify" />
                <Service image={TwitterImage} service="Twitter" />
                <Service image={TwitchImage} service="Twitch" />
                <Service image={StravaImage} service="Strava" />
            </div>
        )
    }
    /**
     * It returns a div with a clickable image and a text
     * @function Deconnexion - The deconnexion div
     * @returns A deconnexion button
     */
    function Deconnexion() {
        return (
            <div style={styles.deconnexion} onClick={() => {addDataIntoCache("area", {}); navigate('/auth')}} onMouseOver={updateCursor} onMouseOut={updateCursor}>
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
    return (
        <div id='global' style={{textAlign:'center'}}>
            <Header />
            <Profile />
            <Location />
            <ServicesAuth />
            <Deconnexion />
        </div>
    )
}
