import LogoSpotify from "./assets/spotify.png"
import LogoIss from "./assets/iss.png"
import LogoStrava from './assets/strava.png';
import LogoTwitch from './assets/twitch.png';
import LogoTwitter from './assets/twitter.png';
import LogoGoogle from './assets/google.png';
import LogoMeteo from './assets/meteo.png';
import LogoNasa from './assets/nasa.png'
import CheckCircle from './assets/checkCircle.png'
import { useEffect, useState } from 'react';
import { ACTIONS, REACTIONS } from "./Common/Areas"
import { useNavigate } from "react-router-dom"
import { authWithCache } from './Common/Login';
import uuid from 'react-native-uuid';

/**
 * @brief Return the AddArea page for AREA
 * This page will be updated soon
 */
export default function AddAreaPage(props) {
    const [selectedActionIndex, setSelectedActionIndex] = useState(0)
    const [selectedReactionIndex, setSelectedReactionIndex] = useState(0)
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

    useEffect(() => {
        try {
            authWithCache(props.setUserInformation, props, props.userInformation.ip);
            console.log("Already logged in")
        } catch (error) {
            console.log("Unable to login" + error);
            navigate("/auth")
        }
    }, [])

    const sendArea = async () => {
        let area = {
            action: ACTIONS[selectedActionIndex],
            reaction: REACTIONS[selectedReactionIndex],
            id: uuid.v4().toString()
        }
        props.setAllAreas([...props.allAreas, area])
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: area.action,
                reaction: area.reaction,
                id: area.id,
                uid: props.userInformation.id
            })
        }
        try {
            await fetch(props.userInformation.ip + "/register/areas", requestOptions).then(response => {
                navigate('/home', {state : { newArea : area}})
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
        }
    }

    function ButtonValidate () {

        return (
            <div style={{borderRadius: 50, width: 60, height: 60, justifySelf: "center"}} onClick={sendArea}>
                <img src={CheckCircle} alt={"Validation check"} style={{width: 60, height: 60}}/>
            </div>
        )
    }

    function InfoBlock(props) {
        let color = props.selectedIndex === props.index ? "#392D37" : "#D7D7FF";
        let textColor = props.selectedIndex === props.index ? "#D7D7FF" : "#392D37";

        function selectIndex() {
            props.setIndex(props.index)
        }

        return (
            <div style={{
                    backgroundColor: color,
                    height: 125,
                    minWidth: 250,
                    maxWidth: 250,
                    borderRadius: 20,
                    marginRight: 16,
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                }}
                onClick={selectIndex}>

                <div style={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
                    <div style={{ flex: 1, marginBottom: 16, justifyContent: "center", alignContent: "center" }}>
                        <img
                            src={logo[props.area.service.name]}
                            alt={props.area.service.name + "logo"}
                            style={{ width: 50, height: 50, display: "block", margin: "auto" }}
                        />
                    </div>
                    <div style={{ flex: 2 }}>
                        <label style={{marginTop: 10, color: textColor, textTransform: "capitalize", fontSize: 25, display: "block", textAlign: "center"}}> {props.area.service.name} </label>
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <label style={{color: textColor, textAlign: "center", fontSize: 18, overflow: "scroll"}}> {props.area.description} </label>
                </div>
            </div>
        )
    }

    function SelectionBlock(props) {
        return (
            <div style={{flex: 1, display: "flex", flexDirection: "column", marginTop: 40,
            overflowX: 'scroll',
            whiteSpace: "nowrap", paddingRight: 10, marginLeft: 20}}>
                <span style={{fontSize: 25, marginLeft: 16, marginBottom: 16}}>{props.title}</span>
                <div style={{flexDirection: "row", display: "flex"}}>
                    {
                        props.list.map((item, index) => {
                            return (
                                <InfoBlock area={item} index={index} selectedIndex={props.selectedIndex} setIndex={props.setSelected}/>
                            )}
                        )
                    }
                </div>
            </div>
        )
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <h1 style={{fontSize: 50, textAlign: "center"}}>ADD AN AREA</h1>
            <SelectionBlock title={"Actions"} list={ACTIONS} selectedIndex={selectedActionIndex} setSelected={setSelectedActionIndex} />
            <SelectionBlock title={"Réactions"} list={REACTIONS} selectedIndex={selectedReactionIndex} setSelected={setSelectedReactionIndex} />
            <div style={{display: "flex", alignItems: "center", width: "100%", marginLeft: 50, marginTop: 30, marginBottom: 50}}>
                <span style={{width: "50%", fontSize: 25}}>
                    {ACTIONS[selectedActionIndex].description + ". " + REACTIONS[selectedReactionIndex].description + "."}
                </span>
            <ButtonValidate/>
            </div>
        </div>
    );
}