import React from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS} from "../constants"
import Ionicons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    title: {
        ...FONTS.h5_nunito,
        color: COLORS.primary,
        marginLeft: 20
    },
    view: {
        margin: 10,
        flexDirection: "row",
        alignItems: 'center',
    }
})

export default function Title(props) {
    return <TouchableOpacity style={styles.view} onPress={props.onPress}>
        <Ionicons name={props.icon} size={SIZES.iconSize} color={COLORS.primary} />
        <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
}