// import React from 'react';
// import {
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   ImageBackground,
//   TouchableOpacity,
//   TouchableHighlight,
//   TextInput,
//   Alert
// } from 'react-native';
// import { Overlay } from 'react-native-elements';
// import AsyncStorage from '@react-native-community/async-storage';
// import Constant from '../constants/Constant';
// import Colors from '../constants/Colors';
// import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
// import { BadgeContext } from '../components/IconHome';
// import { Button } from 'react-native-elements'
// import NetworkUtils from '../components/NetworkUtils';
// import { textInput, buttonStyle, font_style } from '../components/styles';
// import { apiBasePath } from '../constantApi';
// import DeviceInfo from 'react-native-device-info';
// import FlashMessage, { showMessage } from "react-native-flash-message";



// export default class SignUpScreen extends React.Component {

//   static navigationOptions = {
//     headerShown: false,
//   };


//   constructor() {
//     super();
//     this.state = {

//       isVisible: true,
//       email: 'kinjal',//'avani',kinjal
//       password: 'kinjal_123',//'avani223',kinjal_123
//       orgId: 'tapl',
//       method: 'login',
//       loading: false,
//       InvalidUser: false,
//       InvalidPassword: false,
//       InvalidorgId: false,
//       isLoading: false,
//       api_token: '',
//       LoginUserDetail: '',
//       error: '',
//       //Update Notification overlay isvisible
//       isvisible: false,
//     }
//   }

//   // Static Variable for Update Badge

//   static contextType = BadgeContext;

//   // Method For Call Login Method Api for user Authentication In which username, password, and org_id is send firebase token to  the server

//   onSubmitSignup = async () => {

//     const isConnected = await NetworkUtils.isNetworkAvailable()

//     if (isConnected) {

//       const firebase_token = await AsyncStorage.getItem('fcmToken');

//       var formData = new FormData();

//       this.setState({ loading: true })

//       formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
//       formData.append('method', 'login');
//       formData.append('username', this.state.email);
//       formData.append('password', this.state.password);
//       formData.append('org_id', this.state.orgId);
// console.warn('formData: ' , formData);

//       if (!(this.state.email === '') && !(this.state.password === '') && !(this.state.orgId === '')) {
//         fetch(apiBasePath, {
//           method: 'POST',
//           body: formData
//         })
//           .then((response) => {
//             if (response.status == 200) {

//               return response.json();
//             }
//             else {

//               this.setState({ InvalidUser: true, InvalidPassword: true, InvalidorgId: true })
//             }
//           })
//           .then((data) => {
// console.warn('stust data  :', data)
//             let str = data;

//             if (str.status === true) {

//               this.setState({ api_token: str.api_token, isLoading: false, InvalidPassword: false, }, () => { this.register_Firebase_Token() });
//             }
//             else {
//               this.setState({ InvalidUser: false, InvalidPassword: false, InvalidorgId: false },
//                 () => {
//                   if (str.status === false) {

//                   }
//                 }
//               )
//             }

//           })
//           .catch(error => {
// console.warn('errr : ' , error)
//             this.setState({ isLoading: false }, () => { });
//           }
//           );
//       }
//       else {

//         showMessage({
//           message: "",
//           description: "All Fields Must Be Filled",
//           type: "danger",
//         });
//       }
//     }
//     else {

//       alert('Check Your Internet Connection and Try Again')


//     }

//   }

//   register_Firebase_Token = async () => {
// console.warn('register_firebase_token ')
//     const isConnected = await NetworkUtils.isNetworkAvailable()

//     if (isConnected) {

//       const firebase_token = await AsyncStorage.getItem('fcmToken');
//       console.log(firebase_token)
//       let uniqueId = DeviceInfo.getUniqueId();
//       // console.log(uniqueId)
//       // alert(uniqueId)
//       //  alert(firebase_token + '   ---' + uniqueId)


//       var formData = new FormData();

//       formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
//       formData.append('method', 'firebase_reg_user_token_id');
      
//       formData.append('api_token', this.state.api_token);
//       formData.append('device_id', uniqueId);
//       formData.append('token_id', firebase_token);
// console.warn('form data : ',formData);
//       fetch(apiBasePath, {
//         method: 'POST',
//         body: formData
//       })
//         .then((response) => {
//           if (response.status == 200) {

//             return response.json();
//           }
//           else {

//           }
//         })
//         .then((data) => {
// console.warn('success : ' , data);
//           str = data;

//           if (str.status === true) {
//             //alert('Firebase Token ' + firebase_token  + ' is Registered')
//             this.setState({ isLoading: false }, () => { this.storeToken() })

//           }

//           else {

//           }

//         })
//         .catch(error => {

//           this.setState({ isLoading: false }, () => { })
//         }
//         )

//     }
//     else {

//       alert('Check Your Internet Connection and Try Again')

//     }

//   }

//   // Store/save the Api Token into async Storage and Navigate to the Home/DashboardPage

//   storeToken = async () => {

//     const isConnected = await NetworkUtils.isNetworkAvailable()

//     if (isConnected) {

//       let formData = new FormData();

//       formData.append('api_token', this.state.api_token);
//       formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
//       formData.append('method', 'init');

//       fetch(apiBasePath, {
//         method: 'POST',
//         body: formData
//       })

//         .then(response => {
//           if (response.status == 200) {
//             return response.json();
//           }
//           else {
//           }

//         })
//         .then(responseJson => {
//           str = responseJson;
//           console.warn('userdetails : ' , responseJson)
//           if (str.error === 101) {
//             AsyncStorage.removeItem('User_Detail');
//             AsyncStorage.removeItem(Constant.api_token);
//             this.setState({

//             }, () => { this.props.navigation.navigate('SignUp') })

//           }
//           else {
//             // console.log(JSON.stringify(str))
//             this.setState({ isLoading: false, LoginUserDetail: str.user_details }, () => {
//               this.storeUserDetail(str.general_settings)

//             },
//             );
//           }

//         })
//         .catch(error => {

//           this.setState({ isLoading: false }, () => { });
//         }
//         )
//     }
//     else {

//       alert('Check Your Internet Connection and Try Again')

//     }
//   }

//   storeUserDetail = async (dtFormat) => {
// console.warn('dtFormat : ' , dtFormat)
//     try {
//       await AsyncStorage.setItem('User_Detail', JSON.stringify(this.state.LoginUserDetail)).then(
//         await AsyncStorage.setItem(Constant.api_token, this.state.api_token).then(
//           await AsyncStorage.setItem('General_Settings', JSON.stringify(dtFormat)).then(
         
         
//           showMessage({
//             message: "",
//             description: "Successfully Sign In",
//             type: "success",
//           }),
//           this.setState({ loading: false }, () => { this.props.navigation.navigate('Main') })
//       )))

//     }
//     catch (e) {


//     }
//   }

//   setOverlayVisible(visible) {
//     this.setState({ isvisible: visible });
//   }

//   render() {
//     return (

//       <ImageBackground style={styles.bg_container} source={require('../assets/images/bg.png')}>

//         <View style={styles.container}>

//           <View style={styles.card_layout}>

//             <Text style={[styles.sign_text, font_style.font_medium]}>Sign in</Text>

//             <Text style={[styles.text_style1]}>Username:</Text>

//             <TextInput
//               style={[textInput.gray_textInput, { marginTop: 10 }]}
//               onChangeText={(email) => this.setState({ email })}
//               value={this.state.email}
//               placeholder="Enter email"
//               placeholderTextColor={Colors.txt_gray}
//               autoCapitalize='none'
//             />

//             <Text style={[styles.text_style1]}>Password:</Text>

//             <TextInput
//               style={[textInput.gray_textInput, { marginTop: 10 }]}
//               onChangeText={(password) => this.setState({ password })}
//               value={this.state.password}
//               placeholder="Enter password"
//               placeholderTextColor={Colors.txt_gray}
//               autoCapitalize='none'
//               secureTextEntry={true}
//               password={true}
//             />

//             <Text style={[styles.text_style1]}>Org ID:</Text>

//             <TextInput
//               style={[textInput.gray_textInput, { marginTop: 10, marginBottom: 20 }]}
//               onChangeText={(orgId) => this.setState({ orgId })}
//               value={this.state.orgId}
//               placeholder="Enter Organization ID"
//               placeholderTextColor={Colors.txt_gray}
//               autoCapitalize='none'
//             />

//             <Button backgroundColor='gray'
//               buttonStyle={buttonStyle.auth_btn}
//               onPress={() => { this.onSubmitSignup() }}
//               loading={this.state.loading}
//               title='Sign In'
//             />



//             <Text style={[styles.text_style, { marginTop: 30 }]}>Forgot your password?</Text>

//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

//               <Text style={styles.text_style}>Don't have an account yet? </Text>
//               <Text style={[styles.text_style, { color: Colors.primaryColor }]}>Sign Up</Text>

//             </View>

//           </View>

//           {/* Overlay for Update App Notification Prompt */}

//           <Overlay
//             isVisible={this.state.isvisible}
//             windowBackgroundColor="rgba(0, 0, 0, 0.5)"
//             overlayBackgroundColor="white"
//             width="80%"
//             height="35%"
//           >

//             <View style={{ marginTop: 30 }}>

//               <Text style={styles.pleaseUpdate}>Please update Your app to Continue</Text>
//               <Text style={styles.thisApp}>This app version 10.0.3.1 is no longer Supported.</Text>

//               <TouchableOpacity>

//                 <View style={[styles.Update_now]}>

//                   <Image source={require('../assets/images/Update_Now_bg.png')} style={styles.UpdateImage_Style} resizeMode="cover"></Image>

//                   <Text style={[styles.updateNowtext]}>Update Now</Text>

//                 </View>

//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => { this.setOverlayVisible(false); }}>

//                 <Text style={[styles.cancel_txt, font_style.font_medium,]}>Cancel</Text>

//               </TouchableOpacity>

//             </View>

//           </Overlay>

//         </View>

//       </ImageBackground>

//     );
//   }
// }

// // Styling Code for Ui Elements

// const styles = StyleSheet.create({

//   bg_container: {

//     backgroundColor: Colors.primaryColor,
//     height: heightPercentageToDP('100%'),
//     width: widthPercentageToDP('100%'),

//   },

//   container: {

//     height: heightPercentageToDP('100%'),
//     width: widthPercentageToDP('100%'),
//     alignItems: 'center', padding: 16,
//     justifyContent: 'center',
//     flex: 1,

//   },

//   sign_text: {

//     fontSize: 30,
//     color: Colors.black_color

//   },

//   app_name: {

//     color: Colors.white_color,
//     fontSize: 40,
//     marginTop: 30

//   },

//   text_style: {

//     color: Colors.black_color,
//     textAlign: 'center',
//     fontFamily: 'Helvetica-Light',
//     fontSize: 18,

//   },

//   text_style1: {

//     color: Colors.light_gray,
//     fontFamily: 'Helvetica-Light',
//     fontSize: 18,
//     marginTop: 20

//   },

//   card_layout: {

//     backgroundColor: 'white',
//     width: widthPercentageToDP('95%'),
//     borderRadius: 8,
//     padding: 24,
//     shadowOffset: { width: 1, height: 1, },
//     shadowColor: 'black',
//     shadowOpacity: .2,
//     shadowRadius: 16,
//     elevation: 3,

//   },

//   pleaseUpdate: {

//     marginLeft: 20,
//     marginEnd: 20,
//     justifyContent: 'flex-start',
//     textAlign: 'center',
//     color: '#222222',
//     fontFamily: 'Helvetica Neue',
//     fontSize: 22,
//     fontWeight: '500',

//   },

//   thisApp: {

//     marginLeft: 20,
//     marginTop: 20,
//     marginEnd: 20,
//     justifyContent: 'center',
//     textAlign: 'center',
//     color: '#5d5d5d',
//     fontFamily: 'Helvetica Neue',
//     fontSize: 18,
//     fontWeight: '400',

//   },
//   Update_now: {

//     width: 150,
//     height: 56,
//     alignSelf: 'center',
//     marginTop: 20,
//     borderRadius: 56 / 2,
//     backgroundColor: '#f0ab16',

//   },

//   UpdateImage_Style: {

//     flex: 1,
//     position: 'absolute',
//     width: 150,
//     height: 56,
//     borderRadius: 56,
//     backgroundColor: '#f0ab16',

//   },

//   updateNowtext: {

//     flex: 1,
//     marginTop: 18,
//     textAlign: 'center',
//     alignContent: 'center',
//     justifyContent: 'center',
//     color: '#ffffff',
//     fontFamily: 'Helvetica Neue',
//     fontSize: 16,
//     fontWeight: '500',
//     zIndex: 9999,

//   },

//   cancel_txt: {

//     marginTop: 20,
//     color: '#f566a5',
//     fontFamily: 'Helvetica Neue',
//     fontSize: 20,
//     fontWeight: '500',
//     textAlign: 'center'

//   },
// })

import React, {Component} from "react";
import {StyleSheet, View, SafeAreaView,TouchableOpacity} from "react-native";
// import {Ionicons} from "@expo/vector-icons";
//  import shortid from "shortid";

import { Container, Header, Content, Icon } from 'native-base';
import {Autocomplete, withKeyboardAwareScrollView} from "react-native-dropdown-autocomplete";


const data = [
  "Apples",
  "Broccoli",
  "Chicken",
  "Duck",
  "Eggs",
  "Fish",
  "Granola",
  "Hash Browns",
];
class HomeScreen extends Component {
  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }

  render() {
    const autocompletes = [...Array(10).keys()];

    const apiUrl = "https://5b927fd14c818e001456e967.mockapi.io/branches";

    const {scrollToInput, onDropdownClose, onDropdownShow} = this.props;

    return (
      <View style={styles.autocompletesContainer}>
        <SafeAreaView>
        <Autocomplete  minimumCharactersCount={1} style={styles.input}  data={data} renderIcon={() => (
              <Icon name="chevron-down" type="FontAwesome5" size={20} color="#c7c6c1" style={styles.plus}/>
              )} valueExtractor={item => item} />
               {/* renderIcon={() => (
                <Ionicons name="ios-add-circle-outline" size={20} color="#c7c6c1" style={styles.plus} />
              )} */}
          {/* {autocompletes.map(() => (
            <Autocomplete
              // key={shortid.generate()}
              style={styles.input}
              scrollToInput={ev => scrollToInput(ev)}
              handleSelectItem={(item, id) => this.handleSelectItem(item, id)}
              onDropdownClose={() => onDropdownClose()}
              onDropdownShow={() => onDropdownShow()}
              renderIcon={() => (
                <Icon ios='ios-menu' android="md-menu" size={20} color="#c7c6c1" style={styles.plus}/>
              )}
              fetchDataUrl={apiUrl}
              minimumCharactersCount={2}
              highlightText
              valueExtractor={item => item.name}
              rightContent
              rightTextExtractor={item => item.properties}
            />
          ))} */}
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 8,
  },
  input: {maxHeight: 40},
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#c7c6c1",
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: "5%",
    width: "100%",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  plus: {
    position: "absolute",
    right: 15,
    top: 10,
  },
});

export default withKeyboardAwareScrollView(HomeScreen);
