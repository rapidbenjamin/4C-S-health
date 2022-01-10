import React, { useState } from "react"
import { FlatList, View, StyleSheet, Platform, StatusBar } from "react-native"
import { COLORS, SIZES } from "../constants"
import { PayFastWebView } from "react-native-payfast-gateway";

export default function PaymentScreen({navigation}) {

    const [success, setSuccess] = useState(false)
    const [paymentData, setPaymentData] = useState({});

    let onceOffPayment = {
        merchant_id: "10023187",
        merchant_key: '24l8r2pft6lw7',
        amount: "60.00",
        item_name: 'React Native Purchase'
    }

    let subscription = {
        subscription_type: 1,
        recurring_amount: "200.00",
        frequency: 3,
        cycles: 0
    }

    return <PayFastWebView
            sandbox={true}
            onClick={() => navigation.goBack()}
            callback={setSuccess}
            passphrase={"heyKeepLearningNeverStop1"}
            signature={true}
            data={onceOffPayment} />
}