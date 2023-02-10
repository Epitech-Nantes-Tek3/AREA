import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { ip } from "./env"
import './SettingsPage.css'
import HomeImage from './assets/logo.png';
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
            </div>
            <h1>Settings</h1>
            <p>Mail: {props.userInformation.mail}</p>
            <p>Location: {props.userInformation.coord.city}</p>
            <p
                onClick={() => {
                    addDataIntoCache("area", {ip}, {});
                    navigate('/auth')
                }}
            >Déconnexion</p>
        </div>
    )
}