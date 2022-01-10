import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { WebView } from "react-native-webview";

// Style sheet
const styles = StyleSheet.create({
    webViewWrapper: {
        width: "100%",
        flex: 1
    }
});

export default function BlogScreen({ navigation }) {
    const runFirst = `
        window.isNativeApp = true;
        document.getElementById("main-header").style.display = "none";
        
        document.querySelectorAll(".container").forEach(function (doc){
            doc.style.paddingTop = "20px";
        });
        document.querySelectorAll(".joinchat__button").forEach(function (doc){
            doc.style.display = "none";
        });
        document.getElementById("top-header").style.display = "none";
        document.getElementById("footer-bottom").style.display = "none";
        document.getElementById("sidebar").style.display = "none";
        true; // note: this is required, or you'll sometimes get silent failures
    `;


    
    return <View style={styles.webViewWrapper}>
        <WebView
            style={styles.webViewWrapper}
            source={{ uri: 'https://www.lifepathgroup.co.za/blog' }}
            injectedJavaScript={runFirst}
        />
    </View>
}