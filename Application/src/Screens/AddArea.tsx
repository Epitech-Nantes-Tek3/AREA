import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Globals } from "../Common/Globals";
import { AddAreaProps, InfoArea, SingleArea } from "../Common/Interfaces";
import { ACTIONS, REACTIONS } from "../Common/Areas";
import { Navigation } from "react-native-navigation";
import { Modal } from "../Components/Modal";
import uuid from 'react-native-uuid';
import { Picker } from "@react-native-picker/picker";
import { Streamers, Games, Artists, Songs, Hashtags, Cities, Gap, Viewers } from "../Common/Interfaces"

interface InfoBlockProps {
    area: InfoArea
    index: number
    selectedIndex: number
    setIndex: Function
    type: "action" | "reaction"
}

interface SelectionBlockProps {
    title: string,
    list: Array<InfoArea>, 
    setSelected: React.Dispatch<React.SetStateAction<number>>
    selectedIndex: number
    type: "action" | "reaction"
}

export default function AddArea(props: AddAreaProps) {
    const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0)
    const [selectedReactionIndex, setSelectedReactionIndex] = useState<number>(0)
    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalInput, setModalInput] = useState<string>("")
    const [modalTitle, setModalTitle] = useState<"Enter" | "Select" | undefined>("Select")
    const [selectOptions, setSelectOptions] = useState<Array<string>>([])
    const [actionInput, setActionInput] = useState<string>("")
    const [reactionInput, setReactionInput] = useState<string>("")
    const [currentType, setCurrentType] = useState<"action" | "reaction">("action")
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

    let selectOptionsMap = {
        "Gap": Gap,
        "Streamer": Streamers,
        "Games": Games,
        "Artist": Artists,
        "Song": Songs,
        "Topic": Hashtags,
        "City": Cities,
        "Viewers": Viewers
    }

    useEffect(() => {
        if (currentType === "action") {
            setActionInput(modalInput)
        } else {
            setReactionInput(modalInput)
        }
    }, [modalInput])

    useEffect(() => {
        setActionInput("")
        setReactionInput("")
    }, [selectOptions, modalTitle])

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
            if (props.type === "action") {
                setCurrentType("action")
            } else {
                setCurrentType("reaction")
            }


            if (props.area.text == true) {
                setModalTitle("Enter")
                setModalVisible(!isModalVisible)
            } else if (props.area.option !== undefined) {
                setModalTitle("Select")
                setSelectOptions(selectOptionsMap[props.area.option!])
                setModalVisible(!isModalVisible)
            } else {
                setModalTitle(undefined)
                setModalVisible(false)
            }
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
                                <InfoBlock area={item} index={index} selectedIndex={props.selectedIndex} setIndex={props.setSelected} type={props.type}/>
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
                <SelectionBlock title={"Actions"} list={ACTIONS} selectedIndex={selectedActionIndex} setSelected={setSelectedActionIndex} type={"action"} />
                <SelectionBlock title={"Réactions"} list={REACTIONS} selectedIndex={selectedReactionIndex} setSelected={setSelectedReactionIndex} type={"reaction"} />
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.areaTextSummary}>
                    {ACTIONS[selectedActionIndex].description.replace("???", actionInput) + ". " + REACTIONS[selectedReactionIndex].description.replace("???", reactionInput) + "."}
                </Text>
                <View style={styles.validationButtonContainer}>
                    <TouchableOpacity style={styles.validationButtonStyle} onPress={sendArea}>
                        <Image source={require("../assets/checkCircle.png")} style={styles.validationImage}/>
                    </TouchableOpacity>
                </View>
            </View>
            
            
            
            <Modal isVisible={isModalVisible}>
                <Modal.Container>
                    <Modal.Header title={modalTitle === "Enter" ? "Rentrez une valeur" : "Choisissez une valeur"} />
                    <Modal.Body>
                        {modalTitle === "Enter" &&
                            <TextInput
                                style={{}}
                                onChangeText={(text) => setModalInput(text)}
                                value={modalInput}
                                placeholder={"Value"}
                                placeholderTextColor={"#7B7B7B"}
                                autoCorrect={true}
                                returnKeyType="done"
                            />
                        }
                        {modalTitle === "Select" &&
                            <Picker
                                selectedValue={modalInput}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log(itemValue)
                                    setModalInput(itemValue)
                                }
                                }
                            >
                                {selectOptions.map((item, index) => {
                                    item = item.charAt(0).toUpperCase() + item.slice(1);
                                    return (
                                        <Picker.Item label={item} value={item} />
                                    )
                                })
                                }
                          </Picker>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)} style={{left: 50, bottom: 10, position: "absolute"}}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)} style={{right: 50, bottom: 10, position: "absolute"}}>
                            <Text>Agree</Text>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Container>
            </Modal>
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