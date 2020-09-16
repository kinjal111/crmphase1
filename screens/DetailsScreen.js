import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { textHeader, font_style, textInput } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant'
import Colors from '../constants/Colors';
import HTML from 'react-native-render-html';
import { colors, Overlay } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import NetworkUtils from '../components/NetworkUtils';
import { NavigationEvents } from 'react-navigation';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { apiBasePath } from '../constantApi';

let location;

export default class DetailsScreen extends React.Component {

  // Display Header And functionality of header Elements

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.details}</Text>,

    headerLeft: () => <View style={{ flexDirection: 'row' }}>

      <TouchableOpacity style={[styles.top_layout1]} activeOpacity={1} onPress={() => { 
        //navigation.goBack(null)
        console.warn('appt dat ***************************::  ' , navigation.getParam('Apptdate'))
        navigation.navigate('Calendar' ,{Apptdate:navigation.getParam('Apptdate')});
        
        }}>

        <Image source={require('./../assets/images/arrow-left.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

      </TouchableOpacity> 

      <TouchableOpacity style={[styles.top_layout1], { paddingTop: 5, flex: 0.6 }} activeOpacity={1} onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }} >

        <Image source={require('./../assets/images/menu_3x.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

      </TouchableOpacity>

    </View>,

    headerRight: () =>

      <TouchableOpacity style={styles.top_layout} activeOpacity={1} onPress={() => { navigation.getParam('EditAppointment')(); }}>

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Edit</Text>

      </TouchableOpacity>,

  });

  // Initilize the State Variable 

  constructor() {
    super();
    this.state = {
      isvisible: false,
      company: [
        { value: 'company1' },
        { value: 'company2' },
        { value: 'company3' }
      ],
      DetailData: '',
      contact_Data: '',
      Detail_ID: '',
      text: '',
      Data: '',
      amount: '',
      Note:'',
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

  // Set The Detail Data from AsyncStorage when Page is Loading

//   componentDidMount = async () => {

//     this.props.navigation.setParams({ EditAppointment: this.EditAppointment });

//     var DetailData = this.props.navigation.getParam('Detail')
//     var PreviousScreen = this.props.navigation.getParam('Screen')

//     const isConnected = await NetworkUtils.isNetworkAvailable()

//     if (isConnected) {

//       if (PreviousScreen === 'Notification') {

//         this.setState({ DetailData: DetailData.data }, () => { })

//       }
//       else {

//         this.setState({ DetailData: DetailData }, () => { })

//       }

//       const api_token = await AsyncStorage.getItem(Constant.api_token);
//       let formData = new FormData();

//       // alert(JSON.stringify(this.state.DetailData))

//       // console.log("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + this.state.DetailData.location + " " + this.state.DetailData.postal_code + "&key=AIzaSyCYwaIvxZT1SG35q18JF1sv1h--FzghI6M")

//       // fetch("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + this.state.DetailData.address +"," + this.state.postal_code +"&key=AIzaSyCYwaIvxZT1SG35q18JF1sv1h--FzghI6M")

//       //   .then(response => {
//       //     if (response.status == 200) {

//       //       return response.json();
//       //     }

//       //   })
//       //   .then(responseJson => {
//       //     str = responseJson;
//       //       console.log(JSON.stringify(str))
//       //        alert(JSON.stringify(str))

//       //        this.setState({})

//       //   })
//       //   .catch(error => {

//       //     this.setState({ isLoading: false });
//       //   }
//       //   )

//       // Geocoder.from(this.state.DetailData.address)
//       //   .then(json => {
//       //     location = json.results[0].geometry.location;
//       //      console.log(location);
//       //      alert(JSON.stringify(location))
//       //   })
//       //   .catch(error => console.warn(error));

//       this.setState({ Detail_ID: DetailData.id }, () => {
//       })

//       formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
//       formData.append('api_token', api_token);

//       if (this.state.DetailData.ev_categ === 'appointment') {

//         formData.append('method', 'get_appt_details');
//       }
//       else if (this.state.DetailData.ev_categ === 'followup') {

//         formData.append('method', 'get_followup_details');
//       }
//       else if (this.state.DetailData.ev_categ === 'event') {

//         formData.append('method', 'get_event_details')
//       }
//       else {

//         formData.append('method', 'get_appt_details');

//       }
// console.warn('detail data : ' , this.state.DetailData)
//       formData.append('id', this.state.Detail_ID);

//       console.warn('form data : ' , formData)
//       fetch(apiBasePath, {
//         method: 'POST',
//         body: formData
//       })

//         .then(response => {
//           if (response.status == 200) {

//             return response.json();
//           }
//           else if (response.status == 101) {
//             this.props.navigation.navigate('SignUp');
//           }
//           else {

//           }

//         })
//         .then(responseJson => {
//           console.warn('fresponseJson : ' , responseJson)
//           str = responseJson;
                                      

//           if (str.error === 101) {
//             AsyncStorage.removeItem(Constant.api_token);
//             this.props.navigation.navigate('SignUp')

//           }
//           else {

//             if (this.state.DetailData.ev_categ === 'appointment') {

//               this.setState({ isLoading: false, Data: str.appointment_details, contact_Data: str.contact_details }, () => { });

//             }

//             else if (this.state.DetailData.ev_categ === 'followup') {

//               this.setState({ isLoading: false, Data: str, contact_Data: str.contact_details }, () => { });

//             }

//             else if (this.state.DetailData.ev_categ === 'event') {

//               this.setState({ isLoading: false, Data: str }, () => { });

//             }


//           }
//         })
//         .catch(error => {

//           this.setState({ isLoading: false });
//         }
//         )
//     }
//     else {

//       alert('Check Your Internet Connection and Try Again')

//     }

//   }
  async onLoad(payload) {
    console.warn('payload');
    console.warn('componenat did mount')
    this.props.navigation.setParams({ EditAppointment: this.EditAppointment });

    var DetailData = this.props.navigation.getParam('Detail')
    var PreviousScreen = this.props.navigation.getParam('Screen')

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      if (PreviousScreen === 'Notification') {

        this.setState({ DetailData: DetailData.data }, () => { })

      }
      else {

        this.setState({ DetailData: DetailData }, () => { })

      }

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      // alert(JSON.stringify(this.state.DetailData))

      // console.log("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + this.state.DetailData.location + " " + this.state.DetailData.postal_code + "&key=AIzaSyCYwaIvxZT1SG35q18JF1sv1h--FzghI6M")

      // fetch("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + this.state.DetailData.address +"," + this.state.postal_code +"&key=AIzaSyCYwaIvxZT1SG35q18JF1sv1h--FzghI6M")

      //   .then(response => {
      //     if (response.status == 200) {

      //       return response.json();
      //     }

      //   })
      //   .then(responseJson => {
      //     str = responseJson;
      //       console.log(JSON.stringify(str))
      //        alert(JSON.stringify(str))

      //        this.setState({})

      //   })
      //   .catch(error => {

      //     this.setState({ isLoading: false });
      //   }
      //   )

      // Geocoder.from(this.state.DetailData.address)
      //   .then(json => {
      //     location = json.results[0].geometry.location;
      //      console.log(location);
      //      alert(JSON.stringify(location))
      //   })
      //   .catch(error => console.warn(error));

      this.setState({ Detail_ID: DetailData.id }, () => {
      })

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);

      if (this.state.DetailData.ev_categ === 'appointment') {

        formData.append('method', 'get_appt_details');
      }
      else if (this.state.DetailData.ev_categ === 'followup') {

        formData.append('method', 'get_followup_details');
      }
      else if (this.state.DetailData.ev_categ === 'event') {

        formData.append('method', 'get_event_details')
      }
      else {

        formData.append('method', 'get_appt_details');

      }
      console.warn('detail data : ' , this.state.DetailData)
      formData.append('id', this.state.Detail_ID);

      console.warn('form data : ' , formData)
      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status == 200) {

            return response.json();
          }
          else if (response.status == 101) {
            this.props.navigation.navigate('SignUp');
          }
          else {

          }

        })
        .then(responseJson => {
          console.warn('fresponseJson : ' , responseJson)
          str = responseJson;
                                      

          if (str.error === 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp')

          }
          else {

            if (this.state.DetailData.ev_categ === 'appointment') {

              this.setState({ isLoading: false, Data: str.appointment_details, contact_Data: str.contact_details }, () => { });
              // this.setState({DetailData:str.appointment_details});
              let value=this.state.Data.note;
              value = value.replace(/<br\s*\/?>/gi, ' ');
              console.warn("Value....",value);
              this.setState({Note:value});
              console.warn("Details Data123...",this.state.Data);
            }

            else if (this.state.DetailData.ev_categ === 'followup') {

              this.setState({ isLoading: false, Data: str, contact_Data: str.contact_details }, () => { });
              let value=this.state.Data.note;
              value = value.replace(/<br\s*\/?>/gi, ' ');
              console.warn("Value....",value);
              this.setState({Note:value});
              console.warn("Details Data123...",this.state.Data);

            }

            else if (this.state.DetailData.ev_categ === 'event') {

              this.setState({ isLoading: false, Data: str }, () => { });

            }


          }
        })
        .catch(error => {

          this.setState({ isLoading: false });
        }
        )
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }
  // Navigate to the Appointment Page with DetailData when click on the Edit text in the top right Button

  EditAppointment = async () => {

    if (this.state.DetailData.ev_categ === 'appointment') {

      this.props.navigation.navigate('Appointment', { DetailData: this.state.Data,isEdit: true,contactID: this.state.contact_Data.id, companyID: this.state.contact_Data.company_id,
        contact_company_name:(this.state.DetailData.first_name+' ' + this.state.DetailData.last_name + (this.state.DetailData.company_name?(' (' + this.state.DetailData.company_name + ')'):'')), Screen: 'Detail' })

    }

    else if (this.state.DetailData.ev_categ === 'followup') {

      this.props.navigation.navigate('Followup', { DetailData: this.state.contact_Data, contactID: this.state.contact_Data.contact_id, companyID: this.state.contact_Data.contact_company_id, Screen: 'Detail' })

    }

    else if (this.state.DetailData.ev_categ === 'event') {

      this.props.navigation.navigate('Event', { EventData: this.state.Data, Screen: 'Detail' })

    }


  }

  // Toggle visibility of Update App Notification prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  render() {

    return (

      <ScrollView style={styles.container}>

        <View style={styles.main_container}>
        <NavigationEvents onDidFocus={(payload) => { this.onLoad(payload) }} />
          <View style={[styles.container, { flexDirection: 'row', padding: 16 }]}>

            <View style={{ flex: 0.1 }}>

              <View style={{
                borderRadius: 16 / 2,
                width: 16,
                shadowColor: 'rgba(24, 146, 118, 0.44)',
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 24,
                backgroundColor: Colors.green_start,
                height: 16,
                marginTop: 7,
                marginLeft: 5,
                flexDirection: 'row',
              }} />

            </View>

            {/*  Detail Title,Address and time Portion */}

            <View style={{ flex: 0.9, }}>


              <Text style={styles.bernardMeet}>{(this.state.DetailData.title === null) ? this.state.DetailData.description : this.state.DetailData.title}</Text>

              {

                (this.state.DetailData.ev_categ === 'event') ?

                  <Text style={styles.defuLane}>{((this.state.DetailData.address === null || this.state.DetailData.address === undefined || this.state.DetailData.address === "undefined") && (this.state.DetailData.postal_code === null || this.state.DetailData.postal_code === undefined || this.state.DetailData.postal_code === "undefined")) ? '' : this.state.DetailData.address + ' (' + this.state.DetailData.postal_code + ')'}</Text>

                  :

                  (this.state.DetailData.ev_categ === 'appointment' || this.state.DetailData.ev_categ === 'followup') ?

                    <Text style={styles.defuLane}>{((this.state.Data.location === null || this.state.Data.location === undefined || this.state.Data.location === "undefined") && (this.state.DetailData.postal_code === null || this.state.DetailData.postal_code === undefined || this.state.DetailData.postal_code === "undefined")) ? '' : this.state.DetailData.location + ' (' + this.state.DetailData.postal_code + ')'}</Text>

                    :

                    null

              }

              {(this.state.DetailData.ev_categ === 'appointment') ?

                <View>

                  <Text style={styles.defuLane}>{(this.state.Data.appointment_date === null || this.state.Data.appointment_date === undefined || this.state.Data.appointment_date === "undefined") ? '' : this.state.Data.appointment_date}</Text>
                  <Text style={styles.defuLane}>{(this.state.Data.appointment_time === null || this.state.Data.appointment_time === undefined || this.state.Data.appointment_time === "undefined") ? '' : this.state.Data.appointment_time} - {(this.state.Data.end_time === null || this.state.Data.end_time === undefined || this.state.Data.end_time === "undefined") ? '' : this.state.Data.end_time}</Text>

                </View>
                :

                (this.state.DetailData.ev_categ === 'event') ?

                  <View>

                    <Text style={styles.defuLane}>{(this.state.Data.date === null || this.state.Data.date === undefined || this.state.Data.date === "undefined") ? '' : this.state.Data.date}</Text>
                    <Text style={styles.defuLane}>{(this.state.Data.time === null || this.state.Data.time === undefined || this.state.Data.time === "undefined") ? '' : this.state.Data.time}</Text>

                  </View>

                  :

                  null

              }

              {/* F,A,O and P Button Portion  */}

              {(this.state.DetailData.ev_categ === 'event') ?

                null

                :

                <View style={{ flexDirection: 'row', marginTop: 10 }}>

                  <TouchableOpacity onPress={() => { this.props.navigation.navigate("Followup", { contactID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.id : this.state.contact_Data.contact_id, companyID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.company_id : this.state.contact_Data.contact_company_id }) }}
                    style={[styles.top_view_btn, { backgroundColor: Colors.green_start, flexDirection: 'row' }]}>

                    <Image source={require('../assets/images/F_Image.png')} style={styles.l00011} resizeMode="contain" />
                    <Text style={[styles.f]}>F</Text>

                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    // DetailData: this.state.Data,
                    (this.state.DetailData.ev_categ === 'appointment') ?
                    this.props.navigation.navigate('Appointment', { contactID: this.state.contact_Data.id, companyID: this.state.contact_Data.company_id,
                      contact_company_name:(this.state.DetailData.first_name+' ' + this.state.DetailData.last_name + (this.state.DetailData.company_name ?(' (' + this.state.DetailData.company_name + ')'):'')), Screen: 'Detail' }) :
                    this.props.navigation.navigate('Appointment', { contactID: this.state.contact_Data.contact_id, companyID: this.state.contact_Data.contact_company_id,
                      contact_company_name:(this.state.DetailData.first_name+' ' + this.state.DetailData.last_name + (this.state.DetailData.company_name?(' (' + this.state.DetailData.company_name + ')'):'')), Screen: 'Detail',})
                  }}
                    style={[styles.top_view_btn, { marginStart: 4, flexDirection: 'row', backgroundColor: Colors.purpule_start }]}>

                    <Image source={require('../assets/images/calender2.png')} style={styles.calendar1} resizeMode="contain" />
                    <Text style={[styles.a]}>A</Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate("Opportunity", { contactID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.id : this.state.contact_Data.contact_id, companyID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.company_id : this.state.contact_Data.contact_company_id, category: 0, selectedTopLayerButton: 'usb' }) }}
                    style={[styles.top_view_btn, { marginStart: 4, flexDirection: 'row', backgroundColor: Colors.yellow_start }]}>

                    <Text style={styles.layer}>$</Text>
                    <Text style={styles.o}>O</Text>

                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {console.warn('contact second dtaa :::::: ' , this.state.DetailData); this.props.navigation.navigate("Prospects", {categ: this.state.DetailData.contact_categ,  contactID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.id : this.state.contact_Data.contact_id, setValue: 1, tabValue: 0, Screen: 'Detail' }) }}
                    style={[styles.top_view_btn, { marginStart: 4, flexDirection: 'row' }]}>

                    <Image source={require('../assets/images/user.png')} style={styles.user} resizeMode="contain" />
                    <Text style={[styles.p]}>P</Text>

                  </TouchableOpacity>

                </View>

              }

            </View>

          </View>

          {/* Calendar Icon And Meeting Type text  */}

          <View style={[styles.container, { flexDirection: 'row', padding: 16, marginTop: 10}]}>

            <View style={{ flex: 0.1}}>

              <Image source={require('../assets/images/calender1.png')} style={styles.calendar} />

            </View>

            <View style={{ flex: 0.9,alignSelf:'center', }}>

              {/* <Text style={styles.cvCrm}>{(this.state.DetailData.meeting_type === null || this.state.DetailData.meeting_type === undefined || this.state.DetailData.meeting_type === "undefined") ? '' : this.state.DetailData.meeting_type}</Text> */}
              <Text style={[styles.cvCrm,{marginTop:0}]}>{(this.state.DetailData.meeting_type === null || this.state.DetailData.meeting_type === undefined || this.state.DetailData.meeting_type === "undefined" || this.state.DetailData.meeting_type === "Select Meeting Type") ? '' : this.state.DetailData.meeting_type}</Text>
            </View>

          </View>


          {/* Show All Note And Add Anote Button Portion */}


          <View style={[styles.container, { flexDirection: 'row', padding: 16, marginHorizontal: 5, marginTop: 10 }]}>

            <View style={{ flex: 0.1 }}>

              <Image source={require('../assets/images/Forma_1.png')} style={styles.forma2} />

            </View>

            <View style={{ flex: 0.9 }}>

              {/* <HTML style={styles.productionAt} html={(this.state.Data.note === null || this.state.Data.note === undefined || this.state.Data.note === "undefined") ? '' : this.state.Data.note}/> */}
              <Text style={styles.productionAt}>{(this.state.Data.note === null || this.state.Data.note === undefined || this.state.Data.note === "undefined") ? '' : this.state.Note}</Text>
      
              {/* <Text style={styles.productionAt}>{(this.state.Data.note === null || this.state.Data.note === undefined || this.state.Data.note === "undefined") ? '' : this.state.Data.note}</Text> */}
              {/* {(this.state.Data.note === null || this.state.Data.note === undefined || this.state.Data.note === "undefined") ? '' :
              <Text>
             <HTML style={[styles.productionAt]} html={this.state.Data.note} />
              </Text>
            } */}
            
              {

                (this.state.DetailData.ev_categ === 'event') ?

                  null

                  :

                  <View style={{ flexDirection: 'row', marginTop: 10, }}>

                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("Prospects", { contactID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.id : this.state.contact_Data.contact_id, setValue: 0, tabValue: 1, Screen: 'Detail' }) }}
                      style={[styles.another_btn, { marginStart: 10, marginEnd: 4, }]}>

                      <Image source={require('../assets/images/Follow_up_bg.png')} style={styles.new_notofication_Image_Style} resizeMode="cover"></Image>
                      <Text style={[styles.showAll]}>Show All Notes</Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("Add", { contactID: (this.state.DetailData.ev_categ === 'appointment') ? this.state.contact_Data.id : this.state.contact_Data.contact_id, }) }}
                      style={[styles.another_btn, { marginStart: 18, marginEnd: 4, }]}>

                      <Image source={require('../assets/images/Appointment_bg.png')} style={styles.follow_up_Image_style} resizeMode="cover"></Image>
                      <Text style={[styles.addNote]}>Add Note</Text>

                    </TouchableOpacity>

                  </View>


              }



              {/* Map View Portion In Page  */}

              {(this.state.DetailData.ev_categ === 'followup') ? null :

                <View style={styles.mapcontainer}>

                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                      latitude: 22.7081955,
                      longitude: 75.8824422,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                  >

                  </MapView>

                </View>

              }

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

        </View >

        <SafeAreaView />

      </ScrollView>

    );
  }

}

// Styling Code for UI Elements of this Page

const styles = StyleSheet.create({

  top_layout: {

    paddingRight: 20,
    paddingLeft: 20

  },

  top_layout1: {

    paddingTop: 5,
    paddingRight: 20,
    paddingLeft: 20

  },

  main_container: {

    flex: 1,
    backgroundColor: Colors.lightGray,

  },

  container: {

    width: widthPercentageToDP('100%'),
    backgroundColor: Colors.white_color,

  },

  top_view_btn: {

    backgroundColor: Colors.primaryColor,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: 16, paddingEnd: 16

  },

  another_btn: {

    //backgroundColor: Colors.primaryColor,
    height: 42,
    borderRadius: 42 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: 10, paddingEnd: 10,
    marginLeft: 10,

  },

  top_view_txt: {

    color: Colors.white_color,
    fontSize: 14,
    textAlign: 'center'

  },

  top_image_style: {

    width: 16, height: 16,
    tintColor: Colors.white_color,
    marginEnd: 4

  },

  bernardMeet: {

    marginTop: 5,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '500',

  },

  defuLane: {

    marginTop: 10,
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  cvCrm: {

    width: widthPercentageToDP('60%'),
    height: 26,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 10,
    marginLeft: 5,

  },

  productionAt: {

    marginTop: 5,
    marginBottom: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  layer: {

    width: 22,
    height: 44,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    marginTop: 15,
    paddingLeft: 9,
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 27.3,

  },

  o: {

    width: 20,
    height: 32,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    marginTop: 4,
    paddingLeft: 2,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 27.3,

  },

  f: {

    width: 20,
    height: 30,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    paddingLeft: 4,
    fontWeight: '500',
    lineHeight: 27.3,

  },

  a: {

    width: 20,
    height: 30,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    paddingLeft: 4,
    fontWeight: '500',
    lineHeight: 27.3,

  },

  p: {

    width: 20,
    height: 30,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    paddingLeft: 4,
    fontWeight: '500',
    lineHeight: 27.3,

  },

  calendar: {

    width: 30,
    height: 30,
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,

  },

  calendar1: {

    width: 18,
    height: 18,
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    backgroundColor: colors.white_color,
    tintColor: colors.white_color

  },

  forma1: {

    width: 20,
    height: 26,
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    backgroundColor: colors.primaryColor,

  },

  showAll: {

    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '500',

  },

  addNote: {

    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '500',

  },

  new_notofication_Image_Style: {

    flex: 1,
    position: 'absolute',
    width: widthPercentageToDP('37%'),
    height: 46,
    borderRadius: 46 / 2,

  },

  follow_up_Image_style: {

    flex: 1,
    position: 'absolute',
    width: widthPercentageToDP('25%'),
    height: 46,
    borderRadius: 46 / 2,

  },

  user: {

    width: 18,
    height: 18,

  },

  l00011: {

    width: 24,
    height: 20,

  },

  forma2: {

    width: 40,
    height: 46,
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 34,
    marginLeft: -5,
    marginTop: -5,
    backgroundColor: colors.primaryColor,

  },

  ellipse2: {

    shadowColor: 'rgba(24, 146, 118, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    backgroundColor: '#76c67b',

  },

  mapcontainer: {

    marginTop: 16,
    height: 300,
    width: '90%',

  },

  map: {

    ...StyleSheet.absoluteFillObject,
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
