import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import { buttonStyle, font_style } from '../components/styles';

const imageBg = require('../assets/images/bg.png')

export default class LoginScreen extends React.Component {

  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super();
    this.state = {

      isVisible: true,
      //Update Notification overlay isvisible
      isvisible: false,

    }
  }

  // Set Visibility of Update Notification overlay

  setOverlayVisible(visible) {
    this.setState({ isvisible: visible });
  }

  render() {
    return (

      <ImageBackground style={styles.bg_container} source={imageBg}>

        <View style={{ flex: 1, alignItems: 'center' }}>

          <Image source={require('../assets/images/logo.png')} style={styles.icon} resizeMode="contain" />
          <Text style={[styles.app_name, font_style.font_medium]}>{`${Constant.appname}`.toUpperCase()}</Text>

          <View style={styles.bottom_view}>

            <TouchableHighlight
              underlayColor='gray'
              activeOpacity={1}
              style={[buttonStyle.auth_btn, { marginBottom: 40, width: wp('80%') }]}
              onPress={() => { this.props.navigation.navigate('SignUp') }}
            >

              <Text style={buttonStyle.loginText} >Sign In</Text>

            </TouchableHighlight>

            <View style={{ flexDirection: 'row', }}>

              <Text style={styles.text_style}>Don't have an account yet? </Text>
              <Text style={styles.text_style}>Sign Up</Text>

            </View>

          </View>

          {/* Overlay for Update App Notification Prompt */}

          <Overlay
            isVisible={this.state.isvisible}
            windowBackgroundColor="rgba(0, 0, 0, 0.5)"
            overlayBackgroundColor="white"
            width="80%"
            height="35%"
          >

            <View style={{ marginTop: 30 }}>

              <Text style={styles.pleaseUpdate}>Please update Your app to Continue</Text>
              <Text style={styles.thisApp}>This app version 10.0.3.1 is no longer Supported.</Text>

              <TouchableOpacity>

                <View style={[styles.Update_now]}>

                  <Image source={require('../assets/images/Update_Now_bg.png')} style={styles.UpdateImage_Style} resizeMode="cover"></Image>

                  <Text style={[styles.updateNowtext]}>Update Now</Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => { this.setOverlayVisible(false); }}>

                <Text style={[styles.cancel_txt, font_style.font_medium,]}>Cancel</Text>

              </TouchableOpacity>

            </View>

          </Overlay>

        </View>

      </ImageBackground>
    );
  }
}

// Styling for UI elements

const styles = StyleSheet.create({
  bg_container: {
    height: '100%',
    width: '100%',
  },

  icon: {
    width: 180,
    height: 180,
    marginTop: 160,
    tintColor: Colors.white_color
  },

  app_name: {
    color: Colors.white_color,
    fontSize: 40,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  text_style: {
    color: Colors.white_color,
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 18,
  },
  bottom_view: {
    justifyContent: 'flex-end',
    alignItems: 'center', flex: 1,
    width: '100%',
    marginBottom: 80,
    marginStart: 24, marginEnd: 24
  },
  pleaseUpdate: {
    marginLeft: 20,
    marginEnd: 20,
    justifyContent: 'flex-start',
    textAlign: 'center',
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 22,
    fontWeight: '500',
  },
  thisApp: {
    marginLeft: 20,
    marginTop: 20,
    marginEnd: 20,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#5d5d5d',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  Update_now: {
    width: 150,
    height: 56,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 56 / 2,
    backgroundColor: '#f0ab16',
  },
  UpdateImage_Style: {
    flex: 1,
    position: 'absolute',
    width: 150,
    height: 56,
    borderRadius: 56,
    backgroundColor: '#f0ab16',
  },

  updateNowtext: {
    flex: 1,
    marginTop: 18,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,
  },

  cancel_txt: {
    marginTop: 20,
    color: '#f566a5',
    fontFamily: 'Helvetica Neue',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },

})