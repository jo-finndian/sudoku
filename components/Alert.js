import React from "react";
import { Alert } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';


export default function TwoBtnAlert() {
    // return (
        Alert.alert(
          "Game Saved",
          "Your current game has been saved. When you return to the app, choose 'Saved Game' to resume.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
    // )
}