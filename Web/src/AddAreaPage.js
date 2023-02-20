import LogoSpotify from "./assets/spotify.png"
import LogoIss from "./assets/iss.png"
import LogoStrava from './assets/strava.png';
import LogoTwitch from './assets/twitch.png';
import LogoTwitter from './assets/twitter.png';
import LogoGoogle from './assets/google.png';
import LogoMeteo from './assets/meteo.png';
import LogoNasa from './assets/nasa.png';
import LogoArea from './assets/logo.png';
import CheckCircle from './assets/checkCircle.png'
import { useEffect, useState } from 'react';
import { ACTIONS, REACTIONS } from "./Common/Areas"
import { useNavigate } from "react-router-dom"
import { authWithCache } from './Common/Login';
import { ip } from "./env"
import uuid from 'react-native-uuid';
import Popup from "reactjs-popup";

/**
 * @brief Return the AddArea page for AREA
 * This page will be updated soon
 */
export default function AddAreaPage(props) {
    const navigate = useNavigate();

    const [pageInfo, setPageInfo] = useState({
        title: ["Selectionne une action", "Selectionne une réaction", "Choisie le titre de ton area"],
        list: [ACTIONS, REACTIONS, []],
        selectedIndex: [0, 0, 0],
        selectedConfig: [0],
        next: [goSelectReaction, goResume, sendArea],
        prev: [goHome, goSelectAction, goSelectReaction],
        index: 0,
        areaTitle: ""
    })

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
            authWithCache(props.setUserInformation, props, ip);
            console.log("Already logged in")
        } catch (error) {
            console.log("Unable to login" + error);
            navigate("/auth")
        }
    }, [])
    function goHome() {
        navigate("/home")
    }
    function updatePageIndex(index) {
        var n = pageInfo.selectedConfig
        n[2] = n[0]
        setPageInfo({
            title: pageInfo.title,
            list: pageInfo.list,
            selectedConfig: n,
            selectedIndex: pageInfo.selectedIndex,
            next: pageInfo.next,
            prev: pageInfo.prev,
            index: index,
            areaTitle: pageInfo.areaTitle
        })
    }
    function goSelectAction() {
        updatePageIndex(0)
    }
    function goSelectReaction() {
        updatePageIndex(1)
    }
    function goResume() {
        updatePageIndex(2)
    }
    async function sendArea() {
        if (props.userInformation.id !== "") {
            let area = {
                action: ACTIONS[pageInfo.selectedIndex[0]],
                reaction: REACTIONS[pageInfo.selectedIndex[1]],
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
                    uid: props.userInformation.id,
                    title: pageInfo.areaTitle
                })
            }
            try {
                await fetch(ip + "/register/areas", requestOptions).then(response => {
                    navigate('/home', { state: { newArea: area } })
                }).catch(error => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Une erreur est survenu.")
            navigate('/home')
        }
    }

    function ButtonValidate(props) {
        const style = {
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            width: 50,
            height: 50,
            cursor: "pointer"

        }
        return (
            <div style={style} onClick={props.action}>
                <img src={CheckCircle} alt={"Validation check"} style={{ position: "relative", width: 50, height: 50 }} />
            </div>
        )
    }

    function InfoBlock(props) {
        let border = props.selectedIndex === props.index ? "solid 2px darkblue" : "none";

        const style = {
            block: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "lightgrey",
                width: "300px",
                height: "150px",
                borderRadius: "20px",
                margin: "10px",
                cursor: "pointer",
                border: border,

                image: {
                    position: "relative",
                    width: "30px",
                    height: "30px",
                    margin: "5px"
                },
                title: {
                    position: "relative",
                    fontSize: "18px",
                    margin: "5px"
                },
                titleblock: {
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                },
                content: {
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    backgroundColor: "#5281B7",
                    width: "100%",
                    height: "100%",
                    borderRadius: "20px",
                }
            }
        }
        function selectIndex() {
            var newSelectedIndex = pageInfo.selectedIndex
            newSelectedIndex[pageInfo.index] = props.index
            var n = pageInfo.selectedConfig
            n[2] = n[0]
            setPageInfo({
                title: pageInfo.title,
                list: pageInfo.list,
                selectedConfig: n,
                selectedIndex: newSelectedIndex,
                next: pageInfo.next,
                prev: pageInfo.prev,
                index: pageInfo.index,
                areaTitle: pageInfo.areaTitle
            })
        }
        function PopupConfig() {
            return (
                <p style={{ backgroundColor: "lightgrey", padding: "2px 5px", borderRadius: "10px" }}>Config : {pageInfo.selectedConfig[pageInfo.index][props.index]}</p>
            )
        }
        function Config() {
            if (props.area.hasOwnProperty('config') && pageInfo.index === 2) {
                return (
                    <Popup trigger={PopupConfig}>
                        <div style={{ position: "relative", backgroundColor: "lightgrey", width: "100%", height: "100%", padding:"10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {
                                props.area.config.map((item, index) => {
                                    var color = pageInfo.selectedConfig[pageInfo.index][props.index] === index ? "red" : "blue"
                                    return (
                                        <div style={{ position: "relative", backgroundColor: color, width: "100%", height: "100%", textAlign: "center", margin:"2px", borderRadius:"10px" }} onClick={() => {var newSelected = pageInfo.selectedConfig; newSelected[pageInfo.index][props.index] = index; setPageInfo({title: pageInfo.title, list: pageInfo.list, selectedIndex: pageInfo.selectedIndex, selectedConfig: newSelected, next: pageInfo.next, prev: pageInfo.prev, index: pageInfo.index, areaTitle: pageInfo.areaTitle})}}>{item}</div>
                                    )
                                })
                            }
                        </div>
                    </Popup>
                )
            }
        }
        var a = (props.area.hasOwnProperty('config') && pageInfo.index === 2) ? props.area.config[pageInfo.selectedConfig[pageInfo.index][props.index]] : ""
        return (
            <div style={style.block}
                onClick={selectIndex}>

                <div style={style.block.titleblock}>
                    <img src={logo[props.area.service.name]} style={style.block.image} />
                    <div style={style.block.title}>{props.area.service.name}</div>
                </div>
                <div style={style.block.content}>{props.area.description.split("{config}").join(a)}
                    <Config />
                </div>
            </div>
        )
    }

    function SelectionBlock(props) {
        const style = {
            block: {
                position: "relative",
                display: "grid",
                gridTemplateColumns: "repeat(3, auto)",
                justifyContent: "space-around",
                alignItems: "center",
                width: "minmax(300px, 100%)",
                height: "100%",
                padding: "10px",
            }
        }
        return (
            <div style={style.block}>
                {
                    props.list.map((item, index) => {
                        return (
                            <InfoBlock area={item} index={index} selectedIndex={props.selectedBlock} />
                        )
                    }
                    )
                }
            </div>
        )
    }

    function setAreaTitle(value) {
        var n = pageInfo.selectedConfig
        n[2] = n[0]
        setPageInfo({
            title: pageInfo.title,
            list: pageInfo.list,
            selectedConfig: n,
            selectedIndex: pageInfo.selectedIndex,
            next: pageInfo.next,
            prev: pageInfo.prev,
            index: pageInfo.index,
            areaTitle: value
        })
    }
    function AreaResume() {
        const style = {
            global: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            },
            actionTitle: {
                position: "relative"
            },
            reactionTitle: {
                position: "relative"
            }
        }
        if (pageInfo.index === 2) {
            return (
                <div style={style.global}>
                    <input placeholder="Title" type="text" onChange={(event) => { setAreaTitle(event.target.value) }} />
                    <div style={style.actionTitle}>ACTION</div>
                    <InfoBlock area={ACTIONS[pageInfo.selectedIndex[0]]} index={-1} selectedIndex={0} />
                    <div style={style.reactionTitle}>REACTION</div>
                    <InfoBlock area={REACTIONS[pageInfo.selectedIndex[1]]} index={-1} selectedIndex={0} />
                </div>
            )
        }
    }
    function Body() {
        const style = {
            body: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
            },
            bottomButtons: {
                position: "relative",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%"
            },
            button: {
                position: "relative",
                border: "solid 1px",
                borderRadius: "10px",
                cursor: "pointer",
                padding: "5px",
                backgroundColor: "lightgrey"
            }
        }
        return (
            <div style={style.body}>
                <h2>{pageInfo.title[pageInfo.index]}</h2>
                <SelectionBlock title={pageInfo.title[pageInfo.index]} list={pageInfo.list[pageInfo.index]} selectedBlock={pageInfo.selectedIndex[pageInfo.index]} />
                <AreaResume />
                <div style={style.bottomButtons}>
                    <div style={style.button} onClick={pageInfo.prev[pageInfo.index]}>{"<= previous"}</div>
                    <div style={style.button} onClick={pageInfo.next[pageInfo.index]}>{"next =>"}</div>
                </div>
            </div>
        )
    }
    function Header() {
        const style = {
            global: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "50px",
                padding: "10px",
            },
            title: {
                position: "relative",
                marginLeft: "10px"
            },
            image: {
                position: "relative",
                width: "50px",
                height: "50px",
                cursor: "pointer"
            }
        }

        return (
            <div style={style.global}>
                <img src={LogoArea} style={style.image} onClick={() => { navigate("/home") }} />
                <h1 style={style.title}>Ici, tu peux créer ton area !</h1>
            </div>
        )
    }
    const globalStyle = {
        position: "relative",
    }
    return (
        <div style={globalStyle}>
            <Header />
            <Body />
        </div>
    );
}