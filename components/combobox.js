import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES, FONTS } from "../constants"
import Ionicons from 'react-native-vector-icons/MaterialIcons';

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

const PickerInput = (props) => {

    const arrData = props.arrData || [];

    return (<View style={{ ...styles.view, ...props.style }}>
        <View style={styles.icon}>
            <Ionicons name={props.icon} size={SIZES.iconSize} color={COLORS.primary} />
        </View>

        <Picker
            style={styles.textInput}
            itemStyle={FONTS.h6_comfortaa}
            selectedValue={props.value}
            onValueChange={props.onValueChange} >

            {arrData.map((item, index) => {
                return <Picker.Item label={item} value={item} key={index} />
            })}
        </Picker>
    </View>
    );
}


export default PickerInput;