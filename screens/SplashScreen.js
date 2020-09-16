import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Alert,
  ImageBackground,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import firebase from 'react-native-firebase';
import Geocoder from 'react-native-geocoding';

import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

const imageBg = require('../assets/images/bg.png')

export default class SplashScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      fctoken: '',
      isVisible: true,

    }
  }

  componentDidMount = async () => {

    this.setState({

      isVisible: false

    }, () => {

      const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
      firebase.notifications().android.createChannel(channel);
      this.checkPermission();
      this.checkAuthentication();
      this.createNotificationListeners();
      Geocoder.init("AIzaSyBhS8CYq5drU4n2MTg_yNY5bfMvxsyzBAw");

    });
  }

  // check the token in the Async Storage And then navigate to login if it is null

  checkAuthentication = async () => {

    const userDetails = await AsyncStorage.getItem(Constant.api_token);
    console.log("   userDetails  " + userDetails);
   this.props.navigation.navigate((userDetails !== null) ? 'Main' : 'Login');

  }

  // Methods Call when push Notification Click/pressed and Tapped to Interaction Of Methods and delete the notification from Notification Tray in the device  

  componentWillUnmount() {

    this.notificationListener();
    this.notificationOpenedListener();

  }

  // get The Token for firebase messaging if token is not save in the AsyncStorage and save it to asyncStorage to send it to server

  getToken = async () => {

    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.warn('token  :: ',fcmToken);
    this.setState({fctoken:fcmToken});
    if (!fcmToken) {
      let firebaseToken = await firebase.messaging().getToken();
      if (firebaseToken) {
        this.setState({fctoken:firebaseToken});
        await AsyncStorage.setItem('fcmToken', firebaseToken);
        console.warn('token :',firebaseToken)
      }
    }
  }

  // check permission of firebase messaging if premission is enabled then get the Token otherwise call requestPermission Method

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  // Request Permission for firebase messaging and get Token if permission is granted

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();

    } catch (error) {

      Alert.alert("Unable to access the Notification permission. Please enable the Notification Permission from the settings");

    }
  }

  // Navigate to the Screen when Push Notification Clicked/tapped or Pressed

  showAlert = async (title, body) => {

    const userDetails = await AsyncStorage.getItem(Constant.api_token);

    if (userDetails !== null) {
      await AsyncStorage.setItem('NotificationData', body);

      this.props.navigation.navigate('Notification')
    }
    else {
      this.props.navigation.navigate('Login')

    }

  }

  createNotificationListeners = async () => {

    firebase.notifications().onNotification(notification => {
      console.warn('onNotification');
      notification.android.setChannelId('insider').setSound('default')
      firebase.notifications().displayNotification(notification)

    });
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.warn('onNotification opened')
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.warn('onNotification init')
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.warn('onNotification message')
      //   //process data message
      this.showAlert(title, body);

    });


  };



  // Display Splash Image

  render() {

    return (

      <ImageBackground source={require('../assets/images/Loading_10a.gif')}
        style={{ width: widthPercentageToDP('100%'), height: heightPercentageToDP('100%') }}
      >
   
 {/* <TextInput value={this.state.fctoken}/> */}
       </ImageBackground>
     
    );
  }
}

// Style of Splash Image container
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryColor,
    height: '100%',
    width: '100%',
  },

  icon: {
    width: 200,
    height: 200,
    marginTop: 100,
    tintColor: Colors.white_color
  },

  app_name: {
    color: Colors.white_color,
    fontSize: 35,
    marginTop: 30
  },
  text_style: {
    color: Colors.white_color,
    fontSize: 20,

  }
})