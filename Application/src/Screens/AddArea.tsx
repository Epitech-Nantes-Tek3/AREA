import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Globals } from "../Common/Globals";
import { InfoArea, SingleArea } from "../Common/Interfaces";
import { ACTIONS, REACTIONS } from "../Common/Areas";
import { Navigation } from "react-native-navigation";

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

export default function AddArea() {
    const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0)
    const [selectedReactionIndex, setSelectedReactionIndex] = useState<number>(0)
    let logo = {
        "spotify": require("../assets/logo/spotify.png"),
        "iss": require("../assets/logo/iss.png"),
        "nasa": require("../assets/logo/nasa.png"),
        "twitter": require("../assets/logo/twitter.png"),
        "google": require("../assets/logo/google.png"),
        "météo": require("../assets/logo/meteo.png"),
        "twitch": require("../assets/logo/twitch.png")
    }

    function sendArea() {
        let area: SingleArea = {
            action: ACTIONS[selectedActionIndex],
            reaction: REACTIONS[selectedReactionIndex]
        }
        console.log(area)
        Navigation.dismissAllModals()
    }

    function InfoBlock(props: InfoBlockProps) {
        let color = (props.index === props.selectedIndex ? "#7D7D7D" : "#392D37")

        function pressBlock() {
            props.setIndex(props.index)
        }

        return (
            <TouchableOpacity style={{height: "75%", width: 200, backgroundColor: color, borderRadius: 20, marginRight: 16}} onPress={pressBlock}>
                <View style={{flex: 1, justifyContent: "center", flexDirection: "row", marginTop: 8}}>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <Image source={logo[props.area.service]} style={{width: 40, height: 40}}/>
                    </View>
                    <View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{textTransform: "capitalize", fontFamily: "Poppins-Medium", fontSize: 25, color: "white"}}>
                            {props.area.service}
                        </Text>
                    </View>
                </View>
                <View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontFamily: "Poppins-Medium", fontSize: 16, color: "white", textAlign: "center"}}>{props.area.description}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    function SelectionBlock(props: SelectionBlockProps) {
        return (
            <View style={{flex: 1}}>
                <Text style={{fontSize: 25, fontFamily: "Poppins-Medium", marginLeft: 16, marginBottom: 16}}>{props.title}</Text>
                <ScrollView horizontal={true} contentContainerStyle={{marginHorizontal: 16}} showsHorizontalScrollIndicator={false}>
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
            <View style={{flex: 3, marginTop: 40}}>
                <SelectionBlock title={"Actions"} list={ACTIONS} selectedIndex={selectedActionIndex} setSelected={setSelectedActionIndex} />
                <SelectionBlock title={"Réactions"} list={REACTIONS} selectedIndex={selectedReactionIndex} setSelected={setSelectedReactionIndex} />
            </View>
            <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                <Text style={{fontFamily: "Poppins-Light", fontSize: 18, flex: 2, marginHorizontal: 40, textAlign: "center"}}>
                    {ACTIONS[selectedActionIndex].description + ". " + REACTIONS[selectedReactionIndex].description + "."}
                </Text>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{borderRadius: 50, width: 60, height: 60}} onPress={sendArea}>
                        <Image source={require("../assets/checkCircle.png")} style={{width: 60, height: 60}}/>
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
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    bottomContainer: {
        flex: 5
    },
    bottomContainerContent: {
        alignItems: "center"
    },
    headerContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "100%",
        paddingHorizontal: 35,
        alignItems: "center"
    },
    titlePage: {
        fontFamily: "Poppins-Bold",
        fontSize: 35,
        color: "black"
    },
    avatarIcon: {
        borderRadius: 50
    },
    subtitleContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "100%",
        paddingHorizontal: 50
    },
    subtitleText: {
        fontFamily: "Poppins-Medium",
        fontSize: 20,
        color: "black"
    },
    fillContainer: {
        width: "100%",
        height: "100%"
    },
    addImage: {
        tintColor: "black"
    }
})

const areaBlock = StyleSheet.create({
    container: {
        width: "90%",
        height: 100,
        borderRadius: 20,
        backgroundColor: Globals.Colors.main,
        marginTop: 24,
        flexDirection: "row"
    },
    textContainer: {
        flex: 5,
        justifyContent: "space-around",
        paddingVertical: 12
    },
    text: {
        marginLeft: 20,
        fontSize: 15,
        fontFamily: "Poppins-Regular"
    },
    trashContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageSize: {
        width: 40,
        height: 40
    }
})