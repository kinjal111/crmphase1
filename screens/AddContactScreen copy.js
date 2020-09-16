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
import SearchableDropdown from 'react-native-searchable-dropdown';

// Define the default value of tabvalue

const tabvalue = 0;

export default class AddContactScreen extends React.PureComponent {

  // Display Header and It's elements and functionality of header elements 

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.add_Contact}</Text>,

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
        onPress={() => { navigation.getParam('addContact')(); }} >

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,

  });


  // Initilize the State variable 

  constructor() {
    super();

    this.fetchLeadGroup = this.fetchLeadGroup.bind(this);

    this.state = {
      isvisible: false,
      Contact_type: [
        { label: 'Prospect', value: 'prospect' },
        { label: 'Client', value: 'client' },
        { label: 'Lead', value: 'lead' },
      ],
      select_Contact_Type: '',
      receiveMarketingToggleValue: 0,
      isLoading: true,
      select_industry: '',
      UserData: '',
      leadGroupData: [],
      selectedLeadGroup: '',
      ProfileData: '',
      tags: {
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
      select_title: '',
      DataState: false,
      switchValue: false,
      selectedItems: [],
      saveToPhoneBook: false,
      DisplayDuplicatePopup: false,
      DuplicateDataState: false,
      set_Main_Contact: 0,
      confirm_sub_Contact: 0,
      dummyCountry:[],
      countryArrDaate:[],
      SelectedCountryName: '',
      SearchCountryState: false,
      SearchDesignationState: false,
      SearchIndustryState:false,
      searchDesignation: '',
      searchIndustry:'',
      SelectedDesignationName: '',
      SelectedIndustryName:'',
      IndustryArray:[],
      search:'',
      CountryArray:[],

    }
  }

  // set the selected tags in tags variable to update the Tags of Contact

  updateTagState = (state) => {

    this.setState({ tags: state });
    console.warn("Tags", this.state.tags);

  };

  // get the Default Data for Calling api method init and then change the key or structure of Data to make dropdown supported by cll modify keys

  componentDidMount = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const { navigation } = this.props

      navigation.setParams({ addContact: this.addContact });

      var UserData = this.props.navigation.getParam('contactData')
      this.setState({ SearchCountryState: false });
      this.setState({ SearchDesignationState: false });
      this.setState({ SearchIndustryState: false });
      this.setState({ UserData: UserData })

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
            console.warn('countries : ' , str.countries);
            // var arr= str.countries;
            // var countryArr = [];
            // for(var i=0;i<arr.length;i++){
            //     countryArr.push({id:(i + 1),name:arr[i]})
            // }
            // console.warn('second arr : ' , countryArr)
            // this.setState({countryArrDaate:countryArr});
            this.setState({ industry: str.contact_industries, title: str.contact_titles, Country:str.countries, designation: str.contact_designations, DataState: true }, () => { this.modifyKeys() });
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
        () => { this.fetchLeadGroup() })
    })
  }

  // for Fetch Lead Group Data by calling api method lead_groups 

  fetchLeadGroup = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'lead_groups');
      formData.append('company_id', this.state.UserData.Company_id);
      formData.append('user_id', this.state.UserData.user_id)

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
            // alert(JSON.stringify(str))
            this.setState({ isLoading: false, leadGroupData: str.lead_groups, }, () => { this.modifyLeadUserKey() });

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

  // modify Lead user Data in which keys id change to the value and name keys change to the label 

  modifyLeadUserKey() {

    var item = this.state.leadGroupData

    if (this.state.leadGroupData == [] || this.state.leadGroupData === undefined || this.state.leadGroupData === '') {

    }
    else {
      item.map((val) => {

        // val.value = val.id;
        // val.label = val.name;
        // delete val.name
        // delete val.id



      })

      this.setState({ leadGroupData: item, selectedLeadGroup: [item[0].id] })

    }

  }



  // Add Contact by calling api method add_contact

  addContact = async () => {
    let Product_Services = this.state.tags.tagsArray.toString();
    console.warn("Product Servicers", Product_Services);

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'add_contact');
      formData.append('contact_type', this.state.select_Contact_Type);
      formData.append('company_id', this.state.UserData.Company_id);
      formData.append('first_name', this.state.firstname);
      formData.append('last_name', this.state.lastname);
      formData.append('company_name', this.state.company);
      formData.append('designation', this.state.select_designation);
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
      formData.append('country', this.state.select_country);
      formData.append('industry', this.state.select_industry);
      formData.append('products_services', Product_Services);
      formData.append('website', this.state.website);
      formData.append('remarks', this.state.remarks);
      if (this.state.recieveMarketing == true) {
        let value = 1;
        formData.append('receive_telemktg', value);
      }
      else {
        let val = 0;
        formData.append('receive_telemktg', val);
      }

      formData.append('confirm_add_as_sub_contact', this.state.confirm_sub_Contact);
      formData.append('set_as_main_contact', this.state.set_Main_Contact);

      if (this.state.select_Contact_Type === 'lead') {
        formData.append('lead_group_id', this.state.selectedLeadGroup);

      }
      else if (this.state.select_Contact_Type === 'prospect' || this.state.select_Contact_Type === 'client') {
        formData.append('user_id', this.state.UserData.user_id);

      }
      console.warn("Formadata Contact", formData);
      if (this.state.select_Contact_Type === '' || this.state.UserData.Company_id === '') {

        showMessage({
          message: "",
          description: "Contact Type and Company Id must Be Added",
          type: "danger",
        });
      }

      else {
        console.warn("Formadat", formData);
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

            console.warn("String123", str);
            if (str.error === "Duplicate contact found.") {

              this.setState({ DuplicateData: str.duplicate_contact_data, DisplayDuplicatePopup: true, DuplicateDataState: true }, () => { })
            }


            if (str.status === true) {
              console.warn("String ContactC...", str);
              if (this.state.set_Main_Contact === 0 && this.state.confirm_sub_Contact === 0) {

                showMessage({
                  message: "",
                  description: "Contact successfully Added",
                  type: "success",
                });
                this.props.navigation.goBack(null)

              }
              else if (this.state.confirm_sub_Contact === 1 && this.state.set_Main_Contact === 0) {
                showMessage({
                  message: "",
                  description: "Contact successfully Created as Sub-Contact",
                  type: "success",
                });
                this.props.navigation.goBack(null)

              }

              else if (this.state.confirm_sub_Contact === 1 && this.state.set_Main_Contact === 1) {
                showMessage({
                  message: "",
                  description: "Contact successfully Created as Sub-Contact and Set as Main Contact ",
                  type: "success",
                });
                this.props.navigation.goBack(null)

              }

            }



          })
          .catch(error => {

            this.setState({ isLoading: false }, () => { });
          }
          )
      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }
  onArrowClick() {
    let arr = this.state.Country;
    this.setState({ CountryArray: arr });
    //  console.warn("Country Array...",this.state.Country);
    this.setState({ SearchCountryState: true });
  }
  onSearchCountry(search) {
    this.setState({ SelectedCountryName: '' });
    this.setState({ search: search });
    this.setState({ SearchCountryState: true });
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
  // Toggle Visibility of Update App Notification prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  onLeadGroupItemsChange = (selectedAssignItems) => {

    this.setState({ selectedLeadGroup: selectedAssignItems });

  };

  // Toggle Value of Switch recieve Marketing Switch

  toggleSwitch = (value) => {

    this.setState({ recieveMarketing: value })

  }

  toggleSaveToPhoneBookSwitch = (value) => {

    this.setState({ saveToPhoneBook: value })

  }

  render() {

    return (

      <KeyboardAwareScrollView>

        <View style={styles.main_container}>

          <ScrollView style={styles.main_container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>

            <SafeAreaView>

              <View style={{ marginTop: 10, backgroundColor: Colors.white_color, paddingTop: 2, paddingBottom: 20 }}>

                <View style={{ paddingStart: 16, paddingEnd: 16 }}>

                  <Text style={[styles.text_style1]}>Contact Category:</Text>

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
                      data={this.state.Contact_type}
                      value={this.state.select_Contact_Type}
                      onChangeText={(value) => { this.setState({ select_Contact_Type: value }) }}
                    />

                  </View>

                  {(this.state.select_Contact_Type === 'lead') ?

                    <View>

                      <Text style={[styles.text_style1]}>Lead Group:</Text>

                      <View activeOpacity={1} style={[styles.dropdown_view1, { marginTop: 10 }]}>

                        <SectionedMultiSelect
                          items={this.state.leadGroupData}
                          uniqueKey="id"
                          subKey="children"
                          selectText="Select Lead Group"
                          searchPlaceholderText="Search Lead Group"
                          selectedText=''
                          hideSelect={false}
                          single={true}
                          showDropDowns={false}
                          readOnlyHeadings={false}
                          expandDropDowns={false}
                          animateDropDowns={true}
                          hideConfirm={true}
                          chipRemoveIconComponent={<Image source={require('../assets/images/close.png')}
                            style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />}
                          modalWithSafeAreaView={false}
                          styles={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 21 }}
                          onSelectedItemsChange={this.onLeadGroupItemsChange}
                          selectedItems={this.state.selectedLeadGroup}
                          chipsPosition='top'
                          chipColor={Colors.primaryColor}
                          subItemFontFamily='Helvetica-Nue'
                          itemFontFamily='Helvetica-Nue'
                          searchTextFontFamily='Helvetica-Nue'
                          confirmFontFamily='Helvetica-Nue'
                          colors={Colors.primaryColor}
                          chipContainer={{ borderColor: '#222222' }}

                        />

                      </View>

                      <Text style={[styles.text_style1]}>Save to PhoneBook:</Text>

                      <View style={{ height: 24, marginBottom: 10, }}>

                        <Switch
                          trackColor={{ true: Colors.primaryColor, false: Colors.white_color }}
                          style={{ marginTop: 4, height: 24, }}
                          onValueChange={(value) => this.toggleSaveToPhoneBookSwitch(value)}
                          value={this.state.saveToPhoneBook}
                        />

                      </View>

                    </View>

                    :

                    null

                  }

                  <Text style={[styles.text_style1]}>Title:</Text>

                  <View activeOpacity={1} style={[styles.dropdown_view, { marginTop: 4 }]}>

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

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
                        marginLeft: 20,
                        borderBottomColor: 'transparent',
                        justifyContent: 'center',
                      }}
                      selectedItemColor='#222222'
                      textColor='#222222'
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

                  <Text style={[styles.text_style1]}>Designation:</Text>

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
                      data={(this.state.DataState) ? this.state.designation : []}
                      value={this.state.ProfileData.designation}
                      onChangeText={(value) => { this.setState({ select_designation: value }) }}
                    />

                  </View>

                  <Text style={[styles.text_style1]}>Company:</Text>

                  <TextInput
                    style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                    onChangeText={(value) => this.setState({ company: value })}
                    value={this.state.company}
                    placeholder={this.state.ProfileData.company_name}
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

                  <Text style={[styles.text_style1]}>City/Town:</Text>

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
                        />
                        <View style={{ position: 'absolute', top: 13, right: 13 }}>
                          <TouchableOpacity onPress={() => { this.onArrowClick() }} style={{ width: 20 }}>

                            <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color, }]} resizeMode="contain" />

                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* } */}

                      {
                        this.state.SearchCountryState ?

                          <FlatList
                            contentContainerStyle={{
                              marginTop: 6,
                              borderWidth: 2,
                              borderColor: Colors.lightGray,
                              borderRadius: 40 / 2,
                            }}

                            keyboardShouldPersistTaps='handled'
                            data={this.state.CountryArray}

                            keyExtractor={(item, index) => { return item.id + "" + index }}
                            renderItem={({ item }) => this.DisplayContactandCompanyList(item)}

                          />

                          : null}




                 

                  <Text style={[styles.text_style1]}>Postal Code:</Text>

                  <TextInput
                    style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                    onChangeText={(value) => this.setState({ postal_code: value })}
                    value={this.state.postal_code}
                    placeholder={this.state.postal_code}
                    placeholderTextColor={Colors.black_color}
                    keyboardType='numeric'
                  />



                  <Text style={[styles.text_style1]}>Website:</Text>

                  <TextInput
                    style={[textInput.gray_textInput, { color: '#222222', marginTop: 4, height: 42, fontSize: 14, fontWeight: '400', }]}
                    onChangeText={(value) => this.setState({ website: value })}
                    value={this.state.website}
                    placeholder={this.state.ProfileData.website}
                    placeholderTextColor={Colors.black_color}
                  />



                  <Text style={[styles.text_style1]}>Industry:</Text>

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

                  </View>

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
                      style={[{ height: 100, textAlignVertical: 'top', color: '#222222', marginTop: 10, marginLeft: 16, fontSize: 14 }]}
                      onChangeText={(value) => this.setState({ remarks: value })}
                      value={this.state.remarks}
                      placeholder='Enter Remarks'
                      multiline={true}
                      placeholderTextColor={Colors.black_color}
                    />

                  </View>

                </View>

              </View>

            </SafeAreaView>

          </ScrollView>

          {/* Overlay for Duplicate Contact Data Prompt */}

          <Overlay
            isVisible={this.state.DisplayDuplicatePopup}
            windowBackgroundColor="rgba(0, 0, 0, 0.5)"
            overlayBackgroundColor="white"
            width="90%"
            height="60%"
          >

            <View>

              <View style={{ marginVertical: 10, flexDirection: 'row' }}>

                <Text style={styles.duplicateContact}>Duplicate Contact Found</Text>
                {/* <Text style={styles.thisApp}>This app version 10.0.3.1 is no longer Supported.</Text> */}

                <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', marginEnd: 20 }}
                  onPress={() => { this.setState({ DisplayDuplicatePopup: false }) }}>

                  <Text style={[styles.Crosstext]}>X</Text>

                </TouchableOpacity>

              </View>

              <View style={{ borderWidth: 0.3, borderColor: '#f566a5' }} />

              <View Style={{ marginVertical: 10, width: '100%', backgroundColor: '#f566a5' }}>

                <Text style={styles.duplicateContact, { color: '#222', marginVertical: 20, marginLeft: 16, fontSize: 16, }}>{(!this.state.DuplicateDataState) ? 'Existing Contact Found named Under ' : 'Existing Contact Found named ' + this.state.DuplicateData.first_name + ' ' + this.state.DuplicateData.last_name + ' under ' + this.state.DuplicateData.company_name}</Text>

                <Text style={styles.duplicateContact, { color: '#222', marginBottom: 20, marginLeft: 16, fontSize: 16, }}>{(!this.state.DuplicateDataState) ? 'Contact owner(s): ' : 'Contact owner(s): ' + this.state.DuplicateData.contact_owners}</Text>

              </View>

              <View style={{ borderWidth: 0.3, borderColor: '#f566a5' }} />

              <TouchableOpacity style={{ marginVertical: 10, marginLeft: 16, width: '90%', height: 40, backgroundColor: '#f566a5' }} onPress={() => { this.setState({ DisplayDuplicatePopup: false }) }}>

                <Text style={[styles.cancel_txt, font_style.font_medium,]}>Cancel</Text>

              </TouchableOpacity>

              <TouchableOpacity style={{ width: '90%', height: 40, marginLeft: 16, marginVertical: 10, backgroundColor: Colors.purpule_start }}
                onPress={() => { this.setState({ confirm_sub_Contact: 1, DisplayDuplicatePopup: false }, () => { this.addContact() }) }}>

                <Text style={[styles.cancel_txt, font_style.font_medium,]}>Create as Sub-Contact</Text>

              </TouchableOpacity>

              <TouchableOpacity style={{ width: '90%', height: 40, marginLeft: 16, marginVertical: 10, backgroundColor: Colors.light_blue }}
                onPress={() => { this.setState({ confirm_sub_Contact: 1, set_Main_Contact: 1, DisplayDuplicatePopup: false }, () => { this.addContact() }) }}>

                <Text style={[styles.cancel_txt, font_style.font_medium,]}>Create as Sub-Contact and Set as Main Contact</Text>

              </TouchableOpacity>


            </View>

          </Overlay>

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

  dropdown_view: {

    height: 42,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 42 / 2, paddingEnd: 16

  },

  dropdown_view1: {

    flex: 1,
    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 46 / 2, paddingEnd: 16,
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

  duplicateContact: {

    marginLeft: 16,
    // marginEnd: 20,
    justifyContent: 'flex-start',
    textAlign: 'center',
    color: '#f566a5',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

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
  Crosstext: {

    flex: 1,
    textAlign: 'right',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    color: '#f566a5',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '500',

  },

  cancel_txt: {

    flex: 1,
    marginTop: 13,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',

  },

});
