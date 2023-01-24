import React from "react";
import { ColorValue, StyleSheet, Text, View } from "react-native";
import { Globals } from "../Common/Globals";

interface LineProps {
    height: number | string,
    width: number | string,
    borderWidth: number,
    borderColor: ColorValue
    style?: any
}

interface SeparatorProps {
    width: number | string,
    text: string
}

export function Line(props: LineProps) {
    return (
        <View style={[{
            height: props.height,
            width: props.width,
            borderWidth: props.borderWidth,
            borderColor: props.borderColor,
        }, props.style]}/>
    )
}

export default function Separator(props: SeparatorProps) {
    return (
        <View style={[styles.separatorContainer, {width: props.width}]}>
            <Line width="40%" height={1} borderWidth={0.5} borderColor={Globals.Colors.dark}/>
            <Text style={{color: Globals.Colors.dark, fontSize: 12, marginHorizontal: 16}}>{props.text}</Text>
            <Line width="40%" height={1} borderWidth={0.5} borderColor={Globals.Colors.dark}/>
        </View>
    )
}

const styles = StyleSheet.create({
    separatorContainer: {
        flexDirection: "row",
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 15
    },
})