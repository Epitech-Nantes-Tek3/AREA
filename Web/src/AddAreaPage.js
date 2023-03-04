/**
 * @module AddAreaPage
 */
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
import uuid from 'react-native-uuid';

/**
 * @brief Return the AddArea page for AREA
 * This page will be updated soon
 */
export default function AddAreaPage(props) {
    const navigate = useNavigate();

    const [pageInfo, setPageInfo] = useState({
        title: ["Sélectionne une action", "Sélectionne une réaction", "Résumé de ton Area"],
        list: [ACTIONS, REACTIONS, []],
        selectedIndex: [0, 0, 0],
        next: [goSelectReaction, goResume, sendArea],
        prev: [goHome, goSelectAction, goSelectReaction],
        index: 0,
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
            authWithCache(props.setUserInformation, props);
            console.log("Already logged in")
        } catch (error) {
            console.log("Unable to login" + error);
            navigate("/auth")
        }
    }, [])

    /**
     * Navigate to home page
     * @function goHome
     */
    function goHome() {
        navigate("/home")
    }

    /**
     * Update the page index in userInformation
     * @function updatePageIndex
     * @param {number} index The new page index
     */
    function updatePageIndex(index) {
        setPageInfo({
            title: pageInfo.title,
            list: pageInfo.list,
            selectedIndex: pageInfo.selectedIndex,
            next: pageInfo.next,
            prev: pageInfo.prev,
            index: index,
        })
    }

    /**
     * Update the index page to 0
     * @function goSelectAction
     */
    function goSelectAction() {
        updatePageIndex(0)
    }

    /**
     * Update the index page to 1
     * @function goSelectReaction
     */
    function goSelectReaction() {
        updatePageIndex(1)
    }

    /**
     * Update the index page to 2
     * @function goResume
     */
    function goResume() {
        updatePageIndex(2)
    }

    /**
     * Send the new area to the server.
     * @async
     * @function sendArea
     */
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
                })
            }
            console.log(requestOptions.body.title)
            try {
                await fetch(props.userInformation.ip + "/register/areas", requestOptions).then(response => {
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

    /**
     * Return the html info block
     * @function InfoBlock
     * @param {*} props All properties needed for this function
     * @returns html info block
     */
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
                height: "200px",
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
                    fontSize: "32px",
                    margin: "5px",
                    textTransform: "capitalize",
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
                    fontSize: 24,
                }
            }
        }

        /**
         * Select the index in the corresponding list
         * @function selectedIndex
         */
        function selectIndex() {
            var newSelectedIndex = pageInfo.selectedIndex
            newSelectedIndex[pageInfo.index] = props.index
            setPageInfo({
                title: pageInfo.title,
                list: pageInfo.list,
                selectedIndex: newSelectedIndex,
                next: pageInfo.next,
                prev: pageInfo.prev,
                index: pageInfo.index,
            })
        }
        return (
            <div style={style.block}
                onClick={selectIndex}>

                <div style={style.block.titleblock}>
                    <img src={logo[props.area.serviceName]} style={style.block.image} />
                    <div style={style.block.title}>{props.area.serviceName}</div>
                </div>
                <div style={style.block.content}>
                    <p style={{textAlign: "center", padding: "10px"}}>{props.area.description}</p>
                </div>
            </div>
        )
    }

    /**
     * Return the html page of the selection block
     * @function SelectionBlock
     * @param {*} props All properties needed by selectionBlock
     * @returns the HTML page
     */
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

    /**
     * Return the html page of the areaResume
     * @function AreaResume
     * @returns the html page
     */
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
                    <div style={style.actionTitle}>ACTION</div>
                    <InfoBlock area={ACTIONS[pageInfo.selectedIndex[0]]} index={-1} selectedIndex={0} />
                    <div style={style.reactionTitle}>REACTION</div>
                    <InfoBlock area={REACTIONS[pageInfo.selectedIndex[1]]} index={-1} selectedIndex={0} />
                </div>
            )
        }
    }

    /**
     * The html body page
     * @function Body
     * @returns the html of the body page
     */
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
            buttonNext: {
                position: "fixed",
                bottom: "50%",
                right: "5%",
                borderRadius: "10px",
                cursor: "pointer",
                padding: "20px",
                backgroundColor: "lightgrey",
                boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.5)",
            },
            buttonPrev: {
                position: "fixed",
                bottom: "50%",
                left: "5%",
                borderRadius: "10px",
                cursor: "pointer",
                padding: "20px",
                backgroundColor: "lightgrey",
                boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.5)",
            }
        }
        return (
            <div style={style.body}>
                <h2>{pageInfo.title[pageInfo.index]}</h2>
                <SelectionBlock title={pageInfo.title[pageInfo.index]} list={pageInfo.list[pageInfo.index]} selectedBlock={pageInfo.selectedIndex[pageInfo.index]} />
                <AreaResume />
                <div style={style.bottomButtons}>
                    <div style={style.buttonPrev} onClick={pageInfo.prev[pageInfo.index]}>{"<= précédent"}</div>
                    <div style={style.buttonNext} onClick={pageInfo.next[pageInfo.index]}>{(pageInfo.index === 2) ? "Créer l'Area" : "suivant =>"}</div>
                </div>
            </div>
        )
    }

    /**
     * The html header page
     * @function Header
     * @returns the html header page
     */
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
                <img src={LogoArea} style={style.image} alt="goHome" onClick={() => { navigate("/home") }} />
                <h1 style={style.title}>Ici, tu peux créer ton area !</h1>
            </div>
        )
    }
    const globalStyle = {
        position: "relative",
        fontFamily: "Avenir Next,Avenir Next W01, Avenir,helvetica,arial,sans-serif",
    }
    return (
        <div style={globalStyle}>
            <Header />
            <Body />
        </div>
    );
}