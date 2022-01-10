import React, { useState, useEffect } from "react"
import { Keyboard, Text, View, StyleSheet, ScrollView, Platform, StatusBar, TouchableOpacity, Dimensions, Modal, Image } from "react-native"
import { COLORS, SIZES, FONTS_FAMILY, FONTS, SHADOW } from "../constants"
import { Btn, TextBox, DropDown, Combobox } from "../components";
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import * as ImagePicker from 'expo-image-picker';


const ScreenHeight = Dimensions.get("window").height

const styles = StyleSheet.create({
    separator: {
        width: "100%",
        borderBottomColor: COLORS.grey,
        marginVertical: SIZES.padding,
        borderBottomWidth: 1
    },
    view: {
        width: "100%",
        paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
        alignItems: "center",
        flex: 1,
        position: "relative"
    },
    btnSwitch: {
        marginTop: SIZES.padding,
        height: SIZES.btnHeight,
        flexDirection: "row",
        borderRadius: SIZES.radius,
        borderWidth: 0.5,
        borderColor: COLORS.primary,
        width: "92%"
    },
    focusedView: {
        flexDirection: "row",
        width: "50%",
        height: "100%",
        borderRadius: SIZES.radius,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    unFocusedView: {
        flexDirection: "row",
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        margin: 0,
        fontSize: SIZES.h5,
        fontFamily: FONTS_FAMILY.ComfortaaRegular,
        textAlign: "center",
    },
    topCircle: {
        width: "100%",
        height: ScreenHeight * 0.6,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 50,
        position: "absolute",
        top: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
        backgroundColor: COLORS.primary
    },
    container: {
        width: "92%",
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        ...SHADOW,
        minHeight: 500,
        maxHeight: ScreenHeight * 0.8,
        marginTop: SIZES.padding,
        zIndex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        flexDirection: "column",
        justifyContent: "center",
    },
    logo: {
        height: 250,
        width: 250,
    },
    logoWrapper: {
        position: 'relative',
        width: "100%",
        padding: SIZES.padding * 2,
        flexDirection: "row",
        top: Platform.OS === "ios" ? 55 : StatusBar.currentHeight + 15,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    btnWrapper: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        width: "98%",
        paddingHorizontal: SIZES.padding
    },
    modal: {
        height: "100%",
        backgroundColor: COLORS.white,
    },
    modalScreen: {
        marginTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        marginTop: SIZES.padding,
        backgroundColor: COLORS.white,
        flexDirection: "column",
        height: "100%",
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    exitBtn: {
        flexDirection: "row",
        position: "absolute",
        top: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
        left: 20,
        alignItems: "center"
    },
    exitBtnText: {
        fontWeight: "bold",
        fontSize: 22,
        color: COLORS.secondary,
        marginLeft: 10
    },
    textMDP: {
        color: COLORS.black,
        fontWeight: "bold",
        marginTop: 8
    },
    comboScreen: {
        backgroundColor: "#000000aa",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flex: 1
    },
    GenderComboboxModal: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: "white",
        alignItems: "center",
        width: "100%",
        flex: 1,
        fontWeight: "bold",
        fontSize: 22,
        color: COLORS.black
    },
    comboContainer: {
        height: SIZES.btnHeight,
        borderWidth: 0.5,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "92%",
        borderColor: COLORS.primary,
    },
    btnTextBox: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    imgProfileWrapper: {
        marginVertical: SIZES.padding,
        width: "60%",
        height: "25%",
        alignItems: "center",
        justifyContent: "center",
    },
    imgProfile: {
        width: "100%",
        borderRadius: 25,
        height: "100%",
    }
})

export default function SignUp({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderCombobox, setShowGenderCombobox] = useState(false);

    //Checking if the keyboard is showing
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
        });

        checkPermission();

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    //A function that checks if permission to access images has been granted.
    async function checkPermission() {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return false;
            } else {
                return true;
            }
        }
    };

    //A function that picks an image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 0.5,
        });

        if (!result.cancelled) {
            handleChange("data:image/jpeg;base64," + result.base64, "img");
        }
    };


    function onSignInClicked() {
        navigation.replace("Login1")
    }

    let arrData = ["Gender", "M", "F"]

    const [personType, setPersonType] = useState("0");
    const [person, setPerson] = useState({
        fName: "",
        surname: "",
        email: "",
        id: "",
        phone: "",
        gender: "",
        pwd: "",
        pwd2: "",
        DOB: "",
        img: "",
        race: "",
        province: "",
        city: "",
        suburb: "",
        address: "",
    });

    //Handling TextBox changes
    function handleChange(text, name) {

        setShowGenderCombobox(false);
        setShowDate(false);

        setPerson((prev) => {
            if (name === "DOB") {
                return {
                    ...prev,
                    [name]: new Date(new Date(text).getFullYear(), new Date(text).getMonth(), new Date(text).getDate())
                }
            }
            return {
                ...prev,
                [name]: text
            }
        })
    }

    //Pushing to the backend
    function onSignUpClicked() {

        let blContinue = false;

        for (var key in person) {
            if (person[key] === "" || person[key] === "Gender") {
                if (key !== "img") {
                    alert("Please fill in all the details");
                    blContinue = false;
                    break;
                } else {
                    blContinue = true;
                }
            } else {
                blContinue = true;
            }
        }

        const { DOB, address, city, email, fName, gender, id, img, phone, province, race, suburb, surname } = person;

        if (blContinue) {

            let data = {
                location: { address, city, suburb, province },
                email,
                fName,
                identifiedAs: { DOB, gender, race },
                img,
                phone,
                surname,
                isProfessional: false,
                isVerified: false,
                package: "Public"
            }

            if (personType === "1") {
                data = {
                    ...data,
                    HPCSANum: id,
                    isProfessional: true,
                    isPostGrad: false,
                    isGrad: true,
                }
            } else if (personType === "2") {
                data = {
                    ...data,
                    idNum: id,
                    isProfessional: true,
                    isPostGrad: false,
                    isGrad: false
                }
            }

            else {
                data = { ...data, idNum: id }
            }

            firebase.auth().createUserWithEmailAndPassword(person.email, person.pwd)
                .then(() => {
                    // Signed in 
                    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                        ...data,
                        uid: firebase.auth().currentUser.uid,
                    }).then(() => navigation.replace("Home"))
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                    console.log(errorMessage)
                });
        }
    }

    //Going to the next screen 
    function onNextClicked() {
        if (person.fName !== "" && person.surname !== "" && person.email !== "" && person.id !== "" && person.pwd !== "" && person.pwd2 !== "") {
            if (person.pwd === person.pwd2)
                setModalVisible(true);
            else {
                alert("Your password are different!")
            }
        } else {
            alert("Please fill in all the details!")
        }
    }

    return <>
        <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor={COLORS.primary} />
            {/* Blue Circle on top */}
            <View style={styles.topCircle}></View>

            {/* User Alias */}
            <View style={styles.logoWrapper} >
                <Text style={{ ...FONTS.h4_comfortaa, color: COLORS.white, textAlign: 'center' }}>Hi Mfundo Cele</Text>
            </View>

            {/* My form container  */}
            <View style={styles.view}>
                <View style={styles.container}>
                    <View style={styles.btnSwitch} >
                        <TouchableOpacity style={styles.unFocusedView} onPress={() => onSignInClicked()}>
                            <Text style={{ ...styles.text, color: COLORS.primary }}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.focusedView}>
                            <Text style={{ ...styles.text, color: COLORS.white }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={{ width: "100%", marginVertical: 20 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: (keyboardStatus ? "40%" : 0) }}
                    >
                        <DropDown style={{ marginBottom: (personType === "0" ? 40 : 10) }} icon="category" value={personType} setValue={setPersonType} />

                        {/* Rendering the screen only after the user has choosen an option */}
                        {personType !== "0" && <View>
                            <TextBox placeholder="First Name" icon="badge" value={person.fName} onChangeText={(text) => handleChange(text, "fName")} />
                            <TextBox placeholder="Surname" icon="person" value={person.surname} onChangeText={(text) => handleChange(text, "surname")} />
                            <TextBox placeholder="Email Address" icon="email" value={person.email} onChangeText={(text) => handleChange(text, "email")} />

                            {/* Rendering textbox for individual */}
                            {personType !== "1" && <TextBox placeholder="ID Number" icon="confirmation-number" value={person.id} onChangeText={(text) => handleChange(text, "id")} />}

                            {/* Rendering textbox for professional */}
                            {personType === "1" && <TextBox placeholder="HPCSA Number" icon="confirmation-number" value={person.id} onChangeText={(text) => handleChange(text, "id")} />}

                            <TextBox placeholder="Password" secureTextEntry={true} icon="visibility" value={person.pwd} onChangeText={(text) => handleChange(text, "pwd")} />
                            <TextBox placeholder="Confirme Password" secureTextEntry={true} icon="visibility" value={person.pwd2} onChangeText={(text) => handleChange(text, "pwd2")} />
                        </View>}
                    </ScrollView>

                    <View style={styles.btnWrapper}>
                        <Btn style={{ width: "100%" }} onPress={() => onNextClicked()} title="Next" />
                    </View>
                </View>
            </View>
        </View>




        {/* //////////////////////////////////////////////////////My registration Modal\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.modal}>
                <View style={styles.modalScreen}>
                    <Text style={{ ...FONTS.h4_comfortaa, bottom: SIZES.padding, marginTop: SIZES.padding }}>Just one more step</Text>

                    <TouchableOpacity onPress={() => {
                        if (checkPermission())
                            pickImage();
                        else {
                            checkPermission()
                        }
                    }}
                        style={styles.imgProfileWrapper}>
                        {person.img !== "" ? <Image source={{ uri: person.img }} style={styles.imgProfile} /> :
                            <Text style={{ ...FONTS.h5_comfortaa, textAlign: "center" }}>Click here to add a picture</Text>}
                    </TouchableOpacity>


                    <ScrollView
                        style={{ width: "100%", marginVertical: 20 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: (keyboardStatus ? "10%" : 0) }}
                    >

                        {/* Orientation details */}
                        <Text style={{ ...FONTS.h5_comfortaa, marginLeft: SIZES.padding }}>Identified as</Text>
                        <View style={styles.separator}></View>
                        <View style={{ marginLeft: SIZES.padding * 2 }}>
                            <TextBox placeholder="Race" icon="groups" value={person.race} onChangeText={(text) => handleChange(text, "race")} />

                            {/* //////////////////////////////////////////////////////Gender COMBO BOX\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                            {Platform.OS !== "ios" ? <Combobox icon="person" arrData={arrData} onValueChange={(value, index) => handleChange(value, "gender")} value={person.gender} />

                                : //If iOS

                                <TouchableOpacity style={styles.btnTextBox} onPress={() => setShowGenderCombobox(!showGenderCombobox)} >
                                    <TextBox icon="person" placeholder="Gender" pointerEvents="none" editable={false} value={person.gender} />
                                </TouchableOpacity>

                            }

                            {/* //////////////////////////////////////////////////////Date Picker COMBO BOX\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                            <TouchableOpacity style={styles.btnTextBox} onPress={() => Platform.OS === "ios" ? setShowDatePicker(!showDatePicker) : setShowDate(!showDate)} >
                                <TextBox icon="calendar-today" placeholder="Date of birth" value={person.DOB !== "" ? person.DOB.toDateString() : ""} pointerEvents="none" editable={false} />
                            </TouchableOpacity>

                            {showDate ? <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(person.DOB !== "" ? person.DOB : null)}
                                mode={"date"}
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => handleChange(selectedDate, "DOB")}
                            /> : null}

                        </View>


                        {/* //Location details */}
                        <Text style={{ ...FONTS.h5_comfortaa, marginLeft: SIZES.padding }}>Location</Text>
                        <View style={styles.separator}></View>
                        <View style={{ marginLeft: SIZES.padding * 2 }}>
                            <TextBox placeholder="Province" icon="home" value={person.province} onChangeText={(text) => handleChange(text, "province")} />
                            <TextBox placeholder="City" icon="home" value={person.city} onChangeText={(text) => handleChange(text, "city")} />
                            <TextBox placeholder="Suburb" icon="home" value={person.suburb} onChangeText={(text) => handleChange(text, "suburb")} />
                            <TextBox placeholder="Address" icon="home" value={person.address} onChangeText={(text) => handleChange(text, "address")} />
                        </View>

                        {/* Other details */}
                        <Text style={{ ...FONTS.h5_comfortaa, marginLeft: SIZES.padding }}>Others</Text>
                        <View style={styles.separator}></View>
                        <View style={{ marginLeft: SIZES.padding * 2 }}>
                            <TextBox placeholder="Mobile Number" keyboardType="phone-pad" icon="call" value={person.phone} onChangeText={(text) => handleChange(text, "phone")} />
                        </View>


                    </ScrollView>



                    <View style={styles.btnWrapper}>
                        <Btn
                            style={{ width: "45%", backgroundColor: COLORS.secondary }}
                            title="Cancel"
                            onPress={() => setModalVisible(false)}
                        />
                        <Btn
                            style={{ width: "45%" }}
                            title="Sign Up"
                            onPress={() => onSignUpClicked()}
                        />
                    </View>
                </View>
            </View>



            {/* //////////////////////////////////////////////////////My Gender GenderCombobox Modal\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showGenderCombobox}
                onRequestClose={() => {
                    setShowGenderCombobox(!showGenderCombobox);
                }}
            >
                <View style={{ ...styles.comboScreen }}>
                    <TouchableOpacity onPress={() => setShowGenderCombobox(!showGenderCombobox)} style={{ height: "70%", width: "100%", backgroundColor: "transparent" }}></TouchableOpacity>
                    <View style={styles.GenderComboboxModal}>
                        <Combobox style={styles.TextBox} arrData={arrData} onValueChange={(value, index) => handleChange(value, "gender")} value={person.gender} />
                    </View>
                </View>
            </Modal>


            {/* //////////////////////////////////////////////////////My DatePicker Modal\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDatePicker}
                onRequestClose={() => {
                    setShowDatePicker(!showDatePicker);
                }}
            >
                <View style={{ ...styles.comboScreen }}>
                    <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} style={{ height: "70%", width: "100%", backgroundColor: "transparent" }}></TouchableOpacity>
                    <View style={styles.GenderComboboxModal}>
                        <DateTimePicker
                            style={{ width: "100%" }}
                            testID="dateTimePicker"
                            value={new Date(person.DOB !== "" ? person.DOB : null)}
                            mode="date"
                            textColor={COLORS.black}
                            is24Hour={true}
                            display="spinner"
                            onChange={(event, selectedDate) => handleChange(selectedDate, "DOB")}
                        />
                    </View>
                </View>
            </Modal>
        </Modal>
    </>
}