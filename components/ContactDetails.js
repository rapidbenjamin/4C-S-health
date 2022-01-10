import React, { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS } from "../constants/"
import Person from "../assets/person.png"

const styles = StyleSheet.create({
    upperView: {
        width: "100%",
        flexDirection: "row",
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey,
    },
    img: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: SIZES.padding * 2
    },
    title: {
        ...FONTS.h5_comfortaa,
        color: COLORS.primary,
    },
    desc: {
        ...FONTS.h6_comfortaa,
        marginTop: 2
    },
    Initial: {
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 22.5,
        marginRight: SIZES.padding * 2
    }
})

export default function ContactDetails(props) {
    let img = props.avatar;
    const [initials, setInitials] = useState(props.name.slice(0, 1) + props.name.slice(props.name.indexOf(" ") + 1, props.name.indexOf(" ") + 2))
    let data = []
    for (var key in COLORS) {
        if (key !== "white")
            data.push(COLORS[key]);
    }

    function getColors() {
        let index = Math.floor(Math.random() * data.length)
        return data[index]
    }


    return <TouchableOpacity
        style={styles.upperView}
        onPress={props.onPress}
    >
        {img === undefined ? <Image style={styles.img} source={{ uri: props.avatar }} /> :
            <View style={{ ...styles.Initial, backgroundColor: getColors() }}><Text style={{ ...FONTS.h4_nunito, color: COLORS.white }}>{initials}</Text></View>}
        <View>
            <Text style={styles.title}>{props.name}</Text>
            <Text style={styles.desc}>{props.city || ""}</Text>
        </View>
    </TouchableOpacity>
}