import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
    var [gameMatrix, setGameMatrix] = useState();

    // API CALL
    const fetchAPICall = () => {
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
        // console.log(matrix);
        
        String.prototype.replaceAt = function(index, replacement) {
          if (index >= this.length) {
            return this.valueOf();
          }
          return this.substring(0, index) + replacement + this.substring(index + 1);
        }
  
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
  
        var randNums = uniqueRandNums(4, 0, 8);
        
        for (var i = 0; i<=8; i++) { // loops through all arrays
          for (var x = 0; x <= 3 ; x++) { // loops through replaces an character in array based on num string
            matrix[i] = matrix[i].replaceAt(randNums[x], '?');
          }
        }
        var matrixStr = JSON.stringify(matrix);
        updateInfo(matrixStr);
      })
      .catch(err => {
        console.log(err);
      });
    }
    
    const updateInfo = (matrix) => {
      updateAsyncStorage(matrix);
    }
  
    function updateAsyncStorage(matrix) {
      return new Promise(async (resolve, reject) => {
        try {
          await AsyncStorage.removeItem("gameMatrix");
          // console.log(matrix);
          await AsyncStorage.setItem("gameMatrix", matrix);
  
          console.log("async updated successfully");
          
          fetchInfo();
          return resolve(true);
        } catch (e) {
          return reject(e);
        } 
      }); 
    };

  return (
    <View style={styles.container}>
        <Button onPress={fetchAPICall(4)} style={styles.btn}>Easy</Button>
        <Button onPress={fetchAPICall(5)} style={styles.btn}>Medium</Button>
        <Button onPress={fetchAPICall(6)} style={styles.btn}>Hard</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
  },
  textTitle: {
    color: "purple",
    fontSize: 25,
    fontWeight: "700",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'darkslateblue',
    color: 'white',
  }
});