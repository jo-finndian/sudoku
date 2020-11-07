import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Alert } from 'react-native';
import EStyleSheet, { create } from 'react-native-extended-stylesheet';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons'; 

import TwoBtnAlert from '../components/Alert';
import NewGameBtn from '../components/NewGameBtn';
import SavedGameBtn from '../components/SavedGameBtn';

import { onChange } from 'react-native-reanimated';

const Game = ({ navigation, props }) => {

  const [hide, setHide] = useState(true);
  const [gameMat, setGameMat] = useState();
  const [createNew, setCreateNew] = useState(false);
  const [useSaved, setUseSaved] = useState(false);
  const [answerKey, setAnswerKey] = useState(setAnswerKey);
  const [guesses, setGuesses] = useState([])
  const [level, setLevel] = useState("Easy");
  const [totalGuesses, setTotal] = useState();

  var guessesArray = [];
  var answerKeyArray = [];
  var unique = [];

  var answerKeyString = '';
  var guessString = '';
  var gameStr = '';
  var origStr = '';
  var enableBtn = true;
    
  console.log(enableBtn);

  if (createNew == true && useSaved == false ) {
    setHide(false);
    
    fetchAPICall();
    setCreateNew(false)

    console.log("createNew: " + createNew);
    console.log("savedGame: " + useSaved);
  }
  
  if ( useSaved == true && createNew == false ) {
    setHide(false);
    
    fetchInfo();
    setUseSaved(false)
    console.log("createNew: " + createNew);
    console.log("savedGame: " + useSaved);
  }

  function fetchAPICall() {
    console.log("fetchAPICall success")
    
    fetch("https://online-sudoku.p.rapidapi.com/random", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "online-sudoku.p.rapidapi.com",
        "x-rapidapi-key": "f08704135emsh71b036d8723772fp11defcjsna39e16a56750"
      }
    })
    .then(response => response.json())
    .then(response => {
      var str = response["item"];
      var matrix = str.match(/.{1,9}/g);
      
      var matrixStr = JSON.stringify(matrix);

      console.log("2: api fetched, sending to formatMatrix");
      // console.log(matrix);
      formatNewMatrix(matrixStr)
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  function updateAsyncStorage(gameStr, answerKeyString, guessString, savedLevel) {
    //include guessString
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem("savedGame");
        await AsyncStorage.removeItem("answerKey");
        await AsyncStorage.removeItem("guesses");
        await AsyncStorage.removeItem("savedGameLevel");

        await AsyncStorage.setItem("savedGame", gameStr);
        await AsyncStorage.setItem("answerKey", answerKeyString);
        await AsyncStorage.setItem("guesses", guessString);
        await AsyncStorage.setItem("savedGameLevel", savedLevel);
        
        console.log("3: Async updated successfully");
        return resolve(true);
      } catch (e) {
        return reject(e);
      } 
    }); 
  };
  
  async function fetchInfo() {
    const answerString = await AsyncStorage.getItem("answerKey");
    const savedGame = await AsyncStorage.getItem("savedGame");
    const savedGuesses = await AsyncStorage.getItem("guesses");
    const savedLevel = await AsyncStorage.getItem("savedGameLevel");

    if (savedGame && answerString && savedGuesses && savedLevel) {
      // console.log("2a Game string: ", answerString);
      console.log("2b Game stored: ", savedGame);
      console.log("2b Game stored: ", answerString);
      console.log("2b Game stored: ", savedGuesses);
      console.log("2b Game stored: ", savedLevel);

      formatSavedGame(answerString, savedGame, savedGuesses, savedLevel)
    }
    else {
      console.log("no game data");
    }
  }

  async function fetchSettings() {
    const levelSetting = await AsyncStorage.getItem("level");

    if (levelSetting) {
      setLevel(levelSetting);
    }
  }

  fetchSettings();
  
  // creates unique random numbers
  function uniqueRandNums(qty, min, max) {
    var rand, arr = [];

    do {
      do {
        rand = Math.floor( Math.random() * max ) + min
      }
      while ( arr.includes(rand) )
        arr.push(rand);
    } while( arr.length < qty )
    
    return arr;
  }

  // formats matrix string into arrays
  function formatNewMatrix(data) {
    var matrixArray = data.replace(/"/g, '').replace(/]/g, '').replace(/\[/g, '').split(",");

    String.prototype.replaceAt = function(index, replacement) {
      if (index >= this.length) {
        return this.valueOf();
      }
      return this.substring(0, index) + replacement + this.substring(index);
    }
    var levelNum = '';
    
    if (level == "Easy") {
      levelNum = 4;
      setTotal(levelNum * 9);
    }
    if (level == "Medium") {
      levelNum = 5;
      setTotal(levelNum * 9);
    }
    if (level == "Hard") {
      levelNum = 6;
      setTotal(levelNum * 9);
    }
    for (var i = 0; i<=8; i++) { // loops through all arrays
      var randNums = uniqueRandNums(levelNum, 1, 9);
      
      for (var x = 0; x <= levelNum-1 ; x++) { // loops through replaces an character in array based on num string

        var index = matrixArray[i].indexOf(randNums[x]);

        var indexAnswer = [i, index, randNums[x]];

        answerKeyArray.push(indexAnswer);

        matrixArray[i] = matrixArray[i].replace(randNums[x], "?");
      }
      
      matrixArray[i] = matrixArray[i].split('');
    }
    console.log(matrixArray)
    
    updateGameMatrix(matrixArray); // game matrix array, with ?
    updateAnswerKey(answerKeyArray);
  }

  // format saved matrix string into arrays
  function formatSavedGame(answerString, savedGame, savedGuesses, savedLevel) {

    // GAME MATRIX FORMATTING
    var savedGame = savedGame.replace(/"/g, '').replace(/]/g, '').replace(/\[/g, '').replace(/,/g, '');
    var savedGameArray = savedGame.match(/.{1,9}/g);
    
    for (var i = 0; i<=8; i++) { // loops through all arrays
      savedGameArray[i] = savedGameArray[i].split('');
    }

    // ANSWER KEY FORMATTING
    var answerArray = answerString.replace(/\[/g, '').replace(/]/g, '').replace(/,/g, '').replace(/"/g, '').match(/.{1,3}/g);

    for (var j = 0; j <= answerArray.length-1 ; j++) { // loops through all arrays
      answerArray[j] = answerArray[j].split('');
    }

    // GUESS FORMATTING
    var savedGuessesArray = savedGuesses.replace(/\[/g, '').replace(/]/g, '').replace(/,/g, '').replace(/"/g, '').match(/.{1,3}/g);

    for (var x = 0; x <= savedGuessesArray.length-1 ; x++) { // loops through all arrays
      savedGuessesArray[x] = savedGuessesArray[x].split('');
    }

    // ADD GUESSES INTO GAME MATRIX
    for ( var i=0; i <= savedGuessesArray.length-1 ; i++ ) {
      for ( var j=0; j <= savedGameArray.length-1 ; j++ ) {
        for (var x=0; x <= savedGameArray[j].length ; x++) {
          if (savedGuessesArray[i]["0"] == j && savedGuessesArray[i]["1"] == x ) {            
            savedGameArray[j][x] = savedGuessesArray[i]["2"]+" ";
          }
        }
      }
    }

    updateAnswerKey(answerArray); // set answer key
    updateGameMatrix(savedGameArray); // game matrix array, with ?
    setGuesses(savedGuessesArray);
    setLevel(savedLevel);
    guessesArray = savedGuessesArray;
    console.log("game array")
    console.log(savedGameArray);
  }

  function resetGame() {
    setCreateNew(true);
    setUseSaved(false);
    setGuesses('');

    console.log("RESTART GAME");
  }

  function saveGame() {
    answerKeyString = JSON.stringify(answerKey);
    gameStr = JSON.stringify(gameMat);

    console.log("Unique: " + guesses)
    console.log("Game string: " + gameStr)
    console.log("Answer string: " + answerKeyString)

    guessString = JSON.stringify(guesses);

    updateAsyncStorage(gameStr, answerKeyString, guessString, level); // saves original matrix string and game matrix string in case user wants to stop/continue game

    TwoBtnAlert();
    console.log("GAME SAVED");
  }
  
  function updateGameMatrix(gameArray) {
    console.log("game matrix useState set");
    setGameMat(gameArray);
  }

  function updateAnswerKey(answerKeyArray) {
    console.log("answer key useState set");
    setAnswerKey(answerKeyArray);
  }
  
  const onChangeGuess = (key, index, guess) => {
    var info = [key, index, guess]

    if (guessesArray.length === 0 ){
      guessesArray = guesses;
    }

    guessesArray.push(info);
    
    for (var i=0; i <= guessesArray.length-1 ; i++) {
      if ( info["0"] == guessesArray[i]["0"] && info["1"] == guessesArray[i]["1"] && info["2"] != guessesArray[i]["2"] ) {
        guessesArray.splice(i, 1);
      }
    }

    removeDups(guessesArray);
  }

  function updateGuesses(data) {
    console.log(data)
    // count++
    setGuesses(data);

    if ( data.length == 36 ) {
      console.log("all guesses made")
    }

    console.log("guess array length: " + data.length);
  }

  function removeDups(data) {
    let obj = {};

    data.forEach(function(i) {
      if(!obj[i]) {
        obj[i] = true;
      }
    });

    unique = Object.entries(obj);

    for (var i=0; i <= unique.length-1; i++) {
      unique[i].splice(1,1);
      unique[i] = unique[i]["0"].split(',');
      // console.log(unique[i])
    }
    console.log("Dups removed: " + unique)
    updateGuesses(unique);

    return unique;
  }

  const checkAnswers = () => {
    console.log("CHECKING ANSWERS");
    var matchCount = 0;
    var errorCount = 0;

    for ( var i=0; i <= guesses.length-1 ; i++ ) {
      for ( var j=0; j <= answerKey.length-1 ; j++ ) {
        if (guesses[i]["0"] == answerKey[j]["0"] && guesses[i]["1"] == answerKey[j]["1"] && guesses[i]["2"] == answerKey[j]["2"]) {
          count++;
        }
        else if ( guesses[i]["0"] == answerKey[j]["0"] && guesses[i]["1"] == answerKey[j]["1"] && guesses[i]["2"] != answerKey[j]["2"] ){
          errorCount++;
        }
      }
    }

    console.log(count);

    // alert number of mistakes, "ok" btn triggers assigning guesses to guessesArray
    if ( errorCount > 0 ) {
      alert("You made " + errorCount + " mistakes. Keep trying!");
    }

    if ( matchCount === totalGuesses ) {
      enableBtn = true;
    }
    else {
     enableBtn = false; 
    }

    guessesArray = guesses;
  };

  const newGameTruthyHandler = () => {
    setCreateNew(true);
    setUseSaved(false);
  }
  
  const useSavedTruthyHandler = () => {
    setUseSaved(true);
    setCreateNew(false);
  }

  return (
    <View style={styles.main}>

      <View style={
        hide
        ? styles.btnContainer
        : styles.hide
        }>
        <NewGameBtn newGameTruthyHandler={newGameTruthyHandler} />
        <SavedGameBtn useSavedTruthyHandler={useSavedTruthyHandler} />
      </View>

      <View style={
        !hide
        ? styles.container
        : styles.hide
        } >
        <View style={styles.infoContainer}>
          <Text style={styles.levelBold}>Level: <Text style={styles.level}>{level}</Text></Text>
          <TouchableOpacity
            style={styles.miniBtnRedo} 
            onPress={resetGame}
          >
          <Text style={styles.buttonText}>
            <FontAwesome5 name="redo-alt" size={24} color="white" />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.miniBtnSave} 
          onPress={saveGame}
        >
          <Text style={styles.buttonText}>
            <FontAwesome5 name="save" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </View>

        {/* Game board */}
        <View style={styles.game} >

          <View style={styles.columnContainer}>
            <View style={EStyleSheet.child(styles, 'column')}></View>
            <View style={EStyleSheet.child(styles, 'column')}></View>
            <View style={EStyleSheet.child(styles, 'column')}></View>
          </View>
          <View style={styles.rowContainer}>
            <View style={EStyleSheet.child(styles, 'row')}></View>
            <View style={EStyleSheet.child(styles, 'row')}></View>
            <View style={EStyleSheet.child(styles, 'row')}></View>
          </View>

          <View style={styles.board} >
            { !gameMat
            ? <Text>Updating...</Text>
              : gameMat.map((item, key) => 
                item.map((obj, index) =>
                (obj == "?" || obj == "1 " || obj == "2 " || obj == "3 " || obj == "4 " || obj == "5 " || obj == "6 " || obj == "7 " || obj == "8 " || obj == "9 ") 
                ? <TextInput key={index}
                  style={EStyleSheet.child(styles, 'red', key, gameMat.length)}
                  placeholder={obj}
                  placeholderTextColor={(obj == "?") ? "#FFC936" : "#4FFFFE"}
                  onChangeText={(guess) => guess != "" ? onChangeGuess(key, index, guess) : null }
                  maxLength={1}
                />
                : <TextInput key={index}
                style={EStyleSheet.child(styles, 'input', key, gameMat.length)}
                placeholder={obj}
                value={obj}
                editable={false}
                />
            ))
            }
          </View>

        </View>

        <TouchableOpacity
          disabled={enableBtn}
          style={enableBtn ? styles.disableBtn : styles.btn} 
          style={styles.btn}
          onPress={checkAnswers}
        >
          <Text style={styles.buttonText}>Check Answers</Text>
        </TouchableOpacity>
      </View>
</View>
  );
};

export default Game

const styles = EStyleSheet.create({
  hide: {
    display: "none",
  },  
  main: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    marginTop: 10,
    paddingTop: 40,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: '#091C1C',
    alignItems: "center",
  },
  btnContainer: {
    flex: 1,
    marginTop: 10,
    paddingTop: 40,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: '#091C1C',
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
    borderColor: "#4FFFFE",
    width: Dimensions.get("window").width - 40,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  game: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").width - 40,
    backgroundColor: '#091C1C',
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
  },
  columnContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    flexDirection: "row",
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#A729FF",
  },
  column: {
    flex: 1,
    borderRightWidth: 3,
    borderColor: "#A729FF",
    width: Dimensions.get("window").width / 3,
    height: '100%',
    position: 'relative',
  },
  rowContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    flexDirection: "column",
  },
  row: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: "#A729FF",
    width: "100%",
    height: Dimensions.get("window").width / 3,
    position: 'relative',
  },
  red: {
    color: '#4FFFFE',
    fontSize: 25,
    textAlign: "center",
    textAlignVertical: "center",
    borderColor: "#A729FF",
    borderStyle: "solid",
    fontWeight: "bold",
    width: Dimensions.get("window").width / 10,
    height: Dimensions.get("window").width / 10,
  },
  'red:nth-child-even': {
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  'red:nth-child-odd': {
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  'red:last-child': {
    borderBottomWidth: 1,
  },
  input: {
    color: '#4FFFFE',
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
    borderColor: "#A729FF",
    borderStyle: "solid",
    width: Dimensions.get("window").width / 10,
    height: Dimensions.get("window").width / 10,
  },
  'input:nth-child-even': {
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  'input:nth-child-odd': {
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  'input:last-child': {
    borderBottomWidth: 1,
  },
  btn: {
    position: "relative",
    backgroundColor: "#A429FF",
    marginTop: 20,
    padding: 20,
    width: Dimensions.get("window").width - 40,
  },
  disableBtn: {
    borderColor: "#4FFFFE",
    borderWidth: 2,
    position: "relative",
    backgroundColor: "grey",
    marginTop: 20,
    padding: 20,
    width: Dimensions.get("window").width - 40,
  },
  levelBold: {
    color: "#FFC936",
    flex: 2,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
  },
  level: {
    fontWeight: "normal",
    color: "#FFC936",
  },
  miniBtnRedo: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#A429FF",
    borderRadius: 50,
    marginHorizontal: 5,
    width: 50,
    height: 50,
  },
  miniBtnSave: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#A429FF",
    borderRadius: 50,
    marginHorizontal: 5,
    width: 50,
    height: 50,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    textTransform: "uppercase",
  }
})