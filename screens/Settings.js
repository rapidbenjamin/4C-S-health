import React, { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, Platform, StatusBar, Text, Modal, Pressable } from "react-native"
import Title from "../components/Title"
import { COLORS, SIZES, FONTS_FAMILY, FONTS, SHADOW } from "../constants"
import { Btn, TextBox } from "../components"
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import { UserStore } from "../redux"

const styles = StyleSheet.create({
    view: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
        width: '100%',
        backgroundColor: COLORS.white
    },
    ListView: {
        width: '100%',
        padding: 15,
        backgroundColor: COLORS.white
    },
    upperView: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: SIZES.padding * 3,
        paddingVertical: SIZES.padding * 3 / 2,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.darkGrey
    },
    title: {
        ...FONTS.h5_comfortaa,
        color: COLORS.secondary,
    },
    desc: {
        marginTop: 5,
        ...FONTS.h6_nunito,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: "75%",
    },
})

export default function SettingsScreen({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [screenName, setScreenName] = useState("")
    const [barContent, setBarContent] = useState({
        color: "dark-content",
        bgColor: "white"
    });

    const [userDetails, setUserDetails] = useState({})
   
    useEffect(() => {
        //Getting user info
        setUserDetails(UserStore.getState()?.user)
    }, [])

    function openModal(screen) {
        setBarContent({
            color: "light-content",
            bgColor: "rgba(0, 0, 0, 0.459)"
        })
        setScreenName(screen)
        setModalVisible(true);
    }

    function closeModal() {
        setBarContent({
            color: "dark-content",
            bgColor: "transparent"
        })
        setModalVisible(false)
    }



    return <View style={styles.view}>
        <StatusBar barStyle={barContent.color} translucent={true} backgroundColor={barContent.bgColor} />
        <View style={styles.upperView}>
            <View>
                <Text style={styles.title}>{userDetails?.fName + " " + userDetails?.surname}</Text>
                <Text style={styles.desc}>{userDetails?.location?.address}</Text>
            </View>
            <Btn style={{ maxWidth: 90, backgroundColor: COLORS.darkGrey }} textStyle={FONTS.h4_comfortaa} title="EDIT" />
        </View>

        <ScrollView style={styles.ListView}>
            <Title onPress={() => openModal("Privacy")} icon="notifications" title="Notifications" />
            <Title onPress={() => openModal("Privacy")} icon="settings" title="General" />
            <Title onPress={() => openModal("Privacy")} icon="lock" title="Privacy" />
            <Title onPress={() => openModal("Privacy")} icon="help" title="Help" />
            <Title onPress={() => {
                firebase.auth().signOut();
                navigation.replace("Login");
            }} icon="logout" title="Log Out" />
        </ScrollView>


        {/* A modal that shows differents option of the Settings Screen */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => closeModal()}
        >
            <Pressable style={{ width: "100%", flex: 1 }} onPress={() => closeModal()}>
                <View
                    style={{ width: '100%', flex: 1, backgroundColor: "rgba(0, 0, 0, 0.459)", justifyContent: "flex-end" }}>
                    <View style={styles.modalContainer}>
                    </View>
                </View>
            </Pressable>
        </Modal>
    </View>
}