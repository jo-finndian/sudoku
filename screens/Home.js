import React, {useEffect, useState} from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressBarAnimated from 'react-native-progress-bar-animated';

import firebase from "firebase";
import { render } from "react-dom";

export default function Home( { navigation } ) {

  const [loading, setLoading] = useState();
  const [userInfo, setUserInfo] = useState();
  const [gamePercent, setPercent] = useState();
  const [level, setLevel] = useState("Easy");

  const getUserData = (uid) => {
    const docRef = firebase.firestore().collection("Users").doc(uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        const userData = doc.data();
        setUserInfo(userData);

        setTimeout(() => {
          setLoading(false);
        }, 600);

      } else {
        setLoading(false);
        console.log("no user data");
      }
    });
  };

  // checks if user is currently logged in, and passes uid to getUserData
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

  // SET GAME PERCENTAGE
  async function fetchInfo() {
    const savedGuesses = await AsyncStorage.getItem("guesses");
    const savedLevel = await AsyncStorage.getItem("savedGameLevel");

    if (savedLevel) {
      setLevel(savedLevel);
    }

    if ( savedGuesses.length != 0 ) {
      console.log("SAVED GUESSES: ", savedGuesses);
      formatSavedGuesses(savedGuesses)
    }
    else {
      console.log("no game data");
    }
  }

  const formatSavedGuesses = (savedGuesses) => {
    var savedGuessesArray = savedGuesses.replace(/\[/g, '').replace(/]/g, '').replace(/,/g, '').replace(/"/g, '').match(/.{1,3}/g);

    for (var x = 0; x <= savedGuessesArray.length-1 ; x++) { // loops through all arrays
      savedGuessesArray[x] = savedGuessesArray[x].split('');
    }

    var l = (savedGuessesArray.length / 36) * 100;
    l = Math.floor(l)
    console.log(l);
    setPercent(l);
  }

  fetchInfo();

  const barWidth = Dimensions.get('window').width - 60;
  const barHeight = 30;
  const progressCustomStyles = {
    backgroundColor: '#A429FF', 
    borderRadius: 0,
    borderColor: '#FFC936',
    flex: 1,
  };

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
        <View style={styles.card}>
          <Text style={styles.text}>Hello, {userInfo.name}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.col}>
            <Text style={styles.gameInfoBold}>Your Saved Game</Text>
              <Text style={styles.gameInfoBold}>Level: <Text style={styles.gameInfoBold}>{level}</Text></Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.gameInfo}>{gamePercent}% Complete</Text>
          </View>
        <ProgressBarAnimated
        {...progressCustomStyles}
            width={barWidth}
            height={barHeight}
            backgroundColorOnComplete="#A429FF"
            maxValue={36}
            value={gamePercent}
          />
        </View>
        
        <TouchableOpacity
        style={styles.text} 
        onPress={() => {
          console.log("logout");
          setLoading(true);
          firebase
          .auth()
          .signOut()
          .then(() => {
            console.log("Signout successfull!");
            
            setTimeout(() => {
              setLoading(false);
            }, 600);

            navigation.closeDrawer();
          })
          .catch((err) => alert(err.message));
        }}
      >
        <Text style={styles.link}>Logout</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "whitesmoke",
    backgroundColor: '#091C1C',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#091C1C',
  },
  card: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#091C1C',
    borderColor: "#4FFFFE",
    borderWidth: 2,
    width: Dimensions.get('window').width - 20,
    height: "auto",
    marginHorizontal: 5,
    marginVertical: 5,
    shadowOffset: {
      width: 2,
      height: 2,
      },
    shadowRadius: 10,
    elevation: 10,
  },
  gameInfo: {
    marginBottom: 10,
    fontSize: 20,
    color: "#4ffffe",
  },
  gameInfoBold: {
    marginBottom: 10,
    fontSize: 20,
    color: "#4ffffe",
    fontWeight: "bold",
    textTransform: 'uppercase',
  },
  col: {
    flexDirection: 'column',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  link: {
    marginTop: 10,
    fontSize: 15,
    color: '#4ffffe',
    textAlign: 'center',
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 25,
    color: '#4ffffe',
  },
  btn: {
    backgroundColor: "mediumpurple",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
    width: 300,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
