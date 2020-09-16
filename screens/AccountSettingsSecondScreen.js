import React, { Component, Fragment } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  SafeAreaView,
  Switch,
  ImageBackground,
  Alert,
  Keyboard,
  FlatList

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Overlay } from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { textHeader, font_style, textInput } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant'
import Colors from '../constants/Colors';
import { Dropdown } from 'react-native-material-dropdown'
import TagInput from 'react-native-tags-input';
import { apiBasePath } from '../constantApi';
import FlashMessage, { showMessage } from "react-native-flash-message";
import NetworkUtils from '../components/NetworkUtils';
import { array } from 'prop-types';



// Define the default value of tabvalue

const tabvalue = 0;

export default class AccountSettingsSecondScreen extends React.PureComponent {

  // Display Header and It's elements and functionality of header elements 

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.contact_profile}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity style={[styles.top_layout1]} activeOpacity={1}
          onPress={() => { navigation.goBack(null) }} >

          <Image source={require('./../assets/images/arrow-left.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity style={[styles.top_layout1], { paddingTop: 5, flex: 0.6 }} activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }}>

          <Image source={require('./../assets/images/menu_3x.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,

    headerRight: () =>

      <TouchableOpacity style={styles.top_layout} activeOpacity={1}
        onPress={() => { navigation.getParam('saveContactDetail')(); }} >

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,

  });


  // Initilize the State variable 

  constructor() {
    super();

    this.state = {
      selectedButton: 'EditProfile',
      isvisible: false,
      set_main: 0,
      search: '',
      SelectedCountryName: '',
      renderSelectedItemState: false,
      setmainTogglevalue: 0,
      receiveMarketingToggleValue: 0,
      isLoading: true,
      SearchCountryState: false,
      SearchDesignationState: false,
      SearchIndustryState: false,
      searchDesignation: '',
      searchIndustry: '',
      select_industry: '',
      contact_categ: '',
      contact_id: '',
      company_id: '',
      contact_Data: '',
      ProfileData: '',
      subContactData: '',
      currentCountry: '',
      subContactState: false,
      subContact_id: '',
      subContactDetail: '',
      tags: {
        tag: '',
        tagsArray: []
      },
      subtags: {
        tag: '',
        tagsArray: []
      },
      title: '',
      firstname: '',
      lastname: '',
      office_no: '',
      extention_no: '',
      mobile_no: '',
      home_no: '',
      Country: '',
      email: '',
      address: '',
      city: '',
      state: '',
      recieveMarketing: 0,
      postal_code: '',
      company_name: '',
      designation: '',
      product_services: '',
      remarks: '',
      website: '',
      sub_firstname: '',
      sub_lastname: '',
      sub_title: '',
      sub_office_no: '',
      sub_extention_no: '',
      sub_home_no: '',
      sub_address: '',
      subcity: '',
      subState: '',
      subemail: '',
      sub_postal_code: '',
      sub_company_name: '',
      sub_designation: '',
      sub_product_services: '',
      select_title: '',
      select_sub_industry: '',
      select_sub_designation: '',
      select_sub_country: '',
      sub_remarks: '',
      sub_website: '',
      DataState: false,
      selectedTab: 0,
      switchValue: false,
      selectedItems: [],
      CountryArray: [],
      DesignationArray: [],
      deal_amount_open: '',
      feature_comming_Soon: false,
      feature_name: '',
      SelectedDesignationName: '',
      SelectedIndustryName: '',
      IndustryArray: [],
      SearchSubCountryState: false,
      SubCountryArray: [],
      SelectedSubCountryName: '',
      searchSubCountry: '',
      SearchSubDesignationState: false,
      SubDesignationArray:[],
      SelectedSubDesignationName:'',
      searchSubDesignation:'',
      SearchSubIndustryState: false,
      SubIndustryArray: [],
      SelectedSubIndustryName: '',
      searchSubIndustry: '',

    }
  }

  // set the selected tags in tags variable to update the Tags of Contact

  updateTagState = (state) => {

    this.setState({ tags: state })

  };

  // set the selected tags in subtags variable to update the Tags of sub Contact

  updateSubTagState = (state) => {

    this.setState({ subtags: state })

  };

  // get the Default Data for Calling api method init and then change the key or structure of Data to make dropdown supported by cll modify keys

  componentDidMount = async () => {
    const { navigation } = this.props
    navigation.setParams({ saveContactDetail: this.saveContactDetail });

    let Contact_id = this.props.navigation.getParam('contactID')
    let Company_id = this.props.navigation.getParam('companyID')
    let Contact_category = this.props.navigation.getParam('contact_type')
    this.setState({ SearchCountryState: false });
    this.setState({ SearchDesignationState: false });
    this.setState({ SearchIndustryState: false });
    this.setState({ SearchSubCountryState: false });
    this.setState({ SearchSubDesignationState: false });
    this.setState({ SearchSubIndustryState: false });

    this.setState({ contact_id: Contact_id, company_id: Company_id, contact_categ: Contact_category })

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
            this.setState({ industry: str.contact_industries, title: str.contact_titles, Country: str.countries, designation: str.contact_designations, DataState: true }, () => { this.modifyKeys() });

            let arr = this.state.Country;
            arr.forEach((item, i) => {
              item.id = i + 1;
            });
            this.setState({ Country: arr });
            this.setState({ CountryArray: arr });
            let arrDsg = this.state.designation;
            arrDsg.forEach((item, i) => {
              item.id = i + 1;
            });
            this.setState({ designation: arrDsg });
            this.setState({ DesignationArray: arrDsg });
            // console.warn("Designation Array",this.state.designation);
            // console.warn("Designation All",this.state.DesignationArray);
            let arrIndustry = this.state.industry;
            arrIndustry.forEach((item, i) => {
              item.id = i + 1;
            });
            this.setState({ industry: arrIndustry });
            this.setState({ IndustryArray: arrIndustry });
            console.warn("Industry All", this.state.industry);
            console.warn("Industry Array", this.state.IndustryArray);
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
  onSubCountryArrowClick() {
    let arr = this.state.Country;
    this.setState({ SubCountryArray: arr });
    //  console.warn("Country Array...",this.state.Country);
    this.setState({ SearchSubCountryState: true });
  }
  onArrowSubDesignationClick() {
    let arr = this.state.designation;
    this.setState({ SubDesignationArray: arr });
    this.setState({ SearchSubDesignationState: true });
  }
  onArrowSubIndustryClick() {
    let arr = this.state.industry;
    this.setState({ SubIndustryArray: arr });
    this.setState({ SearchSubIndustryState: true });
  }

  onArrowClick() {
    const {SearchCountryState} = this.state
    let arr = this.state.Country;
    this.setState({ CountryArray: arr });
    //  console.warn("Country Array...",this.state.Country);
    this.setState({ SearchCountryState: !SearchCountryState });
  }
  onArrowDesignationClick() {
    const {SearchDesignationState} = this.state
    let arr = this.state.designation;
    this.setState({ DesignationArray: arr });
    this.setState({ SearchDesignationState: !SearchDesignationState });
  }
  onArrowIndustryClick() {
    const {SearchIndustryState} = this.state

    let arr = this.state.industry;
    this.setState({ IndustryArray: arr });
    this.setState({ SearchIndustryState: !SearchIndustryState });
  }
  // modify the Keys of and structure of object for make supporting Input Data for Dropdown 

  modifyKeys() {

    var y = []
    var industryItem = this.state.industry;
    industryItem.map((cv) => {
      var z = {}

      if (z.value === undefined) {
        z.value = cv
        y.push(z)
      }

      this.setState({ industry: y })

    })



    var x = []
    var titleItem = this.state.title;
    titleItem.map((cv) => {
      var z = {}

      if (z.value === undefined) {
        z.value = cv
        x.push(z)
      }

      this.setState({ title: x })

    })

    var s = []
    var countryItem = this.state.Country;
    countryItem.map((cv) => {
      var z = {}

      if (z.value === undefined) {
        z.value = cv
        s.push(z)
      }

      this.setState({ Country: s })

    })

    var t = []
    var designationItem = this.state.designation;
    designationItem.map((cv) => {
      var z = {}

      if (z.value === undefined) {
        z.value = cv
        t.push(z)
      }

      this.setState({ designation: t },
        () => { this.getContactProfileDetail() })
    })
  }

  // get the Contact Detail Of Contact which is selected in Contact List of Call list Page and set the default value of field of contact profile

  getContactProfileDetail = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_contact_profile_details');
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
          console.warn("String Contact Profile", str);
          if (str.error == 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }
          else {
            this.setState({ isLoading: false, ProfileData: str, select_title: str.title, firstname: str.first_name, lastname: str.last_name, office_no: str.office_number, extention_no: str.ext_number, mobile_no: str.mobile_number, home_no: str.home_number, email: str.email, address: str.address, city: str.city, state: str.state, postal_code: str.postal_code, website: str.website, company: str.company_name, deal_amount_open: str.deal_amount_open, select_industry: str.industry, select_designation: str.designation, select_country: str.country, remarks: str.remarks });
            this.setState({ SelectedCountryName: str.country });
            this.setState({ SelectedDesignationName: str.designation });
            this.setState({ SelectedIndustryName: str.industry });
            if (str.receive_telemktg == 1) {
              this.setState({ recieveMarketing: true });
            }
            else {
              this.setState({ recieveMarketing: false });
            }
            let val = str.products_services;
            let ar = val.split(','); // split string on comma space
            console.warn("arrr", ar);
            this.state.tags.tagsArray = ar;

            console.warn("TAGA Array", this.state.tags)
            console.warn("TAGA Array", this.state.tags.tagsArray.length)
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

  // Get the List of SubContacts of Contact by callig api Method get_sub_contacts

  getSubContact = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);

      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_sub_contacts');
      formData.append('company_id', this.state.company_id);
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

          if (str.error == 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }
          else {
            this.setState({ isLoading: false, subContactData: str, }, () => {
              this.modifySubContactKey()
            });
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

  // Get the Detail of SubContact by calling api method get_sub_contact_details and set the default vaue of field of sub Contact Field

  getSubContactDetails = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_sub_contact_details');
      formData.append('sub_contact_id', this.state.subContact_id);


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

            console.warn("Styring  Sub Contact Details",str)
            this.setState({ isLoading: false, subContactDetail: str, sub_title: str.title, sub_firstname: str.first_name, sub_lastname: str.last_name,sub_remarks:str.remarks,sub_office_no:str.office_number,sub_website:str.website, sub_mobile_no: str.mobile_number, sub_home_no: str.home_number, sub_extention_no: str.ext_number, sub_postal_code: str.postal_code, subemail: str.email, sub_address: str.address, sub_company_name: str.company_name,  subcity: str.city, subState: str.state,  });
            this.setState({SelectedSubCountryName:str.country});
            this.setState({SelectedSubIndustryName:str.industry});
            this.setState({SelectedSubDesignationName:str.designation});
            let val = str.products_services;
            let ar = val.split(','); // split string on comma space
            console.warn("arrr", ar);
            this.state.subtags.tagsArray = ar;
            this.forceUpdate();

            console.warn("TAGA Array", this.state.subtags)
            console.warn("TAGA Array", this.state.subtags.tagsArray.length)
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
  setReceiveMarketing = async () => {
    const api_token = await AsyncStorage.getItem(Constant.api_token)
    let formData = new FormData();
    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token);
    formData.append('method', 'set_contact_receive_mktg');
    formData.append('contact_id', this.state.contact_id);
    if (this.state.recieveMarketing == true) {
      let value = 1;
      formData.append('value', value);
    }
    else {
      let val = 0;
      formData.append('value', val);
    }

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
  // Update Contact Detail of Contact and Subcontact Depends upon the Selected Tab Of Contacts Or Subcontacts by calling api method update_main_contact or update_sub_contact respectively

  saveContactDetail = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      if (this.state.selectedTab === 0) {
        let Product_Services = this.state.tags.tagsArray.toString();
        console.warn("Product Servicers", Product_Services);
        const api_token = await AsyncStorage.getItem(Constant.api_token);
        let formData = new FormData();

        formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
        formData.append('api_token', api_token);
        formData.append('method', 'update_main_contact');
        formData.append('contact_type', this.state.contact_categ);
        formData.append('company_id', this.state.company_id);
        formData.append('contact_id', this.state.contact_id);
        formData.append('first_name', this.state.firstname);
        formData.append('last_name', this.state.lastname);
        formData.append('company_name', this.state.company);
        formData.append('designation', this.state.SelectedDesignationName);
        formData.append('title', this.state.select_title);
        formData.append('office_number', this.state.office_no);
        formData.append('mobile_number', this.state.mobile_no);
        formData.append('home_number', this.state.home_no);
        formData.append('ext_number', this.state.extention_no);
        formData.append('email', this.state.email);
        formData.append('address', this.state.address);
        formData.append('city', this.state.city);
        formData.append('state', this.state.state);
        formData.append('postal_code', this.state.postal_code);
        formData.append('country', this.state.SelectedCountryName);
        formData.append('industry', this.state.SelectedIndustryName);
        formData.append('products_services', Product_Services);
        formData.append('website', this.state.website);
        formData.append('remarks', this.state.remarks);

        if (this.state.contact_id === null && this.state.contact_categ !== '' && this.state.company_id !== '') {

          showMessage({
            message: "",
            description: "Contact Id, Contact Type and Company Id must Be Added",
            type: "danger",
          });
        }

        else {
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
              this.setReceiveMarketing();
              if (str.status === true) {
                showMessage({
                  message: "",
                  description: "Contact successfully Updated",
                  type: "success",
                }.then(this.props.navigation.goBack(null)));

              }


            })
            .catch(error => {

              this.setState({ isLoading: false }, () => { });
            }
            )
        }
      }
      else {
        let Product_Sub_Services = this.state.subtags.tagsArray.toString();
        console.warn("Product Servicers", Product_Sub_Services);
        const api_token = await AsyncStorage.getItem(Constant.api_token);
        let formData = new FormData();

        formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
        formData.append('api_token', api_token);
        formData.append('method', 'update_sub_contact');
        formData.append('sub_contact_id', this.state.subContact_id);
        formData.append('first_name', this.state.sub_firstname);
        formData.append('last_name', this.state.sub_lastname);
        formData.append('company_name', this.state.sub_company_name);
        formData.append('designation', this.state.SelectedSubDesignationName);
        formData.append('title', this.state.sub_title);
        formData.append('office_number', this.state.sub_office_no);
        formData.append('mobile_number', this.state.sub_mobile_no);
        formData.append('home_number', this.state.sub_home_no);
        formData.append('ext_number', this.state.sub_extention_no);
        formData.append('email', this.state.subemail);
        formData.append('address', this.state.sub_address);
        formData.append('city', this.state.subcity);
        formData.append('state', this.state.subState);
        formData.append('postal_code', this.state.sub_postal_code);
        formData.append('country', this.state.SelectedSubCountryName);
        formData.append('industry', this.state.SelectedSubIndustryName);
        formData.append('products_services', Product_Sub_Services);
        formData.append('website', this.state.sub_website);
        formData.append('remarks', this.state.sub_remarks);

        if (this.state.subContact_id === null) {

          showMessage({
            message: "",
            description: "Sub Contact Id must Be Added",
            type: "danger",
          });

        }
        else {
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
              this.setReceiveMarketing();
              if (str.status === true) {

                showMessage({
                  message: "",
                  description: "Subcontact successfully Updated",
                  type: "success",
                }.then(this.props.navigation.goBack(null)));
              }


            })
            .catch(error => {

              this.setState({ isLoading: false });
            }
            )
        }

      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }

  // Add Sub Contact

  addSubContact = async () => {
   
    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {
      let Product_Services = this.state.subtags.tagsArray.toString();
      console.warn("Product Servicers", Product_Services);
      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'add_sub_contact');
      formData.append('contact_id', this.state.contact_id);
      formData.append('set_as_main', this.state.set_main);
      formData.append('first_name', this.state.firstname);
      formData.append('last_name', this.state.lastname);
      formData.append('company_name', this.state.company);
      formData.append('designation', this.state.SelectedSubDesignationName);
      formData.append('title', this.state.select_title);
      formData.append('office_number', this.state.office_no);
      formData.append('mobile_number', this.state.mobile_no);
      formData.append('home_number', this.state.home_no);
      formData.append('ext_number', this.state.extention_no);
      formData.append('email', this.state.email);
      formData.append('address', this.state.address);
      formData.append('city', this.state.city);
      formData.append('state', this.state.state);
      formData.append('postal_code', this.state.postal_code);
      formData.append('country', this.state.SelectedSubCountryName);
      formData.append('industry', this.state.SelectedSubIndustryName);
      formData.append('products_services', Product_Services);
      formData.append('website', this.state.website);
      formData.append('remarks', this.state.remarks);


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

          if (str.status === true && str.set_as_main === false) {

            showMessage({
              message: "",
              description: "SubContact successfully Added",
              type: "success",
            });


          }

          else if (str.set_as_main === true && str.status === true) {

            showMessage({
              message: "",
              description: "SubContact successfully Added and set as Main Contact",
              type: "success",
            });


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

  // Modify the Key of Sub Contact Data

  modifySubContactKey() {

    if (this.state.subContactData.length == 0 || this.state.subContactData === undefined || this.state.subContactData === 'null') {

    }
    else {

      var arr = this.state.subContactData;

      arr.map((val) => {

        var name = val.first_name;

        val.value = val.id;
        val.label = name;

        delete val.id
        delete val.first_name

      })
      this.setState({ subContactData: arr, sub_firstname: arr.name, sub_lastname: arr.last_name, subContactState: true, subContact_id: arr[0].value }, () => { this.getSubContactDetails() })

    }

  }

  // Toggle Visibility of Update App Notification prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  // Toggle Value of Switch recieve Marketing Switch

  toggleSwitch = (value) => {

    this.setState({ recieveMarketing: value })

  }

  toggleSwitchSetMain = (value) => {

    this.setState({ setmainTogglevalue: value }, () => {

      if (this.state.setmainTogglevalue === true) {
        this.setState({ set_main: 1 })
      }
      else if (this.state.setmainTogglevalue === false) {
        this.setState({ set_main: 0 })
      }
    })
  }

  // Set SubContact as mainContact

  setSubContactasMainContact = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'set_as_main_contact');
      formData.append('contact_id', this.state.contact_id);
      formData.append('sub_contact_id', this.state.subContact_id);



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
          // console.log(JSON.stringify(str))
          if (str.error === 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');
          }

          else {

            showMessage({
              message: "",
              description: "Subcontact successfully Set as Main Contact",
              type: "success",
            });

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
  DisplaySubIndustryList = (item) => {
    // { console.warn("Item..", item) }
    return (

      <TouchableOpacity onPress={() => { this.selectSubIndustryItem(item.id) }}>
        {/* onPress={() => { this.selectContactCompanyItem(item.id) }} */}

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222', }}>{item.value}</Text>

        </View>

      </TouchableOpacity>

    )
  }
  selectSubIndustryItem(id) {
    var item = this.state.industry

    var selecteditem = [];

    item.map((val) => {

      if (id === val.id) {

        selecteditem = val.value

      }

    })

    this.setState({ SelectedSubIndustryName: selecteditem, SearchSubIndustryState: false, }, () => { selecteditem = [], item = {} })
  }
  DisplaySubDesignationList = (item) => {
    // { console.warn("Item..", item) }
    return (

      <TouchableOpacity onPress={() => { this.selectSubDesignationItem(item.id) }}>
        {/* onPress={() => { this.selectContactCompanyItem(item.id) }} */}

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222', }}>{item.value}</Text>

        </View>

      </TouchableOpacity>

    )
  }
  selectSubDesignationItem(id) {
    var item = this.state.designation

    var selecteditem = [];

    item.map((val) => {

      if (id === val.id) {

        selecteditem = val.value

      }

    })

    this.setState({ SelectedSubDesignationName: selecteditem, SearchSubDesignationState: false, }, () => { selecteditem = [], item = {} })
  }
  DisplayIndustryList = (item) => {
    // { console.warn("Item..", item) }
    return (

      <TouchableOpacity onPress={() => { this.selectIndustryItem(item.id) }}>
        {/* onPress={() => { this.selectContactCompanyItem(item.id) }} */}

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222', }}>{item.value}</Text>

        </View>

      </TouchableOpacity>

    )
  }
  selectIndustryItem(id) {
    var item = this.state.industry

    var selecteditem = [];

    item.map((val) => {

      if (id === val.id) {

        selecteditem = val.value

      }

    })

    this.setState({ SelectedIndustryName: selecteditem, SearchIndustryState: false, }, () => { selecteditem = [], item = {} })
  }
  DisplayDesignationList = (item) => {
    // { console.warn("Item..", item) }
    return (

      <TouchableOpacity onPress={() => { this.selectDesignationItem(item.id) }}>
        {/* onPress={() => { this.selectContactCompanyItem(item.id) }} */}

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222', }}>{item.value}</Text>

        </View>

      </TouchableOpacity>

    )
  }
  selectDesignationItem(id) {
    var item = this.state.designation

    var selecteditem = [];

    item.map((val) => {

      if (id === val.id) {

        selecteditem = val.value

      }

    })

    this.setState({ SelectedDesignationName: selecteditem, SearchDesignationState: false, }, () => { selecteditem = [], item = {} })
  }
  DisplayContactandCompanyList = (item) => {
    // { console.warn("Item..", item) }
    return (

      <TouchableOpacity onPress={() => { this.selectCountryItem(item.id) }}>
        {/* onPress={() => { this.selectContactCompanyItem(item.id) }} */}

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222', }}>{item.value}</Text>

        </View>

      </TouchableOpacity>

    )
  }
  selectCountryItem(id) {
    var item = this.state.Country

    var selecteditem = [];

    item.map((val) => {

      if (id === val.id) {

        selecteditem = val.value

      }

    })

    this.setState({ SelectedCountryName: selecteditem, SearchCountryState: false, renderSelectedItemState: true }, () => { selecteditem = [], item = {} })
  }
  DisplaySubCountryList = (item) => {
    // { console.warn("Item..", item) }
    return (

      <TouchableOpacity onPress={() => { this.selectSubCountryItem(item.id) }}>
        {/* onPress={() => { this.selectContactCompanyItem(item.id) }} */}

        <View style={{ marginVertical: 5, marginLeft: 10 }}>

          <Text style={{ marginVertical: 10, paddingStart: 16, fontSize: 14, fontFamily: 'Helvetica Neue', fontWeight: '400', color: '#222222', }}>{item.value}</Text>

        </View>

      </TouchableOpacity>

    )
  }
  selectSubCountryItem(id) {
    var item = this.state.Country

    var selecteditem = [];

    item.map((val) => {

      if (id === val.id) {

        selecteditem = val.value

      }

    })

    this.setState({ SelectedSubCountryName: selecteditem, SearchSubCountryState: false, }, () => { selecteditem = [], item = {} })
  }
  onSearchSubCountry(search) {
    this.setState({ SelectedSubCountryName: '' });
    this.setState({ searchSubCountry: search });
    this.setState({ SearchSubCountryState: true });
    let categoryLength = this.state.Country.length;
    let searchArr = [];
    console.warn('search length : ', search.length, '====', categoryLength)
    if (search.length > 0) {
      for (i = 0; i < categoryLength; i++) {
        console.warn('result : ', this.state.Country[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase());

        if (this.state.Country[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase()) {
          searchArr.push(this.state.Country[i]);
        }
      }

      this.setState({ SubCountryArray: searchArr });
      // this.setState({ SearchCountryState: true });
      // console.warn(this.state.searchListArr)
    }
    else {
      this.setState({ SubCountryArray: [] })
      this.setState({ SearchSubCountryState: false });
    }

    console.warn("111 : ", this.state.SelectedCountryName);
    console.warn('222: ', this.state.SelectedCountryName);
    console.warn('333 : ', this.state.search);

    console.warn("Country All", this.state.Country);

  }



  onSearchCountry(search) {
    this.setState({ SelectedCountryName: '' });
    this.setState({ search: search });
    this.setState({ SearchCountryState: true });
    let categoryLength = this.state.Country.length;
    let searchArr = [];
    console.warn('search length : ', search.length, '====', categoryLength)
    if (search.length > 0) {
      for (let i = 0; i < categoryLength; i++) {
        console.warn('result : ', this.state.Country[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase());

        if (this.state.Country[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase()) {
          searchArr.push(this.state.Country[i]);
        }
      }

      this.setState({ CountryArray: searchArr });
      // this.setState({ SearchCountryState: true });
      // console.warn(this.state.searchListArr)
    }
    else {
      this.setState({ CountryArray: [] })
      this.setState({ SearchCountryState: false });
    }

    console.warn("111 : ", this.state.SelectedCountryName);
    console.warn('222: ', this.state.SelectedCountryName);
    console.warn('333 : ', this.state.search);

    console.warn("Country All", this.state.Country);

  }
  onSearchDesignation(search) {
    this.setState({ SelectedDesignationName: '' });
    this.setState({ searchDesignation: search });
    this.setState({ SearchDesignationState: true });
    let categoryLength = this.state.designation.length;
    let searchArr = [];
    console.warn('search length : ', search.length, '====', categoryLength)
    if (search.length > 0) {
      for (i = 0; i < categoryLength; i++) {
        console.warn('result : ', this.state.designation[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase());

        if (this.state.designation[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase()) {
          searchArr.push(this.state.designation[i]);
        }
      }

      this.setState({ DesignationArray: searchArr });
      // this.setState({ SearchCountryState: true });
      // console.warn(this.state.searchListArr)
    }
    else {
      this.setState({ DesignationArray: [] })
      this.setState({ SearchDesignationState: false });
    }
  }
  onSearchIndustry(search) {
    this.setState({ SelectedIndustryName: '' });
    this.setState({ searchIndustry: search });
    this.setState({ SearchIndustryState: true });
    let categoryLength = this.state.industry.length;
    let searchArr = [];
    console.warn('search length : ', search.length, '====', categoryLength)
    if (search.length > 0) {
      for (i = 0; i < categoryLength; i++) {
        console.warn('result : ', this.state.industry[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase());

        if (this.state.industry[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase()) {
          searchArr.push(this.state.industry[i]);
        }
      }

      this.setState({ IndustryArray: searchArr });
      // this.setState({ SearchCountryState: true });
      console.warn("Array Sortinh", this.state.IndustryArray);
    }
    else {
      this.setState({ IndustryArray: [] })
      this.setState({ SearchIndustryState: false });
    }
  }
  onSearchSubDesignation(search) {
    this.setState({ SelectedSubDesignationName: '' });
    this.setState({ searchSubDesignation: search });
    this.setState({ SearchSubDesignationState: true });
    let categoryLength = this.state.designation.length;
    let searchArr = [];
    console.warn('search length : ', search.length, '====', categoryLength)
    if (search.length > 0) {
      for (i = 0; i < categoryLength; i++) {
        console.warn('result : ', this.state.designation[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase());

        if (this.state.designation[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase()) {
          searchArr.push(this.state.designation[i]);
        }
      }

      this.setState({ SubDesignationArray: searchArr });
      // this.setState({ SearchCountryState: true });
      // console.warn(this.state.searchListArr)
    }
    else {
      this.setState({ SubDesignationArray: [] })
      this.setState({ SearchSubDesignationState: false });
    }
  }
  onSearchSubIndustry(search) {
    this.setState({ SelectedSubIndustryName: '' });
    this.setState({ searchSubIndustry: search });
    this.setState({ SearchSubIndustryState: true });
    let categoryLength = this.state.industry.length;
    let searchArr = [];
    console.warn('search length : ', search.length, '====', categoryLength)
    if (search.length > 0) {
      for (i = 0; i < categoryLength; i++) {
        console.warn('result : ', this.state.industry[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase());

        if (this.state.industry[i].value.replace(/[^a-zA-Z0-9]/g, "").substr(0, search.length).toLowerCase() == search.toLowerCase()) {
          searchArr.push(this.state.industry[i]);
        }
      }

      this.setState({ SubIndustryArray: searchArr });
      // this.setState({ SearchCountryState: true });
      console.warn("Array Sortinh", this.state.IndustryArray);
    }
    else {
      this.setState({ SubIndustryArray: [] })
      this.setState({ SearchSubIndustryState: false });
    }
  }
  render() {

    return (

      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag' enableResetScrollToCoords={false}  bounces={false} >

        <View style={styles.main_container}>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag' nestedScrollEnabled={true}>

            <SafeAreaView>

              <View style={{ backgroundColor: Colors.white_color, paddingStart: 16, paddingEnd: 16, }}>

                <Text style={[{ textAlign: 'right', marginTop: 16 }, font_style.font_medium]}>Total Deal Amount(Opportunities)</Text>
                <Text style={[{ textAlign: 'right', fontSize: 25, color: Colors.primaryColor }, font_style.font_medium]}>{(this.state.deal_amount_open === null) ? '$ ' : '$ ' + this.state.deal_amount_open}</Text>

                <View style={{ flexDirection: 'row', marginBottom: 16 }}>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'EditProfile') ? "#35E7BD" : Colors.primaryColor, }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedButton: 'EditProfile', feature_comming_Soon: false }, () => { }) }}>

                    <Image source={require('./../assets/images/user.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'usb') ? "#35E7BD" : Colors.primaryColor, }, styles.contact_icon]}
                    onPress={() => {
                      this.setState({ selectedButton: 'usb', feature_comming_Soon: false }, () => {
                        this.props.navigation.navigate("Opportunity", { contactID: this.state.contact_id, companyID: this.state.company_id, contact_type: this.state.contact_categ, category: 0, selectedTopLayerButton: 'usb' })
                      })
                    }}>

                    <Image source={require('./../assets/images/usb.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'monitor') ? "#35E7BD" : Colors.primaryColor }, styles.contact_icon]}
                    onPress={() => {
                      this.setState({ selectedButton: 'usb', feature_comming_Soon: false }, () => {
                        this.props.navigation.navigate("Opportunity", { contactID: this.state.contact_id, companyID: this.state.company_id, contact_type: this.state.contact_categ, category: 1, selectedTopLayerButton: 'monitor' })
                      })
                    }}>
                    <Image source={require('./../assets/images/monitor.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'calender1') ? "#35E7BD" : Colors.primaryColor, }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedButton: 'calender1', feature_comming_Soon: true, feature_name: 'Calendars' }, () => { }) }} >

                    <Image source={require('./../assets/images/calender1.png')}
                      style={{ width: 24, height: 24, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'pie-chart') ? "#35E7BD" : Colors.primaryColor, }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedButton: 'pie-chart', feature_comming_Soon: true, feature_name: 'Sales' }, () => { }) }} >

                    <Image source={require('./../assets/images/pie-chart.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'Forma_1') ? "#35E7BD" : Colors.primaryColor, }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedButton: 'Forma_1', feature_comming_Soon: true, feature_name: 'Data' }, () => { }) }}>

                    <Image source={require('./../assets/images/Forma_1.png')}
                      style={{ width: 36, height: 36, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    style={[{ backgroundColor: (this.state.selectedButton === 'bell') ? "#35E7BD" : Colors.primaryColor, }, styles.contact_icon]}
                    onPress={() => { this.setState({ selectedButton: 'bell', feature_comming_Soon: true, feature_name: 'Updates' }, () => { }) }} >

                    <Image source={require('./../assets/images/bell.png')}
                      style={{ width: 20, height: 20, tintColor: Colors.white_color }} resizeMode="contain" />

                  </TouchableOpacity>

                </View>

              </View>

              {(this.state.feature_comming_Soon) ?

                <TouchableOpacity activeOpacity={0} onPress={() => { this.setState({ feature_comming_Soon: false }) }}>

                  <View style={{ justifyContent: 'center', alignItems: 'flex-start', alignContent: 'center', marginLeft: 16, marginBottom: 16 }}>

                    <Text style={[styles.large_text_style], { fontSize: 18, fontWeight: '500', marginTop: 16 }}>{this.state.feature_name}</Text>

                    <Text style={[styles.large_text_style]}>New Feature Coming Soon..</Text>


                  </View>

                </TouchableOpacity>

                :
                null

              }

              {/* Main Contact and Sub Contact Tab Portion */}

              <View style={{ marginTop: 10, backgroundColor: Colors.white_color, paddingTop: 2, paddingBottom: 20 }}>

                <View style={{ backgroundColor: Colors.white_color, padding: 16 }}>

                  <View style={{ backgroundColor: Colors.primaryColor, height: 46, borderRadius: 46 / 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 2 }}>

                    <TouchableOpacity activeOpacity={1}
                      onPress={() => { this.setState({ selectedTab: 0 }), () => { (tabvalue === 1) ? tabvalue = 0 : null } }}
                      style={[{ flex: 1, height: 42, justifyContent: 'center' }, this.state.selectedTab === 0 ? { backgroundColor: Colors.white_color, borderRadius: 42 / 2, } : {}]}>

                      <Text style={[styles.tab_text, font_style.font_medium, this.state.selectedTab === 0 ? { color: Colors.primaryColor } : { color: Colors.white_color }]}>Main Contact</Text>

                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1}
                      onPress={() => { this.setState({ selectedTab: 1 }), this.getSubContact(); }}
                      style={[{ flex: 1, height: 42, justifyContent: 'center' }, this.state.selectedTab === 1 ? { backgroundColor: Colors.white_color, borderRadius: 42 / 2, } : {}]}>

                      <Text style={[styles.tab_text, font_style.font_medium, this.state.selectedTab === 1 ? { color: Colors.primaryColor } : { color: Colors.white_color }]}>Sub Contact</Text>

                    </TouchableOpacity>

                  </View>

                </View>

                {

                  // Field of Contact profile Detail Portion Started from here

                  (!this.state.selectedTab) ?

                    <View style={{ paddingStart: 16, paddingEnd: 16 }}>

                      <Text style={[styles.text_style1]}>Title:</Text>

                      <View activeOpacity={0} style={styles.followTimeRectangle3, { marginLeft: -7, flexDirection: 'row', backgroundColor: '#ffff' }}>

                        <ImageBackground source={require('../assets/images/Rectangle_14.png')} style={{ width: '101%', height: '100%', }} resizeMode='cover'>

                          <View style={styles.img_view}>

                            <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.white_color, marginTop: 18, marginEnd: 10 }]} resizeMode="contain" />

                          </View>

                          <Dropdown
                            containerStyle={styles.dropdown_container}
                            pickerStyle={{
                              width: '92%', marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                              shadowOffset: { width: 2, height: -4 },
                              shadowRadius: 21,
                              borderRadius: 46 / 2,
                              backgroundColor: '#ffffff'
                            }}
                            inputContainerStyle={{
                              marginLeft: 26,
                              borderBottomColor: 'transparent',
                              justifyContent: 'center',
                            }}
                            selectedItemColor='#222222'
                            textColor='#ffffff'
                            itemColor='#222222'
                            baseColor='#ffffff00'
                            dropdownPosition={0}
                            itemCount={5}
                            dropdownOffset={{ top: 10, bottom: -10 }}
                            dropdownMargins={{ min: 0, max: 0 }}
                            data={(this.state.DataState) ? this.state.title : []}
                            value={this.state.select_title}
                            onChangeText={(value) => { this.setState({ select_title: value }) }}
                          />

                        </ImageBackground>

                      </View>

                      <Text style={[styles.text_style1]}>First Name:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ firstname: value })}
                        value={this.state.firstname}
                        placeholderTextColor={Colors.black_color}
                      />

                      <Text style={[styles.text_style1]}>Last Name:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ lastname: value })}
                        value={this.state.lastname}
                        placeholderTextColor={Colors.black_color}
                      />

                      <Text style={[styles.text_style1]}>Office Number:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ office_no: value })}
                        value={this.state.office_no}
                        placeholderTextColor={Colors.black_color}
                        keyboardType='numeric'
                      />

                      <Text style={[styles.text_style1]}>Extention Number:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ extention_no: value })}
                        value={this.state.extention_no}
                        placeholderTextColor={Colors.black_color}
                        keyboardType='numeric'
                      />

                      <Text style={[styles.text_style1]}>Mobile Number:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ mobile_no: value })}
                        value={this.state.mobile_no}
                        placeholderTextColor={Colors.black_color}
                        keyboardType='numeric'
                      />

                      <Text style={[styles.text_style1]}>Home Number:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ home_no: value })}
                        value={this.state.home_no}
                        placeholderTextColor={Colors.black_color}
                        keyboardType='numeric'
                      />

                      <Text style={[styles.text_style1]}>Email:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ email: value })}
                        value={this.state.email}
                        placeholderTextColor={Colors.black_color}
                      />

                      <Text style={[styles.text_style1]}>Address:</Text>

                      <View style={{ marginTop: 5, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                        <TextInput
                          style={[{ height: 100, textAlignVertical: 'top', color: '#222222', marginTop: 10, marginLeft: 16, fontSize: 14 }]}
                          onChangeText={(value) => this.setState({ address: value })}
                          value={this.state.address}
                          multiline={true}
                          placeholderTextColor='#222222'
                        />

                      </View>

                      <Text style={[styles.text_style1]}>City:</Text>

                      <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ city: value })}
                          value={this.state.city}
                          placeholderTextColor={Colors.black_color}
                        />

                      </View>

                      <Text style={[styles.text_style1]}>State:</Text>

                      <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ state: value })}
                          value={this.state.state}
                          placeholderTextColor={Colors.black_color}
                          onFocus={() => {  this.setState({ SearchCountryState: false }); }} 
                        />

                      </View>
                      <Text style={[styles.text_style1]}>Country:</Text>
                      {/* {(this.state.renderSelectedItemState) ?

                        this.renderSelectedItem()
                        : */}
                      <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, position: 'relative' }}>
                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(search) => this.onSearchCountry(search)}
                          value={this.state.SelectedCountryName ? this.state.SelectedCountryName : this.state.search}
                          placeholderTextColor={Colors.black_color}
                          onFocus={() => { this.onArrowClick() }} 
                         />
                        <View style={{ position: 'absolute', top: 13, right: 13 }}>
                          <TouchableOpacity onPress={() => { this.onArrowClick() }} style={{ width: 20 }}>
                            <Image source={this.state.SearchCountryState ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {
                        this.state.SearchCountryState ?
                        <View style={{height:(this.state.CountryArray.length>8 ?390:null),
                          marginTop: 6,
                          borderWidth: (this.state.CountryArray.length==0?0:2),
                          borderColor: Colors.lightGray,
                          borderRadius: 40 / 2}}>
                          <FlatList
                            // contentContainerStyle={{}}
                            keyboardShouldPersistTaps='handled'
                            nestedScrollEnabled={true}
                            data={this.state.CountryArray}
                            keyExtractor={(item, index) => { return item.id + "" + index }}
                            renderItem={({ item }) => this.DisplayContactandCompanyList(item)}
                         />
                         </View>
                          : null}

                      {/* <Text style={[styles.text_style1]}>Country:</Text>

                      <View activeOpacity={1} style={[styles.dropdown_view, { marginTop: 4 }]}>
                            {this.renderSelectedItem}
                            <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(search) => this.onSearchCountry(search)}
                          value={this.state.search}
                          placeholderTextColor={Colors.black_color}
                        />
                        <View style={styles.img_view}>

                          <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                        </View>
                        {
                (this.state.SearchCountryState) ?
                
                  <FlatList
                    contentContainerStyle={{
                      marginTop: 6,
                      borderWidth: 2,
                      borderColor: 'red',
                      borderRadius: 40 / 2,
                    }}
                    
                    keyboardShouldPersistTaps='handled'
                    data={this.state.Country}

                    keyExtractor={(item, index) => { return item.id + "" + index }}
                    renderItem={({ item }) => this.DisplayContactandCompanyList(item)}

                  />

                  : null} */}


                      {/* <Dropdown
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
                          textColor='#222222'
                          itemColor='#222222'
                          baseColor='#ffffff00'
                          dropdownPosition={0}
                          itemCount={5}
                          dropdownOffset={{ top: 10, bottom: -10 }}
                          dropdownMargins={{ min: 0, max: 0 }}
                          data={(this.state.DataState) ? this.state.Country : []}
                          value={(this.state.ProfileData.country === null || this.state.ProfileData.country === undefined) ? '' : this.state.ProfileData.country}
                          onChangeText={(value) => { this.setState({ select_country: value }) }}
                        /> */}

                      {/* </View> */}

                      <Text style={[styles.text_style1]}>Postal Code:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ postal_code: value })}
                        value={this.state.postal_code}
                        placeholder={this.state.postal_code}
                        placeholderTextColor={Colors.black_color}
                        keyboardType='numeric'
                        onFocus={() => {  this.setState({ SearchCountryState: false }); }} 
                      />

                      <Text style={[styles.text_style1]}>Company:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ company: value })}
                        value={this.state.company}
                        placeholder={this.state.ProfileData.company_name}
                        placeholderTextColor={Colors.black_color}
                      />

                      <Text style={[styles.text_style1]}>Website:</Text>

                      <TextInput
                        style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                        onChangeText={(value) => this.setState({ website: value })}
                        value={(this.state.website === "null") ? ' ' : this.state.website}
                        placeholder={(this.state.ProfileData.website === 'null') ? ' ' : this.state.ProfileData.website}
                        placeholderTextColor={Colors.black_color}
                        onFocus={()=>this.setState({ SearchIndustryState: false ,SearchDesignationState:false })}

                      />
                      <Text style={[styles.text_style1]}>Designation:</Text>

                      <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, position: 'relative' }}>
                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(searchDesignation) => this.onSearchDesignation(searchDesignation)}
                          value={this.state.SelectedDesignationName ? this.state.SelectedDesignationName : this.state.searchDesignation}
                          placeholderTextColor={Colors.black_color} 
                          onFocus = { () => {this.setState({SearchDesignationState:true ,SearchIndustryState:false})} }
                        />
                        <View style={{ position: 'absolute', top: 13, right: 13 }}>
                          <TouchableOpacity onPress={() => { this.onArrowDesignationClick() }} style={{ width: 20 }}>

                            <Image source={ this.state.SearchDesignationState ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />

                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* } */}

                      {
                        this.state.SearchDesignationState ?
                        <View style={{height:(this.state.DesignationArray.length>8 ?390:null),
                          marginTop: 6,
                          borderWidth: (this.state.DesignationArray.length==0 ?0:2),
                          borderColor: Colors.lightGray,
                          borderRadius: 40 / 2,}}>
                          <FlatList
                            // contentContainerStyle={{}}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps='handled'
                            data={this.state.DesignationArray}

                            keyExtractor={(item, index) => { return item.id + "" + index }}
                            renderItem={({ item }) => this.DisplayDesignationList(item)}

                          />
                        </View>
                          : null}
                      {/* <Text style={[styles.text_style1]}>Designation:</Text>

                      <View activeOpacity={1} style={[styles.dropdown_view, { marginTop: 4 }]}>

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
                            marginLeft: 20,
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
                          data={(this.state.DataState) ? this.state.designation : []}
                          value={this.state.ProfileData.designation}
                          onChangeText={(value) => { this.setState({ select_designation: value }) }}
                        />

                      </View> */}
                      <Text style={[styles.text_style1]}>Industry:</Text>

                      <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, position: 'relative' }}>
                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(searchIndustry) => this.onSearchIndustry(searchIndustry)}
                          value={this.state.SelectedIndustryName ? this.state.SelectedIndustryName : this.state.searchIndustry}
                          placeholderTextColor={Colors.black_color}
                          onFocus={()=>this.setState({ SearchIndustryState: true ,SearchDesignationState:false })}
                        />
                        
                        <View style={{ position: 'absolute', top: 13, right: 13 }}>
                          <TouchableOpacity onPress={() => { this.onArrowIndustryClick() }} style={{ width: 20 }}>

                            <Image source={ this.state.SearchIndustryState ? require('../assets/images/arrow_up.png') :require('../assets/images/arrow_down.png') } style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />

                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* } */}

                      {
                        this.state.SearchIndustryState ?
                        <View style={{height:(this.state.IndustryArray.length>8 ?390:null),
                          marginTop: 6,
                          borderWidth: (this.state.IndustryArray.length==0 ?0:2),
                          borderColor: Colors.lightGray,
                          borderRadius: 40 / 2,}}>
                          <FlatList
                            // contentContainerStyle={{}}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps='handled'
                            data={this.state.IndustryArray}

                            keyExtractor={(item, index) => { return item.id + "" + index }}
                            renderItem={({ item }) => this.DisplayIndustryList(item)}

                          />
                        </View>
                          : null}
                      {/* <Text style={[styles.text_style1]}>Industry:</Text>

                      <View activeOpacity={1} style={[styles.dropdown_view, { marginTop: 4 }]}>

                        <View style={styles.img_view}>

                          <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

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
                          textColor='#222222'
                          itemColor='#222222'
                          baseColor='#ffffff00'
                          dropdownPosition={0}
                          itemCount={5}
                          dropdownOffset={{ top: 10, bottom: -10 }}
                          dropdownMargins={{ min: 0, max: 0 }}
                          data={(this.state.DataState) ? this.state.industry : []}
                          value={this.state.ProfileData.industry}
                          onChangeText={(value) => { this.setState({ select_industry: value }) }}
                        />

                      </View> */}

                      <Text style={[styles.text_style1]}>Product &amp; Services:</Text>

                      <TagInput
                        style={{
                          width: '103%', color: '#222222', height: 42, fontSize: 14, fontWeight: '400',
                          marginLeft: -7,
                          paddingStart: 16,
                          borderRadius: 21,
                          backgroundColor: Colors.white_shade,
                          fontFamily: 'Helvetica-Light',
                        }}
                        label='Enter Tags Here'
                        updateState={this.updateTagState}
                        tags={this.state.tags}
                        tagStyle={styles.tag}
                        onFocus={()=>this.setState({ SearchIndustryState: false ,SearchDesignationState:false })}
                        
                      // tagStyle={{ borderWidth:3,borderColor:'red',}}
                      />

                      <Text style={[styles.text_style1]}>Receive Marketing:</Text>

                      <View style={{ height: 24, marginBottom: 10, }}>

                        <Switch
                          trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                          style={{ marginTop: 4, height: 24, }}
                          onValueChange={(value) => this.toggleSwitch(value)}
                          value={this.state.recieveMarketing}
                        />

                      </View>

                      <Text style={[styles.text_style1]}>Remarks:</Text>

                      <View style={{ marginTop: 5, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                        <TextInput
                          style={[textInput.gray_textInput, { height: 100, textAlignVertical: 'top', color: '#222222', marginTop: 10, fontSize: 14 }]}
                          onChangeText={(value) => this.setState({ remarks: value })}
                          value={this.state.remarks}
                          placeholder='Enter Remarks'
                          multiline={true}
                          placeholderTextColor={Colors.black_color}
                        />

                      </View>

                    </View>

                    :

                    // Field of Sub Contact List and Sub Contact profile Detail Portion Started from here

                    <View style={{ marginTop: 10, backgroundColor: Colors.white_color, paddingTop: 16, paddingBottom: 20, paddingStart: 16, paddingEnd: 16 }}>

                      <Text style={[{ fontSize: 20, color: Colors.black_color, marginTop: 8 }, font_style.font_medium]}>Sub Contact</Text>
                      <Text style={[{ marginTop: 8, marginBottom: 8 }, font_style.font_light]}>Select Contact:</Text>

                      <View activeOpacity={1}
                        style={[{ backgroundColor: Colors.white_shade, marginBottom: 10 }, styles.dropdown_view,]}>

                        <View style={styles.img_view}>

                          <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                        </View>

                        <Dropdown
                          containerStyle={styles.dropdown_container}
                          pickerStyle={{
                            width: '92%', marginTop: 60, paddingStart: 14, shadowColor: 'rgba(0, 0, 0, 0.24)',
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
                          textColor='#222222'
                          itemColor='#222222'
                          baseColor='#ffffff00'
                          dropdownPosition={0}
                          itemCount={5}
                          dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                          dropdownMargins={{ min: 0, max: 0 }}
                          data={(this.state.subContactState) ? this.state.subContactData : []}
                          value={this.state.subContact_id}
                          onChangeText={(value) => { this.setState({ subContact_id: value }, () => { this.getSubContactDetails() }) }}
                        />

                      </View>

                      <View style={{ height: 46, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 2 }}>

                        <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ selectedTab: 0 }, () => { this.addSubContact() }) }}
                          style={[{ flex: 1, height: 42, justifyContent: 'center', backgroundColor: Colors.green_start, borderRadius: 42 / 2, marginEnd: 8 }]}>

                          <Text style={[styles.tab_text, font_style.font_medium, { color: Colors.white_color }]}>Add Contact</Text>

                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ selectedTab: 1 }, () => { this.setSubContactasMainContact() }) }}
                          style={[{ flex: 1, height: 42, justifyContent: 'center', backgroundColor: Colors.primaryColor, borderRadius: 42 / 2, marginStart: 8 }]}>

                          <Text style={[styles.tab_text, font_style.font_medium, { color: Colors.white_color }]}>Set as Main Contact</Text>

                        </TouchableOpacity>

                      </View>



                      <View>

                        <Text style={[styles.text_style1]}>Set As Main:</Text>


                        <View style={{ marginTop: 10, height: 24, marginBottom: 10, }}>

                          <Switch
                            trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                            style={{ height: 20, width: 40, }}
                            onValueChange={(value) => this.toggleSwitchSetMain(value)}
                            value={this.state.setmainTogglevalue}
                          />

                        </View>

                        <Text style={[styles.text_style1]}>Title:</Text>

                        <View activeOpacity={1} style={[styles.dropdown_view]}>

                          <View style={styles.img_view}>

                            <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                          </View>

                          <Dropdown
                            containerStyle={styles.dropdown_container}
                            pickerStyle={{
                              width: '92%', backgroundColor: Colors.primaryColor, marginLeft: 16, marginTop: 60, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
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
                            textColor={'#222222'}
                            itemColor='#222222'
                            baseColor='#ffffff00'
                            dropdownOffset={{ top: 10, bottom: 0 }}
                            dropdownPosition={0}
                            itemCount={5}
                            dropdownMargins={{ min: 0, max: 0 }}
                            data={(this.state.subContactState) ? this.state.title : []}
                            value={this.state.sub_title}
                            onChangeText={(value) => { this.setState({ sub_title: value }) }}
                          />

                        </View>

                        <Text style={[styles.text_style1]}>First Name:</Text>

                        <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(value) => this.setState({ sub_firstname: value })}
                            value={this.state.sub_firstname}
                            placeholderTextColor={Colors.black_color}
                          />

                        </View>

                        <Text style={[styles.text_style1]}>Last Name:</Text>

                        <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(value) => this.setState({ sub_lastname: value })}
                            value={this.state.sub_lastname}
                            placeholderTextColor={Colors.black_color}
                          />

                        </View>

                        <Text style={[styles.text_style1]}>Office Number:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_office_no: value })}
                          value={this.state.sub_office_no}
                          placeholderTextColor={Colors.black_color}
                          keyboardType='numeric'
                        />

                        <Text style={[styles.text_style1]}>Extention Number:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_extention_no: value })}
                          value={this.state.sub_extention_no}
                          placeholderTextColor={Colors.black_color}
                          keyboardType='numeric'
                        />
                        <Text style={[styles.text_style1]}>Home Number:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_home_no: value })}
                          value={this.state.sub_home_no}
                          placeholderTextColor={Colors.black_color}
                          keyboardType='numeric'
                        />

                        <Text style={[styles.text_style1]}>Mobile Number:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_mobile_no: value })}
                          value={this.state.sub_mobile_no}
                          placeholderTextColor={Colors.black_color}
                          keyboardType='numeric'
                        />

                        <Text style={[styles.text_style1]}>Email:</Text>

                        <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(value) => this.setState({ subemail: value })}
                            value={this.state.subemail}
                            placeholder={this.state.subContactDetail.subemail}
                            placeholderTextColor={Colors.black_color}
                          />

                        </View>

                        <Text style={[styles.text_style1]}>Address:</Text>

                        <View style={{ marginTop: 5, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[{ height: 100, textAlignVertical: 'top', color: '#222222', marginTop: 10, marginLeft: 16, fontSize: 14 }]}
                            onChangeText={(value) => this.setState({ sub_address: value })}
                            value={this.state.sub_address}
                            multiline={true}
                            placeholderTextColor='#222222'
                          />

                        </View>

                        <Text style={[styles.text_style1]}>City:</Text>

                        <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(value) => this.setState({ subcity: value })}
                            value={this.state.subcity}
                            placeholderTextColor={Colors.black_color}
                          />

                        </View>

                        <Text style={[styles.text_style1]}>State:</Text>

                        <View style={{ marginTop: 5, height: 42, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(value) => this.setState({ subState: value })}
                            value={this.state.subState}
                            placeholderTextColor={Colors.black_color}
                          />

                        </View>
                        <Text style={[styles.text_style1]}>Country:</Text>
                        {/* {(this.state.renderSelectedItemState) ?

                        this.renderSelectedItem()
                        : */}
                        <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, position: 'relative' }}>
                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(searchSubCountry) => this.onSearchSubCountry(searchSubCountry)}
                            value={this.state.SelectedSubCountryName ? this.state.SelectedSubCountryName : this.state.searchSubCountry}
                            placeholderTextColor={Colors.black_color}
                          />
                          <View style={{ position: 'absolute', top: 13, right: 13 }}>
                            <TouchableOpacity onPress={() => { this.onSubCountryArrowClick() }} style={{ width: 20 }}>

                              <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />

                            </TouchableOpacity>
                          </View>
                        </View>
                        {/* } */}

                        {
                          this.state.SearchSubCountryState ?
                          <View style={{height:(this.state.SubCountryArray.length>8 ?390:null),marginTop: 6,
                            borderWidth: (this.state.SubCountryArray.length==0 ?0:2),
                            borderColor: Colors.lightGray,
                            borderRadius: 40 / 2,}}>
                            <FlatList
                              // contentContainerStyle={{}}
                              nestedScrollEnabled={true}
                              keyboardShouldPersistTaps='handled'
                              data={this.state.SubCountryArray}

                              keyExtractor={(item, index) => { return item.id + "" + index }}
                              renderItem={({ item }) => this.DisplaySubCountryList(item)}

                            />
                          </View>
                            : null}
                        {/* <Text style={[styles.text_style1]}>Country:</Text>

                        <View activeOpacity={1} style={[styles.dropdown_view, { marginTop: 4 }]}>

                          <View style={styles.img_view}>

                            <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

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
                            textColor={'#222222'}
                            itemColor='#222222'
                            baseColor='#ffffff00'
                            dropdownOffset={{ top: 10, bottom: 0 }}
                            dropdownPosition={0}
                            itemCount={5}
                            dropdownMargins={{ min: 0, max: 0 }}
                            data={(this.state.subContactState) ? this.state.Country : []}
                            value={(this.state.subContactState) ? this.state.subContactDetail.country : ''}
                            onChangeText={(value) => { this.setState({ select_sub_Country: value }) }}
                          />

                        </View> */}

                        <Text style={[styles.text_style1]}>Postal Code:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_postal_code: value })}
                          value={(this.state.sub_postal_code === undefined || this.state.sub_postal_code === null) ? '' : this.state.sub_postal_code}
                          placeholderTextColor={Colors.black_color}
                          keyboardType='numeric'
                        />

                        <Text style={[styles.text_style1]}>Company:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_company_name: value })}
                          value={this.state.sub_company_name}
                          placeholder={this.state.subContactDetail.company_name}
                          placeholderTextColor={Colors.black_color}
                        />

                        <Text style={[styles.text_style1]}>Website:</Text>

                        <TextInput
                          style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                          onChangeText={(value) => this.setState({ sub_website: value })}
                          value={this.state.sub_website}
                          // placeholder={this.state.subContactDetail.sub_website}
                          placeholderTextColor={Colors.black_color}
                        />

                        <Text style={[styles.text_style1]}>Designation:</Text>

                        <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, position: 'relative' }}>
                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(searchSubDesignation) => this.onSearchSubDesignation(searchSubDesignation)}
                            value={this.state.SelectedSubDesignationName ? this.state.SelectedSubDesignationName : this.state.searchSubDesignation}
                            placeholderTextColor={Colors.black_color}
                          />
                          <View style={{ position: 'absolute', top: 13, right: 13 }}>
                            <TouchableOpacity onPress={() => { this.onArrowSubDesignationClick() }} style={{ width: 20 }}>

                              <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />

                            </TouchableOpacity>
                          </View>
                        </View>
                        {/* } */}

                        {
                          this.state.SearchSubDesignationState ?
                          <View style={{height:(this.state.SubDesignationArray.length>8 ?390:null),marginTop: 6,
                            borderWidth: (this.state.SubDesignationArray.length==0 ?0:2),
                            borderColor: Colors.lightGray,
                            borderRadius: 40 / 2,}}>
                            <FlatList
                              // contentContainerStyle={{}}
                              nestedScrollEnabled={true}
                              keyboardShouldPersistTaps='handled'
                              data={this.state.SubDesignationArray}

                              keyExtractor={(item, index) => { return item.id + "" + index }}
                              renderItem={({ item }) => this.DisplaySubDesignationList(item)}

                            />
                          </View>
                            : null}

                        <Text style={[styles.text_style1]}>Industry:</Text>

                        <View style={{ marginTop: 10, borderRadius: 46 / 2, backgroundColor: Colors.white_shade, position: 'relative' }}>
                          <TextInput
                            style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                            onChangeText={(searchSubIndustry) => this.onSearchSubIndustry(searchSubIndustry)}
                            value={this.state.SelectedSubIndustryName ? this.state.SelectedSubIndustryName : this.state.searchSubIndustry}
                            placeholderTextColor={Colors.black_color}
                          />
                          <View style={{ position: 'absolute', top: 13, right: 13 }}>
                            <TouchableOpacity onPress={() => { this.onArrowSubIndustryClick() }} style={{ width: 20 }}>

                              <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />

                            </TouchableOpacity>
                          </View>
                        </View>
                        {/* } */}

                        {
                          this.state.SearchSubIndustryState ?
                          <View style={{height:(this.state.SubIndustryArray.length>8 ?390:null),marginTop: 6,
                            borderWidth: (this.state.SubIndustryArray.length==0 ?0:2),
                            borderColor: Colors.lightGray,
                            borderRadius: 40 / 2,}}>
                            <FlatList
                              // contentContainerStyle={{}}
                              nestedScrollEnabled={true}
                              keyboardShouldPersistTaps='handled'
                              data={this.state.SubIndustryArray}

                              keyExtractor={(item, index) => { return item.id + "" + index }}
                              renderItem={({ item }) => this.DisplaySubIndustryList(item)}

                            />
                          </View>
                            : null}
                        {/* <Text style={[styles.text_style1]}>Industry:</Text>

                        <View activeOpacity={1} style={[styles.dropdown_view, { marginTop: 4 }]}>

                          <View style={styles.img_view}>

                            <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

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
                            textColor={'#222222'}
                            itemColor='#222222'
                            selectedItemColor='#222222'
                            baseColor='#ffffff00'
                            dropdownOffset={{ top: 10, bottom: 0 }}
                            dropdownPosition={0}
                            itemCount={5}
                            dropdownMargins={{ min: 0, max: 0 }}
                            data={(this.state.subContactState) ? this.state.industry : []}
                            value={(this.state.subContactState) ? this.state.subContactDetail.industry : ''}
                            onChangeText={(value) => { this.setState({ select_sub_industry: value }) }}
                          />

                        </View> */}

                        <Text style={[styles.text_style1]}>Product &amp; Services:</Text>

                        <TagInput
                          style={{
                            width: '103%', color: '#222222', fontSize: 14, fontWeight: '400',
                            marginLeft: -7,
                            paddingTop: 10,
                            paddingStart: 10,
                            borderRadius: 21,
                            backgroundColor: Colors.white_shade,
                            fontFamily: 'Helvetica-Light',
                          }}
                          label='Enter Products and services Here'
                          updateState={this.updateSubTagState}
                          tags={this.state.subtags}
                          // tagStyle={{borderWidth:3,borderColor:'red', }}
                          tagStyle={styles.tag}
                        />

                        <Text style={[styles.text_style1]}>Remarks:</Text>

                        <View style={{ marginTop: 5, borderRadius: 42 / 2, backgroundColor: Colors.white_shade, }}>

                          <TextInput
                            style={[textInput.gray_textInput, { height: 100, textAlignVertical: 'top', color: '#222222', marginTop: 10, fontSize: 14 }]}
                            onChangeText={(value) => this.setState({ sub_remarks: value })}
                            value={this.state.sub_remarks}
                            placeholder='Enter Remarks'
                            multiline={true}
                            placeholderTextColor={Colors.black_color}
                          />

                        </View>

                      </View>

                    </View>
                }

              </View>

            </SafeAreaView>

          </ScrollView>

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

      </KeyboardAwareScrollView>
    );
  }

}


// Styling Code for UI Elements

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

  multiSelectContainer: {

    height: 400,
    width: '80%',
    backgroundColor: '#0000'

  },

  main_container: {

    flex: 1,
    backgroundColor: Colors.white_color,

  },

  container: {

    flex: 1,
    backgroundColor: Colors.bg_color,

  },

  searchInput: {

    height: 50,
    borderColor: '#f2f2f2',
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: '#fff'

  },

  listItem: {

    width: '100%',
    flexDirection: 'row',
    height: 55,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',

  },

  listItemText: {

    fontSize: 14

  },

  tag: {
    backgroundColor: Colors.primaryColor,
    color: Colors.white_color,

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

  followTimeRectangle3: {

    height: 46,
    width: '100%',
    borderRadius: 46 / 2,
    alignContent: 'center',
    borderStyle: 'solid',
    borderWidth: 2,

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

  },
  large_text_style: {
    width: '65%',
    flex: 1,
    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },

  dropdown_view: {

    height: 42,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 42 / 2, paddingEnd: 16

  },

  dropdown_view1: {

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
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '400',

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
