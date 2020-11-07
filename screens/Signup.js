import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";

const Signup = ({ navigation }) => {
  const [singupForm, setSignupForm] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });

  const onChangeTextEmail = (email) => {
    setSignupForm({
      ...singupForm,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setSignupForm({
      ...singupForm,
      password,
    });
  };
  const onChangeTextName = (name) => {
    setSignupForm({
      ...singupForm,
      name,
    });
  };
  const onChangeTextUsername = (username) => {
    setSignupForm({
      ...singupForm,
      username,
    });
  };

  const createAccount = () => {
    return new Promise(() => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(singupForm.email, singupForm.password)
        .then((res) => {
          firebase
            .firestore()
            .collection("Users")
            .doc(res.user.uid)
            .set({
              uid: res.user.uid,
              email: res.user.email,
              name: singupForm.name,
              username: singupForm.username,
            })
            .then(() => {
              console.log("User successfully created!");
              navigation.navigate("Home");
            })
            .catch((err) => {
              console.log(err);
              alert("Create account failed, Error:" + err.message);
            });
        })
        .catch((err) => alert(err.message));
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={onChangeTextEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={onChangeTextPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={onChangeTextName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={onChangeTextUsername}
      />
      <TouchableOpacity style={styles.button} onPress={createAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText2}>Go to login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkslateblue",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    color: 'white',
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "mediumpurple",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
  buttonText2: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
