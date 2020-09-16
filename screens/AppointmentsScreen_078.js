import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Switch,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  View,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Overlay } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import { font_style, textHeader, textInput } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground';
import DatePicker from 'react-native-datepicker';
import { Searchbar } from 'react-native-paper';
import { Button } from 'react-native-elements'

import moment from 'moment';
import { Dropdown, } from 'react-native-material-dropdown';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Calendar, LocaleConfig, CalendarList, calendarListParams, calendarParams, calendarTheme } from 'react-native-calendars';
import { apiBasePath } from '../constantApi';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FlashMessage, { showMessage } from "react-native-flash-message";
import NetworkUtils from '../components/NetworkUtils';
import Moment from 'moment';


let calendarDate = moment();

let PreviousScreen;

//Define the Locale Configuration for Calendar 

LocaleConfig.locales['en'] = {

  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar', 'April', 'May', 'Jun', 'Jul.', 'Aug', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],

  dayNames: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  dayNamesShort: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri',],

};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Define Default Locale Configuration for Calendar

LocaleConfig.defaultLocale = 'en';

export default class AppointmentsScreen extends React.Component {

  // Set the Header and It's elements and functionality of header elements

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.schedule_appointment}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity style={[styles.top_layout1]} activeOpacity={1}
          onPress={() => { navigation.goBack(null) }}>

          <Image source={require('./../assets/images/arrow-left.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity style={[styles.top_layout1], { paddingTop: 5, flex: 0.6 }} activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }} >

          <Image source={require('./../assets/images/menu_3x.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,

    headerRight: () =>

      <TouchableOpacity style={[styles.top_layout, { paddingEnd: 16, paddingTop: 5 }]} activeOpacity={1}
        onPress={() => { navigation.getParam('createAppointment')(); }}>

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,

  });

  // Initilize the State variable 

  constructor() {

    super();
    this.state = {
      isvisible: false,
      contact_id: '',
      CalendarOverlay: false,
      calendarDate: '',
      renderSelectedItemState: false,
      ContactandCompanyData: [],
      ContactandCompanyState: false,
      selected_Date: '',
      day: '',
      month: '',
      year: '',
      note: '',
      contact_Data: '',
      AppointmentId:'',
      CompanyData: '',
      select_company: '',
      AddressUpdatetoContact: '',
      AppointmentTime: '',
      AppointmentData: '',
      ConversationState: false,
      conversation: '',
      show: false,
      AppointmentReminder: '',
      ClientOffice: '',
      CompanyState: false,
      CompanyOfficeState: false,
      CompanyOffice: '',
      meetingType: '',
      select_meetingType: '',
      select_CompanyOffice: '',
      defaultMeetAgent: '',
      MeetAgentData: '',
      Address: '',
      postalcode: '',
      endTime: '',
      isPage: false,
      count: 1,
      defaultAppointmentReminder: '',
      SelectedMeetAgent: [],
      SelectedContactCompanyName: [],
      selectMeetingPlace: '',
      selectMeetingOfficePlace: '',
      selectAppointmentReminder: '',
      AppointmentReminderBool: '',
      MeetingPlaceData: [
        { label: 'Client Office', value: 0 },
        { label: 'My Office', value: 1 },
        { label: 'New Meeting Location', value: 3 },
      ],
      AppointmentReminderData: [
        { label: ' None', value: 'none' },
        { label: 'At time of event', value: 't' },
        { label: '5 minutes before', value: '5m' },
        { label: '15 minutes before', value: '15m' },
        { label: '30 minutes before', value: '30m' },
        { label: '1 hour before', value: '1h' },
        { label: '2 hours before', value: '2h' },
        { label: '1 day before', value: '1d' },
        { label: '2 days before', value: '2d' },
        { label: '1 week before', value: '1w' },
      ],
      timeFrom: '',
      dateFrom: calendarDate.format('YYYY-MM-DD'),//YYYY-MM-DD
      contact_company_name: '',
      appointmentDTformat: '',

    }
  }

  // Get the Default Data for Appointment page field when Page is Loading By Call api method set_appointment_init

  componentDidMount = async () => {

    const { navigation } = this.props
    navigation.setParams({ createAppointment: this.createAppointment });
    _this = this

    PreviousScreen = navigation.getParam('Screen')

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      AsyncStorage.getItem('General_Settings')
        .then(req => JSON.parse(req))
        .then(json => {
          console.warn('json : ', json)
          // json.date_format ='yyyy-MM-dd';
          this.setState({
            appointmentDTformat: json,
            // dateFrom: calendarDate.format((this.state.appointmentDTformat.date_format).toUpperCase())
          }, () => {
            var preVal = this.state.dateFrom;
            //  let momentObj = moment(this.state.dateFrom).format((this.state.appointmentDTformat.date_format).toUpperCase())
            let momentObj = moment(this.state.dateFrom, (this.state.appointmentDTformat.date_format).toUpperCase());
            var dtRes = (moment(momentObj).format(this.state.appointmentDTformat.date_format.toUpperCase())).toString();
            console.warn("=== : ", (moment(momentObj).format(this.state.appointmentDTformat.date_format.toUpperCase())).toString())
            //this.setState({ dateFrom: calendarDate.format((this.state.appointmentDTformat.date_format).toUpperCase()) });
            this.setState({ dateFrom: dtRes }, () => {
              if (this.state.dateFrom == 'Invalid date') {
                console.warn('111 : ', preVal);
                let momentObj1 = moment(preVal, ('YYYY-MM-DD'));
                var dtRes1 = (moment(momentObj1).format(this.state.appointmentDTformat.date_format.toUpperCase())).toString();
                this.setState({ dateFrom: dtRes1 })

              }
            });
            //    console.warn('date formate : ', momentObj, this.state.dateFrom + " :: " + (this.state.appointmentDTformat.date_format).toUpperCase())
            console.warn('appointment dt format : ', this.state.appointmentDTformat);
            //

          })
        })
        .catch(error => console.log('error : ' + error));



      if (PreviousScreen === 'Detail') {

        this.setState({ isPage: navigation.getParam('isEdit') });
        if (this.state.isPage == true) {
          const AppointmentData = navigation.getParam('DetailData');
          this.setState({AppointmentId:AppointmentData.id});
          let value=AppointmentData.note;
          value = value.replace(/<br\s*\/?>/gi, ' ');
          this.setState({ note: value });
          this.setState({ Address: AppointmentData.location });
          this.setState({ postalcode: AppointmentData.postal });
          this.setState({ select_meetingType: AppointmentData.meeting_type });
          this.setState({ AppointmentTime: AppointmentData.appointment_time });
          this.setState({ endTime: AppointmentData.end_time });
          this.setState({ dateFrom: AppointmentData.appointment_date });
          // this.setState({select_meetingType:AppointmentData.meeting_type});
          this.setState({ contact_id: navigation.getParam('contactID'), AppointmentData: AppointmentData }, () => { this.getCompanyData(), this.fetchAppointmentInitilaData() });
          console.warn("Contact ID12...", this.state.contact_id);
          this.getContactData();
          // this.setState({isPage:navigation.getParam('isEdit')});
          this.setState({ select_conversation: AppointmentData.conversation });
          console.warn("AppointmentData123", this.state.AppointmentData);
          console.warn("Date Form...", this.state.AppointmentData.conversation);
          this.setState({ search: navigation.getParam('contact_company_name') });

          // this.setState({ search: navigation.getParam('contact_company_name'), day: calendarDate.date(), AppointmentData: AppointmentData, contact_id: navigation.getParam('contactID'), company_id: navigation.getParam('companyID') }, () => { this.fetchAppointmentInitilaData(), this.getCompanyData() })
          console.warn('contact_company_name : ', this.state.search);
          console.warn("AppointmentData....", AppointmentData.meta);
          console.warn("AppointmentData....", AppointmentData);
          console.warn("AppointmentData....", AppointmentData.appt_meet_agent);
          console.warn("Conversation...", AppointmentData.conversation);
          // this.setState({note:AppointmentData.note});
          // this.setState({Address:this.state.AppointmentData.location});
          // this.setState({postalcode:AppointmentData.postal});
            this.state.SelectedMeetAgent.push(this.state.AppointmentData.appt_meet_agent);
          console.warn("Select Agents12...",this.state.SelectedMeetAgent);
          this.setState({ count: this.state.count + 1 });
        }
        else {
          this.setState({ contact_id: navigation.getParam('contactID'), company_id: navigation.getParam('companyID') }, () => { this.getCompanyData(), this.fetchAppointmentInitilaData() });
          this.setState({ search: navigation.getParam('contact_company_name') });
          console.warn("Contact ID1234...", this.state.contact_id);
        }


        // this.setState({ dateFrom: calendarDate.format(AppointmentData.appointment_date.date_format).toUpperCase()});
        // var dt = new Date(this.state.dateFrom);

        // let momentObj = moment(this.state.dateFrom, (this.state.appointmentDTformat.date_format).toUpperCase())
      }

      if (PreviousScreen === 'Prospects') {

        this.setState({ day: calendarDate.date(), contact_id: navigation.getParam('contactID'), company_id: navigation.getParam('companyID') }, () => { this.fetchAppointmentInitilaData(), this.getCompanyData() })

      }

      if (PreviousScreen === 'Contacts') {

        this.setState({ day: calendarDate.date(), contact_id: navigation.getParam('contactID'), company_id: navigation.getParam('companyID') }, () => { this.fetchAppointmentInitilaData(), this.getCompanyData() })

      }

      if (PreviousScreen === 'Calendar') {

        this.setState({ day: calendarDate.date(), company_id: navigation.getParam('companyID') }, () => { this.getCompanyData() })

      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }

  }

  fetchAppointmentInitilaData = async () => {
    this.getContactData();
    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'set_appointment_init');
      formData.append('contact_id', this.state.contact_id);

      console.warn('request data : ', formData)
      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status == 200) {

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
          console.warn('Appointment Screen User info :  ', responseJson)
          if (str.error == 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }
          else {

            console.warn("String123...", str.meeting_types);
            this.setState({ isLoading: false, AppointmentTime: str.default_data.appointment_time, conversation: str.conversation_list, meetingType: str.meeting_types, CompanyOffice: str.company_offices, MeetAgentData: str.meet_agents, ClientOffice: str.client_office, AppointmentReminder: str.default_data.default_appt_reminder_to_customer, defaultAppointmentReminder: str.default_data.def_reminder }, () => {
              if (this.state.isPage == true) {
                this.setState({ AppointmentTime: this.state.AppointmentData.appointment_time });
              }





              if (this.state.SelectedMeetAgent.length === 0) {

                this.state.SelectedMeetAgent.push(str.default_data.appointment_meet_agent);
                console.warn("Select Agents...",this.state.SelectedMeetAgent);

              }

              var timeParts = this.state.AppointmentTime.split(":")
              var f = parseInt(timeParts[0]);
              f = f + 1;
              this.setState({ endTime: f + timeParts[1] },()=>{//,
             //    console.warn("EndTime123", this.state.endTime), () => {

                console.warn("==================")
                this.modifyKeyforDropDown();
              })
             // })
            });
            if (this.state.isPage == true) {
              this.setState({ endTime: this.state.AppointmentData.end_time });
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

  searchContact = async (Search) => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'search_contact');
      formData.append('company_id', this.state.select_company);
      formData.append('search_str', Search);


      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status == 200) {

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

          if (str.error == 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }
          else {

            this.setState({ isLoading: false, ContactandCompanyData: str }, () => { this.modifyContactandCompanyData() });

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

  //modify Contact and Company Data

  modifyContactandCompanyData() {

    if (this.state.ContactandCompanyData === undefined || this.state.ContactandCompanyData === [] || this.state.ContactandCompanyData.length === 0 || this.state.search === '') {

      this.setState({ ContactandCompanyState: false })

    }
    else {
      var item = this.state.ContactandCompanyData

      item.map((val) => {

        if (val.last_name === null || val.last_name === 'null') {

          val.Contactwithcompanyname = val.first_name + ' ' + '(' + val.company_name + ')';


        }
        else {

          val.Contactwithcompanyname = val.first_name + ' ' + val.last_name + ' ' + '(' + val.company_name + ')';

        }

      })

      this.setState({ ContactandCompanyData: item, ContactandCompanyState: true }, () => { item = {} })

    }
  }

  DisplayContactandCompanyList = (item) => {

    return (

      <TouchableOpacity

        onPress={() => { this.selectContactCompanyItem(item.id) }}>

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222' }}>{item.Contactwithcompanyname}</Text>

        </View>

      </TouchableOpacity>

    )
  }

  selectContactCompanyItem(id) {

    var item = this.state.ContactandCompanyData

    var selecteditem = [];

    item.map((val) => {

      if (PreviousScreen === 'Detail') {

        if (this.state.contact_id === val.id) {

          selecteditem = val.Contactwithcompanyname
        }
        else {

          selecteditem = val.Contactwithcompanyname

        }
      }
      else {

        if (id === val.id) {

          selecteditem = val.Contactwithcompanyname

        }

      }

    })

    this.setState({ SelectedContactCompanyName: selecteditem, contact_id: id, ContactandCompanyState: false, renderSelectedItemState: true }, () => { selecteditem = [], item = {}, this.fetchAppointmentInitilaData() })

  }

  // fetch the conversation data from api which have method get_contact_conversations and then call modify conversation key for the change the keys

  getCoversation = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token)
      formData.append('method', 'get_contact_conversations');
      formData.append('contact_id', this.state.contact_id);

      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status == 200) {
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


          if (str.error === 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }
          else {
            this.setState({ isLoading: false, conversation: str }, () => { this.modifyConversationKey() });
          }
        })
        .catch(error => {

          this.setState({ isLoading: false, });
        }
        )
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }

  modifyConversationKey() {

    if (this.state.conversation === undefined || this.state.conversation === [] || this.state.conversation.length === 0) {

    }
    else {

      var conversationitem = this.state.conversation

      conversationitem.map((val) => {

        val.value = val.id;
        val.label = val.name;
        delete val.name
        delete val.id

      })
      console.warn("ConversationItem....", conversationitem);
      this.setState({ conversation: conversationitem, select_conversation: conversationitem[0].value, ConversationState: true }, () => { })
    }

  }

  renderSelectedItem() {

    return (

      <View style={styles.search, { width: '100%', height: 46, flexDirection: 'row' }} >

        <Text style={[{
          width: '89%',
          fontSize: 16,
          marginTop: 13,
          marginLeft: 16,
          justifyContent: 'center',
          marginRight: 0,
          color: '#222222',
          fontFamily: 'Helvetica Neue',
          fontWeight: '400',
        },
        ]}
        >

          {this.state.SelectedContactCompanyName}

        </Text>

        {

          <TouchableOpacity
            onPress={() => {

              var a = []
              if (this.state.SelectedContactCompanyName.length == 0 || this.state.SelectedContactCompanyName == undefined) {

              } else {

                a = this.state.SelectedContactCompanyName;
                this.setState({ SelectedContactCompanyName: a, SelectedContactCompanyName: '', renderSelectedItemState: false }, () => { })

              }
            }}

            style={{
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Text
              style={[
                {
                  fontSize: 16,
                  marginTop: 14,
                  justifyContent: 'flex-end',
                  paddingEnd: 16,
                  color: '#222222',
                  fontFamily: 'Helvetica Neue',
                  fontWeight: '400',
                },

              ]}
            >X</Text>

          </TouchableOpacity>
        }
      </View>

    )
  }
  // =======
  getContactData = async () => {



    console.warn("Get Contact Data");

    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();

    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token)
    formData.append('method', 'get_contact_details');
    formData.append('contact_id', this.state.contact_id);
    console.warn("FDormData Contact", formData);



    fetch(apiBasePath, {
      method: 'POST',
      body: formData
    })

      .then(response => {
        console.warn("REsponse", response);
        if (response.status == 200) {
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
        console.warn("String Contact ", str);
        if (str.error === 101) {
          AsyncStorage.removeItem(Constant.api_token);
          this.props.navigation.navigate('SignUp');
        }
        else {
          console.warn("Json...", JSON.stringify(str))
          this.setState({ isLoading: false, contact_Data: str });
          console.warn("Contact_Data Update", this.state.contact_Data);
          console.warn("First_Name..", this.state.contact_Data.first_name);
        }
      })
      .catch(error => {

        this.setState({ isLoading: false, });
      }
      )





  }
  // =======

  setAddressPostalCodeUpdate = async () => {


    // ------
    if (this.state.AddressUpdatetoContact) {

      console.warn("AddresUpdate", this.state.AddressUpdatetoContact);
      const api_token = await AsyncStorage.getItem(Constant.api_token)
      let formData = new FormData();
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'edit_contact');
      formData.append('contact_id', this.state.contact_id);
      formData.append('first_name', this.state.contact_Data.first_name);
      formData.append('last_name', this.state.contact_Data.last_name);
      formData.append('company_name', this.state.contact_Data.company_name);
      formData.append('designation', this.state.contact_Data.designation);
      formData.append('title', this.state.contact_Data.title);
      formData.append('office_number', this.state.contact_Data.office_number);
      formData.append('mobile_number', this.state.contact_Data.mobile_number);
      formData.append('home_number', this.state.contact_Data.home_number);
      formData.append('ext_number', this.state.contact_Data.ext_number);
      formData.append('email', this.state.contact_Data.email);
      formData.append('address', this.state.Address);
      formData.append('city', this.state.contact_Data.city);
      formData.append('state', this.state.contact_Data.state);
      formData.append('country', this.state.contact_Data.country);
      formData.append('postal_code', this.state.postalcode);
      formData.append('industry', this.state.contact_Data.industry);
      formData.append('products_services', this.state.contact_Data.products_services);
      formData.append('website', this.state.contact_Data.website);
      formData.append('remarks', this.state.contact_Data.remarks);
      console.warn("Formdata...1", formData);


      fetch(apiBasePath, {
        method: 'POST',
        body: formData

      }
      )
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }
          else if (response.status == 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }

        })
        .then(responseJson => {
          str = responseJson;

          if (str.error === 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp')

          }
          else {
            if (str.status === true) {
              console.warn("str...", str.status);
              // showMessage({
              //   message: "",
              //   description: "Edit Profile Successfully.",
              //   type: "success",
              // }.then(this.props.navigation.goBack(null)));

            }
          }
        })
        .catch(error => {

          this.setState({ isLoading: false }, () => { });
        }
        )

    }
    // -------
  }

  // Create Appointment By Calling Api Method set_appointment

  createAppointment = async () => {

    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();

    var SelectedMeetAgentItems = this.state.SelectedMeetAgent
    var length = SelectedMeetAgentItems.length;
    let selectedMeetAgentsToItems = this.state.defaultMeetAgent;

    if (length > 0) {

      for (let i = 0; i < length; i++) {

        if (i === 0) {

          selectedMeetAgentsToItems = SelectedMeetAgentItems[i]

        }

        else {

          selectedMeetAgentsToItems = selectedMeetAgentsToItems + ',' + SelectedMeetAgentItems[i]

        }
      }
    }

    if (this.state.note === '' || this.state.select_conversation === '' || this.state.dateFrom === '' || selectedMeetAgentsToItems === '' || this.state.AppointmentTime === '' || this.state.endTime === '' || this.state.Address === '' || this.state.postalcode === '') {

      showMessage({
        message: "",
        description: "One of them field are not Filled",
        type: "danger",
      });
    }
    else {

      const isConnected = await NetworkUtils.isNetworkAvailable()

      if (isConnected) {
        this.setAddressPostalCodeUpdate();
        // this.getContactData();
        var dt = new Date(this.state.dateFrom);

        let momentObj = moment(this.state.dateFrom, (this.state.appointmentDTformat.date_format).toUpperCase())

        //var formate = (this.state.appointmentDTformat.date_format).toUpperCase();
        // this.setState({ dateFrom:Moment(dt).format('YYYY-MM-DD')})
        console.warn('on day press : ', moment(momentObj).format('YYYY-MM-DD'));


        formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
        formData.append('api_token', api_token);
        if(this.state.isPage==true){
          console.warn("Edit Method",this.state.AppointmentId);
          formData.append('method', 'edit_appointment');
          formData.append('appt_id', this.state.AppointmentId);
        }
        else{
          console.warn("Create Set Method",this.state.contact_id);
          formData.append('method', 'set_appointment');
          formData.append('contact_id', this.state.contact_id);
        }
        // formData.append('method', 'set_appointment');
        // formData.append('contact_id', this.state.contact_id);
        formData.append('conversation', this.state.select_conversation);
        formData.append('date', (moment(momentObj).format('YYYY-MM-DD')).toString());//this.state.dateFrom);
        formData.append('time', this.state.AppointmentTime);
        formData.append('note', this.state.note);
        formData.append('meet_agent', selectedMeetAgentsToItems);
        formData.append('meeting_type', this.state.select_meetingType);
        formData.append('end_time', this.state.endTime);
        formData.append('address', this.state.Address);
        formData.append('postal_code', this.state.postalcode);
        formData.append('reminder', this.state.defaultReminder);
        formData.append('meeting_place', this.state.selectMeetingPlace);

        if (this.state.selectMeetingPlace === 0) {
          formData.append('meeting_office_place', this.state.selectMeetingOfficePlace);
        }
        console.warn("FormData123", formData);
        fetch(apiBasePath, {
          method: 'POST',
          body: formData

        }
        )
          .then(response => {
            if (response.status == 200) {
              return response.json();
            }
            else if (response.status == 101) {
              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp');
            }

          })
          .then(responseJson => {
            str = responseJson;

            if (str.error === 101) {
              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp')

            }
            else {
              if (str.status === true) {
                console.warn("String12345 ...", str);

                showMessage({
                  message: "",
                  description: "Appointment Successfully Created",
                  type: "success",
                }.then(this.props.navigation.goBack(null)));

              }
            }
          })
          .catch(error => {

            this.setState({ isLoading: false }, () => { });
          }
          )
      }
      else {

        alert('Check Your Internet Connection and Try Again')

      }
    }
  }

  // modify Keys For Various Dropdown like Conversation,Company Office and meeting type

  modifyKeyforDropDown = async () => {

    var conversationitem = this.state.conversation;

    if (conversationitem === undefined) {

    }
    else {

      conversationitem.map((val) => {

        val.value = val.id;
        val.label = val.name;
        delete val.name
        delete val.id

      })
      console.warn("Convert1234", conversationitem);
      this.setState({ conversation: conversationitem, select_conversation: conversationitem[0].value, ConversationState: true }, () => {
        conversationitem = '';
        if (this.state.isPage == true) {
          let arr = this.state.conversation;
          console.warn("Con", this.state.conversation);
          console.warn("arr", arr.length);
          let val = "";
          for (let i = 0; i < arr.length; i++) {

            if (arr[i].value == this.state.AppointmentData.conversation) {
              console.warn("arr[i]", arr[i]);
              val = arr[i].label;
              console.warn("value1", arr[i].label);
              this.setState({ select_conversation: arr[i].label });
              console.warn("arrr...", this.state.select_conversation);
              break;
            }
          }
        }
      });

    }

    var CompanyOfficeItem = this.state.CompanyOffice

    if (CompanyOfficeItem === null || CompanyOfficeItem === undefined) {

    } else {

      CompanyOfficeItem.map((val) => {

        val.value = val.id
        val.label = val.office_name

      })

      var companyId= this.state.select_company + '';
console.warn("############################ : " ,companyId);
     // await AsyncStorage.setItem('selectedCompany',companyId).then(
    //   this.setState({ CompanyOffice: CompanyOfficeItem, select_CompanyOffice: CompanyOfficeItem[0].value, CompanyOfficeState: true }, () => { CompanyOfficeItem = '' })

  // );
  this.setState({ CompanyOffice: CompanyOfficeItem, select_CompanyOffice: CompanyOfficeItem[0].value, CompanyOfficeState: true }, () => { CompanyOfficeItem = '' })
    }


    var MeetingType = []
    var MeetingTypeItem = this.state.meetingType

    MeetingTypeItem.map((cv) => {
      var temp1 = {}

      if (temp1.name === undefined && temp1.id === undefined) {

        temp1.label = cv
        temp1.value = cv
        MeetingType.push(temp1)
      }

    })
    console.warn("Meeting 123...", MeetingType);

    this.setState({ meetingType: MeetingType, select_meetingType: MeetingType[0].value, selectMeetingPlace: this.state.MeetingPlaceData[0].value, selectAppointmentReminder: this.state.AppointmentReminderData[0].value }, () => { MeetingType = [], this.setAddressAndPostalcode() });
    if(this.state.isPage==true){
      this.setState({ select_meetingType: this.state.AppointmentData.meeting_type });
      this.setState({ selectMeetingPlace: this.state.AppointmentData.meta.appt_meeting_place });
      let arr=this.state.MeetingPlaceData;
      for(let i=0;i<arr.length;i++){
        if(arr[i].value==this.state.AppointmentData.meta.appt_meeting_place){
          this.setState({ selectMeetingPlace: arr[i].label });
        }
      }
    }
    // this.setState({ select_meetingType: this.state.AppointmentData.meeting_type });
    console.warn("Meeting123", this.state.select_meetingType);

  }

  // Get Company Data By Calling the Init Method Api and Call Modify Company_Access Method for Modify Keys

  getCompanyData = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();
      formData.append('api_token', api_token);
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('method', 'init');

      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status == 200) {
            return response.json();
          }
          else {
          }

        })
        .then(responseJson => {
          str = responseJson;

          if (str.error === 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp')

          }
          else {
            if (this.state.isPage == true) {
              this.setState({ isLoading: false, CompanyData: str.company_access }, () => {
                console.warn("CompanyData1234", this.state.CompanyData)
                // this.modifyCompanyAccessKey()
              },
              );
            }
            else {
              this.setState({ isLoading: false, CompanyData: str.company_access }, () => {
                console.warn("CompanyData", this.state.CompanyData)
                this.modifyCompanyAccessKey()
              },
              );
            }

            if (this.state.isPage == true) {
              let val = "";
              let arr = this.state.CompanyData;
              console.warn("Company Array..", arr, "Array length ::", arr.length);
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == this.state.AppointmentData.company_id) {
                  // console.warn("Company arrr",arr[i]);
                  // val=arr[i].company_name;
                  this.setState({ select_company: arr[i].company_name });
                  console.warn("Comany value", this.state.select_company);
                  // val=arr[i]
                  break;
                }

              }

            }
          }

        })
        .catch(error => {

          this.setState({ isLoading: false }, () => { });
        }
        )

    }
    else {

      alert('Check Your Internet Connection and Try Again')


    }

  }


  // Modify Key for Company Data Like id change to value and company_name change to label and set Default value of selected Company

  modifyCompanyAccessKey = async () => {

    var CompanyItem = this.state.CompanyData;
    var CompanyDefaultValue;

    const SelectedCompany = await AsyncStorage.getItem('selectedCompany');
    console.warn("Selected Company", SelectedCompany)
    console.warn("Selected Company array", CompanyItem)

    if (CompanyItem === undefined) {
      console.warn("=============== null")
return;
    }
    else {

      CompanyItem.map((val) => {

        val.value = val.id;
        val.label = val.company_name;
        delete val.company_name
        delete val.id

        if (val.value === this.state.company_id) {
          CompanyDefaultValue = val.value
        }

      })

      if (SelectedCompany === null) {
console.warn('---------------------- ****')
        await AsyncStorage.setItem('selectedCompany', CompanyItem[0].company_name).then(
          this.setState({ CompanyData: CompanyItem, select_company: CompanyDefaultValue, CompanyState: true }, () => { this.fetchAppointmentInitilaData() })

        )
      }
      else {
        console.warn('---------------------- 1234');
        await AsyncStorage.setItem('selectedCompany', SelectedCompany).then(
          this.setState({ CompanyData: CompanyItem, select_company: SelectedCompany, CompanyState: true }, () => { this.fetchAppointmentInitilaData() })
        )
      }


    }

  }

  // Set Address and postal Code for Address and Postal Code Field According to Selected Meeting Meeting Place value

  setAddressAndPostalcode() {

    if (this.state.selectMeetingPlace === 0) {

      // this.setState({ Address: this.state.ClientOffice.address, postalcode: this.state.ClientOffice.postal_code });
      this.setState({ Address: this.state.AppointmentData.location, postalcode: this.state.AppointmentData.postal })

    }
    else if (this.state.selectMeetingPlace === 1 && this.state.CompanyOffice !== null && this.state.CompanyOffice !== undefined) {

      var length = this.state.CompanyOffice.length

      if (length > 0) {
        for (let i = 0; i < length; i++) {

          if (this.state.select_CompanyOffice === this.state.CompanyOffice[i].id) {

            this.setState({ Address: this.state.CompanyOffice[i].address, postalcode: this.state.CompanyOffice[i].postal_code })
          }
        }
      }
    }
    else {
      this.setState({ Address:this.state.AppointmentData.location, postalcode: this.state.AppointmentData.postal })
    }

  }

  // Save Selected meet Agent Value When Select the Agents for Appointment meeting 

  onSelectedAgentItemsChange = (selectedAgentsItems) => {

    this.setState({ SelectedMeetAgent: selectedAgentsItems });

  };

  onSelectedContactCompanyNameChange = (SelectedContactCompanyName) => {

    this.setState({ SelectedContactCompanyName: SelectedContactCompanyName });

  };

  // Toggle Switch Value Of Address Update To Contact Switch 

  toggleSwitchForAddressUpdate = (value) => {

    this.setState({ AddressUpdatetoContact: value })

  }

  // Toggle Switch Value Of Appointment Reminder Switch 

  toggleSwitchForAppointmentReminder = (value) => {

    this.setState({ AppointmentReminderBool: value })

  }

  // Toggle Visibility Of Update App Notification Prompt

  setModalVisible(visible) {

    this.setState({ CalendarOverlay: visible })

  }

  // Decrement month index by 1 from Calendar by clicking left Arrow Button of month 

  onPressMonthArrowLeft = () => {

    calendarDate = calendarDate.add(-1, 'month');
    this.updateCalendarDateFromButtons();

  }

  // Decrement year index by 1 from Calendar by clicking left Arrow Button of year 

  onPressYearArrowLeft = () => {

    calendarDate = calendarDate.add(-1, 'year');
    this.updateCalendarDateFromButtons();

  }

  // Increment month index by 1 from Calendar by clicking Right Arrow Button of month 

  onPressMonthArrowRight = () => {

    calendarDate = calendarDate.add(1, 'month');
    this.updateCalendarDateFromButtons();

  }

  // Increment year index by 1 from Calendar by clicking Right Arrow Button of Year 

  onPressYearArrowRight = () => {

    calendarDate = calendarDate.add(1, 'year');
    this.updateCalendarDateFromButtons();

  }

  // set Day, month, year and Appointment Date from Calendar by clicking left or right Arrow   

  updateCalendarDateFromButtons() {

    this.setState({ calendarDate: calendarDate.format((this.state.appointmentDTformat.date_format).toUpperCase()) }, () => {
      var Year = calendarDate.year();
      var Month = calendarDate.month();

      this.setState({ month: monthNames[Month], year: Year, }, () => {
        //this.setState({ dateFrom: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day }) 
      })

    });

  }

  // Get Day, month and year and set the Appointment Date from Calendar while swipe left or right  

  updateCalendarDate() {

    this.setState({ calendarDate: calendarDate.format((this.state.appointmentDTformat.date_format).toUpperCase()) }, () => {

      // var Year = calendarDate.year();
      var Month = calendarDate.month();
      var Month1 = this.state.MonthIndex;
      console.warn('calendar date : ', this.state.calendarDate);
      this.setState({ month: monthNames[Month1 - 1] }, () => {
        //  this.setState({ dateFrom: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day }) 
      })

    });
  }

  // Toggle Visibility of Update App Notification Prompt

  setOverlayVisible(visible) {

    this.setState({ isVisible: visible });

  }

  showTimepicker = () => {
    this.setState({ show: true })
  };

  render() {

    return (

      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag' enableResetScrollToCoords={true}>

        <ScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'  >

          <SafeAreaView>

            <View style={[styles.Viewcontainer]}>

              <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}
                onPress={() => {
                  if (this.state.ContactandCompanyState === true) {
                    this.setState({ ContactandCompanyState: false })
                  }
                  if (this.state.CalendarOverlay === true) {
                    this.setState({ CalendarOverlay: false })
                  }

                }} >

                {(PreviousScreen === 'Prospects') ? null :

                  <View>

                    <Text style={[styles.text_style1]}>Company:*</Text>

                    <View activeOpacity={1} style={[styles.dropdown_view,]}>

                      <View style={styles.img_view}>

                        <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                      </View>

                      <Dropdown
                        containerStyle={styles.dropdown_container}
                        pickerStyle={{
                          width: '92%', marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                          shadowOffset: { width: 2, height: -4 },
                          shadowRadius: 21,
                          borderRadius: 46 / 2,
                          backgroundColor: '#ffffff',
                        }}
                        inputContainerStyle={{
                          borderBottomColor: 'transparent',
                          justifyContent: 'center',
                        }}
                        textColor='#222222'
                        itemColor='#222222'
                        baseColor='#ffffff00'
                        dropdownPosition={0}
                        itemCount={5}
                        dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                        dropdownMargins={{ min: 0, max: 0 }}
                        data={(this.state.CompanyState) ? this.state.CompanyData : []}
                        value={this.state.select_company}
                        onChangeText={(value) => { this.setState({ select_company: value }) }}
                      />

                    </View>

                    <Text style={[styles.text_style1]}>Contact Name (Company Name):</Text>

                    <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, }}>

                      {(this.state.renderSelectedItemState) ?

                        this.renderSelectedItem()
                        :
                        <Searchbar
                          transparent
                          placeholder=""
                          onChangeText={search => { this.searchContact(search) }}
                          value={this.state.search}
                          inputStyle={{ color: '#222222', marginLeft: -20 ,}}
                          style={[styles.search], {borderRadius: 46 / 2}}
                          autoCorrect={false}
                          editable={this.state.isPage?false:true}
                          onClear={search => this.searchContact('')}
                        />

                      }

                    </View>

                    {
                      (this.state.ContactandCompanyState) ?

                        <FlatList
                          contentContainerStyle={{
                            marginTop: 6,
                            borderWidth: 2,
                            borderColor: Colors.lightGray,
                            borderRadius: 40 / 2,
                          }}

                          keyboardShouldPersistTaps='handled'
                          data={this.state.ContactandCompanyData}

                          keyExtractor={(item, index) => { return item.id + "" + index }}
                          renderItem={({ item }) => this.DisplayContactandCompanyList(item)}

                        />

                        : null}

                  </View>
                }

                <Text style={[styles.text_style1]}>Select Conversation:</Text>

                <View key={this.state.select_conversation} activeOpacity={1} style={[styles.dropdown_view,]}>

                  <View style={styles.img_view}>

                    <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                  </View>

                  <Dropdown
                    containerStyle={styles.dropdown_container}
                    pickerStyle={{
                      width: '92%', marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                      shadowOffset: { width: 2, height: -4 },
                      shadowRadius: 21,
                      borderRadius: 46 / 2,
                      backgroundColor: '#ffffff',
                    }}
                    inputContainerStyle={{
                      borderBottomColor: 'transparent',
                      justifyContent: 'center',
                    }}
                    textColor='#222222'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.ConversationState) ? this.state.conversation : []}
                    value={this.state.select_conversation}
                    onChangeText={(value) => { this.setState({ select_conversation: value }) }}
                  />

                </View>
                {/* <Text style={[styles.text_style1]}>{this.state.Address}</Text>
                  <Text style={[styles.text_style1]}>{this.state.postalcode}</Text>      */}
                <Text style={[styles.text_style1]}>Appointment Date:*</Text>
                <View key={this.state.count}>
                  <TouchableOpacity style={styles.followupdaterectangle}
                    onPress={() => { this.setState({ CalendarOverlay: true }) }}>

                    <Text style={[styles.followUp], { marginTop: 12, marginLeft: 16, width: widthPercentageToDP(79) }}>{this.state.dateFrom}</Text>

                    <Image source={require('../assets/images/calender1.png')} style={[styles.top_image_style, { tintColor: '#222222', marginEnd: 15, width: 22, height: 22, justifyContent: 'center' }]} resizeMode="contain" />

                  </TouchableOpacity>
                </View>
                {/* <Text style={[styles.followUp], { marginTop: 12, marginLeft: 16, width: widthPercentageToDP(79) }}>{this.state.dateFrom}</Text> */}

                <Text style={[styles.text_style1]}>Meeting Type:</Text>

                <View activeOpacity={1} style={[styles.dropdown_view,]}>

                  <View style={styles.img_view}>

                    <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                  </View>

                  <Dropdown
                    containerStyle={styles.dropdown_container}
                    pickerStyle={{
                      width: '92%', marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                      shadowOffset: { width: 2, height: -4 },
                      shadowRadius: 21,
                      borderRadius: 46 / 2,
                      backgroundColor: '#ffffff',
                    }}
                    inputContainerStyle={{
                      borderBottomColor: 'transparent',
                      justifyContent: 'center',
                    }}
                    textColor='#222222'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.ConversationState) ? this.state.meetingType : []}
                    value={this.state.select_meetingType}
                    onChangeText={(value) => { this.setState({ select_meetingType: value }) }}
                  />

                </View>

                <Text style={[styles.text_style1]}>Appointment Start Time:*</Text>

                <TouchableOpacity activeOpacity={1} style={[styles.followTimeRectangle,]}
                  onPress={() => { }} >

                  <DatePicker
                    style={[{
                      flex: 1, paddingLeft: 16, alignSelf: 'center'

                    }]}
                    date={this.state.AppointmentTime}
                    mode="time"
                    showIcon={true}
                    iconSource={require('../assets/images/arrow_down.png')}
                    format="hh:mm A"
                    confirmBtnText="Done"
                    cancelBtnText="Clear"
                    customStyles={{
                      datePickerCon: { backgroundColor: '#eff0f2' },
                      datePicker: { backgroundColor: '#d0d3da' },
                      dateIcon: {
                        position: 'absolute',
                        width: 16,
                        height: 16,
                        right: 0,
                        marginRight: 16,
                        tintColor: Colors.black_color,
                      },
                      btnTextCancel: {
                        color: '#0b6ee6'
                      },
                      btnTextConfirm: {
                        color: '#0b6ee6'
                      },
                      dateText: {
                        color: '#222222',
                      },
                      dateInput: [{
                        alignItems: 'flex-start',
                        color: Colors.black_color,
                        flex: 1,
                        fontSize: 16,
                        fontFamily: 'Helvetica Neue',
                        fontSize: 46,
                        fontWeight: '400',
                        borderColor: 'transparent',
                      },

                      ]
                    }}
                    onDateChange={(time) => {
                      this.setState({ AppointmentTime: time }, () => {
                        var timeParts = time.split(":")
                        var f = parseInt(timeParts[0]);
                        f = f + 1;

                        this.setState({ endTime: f + ':' + timeParts[1] }, () => { })
                      })
                    }}


                  />

                </TouchableOpacity>

                <Text style={[styles.text_style1]}>End Time:*</Text>

                <TouchableOpacity activeOpacity={1} style={[styles.followTimeRectangle,]}
                  onPress={() => { }} >

                  <DatePicker
                    style={[{
                      flex: 1, paddingLeft: 16, alignSelf: 'center'
                    }]}
                    date={this.state.endTime}
                    mode="time"
                    showIcon={true}
                    iconSource={require('../assets/images/arrow_down.png')}
                    format="hh:mm A"
                    confirmBtnText="Done"
                    cancelBtnText="Clear"
                    customStyles={{
                      datePickerCon: { backgroundColor: '#eff0f2' },
                      datePicker: { backgroundColor: '#d0d3da' },
                      dateIcon: {
                        position: 'absolute',
                        width: 16,
                        height: 16,
                        right: 0,
                        marginRight: 16,
                        tintColor: Colors.black_color,
                      },
                      btnTextCancel: {
                        color: '#0b6ee6'
                      },
                      btnTextConfirm: {
                        color: '#0b6ee6'
                      },
                      dateText: {
                        color: '#222222',
                      },
                      dateInput: [{
                        alignItems: 'flex-start',
                        color: Colors.black_color,
                        flex: 1,
                        fontSize: 16,
                        fontFamily: 'Helvetica Neue',
                        fontSize: 46,
                        fontWeight: '400',
                        borderColor: 'transparent',
                      },

                      ]
                    }}
                    onDateChange={(time) => { this.setState({ endTime: time }, () => { }) }}
                  />

                </TouchableOpacity>

                <Text style={[styles.text_style1]}>Meet Agents:*</Text>

                <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, flexDirection: 'row' }}>

                  <View style={{ width: widthPercentageToDP(85) }}>

                    <SectionedMultiSelect
                      items={(this.state.ConversationState) ? this.state.MeetAgentData : []}
                      uniqueKey="id"

                      selectText="Select Agents"
                      searchPlaceholderText='Select Agents'
                      selectedText=''
                      hideSelect={false}
                      showDropDowns={true}
                      readOnlyHeadings={false}
                      expandDropDowns={false}
                      animateDropDowns={true}
                      modalWithSafeAreaView={false}
                      chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                        style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                      modalWithTouchable={true}
                      styles={{ position: 'absolute', backgroundColor: Colors.white_shade, borderRadius: 21 }}
                      onSelectedItemsChange={this.onSelectedAgentItemsChange}
                      selectedItems={this.state.SelectedMeetAgent}
                      parentChipsRemoveChildren={false}
                      chipsPosition='top'
                      chipColor={Colors.primaryColor}
                      chipContainer={{ borderColor: '#222222' }}
                    />

                  </View>

                  <View style={styles.img_view, { justifyContent: 'flex-end', alignSelf: 'center' }}>

                    <Image source={require('../assets/images/Search.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                  </View>

                </View>

                <Text style={[styles.text_style1]}>Meeting Place:*</Text>

                <View activeOpacity={1} style={[styles.dropdown_view,]}>

                  <View style={styles.img_view}>

                    <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                  </View>

                  <Dropdown
                    containerStyle={styles.dropdown_container}
                    pickerStyle={{
                      width: '92%', marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                      shadowOffset: { width: 2, height: -4 },
                      shadowRadius: 21,
                      borderRadius: 46 / 2,
                      backgroundColor: '#ffffff',
                    }}
                    inputContainerStyle={{
                      borderBottomColor: 'transparent',
                      justifyContent: 'center',
                    }}
                    textColor='#222222'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.ConversationState) ? this.state.MeetingPlaceData : []}
                    value={this.state.selectMeetingPlace}
                    onChangeText={(value) => { this.setState({ selectMeetingPlace: value }, () => { this.setAddressAndPostalcode() }) }}
                  />

                </View>


                {

                  (this.state.selectMeetingPlace === 1) ?

                    <View>

                      <Text style={[styles.text_style1]}>Select Company Office:</Text>

                      <View activeOpacity={1} style={[styles.dropdown_view,]}>

                        <View style={styles.img_view}>

                          <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                        </View>

                        <Dropdown
                          containerStyle={styles.dropdown_container}
                          pickerStyle={{
                            width: '92%', marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                            shadowOffset: { width: 2, height: -4 },
                            shadowRadius: 21,
                            borderRadius: 46 / 2,
                            backgroundColor: '#ffffff',
                          }}
                          inputContainerStyle={{
                            borderBottomColor: 'transparent',
                            justifyContent: 'center',
                          }}
                          textColor='#222222'
                          itemColor='#222222'
                          baseColor='#ffffff00'
                          dropdownPosition={0}
                          itemCount={5}
                          dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                          dropdownMargins={{ min: 0, max: 0 }}
                          data={(this.state.CompanyOfficeState) ? this.state.CompanyOffice : []}
                          value={this.state.select_CompanyOffice}
                          onChangeText={(value) => { this.setState({ select_CompanyOffice: value }, () => { this.setAddressAndPostalcode() }) }}
                        />

                      </View>

                    </View>
                    :
                    null
                }

                <Text style={[styles.text_style1]}>Address:*</Text>

                <TextInput
                  style={[textInput.gray_textInput, { color: '#222222', marginTop: 10, height: 46, fontSize: 16, fontWeight: '400', }]}
                  onChangeText={(value) => this.setState({ Address: value })}
                  value={this.state.Address}
                  autoCorrect={false}
                  placeholderTextColor={Colors.black_color}
                />

                <Text style={[styles.text_style1]}>Postal Code:*</Text>

                <TextInput
                  style={[textInput.gray_textInput, { color: '#222222', marginTop: 10, height: 46, fontSize: 16, fontWeight: '400', }]}
                  onChangeText={(value) => this.setState({ postalcode: value })}
                  value={this.state.postalcode}
                  autoCorrect={false}
                  placeholderTextColor={Colors.black_color}
                />

                <Text style={[styles.text_style1]}>Update Address to Contact Profile:</Text>

                <View style={{ marginTop: 10, marginBottom: 10 }}>

                  <Switch
                    trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                    style={{ height: 20, width: 40, }}
                    onValueChange={(value) => this.toggleSwitchForAddressUpdate(value)}
                    value={this.state.AddressUpdatetoContact} />

                </View>

                <Text style={[styles.text_style1]}>Appointment Reminder:</Text>

                <View style={{ marginTop: 10, marginBottom: 10 }}>

                  <Switch
                    trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                    style={{ height: 24, width: 40, }}
                    onValueChange={(value) => this.toggleSwitchForAppointmentReminder(value)}
                    value={this.state.AppointmentReminderBool} />

                </View>

                {(this.state.AppointmentReminderBool) ?

                  <View>

                    <Text style={[styles.text_style1]}>Select Appointment Reminder:</Text>

                    <View activeOpacity={1} style={[styles.dropdown_view,]}>

                      <View style={styles.img_view}>

                        <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                      </View>

                      <Dropdown
                        containerStyle={styles.dropdown_container}
                        pickerStyle={{
                          width: '92%', marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                          shadowOffset: { width: 2, height: -4 },
                          shadowRadius: 21,
                          borderRadius: 46 / 2,
                          backgroundColor: '#ffffff',
                        }}
                        inputContainerStyle={{
                          borderBottomColor: 'transparent',
                          justifyContent: 'center',
                        }}
                        textColor='#222222'
                        itemColor='#222222'
                        baseColor='#ffffff00'
                        dropdownPosition={0}
                        itemCount={5}
                        dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                        dropdownMargins={{ min: 0, max: 0 }}
                        data={(this.state.ConversationState) ? this.state.AppointmentReminderData : []}
                        value={this.state.defaultReminder}
                        onChangeText={(value) => { this.setState({ defaultReminder: value }) }}
                      />

                    </View>

                  </View>
                  :
                  null
                }

                <Text style={[styles.text_style1]}>Note:</Text>

                <View style={[styles.followTimeRectangle1]}>

                  <TextInput
                    style={[{ width: '100%', borderRadius: 46 / 2, paddingStart: 20, marginTop: 10, backgroundColor: Colors.white_shade, fontFamily: 'Helvetica Neue', color: '#222222', textAlignVertical: 'top', marginBottom: 25, fontSize: 18 }]}
                    onChangeText={(value) => this.setState({ note: value })}
                    value={this.state.note}
                    placeholder="Enter Note"
                    multiline={true}
                    numberOfLines={5}
                    placeholderTextColor='#222222'

                  />

                </View>


                <Modal animationType="fade" transparent={true} visible={this.state.CalendarOverlay}>

                  <View style={{ flex: 1, justifyContent: 'flex-end', borderWidth: 0, borderColor: 'red' }}>
                    <View style={{ height: '40%', width: '100%', borderWidth: 0, borderColor: 'green', zIndex: 111, backgroundColor: '#000', opacity: 0.4 }}>
                      <TouchableOpacity onPress={() => this.setModalVisible(false)} style={{ height: '100%', borderWidth: 0, borderColor: 'yellow' }}></TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#f7f7f7', flexDirection: 'row', borderWidth: 0, borderColor: 'green' }}>

                      <TouchableOpacity style={[styles.Calendar_header_button]} activeOpacity={1}
                        onPress={() => { this.onPressMonthArrowLeft(); }}>

                        <Image source={require('./../assets/images/RightButton.png')}
                          style={{ width: 18, height: 18, }} resizeMode="contain" />

                      </TouchableOpacity>

                      <Text style={styles.month_year_Style}>{this.state.month}</Text>

                      <TouchableOpacity style={[styles.Calendar_header_button]} activeOpacity={1}
                        onPress={() => { this.onPressMonthArrowRight(); }}>

                        <Image source={require('./../assets/images/LeftButton.png')}
                          style={{ width: 18, height: 18, }} resizeMode="contain" />

                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.Calendar_header_button]} activeOpacity={1}
                        onPress={() => { this.onPressYearArrowLeft() }} >

                        <Image source={require('./../assets/images/RightButton.png')}
                          style={{ width: 18, height: 18, }} resizeMode="contain" />

                      </TouchableOpacity>

                      <Text style={styles.month_year_Style}>{this.state.year}</Text>

                      <TouchableOpacity style={[styles.Calendar_header_button]} activeOpacity={1}
                        onPress={() => { this.onPressYearArrowRight() }} >

                        <Image source={require('./../assets/images/LeftButton.png')}
                          style={{ width: 18, height: 18, }} resizeMode="contain" />

                      </TouchableOpacity>

                    </View>

                    <View>

                      <CalendarList

                        current={this.state.selected_Date}
                        horizontal={true}
                        markedDates={{ [this.state.selected_Date]: { selected: true } }}
                        onVisibleMonthsChange={(months) => {

                          this.setState({ MonthIndex: months[0].month, year: months[0].year }, () => { this.updateCalendarDate() })
                        }}
                        onDayPress={(date) => {
                          console.warn("date :: ", date);
                          var dt = new Date(date.dateString);
                          var formate = (this.state.appointmentDTformat.date_format).toUpperCase();
                          this.setState({ dateFrom: Moment(dt).format(formate) })
                          console.warn('on day press : ', Moment(dt).format(formate));
                          this.setState({ selected_Date: date.dateString, day: date.day, CalendarOverlay: false }, () => { this.updateCalendarDate() }
                          )
                        }}

                        theme={{
                          selectedDayBackgroundColor: '#2de2b7',
                          selectedDayTextColor: '#ffffff',
                          selectedDayBorderRadius: 46 / 2,
                          backgroundColor: '#ffffff',
                          calendarBackground: '#ffffff',
                          textSectionTitleColor: '#b6c1cd',
                          selectedDayTextColor: '#ffffff',
                          todayTextColor: '#2d4150',
                          dayTextColor: '#2d4150',
                          textDisabledColor: '#d9e1e8',
                          monthTextColor: Colors.primaryColor,
                          indicatorColor: 'blue',
                          textDayFontFamily: 'Helvetica Neue',
                          textMonthFontFamily: 'Helvetica Neue',
                          textDayHeaderFontFamily: 'Helvetica Neue',
                          textDayFontSize: 14,
                          textMonthFontSize: 14,
                          textDayHeaderFontSize: 14,
                          'stylesheet.calendar.header': {
                            header: {
                              height: 0,
                              opacity: 0,
                            }
                          }

                        }}

                        showSixWeeks={true}
                        firstDay={1}
                        year='2020'
                        hideArrows={true}
                        hideExtraDays={false}

                        // Enable paging on horizontal, default = false
                        pagingEnabled={true}
                        calendarWidth={widthPercentageToDP(100)}
                        {...calendarListParams}
                        {...calendarParams}
                      />

                    </View>


                  </View>

                </Modal>

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

              </TouchableOpacity>

            </View>

          </SafeAreaView>

        </ScrollView>

      </KeyboardAwareScrollView>

    );
  }
}

// styling Code for Ui elements of this Page

const styles = StyleSheet.create({

  top_layout: {

    height: 32,
    paddingRight: 20,
    paddingLeft: 20

  },

  top_layout1: {

    paddingTop: 5,
    height: 32,
    paddingRight: 20,
    paddingLeft: 20

  },

  followTimeRectangle: {

    marginTop: 10,
    height: 46,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    borderColor: 'rgba(216, 219, 222, 0.5)',
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: '#ecf0f2',

  },

  followTimeRectangle1: {

    marginTop: 10,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    borderColor: 'rgba(216, 219, 222, 0.5)',
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: '#ecf0f2',

  },

  Calendar_header_button: {

    paddingTop: 14,
    height: 46,
    paddingRight: 20,
    paddingLeft: 20,

  },

  month_year_Style: {

    flex: 1,
    color: '#222222',
    fontWeight: '400',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',

  },

  modalOverlay: {

    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)'

  },

  followupdaterectangle: {

    marginTop: 10,
    height: 46,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    borderColor: Colors.primaryColor,
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: Colors.white_shade,

  },

  text_style1: {

    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '400',

  },

  container: {

    flex: 1,
    // padding: 16,
    backgroundColor: Colors.white_color,

  },

  Viewcontainer: {

    flex: 1,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: Colors.white_color,

  },

  dropdown_container: {

    width: '100%',
    alignSelf: 'center',
    paddingStart: 16,

  },

  dropdown_view: {

    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 42 / 2, paddingEnd: 16,
    marginTop: 10,

  },

  img_view: {

    alignSelf: 'flex-end',
    position: 'absolute',
    paddingEnd: 16

  },

  txt_style: {

    fontSize: 16, color: Colors.black_color,
    marginTop: 10,
    marginStart: 16

  },

  list_txt: {

    color: Colors.primaryColor,
    fontSize: 18,

  },

  list_item_des: {

    color: Colors.dark_gray,
    fontSize: 14,

  },

  top_image_style: {

    width: 16, height: 16,
    tintColor: Colors.white_color,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

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

  search: {

    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    flex: 1,
    backgroundColor: '#efeff4',
    // height: 46,
    borderRadius: 46 / 2,
    alignItems: 'center',
    justifyContent: 'center',

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

})