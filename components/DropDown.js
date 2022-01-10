import React, { useState, useRef } from "react"
import { View, StyleSheet } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS } from "../constants"
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
    view: {
        width: "92%",
        height: SIZES.btnHeight,
        alignSelf: "center",
        flexDirection: "row",
        borderRadius: 25,
        alignItems: "center",
        paddingLeft: SIZES.padding * 3 + 6,
        borderWidth: 0.5,
        borderColor: COLORS.primary,
        marginVertical: SIZES.padding,
    },
    icon: {
        height: SIZES.iconSize,
        width: SIZES.iconSize,
        position: "absolute",
        top: 11,
        left: 10
    },
    textInput: {
        height: "100%",
        width: "100%",
        ...FONTS.h6_comfortaa
    }
})

export default function DropDown(props) {

    const pickerRef = useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    return <View style={{ ...styles.view, ...props.style }}>
        <View style={styles.icon}>
            <Ionicons name={props.icon} size={SIZES.iconSize} color={COLORS.primary} />
        </View>

        <Picker
            style={styles.textInput}
            itemStyle={FONTS.h6_comfortaa}
            ref={pickerRef}
            selectedValue={props.value}
            onValueChange={(itemValue, itemIndex) =>
                props.setValue(itemValue)
            }>
            <Picker.Item label="Who are you?" value="0" />
            <Picker.Item label="Health Care Professional" value="1" />
            <Picker.Item label="Trained Listener" value="2" />
            <Picker.Item label="Individual" value="3" />
        </Picker>
    </View>
}