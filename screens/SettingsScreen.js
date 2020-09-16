
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView
} from 'react-native';

import { textHeader, font_style, textInput } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant'
import Colors from '../constants/Colors';
import { Dropdown } from 'react-native-material-dropdown'
import { Overlay } from 'react-native-elements';

export default class SettingsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerBackground: <HeaderBackground />,
    headerTitle: <Text style={textHeader.header}>{Constant.account_settings}</Text>,
    headerLeft: <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={[styles.top_layout1]}
        activeOpacity={1}
        onPress={() => {
          navigation.goBack(null)
        }}
      >
        <Image source={require('./../assets/images/arrow-left.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.top_layout1], { paddingTop: 5, flex: 0.6 }}
        activeOpacity={1}
        onPress={() => { navigation.toggleDrawer() }}
      >
        <Image source={require('./../assets/images/menu_3x.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />
      </TouchableOpacity>
    </View>,
    headerRight: <TouchableOpacity
      style={styles.top_layout}
      activeOpacity={1}
      onPress={() => { navigation.navigate('AccountSettingSecond') }}
    >
      <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Save</Text>
    </TouchableOpacity>,
  });

  constructor() {
    super();
    this.state = {
      isvisible: false,
      company: [
        { value: 'company1' },
        { value: 'company2' },
        { value: 'company3' }
      ],
      text: '',
      amount: '',
      extentions: '',
      countries: '',
      requests: '',
      remarks: '',
      servicesData: [
        { name: 'Auto Attendant', value: 'item1', status: false, },
        { name: 'Cloud Panel', value: 'item2', status: false, },
        { name: 'eFax', value: 'item3', status: false, },
        { name: 'Voice Recording', value: 'item4', status: false, },
      ]
    }
  }

  onSelect(index, value) {
    this.setState({
      text: `Selected index: ${index} , value: ${value}`
    })
  }

  setOverlayVisible(visible) {
    this.setState({ isvisible: visible });
  }

  componentDidMount() {

  }

  _SetCheckBox = (servicesData) => {
    let newArray = [...this.state.servicesData];
    this.state.servicesData.forEach((element, index) => {

      if (element.value === servicesData.value) {
        newArray[index].status = true
      } else {
        newArray[index].status = false
      }
    })

    this.setState({ servicesData: newArray })
  }

  showCheckboxs = (servicesData) => {
    return (
      <View style={{ flexDirection: 'row', flex: 1, alignSelf: 'center' }}>
        <TouchableOpacity onPress={() => { this._SetCheckBox(servicesData) }}>
          {servicesData.status ?
            (<Image source={require('./../assets/images/tick_1.png')} style={styles.checkbox_img} resizeMode="contain" />)
            : (<View style={styles.circle_view} resizeMode="contain" />)}

        </TouchableOpacity>

        <Text style={styles.text_style}>{servicesData.name}</Text>
      </View>
    )

  }

  render() {
    return (
      <View style={styles.main_container}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: Colors.white_color, paddingStart: 16, paddingEnd: 16, }}>
            <Text style={[{ textAlign: 'right', marginTop: 16 }, font_style.font_medium]}>Total Deal Amount(Opportunities)</Text>
            <Text style={[{ textAlign: 'right', fontSize: 25, color: Colors.primaryColor }, font_style.font_medium]}>$3,580.00</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.primaryColor }, styles.contact_icon]}>

                <Image source={require('./../assets/images/user.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.pink_start }, styles.contact_icon]}>

                <Image source={require('./../assets/images/usb.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.primaryColor }, styles.contact_icon]}>

                <Image source={require('./../assets/images/monitor.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.primaryColor }, styles.contact_icon]}>

                <Image source={require('./../assets/images/calender1.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.primaryColor }, styles.contact_icon]}>

                <Image source={require('./../assets/images/pen.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.primaryColor }, styles.contact_icon]}>

                <Image source={require('./../assets/images/wallet.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[{ backgroundColor: Colors.primaryColor }, styles.contact_icon]}>

                <Image source={require('./../assets/images/phone_call.png')}
                  style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

              </TouchableOpacity>

            </View>

          </View>
          <View style={{ marginTop: 10, backgroundColor: Colors.white_color, paddingStart: 16, paddingEnd: 16 }}>
            <Text style={[{ fontSize: 20, color: Colors.black_color, marginTop: 8 }, font_style.font_medium]}>Opportunity</Text>
            <Text style={[{ marginTop: 8 }, font_style.font_light]}>Select Opportunity:</Text>

            <View
              activeOpacity={1}
              style={[{}, styles.dropdown_view,]}>
              <View style={styles.img_view}>
                <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.white_color }]} resizeMode="contain" />
              </View>

              <Dropdown
                containerStyle={styles.dropdown_container}
                pickerStyle={{ width: '100%', paddingStart: 20, }}
                inputContainerStyle={{
                  borderBottomColor: 'transparent',
                  justifyContent: 'center',
                }}
                textColor={Colors.white_color}
                baseColor={Colors.primaryColor}
                dropdownOffset={{ top: 0, bottom: -10 }}
                dropdownMargins={{ min: 0, max: 0 }}
                data={this.state.company}
                value={this.state.company[0].value}
                onChangeText={(value) => { this.setState({ select_company: value }) }}
              />

            </View>
          </View>

          <View style={{ marginTop: 10, backgroundColor: Colors.white_color, paddingTop: 16, paddingBottom: 20 }}>

            <ScrollView style={{ flexDirection: 'row', paddingStart: 16, paddingEnd: 16 }} horizontal showsHorizontalScrollIndicator={false} >

              <TouchableOpacity style={[styles.btn_view, { backgroundColor: Colors.green_start }]}>
                <Text style={styles.txt_view}>{Constant.intro}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view, { marginStart: 8 }]}>
                <Text style={styles.txt_view}>{Constant.fact_find}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view, { marginStart: 8 }]}>
                <Text style={styles.txt_view}>{Constant.signup_info}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view, { marginStart: 8 }]}>
                <Text style={styles.txt_view}>{Constant.proposal}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view, { backgroundColor: Colors.green_start, marginStart: 8 }]}>
                <Text style={styles.txt_view}>{Constant.all}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view, { marginStart: 8 }]}>
                <Text style={styles.txt_view}>{Constant.prospects}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view, { marginStart: 8 }]}>
                <Text style={styles.txt_view}>{Constant.clients}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn_view]}>
                <Text style={styles.txt_view}>{Constant.leads}</Text>
              </TouchableOpacity>

            </ScrollView>

            <View style={{ paddingStart: 16, paddingEnd: 16 }}>

              <Text style={[styles.text_style1]}>Deal Amount:</Text>

              <TextInput
                style={[textInput.gray_textInput, { marginTop: 4, height: 42, fontSize: 14 }]}
                onChangeText={(amount) => this.setState({ amount })}
                value={this.state.amount}
                placeholder="Enter amount"
                placeholderTextColor={Colors.black_color}
                keyboardType='numeric'
              />

              <Text style={[styles.text_style1]}>Number of Extentions:</Text>
              <TextInput
                style={[textInput.gray_textInput, { marginTop: 4, height: 42, fontSize: 14 }]}
                onChangeText={(extentions) => this.setState({ extentions })}
                value={this.state.extentions}
                placeholder="Enter number of extentions"
                placeholderTextColor={Colors.black_color}
                keyboardType='numeric'
              />

              <Text style={[styles.text_style1]}>Call to Overseas Countries:</Text>
              <TextInput
                style={[textInput.gray_textInput, { marginTop: 4, height: 42, fontSize: 14 }]}
                onChangeText={(countries) => this.setState({ countries })}
                value={this.state.countries}
                placeholder="Enter country"
                placeholderTextColor={Colors.black_color}

              />
              <Text style={[styles.text_style1]}>Add on Services:</Text>

              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                {this.showCheckboxs(this.state.servicesData[0])}
                {this.showCheckboxs(this.state.servicesData[1])}
              </View>

              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {this.showCheckboxs(this.state.servicesData[2])}
                {this.showCheckboxs(this.state.servicesData[3])}
              </View>

              <Text style={[styles.text_style1]}>Special Customisation Request:</Text>
              <TextInput
                style={[textInput.gray_textInput, { marginTop: 4, height: 42, fontSize: 14 }]}
                onChangeText={(requests) => this.setState({ requests })}
                value={this.state.requests}
                placeholder="Enter tags"
                placeholderTextColor={Colors.black_color}

              />

              <Text style={[styles.text_style1]}>Remarks:</Text>
              <TextInput
                style={[textInput.gray_textInput, { marginTop: 4, height: 42, fontSize: 14 }]}
                onChangeText={(remarks) => this.setState({ remarks })}
                value={this.state.remarks}
                placeholder="Enter remarks"
                placeholderTextColor={Colors.black_color}

              />
            </View>

          </View>
        </ScrollView >
        <Overlay
          isVisible={this.state.isvisible}
          windowBackgroundColor="rgba(0, 0, 0, 0.5)"
          overlayBackgroundColor="white"
          width="80%"
          height="45%"
        >


          <View style={{ marginTop: 30 }}>
            <Text style={styles.pleaseUpdate}>Please update your app to Continue</Text>
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
        <SafeAreaView />
      </View>

    );
  }

}

const styles = StyleSheet.create({

  top_layout: {
    paddingRight: 20,
    paddingLeft: 20
  },
  main_container: {
    flex: 1,
    backgroundColor: Colors.white_color,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white_color,
  },
  btn_view: {
    backgroundColor: Colors.primaryColor,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16
  },
  txt_view: {
    color: Colors.white_color,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium'
  },
  contact_icon: {
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4
  },

  margin_style: {
    marginStart: 16,
    marginEnd: 16
  },
  img_view: {
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingEnd: 16
  },
  top_image_style: {
    width: 16, height: 16,
    tintColor: Colors.black_color,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  dropdown_container: {
    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 16,
    paddingEnd: 16,
  },
  dropdown_view: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: 42 / 2, paddingEnd: 16,
    marginTop: 8,
    marginBottom: 16
  },
  text_style1: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Helvetica-Light'
  },
  text_style: {
    fontSize: 14,
    fontFamily: 'Helvetica-Light'
  },
  circle_view: {
    width: 20, height: 20,
    marginEnd: 4,
    borderColor: Colors.primaryColor,
    borderRadius: 20 / 2,
    borderWidth: 1
  },
  checkbox_img: {
    width: 20, height: 20, marginEnd: 4,
    tintColor: Colors.primaryColor,
    shadowOffset: { width: 2, height: 2, },
    shadowColor: Colors.primaryColor,
    shadowOpacity: .2,
    shadowRadius: 20 / 2,
    elevation: 3,
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
