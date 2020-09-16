import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { ScrollView, TouchableOpacity, View, Image, Text, Share, ImageBackground, Dimensions, SafeAreaView, Platform, Keyboard } from 'react-native';
import Colors from '../constants/Colors';
import NetworkUtils from '../components/NetworkUtils';

import AsyncStorage from '@react-native-community/async-storage';
import Constant from '../constants/Constant';
import { buttonStyle, font_style, textHeader } from '../components/styles';
import LinearGradient from 'react-native-linear-gradient';
import { Overlay } from 'react-native-elements';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { apiBasePath } from '../constantApi';

export default class DrawerContent extends React.PureComponent {
  state = {
    isvisible: false,
    channels: [
      { screen: Constant.dashboard, title: Constant.dashboard, select_img: require('../assets/images/home.png'), image_name: require('../assets/images/home.png') },
      { screen: Constant.contacts, title: Constant.contacts, select_img: require('../assets/images/phone.png'), image_name: require('../assets/images/phone.png') },
      { screen: Constant.follow_up, title: Constant.follow_up, select_img: require('../assets/images/phone_call.png'), image_name: require('../assets/images/phone_call.png') },
      { screen: Constant.appointments, title: Constant.appointments, select_img: require('../assets/images/calender1.png'), image_name: require('../assets/images/calender1.png') },
      { screen: Constant.logout, title: Constant.logout, select_img: require('../assets/images/logout.png'), image_name: require('../assets/images/logout.png') },

    ],
    selectedRoute: Constant.dashboard,
    userInfo: {},
    options: [
      { screen: Constant.view_all_follow, title: Constant.view_all_follow },
      { screen: Constant.prospects_follow, title: Constant.prospects_follow },
      { screen: Constant.client_follow, title: Constant.client_follow },
      { screen: Constant.lead_follow, title: Constant.lead_follow },
      { screen: Constant.notification, title: Constant.notification },

    ],
    selectedSecondRoute: '',
  };


  // Call method for user Info when page is loading

  componentDidMount() {


  }

  // Get The User Info

  getUserDetail = () => {

    AsyncStorage.getItem('User_Detail')
      .then(req => JSON.parse(req))
      .then(json => {
        // console.log(json)
        this.setState({
          userInfo: json,
        }, () => { })
      })
      .catch(error => console.log('error : ' + error));

  }

  // toggle Visibility of the Update app notification Prompt

  setOverlayVisible(visible) {
    this.setState({ isvisible: visible });
  }

  // Signout from the Mobile app and remove the token from the async storage

  _signOutAsync = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'logout');

      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          else if (response.status == 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }
          else {
          }

        })
        .then(responseJson => {
          str = responseJson;

          if (str.status === true) {

            AsyncStorage.removeItem(Constant.api_token).then(
              this.props.navigation.navigate('Login'));
          }
          else {

            if (str.error == 101) {

              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp');


            }
          }
        })

    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }

  };

  // navigate to screen according to respective Left hand side Button click

  navigateToScreen = route => () => {

    this.setState({ selectedRoute: route })

    switch (route) {

      case Constant.dashboard:

        this.props.navigation.navigate('Dashboard');
        this.props.navigation.closeDrawer()
        break;

      case Constant.contacts:

        this.props.navigation.navigate('Contact', { selectedtab: 1, selectedButton: 'all_followups', Category: 'all', Screen: 'Menu', followup_Category: '' });
        this.props.navigation.closeDrawer()
        break;


      case Constant.follow_up:

        this.props.navigation.navigate('Contact', { selectedtab: 0, Screen: 'Menu', selectedButton: 'all_followups', Category: 'all', followup_Category: 'prospect,client,lead' });
        this.props.navigation.closeDrawer()
        break;

      case Constant.appointments:

        this.props.navigation.closeDrawer()
        this.props.navigation.navigate('Calendar');
        break;

      case Constant.logout:
        this._signOutAsync();
        this.props.navigation.closeDrawer()
        break;

    }

  };

  // Navigate the Screen When Click to respective Right Hand side Button

  navigateToSecondScreen = route => () => {

    this.setState({ selectedSecondRoute: route })

    this.props.navigation.closeDrawer()

    switch (route) {

      case Constant.view_all_follow:

        this.props.navigation.navigate('Contact', { selectedtab: 0, Screen: 'Menu', selectedButton: 'all_followups', Category: 'all', followup_Category: 'prospect,client,lead' });
        break;

      case Constant.prospects_follow:

        this.props.navigation.navigate('Contact', { selectedtab: 0, Screen: 'Menu', selectedButton: 'prospect', Category: 'prospect', followup_Category: 'prospect' });
        break;

      case Constant.client_follow:

        this.props.navigation.navigate('Contact', { selectedtab: 0, Screen: 'Menu', selectedButton: 'client', Category: 'client', followup_Category: 'client' });
        break;

      case Constant.lead_follow:

        this.props.navigation.navigate('Contact', { selectedtab: 0, Screen: 'Menu', selectedButton: 'lead', Category: 'lead', followup_Category: 'lead' });

        break;

      case Constant.notification:

        this.props.navigation.navigate('Notification');
        break;

      case Constant.logout:

        this._signOutAsync()
        break;

    }

  };


  renderChannelButtons() {

    return this.state.channels.map(({ screen, title, select_img, image_name }) => (

      <TouchableOpacity
        key={screen + title}
        onPress={this.navigateToScreen(screen)}
        activeOpacity={1}
        style={{ marginTop: 10, justifyContent: 'center', alignSelf: 'center' }}
      >

        {
          screen === this.state.selectedRoute ?
            (

              <LinearGradient
                colors={[Colors.pink_end, Colors.pink_start]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.selected_item_view}>

                <View style={{ flexDirection: 'row' }} transparent>

                  <Image source={select_img} style={{ width: 20, height: 20, tintColor: '#fff' }} />
                  <Text style={[{ color: '#fff', marginStart: 8, fontFamily: 'Helvetica Neue', fontSize: 20, fontWeight: '400', },]}>{title}</Text>

                </View>

              </LinearGradient>
            )
            :
            (
              <View style={{ flexDirection: 'row', height: 46, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>

                <Image source={image_name} style={{ width: 20, height: 20, tintColor: '#fff' }} />
                <Text style={[{ color: '#fff', marginStart: 8, fontFamily: 'Helvetica Neue', fontSize: 18, fontWeight: '400', }]}>{title}</Text>

              </View>

            )
        }

      </TouchableOpacity>
    ));
  }

  renderSecondChannelButtons() {

    return this.state.options.map(({ screen, title, index }) => (

      <TouchableOpacity
        key={screen + title}
        onPress={this.navigateToSecondScreen(screen)}
        activeOpacity={1}
        style={[{ marginTop: 30, height: 46, justifyContent: 'center' }, screen === this.state.selectedSecondRoute ? { backgroundColor: Colors.selected_color } : {}]}>

        <Text style={[{ color: '#fff', marginStart: 10, marginEnd: 16, fontFamily: 'Helvetica Neue', fontSize: 18, fontWeight: '400', }]}>{title}</Text>

      </TouchableOpacity>
    ));
  }


  render() {

    return (

      <View>

        <ImageBackground style={{ width: '100%', height: '100%', }}
          resizeMode='cover' source={require('../assets/images/Drawer_BG.png')}>

          <View style={{ flexDirection: 'row' }}>

            <View style={[styles.main_view]}>

              <ScrollView showsVerticalScrollIndicator={false} >

                <View style={{ paddingBottom: 10, alignItems: 'center' }}>

                  <View style={{ flexDirection: 'row' }}>

                    <Image source={require('../assets/images/admin.jpg')} style={styles.profile_image} resizeMode="contain" />

                    <View style={{ position: 'absolute', }}>

                      <LinearGradient
                        colors={[Colors.pink_end, Colors.pink_start]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.cross_icon_view}>

                        <Image source={require('../assets/images/tick.png')}
                          style={styles.tick_img} resizeMode='contain' />

                      </LinearGradient>

                    </View>

                  </View>

                  {

                    (this.state.userInfo) ?

                      <View>

                        <Text style={[{ color: '#fff', fontSize: 22, textAlign: 'center' }, font_style.font_medium]}>{(this.state.userInfo.name === undefined || this.state.userInfo.name === null || this.state.userInfo.title === null || this.state.userInfo.title === undefined) ? '' : this.state.userInfo.title + ' ' + this.state.userInfo.name}</Text>
                        <Text note style={[{ color: '#fff', textAlign: 'center', marginBottom: 20, marginTop: 5, fontFamily: 'Helvetica Neue', fontSize: 18, fontWeight: '400', }, font_style.font_light]}>{(this.state.userInfo.role === undefined || this.state.userInfo.role === null) ? '' : this.state.userInfo.role}</Text>

                      </View>

                      :

                      null
                  }

                  {this.renderChannelButtons()}

                </View>

              </ScrollView>

            </View>

            <View style={[styles.main_view1]}>

              {this.renderSecondChannelButtons()}

              <NavigationEvents
                onDidFocus={payload => this.getUserDetail.bind(this)}
                onWillFocus={this.getUserDetail.bind(this)}

              />

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

      </View>

    );
  }
}

// Styling Code For UI Element of this page

const styles = {

  containerStyle: {

    flex: 1

  },

  font_applied: {

    fontFamily: 'Helvetica-Light',
    fontWeight: 'bold',

  },

  profile_image: {

    width: 100, height: 100,
    borderWidth: 1,
    borderColor: Colors.border_color,
    borderRadius: 100 / 2

  },

  main_view1: {

    paddingBottom: 80,
    paddingStart: 60,
    width: '50%',
    alignItems: 'flex-start',
    justifyContent: 'center',

  },

  main_view: {

    width: '50%',
    paddingTop: 70,
    paddingStart: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },

  selected_item_view: {

    width: widthPercentageToDP('45%'),
    borderRadius: 280 / 2,
    height: 46,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'

  },

  cross_icon_view: {

    width: 32,
    height: 32,
    backgroundColor: Colors.pink_start,
    borderRadius: 32 / 2,
    marginTop: 60,
    marginLeft: 60,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: 'center',

  },

  tick_img: {

    width: 16,
    height: 16,
    tintColor: '#fff',
    alignSelf: 'center'

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

};


