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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import { font_style, textHeader, textInput } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { Dropdown, } from 'react-native-material-dropdown';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Calendar, LocaleConfig, CalendarList, calendarListParams, calendarParams, calendarTheme } from 'react-native-calendars';
import { apiBasePath } from '../constantApi';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FlashMessage, { showMessage } from "react-native-flash-message";
import NetworkUtils from '../components/NetworkUtils';
import { BadgeContext } from '../components/IconHome';


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

export default class EventScreen extends React.PureComponent {

  // Set the Header and It's elements and functionality of header elements

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.add_Event}</Text>,

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
        onPress={() => { navigation.getParam('createEvent')(); }}>

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,

  });

  // Initilize the State variable 

  constructor() {

    super();

    // this.modifyKeyforDropDown = this.modifyKeyforDropDown.bind(this);
    // this.getCompanyData = this.getCompanyData.bind(this);
    // this.modifyCompanyAccessKey = this.modifyCompanyAccessKey.bind(this)

    this.state = {
      isvisible: false,
      company_id: '',
      user_id: '',
      CalendarOverlay: false,
      calendarDate: '',
      selected_Date: '',
      note: '',
      day: '',
      month: '',
      year: '',
      EventData: '',
      EventName: '',
      CompanyData: '',
      select_company: '',
      AppointmentTime: '',
      ConversationState: false,
      conversation: '',
      show: false,
      RepeatEventData: '',
      CompanyState: false,
      CompanyOfficeState: false,
      CompanyOffice: '',
      meetingType: '',
      select_meetingType: '',
      defaultMeetAgent: '',
      MeetAgentData: '',
      Address: '',
      postalcode: '',
      endTime: '',
      SelectedMeetAgent: [],
      selectEventReminder: '',
      setRepeatEventTogglevalue: false,
      RepeatEventBool: '',
      defaultRepeatEvent: '',
      EventReminderData: [],
      timeFrom: '',
      EventDate: calendarDate.format('YYYY-MM-DD'),
      EndDate: calendarDate.format('YYYY-MM-DD'),
      isSaveClicked:false,
      unread_Notification_count: '',
      biggestWonDealDataState: false,
      recentNewDealDataState: false,
      userState: false,
      initialState: false,

    }
  }

  static contextType = BadgeContext;


  // Get the Default Data for Appointment page field when Page is Loading By Call api method set_appointment_init

  componentDidMount = async () => {

    const { navigation } = this.props
    navigation.setParams({ createEvent: this.createEvent });

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      _this = this
      const EventData = navigation.getParam('EventData')

      const Previous = navigation.getParam('Screen')

      this.setState({ day: calendarDate.date(), EventData: EventData }, () => { console.log(JSON.stringify(this.state.EventData)) })

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      this.setState({ company_id: this.state.EventData.company_id, user_id: this.state.EventData.user_id })



      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'set_cal_event_init');
      formData.append('company_id', this.state.company_id);
      formData.append('user_id', this.state.user_id);


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


            this.setState({ isLoading: false, meetingType: str.meeting_types, MeetAgentData: str.meet_agents, EventReminderData: str.reminder_options, RepeatEventData: str.repeat_event_sched_options }, () => { this.modifyKeyforDropDown(), this.getCompanyData() });
            if (this.state.SelectedMeetAgent.length === 0) {

              this.state.SelectedMeetAgent.push(str.default_meet_agent)

            }
            if (Previous === 'Detail') {

              var array = this.state.EventData.meet_agents.split(',');
              this.setState({ SelectedMeetAgent: array, EventDate: this.state.EventData.date, select_meetingType: this.state.EventData.meeting_type, EventName: this.state.EventData.event_name, Address: this.state.EventData.address, postalcode: this.state.EventData.postal_code, note: this.state.EventData.note, defaultReminder: this.state.EventData.reminder, AppointmentTime: this.state.EventData.time, endTime: this.state.EventData.end_time, EndDate: JSON.parse(this.state.EventData.repeat_event).end }, () => { })

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



  fetch_get_unread_notif_count = async () => {

    let value = this.context;
    console.log('yeyey fetch_get_unread_notif_count')

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_unread_notif_count');

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

          console.log('meheh',responseJson)

          if (str.error === 101) {

            AsyncStorage.removeItem('User_Detail');
            AsyncStorage.removeItem(Constant.api_token);
            this.setState({
              biggestWonDealDataState: false,
              recentNewDealDataState: false,
              userState: false,
              initialState: false,
            }, () => { this.props.navigation.navigate('SignUp') })

          }
          else {
            this.setState({ unread_Notification_count: str }, () => { value.updateBadge(this.state.unread_Notification_count) })
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

  // send the badge value to BadgeContext by using BadgeContext.consumer Component and value.updateBadgeMethod

  updateBadgeText = () => {
     return (
      <BadgeContext.Consumer>
        {
          value =>

            value.updateBadge(this.state.unread_Notification_count)

        }
      </BadgeContext.Consumer>
    );

  }


  // modify Keys For Various Dropdown like Reminder Data,Repeat Event Data and meeting type

  modifyKeyforDropDown = async () => {

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

    var EventReminderItem = this.state.EventReminderData

    EventReminderItem.map((cv) => {

      cv.value = cv.option_value;
      cv.label = cv.option_name;
      delete cv.option_value;
      delete cv.option_name;

    })

    var RepeatEventItem = this.state.RepeatEventData

    RepeatEventItem.map((cv) => {

      cv.value = cv.option_value;
      cv.label = cv.option_name;
      delete cv.option_value;
      delete cv.option_name;

    })


    this.setState({ endTime: moment(calendarDate).add(1, 'hours').format('hh:mm a'), meetingType: MeetingType, select_meetingType: MeetingType[0].value, EventReminderData: EventReminderItem, defaultReminder: EventReminderItem[5].value, RepeatEventData: RepeatEventItem, defaultRepeatEvent: RepeatEventItem[0].value, ConversationState: true }, () => { })

  }


  // Create Event By Calling Api Method create_cal_event

  createEvent = async () => {
    this.setState({
      isSaveClicked:true,
    })
    // const {isSaveClicked} = this.state;
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

    if (this.state.note === '' || this.state.EventName === '' || this.state.EventDate === '' || selectedMeetAgentsToItems === '' || this.state.AppointmentTime === '' || this.state.endTime === '' || this.state.Address === '' || this.state.postalcode === '') {
 console.log('AppointmentTime',this.state.AppointmentTime)
      if(this.state.EventName === '' && this.state.isSaveClicked){
        this.EventName.focus()
      } 
      else if(this.state.Address === ''){
        this.addressInput.focus()  
      }
      else if(this.state.postalcode == ''){
        this.postalCodeInput.focus() 
      }
      else if(this.state.note === ''){
        this.noteInput.focus();
      } 

      showMessage({
        message: "",
        description: "One of them field are not Filled",
        type: "danger",
      });
    }
    else {

      console.log('eeeeeeee')
      const isConnected = await NetworkUtils.isNetworkAvailable()

      if (isConnected) {

        formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
        formData.append('api_token', api_token);
        formData.append('method', 'create_cal_event');
        formData.append('company_id', this.state.company_id);
        formData.append('event_name', this.state.EventName);
        formData.append('date', this.state.EventDate);
        formData.append('time', this.state.AppointmentTime);
        formData.append('note', this.state.note);
        formData.append('meet_agent', selectedMeetAgentsToItems);
        formData.append('meeting_type', this.state.select_meetingType);
        formData.append('end_time', this.state.endTime);
        formData.append('address', this.state.Address);
        formData.append('postal_code', this.state.postalcode);
        formData.append('reminder', this.state.defaultReminder);


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

                showMessage({
                  message: "",
                  description: "Event Successfully Created",
                  type: "success",
                });
                this.fetch_get_unread_notif_count(); 
                this.props.navigation.goBack(null)

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
            this.setState({ isLoading: false, CompanyData: str.company_access }, () => {
              this.modifyCompanyAccessKey()
            },
            );
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

    const SelectedCompany = await AsyncStorage.getItem(Constant.selectedCompany);


    if (CompanyItem === undefined) {

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

        await AsyncStorage.setItem(Constant.selectedCompany, item[0].value).then(
          this.setState({ CompanyData: CompanyItem, select_company: CompanyItem[0].value, CompanyState: true }, () => { })

        )
      }
      else {

        await AsyncStorage.setItem(Constant.selectedCompany, SelectedCompany).then(
          this.setState({ CompanyData: CompanyItem, select_company: SelectedCompany, CompanyState: true }, () => { })
        )
      }

    }
  }

  // Save Selected meet Agent Value When Select the Agents for Appointment meeting 

  onSelectedAgentItemsChange = (selectedAgentsItems) => {

    this.setState({ SelectedMeetAgent: selectedAgentsItems });

  };

  // Toggle Switch Value Of Appointment Reminder Switch 

  toggleSwitchForRepeatEvent = (value) => {

    this.setState({ setRepeatEventTogglevalue: value }, () => {

      if (this.state.setRepeatEventTogglevalue === true) {
        this.setState({ RepeatEventBool: 'Repeat' })
      }
      else if (this.state.setRepeatEventTogglevalue === false) {
        this.setState({ RepeatEventBool: 'No Repeat' })
      }
    })
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

    this.setState({ calendarDate: calendarDate.format('YYYY-MM-DD') }, () => {
      var Year = calendarDate.year();
      var Month = calendarDate.month();

      this.setState({ month: monthNames[Month], year: Year, }, () => { this.setState({ EventDate: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day, EndDate: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day }) })

    });

  }

  // Get Day, month and year and set the Appointment Date from Calendar while swipe left or right  

  updateCalendarDate() {

    this.setState({ calendarDate: calendarDate.format('DD-MM-YYYY') }, () => {

      var Month = calendarDate.month();
      var Month1 = this.state.MonthIndex;

      this.setState({ month: monthNames[Month1 - 1] }, () => { this.setState({ EventDate: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day, EndDate: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day }) })

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
const {isSaveClicked} = this.state
    return (

      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag' enableResetScrollToCoords={false}>

        <ScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>

          <SafeAreaView>

            <View style={styles.Viewcontainer}>

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
                  value={this.state.company_id}
                  onChangeText={(value) => { this.setState({ company_id: value }) }}
                />

              </View>

              <Text style={[styles.text_style1]}>Event Name *</Text>

              <TextInput
                style={[textInput.gray_textInput, this.state.EventName === '' && isSaveClicked ? styles.errorBorder : '' ,{ color: '#222222', marginTop: 10, height: 46, fontSize: 16, fontWeight: '400', }]}
                onChangeText={(value) => this.setState({ EventName: value })}
                value={this.state.EventName}
                placeholderTextColor={Colors.black_color}
                ref={x => this.EventName = x}
                />

              <Text style={[styles.text_style1]}>Event Date:*</Text>

              <TouchableOpacity style={styles.followupdaterectangle}
                onPress={() => { this.setState({ CalendarOverlay: true }) }} >

                <Text style={[styles.followUp], { marginTop: 12, marginLeft: 16, width: widthPercentageToDP(79) }}>{this.state.EventDate}</Text>

                <Image source={require('../assets/images/calender1.png')} style={[styles.top_image_style, { tintColor: '#222222', marginEnd: 15, width: 22, height: 22, justifyContent: 'center' }]} resizeMode="contain" />

              </TouchableOpacity>

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

              <Text style={[styles.text_style1]}>Event Start Time:*</Text>

              <TouchableOpacity activeOpacity={1} style={[this.state.AppointmentTime === '' && isSaveClicked ? styles.errorBorder : '' ,styles.followTimeRectangle,]}
                onPress={() => { }} > 
                <DatePicker
                  style={[{
                    flex: 1, paddingLeft: 16, alignSelf: 'center'

                  }]}
                  date={this.state.AppointmentTime}
                  mode="time"
                  showIcon={true}
                  iconSource={require('../assets/images/down-arrow-slim.png')}
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
                  iconSource={require('../assets/images/down-arrow-slim.png')}
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
                  onDateChange={(time) => { this.setState({ endTime: time }) }}
                />

              </TouchableOpacity>

              <Text style={[styles.text_style1]}>Repeat Event</Text>

              <View style={{ marginTop: 10, marginBottom: 10 }}>

                <Switch
                  trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                  style={{ height: 20, width: 40, }}
                  onValueChange={(value) => this.toggleSwitchForRepeatEvent(value)}
                  value={this.state.setRepeatEventTogglevalue} />

              </View>

              {(this.state.setRepeatEventTogglevalue) ?

                <View>

                  <Text style={[styles.text_style1]}>Repeat Event Schedule:</Text>

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
                      data={(this.state.ConversationState) ? this.state.RepeatEventData : []}
                      value={this.state.defaultRepeatEvent}
                      onChangeText={(value) => { this.setState({ defaultRepeatEvent: value }) }}
                    />

                  </View>

                  <Text style={[styles.text_style1]}>End Repeat:</Text>

                  <TouchableOpacity style={styles.followupdaterectangle}
                    onPress={() => { this.setState({ CalendarOverlay: true }) }} >

                    <Text style={[styles.followUp], { marginTop: 12, marginLeft: 16, width: widthPercentageToDP(79) }}>{this.state.EndDate}</Text>

                    <Image source={require('../assets/images/calender1.png')} style={[styles.top_image_style, { tintColor: '#222222', marginEnd: 15, width: 22, height: 22, justifyContent: 'center' }]} resizeMode="contain" />

                  </TouchableOpacity>


                </View>
                :
                null
              }

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
                    chipRemoveIconComponent={ <Image source={require('../assets/images/close.png')}
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

              <Text style={[styles.text_style1]}>Address:*</Text>

              <TextInput
                style={[textInput.gray_textInput,this.state.Address === '' && isSaveClicked ? styles.errorBorder : '' , { color: '#222222', marginTop: 10, height: 46, fontSize: 16, fontWeight: '400', }]}
                onChangeText={(value) => this.setState({ Address: value })}
                value={this.state.Address}
                placeholderTextColor={Colors.black_color}
                ref={x => this.addressInput = x}

              />

              <Text style={[styles.text_style1]}>Postal Code:*</Text>

              <TextInput
                style={[textInput.gray_textInput, this.state.postalcode === '' && isSaveClicked ? styles.errorBorder : '' ,{ color: '#222222', marginTop: 10, height: 46, fontSize: 16, fontWeight: '400', }]}
                onChangeText={(value) => this.setState({ postalcode: value })}
                value={this.state.postalcode}
                placeholderTextColor={Colors.black_color}
                ref={x => this.postalCodeInput = x}

              />

              <Text style={[styles.text_style1]}>Event Reminder:</Text>

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
                  data={(this.state.ConversationState) ? this.state.EventReminderData : []}
                  value={this.state.defaultReminder}
                  onChangeText={(value) => { this.setState({ defaultReminder: value }) }}
                />

              </View>

              <Text style={[styles.text_style1]}>Note:</Text>

              <View style={[this.state.note === '' && isSaveClicked ? styles.errorBorder : '' , styles.followTimeRectangle1]}>

                <TextInput
                  style={[textInput.gray_textInput, { marginTop: 10, height: 100, textAlignVertical: 'top', marginBottom: 25, fontSize: 18 }]}
                  onChangeText={(value) => this.setState({ note: value })}
                  value={this.state.note}
                  placeholder="Enter Note"
                  multiline={true}
                  placeholderTextColor='#222222'
                  ref={x => this.noteInput = x} 
                />

              </View>

              <Modal animationType="fade" transparent={true} visible={this.state.CalendarOverlay}>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>

                  <View style={{ backgroundColor: '#f7f7f7', flexDirection: 'row' }}>

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
                      onVisibleMonthsChange={(months) => { this.setState({ MonthIndex: months[0].month, year: months[0].year }, () => { this.updateCalendarDate() }) }}
                      onDayPress={(date) => this.setState({ selected_Date: date.dateString, day: date.day, CalendarOverlay: false }, () => { this.updateCalendarDate() }
                      )}

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
    // borderColor: 'rgba(216, 219, 222, 0.5)',
    borderStyle: 'solid',
    // borderWidth: 2,
    backgroundColor: '#ecf0f2',

  },

  followTimeRectangle1: {

    marginTop: 10,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    // borderColor: 'rgba(216, 219, 222, 0.5)',
    borderStyle: 'solid',
    // borderWidth: 2,
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
    // borderColor: Colors.primaryColor,
    borderStyle: 'solid',
    // borderWidth: 2,
    backgroundColor: Colors.white_shade,

  },

  text_style1: {

    marginTop: 20,
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

  errorBorder: {

    borderWidth:2,
    borderColor:'red'

  },

})