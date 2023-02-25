import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, Dimensions, ScaledSize, TouchableOpacity, Alert, ScrollView, Platform, PermissionsAndroid, PermissionStatus } from "react-native";
import { Options } from "react-native-navigation";
import { Globals } from "../Common/Globals";
import { AddAreaProps, HomeScreenProps, InfoArea, SettingsProps, SingleArea, UserInfo } from "../Common/Interfaces";
import Circles from "../Components/Circles";
import { NavigatorPush, NavigatorshowModal } from "../Navigator";
import Geolocation from 'react-native-geolocation-service';

interface AreaBlockProps {
    index: number
    area: SingleArea
}

export default function HomeScreen(props: HomeScreenProps) {
    const window: ScaledSize = Dimensions.get("window")
    const [allAreas, setAllAreas] = useState<Array<SingleArea>>([])
    const [hasAcceptedLocalization, setHasAcceptedLocalization] = useState(false)
    const [userInformation, setUserInformation] = useState<UserInfo>({
        mail: props.userMail,
        coord: {
            latitude: 0,
            longitude: 0,
            city: ""
        },
        id: props.userId,
        services: {
            spotifyId: "",
            googleId: "",
            twitterId: "",
            twitchId: "",
            stravaId: ""
        },
        ip: props.ip
    })

    useEffect(() => {
        try {
            const fetchData = async () => {
                await fetch(userInformation.ip + "/getAreas/" + userInformation.id)
                .then(response => {
                    response.json().then(data => {
                        let areaArray: Array<SingleArea> = []
                        for (const area in data.areas) {
                            let action = data.areas[area].Action
                            let reaction = data.areas[area].Reaction
                            let id = data.areas[area].id
                            areaArray.push({action: action, reaction: reaction, id: id})
                        }
                        setAllAreas(areaArray)
                    })
                })
                .catch(error => {
                    console.error(error);
                })
            };

            const fetchUser = async () => {

                await fetch(userInformation.ip + "/getPosition/" + userInformation.id)
                .then(response => {
                    response.json().then(data => {
                        setUserInformation({
                            mail: userInformation.mail,
                            coord: {
                                latitude: data.latitude,
                                longitude: data.longitude,
                                city: userInformation.coord.city
                            },
                            id: userInformation.id,
                            services: {
                                spotifyId: userInformation.services.spotifyId,
                                googleId: userInformation.services.googleId,
                                twitterId: userInformation.services.twitterId,
                                twitchId: userInformation.services.twitchId,
                                stravaId: userInformation.services.stravaId
                            },
                            ip: userInformation.ip
                        })
                    })
                })
                .catch(error => {
                    console.error(error);
                })
            }

            fetchData()
            .then(async () => {
                await fetchUser()
            });
        } catch (error) {
            console.error(error);
        }
    }, [])

    useEffect(() => {
        if (Platform.OS === "ios") {
            if (hasAcceptedLocalization === false) {
                Geolocation.requestAuthorization("whenInUse")
                    .then((res: Geolocation.AuthorizationResult) => {
                        setHasAcceptedLocalization(res === "granted")
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        }
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then((res: PermissionStatus) => {
                setHasAcceptedLocalization(res === PermissionsAndroid.RESULTS.GRANTED)
            })
        }
    })

    function navigateToProfile() {
        let options: Options = {
            topBar: {
                title: {
                    text: "Profil" 
                },
                background: {
                    color: "transparent"
                },
            }
        }
        let propsSending: SettingsProps = {
            hasAuthorization: hasAcceptedLocalization,
            userInfo: userInformation,
            setUserInfo: setUserInformation
        }
        NavigatorPush("SettingsScreen", "mainStack", options, propsSending)
    }

    function navigateToAddArea() {
        let options: Options = {
            topBar: {
                title: {
                    text: "Ajouter une AREA" 
                },
                background: {
                    color: "transparent"
                },
            }
        }
        let propsSending: AddAreaProps = {
            userInfo: userInformation,
            setUserInfo: setUserInformation,
            allAreas: allAreas,
            setAllAreas: setAllAreas
        }
        NavigatorshowModal("AddArea", options, propsSending)
    }

    function removeAreaFromList(index: number) {
        async function supressArea() {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({uid: userInformation.id, id: allAreas[index].id})
                }

                await fetch(userInformation.ip + "/remove/area", requestOptions).then(response => {
                    response.json().then(data => {
                        if (data.body === "Success") {
                            let copyAreas = [...allAreas]
                            copyAreas.splice(index, 1)
                            setAllAreas(copyAreas)
                        } else {
                            console.log(data.body)
                        }
                    })
                });
            } catch (error) {
                console.log(error);
            }
        }

        Alert.alert(
            "Supprimer",
            "Tu vas supprimer une AREA, veux-tu continuer ?",
            [
              {
                text: "Annuler",
                style: "cancel"
              },
              {
                text: "Supprimer",
                onPress: supressArea,
                style: "destructive"
              }
            ]
          )
    }

    function AreaBlock(props: AreaBlockProps) {
        return (
            <View style={areaBlock.container}>
                <View style={areaBlock.textContainer}>
                    <Text style={areaBlock.text}>{props.area.action.description}</Text>
                    <Text style={areaBlock.text}>{props.area.reaction.description}</Text>
                </View>
                <View style={areaBlock.trashContainer}>
                    <TouchableOpacity style={areaBlock.imageSize} onPress={() => removeAreaFromList(props.index)}>
                        <Image source={require("../assets/trash.png")} style={areaBlock.imageSize}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Circles/>
            <View style={styles.topContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titlePage}>Re-Bonjour !</Text>
                    <TouchableOpacity
                        onPress={navigateToProfile}
                        style={{
                            width: window.width / 100 * 10,
                            height: window.width / 100 * 10,
                        }}>
                        <Image source={require("../assets/avatar.png")}
                            style={[styles.fillContainer, styles.avatarIcon]}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitleText}>AREA actives</Text>
                    <TouchableOpacity
                        onPress={navigateToAddArea}
                        style={{
                            width: window.width / 100 * 10,
                            height: window.width / 100 * 10
                        }}>
                        <Image source={require("../assets/add.png")} style={[styles.fillContainer, styles.addImage]}/> 
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <ScrollView style={styles.bottomContainer} contentContainerStyle={styles.bottomContainerContent}>
                    {
                        allAreas.map((item, index) => {
                            return (
                                <AreaBlock area={item} index={index}/>
                            )}
                        )
                    }
                </ScrollView>
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