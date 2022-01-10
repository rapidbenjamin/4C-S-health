import React, { useState, useCallback, useEffect } from 'react'
import { View, StatusBar, Modal, StyleSheet } from 'react-native'
import { GiftedChat, Bubble, Message } from 'react-native-gifted-chat'
import { COLORS, FONTS_FAMILY, FONTS, SIZES } from "../constants"
import { UserStore } from "../redux"
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import LottieView from 'lottie-react-native';

const styles = StyleSheet.create({
    modalContainer2: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    }
})

export default function ChatScreen() {

    const [topBarColor, setTopBarColor] = useState({
        bg: "transparent",
        content: "dark-content"
    })
    const [userDetails, setUserDetails] = useState({})
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [count, setCount] = useState(1)

    //This is my database collection
    const db = firebase.firestore().collection("Community")

    useEffect(() => {
        //Setting the topBar Colour
        setTopBarColor({
            bg: "transparent",
            content: "dark-content"
        })

        //Getting user info
        setUserDetails(UserStore.getState()?.user)

        //Listening to the change
        db.onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type == "added")
                .map(({ doc }) => {
                    const message = doc.data();

                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => {
                    if (a !== null && b !== null) {
                        return b.createdAt.getTime() - a.createdAt.getTime()
                    }
                });
            appendMsg(messagesFirestore);
        });
    }, [])

    //Storing messages
    const appendMsg = useCallback((message) => {
        setMessages(prev => GiftedChat.append(prev, message))
        setCount(2);
    }, []);

    useEffect(() => {
        setUser({
            _id: userDetails?.uid,
            name: userDetails?.fName + " " + userDetails?.surname,
            avatar: userDetails?.img,
        })
    }, [userDetails])

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        //Hiding is loading screen
        if (count != 1)
            setIsLoading(false);
    }, [count])

    //A function call when btnSend message is clicked
    async function handleOnSend(messages) {
        let newMessage = {
            ...messages[0]
        }

        const writes = () => db.add(newMessage);

        await writes();
    }

    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        ...FONTS.h5_nunito,
                    },
                    left: {
                        ...FONTS.h5_nunito,
                        color: COLORS.white,
                    },
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: COLORS.darkGrey,
                        marginVertical: 10,
                        borderRadius: 6,
                        padding: 2,
                        justifyContent: 'center'
                    },
                    left: {
                        backgroundColor: COLORS.secondary,
                        marginVertical: 10,
                        borderRadius: 6,
                        padding: 2,
                        marginLeft: 10,
                        justifyContent: 'center'
                    }
                }}
            />
        )
    }

    function customMessage(props) {
        return (
            <Message
                {...props}
                containerStyle={{
                    left: {
                        alignItems: "center",
                    }
                }}
            />
        )
    }

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar barStyle={topBarColor.content} translucent={true} backgroundColor={topBarColor.bg} />
            <GiftedChat
                messages={messages}
                onSend={handleOnSend}
                renderBubble={renderBubble}
                renderMessage={customMessage}
                alignTop={true}
                user={user}
            />

            {/* Loading Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isLoading}
                onRequestClose={() => null}
            >

                <View
                    style={{ width: '100%', flex: 1, backgroundColor: "rgba(0, 0, 0, 0.459)", justifyContent: "center" }}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <LottieView
                            style={{ width: "78%", alignSelf: "center" }}
                            autoPlay
                            loop
                            source={require('../assets/animations/loading.json')}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}