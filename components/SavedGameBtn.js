import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

export default function SavedGameBtn(props) {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={props.useSavedTruthyHandler}
    >
      <Text style={styles.buttonText}>Saved Game</Text>
    </TouchableOpacity>
  );
}
// test github
const styles = StyleSheet.create({
  btn: {
    position: "relative",
    backgroundColor: "#A429FF3A",
    borderColor: "#A429FF",
    borderWidth: 2,
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
    width: Dimensions.get("window").width - 100,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    textTransform: "uppercase",
  }
});
