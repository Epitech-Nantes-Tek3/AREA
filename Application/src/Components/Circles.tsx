import { StyleSheet, View } from "react-native"
import { Globals } from "../Common/Globals"


export default function Circles() {
    return (
        <View>
            <View style={circles.bigCircle}/>
            <View style={circles.smallCircle}/>
        </View>
    )
}

const circles = StyleSheet.create({
    bigCircle: {
        width: 406,
        height: 406,
        borderRadius: 500,
        backgroundColor: Globals.Colors.main,
        position: "absolute",
        top: -244,
        left: -55,
        opacity: 0.4
    },
    smallCircle: {
        width: 342,
        height: 342,
        borderRadius: 500,
        backgroundColor: Globals.Colors.main,
        position: "absolute",
        top: -203,
        left: 179,
        opacity: 0.4
    }
})