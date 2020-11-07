import React, { useState, useEffect, Components } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Switch,
  ScrollView,
  Image
} from "react-native";
import Slider from '@react-native-community/slider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CameraRoll from "@react-native-community/cameraroll";

import firebase from "firebase";

export default function Settings({ navigation }) {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState();
  const [level, setLevel] = useState("Easy");
  const [value, setValue] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      setLoading(true);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          getUserData(user.uid);
        } else {
          setUserInfo(null);
          setLoading(false);
          navigation.navigate("Login");
        }
      });
    });
    return isFocused;

  }, [userInfo, loading, navigation]);

  const getUserData = (uid) => {
    const docRef = firebase.firestore().collection("Users").doc(uid);
    
    docRef.get().then(function (doc) {
      if (doc.exists) {
        const userData = doc.data();
        setUserInfo(userData);
        console.log(userData)
        setTimeout(() => {
          setLoading(false);
        }, 600);
        
      } else {
        setLoading(false);
        console.log("no user data");
      }
    });
  };

  var user = firebase.auth().currentUser;

  const updateUserData = () => {
    const docRef = firebase.firestore().collection("Users").doc(user.uid);
    
    if (changeUserPassword.password == '') {
      alert('Please enter your password to make these changes.')
    }
    else {
      
      if (changeUserEmail.email != '') {
        alert("You will be logged out. Please sign back in with your new login credentials.")

        user.updateEmail(changeUserEmail.email).then(function() {
          // Update successful.
          console.log("User email updated");
        }).catch(function(error) {
          // An error happened.
          console.log("Error: email not updated : " + error);
        });
      }
  
      user.updatePassword(changeUserPassword.password).then(function() {
        alert("You will be logged out. Please sign back in with your new login credentials.")
        // Update successful.
        console.log("Password updated");
      }).catch(function(error) {
        // An error happened.
        console.log("Error: password not updated : " + error);
      });
      
      if (changeUserName.name != ''){
        docRef.update({
          name: changeUserName.name,
        })
        .then(function() {
          console.log("Document updated successfully");
        })
        .catch(function(error) {
          console.log(err)
          alert("Error updateding name: " + error.message)
        })
      }

      if (changeUserEmail != '') {
        docRef.update({
          email: changeUserEmail.email,
        })
        .then(function() {
          console.log("Document updated successfully");
        })
        .catch(function(error) {
          console.log(err)
          alert("Error updateding username: " + error.message)
        })
      }

      if (changeUserUsername.username != ''){
        docRef.update({
          username: changeUserUsername.username,
        })
        .then(function() {
          console.log("Document updated successfully");
        })
        .catch(function(error) {
          console.log(err)
          alert("Error updateding username: " + error.message)
        })
      }
    }
  }

  function updateAsyncStorage(level) {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem("level");

        await AsyncStorage.setItem("level", level);
        
        console.log("async updated successfully");
        fetchInfo();
        return resolve(true);
      } catch (e) {
        return reject(e);
      } 
    }); 
  };
  
  async function fetchInfo() {
    const gameLevel = await AsyncStorage.getItem("level");

    if (gameLevel) {
      setLevel(gameLevel);

      if (gameLevel == "Easy") {
        setValue(0);
      }
      else if (gameLevel == "Medium") {
        setValue(1);
      }
      else {
        setValue(2);
      }
    }
    console.log("data fetched, level: " + gameLevel);
  }

  const [changeUserEmail, setUserEmail] = useState({
    email: "",
  });

  const [changeUserPassword, setUserPassword] = useState({
    password: "",
  });

  const [changeUserName, setUserName] = useState({
    name: "",
  });

  const [changeUserUsername, setUserUsername] = useState({
    username: "",
  });

  const onChangeTextEmail = (email) => {
    setUserEmail({
      ...changeUserEmail,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setUserPassword({
      ...changeUserPassword,
      password,
    });
  };
  const onChangeTextName = (name) => {
    setUserName({
      ...changeUserName,
      name,
    });
  };
  const onChangeTextUsername = (username) => {
    setUserUsername({
      ...changeUserUsername,
      username,
    });
  };

  const levelHandler = (val) => {
    console.log(val)
    if (val == 0) {
      setLevel("Easy");
      setValue(0)
      updateAsyncStorage("Easy")
    }
    else if (val == 1) {
      setLevel("Medium");
      setValue(1)
      updateAsyncStorage("Medium")
    }
    else {
      setLevel("Hard");
      setValue(2)
      updateAsyncStorage("Hard")
    }
  }

  fetchInfo();

  // controls loading spinner
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="darkslateblue" />
      </View>
    );
  }
  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>User not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.card}>
      <View style={styles.inputs}>
        <Text style={styles.inputssubtitlesm}>Account</Text>
        <TextInput
          style={styles.input}
          placeholder={userInfo.email}
          autoCapitalize="none"
          onChangeText={onChangeTextEmail}
          placeholderTextColor={"#4ffffe"}
        />
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          onChangeText={onChangeTextPassword}
          placeholderTextColor={"#A729FF"}
        />
        <TextInput
          style={styles.input}
          placeholder={(userInfo.name == '') ? "Name" : userInfo.name}
          onChangeText={onChangeTextName}
          placeholderTextColor={"#4ffffe"}
          />
        <TextInput
          style={styles.input}
          placeholder={(userInfo.username == '') ? "Username" : userInfo.username}
          placeholderTextColor={"#4ffffe"}
          onChangeText={onChangeTextUsername}
        />
        <TouchableOpacity style={styles.btn} onPress={updateUserData}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Play Settings</Text>

        <Text style={styles.subtitlesm}>Level</Text>
        <Text style={styles.text}>{level}</Text>
        <Slider
          value={value}
          onValueChange={(val) => levelHandler(val)}
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          minimumTrackTintColor="#A429FF"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor={'#FFC936'}
          step={1}
          allowTouchTrack={true}
          animateTransitions={true}
          animationType={'spring'}
        />

        <Text style={styles.subtitlesm}>Time Games</Text>
        <Text style={styles.text}>Timer</Text>
        <Switch
        trackColor={{ false: "#550D82", true: "#4FFFF7" }}
        thumbColor={isEnabled ? "#FFC936" : "#6B10A3"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      </View>
    </ScrollView>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: "#091C1C",
  },
  scrollView: {
    flexDirection: "column",
  },
  card: {
    alignSelf: "center",
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#091C1C',
    borderColor: "#4FFFFE",
    borderWidth: 2,
    width: Dimensions.get('window').width - 20,
    height: "auto",
    marginHorizontal: 15,
    marginVertical: 5,
    shadowOffset: {
      width: 2,
      height: 2,
      },
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 15,
    justifyContent: "space-between",
    alignContent: "flex-start",
  },
  slider: {
    flex: 1,
    maxWidth: '70%',
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    color: "#FFC936",
  },
  subtitle: {
    fontSize: 24,
    marginHorizontal: 10,
    fontWeight: "bold",
    width: '100%',
    color: "#4FFFFE",
    // textDecorationLine: "underline",
    textTransform: 'uppercase',
  },
  subtitlesm: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 20,
    marginHorizontal: 10,
    fontWeight: "bold",
    width: '100%',
    color: "#4FFFFE",
    textTransform: 'uppercase',
  },
  inputssubtitlesm: {
    color: "#4FFFFE",
    marginBottom: 20,
    fontSize: 24,
    // marginHorizontal: 10,
    fontWeight: "bold",
    width: '100%',
  },
  text: {
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 18,
    color: "#FFC936",
  },
  inputs: {
    flex: 1,
  },
  input: {
    borderColor: "#4FFFFE",
    borderWidth: 2,
    width: '100%',
    backgroundColor: "#091C1C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  btn: {
    backgroundColor: "#A429FF",
    marginTop: 20,
    marginBottom: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
});