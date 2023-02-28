/**
 * @module HomePage
 */
import React, { useState, useEffect } from 'react';
import TrashImage from './assets/trash.png';
import AddAreaImage from "./assets/add.png";
import LogoImage from "./assets/logo.png";
import LogoSpotify from "./assets/spotify.png"
import LogoIss from "./assets/iss.png"
import LogoStrava from './assets/strava.png';
import LogoTwitch from './assets/twitch.png';
import LogoTwitter from './assets/twitter.png';
import LogoGoogle from './assets/google.png';
import LogoMeteo from './assets/meteo.png';
import LogoNasa from './assets/nasa.png';
import SettingsImage from "./assets/avatar.png";
import { useNavigate } from "react-router-dom"
import { authWithCache } from './Common/Login'
import Popup from 'reactjs-popup';

/**
 * @brief Return the Home page for AREA
 * This page will be updated soon
 */
export default function HomePage(props) {
    const [asked, setAsked] = useState(false)
    const [location, setLocation] = useState({ latitude: props.userInformation.coord.latitude, longitude: props.userInformation.coord.longitude, city: props.userInformation.coord.city })
    const navigate = useNavigate();

    let logo = {
        "spotify": LogoSpotify,
        "iss": LogoIss,
        "nasa": LogoNasa,
        "twitter": LogoTwitter,
        "google": LogoGoogle,
        "météo": LogoMeteo,
        "twitch": LogoTwitch,
        "strava": LogoStrava
    }

    const addArea = () => {
        navigate('/addArea')
    }

    const goSettings = () => {
        navigate('/settings')
    }

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
        const fetchData = () => {
            console.log(props.userInformation.id)
            fetch(props.userInformation.ip + "/getAreas/" + props.userInformation.id)
                .then(response => {
                    response.json().then(data => {
                        let areaArray = []
                        for (const area in data.areas) {
                            let action = data.areas[area].Action
                            let reaction = data.areas[area].Reaction
                            let id = data.areas[area].id
                            areaArray.push({ action: action, reaction: reaction, id: id })
                        }
                        props.setAllAreas(areaArray)
                    })
                })
                .catch(error => {
                    console.error(error);
                })
        };
        fetchData();
        if (props.userInformation.locationAccept === false && navigator.geolocation) {
            props.userInformation.locationAccept = true
        }
        if (props.userInformation.locationAccept) {
            navigator.geolocation.getCurrentPosition((position) => {
                props.setUserInformation({
                    mail: props.userInformation.mail,
                    locationAccept: props.userInformation.locationAccept,
                    coord: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        city: props.userInformation.coord.city
                    },
                    id: props.userInformation.id,
                    services: {
                        spotifyId: props.userInformation.services.spotifyId,
                        googleId: props.userInformation.services.googleId,
                        twitterId: props.userInformation.services.twitterId,
                        twitchId: props.userInformation.services.twitchId,
                        stravaId: props.userInformation.services.stravaId
                    },
                    ip: props.userInformation.ip
                })
                setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, city: props.userInformation.coord.city })
            })
        }
    }, [props.userInformation.id])

    useEffect(() => {
        if (asked === false) {
            fetch("https://api-adresse.data.gouv.fr/reverse/?lon=" + location.longitude + "&lat=" + location.latitude)
                .then((res) => {
                    res.json()
                        .then((jsonRes) => {
                            if (jsonRes && jsonRes.features && jsonRes.features[0] && jsonRes.features[0].properties) {
                                setLocation({ latitude: location.latitude, longitude: location.longitude, city: jsonRes.features[0].properties.city });
                            } else {
                                setLocation({ latitude: location.latitude, longitude: location.longitude, city: location.city });
                                console.log("Une erreur a été rencontrée en essayant de trouver votre ville à partir de votre localisation. Vos données ont tout de même été mises à jour.")
                            }
                        })
                }).catch((err) => {
                    console.warn("error while fetching city from location: ", err)
                })
            setAsked(true)
            props.setUserInformation({
                mail: props.userInformation.mail,
                locationAccept: props.userInformation.locationAccept,
                coord: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city
                },
                id: props.userInformation.id,
                services: {
                    spotifyId: props.userInformation.services.spotifyId,
                    googleId: props.userInformation.services.googleId,
                    twitterId: props.userInformation.services.twitterId,
                    twitchId: props.userInformation.services.twitchId,
                    stravaId: props.userInformation.services.stravaId
                },
                ip: props.userInformation.ip
            })
        }

    }, [location])
    /**
    * @description Remove an area from the list of areas
    * @function removeAreaFromList
    * @param {*} index The index of the area to remove
    */
    function removeAreaFromList(index) {
        async function supressArea() {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: props.userInformation.id, id: props.allAreas[index].id })
                }

                await fetch(props.userInformation.ip + "/remove/area", requestOptions).then(response => {
                    if (response.status === 200) {
                        let copyAreas = [...props.allAreas]
                        copyAreas.splice(index, 1)
                        props.setAllAreas(copyAreas)
                    } else {
                        console.log("Error")
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        supressArea()
    }

    /**
     * @description Display an area
     * @function DisplayArea
     * @param {*} props The props of the area
     * @returns The area to display
     */
    function DisplayArea(props) {
        const title = (props.area.title) ? props.area.title : "AREA " + props.index;
        const action = (props.area.action) ? props.area.action : "Action";
        const reaction = (props.area.reaction) ? props.area.reaction : "Reaction";
        const global = {
            position: "relative",
            backgroundColor: "lightgrey",
            padding: "10px",
            borderRadius: "10px",
            diplsay: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: "0.9",

            title: {
                fontSize: "20px",
                fontWeight: "bold",
            },
            action: {
                fontSize: "15px",
            },
            reaction: {
                fontSize: "15px",
            },
            trash: {
                position: "relative",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                border: "1px solid black",
                borderRadius: "20%",
            }

        }
        return (
            <div style={global}>
                <div style={global.title}>{title}</div>
                <div style={global.action}>{action.description}.</div>
                <div style={global.reaction}>{reaction.description}.</div>
                <img src={TrashImage} alt={"trash image"} style={global.trash} onClick={() => removeAreaFromList(props.index)} />
            </div>
        )
    }

    /**
     * @description Display the list of areas
     * @function DisplayAreas
     * @param {*} props The props of the list of areas
     * @returns The area block to display
     */
    function AreaBlock(props) {
        const title = (props.area.title) ? props.area.title : "AREA ";
        const actionLogo = (props.area.action.logo) ? props.area.action.logo : "https://www.flaticon.com/svg/static/icons/svg/25/25231.svg";
        const reactionLogo = (props.area.reaction.logo) ? props.area.reaction.logo : "https://www.flaticon.com/svg/static/icons/svg/25/25231.svg";
        const style = {
            areaBlock: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "lightgrey",
                width: "300px",
                height: "400px",
                borderRadius: "20px",
                margin: "10px",
                cursor: "pointer",

                title: {
                    position: "relative",
                    fontSize: "32px",
                    margin: "5px",
                },
                content: {
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    backgroundColor: "#5281B7",
                    width: "100%",
                    height: "150%",
                    borderRadius: "20px",
                    paddingVertical: "10px",
                },
                trash: {
                    position: "relative",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    border: "1px solid black",
                    borderRadius: "20%",
                }
            }
        }

        return (
            <div style={style.areaBlock}>
                <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "row", width: "100%" }}>
                    <img src={logo[props.area.action.serviceName]} alt={"Logo de l'action"} style={{ width: "30px", height: "30px", padding: "5px" }} />
                    <p style={style.areaBlock.title}>{title}</p>
                    <img src={logo[props.area.reaction.serviceName]} alt={"Logo de la réaction"} style={{ width: "30px", height: "30px", padding: "5px" }} />
                </div>
                <div style={style.areaBlock.content}>
                    <div style={{ padding: "5px", height: "50px" }}>
                        <p style={{ textAlign: "center", paddingLeft: "10px", paddingRight: "10px", fontSize: 24 }}>{props.area.action.description}</p>
                    </div>
                    <div style={{ padding: "5px", height: "50px" }}>
                        <p style={{ textAlign: "center", paddingLeft: "10px", paddingRight: "10px", fontSize: 24 }}>{props.area.reaction.description}</p>
                    </div>
                    <img src={TrashImage} alt={"trash image"} style={style.areaBlock.trash} onClick={() => removeAreaFromList(props.index)} />
                </div>
            </div>
        )
    }

    /**
     * @description Display the list of areas
     * @function DisplayAreas
     * @returns The list of areas to display
     */
    function DisplayAreas() {
        const style = {
            displayAreas: {
                position: "relative",
                display: "grid",
                gridAutoColumns: "3",
                gridTemplateColumns: "repeat(3, auto)",
                justifyContent: "space-around",
                alignItems: "safe center",
                width: "minmax(300px, 100%)",
                height: "100%",
                padding: "10px",
            },
            noArea: {
                position: "relative",
            }
        }

        if (props.allAreas.length !== 0) {
            return (
                <div style={style.displayAreas}>{
                    props.allAreas.map((item, index) => {
                        return (
                            <AreaBlock area={item} index={index} />
                        )
                    })
                }</div>
            )
        }
        return (
            <div style={style.displayAreas}>
                <h3 style={style.noArea}>Tu n'as pas encore créé d'AREA 🥺</h3>
            </div>
        )
    }

    /**
     * @description Display the header of the page
     * @function Header
     * @returns The header of the page
     */
    function Header() {
        const mail = props.userInformation.mail;
        const [buttonHoverState, setButtonHoverState] = useState(false);
        const style = {
            header: {
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "50px",
                padding: "10px",

                logo: {
                    position: "relative",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                },
                title: {
                    position: "relative",
                    paddingLeft: "10px",
                },
                settings: {
                    position: "relative",
                    width: "50px",
                    height: "50px",
                    marginLeft: "auto",
                    borderRadius: "50%",
                    cursor: "pointer",
                },
                button: {
                    all: "unset",
                    position: "relative",
                    border: "1px solid black",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    backgroundColor: buttonHoverState ? "lightgrey" : "transparent",
                }
            },
        }

        function mouseEnterButton() {
            setButtonHoverState(true);
            console.log("mouse enter");
        }
        function mouseLeaveButton() {
            setButtonHoverState(false);
            console.log("mouse leave");
        }
        return (
            <div style={{ position: "relative" }}>
                <div style={style.header}>
                    <img src={LogoImage} style={style.header.logo} alt="logo" />
                    <h1 style={style.header.title}>Re-Bonjour, {(mail) ? mail : "MAIL UNDEFINED"} !</h1>
                    <img src={SettingsImage} style={style.header.settings} onClick={goSettings} alt="settings" />
                </div>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <a style={style.header.button} onMouseEnter={mouseEnterButton} onMouseLeave={mouseLeaveButton} href='client.apk'>Télécharger client.apk</a>
                </div>
            </div>
        )
    }

    /**
     * @description Display the body of the page
     * @function Body
     * @returns The body of the page
     */
    function Body() {
        const style = {
            body: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                title: {
                    position: "relative",
                    fontSize: "32px",
                },
                addArea: {
                    position: "relative",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                },
            },
        }

        return (
            <div style={style.body}>
                <p style={style.body.title}>AREAS</p>
                <img style={style.body.addArea} src={AddAreaImage} onClick={addArea} alt="addArea" />
                <DisplayAreas />
            </div>
        )
    }
    const globalStyle = {
        position: "relative",
        fontFamily: "Avenir Next,Avenir Next W01, Avenir,helvetica,arial,sans-serif",
    }
    return (
        <div id="global" style={globalStyle}>
            <Header />
            <Body />
        </div>
    )
}