import React, { useState, useEffect } from "react"
import { TouchableOpacity, View, ScrollView, StyleSheet, Platform, StatusBar, Text, Image, LogBox, Modal } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS, SHADOW } from "../constants"
import { Btn, TextBox } from "../components";
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import { UserStore } from "../redux"
import LottieView from 'lottie-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
        alignItems: "center",
        justifyContent: "center",
    },
    Box: {
        ...SHADOW,
        borderRadius: SIZES.smallRadius,
        padding: SIZES.padding * 3,
        paddingHorizontal: SIZES.padding,
        marginVertical: SIZES.padding,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    navBar: {
        width: "100%",
        height: 60,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        paddingHorizontal: 5,
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: "100%",
    },
    modalContainer2: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default function PackageScreen({ navigation }) {

    //This the databse collection
    const db = firebase.firestore().collection("Requests")

    const [userDetails, setUserDetails] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [screen, setScreen] = useState(1);
    const [desc, setDesc] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setUserDetails(UserStore.getState()?.user)
    }, [])


    //Bookins listener Screen
    function ListenerScreen() {
        const listenerStyles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }
        })

        return <View style={listenerStyles.container}>
            <TextBox InputStyle={{ textAlign: "center", paddingLeft: 0 }} onChangeText={setDesc} placeholder="Description" value={desc} multiline={true} style={{ height: "30%" }} />
            <View style={{ width: "92%", flexDirection: "row", justifyContent: "space-between" }}>
                <Btn onPress={() => setModalVisible(false)} title="Cancel" style={{ width: "45%", backgroundColor: COLORS.secondary }} />
                <Btn onPress={() => onBookClicked()} title="Book" style={{ width: "45%" }} />
            </View>
        </View>
    }

    //Bookins Professional Screen
    function ProScreen() {
        const listenerStyles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }
        })

        return <View style={listenerStyles.container}>
            <TextBox icon="today" onChangeText={setDate} placeholder="Date of the RDV" value={date} />
            <TextBox icon="schedule" onChangeText={setTime} placeholder="Time of the RDV" value={time} />
            <TextBox InputStyle={{ textAlign: "center", paddingLeft: 0 }} onChangeText={setDesc} placeholder="Description" value={desc} multiline={true} style={{ height: "30%" }} />
            <View style={{ width: "92%", flexDirection: "row", justifyContent: "space-between" }}>
                <Btn onPress={() => setModalVisible(false)} title="Cancel" style={{ width: "45%", backgroundColor: COLORS.secondary }} />
                <Btn onPress={() => onBookClicked()} title="Book" style={{ width: "45%" }} />
            </View>
        </View>
    }

    function openScreen(d) {

        // if (d === 2) {
        //     if (userDetails.package === "Public") {
        //         navigation.navigate("Buy Packages")
        //     } else {
        //         setScreen(d);
        //         setModalVisible(true)
        //     }
        // } else {
        //     setScreen(d);
        //     setModalVisible(true)
        // }

        setScreen(d);
        setModalVisible(true)
    }

    //A function that post the request
    function onBookClicked() {
        let data = {
            isProRequest: false,
            package: userDetails.package,
            uid: userDetails.uid,
            name: userDetails.fName + " " + userDetails.surname,
            desc,
            isAssigned: false
        }

        if (screen === 2) {
            data = {
                ...data,
                isProRequest: true,
                date,
                time
            }
        }

        if (screen === 1 || (screen === 2 && date !== "" && time !== "")) {
            setIsLoading(true);
            db.add(data)
                .then(() => {
                    //Listening to request
                    db.where('uid', '==', userDetails?.uid || "").onSnapshot(querySnapshot => {
                        querySnapshot.forEach(snapshot => {

                            if (snapshot.data().isAssigned) {
                                navigation.navigate("Chat", {
                                    id: snapshot.data().pId,
                                    name: snapshot.data().pName
                                })

                                setTimeout(() => {
                                    db.doc(snapshot.id).get()
                                        .then(doc => {
                                            if (doc.exists) {
                                                handleOnCancel(snapshot.id)
                                            }
                                        })
                                }, 3000)

                            }
                            setTimeout(() => {
                                db.doc(snapshot.id).get()
                                    .then(doc => {
                                        if (doc.exists) {
                                            if (!doc.data().isAssigned) {
                                                handleOnCancel(snapshot.id)
                                            }
                                        }
                                    })
                            }, 60000)
                        })
                    })

                }).catch(err => {
                    alert(err.message)
                    setIsLoading(false)
                })
        }
        else {
            alert("Please fill in the date and the time!")
        }
    }

    function handleOnCancel(docId) {
        setModalVisible(false)
        setIsLoading(false)
        db.doc(docId).delete()
    }


    return <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={true} backgroundColor={"transparent"} />

        <Text style={{ ...FONTS.h4_comfortaa, marginBottom: SIZES.padding * 3 }}>Select a package</Text>

        <TouchableOpacity onPress={() => openScreen(1)} style={{ ...styles.Box, backgroundColor: COLORS.secondary }}>
            <Text style={{ ...FONTS.h5_comfortaa, color: COLORS.white, textAlign: "center" }}>Private</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openScreen(2)} style={{ ...styles.Box, backgroundColor: COLORS.orange }}>
            <Text style={{ ...FONTS.h5_comfortaa, color: COLORS.white, textAlign: "center" }}>Premium</Text>
        </TouchableOpacity>



        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >

            <View
                style={{ width: '100%', flex: 1, backgroundColor: "rgba(0, 0, 0, 0.459)", justifyContent: "flex-end" }}>
                <View style={styles.modalContainer}>
                    <View style={{ ...styles.navBar, ...SHADOW, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} >
                        <Text style={FONTS.h5_comfortaa}>Do you have more details ?</Text>
                    </View>
                    {screen === 1 && ListenerScreen()}
                    {screen === 2 && ProScreen()}
                </View>
            </View>
        </Modal>


        {/* Loading Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={isLoading}
            onRequestClose={() => null}
        >

            <View
                style={{ width: '100%', flex: 1, backgroundColor: "rgba(0, 0, 0, 0.459)", justifyContent: "center" }}>
                <View style={{ ...styles.modalContainer2, height: "65%", borderRadius: 25, width: "90%", alignSelf: "center" }}>
                    <LottieView
                        style={{ width: "78%", alignSelf: "center" }}
                        autoPlay
                        loop
                        source={require('../assets/animations/loading.json')}
                    />
                    <Text style={{ ...FONTS.h4_comfortaa, textAlign: "center", margin: 10 }}>Waiting for a response</Text>
                    <Btn style={{ flex: 0, width: "90%", alignSelf: "center", marginTop: SIZES.padding * 3 }} title="Cancel"
                        onPress={() => handleOnCancel()} />
                </View>
            </View>
        </Modal>
    </View>
}