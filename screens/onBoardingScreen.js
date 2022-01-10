import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper';
import { COLORS, SIZES, FONTS } from "../constants"
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        margin: 0,
        paddingTop: 0,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 0,
    },
    img: {
        position: "absolute",
        bottom: 0,
        width: "80%",
        maxHeight: "100%",
        alignSelf: "center",
    },
    title: {
        ...FONTS.h4_comfortaa,
        color: COLORS.white
    },
    subTitle: {
        ...FONTS.h6_comfortaa,
        color: COLORS.white
    },
    topTitle: {
        position: "absolute",
        top: "-30%",
        width: "70%",
        left: SIZES.padding * 5
    }
})

export default function OnboardingScreen({ navigation }) {

    const [isFirstLaunched, setIsFirstLaunched] = useState(null);

    //Checking if the screen has been launched before
    useEffect(() => {
        AsyncStorage.getItem("hasBeenLaunchedBefore").then(value => {
            if (value === null || value === undefined) {
                //Storing information about the launching
                AsyncStorage.setItem("hasBeenLaunchedBefore", "true");
                setIsFirstLaunched(true);
            } else {
                setIsFirstLaunched(false);
            }
        })
    }, [])

    //Skipping the screen is it has been launched before
    useEffect(() => {
        if (isFirstLaunched !== null && isFirstLaunched !== undefined && !isFirstLaunched) {
            navigation.replace("Home")
        }
    }, [isFirstLaunched])

    function CustomView(props) {
        return <View style={styles.container}>
            <View style={styles.topTitle}>
                <Text style={{ ...styles.title, ...props.style }}>You are all set!</Text>
                <Text style={{ ...styles.subTitle, ...props.style }}>Together we can learn to treat ourselves and others with tenderness.</Text>
            </View>
            <Image resizeMode="contain" style={styles.img} source={props.path} />
        </View>
    }

    if (!isFirstLaunched) {
        return <AppLoading />;
    } else {
        return (
            <Onboarding
                imageContainerStyles={
                    {
                        paddingTop: 0,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        marginTop: 0,
                        height: "40%",
                        paddingBottom: 0,
                        width: "100%",
                    }
                }
                titleStyles={{
                    ...FONTS.h4_comfortaa,
                    marginHorizontal: SIZES.padding * 4
                }}
                subTitleStyles={{
                    ...FONTS.h6_comfortaa,
                    marginHorizontal: SIZES.padding * 2
                }}
                onDone={() => navigation.replace("Home")}
                onSkip={() => navigation.replace("Home")}
                pages={[
                    {
                        backgroundColor: '#11284A',
                        title: "Community Chat",
                        image: <CustomView path={require('../assets/onBoarding1.png')} />,
                        subtitle: 'Anonymously communicate with the community, share your struggles and achievements.',
                    },
                    {
                        backgroundColor: '#BA7E93',
                        image: <CustomView path={require('../assets/onBoarding2.png')} />,
                        title: 'Meet Health Care Professionals',
                        subtitle: 'Get to know professionals in order to pick the right care for you!',
                    },
                    {
                        backgroundColor: '#F9F9F9',
                        image: <CustomView path={require('../assets/onBoarding3.png')} style={{ color: COLORS.black }} />,
                        title: 'Self-Help Tools',
                        subtitle: 'Begin the jouney of self-discovery with the help of our tools, articles, quizzes and more.',
                    },
                ]}
            />
        )
    }
}
