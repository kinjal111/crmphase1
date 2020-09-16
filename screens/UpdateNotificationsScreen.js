import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';
import { Overlay } from 'react-native-elements';
import Colors from '../constants/Colors';
import { font_style, } from '../components/styles';

// Screen for Update App Notification Prompt 

export default class UpdateNotificationScreen extends React.Component {

  // for Not Displaying header

  static navigationOptions = {
    header: null
  };

  // for initilize the state and state variable

  constructor() {
    super();
    this.state = {
      isvisible: false,
    }
  }

  // for Toggle Display Of Update App Notification Prompt Overlay

  setOverlayVisible(visible) {
    this.setState({ isvisible: visible });
  }

  render() {
    return (
      <View style={styles.container} >

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

    );
  }

}

// Style for Ui elements 

const styles = StyleSheet.create({

  container: {

    backgroundColor: Colors.primaryColor,
    flex: 1,

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
    textAlign: 'center',
    marginBottom: 30,
  },

});