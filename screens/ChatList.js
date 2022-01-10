import React, { useState, useEffect } from "react"
import { FlatList, View, StyleSheet, Platform, StatusBar } from "react-native"
import ContactDetails from "../components/ContactDetails"
import { COLORS, SIZES } from "../constants"
import { ChatStore } from "../redux"

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white
    }
})

export default function ChatList({ navigation }) {

    const [chatList, setChatList] = useState([])

    useEffect(() => {
        //Getting the list info
        ChatStore.subscribe(() => setChatList(ChatStore.getState()?.list))
        setChatList(ChatStore.getState()?.list)
    }, [])


    return <View style={styles.view}>
        <StatusBar barStyle="dark-content" translucent={true} backgroundColor={COLORS.white} />
        <FlatList
            data={chatList}
            renderItem={({ item }) => <ContactDetails
                name={item.name}
                city={item.city}
                avatar={item.avatar}
                onPress={() => navigation.navigate("Chat", { 
                    name: item.name,
                    id: item._id
                })} />}
            keyExtractor={(item, idx) => idx.toString()}
        />
    </View>
}