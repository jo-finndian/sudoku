import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

export default function NewGameBtn(props) {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={props.newGameTruthyHandler}
    >
      <Text style={styles.buttonText}>New Game</Text>
    </TouchableOpacity>
  );
}
// test github
const styles = StyleSheet.create({
  btn: {
    position: "relative",
    backgroundColor: "#4ffffe3A",
    borderColor: "#4ffffe",
    borderWidth: 2,
    // marginTop: 20,
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
