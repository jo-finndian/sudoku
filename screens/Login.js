import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from "react-native";
import firebase from "firebase";

const Login = ({ navigation }) => {

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const onChangeTextEmail = (email) => {
    setLoginForm({
      ...loginForm,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setLoginForm({
      ...loginForm,
      password,
    });
  };

  const loginHandler = () => {
    return new Promise(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(loginForm.email, loginForm.password)
        .then((res) => {
          navigation.navigate("Home");
        })
        .catch((err) => alert(err.message));
    });
  };
  
  var provider = new firebase.auth.GoogleAuthProvider();

  const loginGoogle = () => {
    return new Promise(() => {
      firebase
        .auth()
        .signInWithRedirect(provider)
        .then((res) => {
          var token = result.credential.accessToken;
          var user = result.user;
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
        value={loginForm.email}
        onChangeText={onChangeTextEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={loginForm.password}
        secureTextEntry
        onChangeText={onChangeTextPassword}
      />
      <TouchableOpacity style={styles.button} onPress={loginHandler}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // style={styles.button}
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        <Text style={styles.buttonText2}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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
