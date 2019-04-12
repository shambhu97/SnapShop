import React from "react";
import Routes from "./Routes";
import {
  StatusBar,
  View,
  YellowBox
} from "react-native";

console.disableYellowBox = true; 

const App = () => ( 
  <View style = {
    {
      flex: 1
    }
  } >
  <Routes / >
  </View>
);

export default App;