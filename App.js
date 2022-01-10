import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import Login from "./screens/Login"
import SignUp from "./screens/SignUp"
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, SIZES, ICONS } from "./constants"
import ChatScreen from "./screens/ChatScreen"
import GChatScreen from "./screens/GChatScreen"
import ChatList from "./screens/ChatList"
import Booking from "./screens/Booking"
import OnboardingScreen from "./screens/onBoardingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import SearchScreen from "./screens/SearchScreen"
import SettingsScreen from "./screens/Settings"
import HomeScreen from "./screens/Homepage"
import PersonalProfile from "./screens/PersonalProfile"
import ProfessionaProfile from "./screens/ProfessionaProfile"
import Blog from "./screens/Blog"
import firebaseConfig from './constants/firebaseConfig';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import { UserStore } from "./redux"

LogBox.ignoreLogs(['Setting a timer']);
export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Initializing Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  //Checking if there is a user logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
      setIsLoggedIn(true);
    } else {
      firebase.auth().signOut();
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  });

  //Getting user info from firebase
  useEffect(() => {
    if (isLoggedIn) {
      const id = firebase.auth().currentUser.uid;
      firebase.firestore().collection("users").doc(id).get()
        .then(doc => {
          UserStore.dispatch({
            type: "setUser",
            data: doc.data()
          })
        })
    }
  })


  let [fontsLoaded] = useFonts({
    'Comfortaa-Bold': require('./assets/fonts/Comfortaa-Bold.ttf'),
    'Comfortaa-Light': require('./assets/fonts/Comfortaa-Light.ttf'),
    'Comfortaa-Medium': require('./assets/fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-Regular': require('./assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-SemiBold': require('./assets/fonts/Comfortaa-SemiBold.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
  });

  const Stack = createStackNavigator();

  //Building stack for Login and Sign Up Screen
  const RegistrationStack = createStackNavigator();

  function RegistrationStackScreen() {
    return (
      <RegistrationStack.Navigator initialRouteName="Login1">
        <RegistrationStack.Screen name="Login1" component={Login} options={{ headerShown: false }} />
        <RegistrationStack.Screen name="Sign Up" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      </RegistrationStack.Navigator>
    );
  }


  //Building the Tab Navigator
  const Tab = createBottomTabNavigator();

  function TabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home1') {
              iconName = focused ? ICONS.Home : ICONS.HomeGrey
            } else if (route.name === 'GChat') {
              iconName = focused ? ICONS.GChat : ICONS.GChatGrey;
            }
            else if (route.name === 'Booking') {
              iconName = focused ? ICONS.Listeners : ICONS.ListenersGrey;
            }
            else if (route.name === 'ChatList') {
              iconName = focused ? ICONS.Chat : ICONS.ChatGrey;
            }
            else if (route.name === 'Settings') {
              iconName = focused ? ICONS.Settings : ICONS.SettingsGrey;
            }

            // You can return any component that you like here!
            return <Image source={iconName} resizeMode="contain" style={{ width: SIZES.tabIcon, height: SIZES.tabIcon }} />;
          },
          tabBarActiveTintColor: COLORS.fuschia,
          tabBarInactiveTintColor: COLORS.grey,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: COLORS.pink,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          },
        })}
      >
        <Tab.Screen name="Home1" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="GChat" component={GChatScreen} options={{ title: "Community Chat" }} />
        <Tab.Screen name="Booking" component={Booking} options={{ headerShown: false }} />
        <Tab.Screen name="ChatList" component={ChatList} options={{ title: "Chats" }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    )
  }

  if (!fontsLoaded || isLoading) {
    return <AppLoading />;
  } else {

    //If the user is logged in render all the routes
    if (isLoggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Initial" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PersonalProfile" component={PersonalProfile} options={{ title: "Profile"  }} />
            <Stack.Screen name="ProfessionaProfile" component={ProfessionaProfile} options={{ title: "Profile"  }} />
            <Stack.Screen name="Blog" component={Blog} />
            <Stack.Screen name="Login" component={RegistrationStackScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    //If the user is not logged in then only render the Login route
    else {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={RegistrationStackScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
