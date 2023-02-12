import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { ip } from "./env"
import './SettingsPage.css'
import HomeImage from './assets/logo.png';
import GoogleImage from './assets/google.png';
import SpotifyImage from './assets/spotify.png';
import TwitterImage from './assets/twitter.png';
import TwitchImage from './assets/twitch.png';
import StravaImage from './assets/strava.png';
import DeconnexionImage from './assets/deconnexion.png';
import { addDataIntoCache } from './CacheManagement'
import { loginWithCache } from './Common/Login'

export default function SettingsPage(props) {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(loginWithCache("/settings"));
    }, [])

    return (
        <div id='global'>
            <div id='home'>
                <div id='homehome' class='clickable-text'>
                    <img
                        src={HomeImage}
                        alt="Home"
                        style={{
                            width: 50,
                            height: 50
                        }}
                        onClick={() => {
                            navigate('/home')
                        }}
                    >
                    </img>
                    <p>Retour</p>
                </div>
            </div>
            <h1>Settings</h1>
            <p>Mail: {props.userInformation.mail}</p>
            <p>Location: {(props.userInformation.coord.city == null) ? props.userInformation.coord.city : "UNDEFINED"}</p>
            <div id="connexion-services">
                <div
                    class='clickable-text'
                >
                    <img src={GoogleImage}
                        alt="Google"
                        style={{
                            width: 50,
                            height: 50
                        }}
                    ></img>
                    <p>Connexion à google</p>
                </div>
                <div
                    class='clickable-text'
                >
                    <img src={SpotifyImage}
                        alt="Spotify"
                        style={{
                            width: 50,
                            height: 50
                        }}
                    ></img>
                    <p>Connexion à spotify</p>
                </div>
                <div
                    class='clickable-text'
                >
                    <img src={TwitterImage}
                        alt="Twitter"
                        style={{
                            width: 50,
                            height: 50
                        }}
                    ></img>
                    <p>Connexion à twitter</p>
                </div>
                <div
                    class='clickable-text'
                >
                    <img src={StravaImage}
                        alt="Strava"
                        style={{
                            width: 50,
                            height: 50
                        }}
                    ></img>
                    <p>Connexion à strava</p>
                </div>
                <div
                    class='clickable-text'
                >
                    <img src={TwitchImage}
                        alt="Twitch"
                        style={{
                            width: 50,
                            height: 50
                        }}
                    ></img>
                    <p>Connexion à twitch</p>
                </div>
            </div>
            <div
                id='deconnexion'>
                <div
                    class='clickable-text'
                    style={{
                        width: 100,
                    }}
                    onClick={() => {
                        addDataIntoCache("area", { ip }, {});
                        navigate('/auth')
                    }}
                >
                    <img
                        src={DeconnexionImage}
                    ></img>
                    <p>Deconnexion</p>
                </div>
            </div>
        </div>
    )
}