import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { ip } from "./env"
import './SettingsPage.css'
import ProfileImage from './assets/avatar.png';
import HomeImage from './assets/logo.png';
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

const styles = {
    profile: {
        position: 'relative',
        backgroundColor: '#5281B7',
        width: "50%",
        height: 150,
        left: "25%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 15,
        marginBottom: 10
    },
    profilePicture: {
        position: 'relative',
        width: 130,
        height: 130,
        borderRadius: 100,
        left: "5%",
    },
    profileEmail: {
        position: 'relative',
    },
    location: {
        position: 'relative',
        backgroundColor: '#5281B7',
        width: "33%",
        height: 50,
        left: "33%",
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
        width: "33%",
        left: "33%",
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
        width: "33%",
        left: "33%",
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
        marinTop: 10
    }
}

export default function SettingsPage(props) {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(loginWithCache("/settings", props));
    }, [])

    function Profile() {
        return (
            <div style={styles.profile}>
                <img src={ProfileImage} style={styles.profilePicture}></img>
                <div style={styles.profileEmail}>{props.userInformation.mail}</div>
            </div>
        )
    }
    function Location() {
        return (
            <div style={styles.location}>
                <img src={LocationImage} style={styles.locationImage}></img>
                <p style={styles.locationText}>{(props.userInformation.coord.city == null) ? props.userInformation.coord.city : "UNDEFINED"}</p>
            </div>
        )
    }
    function Service(props) {
        return (
            <div id={props.service} style={styles.service}>
                <img src={props.image} style={styles.serviceImage}></img>
                <p style={styles.serviceText}>Connexion à {props.service}</p>
                <img src={ArrowRight} style={styles.serviceArrow}></img>
            </div>
        )
    }
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
    function Deconnexion() {
        return (
            <div style={styles.deconnexion} onClick={() => {addDataIntoCache("area", {ip}, {}); navigate('/auth')}}>
                <img src={DeconnexionImage}></img>
                <p>Deconnexion</p>
                <p></p>
            </div>
        )
    }
    return (
        <div id='global'>
            <h1>Settings</h1>
            <Profile />
            <Location />
            <ServicesAuth />
            <Deconnexion />
        </div>
    )
}
