import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { View, StatusBar } from 'react-native'
import { GiftedChat, Bubble, Message } from 'react-native-gifted-chat'
import { COLORS, FONTS_FAMILY, FONTS } from "../constants"
import { UserStore, ChatStore } from "../redux"
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

export default function ChatScreen({ route, navigation }) {

    const { name, id } = route.params;
    const [userDetails, setUserDetails] = useState({})
    const [user, setUser] = useState({})
    const [topBarColor, setTopBarColor] = useState({
        bg: "transparent",
        content: "dark-content"
    })
    //Setting the topBar Colour
    useEffect(() => {
        setTopBarColor({
            bg: "transparent",
            content: "dark-content"
        })
    }, [])

    const [value, onChangeText] = useState(route.params.name);
    const [chatList, setChatList] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: value === '' ? 'No title' : value,
        });
    }, [navigation, value]);

    //This is my database collection
    const db = firebase.firestore().collection("Chat")

    useEffect(() => {
        //Setting the topBar Colour
        setTopBarColor({
            bg: "transparent",
            content: "dark-content"
        })

        //Getting user info
        setUserDetails(UserStore.getState()?.user)
    }, [])

    useEffect(() => {
        //Getting user info
        setUserDetails(UserStore.getState()?.user)

        //Listening to the change
        db.onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type == "added")
                .map(({ doc }) => {
                    const message = doc.data();

                    if ((message.sender === id && message.receiver === userDetails.uid) || (message.receiver === id && message.sender === userDetails.uid))
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
        });
    }, [userDetails])

    //Storing messages
    const appendMsg = useCallback((message) => {
        let msg = []
        message.forEach((mess) => {
            if (mess._id !== ""){
                msg.push(mess)
            }
        })

        setMessages(prev => GiftedChat.append(prev, msg));
    }, []);

    useEffect(() => {
        setUser({
            _id: userDetails?.uid,
            name: userDetails?.fName + " " + userDetails?.surname,
            avatar: userDetails?.img,
            city: userDetails?.location?.city
        })
    }, [userDetails])

    const [messages, setMessages] = useState([]);

    //A function call when btnSend message is clicked
    async function handleOnSend(messages) {
        let newMessage = {
            sender: messages[0].user._id,
            receiver: id,
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
        </View>
    )
}