import React from "react"
import { TextInput, View, StyleSheet } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS} from "../constants"
import Ionicons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    view: {
        width: "92%",
        height: SIZES.btnHeight,
        alignSelf: "center",
        flexDirection: "row",
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
        borderRadius: 25,
        alignItems: "center",
        paddingLeft: SIZES.padding * 3 + 6,
        fontFamily: FONTS_FAMILY.ComfortaaRegular,
        borderWidth: 0.5,
        borderColor: COLORS.primary
    }
})

export default function TextBox(props) {
    return <View style={{ ...styles.view, ...props.style }}>
        <View style={styles.icon}>
            <Ionicons name={props.icon} size={SIZES.iconSize} color={COLORS.primary} />
        </View>
        <TextInput
            style={{...styles.textInput, ...props.InputStyle}}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            value={props.value}
            multiline={props.multiline}
            onChangeText={props.onChangeText}
            autoCompleteType={props.autoCompleteType}
            pointerEvents={props.pointerEvents}
            editable={props.editable}
            secureTextEntry={props.secureTextEntry}
        />
    </View>
}