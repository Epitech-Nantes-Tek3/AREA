import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { ip } from "./env"
import logoImage from './assets/logo.png';
import ProfileImage from './assets/avatar.png';
import GoogleImage from './assets/google.png';
import SpotifyImage from './assets/spotify.png';
import TwitterImage from './assets/twitter.png';
import TwitchImage from './assets/twitch.png';
import StravaImage from './assets/strava.png';
import LocationImage from './assets/locate.png';
import DeconnexionImage from './assets/deconnexion.png';
import ArrowRight from './assets/arrowRight.png';
import { addDataIntoCache } from './CacheManagement'
import { loginWithCache } from './Common/Login'

/**
 * Styles of the page
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
        width: 30,
        height: 30,
    },
}

/**
 * Settings page of the application
 * @param {Object} props contains the user information and allAreas
 * @returns The html page
 */
export default function SettingsPage(props) {
    const navigate = useNavigate();

    useEffect(() => {
        if (loginWithCache("/settings", props).page === '/auth') {
            navigate("/auth");
        }
        console.log("SettingsPage.js: useEffect")
        console.log(props.userInformation)
    }, [])

    /**
     * It returns a div with a profile picture and an email address
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
     * It returns a div with an image and a text element
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
     * It returns a div with an image, a text and another image
     * @param props - the props object
     * @returns A div with an image, a text and an arrow.
     */
    function Service(props) {
        return (
            <div id={props.service} style={styles.service}>
                <img src={props.image} style={styles.serviceImage}></img>
                <p style={styles.serviceText}>Connexion à {props.service}</p>
                <img src={ArrowRight} style={styles.serviceArrow}></img>
            </div>
        )
    }
    /**
     * It returns a div with a style of connexionServices, which contains 5
     * Service components
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
     * @returns A deconnexion button
     */
    function Deconnexion() {
        return (
            <div style={styles.deconnexion} onClick={() => {addDataIntoCache("area", {ip}, {}); navigate('/auth')}}>
                <img src={DeconnexionImage}></img>
                <p>Deconnexion</p>
                <p></p>
            </div>
        )
    }
    /**
     * The function goHome() is called when the user clicks on the "Home" button
     */
    function goHome() {
        navigate('/home');
    }
    /**
     * If the cursor is a pointer, make it default. If the cursor is default, make
     * it a pointer
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
     * @returns A div with a header image, a header title, and a div.
     */
    function Header() {
        return (
            <div style={styles.header}>
                <img src={logoImage} style={styles.headerBackButton} onClick={goHome} onMouseOver={updateCursor} onMouseOut={updateCursor}></img>
                <div style={styles.headerTitle}>Settings</div>
                <div></div>
            </div>
        )
    }
    return (
        <div id='global' style={{textAlign:'center'}}>
            {/* <h1>Settings</h1> */}
            <Header />
            <Profile />
            <Location />
            <ServicesAuth />
            <Deconnexion />
        </div>
    )
}
