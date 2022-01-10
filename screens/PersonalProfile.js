import React, { useState, useEffect } from "react"
import { FlatList, ScrollView, Dimensions, View, Image, StyleSheet, Platform, StatusBar, TextInput, TouchableOpacity, Text } from "react-native"
import ContactDetails from "../components/ContactDetails"
import { COLORS, SIZES, SHADOW, FONTS, FONTS_FAMILY } from "../constants"
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import { UserStore } from "../redux"


const ScreenWidth = Dimensions.get('window').width;

export default function PersonalProfile({ navigation }) {

  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    setUserDetails(UserStore.getState()?.user)
  }, [])

  return (
    <View style={styles.view}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={"transparent"} />

      <ScrollView horizontal={false} style={styles.container}>
        <View style={styles.searchBar}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              padding: SIZES.padding,
              width: "100%",
              marginLeft: 10,
              marginRight: 10,
            }} >
            <Image
              style={styles.avatar}
              source={{
                uri: userDetails?.img,
              }}
            />
            <Text style={styles.name}>{userDetails?.fName + " " + userDetails?.surname}</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 30 }}>
          <Text
            style={styles.heading}>
            Worries About
          </Text>
          <View style={{ flex: 1 }}>
            <ScrollView horizontal={true} style={styles.container}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  width: ScreenWidth,
                  marginLeft: 20,
                  marginRight: 10,
                }} >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={styles.btnSwitch} >
                    <Text style={{ ...styles.text, color: COLORS.primary, }}>Anxiety</Text>
                  </View>
                  <View style={styles.btnSwitch} >
                    <Text style={{ ...styles.text, color: COLORS.primary }}>Panic Attacks</Text>
                  </View>
                  <View style={styles.btnSwitch} >
                    <Text style={{ ...styles.text, color: COLORS.primary }}>Depression</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.heading}>Goals</Text>
              <Text style={styles.description}>
                Words, words and more words about things and stuff that exaplin things and stuff.
              </Text>
              <View
                style={{
                  width: ScreenWidth / 2, marginTop: 30,
                  flexDirection: 'column', alignSelf: 'center',
                }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoTypeLabel}>Age</Text>
                    <Text style={styles.infoTypeLabel}>Height</Text>
                    <Text style={styles.infoTypeLabel}>Ethnicity</Text>
                    <Text style={styles.infoTypeLabel}>language</Text>
                    <Text style={styles.infoTypeLabel}>Religion</Text>
                    <Text style={styles.infoTypeLabel}>food</Text>
                    <Text style={styles.infoTypeLabel}>Diet</Text>
                    <Text style={styles.infoTypeLabel}>Nicotine Addict</Text>
                    <Text style={styles.infoTypeLabel}>Alcohol Abuse</Text>
                    <Text style={styles.infoTypeLabel}>Drug Abuse</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10, marginRight: -20 }}>
                    <Text style={styles.infoAnswerLabel}>26</Text>
                    <Text style={styles.infoAnswerLabel}>5'4"</Text>
                    <Text style={styles.infoAnswerLabel}>Coloured</Text>
                    <Text style={styles.infoAnswerLabel}>English</Text>
                    <Text style={styles.infoAnswerLabel}>Catholic</Text>
                    <Text style={styles.infoAnswerLabel}>Average</Text>
                    <Text style={styles.infoAnswerLabel}>Vegan</Text>
                    <Text style={styles.infoAnswerLabel}>No</Text>
                    <Text style={styles.infoAnswerLabel}>No</Text>
                    <Text style={styles.infoAnswerLabel}>Never</Text>
                  </View>

                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.white,
  },
  searchBar: {
    ...SHADOW,
    borderRadius: 0,
    backgroundColor: COLORS.secondary,
    padding: SIZES.padding,
    borderBottomLeftRadius: SIZES.smallRadius,
    borderBottomRightRadius: SIZES.smallRadius,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    alignSelf: 'center',
    margin: SIZES.padding,
  },
  name: {
    flex: 1,
    fontSize: 22,
    color: 'white',
    fontFamily: FONTS_FAMILY.ComfortaaRegular,
    textAlign: 'center',
    alignItems: "center",
  },
  heading: {
    fontSize: 16,
    color: '#00BFFF',
    fontFamily: FONTS_FAMILY.ComfortaaRegular,
    textAlign: 'center',
  },
  btnSwitch: {
    margin: 5,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'white',
    marginTop: 30,
    padding: 22
  },
  description: {
    flex: 1,
    fontSize: 16,
    color: '#696969',
    marginTop: 30,
    textAlign: 'center',
  },
  infoTypeLabel: {
    fontSize: 15,
    textAlign: 'left',
    color: 'rgba(126,123,138,1)',
    fontFamily: FONTS_FAMILY.ComfortaaRegular,
    paddingBottom: 10,
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: 'gray',
    fontFamily: FONTS_FAMILY.ComfortaaRegular,
    paddingBottom: 10,
  },

})