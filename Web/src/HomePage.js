import React, { useState, useEffect } from 'react';
import TrashImage from './assets/trash.png';
import AddImage from "./assets/add.png";
import { useNavigate } from "react-router-dom"

/**
 * @brief Return the Home page for AREA
 * This page will be updated soon
 */
export default function HomePage() {
    const [allAreas, setAllAreas] = useState([])
    const [asked, setAsked] = useState(false)
    const [userInformation, setUserInformation] = useState({
        mail: "yoyoyo",
        coord: {
            latitude: 0,
            longitude: 0,
            city: ""
        },
        id: "testWallah",
        services: {
            spotifyId: "",
            googleId: "",
            twitterId: "",
            twitchId: "",
            stravaId: ""
        }
    });
    const [location, setLocation] = useState({latitude: userInformation.coord.latitude, longitude: userInformation.coord.longitude, city: userInformation.coord.city})

    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserInformation({
                    mail: userInformation.mail,
                    coord: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        city: userInformation.coord.city
                    },
                    id: userInformation.id,
                    services: {
                        spotifyId: userInformation.services.spotifyId,
                        googleId: userInformation.services.googleId,
                        twitterId: userInformation.services.twitterId,
                        twitchId: userInformation.services.twitchId,
                        stravaId: userInformation.services.stravaId
                    }
                })
                setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude, city: userInformation.coord.city})
            })
        }
    })

    useEffect(() => {
        if (asked) {
            fetch("https://api-adresse.data.gouv.fr/reverse/?lon=" + location.longitude + "&lat=" + location.latitude)
            .then((res) => {
                res.json()
                    .then((jsonRes) => {
                        if (jsonRes && jsonRes.features && jsonRes.features[0] && jsonRes.features[0].properties)
                            setLocation({latitude: location.latitude, longitude: location.longitude, city: jsonRes.features[0].properties.city});
                        else {
                            setLocation({latitude: location.latitude, longitude: location.longitude, city: location.city});
                            alert("Une erreur a été rencontrée en essayant de trouver votre ville à partir de votre localisation. Vos données ont tout de même été mises à jour.")
                        }
                    })
            }).catch((err) => {
                console.warn("error while fetching city from location: ", err)
            })
            setAsked(true)
        }

        setUserInformation({
            mail: userInformation.mail,
            coord: {
                latitude: location.latitude,
                longitude: location.longitude,
                city: location.city
            },
            id: userInformation.id,
            services: {
                spotifyId: userInformation.services.spotifyId,
                googleId: userInformation.services.googleId,
                twitterId: userInformation.services.twitterId,
                twitchId: userInformation.services.twitchId,
                stravaId: userInformation.services.stravaId
            }
        })
    }, [location])

    function removeAreaFromList(index) {
        let copyItems = [...allAreas];
        copyItems.splice(index, 1);
        setAllAreas(copyItems);
    }

    function AreaBlock(props) {
        return (
            <div style={{
                display: "flex",
                width: 400,
                height: 100,
                borderRadius: 20,
                marginTop: 24,
                flexDirection: "row",
                backgroundColor: "#95B8D1",
            }}>
                <div style={{
                    display: "flex",
                    flex: 3,
                    justifyContent: "space-around",
                    paddingVertical: 12,
                    flexDirection: "column",
                    width: "100%",
                }}>
                    <span style={{
                        marginLeft: 20,
                        fontSize: 15,
                        fontFamily: "Poppins-Regular"
                    }}>{props.area.action.description}</span>
                    <span style={{
                        marginLeft: 20,
                        fontSize: 15,
                        fontFamily: "Poppins-Regular"
                    }}>{props.area.reaction.description}</span>
                </div>
                <div style={{
                    flex: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex"
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                    }} onClick={() => removeAreaFromList(props.index)}>
                        <img src={TrashImage} alt={"Logo de poubelle"} style={{
                            width: 40,
                            height: 40,
                            color: "black"
                        }}/>
                    </div>
                </div>
            </div>
        )
    }

    function DisplayAreas() {
        if (allAreas.length !== 0)
            return (
                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                    {
                        allAreas.map((item, index) => {
                            return (
                                <AreaBlock area={item} index={index}/>
                            )}
                        )
                    }
                </div>
            )
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column"
            }}>
                <h3>Tu n'as pas encore créé d'AREA 🥺</h3>
            </div>
        )
    }

    const addArea = (props) => {
        if (props.length !== 0)
            navigate('/addArea', props)
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: 50
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                position: "relative"
            }}>
                <h1 style={{fontSize: 50, marginBottom: 10}}>Re-Bonjour !</h1>
                <img src={AddImage} style={{width: 80, height: 80, position: "absolute", right: 150, top: 30, color: "black"}} onClick={addArea}/>
            </div>
            <h2 style={{fontSize: 40, marginTop: 0, textAlign: "center"}}>AREAs actives</h2>
            <DisplayAreas />
        </div>

    )
}