import React from 'react'
import { TouchableOpacity, Text } from "react-native"
import { COLORS, FONTS, SIZES} from "../constants"

export default function Btn(props) {
    return <TouchableOpacity
        style={{
            height: SIZES.btnHeight,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: SIZES.radius,
            width: "92%",
            ...props.style
        }}
        onPress={props.onPress}
    >
        <Text style={{ ...FONTS.h5_comfortaa, color: COLORS.white }}>{props.title}</Text>
    </TouchableOpacity>
}
