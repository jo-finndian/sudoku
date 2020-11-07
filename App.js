import React from 'react';
import {StyleSheet } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'; 

import firebase from "firebase";
import "@firebase/firestore";

import Home from "./screens/Home";
import Game from "./screens/Game";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Signup from "./screens/Signup";

EStyleSheet.build({ // always call EStyleSheet.build() even if you don't use global variables!
// $textColor: '#0275d8'
});

  // FIREBASE
  const firebaseConfig = {
    apiKey: "AIzaSyDFyZqUM8M6znJj2mz3ocETKcb9QLp8jkk",
    authDomain: "sudoku-d703f.firebaseapp.com",
    databaseURL: "https://sudoku-d703f.firebaseio.com",
    projectId: "sudoku-d703f",
    storageBucket: "sudoku-d703f.appspot.com",
    messagingSenderId: "505997393850",
    appId: "1:505997393850:web:22758abdadd5b9ddc42783",
    measurementId: "G-2FR68JYMY5"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const Drawer = createDrawerNavigator();
  const GameStack = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const GameStackNavigator = () => {
    return (
      <GameStack.Navigator
        tabBarOptions={{
          activeTintColor: "#4ffffe",
          inactiveTintColor: "#A429FFAA",
          style: {
            backgroundColor: '#091C1C',
            paddingBottom: 5,
            paddingTop: 5,
            borderTopWidth: 1,
            borderTopColor: "#4ffffe",
          }
        }}
      >
        <GameStack.Screen name="Home" component={Home} 
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="dashboard" size={24} color={focused ? "#4ffffe" : "#A429FF9A"} />
          ),
        }}/>

        <GameStack.Screen name="Game" component={Game}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="ios-grid" size={24} color={focused ? "#4ffffe" : "#A429FF9A"} />
          ),
        }}/>
        <GameStack.Screen name="Settings" component={Settings} 
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="sliders-h" size={24} color={focused ? "#4ffffe" : "#A429FF9A"} />
          ),
        }}/>
      </GameStack.Navigator>
    );
  };

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={GameStackNavigator} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Signup" component={Signup}/>
      </Drawer.Navigator>   
    );
  };

export default function App() {
    return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}