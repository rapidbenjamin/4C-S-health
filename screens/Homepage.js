import React, { useState, useEffect, useCallback } from "react"
import { TouchableOpacity, View, ScrollView, StyleSheet, Platform, StatusBar, Text, Image, LogBox, Modal } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS, SHADOW } from "../constants"
import { Btn, TextBox } from "../components";
import bgImage from "../assets/bgImage.png"
import { UserStore, ChatStore } from "../redux"
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import LottieView from 'lottie-react-native';

LogBox.ignoreLogs(['Setting a timer']);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.padding,
        paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
        width: '100%',
        backgroundColor: COLORS.white
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        zIndex: 0
    },
    Box: {
        ...SHADOW,
        borderRadius: SIZES.smallRadius,
        padding: SIZES.padding * 3,
        marginVertical: SIZES.padding,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer2: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        height: "100%",
        alignItems: "center",
    },
    navBar: {
        width: "100%",
        minHeight: 60,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        padding: SIZES.padding,
        alignItems: "center",
    },
})

export default function Home({ navigation }) {


    const [time, setTime] = useState(new Date().getHours())
    const [userDetails, setUserDetails] = useState("")
    const [topBarColor, setTopBarColor] = useState("transparent")
    const [isLoading, setIsLoading] = useState(true)
    const [showLoading, setShowLoading] = useState(true);
    const [data, setData] = useState({})
    const [chatList, setChatList] = useState([])
    const [count, setCount] = useState(1)

    const db = firebase.firestore().collection("Requests");

    useEffect(() => {
        //Setting the topBar Colour
        setTopBarColor("transparent")
        UserStore.subscribe(() => setUserDetails(UserStore.getState()?.user))

        setInterval(() => {
            setTime(new Date().getHours())
        }, 3600000)
    }, [])

    //Getting all the messages
    useEffect(() => {
        //Getting user info
        setUserDetails(UserStore.getState()?.user)

        //Listening to the change
        firebase.firestore().collection("Chat").onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type == "added")
                .map(({ doc }) => {
                    const message = doc.data();

                    if ((message.receiver === userDetails?.uid) || (message.sender === userDetails?.uid))
                        return { ...message, createdAt: message.createdAt.toDate() }
                    else
                        return { _id: "", createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => {
                    if (a !== null && b !== null) {
                        return b.createdAt.getTime() - a.createdAt.getTime()
                    }
                });
            appendMsg(messagesFirestore);
            setCount(2)
        });

    }, [userDetails])

    useEffect(() => {
        //Hiding is loading screen
        if (userDetails !== "" && count !== 1) {
            setIsLoading(false);
            setShowLoading(false);
        }
    }, [count])

    //Storing messages
    const appendMsg = useCallback((message) => {
        let msg = []
        message.forEach((mess) => {
            if (mess._id !== "") {
                msg.push(mess)
            }
        })


        let data = []
        for (var i = 0; i < msg.length; i++) {
            if (msg[i].user._id !== firebase.auth().currentUser.uid) {
                let found = false;
                for (var j = 0; j < data.length; j++) {
                    if (msg[i].user._id === data[j]._id) {
                        found = true;
                        break;
                    } else {
                        found = false;
                    }
                }
                if (!found)
                    data.push(msg[i].user);
            }
        }

        if (data.length > 0 && data !== chatList) {
            setChatList(data)
        }
    }, []);

    useEffect(() => {
        ChatStore.dispatch({
            type: "setChatList",
            data: chatList,
        })
    }, [chatList])

    useEffect(() => {
        //Listening to request
        if (userDetails?.isProfessional && userDetails?.isGrad) {
            db.where('isProRequest', '==', true)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(snapshot => {

                        if (!snapshot.data().isAssigned && !snapshot.data().cancelled && snapshot.data().package !== "Public") {
                            setShowLoading(false)
                            setIsLoading(true)
                            setData({
                                data: snapshot.data(),
                                id: snapshot.id
                            })
                        } else {
                            setIsLoading(false);
                        }
                    })
                })
        } else if (userDetails?.isProfessional && !userDetails?.isGrad) {
            db.where('isProRequest', '==', false).onSnapshot(querySnapshot => {
                querySnapshot.forEach(snapshot => {

                    if (!snapshot.data().isAssigned && !snapshot.data().cancelled) {
                        setShowLoading(false)
                        setIsLoading(true)
                        setData({
                            data: snapshot.data(),
                            id: snapshot.id
                        })
                    } else {
                        setIsLoading(false);
                    }
                })
            })
        }
    }, [userDetails])

    function handleOnAccept() {
        let data2 = { pId: userDetails.uid, pName: userDetails.fName + " " + userDetails.surname, isAssigned: true }

        db.doc(data?.id).update({
            ...data2
        }).then(() => {
            setIsLoading(false)
            navigation.navigate("Chat", {
                id: data?.data.uid,
                name: data?.data.name,
            })
        })
    }


    function Box(action, title, color, style, textColor) {

        return <TouchableOpacity onPress={action} style={{ ...styles.Box, backgroundColor: color || COLORS.white, ...style }}>
            <Text style={{ ...FONTS.h5_comfortaa, color: textColor || COLORS.white, textAlign: "center" }}>{title}</Text>
        </TouchableOpacity>
    }

    return <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor={topBarColor} />
        <Image source={bgImage} resizeMode="stretch" style={styles.background} />
        <View style={{ padding: SIZES.padding * 1.5, marginTop: "30%" }}>
            <Text style={{ ...FONTS.h6_comfortaa, color: COLORS.white }}>Good{"\n"}{time >= 0 ? (time < 12 ? "morning" : (time < 17 ? "afternon" : "evening")) : "evening"},</Text>
            <Text style={{ ...FONTS.h4_comfortaa, color: COLORS.white }}>{userDetails?.fName}</Text>
        </View>

        <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
        >
            {Box(() => navigation.navigate("Search"), "Search", COLORS.darkGrey, { width: "100%" })}
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                {Box(() => navigation.navigate((userDetails?.isProfessional ? "ProfessionaProfile" : "PersonalProfile")), "Profile", COLORS.pink)}
                {Box(() => navigation.navigate("GChat"), "Community", COLORS.secondary)}
            </View>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                {Box(() => navigation.navigate("Booking"), "Booking", COLORS.white, null, COLORS.secondary)}
                {Box(() => navigation.navigate("Blog"), "Blog", COLORS.orange)}
            </View>


        </ScrollView>


        {/* Request Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={isLoading}
            onRequestClose={() => null}
        >

            <View style={{ width: '100%', flex: 1, backgroundColor: "rgba(0, 0, 0, 0.459)", justifyContent: "center" }}>
                {showLoading && <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><LottieView
                    style={{ width: "78%", alignSelf: "center" }}
                    autoPlay
                    loop
                    source={require('../assets/animations/loading.json')}
                /></View>}
                {!showLoading && <View style={{ ...styles.modalContainer2, height: "75%", borderRadius: 25, width: "90%", alignSelf: "center" }}>
                    <>
                        <View style={{ ...styles.navBar, ...SHADOW, borderRadius: SIZES.radius, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} >
                            <Text style={{ ...FONTS.h5_comfortaa, textAlign: "center" }}>{data?.data?.time !== undefined ? "Someone wants to book an appointment" : "Someone is looking for a listener"}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <Text style={{ ...FONTS.h5_comfortaa, textAlign: "center", margin: 10 }}>Name: {data?.data?.name}</Text>
                            {data?.data?.time !== undefined && <><Text style={{ ...FONTS.h5_comfortaa, textAlign: "center", margin: 10 }}>Time: {data?.data?.time}</Text>
                                <Text style={{ ...FONTS.h5_comfortaa, textAlign: "center", margin: 10 }}>Date: {data?.data?.date}</Text></>}
                            <Text style={{ ...FONTS.h5_comfortaa, textAlign: "center", margin: 10 }}>Description: {data?.data?.desc}</Text>
                            <Btn style={{ marginTop: SIZES.padding * 3, backgroundColor: COLORS.orange }} title="Accept"
                                onPress={() => handleOnAccept()} />
                            <Btn style={{ marginTop: SIZES.padding * 2, backgroundColor: COLORS.secondary }} title="Cancel"
                                onPress={() => setIsLoading(false)} />
                        </View>
                    </>
                </View>}
            </View>
        </Modal>
    </View>
}