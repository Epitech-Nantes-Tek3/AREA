import React, { useState, useEffect } from 'react';
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
import { getAllCacheData, addDataIntoCache } from './CacheManagement'

export default function SettingsPage(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useState('')

    useEffect(() => {
        loginWithCache("/settings");
    }, [])
    useEffect(() => {
        getLocalization();
    }, [props.hasAuthorization])
    const loginWithCache = async (page) => {
        var cacheData = await getAllCacheData();
        if (cacheData !== undefined && cacheData.mail !== undefined) {
          props.userInformation.mail = cacheData.mail;
          navigate(page);
        } else {
          navigate('/auth')
        }
      }
    async function getAddressFromCoordinates(lat, long) {
        fetch("https://api-adresse.data.gouv.fr/reverse/?lon=" + long + "&lat=" + lat)
            .then((res) => {
                res.json()
                    .then((jsonRes) => {
                        if (jsonRes && jsonRes.features && jsonRes.features[0] && jsonRes.features[0].properties)
                            setLocation({latitude: lat, longitude: long, city: jsonRes.features[0].properties.city});
                        else {
                            setLocation({latitude: lat, longitude: long, city: location.city});
                            alert("Erreur",
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
    async function getLocalization() {
        if (props.hasAuthorization) {
            navigator.geolocation.getCurrentPosition(
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
                            await fetch(ip + "register/position", requestOptions).then(response => {
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
    return (
        <div id='global'>
            <div id='home'>
                <div id='homehome' class='clickable-text'>
                    <img
                        src={HomeImage}
                        alt="Home"
                        style={{
                            width:50,
                            height:50
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
                            width:50,
                            height:50
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
                            width:50,
                            height:50
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
                            width:50,
                            height:50
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
                            width:50,
                            height:50
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
                            width:50,
                            height:50
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
                        width:100,
                    }}
                    onClick={() => {
                        addDataIntoCache("area", {ip}, {});
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