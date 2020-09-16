import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Modal,
  Keyboard,
  Alert,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { textHeader, font_style, textInput } from '../components/styles'
import DatePicker from 'react-native-datepicker';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant'
import Colors from '../constants/Colors'
import { Dropdown } from 'react-native-material-dropdown'
import { Overlay } from 'react-native-elements'
import DynamicForm, { buildTheme } from 'react-native-dynamic-form'
import TagInput from 'react-native-tags-input';
import { apiBasePath } from '../constantApi'
import FlashMessage, { showMessage } from "react-native-flash-message";
import { heightPercentageToDP } from 'react-native-responsive-screen';
import NetworkUtils from '../components/NetworkUtils';



export default class OpportunityScreen extends Component {

  // For Initilize the State variables 

  constructor() {
    super();

    this.state = {
      isvisible: false,
      isModalVisible: false,
      DealAmountDisplay: false,
      LeadSourceDisplay: false,
      deal_amount: '',
      no_of_extensions: '',
      Company_Opportunity: '',
      Country: '',
      DataState: false,
      category: 0,
      tags: {
        tag: '',
        tagsArray: []
      },
      addOpportunity: [
        { label: 'Add Opportunity', value: 'Add Opportunity' },
      ],
      opportunityData: '',
      contact_Data: '',
      opportunity: '',
      contact_id: '',
      contact_category: '',
      select_Opportunity: '',
      select_company_Opportunity: '',
      selectedCountryItems: [],
      displayMessage: false,
      LeadSourceData: '',
      opportunityFieldData: [],
      opportunityFieldValue: [],
      opportunityState: false,
      remarks: '',
      deal_amount: '',
      AutoAttendent: 0,
      CloudPanel: 0,
      eFax: 0,
      VoiceRecording: 0,
      selectedTopLayerButton: 'usb',
      selectedButton: 'Intro',
      servicesData: [
        { name: 'Auto Attendant', value: 'item1', status: false, },
        { name: 'Cloud Panel', value: 'item2', status: false, },
        { name: 'eFax', value: 'item3', status: false, },
        { name: 'Voice Recording', value: 'item4', status: false, },
      ],
      selectedItems: [],
      selected_Company_opportunity: false,
      feature_comming_Soon: false,
      feature_name: '',
    }

  }

  // For Display Header and Header elements and did functionality of it's elements

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.opportunity}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity style={[styles.top_layout1]} activeOpacity={1}
          onPress={() => { navigation.goBack(null) }} >

          <Image source={require('./../assets/images/arrow-left.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity style={[styles.top_layout1], { paddingTop: 5, flex: 0.6 }} activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }} >

          <Image source={require('./../assets/images/menu_3x.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,

    headerRight: () =>

      <TouchableOpacity style={styles.top_layout} activeOpacity={1}
        onPress={() => { navigation.getParam('createOpportunity')(); }} >

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center', paddingTop: 3 }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,
  });

  // get the Contact data from AsyncStorage or navgation Params And call api method init for countries Data and then call modify keys method for preprocess the country data 

  componentDidMount = async () => {

    _this = this

    const { navigation } = this.props
    navigation.setParams({ createOpportunity: this.getFormResponses });

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      let Contact_id = navigation.getParam('contactID')
      let Company_id = navigation.getParam('companyID')
      let Contact_category = navigation.getParam('contact_type')
      let category = navigation.getParam('category')
      let selectedTopLayerButton = navigation.getParam('selectedTopLayerButton')

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      this.setState({ contact_id: Contact_id, company_id: Company_id, contact_category: Contact_category, category: category, selectedTopLayerButton: selectedTopLayerButton })

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

            this.setState({ Country: str.countries }, () => { this.modifyKeys() });

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

  // modify Key and structure of Contry Data and then call get contact opportunity method for fetch the contact opportunity

  modifyKeys = () => {
    var Contries = []
    var ContriesItem = this.state.Country

    ContriesItem.map((cv) => {
      var temp1 = {}

      if (temp1.name === undefined && temp1.id === undefined) {

        temp1.name = cv
        temp1.id = cv
        Contries.push(temp1)

      }

    })

    this.setState({ Country: Contries }, () => { this.get_Contact_Opportunities(), this.get_Company_Opportunities() })

  }


  // method for fetch contact opportunity by calling api method get_company_opportunities of Company

  get_Company_Opportunities = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_company_opportunities');
      formData.append('company_id', this.state.company_id);

      fetch(apiBasePath, {

        method: 'POST',
        body: formData

      })

        .then(response => {

          if (response.status == 200) {

            return response.json();

          }

        })
        .then(responseJson => {

          str = responseJson;

          if (str.error == 101) {

            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');

          }

          else {
           // str.unshift({id:'Select Opportunity',name:'Select Opportunity'});
            this.setState({ isLoading: false, Company_Opportunity: str }, () => { this.modifyCompanyOpportunityData() });

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

  modifyCompanyOpportunityData() {

    if (this.state.Company_Opportunity.length == 0 || this.state.Company_Opportunity === undefined || this.state.Company_Opportunity === 'null') {


    }

    else {

      var item = this.state.Company_Opportunity
      item.unshift({id:'Select Opportunity',name:'Select Opportunity'});
      item.map((val) => {

        val.value = val.id;
        val.label = val.name;

      })
     // item.unshift({id:'Select Opportunity',name:'Select Opportunity'});
      this.setState({ Company_Opportunity: item, select_company_Opportunity: item[0].value, DataState: true }, () => {
      })
    }
  }

  // method for fetch contact opportunity by calling api method get_contact_opportunities of Contact

  get_Contact_Opportunities = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_contact_opportunities');
      formData.append('contact_id', this.state.contact_id);
      formData.append('category', this.state.category);

      fetch(apiBasePath, {

        method: 'POST',
        body: formData

      })

        .then(response => {

          if (response.status == 200) {

            return response.json();

          }

        })
        .then(responseJson => {

          str = responseJson;

          if (str.error == 101) {

            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');

          }

          else {

            this.setState({ isLoading: false, opportunity: str }, () => { this.modifyOpportunityData() });

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

  // Add Contact Opportunity by api Calling of method add_contact_opportunity for contact

  add_Contact_Opportunities = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'add_contact_opportunity');
      formData.append('contact_id', this.state.contact_id);
      formData.append('opportunity_id', this.state.select_company_Opportunity);

      fetch(apiBasePath, {

        method: 'POST',
        body: formData

      })

        .then(response => {

          if (response.status == 200) {

            return response.json();

          }

        })
        .then(responseJson => {

          str = responseJson;

          if (str.error == 101) {

            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');

          }

          else {

            if (str.status === true) {

              showMessage({
                message: "",
                description: "Opportunity Successfully Added",
                type: "success",
              }, () => { });

              this.get_Contact_Opportunities()

            }

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

  // Modify the Opportunity Data if the Data is not there then Display message and set default selected opportunity is add Opportunity for add the more opportunity
  // and if the Data is there than the change key like id to value and (name + custom name + dateclosed) to label and also add the add opportunity option for add the more opportunity

  modifyOpportunityData = () => {

    if (this.state.opportunity.length == 0 || this.state.opportunity === undefined || this.state.opportunity === 'null') {

      this.setState({ displayMessage: true, select_Opportunity: '' }, () => { this.get_opportunity_fields() })

    }

    else {

      var item = this.state.opportunity

      item.map((val) => {

        val.value = val.id;

        if (this.state.category === 0) {

          if (val.custom_name === null) {

            val.label = val.name

          }

          else {

            val.label = val.name + ' ( ' + val.custom_name + ')'

          }

        }

        else {

          if (this.state.category == 1) {

            if (val.custom_name === null) {

              val.label = val.name + ' ( ' + val.date_closed + ')'

            }

            else if (val.date_closed === null) {

              val.label = val.name + '( ' + val.custom_name + ')'

            }

            else {

              val.label = val.name + '( ' + val.custom_name + ')' + ' ( ' + val.date_closed + ')'

            }

          }
        }
        delete val.name
        delete val.custom_name
        delete val.id
      })

      this.setState({ opportunity: item, select_Opportunity: item[0].value, displayMessage: false, opportunityState: true }, () => {
        this.get_opportunity_fields()
      })
    }
  }

  // fetch Opportunity field Data by calling Api method get_opportunity_fields for display Dynamic fields of opportunity

  get_opportunity_fields = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);

      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_opportunity_fields');
      formData.append('contact_opportunity_id', this.state.select_Opportunity);


      fetch(apiBasePath, {

        method: 'POST',
        body: formData

      })

        .then(response => {

          if (response.status == 200) {
            return response.json();
          }

        })
        .then(responseJson => {

          str = responseJson;

          if (str.error === 101) {

            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp')

          }

          else {

            console.log(JSON.stringify(str))
            this.setState({ isLoading: false, opportunityFieldData: str }, () => { this.modifyOpportunityFieldData() });

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

  // get the Form Response and preprocess the formData to compatible for sample Data and then call api method update_contact_opportunity_field_values for update the contact opportunity

  getFormResponses = async () => {

    let response = this.formRef._getFormResponses()

    var o = {};
    var a

    Object.keys(response).map((name) => {

      Object.keys(response[name]).map((type) => (

        (type == 'name') ? (
          o[response[name][type]] = {}) : null
      ))
    })

    Object.keys(response).map((name) => {

      Object.keys(response[name]).map((field_type) => {

        (field_type == 'name') ? (

          a = response[name][field_type]) : null

        if (field_type == 'field_type') {

          o[a]["field_type"] = response[name][field_type]

        }

        if (field_type == 'userAnswer') {

          if (response[name][field_type].regular === undefined) {

            o[a]["value"] = response[name][field_type]

          }

          else {

            if (response[name][field_type].regular.length > 0) {

              for (let i = 0; i < response[name][field_type].regular.length; i++) {

                if (i === 0) {

                  o[a]["value"] = response[name][field_type].regular[i]

                }

                else {

                  o[a]["value"] = o[a]["value"] + ',' + response[name][field_type].regular[i]

                }
              }
            }
          }
        }

      }
      )
    })


    this.setState({ opportunityData: o }, () => { })

    const api_token = await AsyncStorage.getItem(Constant.api_token);

    let formData = new FormData();

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'update_contact_opportunity_field_values');
      formData.append('contact_opportunity_id', this.state.select_Opportunity);
      formData.append('opportunity_data', JSON.stringify(this.state.opportunityData));

      fetch(apiBasePath, {

        method: 'POST',
        body: formData

      })

        .then(response => {

          if (response.status == 200) {

            return response.json();

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
                description: "Opportunity updated Successfully",
                type: "success",
              });
              this.props.navigation.goBack(null)

            }
          }
        })

        .catch(error => {

        }
        )
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }

  }

  // Modify Opportunity Field Data to make data compatible for each field type in JSON

  modifyOpportunityFieldData() {

    if (this.state.opportunityFieldData.length == 0 || this.state.opportunityFieldData == undefined || this.state.opportunityFieldData == "null") {

    }
    else {
      var item = []
      item = this.state.opportunityFieldData

      item.map((val) => {

        val.type = val.field_type
        var temp = val.field_type
        delete val.field_type
        var temp1 = val.label
        delete val.label

        if (val.type === 'f-leadsrc') {

          val.key = Math.random().toString(27).substring(2)
          val.type = 'select'

        }

        if (val.type === 'f-dealamt') {

          val.key = Math.random().toString(28).substring(2)
          val.type = 'number'
          val.placeholder = ""

        }

        if (val.type === 'label') {

          val.type = 'header'
          val.subtype = 'h2'
          val.style = {

            color: '#222222',
            fontFamily: 'Helvetica Neue',
            fontSize: 18,
            marginTop: 10,
            fontWeight: '400'

          }
        }

        if (val.type === 'checkbox') {

          val.key = Math.random().toString(29).substring(2)
          val.toggle = false
          val.type = 'checkbox-group'

        }

        if (val.type === 'checkbox-group') {

          val.key = Math.random().toString(30).substring(2)

        }

        if (val.type === 'datepicker') {

          val.key = Math.random().toString(31).substring(2)
          val.type = 'date'

        }

        if (val.type === 'inputtext') {

          val.key = Math.random().toString(32).substring(2)
          val.type = 'text'

        }

        if (val.type === 'inputnum') {

          val.key = Math.random().toString(33).substring(2)
          val.type = 'number'

        }

        if (val.type === 'select') {

          val.key = Math.random().toString(34).substring(2)

        }

        if (val.type === 'textarea') {

          val.key = Math.random().toString(36).substring(2)

        }

        if (val.type === 'tagsinput') {

          val.key = Math.random().toString(35).substring(2)

        }

        val.field_type = temp
        val.label = temp1

      })

      this.setState({ opportunityFieldData: item }, () => {

      })
    }

  }

  // For toggle Display the Update App notification Prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  render() {

    return (

      <KeyboardAwareScrollView style={styles.main_container} enableResetScrollToCoords={true}>

        <View style={styles.main_container}>

          <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>

            <SafeAreaView>

              <View style={{ backgroundColor: Colors.white_color, paddingStart: 16, paddingEnd: 16, }}>

                <Text style={[{ textAlign: 'right', marginTop: 16 }, font_style.font_medium]}>Total Deal Amount(Opportunities)</Text>
                <Text style={[{ textAlign: 'right', fontSize: 25, color: Colors.primaryColor }, font_style.font_medium]}>$3,580.00</Text>

                <View style={{ flexDirection: 'row', marginBottom: 16 }}>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'user') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => {
                      this.setState({ selectedTopLayerButton: 'user', feature_comming_Soon: false }, () => {
                        this.props.navigation.navigate("AccountSettingSecond", { contactID: this.state.contact_id, companyID: this.state.company_id, contact_type: this.state.contact_category })
                      })
                    }} >

                    <Image source={require('./../assets/images/user.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'usb') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedTopLayerButton: 'usb', category: 0, opportunityData: '', feature_comming_Soon: false }, () => { this.get_Contact_Opportunities(), this.formRef.ResetForm() }) }}>

                    <Image source={require('./../assets/images/usb.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'monitor') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedTopLayerButton: 'monitor', category: 1, opportunityData: '', feature_comming_Soon: false }, () => { this.get_Contact_Opportunities(), this.formRef.ResetForm() }) }}>

                    <Image source={require('./../assets/images/monitor.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'calender1') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedTopLayerButton: 'calender1', feature_name: 'Calendars', feature_comming_Soon: true }) }} >


                    <Image source={require('./../assets/images/calender1.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'pie-chart') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedTopLayerButton: 'pie-chart', feature_name: 'Sales', feature_comming_Soon: true }) }} >

                    <Image source={require('./../assets/images/pie-chart.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'List') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedTopLayerButton: 'List', feature_name: 'Data', feature_comming_Soon: true }) }} >

                    <Image source={require('./../assets/images/List.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: (this.state.selectedTopLayerButton === 'bell') ? Colors.pink_start : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedTopLayerButton: 'bell', feature_name: 'Updates', feature_comming_Soon: true }) }} >

                    <Image source={require('./../assets/images/bell.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                </View>

              </View>

              <View style={{ backgroundColor: Colors.white_color, marginTop: 10, paddingStart: 16, paddingEnd: 16 }}>

                {(this.state.feature_comming_Soon) ?

                  <TouchableOpacity activeOpacity={0} onPress={() => { this.setState({ feature_comming_Soon: false }) }}>

                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', alignContent: 'center', marginBottom: 26 }}>

                      <Text style={[styles.text_style], { fontSize: 18, fontWeight: '500', marginTop: 16 }}>{this.state.feature_name}</Text>

                      <Text style={[styles.text_style]}>New Feature Coming Soon..</Text>

                    </View>

                  </TouchableOpacity>

                  :
                  null

                }

                <View style={{ flexDirection: 'row', flex: 1, }}>

                  <View style={{ width: '63%' }}>

                    <Text style={[styles.text_style]}>Opportunity:</Text>
                    <Text style={[styles.text_style1]}>Select Opportunity:</Text>

                  </View>

                  <TouchableOpacity style={{ marginTop: 14, width: '36%', alignItems: 'center', backgroundColor: Colors.primaryColor, height: 42, borderRadius: 42 / 2 }}
                    activeOpacity={1} onPress={() => { this.setState({ displayMessage: false, isModalVisible: true }, () => { this.formRef.ResetForm(), this.get_opportunity_fields() }) }}>

                    <Text style={[styles.text_style], { fontSize: 14, fontWeight: '600', marginTop: 12, justifyContent: 'center', color: '#fff', textAlignVertical: 'center' }}>Add Opportunity</Text>

                  </TouchableOpacity>

                </View>

                <View activeOpacity={1} style={styles.followTimeRectangle3, { flexDirection: 'row', marginTop: 10 }}>

                  <ImageBackground source={require('../assets/images/Rectangle_14.png')} style={{ width: '102%', height: '100%', marginLeft: -8 }} resizeMode='cover'>

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style1, { tintColor: Colors.white_color, zIndex: 999, }]} resizeMode="contain" />

                    </View>

                    <Dropdown
                      containerStyle={styles.dropdown_container}
                      pickerStyle={{
                        width: '92%', marginLeft: 16, marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                        shadowOffset: { width: 2, height: -4 },
                        shadowRadius: 21,
                        borderRadius: 46 / 2,
                        backgroundColor: '#ffffff',
                      }}
                      inputContainerStyle={{
                        marginLeft: 20,
                        borderBottomColor: 'transparent',
                        justifyContent: 'center',
                      }}
                      selectedItemColor='#222222'
                      textColor={Colors.white_color}
                      itemColor='#222222'
                      baseColor='#ffffff00'
                      dropdownPosition={0}
                      itemCount={5}
                      dropdownOffset={{ top: 7, bottom: -10 }}
                      dropdownMargins={{ min: 0, max: 0 }}
                      data={(this.state.opportunityState && !this.state.displayMessage) ? this.state.opportunity : []}
                      value={this.state.select_Opportunity}
                      onChangeText={(value) => { this.setState({ select_Opportunity: value, opportunityData: '' }, () => { this.formRef.ResetForm(), this.get_opportunity_fields() }) }}
                    />

                  </ImageBackground>

                </View>

              </View>

              {/*  Design of Displaying Message when No opportunity are there in contact */}

              <View style={{ backgroundColor: Colors.white_color }}>

                {

                  (this.state.displayMessage) ?

                    <View style={styles.margin_style}>

                      <Text style={styles.text_style}>No Opportunities Created Yet.</Text>

                    </View>

                    :

                    null

                }

                <View style={styles.formcontainer}>

                  {/*  Dynamic Fields are generated by this component for which if you have to update the field design or functionality you have to do from node modules of dynamic forms and please go trough the this library as it is important to know how the library works for any updation in this portion*/}

                  <DynamicForm
                    ref={ref => this.formRef = ref}
                    form={this.state.opportunityFieldData}
                  >

                  </DynamicForm>


                </View>

              </View>

            </SafeAreaView>

          </ScrollView >


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

        {(this.state.isModalVisible) ?

          <TouchableOpacity style={{position:'absolute',width: '100%', height: '100%', backgroundColor: '#000000', opacity: 0.3,  }} activeOpacity={0}  >
            

            <Modal animationType="fade" transparent={true}  visible={this.state.isModalVisible} style={{borderWidth:3,borderColor:'red'}} >
              <TouchableOpacity style={{height:'40%',borderWidth:3,marginTop:50}} onPress={() => { this.setState({ isModalVisible: false }) }} ></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#ffffff', }} activeOpacity={0} >

                <View style={styles.dropdown_view, { marginTop: 5 }}>
                  <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={styles.text_style2}>Add Opportunity</Text>
                   <TouchableOpacity onPress={() => { this.setState({ isModalVisible: false }) }}>
                    <Image source={require('./../assets/images/close.png')}
                      style={{ width: 25, height: 25, }} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>
                  {/*  Dropdown For Add Opportunity In which now the Data is dummy and need to replace the data */}

                  <Dropdown

                    containerStyle={styles.dropdown_containerinModal}
                    pickerStyle={{
                      width: '92%', marginLeft: 16, marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                      shadowOffset: { width: 2, height: -4 },
                      shadowRadius: 21,
                      borderRadius: 46 / 2,
                      backgroundColor: '#ffffff',
                    }}
                    inputContainerStyle={{
                      marginLeft: 16,
                      borderBottomColor: 'transparent',
                      justifyContent: 'center',
                    }}
                    selectedItemColor='#222222'
                    textColor='#222222'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 7, bottom: -10 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.DataState) ? this.state.Company_Opportunity : []}
                    value={this.state.select_company_Opportunity}
                    onChangeText={(value) => { this.setState({ select_company_Opportunity: value, selected_Company_opportunity: true }) }}

                  />

                  {(this.state.selected_Company_opportunity && this.state.select_company_Opportunity != "Select Opportunity") ?

                    <TouchableOpacity style={{ justifyContent: 'center', alignSelf: 'flex-end', width: '18%', height: 42, marginTop: 20, backgroundColor: Colors.primaryColor, borderRadius: 42 / 2 }}
                      onPress={() => { this.setState({ selected_Company_opportunity: false, isModalVisible: false }, () => { this.add_Contact_Opportunities() }) }}>

                      <Text style={{ color: '#fff', textAlign:'center', justifyContent: 'center', textAlignVertical: 'center', fontSize: 16, fontFamily: 'Helvetica Neue', fontWeight: '400'}}>Add</Text>

                    </TouchableOpacity>

                    : null}
                </View>



              </TouchableOpacity>

            </Modal>

          </TouchableOpacity>

          : null}



      </KeyboardAwareScrollView>

    );
  }

}

// Styling Code for Static UI Element of this Page

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

  checkbox_style: {

    backgroundColor: Colors.white_color,
    width: 145,
    height: 50,
    borderWidth: 0

  },
  autocompleteContainer: {

    marginTop: 4,
    height: 42,
    fontSize: 18,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',
    width: '100%',
    borderRadius: 50,
    color: Colors.black_color,
    backgroundColor: Colors.white_shade,

  },

  main_container: {

    flex: 1,
    backgroundColor: Colors.white_color,

  },

  container: {

    flex: 1,
    backgroundColor: Colors.bg_color,

  },

  formcontainer: {

    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
    backgroundColor: '#ffffff',

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

  btn_text: {

    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

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

  enter: {

    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  margin_style: {

    marginStart: 20,
    marginEnd: 20,


  },

  followupdaterectangle: {

    marginTop: 10,
    height: 46,
    borderRadius: 46 / 2,
    flexDirection: 'row',
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    borderColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: Colors.white_shade,

  },

  top_image_style: {

    flexDirection: 'row',
    width: 16, height: 16,
    color: Colors.white_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  img_view: {

    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    paddingEnd: 30,
    marginTop: 12,

  },

  top_image_style1: {

    flexDirection: 'row',
    width: 16, height: 16,
    color: Colors.black_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

  },

  top_image_style1: {

    width: 16, height: 16,
    marginLeft: 8,
    marginTop: 4,

  },

  tag: {

    backgroundColor: Colors.primaryColor,
    color: Colors.white_color,

  },

  dropdown_container: {
    height: 46,
    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,



  },
  dropdown_containerinModal: {
    height: 46,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 46 / 2,
    paddingTop: 2,
    marginTop: 10

  },

  followTimeRectangle3: {

    height: 46,
    width: '90%',
    borderRadius: 46 / 2,
    alignContent: 'center',
    borderRadius: 60,
    borderStyle: 'solid',
    borderWidth: 2,

  },

  formContainer: {

    marginTop: 10,

  },

  dropdown_view: {

    flex: 1,
    height: 46,
    width: '100%',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 46 / 2, paddingEnd: 16,
    marginTop: 10,
    // marginBottom: '60%',

  },

  text_style1: {
    width: '65%',
    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  text_style: {

    width: '65%',
    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },
  text_style2: {

    width: '65%',
    marginTop: -10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  message_style: {

    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '400',

  },

  circle_view: {

    width: 20, height: 20,
    marginEnd: 4,
    borderColor: Colors.primaryColor,
    borderRadius: 20 / 2,
    borderWidth: 1

  },

  checkbox_img: {

    width: 20, height: 20,
    tintColor: Colors.primaryColor,
    shadowOffset: { width: 2, height: 2, },
    shadowColor: Colors.primaryColor,
    shadowOpacity: .2,
    shadowRadius: 20 / 2,

  },

  tab_text: {

    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'center'

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
    marginBottom: 30

  },

});