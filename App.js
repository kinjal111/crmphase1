/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import FlashMessage from "react-native-flash-message";

import { HomeIconWithBadge } from './components/IconHome';

console.disableYellowBox = true;

  enableScreens;


// console.log = function() {}
//console.warn = function() {}

export default function App(props) {

  


    return (

      <View style={styles.container}>

        <StatusBar barStyle='light-content' />
          
          <HomeIconWithBadge>
            
            <AppNavigator />
            <FlashMessage position="top" style={{paddingVertical:23}} />
          </HomeIconWithBadge>
      
      </View>
    
    );
    
  }
    
function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00b1f7',
  },
});





