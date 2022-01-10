import React from "react"
import { FlatList, View, StyleSheet, Platform, StatusBar, TextInput, TouchableOpacity, Text } from "react-native"
import ContactDetails from "../components/ContactDetails"
import { COLORS, SIZES, SHADOW, FONTS } from "../constants"
import Ionicons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white,
    },
    searchBar: {
        ...SHADOW,
        paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
        borderRadius: 0,
        backgroundColor: COLORS.iris,
        height: SIZES.btnHeight * 2.5,
        borderBottomLeftRadius: SIZES.smallRadius,
        borderBottomRightRadius: SIZES.smallRadius,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIZES.padding
    },
    searchInput: {
        position: "absolute",
        left: 0,
        bottom: 10,
        width: "80%",
        height: SIZES.btnHeight,
        paddingLeft: 2 * SIZES.padding + SIZES.tabIcon + 5,
        color: COLORS.pink,
        ...FONTS.h5_comfortaa
    },
    btnText: {
        color: COLORS.pink,
        ...FONTS.h5_comfortaa
    },
    cancelBtn: {
        position: "absolute",
        bottom: SIZES.padding * 2,
        right: SIZES.padding * 2,
    },
    tags: {
        backgroundColor: COLORS.pink,
        padding: SIZES.padding - 3,
        borderRadius: SIZES.smallRadius,
        textAlign: "center",
        alignSelf: "center",
        justifyContent: "center",
        marginRight: SIZES.padding
    },
    tagsContainer: {
        margin: SIZES.padding * 2,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    tagsText: {
        color: COLORS.black,
        ...FONTS.h5_nunito
    },
    searchContainer: {
        marginBottom: SIZES.padding,
        marginHorizontal: SIZES.padding * 2,
    }
})

export default function SearchScreen({ navigation }) {

    let data = []

    return <View style={styles.view}>
        <StatusBar barStyle="dark-content" translucent={true} backgroundColor={"transparent"} />

        <View style={styles.searchBar}>
            <Ionicons style={{ marginLeft: SIZES.padding }} name="search" color={COLORS.pink} size={SIZES.tabIcon} />
            <TextInput placeholder="Search" style={styles.searchInput} />
            <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
            <TouchableOpacity style={styles.tags}><Text style={styles.tagsText}>Insomnia</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tags}><Text style={styles.tagsText}>Anxiety</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tags}><Text style={styles.tagsText}>Stress</Text></TouchableOpacity>
            <TouchableOpacity>
                <Ionicons style={{ marginLeft: SIZES.padding }} name="add" color={COLORS.darkGrey} size={SIZES.tabIcon} />
            </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
            <Text style={{ color: COLORS.darkGrey, ...FONTS.h5_comfortaa }}>Search Results</Text>
        </View>
        <FlatList
            data={data}
            renderItem={() => <ContactDetails onPress={() => navigation.navigate("Chat")} />}
            keyExtractor={(item, idx) => idx.toString()}
        />
    </View>
}