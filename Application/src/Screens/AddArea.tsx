import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Globals } from "../Common/Globals";
import { AddAreaProps, InfoArea, SingleArea } from "../Common/Interfaces";
import { ACTIONS, REACTIONS } from "../Common/Areas";
import { Navigation } from "react-native-navigation";
import uuid from 'react-native-uuid';

interface InfoBlockProps {
    area: InfoArea
    index: number
    selectedIndex: number
    setIndex: Function
}

interface SelectionBlockProps {
    title: string,
    list: Array<InfoArea>, 
    setSelected: React.Dispatch<React.SetStateAction<number>>
    selectedIndex: number
}

export default function AddArea(props: AddAreaProps) {
    const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0)
    const [selectedReactionIndex, setSelectedReactionIndex] = useState<number>(0)
    let logo = {
        "spotify": require("../assets/logo/spotify.png"),
        "iss": require("../assets/logo/iss.png"),
        "nasa": require("../assets/logo/nasa.png"),
        "twitter": require("../assets/logo/twitter.png"),
        "google": require("../assets/logo/google.png"),
        "météo": require("../assets/logo/meteo.png"),
        "twitch": require("../assets/logo/twitch.png"),
        "strava": require("../assets/logo/strava.png")
    }

    async function sendArea() {
        let area: SingleArea = {
            action: ACTIONS[selectedActionIndex],
            reaction: REACTIONS[selectedReactionIndex],
            id: uuid.v4().toString()
        }
        console.log("New area: ", area)
        props.setAllAreas([area, ...props.allAreas])
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: area.action,
                reaction: area.reaction,
                id: area.id,
                uid: props.userInfo.id
            })
        }
        try {
            await fetch(props.userInfo.ip + "/register/areas", requestOptions).then(response => {
                Navigation.dismissAllModals()
            }).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);
        }
    }

    function InfoBlock(props: InfoBlockProps) {
        let color = (props.index === props.selectedIndex ? "#7D7D7D" : "#392D37")

        function pressBlock() {
            props.setIndex(props.index)
        }

        return (
            <TouchableOpacity style={[infoBlockStyle.container, { backgroundColor: color }]} onPress={pressBlock}>
                <View style={infoBlockStyle.titleContainer}>
                    <View style={infoBlockStyle.imageContainer}>
                        <Image source={logo[props.area.serviceName]} style={infoBlockStyle.imageSize}/>
                    </View>
                    <View style={infoBlockStyle.textContainer}>
                        <Text style={infoBlockStyle.textStyle}>
                            {props.area.serviceName}
                        </Text>
                    </View>
                </View>
                <View style={infoBlockStyle.descriptionContainer}>
                    <Text style={infoBlockStyle.descriptionStyle}>{props.area.description}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    function SelectionBlock(props: SelectionBlockProps) {
        return (
            <View style={selectionBlockStyle.container}>
                <Text style={selectionBlockStyle.title}>{props.title}</Text>
                <ScrollView horizontal={true} contentContainerStyle={selectionBlockStyle.scrollviewContainer} showsHorizontalScrollIndicator={false}>
                    {
                        props.list.flatMap((item, index) => {
                            return (
                                <InfoBlock area={item} index={index} selectedIndex={props.selectedIndex} setIndex={props.setSelected}/>
                            )}
                        )
                    }
                </ScrollView>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <SelectionBlock title={"Actions"} list={ACTIONS} selectedIndex={selectedActionIndex} setSelected={setSelectedActionIndex} />
                <SelectionBlock title={"Réactions"} list={REACTIONS} selectedIndex={selectedReactionIndex} setSelected={setSelectedReactionIndex} />
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.areaTextSummary}>
                    {ACTIONS[selectedActionIndex].description + ". " + REACTIONS[selectedReactionIndex].description + "."}
                </Text>
                <View style={styles.validationButtonContainer}>
                    <TouchableOpacity style={styles.validationButtonStyle} onPress={sendArea}>
                        <Image source={require("../assets/checkCircle.png")} style={styles.validationImage}/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Globals.Colors.lightBackground,
    },
    topContainer: {
        flex: 3,
        marginTop: 40
    },
    bottomContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    areaTextSummary: {
        fontFamily: "Poppins-Light",
        fontSize: 18,
        flex: 2,
        marginHorizontal: 40,
        textAlign: "center"
    },
    validationButtonContainer: {
        flex: 1
    },
    validationButtonStyle: {
        borderRadius: 50,
        width: 60,
        height: 60
    },
    validationImage: {
        width: 60,
        height: 60
    }
})

const infoBlockStyle = StyleSheet.create({
    container: {
        height: "75%",
        width: 200,
        borderRadius: 20,
        marginRight: 16
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 8
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageSize: {
        width: 40,
        height: 40
    },
    textContainer: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    textStyle: {
        textTransform: "capitalize",
        fontFamily: "Poppins-Medium",
        fontSize: 25,
        color: "white"
    },
    descriptionContainer: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8
    },
    descriptionStyle: {
        fontFamily: "Poppins-Medium",
        fontSize: 16,
        color: "white",
        textAlign: "center"
    }
})

const selectionBlockStyle = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 25,
        fontFamily: "Poppins-Medium",
        marginLeft: 16,
        marginBottom: 16
    },
    scrollviewContainer: {
        marginHorizontal: 16
    }
})