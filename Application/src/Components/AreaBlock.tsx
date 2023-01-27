import { View, Text, Image, TouchableOpacity, StyleSheet, AsyncStorage } from "react-native";
import { Globals } from "../Common/Globals";
import { SingleArea, AreaList } from "../Common/Interfaces"

interface AreaBlockProps {
    area: SingleArea
    removeFunction: Function | any
}


export default function AreaBlock(props: AreaBlockProps) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.area.action}</Text>
                <Text style={styles.text}>{props.area.reaction}</Text>
            </View>
            <View style={styles.trashContainer}>
                <TouchableOpacity style={styles.imageSize} onPress={props.removeFunction}>
                    <Image source={require("../assets/trash.png")} style={styles.imageSize}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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