import React, { useState, useEffect } from "react"
import { Keyboard, Text, View, StyleSheet, Image, Platform, StatusBar, TouchableOpacity, Dimensions } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS, SHADOW } from "../constants"
import { Btn, TextBox } from "../components"
import Icon from "../assets/Logo.png"
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

const ScreenHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    view: {
        width: "100%",
        paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
        alignItems: "center",
        flex: 1,
        position: "relative"
    },
    btnSwitch: {
        marginTop: SIZES.padding,
        height: SIZES.btnHeight,
        flexDirection: "row",
        borderRadius: SIZES.radius,
        borderWidth: 0.5,
        borderColor: COLORS.primary,
        width: "92%"
    },
    focusedView: {
        flexDirection: "row",
        width: "50%",
        height: "100%",
        borderRadius: SIZES.radius,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    unFocusedView: {
        flexDirection: "row",
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        margin: 0,
        fontSize: SIZES.h5,
        fontFamily: FONTS_FAMILY.ComfortaaRegular,
        textAlign: "center",
    },
    topCircle: {
        width: "100%",
        height: ScreenHeight * 0.6,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 50,
        position: "absolute",
        top: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
        backgroundColor: COLORS.primary
    },
    container: {
        width: "92%",
        padding: SIZES.padding,
        ...SHADOW,
        zIndex: 1,
        marginTop: SIZES.padding * 4,
        height: 310,
        backgroundColor: COLORS.white,
        alignItems: 'center',
    },
    logo: {
        height: 250,
        width: 250,
    },
    logoWrapper: {
        width: "100%",
        flexDirection: "row",
        top: Platform.OS === "ios" ? 20 : StatusBar.currentHeight / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnWrapper: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: SIZES.padding
    }
})

export default function LoginScreen({ navigation }) {

    //Checking if the keyboard is showing
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const [logoSize, setLogoSize] = useState({
        height: 250,
        width: 250,
    })

    useEffect(() => {
        setLogoSize({
            height: keyboardStatus ? 150 : 250,
            width: keyboardStatus ? 150 : 250,
        })
    }, [keyboardStatus])

    function onSignUpClicked() {
        navigation.replace("Sign Up")
    }

    const [person, setPerson] = useState({
        email: "",
        pwd: ""
    });

    //Handling TextBox changes
    function handleChange(text, name) {
        setPerson((prev) => {
            return {
                ...prev,
                [name]: text
            }
        })
    }

    function onSignInClicked() {
        firebase.auth().signInWithEmailAndPassword(person.email, person.pwd)
            .then(() => {
                // Signed in
                navigation.replace("Home")
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
            });
    }

    return <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={COLORS.primary} />
        {/* Bleu Circle on top */}
        <View style={styles.topCircle}></View>


        {/* My form container  */}
        <View style={styles.view}>

            {/* App Logo */}
            <View style={styles.logoWrapper} >
                <Image source={Icon} style={logoSize} />
            </View>
            <View style={styles.container}>
                <View style={styles.btnSwitch} >
                    <TouchableOpacity style={styles.focusedView} >
                        <Text style={{ ...styles.text, color: COLORS.white }}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.unFocusedView} onPress={() => onSignUpClicked()} >
                        <Text style={{ ...styles.text, color: COLORS.primary }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <TextBox style={{ marginTop: 40 }} placeholder="Email Address" icon="email" value={person.email} onChangeText={(text) => handleChange(text, "email")} />
                <TextBox style={{ marginBottom: 40 }} placeholder="Password" icon="visibility" secureTextEntry={true} value={person.pwd} onChangeText={(text) => handleChange(text, "pwd")} />
                <View style={styles.btnWrapper}>
                    <Btn style={{ width: "100%" }} title="Sign In" onPress={() => onSignInClicked()} />
                </View>
            </View>
        </View>
    </View>
}