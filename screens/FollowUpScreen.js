import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Switch,
  SafeAreaView,
  ImageBackground,
  FlatList,
  Alert,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView, Platform

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { textHeader, font_style, textInput } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant'
import Colors from '../constants/Colors';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Overlay } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { ActionSheet, ActionSheetItem } from 'react-native-action-sheet-component';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Calendar, LocaleConfig, CalendarList, calendarListParams, calendarParams, calendarTheme } from 'react-native-calendars';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { apiBasePath } from '../constantApi';
import FlashMessage, { showMessage } from "react-native-flash-message";
import FileViewer from "react-native-file-viewer";
import NetworkUtils from '../components/NetworkUtils';
import ImageResizer from 'react-native-image-resizer';



let calendarDate = moment();
let monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

//Define the Locale Configuration for Calendar 

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar', 'April', 'May', 'Jun', 'Jul.', 'Aug', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],

  dayNames: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri',],
  dayNamesShort: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri',],

};

// Define Default Locale Configuration for Calendar

LocaleConfig.defaultLocale = 'en';



export default class FollowUpScreen extends React.Component {

  // Display Header and it's Elements And functionallty of Header Elements

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.schedule_followup}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity style={[styles.top_layout1]} activeOpacity={1}
          onPress={() => { navigation.goBack(null) }} >

          <Image source={require('./../assets/images/arrow-left.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity style={[styles.top_layout1], { paddingTop: 10, flex: 0.6 }} activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }} >

          <Image source={require('./../assets/images/menu_3x.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,

    headerRight: () =>

      <TouchableOpacity style={styles.top_layout} activeOpacity={1}
        onPress={() => { navigation.getParam('createFollowup')(); }} >

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center', paddingTop: 10 }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,

  });

  // Initilise the State and Global Variable of this Page

  constructor() {
    super();
    this.state = {
      isvisible: false,
      CalendarOverlay: false,
      text: '',
      tags: '',
      note: '',
      calendarDate: '',
      selected_Date: '',
      day: '',
      month: '',
      year: '',
      isSave: false,
      isLoading: false,
      showBG: false,
      contact_Data: '',
      textInputs: [],
      contact_id: '',
      company_id: '',
      InitailStage: false,
      followupInitData: '',
      followupSyncToCalendar: 0,
      followupSyncToCalendarflag: false,
      AssignListData: '',
      ActionData: '',
      StageData: '',
      attachments: [],
      PotentialData: '',
      ConversationData: '',
      contactDataFromAsync: '',
      ClosedWonData: '',
      ClosedLostData: '',
      ClosedOpportunityData: '',
      selectedAssignItems: [],
      LastUserAsign: [],
      selectedAssignToItems: '',
      selectedClosedDealItems: [],
      selectedClosedOpportynityItems: [],
      selectedClosedLostItems: [],
      selectedClosedWonItems: [],
      closed_opportunity_deal_amount: '',
      ConversationState: false,
      displayDealAmount: false,
      select_conversation: '',
      dealAmount: '',
      select_Action: '',
      select_Stage: '',
      select_Potential: '',
      selectedItems: [],
      DefaultAgentDisplay: [],
      opportunityName: [],
      LoginUserDetail: '',
      timeFrom: '',
      dateFrom: '',

    }
  }

  // Get the Contact Data From Async Storage or navigation Params and then Get the Default data by calling api Method followup_init and set the default value in Followup Fields

  componentDidMount = async () => {
    this.setState({ isSave: false });
    
    const { navigation } = this.props
    navigation.setParams({ createFollowup: this.createFollowup });

    _this = this

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const User_Detail = await AsyncStorage.getItem('User_Detail')

      let PreviousScreen = this.props.navigation.getParam('Screen')
      let Contact_id = this.props.navigation.getParam('contactID')
      let Company_id = this.props.navigation.getParam('companyID')

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      this.setState({ LoginUserDetail: JSON.parse(User_Detail), day: calendarDate.date() + 1, contact_id: Contact_id, company_id: Company_id })

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'followup_init');
      formData.append('contact_id', this.state.contact_id);
      formData.append('company_id', this.state.company_id);
      console.warn("FollowUp Init...",formData);
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

            console.warn("JSON>>>",JSON.stringify({ str }))

            this.setState({ AssignListData: str.assign_to_list, dateFrom: str.general_settings.follow_up_date, timeFrom: str.general_settings.follow_up_time, followupInitData: str.general_settings, followupSyncToCalendar: str.general_settings.follow_up_sync_to_gcal, ActionData: str.action_options, StageData: str.stage_options, PotentialData: str.potential_options, ClosedWonData: str.closed_won_reason_options, ClosedLostData: str.closed_lost_reason_options, ClosedOpportunityData: str.opportunities, LastUserAsign: str.last_users_assigned }, () => { this.modifyKeyforDropDown() });

          }
        })
        .catch(error => {

          this.setState({}, () => { });

        }
        )
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }


  }

  // Get Conversion Data by Calling Api Method get_contact_conversations and then modify it's key by calling modifyConversationKey method

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
            this.props.navigation.navigate('SignUp')

          }
          else {

            this.setState({ ConversationData: str }, () => { this.modifyConversationKey() });

          }
        })
        .catch(error => {

          this.setState({});

        }
        )
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }

  // Modify the keys of conversation Data by changing id to value and name to label

  modifyConversationKey() {

    var item = this.state.ConversationData;
    item.map((val) => {

      val.value = val.id;

      if (val.category === 'product/service') {

        if (val.date_closed === null) {

          val.label = val.name;

        }
        else {

          val.label = val.name + ' ( ' + val.date_closed + ')'

        }
      }
      else {

        val.label = val.name

      }

      delete val.name
      delete val.id

    })

    this.setState({ ConversationData: item, select_conversation: item[0].value, ConversationState: true })
  }

  // modify Keys For Various Dropdown Data like Action Data,stage Data,potential Data, closed Won And Closed Lost Data

  modifyKeyforDropDown() {

    if (this.state.ActionData === null || this.state.ActionData === undefined || this.state.ActionData === 'null') {

    }
    else {

      var ActionArray = this.state.ActionData;
      var y = []
      var r = ActionArray.map((cv) => {
        var z = {}

        if (z.value === undefined) {
          z.value = cv
          y.push(z)
        }

        this.setState({ ActionData: y, select_Action: y[0].value })

      })
    }

    var AssignListData = this.state.AssignListData;
    let DefaultAssignUser;

    AssignListData.map((cv) => {

      if (cv.id === this.state.LoginUserDetail.id) {
        DefaultAssignUser = cv.id;
        // DefaultAssignUser = parseInt(DefaultAssignUser)
        this.state.selectedAssignItems.push(DefaultAssignUser)

      }
    })


    if (this.state.StageData === null || this.state.StageData === undefined || this.state.StageData === 'null') {

    }
    else {

      var StageArray = this.state.StageData;

      StageArray.map((val) => {

        val.label = val.value;
        val.value = val.id;

        delete val.id

      })

      this.setState({ StageData: StageArray, select_Stage: StageArray[0].value })

    }

    if (this.state.PotentialData === null || this.state.PotentialData === undefined || this.state.PotentialData === 'null') {

    }
    else {

      var PotentialArray = this.state.PotentialData;

      PotentialArray.map((val) => {

        val.label = val.value;
        val.value = val.id;

        delete val.id

      })
      this.setState({ PotentialData: PotentialArray, select_Potential: PotentialArray[0].value }, () => { })
    }

    if (this.state.ClosedWonData === null || this.state.ClosedWonData === undefined || this.state.ClosedWonData === 'null') {

    }
    else {

      var ClosedWonArray = []
      var ClosedWonItem = this.state.ClosedWonData

      ClosedWonItem.map((cv) => {
        var temp1 = {}

        if (temp1.name === undefined && temp1.id === undefined) {
          temp1.name = cv
          temp1.id = cv
          ClosedWonArray.push(temp1)
        }

      })
      this.setState({ ClosedWonData: ClosedWonArray }, () => { })

    }

    if (this.state.ClosedLostData === null || this.state.ClosedLostData === undefined || this.state.ClosedLostData === 'null') {

    }
    else {

      var ClosedLostArray = []
      var ClosedLostItem = this.state.ClosedLostData

      ClosedLostItem.map((cv) => {
        var temp2 = {}

        if (temp2.name === undefined && temp2.id === undefined) {
          temp2.name = cv
          temp2.id = cv
          ClosedLostArray.push(temp2)
        }

      })
      this.setState({ ClosedLostData: ClosedLostArray, InitailStage: true }, () => { this.getCoversation() })
    }

  }

  // Method for Create Followup Functionality in which call api method follow_up before calling Api Data is preprocess to make every value of keys supported to sample data

  createFollowup = async () => {

    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();
    var selectedAssignItems = this.state.selectedAssignItems
    var length = selectedAssignItems.length;

    let selectedAssignToItems = '';

    if (length > 0) {

      for (let i = 0; i < length; i++) {

        if (i === 0) {

          selectedAssignToItems = selectedAssignItems[i]

        }

        else {

          selectedAssignToItems = selectedAssignToItems + ',' + selectedAssignItems[i]

        }

      }
    }

    var selectedClosedWonItems = this.state.selectedClosedWonItems
    var length = selectedClosedWonItems.length;

    let selectedClosedWonToItems = '';

    if (length > 0) {

      for (let i = 0; i < length; i++) {

        if (i === 0) {

          selectedClosedWonToItems = selectedClosedWonItems[i]

        }

        else {

          selectedClosedWonToItems = selectedClosedWonToItems + ',' + selectedClosedWonItems[i]

        }

      }
    }

    var selectedClosedLostItems = this.state.selectedClosedLostItems
    var length = selectedClosedLostItems.length;

    let selectedClosedLostToItems = '';

    if (length > 0) {

      for (let i = 0; i < length; i++) {

        if (i === 0) {

          selectedClosedLostToItems = selectedClosedLostItems[i]

        }

        else {

          selectedClosedLostToItems = selectedClosedLostToItems + ',' + selectedClosedLostItems[i]

        }

      }
    }

    var selectedClosedLostOpportunity = this.state.selectedClosedDealItems
    var length = selectedClosedLostOpportunity.length;

    let selectedClosedLostOpportunitytoItem = '';

    if (length > 0) {

      for (let i = 0; i < length; i++) {

        if (i === 0) {

          selectedClosedLostOpportunitytoItem = selectedClosedLostOpportunity[i]

        }

        else {

          selectedClosedLostOpportunitytoItem = selectedClosedLostOpportunitytoItem + ',' + selectedClosedLostOpportunity[i]

        }

      }
    }

    var selectedClosedOpportunityItems = this.state.selectedClosedOpportynityItems
    var length = selectedClosedOpportunityItems.length;

    let selectedClosedOpportunityToItems = '';

    if (length > 0) {

      for (let i = 0; i < length; i++) {

        if (i === 0) {

          selectedClosedOpportunityToItems = selectedClosedOpportunityItems[i]

        }

        else {

          selectedClosedOpportunityToItems = selectedClosedOpportunityToItems + ',' + selectedClosedOpportunityItems[i]

        }

      }
    }

    if (this.state.select_Stage === '6029') {

      if (this.state.select_conversation === '' || this.state.dateFrom === '' || this.state.timeFrom === '' || selectedAssignToItems === '' || selectedClosedOpportunityToItems === '' || this.state.closed_opportunity_deal_amount === '') {

        showMessage({
          message: "",
          description: "conversation,Date,Time,Asign To and closed (Won) Reason, Closed Opportunity and Deal Amount must be filled",
          type: "danger",
        });

      }

      else {
        if (this.state.isSave == false) {

          this.setState({ isSave: true });
          console.warn("IS SAVE BTN..", this.state.isSave);

          this.setState({ isLoading: true })

          const isConnected = await NetworkUtils.isNetworkAvailable()

          if (isConnected) {

            formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
            formData.append('api_token', api_token);
            formData.append('method', 'follow_up');
            formData.append('contact_id', this.state.contact_id);
            formData.append('company_id', this.state.company_id);
            formData.append('conversation', this.state.select_conversation);
            formData.append('date', this.state.dateFrom);
            formData.append('time', this.state.timeFrom);
            formData.append('note', this.state.note);
            formData.append('action', this.state.select_Action);
            formData.append('stage', this.state.select_Stage);
            formData.append('potential', this.state.select_Potential);
            formData.append('assign_to', selectedAssignToItems);
            formData.append('closed_lost_reason', selectedClosedLostToItems);
            formData.append('closed_won_reason', selectedClosedWonToItems);
            formData.append('closed_opportunities', selectedClosedOpportunityToItems);
            formData.append('deal_amount', JSON.stringify(this.state.closed_opportunity_deal_amount));
            formData.append('sync_to_calendar', this.state.followupSyncToCalendar);


            let file_attachments = this.state.attachments;
            let files_len = file_attachments.length;

            if (files_len > 0) {

              for (let i = 0; i < files_len; i++) {

                formData.append('attachments[]', file_attachments[i]);

              }

            }
            console.warn("Form FollowUP", formData);
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

                if (str.error == 101) {

                  AsyncStorage.removeItem(Constant.api_token);
                  this.props.navigation.navigate('SignUp');

                }
                else if (str.status === true) {

                  showMessage({
                    message: "",
                    description: "Followup successfully Created",
                    type: "success",
                  });


                  this.setState({ isLoading: false }, () => { this.props.navigation.goBack(null) });

                }


              })
              .catch(error => {

                this.setState({ isLoading: false });
              }
              )
          }
          else {

            this.setState({ isLoading: false }, () => {
              alert('Check Your Internet Connection and Try Again')
            });

          }
        }
        else {
          console.log("Button Click 2 times...");
        }
      }


    }
    else if (this.state.select_Stage === '6030') {

      if (this.state.select_conversation === '' || this.state.dateFrom === '' || this.state.timeFrom === '' || selectedAssignToItems === '' || selectedClosedLostOpportunitytoItem === '') {

        showMessage({
          message: "",
          description: 'conversation,Date,Time,Asign To and closed (Lost) Reason and Closed Opportunity must be filled',
          type: "danger",
        });

      }
      else {
        if (this.state.isSave == false) {

          this.setState({ isSave: true });
          console.warn("IS SAVE BTN..", this.state.isSave);
          this.setState({ isLoading: true })

          const isConnected = await NetworkUtils.isNetworkAvailable()

          if (isConnected) {

            formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
            formData.append('api_token', api_token);
            formData.append('method', 'follow_up');
            formData.append('contact_id', this.state.contact_id);
            formData.append('company_id', this.state.company_id);
            formData.append('conversation', this.state.select_conversation);
            formData.append('date', this.state.dateFrom);
            formData.append('time', this.state.timeFrom);
            formData.append('note', this.state.note);
            formData.append('action', this.state.select_Action);
            formData.append('stage', this.state.select_Stage);
            formData.append('potential', this.state.select_Potential);
            formData.append('assign_to', selectedAssignToItems);
            formData.append('closed_lost_reason', selectedClosedLostToItems);
            formData.append('closed_won_reason', selectedClosedWonToItems);
            formData.append('closed_opportunities', selectedClosedLostOpportunitytoItem);
            formData.append('sync_to_calendar', this.state.followupSyncToCalendar);


            let file_attachments = this.state.attachments;
            let files_len = file_attachments.length;

            if (files_len > 0) {

              for (let i = 0; i < files_len; i++) {

                formData.append('attachments[]', file_attachments[i]);

              }
            }

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

                if (str.error == 101) {

                  AsyncStorage.removeItem(Constant.api_token);
                  this.props.navigation.navigate('SignUp');
                }
                else if (str.status === true) {

                  showMessage({
                    message: "",
                    description: "Followup successfully Created",
                    type: "success",
                  });

                  this.setState({ isLoading: false }, () => { this.props.navigation.goBack(null) });
                }

              })
              .catch(error => {

                this.setState({ isLoading: false });

              }
              )
          }
          else {

            this.setState({ isLoading: false }, () => { alert('Check Your Internet Connection and Try Again') });

          }
        }
        else {
          console.log("Button Click 2 times...");
        }

      }

    }
    else {

      if (this.state.select_conversation === '' || this.state.dateFrom === '' || this.state.timeFrom === '' || selectedAssignToItems === '') {

        showMessage({
          message: "",
          description: "conversation,Date,Time and Asign To must be filled",
          type: "danger",
        });

      }

      else {
        if (this.state.isSave == false) {

          this.setState({ isSave: true });
          console.warn("IS SAVE BTN..", this.state.isSave);
        this.setState({ isLoading: true })

        const isConnected = await NetworkUtils.isNetworkAvailable()

        if (isConnected) {

          formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
          formData.append('api_token', api_token);
          formData.append('method', 'follow_up');
          formData.append('contact_id', this.state.contact_id);
          formData.append('company_id', this.state.company_id);
          formData.append('conversation', this.state.select_conversation);
          formData.append('date', this.state.dateFrom);
          formData.append('time', this.state.timeFrom);
          formData.append('note', this.state.note);
          formData.append('action', this.state.select_Action);
          formData.append('stage', this.state.select_Stage);
          formData.append('potential', this.state.select_Potential);
          formData.append('assign_to', selectedAssignToItems);
          formData.append('sync_to_calendar', this.state.followupSyncToCalendar);

          let file_attachments = this.state.attachments;
          let files_len = file_attachments.length;

          if (files_len > 0) {

            for (let i = 0; i < files_len; i++) {

              formData.append('attachments[]', file_attachments[i]);

            }
          }

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

              if (str.error == 101) {

                AsyncStorage.removeItem(Constant.api_token);
                this.props.navigation.navigate('SignUp');

              }
              else if (str.status === true) {

                showMessage({
                  message: "",
                  description: "Followup successfully Created",
                  type: "success",
                });

                this.setState({ isLoading: false }, () => { this.props.navigation.goBack(null) });

              }

            })
            .catch(error => {

              this.setState({ isLoading: false });

            }
            )
        }
        else {

          this.setState({ isLoading: false }, () => { alert('Check Your Internet Connection and Try Again') });

        }
      }
      else {
        console.log("Button Click 2 times...");
      }

      }

    }
  }

  // Toggle Visibility of Update App Notification Prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  // For Show Bottom ActionSheet to choose options for attachments

  showBottomActionSheet = () => {

    this.bottomActionSheet.show();

  }

  // For Hide Bottom ActionSheet to choose options for attachments

  hideBottomActionSheet = () => {

    this.bottomActionSheet.hide();

  }

  // For Toggle Value of followupSyncToCalendar switch

  toggleSwitch = (value) => {

    this.setState({ followupSyncToCalendarflag: value }, () => {

      if (this.state.followupSyncToCalendarflag === true) {
        this.setState({ followupSyncToCalendar: 1 })
      }
      else if (this.state.followupSyncToCalendarflag === false) {
        this.setState({ followupSyncToCalendar: 0 })
      }
    })

  }

  // Method for choosing the options for pick Document and hide ActionSheet Modal

  optionClick(index) {

    switch (index) {

      case 0:
        this.launchImageLibrary()
        break;

      case 1:
        this.launchCamera()
        break;

      case 2:
        this.pickDocument()
        break;

      case 3:
        this.hideBottomActionSheet()
        break;

    }

  }

  // Method for launching Camera for click the image and save the Image and then save it to attachment state

  launchCamera = () => {

    let tempArray = this.state.attachments
    let cameraImage;

    ImagePicker.openCamera({
      width: 1920,
      height: 1080,
      multiple: true,
      maxFiles: 10,
    }).then(image => {

      if (Platform.OS === 'ios') {
        CameraRoll.saveImageWithTag(image.path).then().catch();
      }

      let cameraImage =
      {
        uri: image.path,
        type: image.mime,
        name: Platform.OS === "android" ? image.path.substring(image.path.length - 10, image.path.length) : image.path.substring(image.path.length - 10, image.path.length)

      }

      tempArray.push(cameraImage)

      this.setState({
        attachments: tempArray
      }, () => { });

    });



  }

  // Method for launching Image gallery for Pick the single/multiple image and save the Images and then save it to attachment state

  launchImageLibrary = async () => {

    if (Platform.OS === 'android') {

      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images]
        });
        let tempArray = []
        let regexAll = /[^\\]*\.(\w+)$/;
        for (const res of results) {

          ImageResizer.createResizedImage(res.uri, 1000, 1000, 'JPEG', 20)
            .then(response => {
              let image =
              {
                uri: response.uri,
                type: (res.type === null || res.type === '' || res.type === 'null') ? res.uri.match(regexAll)[1] : res.type,
                name: res.name,
                size: res.size
              }
              tempArray.push(image)
              this.setState({ attachments: tempArray }, () => {
                ImagePicker.clean().then(() => {
                }).catch(e => {
                  // alert(e);
                });
              })
            })
            .catch(err => {
              // Oops, something went wrong. Check that the filename is correct and
              // inspect err to get more details.
            });

          // let document =
          // {

          //   uri: res.uri,
          //   type: (res.type === null || res.type === '' || res.type === 'null') ? res.uri.match(regexAll)[1] : res.type,
          //   name: res.name,
          //   size: res.size

          // }

          // tempArray.push(document)

          // this.setState({
          //   attachments: tempArray
          // }, () => { })

        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }

    }

    else {

      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 10,
      })
        .then(response => {
          let tempArray = []
          response.forEach((item) => {
            ImageResizer.createResizedImage(item.path, item.height, item.width, 'JPEG', 20)
              .then(response => {
                console.log('ahahah', response)
                let image =
                {
                  uri: response.path,
                  type: item.mime,
                  name: item.filename
                }
                tempArray.push(image)
                this.setState({ attachments: tempArray }, () => {
                  ImagePicker.clean().then(() => {
                  }).catch(e => {
                    // alert(e);
                  });
                })
              })
              .catch(err => {
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
          })
        });

    }

  }

  // Method for launching Document Picker for selecting the single/multiple files and save the files and then save it to attachment state

  async pickDocument() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles]
      });
      let tempArray = []
      let regexAll = /[^\\]*\.(\w+)$/;
      for (const res of results) {

        let document =
        {

          uri: res.uri,
          type: (res.type === null || res.type === '' || res.type === 'null') ? res.uri.match(regexAll)[1] : res.type,
          name: res.name,
          size: res.size

        }

        tempArray.push(document)

        this.setState({
          attachments: tempArray
        }, () => { })

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

  }


  // Save Current Date to Default Date for Followup Api method

  _StartDate = (date) => {

    this.setState({ dateFrom: date })

  }

  // Save Current Time to Default Time for Followup Api method

  _StartTime = (time) => {

    this.setState({ timeFrom: time })

  }

  // Save Selected Assign Followup Agent Items To state variable from it's searchable multiselect field

  onAssignSelectedItemsChange = (selectedAssignItems) => {

    this.setState({ selectedAssignItems: selectedAssignItems });

  };

  // Save Selected Closed won Item To state variable from it's searchable multiselect field

  onClosedWonSelectedItemsChange = (selectedClosedWonItems) => {

    this.setState({ selectedClosedWonItems: selectedClosedWonItems });

  };

  // Save Selected Closed Lost Item To state variable from it's searchable multiselect field

  onClosedLostSelectedItemsChange = (selectedClosedLostItems) => {

    this.setState({ selectedClosedLostItems: selectedClosedLostItems });

  };

  // Save Selected Closed Won Opportunity Item To state variable from it's searchable multiselect field when stage is closed won

  onClosedOpportunitySelectedItemsChange = (selectedClosedOpportynityItems) => {

    this.setState({ selectedClosedOpportynityItems: selectedClosedOpportynityItems, }, () => { this.mapIdToNameforWon() });

  };

  // Save Selected Closed Lost Opportunity Item To state variable from it's searchable multiselect field when stage is closed Lost

  onClosedDealSelectedItemsChange = (selectedClosedDealItems) => {

    this.setState({ selectedClosedDealItems: selectedClosedDealItems }, () => { });

  };

  // Display the selected closed won Opportunity Name and its respective Input field for Deal Amount

  displayDealAmount = (item, index) => {

    return (

      <View>

        <Text style={[styles.followUp]}>{item.item.name}</Text>

        <TextInput
          style={[textInput.gray_textInput, {
            marginTop: 4, height: 42, fontSize: 18, color: '#222222',
            fontFamily: 'Helvetica Neue', fontWeight: '400'
          }]}
          onChangeText={(text) => { this.changeText(item.item.id, text) }}
          placeholder=""
          placeholderTextColor={Colors.black_color}
          keyboardType='numeric'
        />

      </View>
    )

  }

  // Method for get the Input value From Selected Closed won Opportynity Name Input field and create the closed_opportunity_deal_amount for followup api Method when stage is Closed ( Won )

  changeText = (id, text) => {

    const { opportunityName } = this.state;
    var tempArr = opportunityName;

    for (var i = 0; i < tempArr.length; i++) {

      if (tempArr[i].id == id) {

        tempArr[i]["value"] = text

      }
    }

    var LastObject = {};
    var b = {};

    for (var i = 0; i < tempArr.length; i++) {

      if (typeof tempArr[i]["value"] !== 'undefined') {

        b[tempArr[i].id] = parseInt(tempArr[i].value)
        LastObject = b

      }

      else {

      }

    }

    this.setState({ closed_opportunity_deal_amount: LastObject }, () => { })
  }

  openAttachment = async (item) => {

    try {

      await FileViewer.open(item.uri, { showOpenWithDialog: true });
    }
    catch (e) {

      console.log(e)

    }

  }

  // Display the thumbnail of Images which is pick by gallery and camera

  renderThumbnail = ({ item, index }) => {

    return (

      <View style={{ flexDirection: 'row' }}>

        <View style={{ width: 90, height: 90, backgroundColor: '#fff', marginTop: 10 }}>

          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              this.openAttachment(item)
            }}
          >

            <Image style={{ width: 80, height: 80, }} source={item} resizeMode='contain' />
            {/* <Image style={{ width: 80, height: 80, }} source={require('../assets/images/file_icon.webp')} resizeMode='contain' /> */}

          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', top: 1, left: 70, width: 45, height: 45 }}
            onPress={() => {
              var a = []
              if (this.state.attachments.length == 0 || this.state.attachments == undefined) {

              } else {

                a = this.state.attachments;

                a.splice(index, 1);
                this.setState({ attachments: a }, () => { })
              }

            }}
          >

            <Image style={{ width: 20, height: 20, }} source={require('../assets/images/closeAttachment.png')} resizeMode='contain' />

          </TouchableOpacity>

        </View>

      </View>

    );

  }


  // Method for Map Selected Opportunity id To its Respective Name from Original Closed Opportunity Data

  mapIdToNameforWon() {

    var Item = this.state.ClosedOpportunityData

    var selectedItem = this.state.selectedClosedOpportynityItems

    let tempArray = [];

    Item.map((x) => {
      selectedItem.map((arr) => {
        if (x.id == arr) {
          tempArray.push({ 'name': x.name, 'id': x.id })
        }
      })
    })

    this.setState({ opportunityName: tempArray, displayDealAmount: true }, () => { })

  }

  // Set Visibility of Disable the Calendar Modal

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

      this.setState({ month: monthNames[Month], year: Year, }, () => { this.setState({ dateFrom: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day }) })

    });

  }

  // Get Day, month and year and set the Appointment Date from Calendar while swipe left or right  

  updateCalendarDate() {


    this.setState({ calendarDate: calendarDate.format('DD-MM-YYYY') }, () => {

      var Month = calendarDate.month();
      var Month1 = this.state.MonthIndex;

      this.setState({ month: monthNames[Month1 - 1] }, () => { this.setState({ dateFrom: this.state.year + '-' + (monthNames.indexOf(this.state.month) + 1) + '-' + this.state.day }) })

    });
  }

  // Display Loading Icon While Followup Is created

  renderFooterNote = () => {

    if (!this.state.isLoading) return null;
    else {
      return (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#000000',
            opacity: 0.2,
          }}
        >

          <ActivityIndicator animating size='large' />

        </View>
      );
    }

  }

  render() {

    var optionArray = [
      'Choose from Photos',
      'Take Photo from Camera',
      'Browse Documents',
      'Cancel',
    ];

    return (

      <KeyboardAvoidingView style={{ backgroundColor: '#ffffff', flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={10}>

        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps='handled'
          //  keyboardDismissMode='on-drag'
          style={{ backgroundColor: '#ffffff' }}
          bounces={false}
          enableResetScrollToCoords={false}

          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.Viewcontainer}
        >

          <View style={styles.main_container}>

            {/* <ScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag' style={styles.container}> */}

            <SafeAreaView>

              <View style={{ padding: 16 }}>

                <Text style={[styles.followUp]}>Conversation</Text>

                <View activeOpacity={1} style={styles.followTimeRectangle3, { flexDirection: 'row', marginTop: 10 }}>

                  <ImageBackground source={require('../assets/images/Rectangle_14.png')} style={{ width: '102%', height: '100%', marginLeft: -8 }} resizeMode='cover'>

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style1, { tintColor: Colors.white_color, zIndex: 999, }]} resizeMode="contain" />

                    </View>

                    <Dropdown
                      containerStyle={styles.dropdown_container}
                      pickerStyle={{
                        width: '92%', marginLeft: -10, marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                        shadowOffset: { width: 2, height: -4 },
                        shadowRadius: 21,
                        borderRadius: 46 / 2,
                        backgroundColor: '#ffffff',
                      }}
                      inputContainerStyle={{
                        marginLeft: -10,
                        borderBottomColor: 'transparent',
                        justifyContent: 'center',
                      }}
                      selectedItemColor='#222222'
                      textColor={Colors.white_color}
                      itemColor='#222222'
                      baseColor='#ffffff00'
                      dropdownPosition={0}
                      itemCount={5}
                      dropdownOffset={{ top: 7, bottom: -10, left: 0 }}
                      dropdownMargins={{ min: 0, max: 0 }}
                      data={(this.state.ConversationState) ? this.state.ConversationData : []}
                      value={this.state.select_conversation}
                      onChangeText={(value) => { this.setState({ select_conversation: value }) }}
                    />

                  </ImageBackground>

                </View>

                <Text style={[styles.followUp]}>Follow-up Action:</Text>

                <View activeOpacity={1} style={styles.followTimeRectangle3, { flexDirection: 'row', marginTop: 10 }}>

                  <ImageBackground source={require('../assets/images/Rectangle_14.png')} style={{ width: '102%', height: '100%', marginLeft: -8 }} resizeMode='cover'>

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style1, { tintColor: Colors.white_color, zIndex: 999, }]} resizeMode="contain" />

                    </View>

                    <Dropdown
                      containerStyle={styles.dropdown_container}
                      pickerStyle={{
                        width: '92%', marginLeft: -12, marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                        shadowOffset: { width: 2, height: -4 },
                        shadowRadius: 21,
                        borderRadius: 46 / 2,
                        backgroundColor: '#ffffff',
                      }}
                      inputContainerStyle={{
                        marginLeft: -10,
                        borderBottomColor: 'transparent',
                        justifyContent: 'center',
                      }}
                      selectedItemColor='#222222'
                      textColor={Colors.white_color}
                      itemColor='#222222'
                      baseColor='#ffffff00'
                      dropdownPosition={0}
                      itemCount={5}
                      dropdownOffset={{ top: 7, bottom: -10, left: 0 }}
                      dropdownMargins={{ min: 0, max: 0 }}
                      data={(this.state.InitailStage) ? this.state.ActionData : []}
                      value={this.state.select_Action}
                      onChangeText={(value) => { this.setState({ select_Action: value }) }}
                    />

                  </ImageBackground>

                </View>

                <Text style={[styles.followUp]}>Follow-up Date:</Text>

                <TouchableOpacity style={styles.followupdaterectangle}
                  onPress={() => { this.setState({ CalendarOverlay: true }) }}  >

                  <Text style={[styles.followUp], { marginTop: 12, marginLeft: 16, width: widthPercentageToDP(78) }}>{this.state.dateFrom}</Text>

                  <Image source={require('../assets/images/calender1.png')} style={[styles.top_image_style, { position: "absolute", right: 5, tintColor: '#222222', marginEnd: 15, width: 22, height: 22 }]} resizeMode="contain" />

                </TouchableOpacity>

                <Text style={[styles.followUp]}>Follow-up Time:</Text>

                <TouchableOpacity activeOpacity={1} style={[styles.followTimeRectangle]}
                  onPress={() => { }} >

                  <DatePicker
                    style={[{
                      flex: 1, paddingLeft: 16, alignSelf: 'center'

                    }]}
                    date={this.state.timeFrom}
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
                        tintColor: '#000',
                        borderColor: 'transparent'
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
                    onDateChange={(time) => { this.setState({ timeFrom: time }) }}
                  />

                </TouchableOpacity>

                <Text style={[styles.followUp]}>Assign Follow-up To:</Text>

                <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, }}>

                  <SectionedMultiSelect
                    ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
                    items={(this.state.InitailStage) ? this.state.AssignListData : []}
                    uniqueKey="id"
                    selectText="Assign Follow Up List"
                    searchPlaceholderText='Assign Follow Up List'
                    selectedText=''
                    hideSelect={false}
                    selectChildren={false}
                    showDropDowns={false}
                    readOnlyHeadings={false}
                    expandDropDowns={true}
                    animateDropDowns={true}
                    chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                      style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                    modalWithSafeAreaView={false}
                    styles={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 21 }}
                    onSelectedItemsChange={this.onAssignSelectedItemsChange}
                    selectedItems={(this.state.InitailStage) ? this.state.selectedAssignItems : []}
                    parentChipsRemoveChildren={false}
                    chipsPosition='top'
                    chipColor={Colors.primaryColor}
                    chipContainer={{ borderColor: '#222222' }}
                  />

                </View>

                <Text style={[styles.followUp]}>Stage:</Text>



                <View activeOpacity={1} style={[styles.dropdown_view1, { marginTop: 10 }]}>

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
                      marginLeft: -16,
                      borderBottomColor: 'transparent',
                      justifyContent: 'center',
                    }}
                    textColor='#222222'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    selectedItemColor='#222222'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 7, bottom: -10, left: -20 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.InitailStage) ? this.state.StageData : []}
                    value={this.state.select_Stage}
                    onChangeText={(value) => { this.setState({ select_Stage: value }) }}
                  />

                </View>

                {(this.state.select_Stage === '6029') ?

                  <View>

                    <Text style={[styles.followUp]}>Closed (Won) Reason:</Text>

                    <View style={{ marginTop: 5, borderRadius: 60 / 2, backgroundColor: Colors.white_shade, }}>

                      <SectionedMultiSelect
                        items={(this.state.InitailStage) ? this.state.ClosedWonData : []}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Select Closed (Won) reason"
                        searchPlaceholderText='Select Closed (Won) reason'
                        selectedText=''
                        hideSelect={false}
                        showDropDowns={true}
                        readOnlyHeadings={false}
                        expandDropDowns={false}
                        animateDropDowns={true}
                        chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                          style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                        modalWithSafeAreaView={false}
                        styles={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 21 }}
                        onSelectedItemsChange={this.onClosedWonSelectedItemsChange}
                        selectedItems={this.state.selectedClosedWonItems}
                        parentChipsRemoveChildren={false}
                        chipsPosition='top'
                        chipColor={Colors.primaryColor}
                        chipContainer={{ borderColor: '#222222' }}
                      />

                    </View>

                    <Text style={[styles.followUp]}>Closed Opportunity:</Text>

                    <View style={{ marginTop: 5, borderRadius: 60 / 2, backgroundColor: Colors.white_shade, }}>

                      <SectionedMultiSelect
                        items={(this.state.InitailStage) ? this.state.ClosedOpportunityData : []}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Select Closed Opportunity"
                        searchPlaceholderText='Select Closed Opportunity '
                        selectedText=''
                        hideSelect={false}
                        showDropDowns={true}
                        readOnlyHeadings={false}
                        expandDropDowns={false}
                        animateDropDowns={true}
                        chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                          style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                        modalWithSafeAreaView={false}
                        styles={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 21 }}
                        onSelectedItemsChange={this.onClosedOpportunitySelectedItemsChange}
                        selectedItems={this.state.selectedClosedOpportynityItems}
                        parentChipsRemoveChildren={false}
                        chipsPosition='top'
                        chipColor={Colors.primaryColor}
                        chipContainer={{ borderColor: '#222222' }}
                      />

                    </View>

                  </View>
                  :
                  null
                }

                {(this.state.displayDealAmount) ?

                  <View>

                    <FlatList
                      data={this.state.opportunityName}
                      extraData={this.state}
                      renderItem={this.displayDealAmount}
                    />

                  </View>

                  :
                  null
                }

                {(this.state.select_Stage === '6030') ?

                  <View>

                    <Text style={[styles.followUp]}>Closed (Lost) Reason:</Text>

                    <View style={{ marginTop: 5, borderRadius: 60 / 2, backgroundColor: Colors.white_shade, }}>

                      <SectionedMultiSelect
                        items={(this.state.InitailStage) ? this.state.ClosedLostData : []}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Select Closed (Lost) Reason"
                        searchPlaceholderText='Select Closed (Lost) Reason '
                        selectedText=''
                        hideSelect={false}
                        showDropDowns={false}
                        readOnlyHeadings={false}
                        expandDropDowns={false}
                        animateDropDowns={true}
                        modalWithSafeAreaView={false}
                        chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                          style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                        styles={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 21 }}
                        onSelectedItemsChange={this.onClosedLostSelectedItemsChange}
                        selectedItems={this.state.selectedClosedLostItems}
                        parentChipsRemoveChildren={false}
                        chipsPosition='top'
                        chipColor={Colors.primaryColor}
                        chipContainer={{ borderColor: '#222222' }}
                      />

                    </View>

                    <Text style={[styles.followUp]}>Closed Opportunity:</Text>

                    <View style={{ marginTop: 5, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                      <SectionedMultiSelect
                        items={(this.state.InitailStage) ? this.state.ClosedOpportunityData : []}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Select Closed Opporrtunity"
                        searchPlaceholderText='Select Closed Opportunity '
                        selectedText=''
                        hideSelect={false}
                        showDropDowns={true}
                        readOnlyHeadings={false}
                        expandDropDowns={false}
                        animateDropDowns={true}
                        modalWithSafeAreaView={false}
                        chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                          style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                        styles={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 21 }}
                        onSelectedItemsChange={this.onClosedDealSelectedItemsChange}
                        selectedItems={this.state.selectedClosedDealItems}
                        parentChipsRemoveChildren={false}
                        chipsPosition='top'
                        chipColor={Colors.primaryColor}
                        chipContainer={{ borderColor: '#222222' }}
                      />

                    </View>
                  </View>
                  :
                  null
                }

                {(this.state.select_Stage === '6030') ?

                  null

                  :

                  <View>

                    <Text style={[styles.followUp]}>Potential:</Text>

                    <View activeOpacity={1} style={[styles.dropdown_view1, { marginTop: 10 }]}>

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
                          marginLeft: -16,
                          borderBottomColor: 'transparent',
                          justifyContent: 'center',
                        }}
                        textColor='#222222'
                        itemColor='#222222'
                        baseColor='#ffffff00'
                        selectedItemColor='#222222'
                        dropdownPosition={0}
                        itemCount={5}
                        dropdownOffset={{ top: 7, bottom: -10, left: -20 }}
                        dropdownMargins={{ min: 0, max: 0 }}
                        data={(this.state.InitailStage) ? this.state.PotentialData : []}
                        value={this.state.select_Potential}
                        onChangeText={(value) => { this.setState({ select_Potential: value }) }}
                      />

                    </View>

                  </View>

                }

                <Text style={[styles.followUp]}>Sync Follow-up Calender:</Text>

                <View style={{ height: 46, marginTop: 10 }}>

                  <Switch

                    trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                    style={{ marginTop: 4, height: 24, width: 40, }}
                    onValueChange={(value) => this.toggleSwitch(value)}
                    value={this.state.followupSyncToCalendarflag} />

                </View>

                {(this.state.select_Stage === '6030') ?

                  null
                  :

                  <View>

                    <Text style={[styles.followUp]}>Note:</Text>

                    <View style={styles.followTimeRectangle1}>

                      <TextInput
                        style={[
                          {
                            width: '100%', borderRadius: 46 / 2, paddingStart: 20,
                            marginTop: 10, backgroundColor: Colors.white_shade,
                            fontFamily: 'Helvetica Neue', color: '#222222', textAlignVertical: 'top',
                            marginBottom: 25, fontSize: 18,
                          }]}
                        onChangeText={(value) => this.setState({ note: value })}
                        value={this.state.note}
                        placeholder="Enter Note"
                        multiline={true}
                        placeholderTextColor='#222222'
                        numberOfLines={5}
                        scrollEnabled={false}
                      />

                    </View>

                  </View>
                }

                <Text style={[styles.followUp]}>Attachments:</Text>

                <Button
                  onPress={this.showBottomActionSheet}
                  buttonStyle={styles.add_attach_btn}
                  title='Add Attachements'
                  icon={

                    <Image source={require('../assets/images/link1.png')} style={styles.add_attach_image_style} resizeMode="contain" />

                  }
                  titleStyle={styles.titlestyle}
                  ViewComponent={LinearGradient} // Don't forget this!
                  linearGradientProps={{

                    colors: ['#35e7bd', '#17d2a7'],
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 },

                  }}
                />

                <FlatList

                  data={this.state.attachments}
                  extraData={this.state}
                  renderItem={this.renderThumbnail}
                  numColumns={4}


                />



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

              {this.renderFooterNote()}

            </SafeAreaView>

            {/* </ScrollView> */}

          </View>

          <Modal animationType="fade" transparent={true} visible={this.state.CalendarOverlay}>


            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={{ height: '40%', width: '100%', borderWidth: 0, borderColor: 'green', zIndex: 111, backgroundColor: '#000', opacity: 0.4 }}>
                <TouchableOpacity onPress={() => this.setModalVisible(false)} style={{ height: '100%', borderWidth: 0, borderColor: 'yellow' }}></TouchableOpacity>
              </View>
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

        </KeyboardAwareScrollView>
        <ActionSheet
          ref={(actionSheet) => { this.bottomActionSheet = actionSheet; }}
          position="bottom"
          onChange={this.onChange}
          overlayOpacity={0.2}
          show={this.state.showBG}
          style={{ width: '50%', borderRadius: 20, marginRight: 16, paddingStart: 16, paddingEnd: 16 }}
          showSelectedIcon={false}
        >

          <ActionSheetItem
            text="Choose from Photos"
            value="Choose from Photos"
            style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
            icon={

              <FontAwesome name='image' size={20} style={{ marginEnd: 10 }} />

            }
            onPress={() => { this.optionClick(0); }}
          />

          <ActionSheetItem
            text="Take Photo from Camera"
            value="Take Photo from Camera"
            style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
            icon={

              <FontAwesome name='camera' size={20} style={{ marginEnd: 10 }} />

            }
            onPress={() => { this.optionClick(1); }}
          />

          <ActionSheetItem
            text="Browse Documents"
            value="Browse Documents"
            style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
            icon={

              <FontAwesome name='file' size={20} style={{ marginEnd: 10 }} />

            }
            onPress={() => { this.optionClick(2); }}
          />

          <ActionSheetItem
            text="Cancel"
            value="Cancel"
            style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
            icon={

              <FontAwesome name='close' size={20} style={{ marginEnd: 10 }} />

            }
            onPress={() => { this.setState({ showBG: false }, () => { this.optionClick(3); }) }}
          />

        </ActionSheet>

      </KeyboardAvoidingView>
    );
  }

}

// Styling Code for UI elements of this Page

const styles = StyleSheet.create({

  top_layout: {

    height: 46,
    paddingRight: 20,
    paddingLeft: 20,

  },
  Viewcontainer: {

    // flex: 1,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: Colors.white_color,
    // borderWidth: 4,
    // borderColor: 'pink',
    // marginBottom: 20,

  },
  top_layout1: {

    paddingTop: 10,
    height: 46,
    paddingRight: 20,
    paddingLeft: 20,

  },

  Calendar_header_button: {

    paddingTop: 14,
    height: 46,
    paddingRight: 20,
    paddingLeft: 20,

  },

  container: {

    flex: 1,
    backgroundColor: Colors.white_color,

  },

  main_container: {

    flex: 1,
    backgroundColor: Colors.white_color,


  },

  top_view_btn: {

    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    height: 46,
    borderRadius: 46 / 2,
    justifyContent: 'center',
    paddingStart: 16, paddingEnd: 16

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

  follow_btn: {

    marginTop: 10,
    flexDirection: 'row',
    height: 46,
    borderRadius: 46 / 2,
    justifyContent: 'center',
    paddingStart: 16, paddingEnd: 16

  },

  top_view_txt: {

    flex: 1,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
    alignSelf: 'center'

  },

  top_view_txt1: {

    flex: 1,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 15,
    alignSelf: 'center'

  },

  dropdown_container: {

    width: '100%',
    height: 46,
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 16,
    marginEnd: -40

  },

  dropdown_container1: {

    width: '100%',
    height: 46,
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 16,
    marginEnd: -10,

  },

  dropdown_view: {

    flex: 1,
    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: 46 / 2, paddingEnd: 16,
    marginTop: 8,
    marginBottom: 16,

  },

  dropdown_view1: {

    flex: 1.0,
    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 46 / 2, paddingEnd: 16,
    marginTop: 8,
    marginBottom: 16

  },

  followActionrectangle: {

    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    borderRadius: 46 / 2,
    backgroundColor: '#ffffff',

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

  followTimeRectangle3: {

    marginTop: 10,
    height: 46,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    paddingStart: 20,
    borderStyle: 'solid',
    borderWidth: 2,

  },

  followTimeRectangle2: {

    paddingStart: 20,
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

  followupdaterectangle: {

    marginTop: 10,
    height: 46,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    borderColor: '#ecf0f2',
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: '#ffffff',

  },

  top_image_style: {

    flexDirection: 'row',
    width: 16, height: 16,
    tintColor: Colors.white_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  top_image_style1: {

    flexDirection: 'row',
    width: 16, height: 16,
    tintColor: Colors.white_color,
    marginTop: 16,
    marginEnd: 6,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  txt_style1: {

    fontSize: 14, color: Colors.black_color,
    marginTop: 10,
    fontFamily: 'Helvetica-Light'

  },

  followUpAction: {

    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  call: {

    marginLeft: 15,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '900',

  },

  followUp: {

    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  followUp1: {

    marginTop: 10,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '500',

  },

  layer18: {

    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  am: {

    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  img_view: {

    flexDirection: 'row',
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingEnd: 16,

  },

  add_attach_btn: {

    marginTop: 10,
    marginBottom: 20,
    width: '60%',
    height: 50,
    borderRadius: 46 / 2,
    backgroundColor: '#f0ab16',

  },

  titlestyle: {

    color: '#ffffff',
    fontFamily: "Helvetica Neue",
    fontSize: 18,
    fontWeight: '500',
    marginEnd: 10

  },

  add_attach_image_style: {

    flexDirection: 'row',
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginLeft: 12,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

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
    borderRadius: 56 / 2,
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
