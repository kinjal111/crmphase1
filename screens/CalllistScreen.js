import React, { Component, Fragment } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  View,
  Keyboard,
  FlatList,
  RefreshControl,
  TouchableHighlight,
  ImageBackground,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { textHeader, font_style } from '../components/styles';
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown, } from 'react-native-material-dropdown';
import { SafeAreaView } from 'react-navigation';
import { Searchbar } from 'react-native-paper';
import ActionSheet from 'react-native-actionsheet';
import { CheckBox, Overlay, Tooltip, } from 'react-native-elements';
import { apiBasePath } from '../constantApi';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';
import NetworkUtils from '../components/NetworkUtils';



let currentTime = moment();


export default class CalllistScreen extends React.PureComponent {

  // Disable Default Header 

  static navigationOptions = ({ navigation }) => ({

    headerShown: false,

  });

  // Initilize the Default State and Global Variable

  constructor() {
    super();
    this.mounted = false;
    // this.onEndReachedCalledDuringMomentum = true;
    this.arrayHolder = [];
    this.state = {
      enable: true,
      overdue: false,
      isvisible: false,
      LoginUserDetail: '',
      DropdownVisible: false,
      selectedTab: 1,
      currentPageNo: 1,
      lastPageNo: 1,
      isLoading: true,
      toolVisible: false,
      Prospectchecked: false,
      Clientchecked: false,
      Leadchecked: false,
      initialData: [],
      contactListData: '',
      leadGroupData: [],
      getContactData: [],
      UserState: false,
      getFollowupData: '',
      selectedAssignItem: [],
      contactData: false,
      select_leadList: '',
      userData: [],
      ExtensionData: '',
      select_companyid: '',
      select_Extension: '',
      select_userid: '',
      category: 'all',
      status: [
        { label: 'All', value: 'all' },
        { label: 'Not Call Yet', value: 'ncy' },
        { label: 'Unavailable', value: 'unavailable' },
        { label: 'Success', value: 'success' },
        { label: 'Invalid Number', value: 'invalidno' }
      ],

      user_client: [
      ],
      AllUserData: [],
      ProspectUserData: '',
      ClientUserData: '',
      LeadUserData: '',
      itemHeight: 0,
      ShowFooter: true,
      loadMorePage: true,
      select_company: '',
      select_user: '',
      select_call_status: 'all',
      select_lead_user: '',
      PickerValueHolder: '',
      search: '',
      subsearch: '',
      selectedButton: 'all_followups',
      Number: '',
      NumbertoCall: '',
      refresh: false,
      followup_category: 'prospect,client,lead'

    }
  }

  // Get the Company Data by calling Api Method init when page is Load 

  componentDidMount = async () => {

    // _this = this
    this.mounted = true;

    let PreviousScreen = this.props.navigation.getParam('Screen')

    if (PreviousScreen === 'Menu') {

      let category = this.props.navigation.getParam('Category')
      let selectedbutton = this.props.navigation.getParam('selectedButton')
      let selectedTab = this.props.navigation.getParam('selectedtab')
      let followup_category = this.props.navigation.getParam('followup_Category')

      this.setState({ selectedTab: selectedTab, selectedButton: selectedbutton, category: category, followup_category: followup_category, currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') })


    }

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'init');

      if (this.mounted) {

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
              this.props.navigation.navigate('SignUp');

            }
            else {

              this.setState({ isLoading: false, LoginUserDetail: str.user_details, initialData: str.company_access }, () => { this.modifyCompanyAccessKey(), this.fetch_Extension_Data() });

            }

          })
          .catch(error => {

            this.setState({ isLoading: false });
          }
          )
      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }


  // Search And filter the Contact List Json Array Data by compare the SearchText Input Argument Of Method

  searchTextChange(SearchText) {

    if (this.state.getContactData === null || this.state.getContactData === undefined || this.state.getContactData === [] || this.state.getContactdata == 0) {

    }

    else {

      var contactItem = this.arrayHolder
      var temp = []

      if (SearchText === '' || this.state.search === '') {

        result = this.arrayHolder

      }

      var result = contactItem.filter(item => {

        const itemData = `${item.first_name.toUpperCase()}   
        
        ${item.company_name.toUpperCase()} ${(item.stage === undefined || item.stage === null) ? null : item.stage.toUpperCase()}`;

        const textData = SearchText.toUpperCase();

        return itemData.indexOf(textData) > -1;

      })

    }

    this.setState({ search: SearchText, getContactData: result }, () => { })

  }

  // fetch Contact List Access user Data by calling api method contact_list_access

  fetchConcatListAccess = async () => {

    await AsyncStorage.setItem(Constant.selectedCompany, this.state.select_company);

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'contact_list_access');
      formData.append('company_id', this.state.select_company);

      if (this.mounted) {

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

              this.setState({ isLoading: false, contactListData: str }, () => { this.modifyContactListKey() });
            }

          })
          .catch(error => {

            this.setState({ isLoading: false });
          }
          )
      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }

  // fetch the Phone extension Data For Extension Dropdown

  fetch_Extension_Data = async () => {

    let value = this.context;

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_phone_exts');

      if (this.mounted) {

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

              this.setState({ ExtensionData: str }, () => { this.modifyExtensionData })
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

  modifyExtensionData() {

    if (this.state.ExtensionData === [] || this.state.ExtensionData === undefined || this.state.ExtensionData === null || this.state.ExtensionData.length === 0) {

    }
    else {
      var item = this.state.ExtensionData;
      item.map((val) => {

        val.value = val.extension_number;
        val.label = val.name;




      })
      this.setState({ ExtensionData: item, select_Extension: item[0].value })
    }

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
      formData.append('company_id', this.state.select_company);
      formData.append('user_id', this.state.select_user)

      if (this.mounted) {


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

              this.setState({ isLoading: false, leadGroupData: str.lead_groups, }, () => { this.modifyLeadUserKey() });

            }

          })
          .catch(error => {


            this.setState({ isLoading: false });
          }
          )

      }

    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }

  // for fetch the Contact List Data by Calling the api method get_contacts when the selected tab is contacts 

  fetchGetContacts = async (source) => {

    console.warn('fetchGetContacts : ', source)
    var selectedLeadGroup = this.state.selectedAssignItem
    let selectedLeadGrouptoApi = '';
    selectedLeadGrouptoApi = selectedLeadGroup[0]
    // this.setState({ ShowFooter: true,refresh:true,isLoading:true});
    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();
    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token);
    formData.append('method', 'get_contacts');
    formData.append('company_id', this.state.select_company);
    formData.append('user_id', this.state.select_user);
    formData.append('page', this.state.currentPageNo);
    formData.append('category', this.state.category);
    formData.append('lead_group', selectedLeadGrouptoApi);
    formData.append('call_status', this.state.select_call_status)
    formData.append('search', source)

    console.warn(' ======= get Data : ', formData);
    if (this.mounted) {

      const isConnected = await NetworkUtils.isNetworkAvailable()

      if (isConnected) {


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
            console.warn("responseJson : ", responseJson)
            str = responseJson;
            if (str.error === 101) {

              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp')

            }
            else {

              if (str.contacts === []) {

                this.setState({ ShowFooter: true, refresh: false, isLoading: false });
               // console.warn('empty arr')

              }
              // else if (str.contacts.length == 0) {

              //   this.setState({ ShowFooter: true,refresh:false,isLoading:false,getContactData:[]});
              //   console.warn('empty arr 222')

              // }
              else {
                //console.warn('fill arr')
                this.setState({
                  lastPageNo: str.page, ShowFooter: false, loadMorePage: true, refresh: false, getContactData:
                    (this.state.currentPageNo === 1)
                      ? str.contacts
                      : [...this.state.getContactData, ...str.contacts],

                }, () => {
                 // console.warn(this.state.getContactData.length, responseJson.total_records)
                  if (this.state.getContactData.length == responseJson.total_records)
                    this.setState({ ShowFooter: true, refresh: false, isLoading: false });
                  this.arrayHolder = this.state.getContactData
                 // console.warn('fill arr 1123')
                });

              }

            }
          })
          .catch(error => {
           // console.warn('error......')
            this.setState({ ShowFooter: true, refresh: false, isLoading: false });
            this.setState({ isLoading: false, ShowFooter: true, loadMorePage: false, });
          }
          )
      }
      else {

        alert('Check Your Internet Connection and Try Again')

      }
    }

  }

  // for fetch the Followup List Data by Calling the api method get_followups when the selected tab is Followup 

  fetchGetFollowups = async (source) => {
   // console.warn('fetchfollowups : ', source)
    var selectedLeadGroup = this.state.selectedAssignItem
    let selectedLeadGrouptoApi = '';
    selectedLeadGrouptoApi = selectedLeadGroup[0]

    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();

    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token);
    formData.append('method', 'get_followups');
    formData.append('company_id', this.state.select_company);
    formData.append('page', this.state.currentPageNo);
    formData.append('user_id', this.state.select_user);
    formData.append('category', this.state.category);
    formData.append('lead_group', selectedLeadGrouptoApi);
    formData.append('call_status', this.state.select_call_status);
    formData.append('search', source);
    formData.append('all_followup_categ', this.state.followup_category)
    console.warn("FormData FollowUp",formData);

    if (this.mounted) {

      const isConnected = await NetworkUtils.isNetworkAvailable()

      if (isConnected) {

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

            str = responseJson;

           // console.log(JSON.stringify(str))


            if (str.error === 101) {

              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp')

            }

            else {

              if (str.followups === []) {

                this.setState({ ShowFooter: true })

              }
              else {

                this.setState({
                  getContactData:
                    this.state.currentPageNo === 1
                      ? str.followups
                      : [...this.state.getContactData, ...str.followups],
                  lastPageNo: str.page, refresh: false
                }, () => {
                  console.warn("STR LENGTH...FOLLOWS",str.followups);
                  console.warn("STR LENGTH...",str.followups.length);
                  console.warn("LENTH....",this.state.getContactData.length);
                  if (this.state.lastPageNo === this.state.currentPageNo) {
                      
                    this.setState({ ShowFooter: true , loadMorePage: false });
                   
                    console.warn("STR LENGTH...IF",str.followups.length);
                    console.warn("LENTH....IF",this.state.getContactData.length);

                  }
                  else {
                    console.warn("STR LENGTH...ELSE",str.followups.length);
                    console.warn("LENTH....ELSE",this.state.getContactData.length);
                    this.setState({ ShowFooter: false, loadMorePage: true })

                  }
                  this.arrayHolder = this.state.getContactData,
                    this.compareDateandTime()
                });

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
  }

  compareDateandTime() {

    if (this.state.getContactData === [] || this.state.getContactData === undefined) {

    }
    else {
      var item = this.state.getContactData
      let datum;
      var CurrentDate = currentTime.format('dd/mm/yyyy')

      item.map(val => {

        if (val.followup_datetime) {

          val.Time = val.followup_datetime.substring(10, val.followup_datetime.length)

          if (val.followup_datetime < CurrentDate) {

            val.color = 'red'
          }
          else {

            val.color = 'black'

          }

        }
      })

      this.setState({ getContactData: item }, () => { console.log(JSON.stringify(this.state.getContactData)) })
    }
  }

  // remove the Duplicate Key and filter JSON

  removeDuplicateKey = () => {

    if (this.state.getContactData === undefined || this.state.getContactData === null || this.state.getContactData === []) {

    }
    else {
      const newArray = [];
      this.arrayHolder.forEach(obj => {
        if (!newArray.some(o => o.id === obj.id)) {
          newArray.push({ ...obj })

        }

      });
      this.setState({ getContactData: newArray })

    }

  }

  // modify Company access Data in which keys id change to the value and name keys change to the label 

  modifyCompanyAccessKey = async () => {

    const SelectedCompany = await AsyncStorage.getItem(Constant.selectedCompany);

    if (this.state.initialData === undefined) {

    }
    else {

      var item = this.state.initialData
      item.map((val) => {

        val.value = val.id;
        val.label = val.company_name;
        delete val.company_name
        delete val.id

      })

      if (SelectedCompany === null) {

        await AsyncStorage.setItem(Constant.selectedCompany, item[0].value).then(
          this.setState({ initialData: item, select_company: item[0].value }, () => { this.fetchConcatListAccess() })

        )
      }
      else {

        await AsyncStorage.setItem(Constant.selectedCompany, SelectedCompany).then(
          this.setState({ initialData: item, select_company: SelectedCompany }, () => { this.fetchConcatListAccess() })
        )
      }

    }
  }

  // modify Lead user Data in which keys id change to the value and name keys change to the label 

  modifyLeadUserKey() {

    var item = this.state.leadGroupData

    if (this.state.leadGroupData.length == 0 || this.state.leadGroupData === undefined || this.state.leadGroupData === '') {

    }
    else {
      item.map((val) => {

        // val.value = val.id;
        // val.label = val.name;
        // delete val.name
        // delete val.id



      })

      this.setState({ leadGroupData: item, selectedAssignItem: [item[0].id], currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') })

    }

  }

  DisplayContactList = (item) => {

    return (

      <Swipeable
        renderLeftActions={this.renderLeftActions.bind(item, item)}
        renderRightActions={this.renderRightActions.bind(item, item)}
      >

        <View
          style={styles.rowFront}>

          <TouchableOpacity activeOpacity={1}
            onPress={() => { this.storeContactData(item, 'Prospects') }}>

            <View style={{ marginTop: 10, borderRadius: 5, backgroundColor: Colors.white_color, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', padding: 8, flexWrap: 'wrap', width: Dimensions.get('window').width - 25 }}>

              <Text style={[styles.text_style, { flex: 0.8, alignSelf: 'flex-start' }]}>{item.first_name} {item.last_name}</Text>
              <Text style={[styles.text_style, { flex: 1.2, marginLeft: 20, }]}>{item.company_name}</Text>

              <View style={{ flex: 1.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                <Tooltip
                  ref={ref => (this.tooltip = ref)}
                  contentStyle={{ background: '#ffffff', borderRadius: 10, borderWidth: 2 }}
                  height={heightPercentageToDP('15%')}
                  width={widthPercentageToDP('60%')}
                  backgroundColor='#fff'
                  popover=

                  {

                    <View>

                      <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                        onPress={() => {
                          this.setState({ NumbertoCall: item.office_number }, () => {
                            this.showActionSheet(), this.tooltip.toggleTooltip();
                          })
                        }} >

                        <View style={{ flexDirection: 'row' }}>

                          <Text style={{ fontSize: 14, color: Colors.primaryColor, fontWeight: '700' }}>Office Number:</Text>
                          <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>{(item.office_number === 'null' || item.office_number === 'undefined' || item.office_number === undefined || item.office_number === null) ? ' ' : item.office_number}</Text>

                        </View>

                      </TouchableOpacity>

                      <View style={{ backgroundColor: '#2222', marginLeft: -6, marginTop: 2, width: '106%', marginBottom: 2, height: 1 }} />

                      <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                        onPress={() => { this.setState({ NumbertoCall: item.mobile_number }, () => { this.showActionSheet(), this.tooltip.toggleTooltip(); }) }} >

                        <View style={{ flexDirection: 'row' }}>

                          <Text style={{ fontSize: 14, color: Colors.primaryColor, fontWeight: '700' }}>Mobile Number:</Text>
                          <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>{(item.mobile_number === 'null' || item.mobile_number === 'undefined' || item.mobile_number === undefined || item.mobile_number === null) ? ' ' : item.mobile_number}</Text>

                        </View>

                      </TouchableOpacity>

                      <View style={{ backgroundColor: '#2222', marginLeft: -6, marginTop: 2, width: '106%', marginBottom: 2, height: 1 }} />

                      <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                        onPress={() => { this.setState({ NumbertoCall: item.ext_number }, () => { this.showActionSheet(), this.tooltip.toggleTooltip(); }) }}  >

                        <View style={{ flexDirection: 'row' }}>

                          <Text style={{ fontSize: 14, color: Colors.primaryColor, fontWeight: '700' }}>Extension Number:</Text>
                          <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>{(item.ext_number === 'null' || item.ext_number === 'undefined' || item.ext_number === undefined || item.ext_number === null) ? ' ' : item.ext_number}</Text>

                        </View>

                      </TouchableOpacity>

                    </View>
                  }
                >

                  <View style={[styles.contact_icon1]}>

                    <Image source={require('./../assets/images/call_wi_bg.png')}
                      style={{ width: 30, height: 30, }} resizeMode="contain" />

                  </View>

                </Tooltip>

                <TouchableOpacity style={[styles.contact_icon1]} title={item.email}
                  onPress={() => Linking.openURL('mailto:' + item.email)} >

                  <View style={{ flexDirection: 'row', marginLeft: 1, }}>

                    <Image source={require('./../assets/images/mail_wi_bg.png')}
                      style={{ width: 30, height: 30, }} resizeMode="contain" />

                  </View>

                </TouchableOpacity>

              </View>

              <Text style={[styles.text_style, { color: ((item.color === undefined || item.color === null) && (item.stage !== undefined)) ? Colors.black_color : item.color, flex: 1.1, marginLeft: 1 }]}>{(this.state.selectedTab === 1) ? item.stage : (item.followup_date === 'undefined' || item.followup_date === undefined || item.followup_time === 'undefined' || item.followup_time === undefined) ? '' : item.followup_date + ' ' + item.followup_time}</Text>

            </View>

          </TouchableOpacity>

        </View>

      </Swipeable>

    )
  }

  // modify contact List Data in which keys id change to the value and name keys change to the label 

  modifyContactListKey() {

    var item = this.state.contactListData
    let DefaultUserValue;

    for (var x in item) {

      item[x].map((val) => {

        val.value = val.id
        val.label = val.name
        if (val.id === this.state.LoginUserDetail.id) {
          DefaultUserValue = val.id;
        }

        delete val.name
        delete val.id

      })

    }

    this.setState({ AllUserData: item.all_followups, ProspectUserData: item.prospect, ClientUserData: item.client, LeadUserData: item.lead, select_user: DefaultUserValue, UserState: true }, () => { this.fetchLeadGroup() })

  }

  // To show the Bottom ActionSheet

  showActionSheet = () => {

    this.ActionSheet.show(),
      () => this.setState({ toolVisible: false });

  };

  // change background of the button according to the selected tab

  changePage = (tabValue) => {

    this.setState({ selectedTab: tabValue })

  }

  // change background of the button according to the selected button

  changeBG = (tabValue) => {

    this.setState({ selectedButton: tabValue })

  }

  onRefresh() {
    console.warn('onRefreshhhhhh...')
    this.setState({ currentPageNo: 1, refresh: true, ShowFooter: true }, () => {

      (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('')
    })
  }

  // Pagination section in which increment the value page p

  _handleLoadMore = () => {

    if (this.state.ShowFooter) { }
    else {
   //   console.warn("Handle More ...before")
      this.setState({

        currentPageNo: this.state.currentPageNo + 1, ShowFooter: false

      },
        () => {

          (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('')

        }
      );
   //   console.warn("Handle More After....")
    }


  };

  // render the Loader when Loading Data

  renderFooterNote = () => {

    if (this.state.ShowFooter) return null;

    else {

      return (

        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >

          <ActivityIndicator animating size='small' />

        </View>
      );
    }

  }

  // Get the selected Lead Group value And set it to the State Variable and Call Method for contact list or followup list depends on selected tab value

  onAssignSelectedItemsChange = (selectedAssignItems) => {

    this.setState({ selectedAssignItem: selectedAssignItems, currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') });

  };

  // Toggle Visibility of The Update App Notification Prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  componentWillUnmount() {

    this.mounted = false;

  }



  // store Contact Data Into async storage and also navigate to the Prospects Data with contact Data 

  storeContactData = async (item, ScreenName) => {

//console.warn('storeContactData : ======== ' , item)
    this.props.navigation.navigate(ScreenName, {categ: item.categ, Screen: 'Contacts', contactData: item, contactID: item.id, companyID: item.company_id, contact_type: item.categ, setValue: 0, tabValue: 1, category: 0, selectedTopLayerButton: 'usb' })

  }

  // Render Left Side of Buttons

  renderLeftActions = (item, index) => {

    return (

      <View style={{ marginTop: 10, flexDirection: 'row', paddingRight: 10, borderRadius: 5, marginLeft: 12, backgroundColor: Colors.white_color, justifyContent: 'center', alignItems: 'center' }}>

        <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: '#67c5f3' }, styles.contact_icon]}
          onPress={() => { this.storeContactData(item, 'AccountSettingSecond') }}>

          <Image source={require('./../assets/images/pen.png')} style={{ width: 16, height: 16, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: '#ee65a1' }, styles.contact_icon]}
          onPress={() => Linking.openURL('mailto:' + item.email)} >

          <Image source={require('./../assets/images/Mail.png')}
            style={{ width: 16, height: 16, }} resizeMode="contain" />

        </TouchableOpacity>

        <Tooltip

          ref={ref => (this.tooltip = ref)}
          contentStyle={{ background: '#ffffff', borderRadius: 10, borderWidth: 2 }}
          height={heightPercentageToDP('18%')}
          width={widthPercentageToDP('60%')}
          backgroundColor='#fff'
          popover=

          {

            <View>

              <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                onPress={() => {
                  this.setState({ NumbertoCall: item.office_number }, () => {
                    this.showActionSheet(), this.tooltip.toggleTooltip();
                  })
                }} >

                <View style={{ flexDirection: 'row' }}>

                  <Text style={{ fontSize: 14, color: Colors.primaryColor, fontWeight: '700' }}>Office Number:</Text>
                  <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>{(item.office_number === 'null' || item.office_number === 'undefined' || item.office_number === undefined || item.office_number === null) ? ' ' : item.office_number}</Text>

                </View>

              </TouchableOpacity>

              <View style={{ backgroundColor: '#2222', marginLeft: -6, marginTop: 2, width: '106%', marginBottom: 2, height: 1 }} />

              <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                onPress={() => { this.setState({ NumbertoCall: item.mobile_number }, () => { this.showActionSheet(), this.tooltip.toggleTooltip(); }) }} >

                <View style={{ flexDirection: 'row' }}>

                  <Text style={{ fontSize: 14, color: Colors.primaryColor, fontWeight: '700' }}>Mobile Number:</Text>
                  <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>{(item.mobile_number === 'null' || item.mobile_number === 'undefined' || item.mobile_number === undefined || item.mobile_number === null) ? ' ' : item.mobile_number}</Text>

                </View>

              </TouchableOpacity>

              <View style={{ backgroundColor: '#2222', marginLeft: -6, marginVertical: 10, width: '106%', marginBottom: 2, height: 1 }} />

              <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                onPress={() => { this.setState({ NumbertoCall: item.ext_number }, () => { this.showActionSheet(), this.tooltip.toggleTooltip(); }) }}  >

                <View style={{ flexDirection: 'row' }}>

                  <Text style={{ fontSize: 14, color: Colors.primaryColor, fontWeight: '700' }}>Extension Number:</Text>
                  <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>{(item.ext_number === 'null' || item.ext_number === 'undefined' || item.ext_number === undefined || item.ext_number === null) ? ' ' : item.ext_number}</Text>

                </View>

              </TouchableOpacity>

            </View>
          }
        >

          <View style={[{ backgroundColor: '#2ce0b6' }, styles.contact_icon]}>

            <Image source={require('./../assets/images/phone_call.png')}
              style={{ width: 16, height: 16, tintColor: Colors.white_color }} resizeMode="contain" />

          </View>

        </Tooltip>

      </View>
    )


  }

  // Render Right Side of Buttons

  renderRightActions = (item, index) => {

    return (

      <View style={{ marginTop: 10, flexDirection: 'row', paddingRight: 10, borderRadius: 5, marginRight: 12, backgroundColor: Colors.white_color, justifyContent: 'center', alignItems: 'center', }}>

        <TouchableOpacity activeOpacity={1} style={[{
          backgroundColor: '#25dcb1',
          borderRadius: 5, width: 50, height: 35, marginLeft: 10, justifyContent: 'center', alignContent: 'center'
        }]}
        >

          <Text style={[styles.potentialHigh]}>{(item.potential === undefined || item.potential === '' || item.potential === null) ? 'Potential: None ' : 'Potential: ' + item.potential}</Text>

        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} style={[styles.contact_icon]}
          onPress={() => { this.storeContactData(item, 'Appointment') }}>

          <Image source={require('./../assets/images/calendar_wi_bg.png')}
            style={{ width: 35, height: 35, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} style={[styles.contact_icon]}
          onPress={() => { this.storeContactData(item, 'Followup') }}>

          <Image source={require('./../assets/images/call_with_bg.png')}
            style={{ width: 35, height: 35, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} style={[styles.contact_icon]}
          onPress={() => { this.storeContactData(item, 'Opportunity') }}>

          <Image source={require('./../assets/images/dollar.png')}
            style={{ width: 35, height: 35, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>
    )


  }

  // Display The customise Header in which Dropdowns also Display

  headerRender = () => {

    return (

      <ImageBackground source={require('../assets/images/header_bg.png')} style={{ width: '100%', }}>

        <SafeAreaView>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, paddingBottom: 16, paddingStart: 16, paddingEnd: 16, }}>

            <TouchableOpacity style={[styles.top_layout], { alignSelf: 'center' }} activeOpacity={1}
              onPress={() => { this.props.navigation.goBack(null) }} >

              <Image source={require('./../assets/images/arrow-left.png')} style={{ width: 20, height: 20, justifyContent: 'center' }} resizeMode="contain" />

            </TouchableOpacity>

            <TouchableOpacity style={[styles.top_layout], { alignSelf: 'center', paddingLeft: 16, flex: 0.6 }} activeOpacity={1}
              onPress={() => { this.props.navigation.toggleDrawer(), Keyboard.dismiss() }} >

              <Image source={require('./../assets/images/menu_3x.png')}
                style={{ width: 20, height: 20, justifyContent: 'center' }} resizeMode="contain" />

            </TouchableOpacity>

            <Text style={[textHeader.header, { flex: 1 }]}>{Constant.contacts}</Text>

            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>

              {
                (this.state.DropdownVisible) ?
                  <TouchableOpacity activeOpacity={1} style={[styles.top_layout], { alignSelf: 'center', marginEnd: 10 }}
                    onPress={() => { this.setState({ DropdownVisible: false }) }} >

                    <LinearGradient
                      colors={[Colors.pink_start, Colors.pink_end]}
                      style={styles.icon_bg}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}>

                      <Image source={require('./../assets/images/filter.png')}
                        style={{ width: 20, height: 20, }} resizeMode="contain" />

                    </LinearGradient>

                  </TouchableOpacity>

                  :

                  <TouchableOpacity activeOpacity={1} style={[styles.top_layout], { alignSelf: 'center', marginEnd: 15 }}
                    onPress={() => { this.setState({ DropdownVisible: true }) }} >

                    <Image source={require('./../assets/images/filter.png')}
                      style={{ width: 20, height: 20, }} resizeMode="contain" />

                  </TouchableOpacity>

              }

              <TouchableOpacity activeOpacity={1} style={[styles.top_layout, { paddingLeft: 16, alignSelf: 'center' }]}
                onPress={() => { this.props.navigation.navigate('AddContact', { contactData: { 'Company_id': this.state.select_company, 'user_id': this.state.select_user } }) }} >

                <Image source={require('./../assets/images/3-layers.png')} style={{ width: 30, height: 30, alignSelf: 'center' }} resizeMode="contain" />

              </TouchableOpacity>

            </View>

          </View>

          {

            (this.state.DropdownVisible) ?

              <View>

                <View activeOpacity={1} style={styles.dropdown_view, { flexDirection: 'row' }}>

                  <ImageBackground source={require('../assets/images/Call_listcompany_bg.png')} style={styles.followTimeRectangle3, { marginStart: 16, width: '96%', borderRadius: 46 / 2 }} resizeMode='contain'>

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.white_color, marginTop: 16, marginEnd: 20 }]} resizeMode="contain" />

                    </View>

                    <Dropdown
                      containerStyle={styles.dropdown_container1}
                      pickerStyle={{
                        width: '92%', marginLeft: 16, marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                        shadowOffset: { width: 2, height: -4 },
                        shadowRadius: 21,
                        borderRadius: 46 / 2,
                        backgroundColor: '#ffffff',
                      }}
                      inputContainerStyle={{
                        borderBottomColor: 'transparent',
                        justifyContent: 'center',
                      }}
                      textColor='#ffffff'
                      itemColor='#222222'
                      baseColor='#ffffff00'
                      selectedItemColor='#222222'
                      dropdownPosition={0}
                      itemCount={5}
                      dropdownOffset={{ top: 10, bottom: -10 }}
                      dropdownMargins={{ min: 0, max: 0 }}
                      data={this.state.initialData}
                      value={this.state.select_company}
                      onChangeText={(value) => { this.setState({ select_company: value }, () => { this.fetchConcatListAccess() }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) }}
                    />

                  </ImageBackground>

                </View>

                <View activeOpacity={1} style={[styles.dropdown_view, styles.margin_style, { marginTop: 10 }]}>

                  <ImageBackground source={require('../assets/images/userDropdown_BG.png')} style={styles.followTimeRectangle3, { marginLeft: 10, width: '100%', height: '100%', borderRadius: 46 / 2 }} resizeMode='contain'>

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 13, tintColor: Colors.black_color }]} resizeMode="contain" />

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
                        borderBottomColor: 'transparent',
                        justifyContent: 'center',
                      }}
                      textColor='#222222'
                      itemColor='#222222'
                      baseColor='#ffffff00'
                      selectedItemColor='#222222'
                      dropdownPosition={0}
                      itemCount={5}
                      dropdownOffset={{ top: 4, bottom: 0 }}
                      dropdownMargins={{ min: 0, max: 0 }}
                      data={(this.state.UserState && (this.state.selectedButton === 'all_followups')) ? this.state.AllUserData : (this.state.UserState && (this.state.selectedButton === 'prospect')) ? this.state.ProspectUserData : (this.state.UserState && (this.state.selectedButton === 'client')) ? this.state.ClientUserData : (this.state.UserState && (this.state.selectedButton === 'lead')) ? this.state.LeadUserData : []}
                      value={this.state.select_user}
                      onChangeText={(value) => { this.setState({ select_user: value }, () => { this.fetchLeadGroup() }, () => { () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') } }) }}
                    />

                  </ImageBackground>

                </View>

                <View style={[{ flexDirection: 'row', marginTop: 12 }, styles.padding_style,]}>

                  <View activeOpacity={1} style={[{ flex: 1, marginEnd: 4, marginBottom: 12 }, styles.dropdown_view]}>

                    <ImageBackground source={require('../assets/images/statusDropdown_bg.png')} style={styles.followTimeRectangle3, { marginLeft: 10, width: '100%', height: '100%', borderRadius: 46 / 2 }} resizeMode='contain'>

                      <View style={styles.img_view}>

                        <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 13, tintColor: Colors.black_color }]} resizeMode="contain" />

                      </View>

                      <Dropdown
                        containerStyle={styles.dropdown_container}
                        pickerStyle={{
                          width: '45%', marginLeft: 16, marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
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
                        dropdownOffset={{ top: 4, bottom: 0 }}
                        dropdownMargins={{ min: 0, max: 0 }}
                        data={this.state.status}
                        value={this.state.status[0].value}
                        onChangeText={(value) => { this.setState({ select_call_status: value }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) }}
                      />

                    </ImageBackground>

                  </View>

                  <View activeOpacity={1} style={[{ flex: 1, marginStart: 4, marginBottom: 12 }, styles.dropdown_view,]}>

                    <ImageBackground source={require('../assets/images/statusDropdown_bg.png')} style={styles.followTimeRectangle3, { marginLeft: 10, width: '100%', height: '100%', borderRadius: 46 / 2 }} resizeMode='contain'>

                      <View style={styles.img_view}>

                        <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 13, tintColor: Colors.black_color }]} resizeMode="contain" />

                      </View>

                      <Dropdown
                        containerStyle={styles.dropdown_container}
                        pickerStyle={styles.picker}
                        inputContainerStyle={{
                          borderBottomColor: 'transparent',
                          justifyContent: 'flex-start',
                        }}
                        textColor='#222222'
                        itemColor='#222222'
                        baseColor='#ffffff00'
                        selectedItemColor='#222222'
                        dropdownPosition={0}
                        itemCount={5}
                        dropdownOffset={{ top: 4, bottom: 0 }}
                        dropdownMargins={{ min: 0, max: 0 }}
                        data={(this.state.ExtensionData === [] || this.state.ExtensionData === undefined || this.state.UserState === false) ? [] : this.state.ExtensionData}
                        value={(this.state.ExtensionData === [] || this.state.ExtensionData === undefined || this.state.UserState === false) ? '' : this.state.select_Extension}
                        onChangeText={(value) => { this.setState({ select_Extension: value }), () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') } }}
                      />

                    </ImageBackground>

                  </View>

                </View>

              </View>

              :

              null
          }

        </SafeAreaView>

      </ImageBackground>

    )
  }

  renderContent() {

    var optionArray = [
      'Call' + ' ' + this.state.NumbertoCall,

      'Cancel',
    ];

    return (

      <View style={styles.container}>

        <ScrollView style={styles.container}
          keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh.bind(this)} />}
        >

          <NavigationEvents
            onDidFocus={() => this.componentDidMount
              ()}

          />

          <View>

            <View style={{ backgroundColor: Colors.white_color }}>

              <View style={{ flexDirection: 'row', marginStart: 8, marginEnd: 8, marginTop: 10 }}>

                <TouchableOpacity style={[styles.top_view_btn, { flex: 1.2, marginStart: 8, marginEnd: 8, }]}
                  onPress={() => { (this.state.UserState) ? this.setState({ category: (this.state.selectedTab === 1) ? 'all' : 'all', selectedButton: 'all_followups', followup_category: 'prospect,client,lead', currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : null }} >

                  <ImageBackground source={(this.state.selectedButton === 'all_followups') ? require('../assets/images/selected.png') : require('../assets/images/Unselected.png')} style={{ width: '100%', height: '100%', borderRadius: 37, justifyContent: 'center', alignItems: 'center' }} resizeMode="contain">

                    <Text style={styles.top_view_txt}>{Constant.all}</Text>

                  </ImageBackground>

                </TouchableOpacity>

                <TouchableOpacity style={[styles.top_view_btn, { flex: 1.2, marginStart: 8, marginEnd: 8, }]}
                  onPress={() => { console.warn('prospects'); (this.state.UserState) ? this.setState({ category: 'prospect', selectedButton: 'prospect', followup_category: 'prospect', currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : null }}>

                  <ImageBackground source={(this.state.selectedButton === 'prospect') ? require('../assets/images/selected.png') : require('../assets/images/Unselected.png')} style={{ width: '100%', height: '100%', borderRadius: 37, justifyContent: 'center', alignItems: 'center' }} resizeMode="contain">

                    <Text style={styles.top_view_txt}>{Constant.prospects}</Text>

                  </ImageBackground>

                </TouchableOpacity>

                <TouchableOpacity style={[styles.top_view_btn, { flex: 1.2, marginStart: 8, marginEnd: 8, }]}
                  onPress={() => { (this.state.UserState) ? this.setState({ category: 'client', selectedButton: 'client', followup_Category: 'client', currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : null }}>

                  <ImageBackground source={(this.state.selectedButton === 'client') ? require('../assets/images/selected.png') : require('../assets/images/Unselected.png')} style={{ width: '100%', height: '100%', borderRadius: 37, justifyContent: 'center', alignItems: 'center' }} resizeMode="contain">

                    <Text style={styles.top_view_txt}>{Constant.clients}</Text>

                  </ImageBackground>

                </TouchableOpacity>

                <TouchableOpacity style={[styles.top_view_btn, { flex: 1.2, marginStart: 8, marginEnd: 8, }]}
                  onPress={() => { (this.state.UserState) ? this.setState({ category: 'lead', selectedButton: 'lead', followup_Category: 'lead', currentPageNo: 1 }, () => { this.fetchLeadGroup() }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : null }}>

                  <ImageBackground source={(this.state.selectedButton === 'lead') ? require('../assets/images/selected.png') : require('../assets/images/Unselected.png')} style={{ width: '100%', height: '100%', borderRadius: 37, justifyContent: 'center', alignItems: 'center' }} resizeMode="contain">

                    <Text style={styles.top_view_txt}>{Constant.leads}</Text>

                  </ImageBackground>

                </TouchableOpacity>

              </View>

              <View style={{ marginTop: 10, marginStart: 16, marginEnd: 16 }}>

                <Searchbar
                  transparent
                  placeholder="                  Search"
                  onChangeText={search => {
                    this.setState({ search: search, currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts(search) : this.fetchGetFollowups(search) })
                  }}
                  value={this.state.search}
                  inputStyle={{ color: '#222222' }}
                  style={styles.search}
                  autoCorrect={false}
                  onClear={search => { this.setState({ search: search, currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) }}
                />

              </View>

              {(this.state.selectedButton === 'lead') ?

                <View activeOpacity={1} style={[styles.dropdown_view1, styles.margin_style, { marginTop: 10 }]}>

                  <ImageBackground source={require('../assets/images/userDropdown_BG.png')} style={styles.followTimeRectangle3, { marginLeft: 10, width: '100%', height: '100%', borderRadius: 60, }} resizeMode='contain'>

                    <SectionedMultiSelect
                      items={this.state.leadGroupData}
                      uniqueKey="id"
                      subKey="children"
                      selectText="Select Lead User"
                      searchPlaceholderText='Search Lead User'
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
                      onSelectedItemsChange={this.onAssignSelectedItemsChange}
                      selectedItems={this.state.selectedAssignItem}
                      chipsPosition='top'
                      chipColor={Colors.primaryColor}
                      subItemFontFamily='Helvetica-Nue'
                      itemFontFamily='Helvetica-Nue'
                      searchTextFontFamily='Helvetica-Nue'
                      confirmFontFamily='Helvetica-Nue'
                      colors={Colors.primaryColor}
                      chipContainer={{ borderColor: '#222222' }}

                    />

                  </ImageBackground>

                </View>

                :

                null

              }

              <View style={{ backgroundColor: Colors.white_color, padding: 16 }}>

                <View style={{ backgroundColor: '#5cb5ec', height: 46, borderRadius: 46 / 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 4 }}>

                  <TouchableOpacity activeOpacity={1}
                    onPress={() => { this.setState({ currentPageNo: 1 }, () => { this.changePage(1), this.fetchGetContacts('') }) }}
                    style={[{ flex: 1.0, height: 40, justifyContent: 'center' }, this.state.selectedTab === 0 ? {} : { backgroundColor: Colors.white_color, borderRadius: 40 / 2, }]}>

                    <Text style={[styles.tab_text, font_style.font_medium, this.state.selectedTab === 0 ? { color: Colors.white_color } : { color: '#5cb5ec' }]}>{(this.state.selectedButton === 'all_followups') ? 'All Contacts' : (this.state.selectedButton === 'prospect') ? 'Prospect List' : (this.state.selectedButton === 'client') ? 'Client List' : (this.state.selectedButton === 'lead') ? 'Lead List' : 'All Contacts'}</Text>

                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1}
                    onPress={() => { this.setState({ currentPageNo: 1 }, () => { this.changePage(0), this.fetchGetFollowups('') }) }}
                    style={[{ flex: 1.0, height: 40, justifyContent: 'center' }, this.state.selectedTab === 1 ? {} : { backgroundColor: Colors.white_color, borderRadius: 40 / 2, }]}>

                    <Text style={[styles.tab_text, font_style.font_medium, this.state.selectedTab === 1 ? { color: Colors.white_color } : { color: '#5cb5ec' }]}>{(this.state.selectedButton === 'all_followups') ? 'All Followups' : (this.state.selectedButton === 'prospect') ? 'Followups' : (this.state.selectedButton === 'client') ? 'Followups' : (this.state.selectedButton === 'lead') ? 'Followups' : 'Followups'}</Text>

                  </TouchableOpacity>

                </View>

              </View>

              {
                (this.state.selectedButton === 'all_followups' && this.state.selectedTab !== 1) ?

                  <View style={{ flexDirection: 'row', marginTop: -16 }}>

                    <CheckBox
                      containerStyle={styles.checkbox_style}
                      title='Prospects'
                      checkedColor="#1cd5ab"
                      checkedIcon={<Image style={styles.checkbox_img, { width: 20, height: 20 }} source={require('../assets/images/tick_1.png')} />}
                      uncheckedIcon={<Image style={styles.checkbox_img, { width: 20, height: 20, }} source={require('../assets/images/Unchecked.png')} />}
                      checked={this.state.Prospectchecked}
                      fontFamily="Helvetica Neue"
                      fontWeight='400'
                      onPress={() => { (this.state.Prospectchecked === false) ? this.setState({ category: 'prospect', followup_Category: 'prospect', Prospectchecked: true, currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : this.setState({ Prospectchecked: false }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) }}
                    />

                    <CheckBox
                      containerStyle={[styles.checkbox_style]}
                      title='Clients'
                      checkedColor="#1cd5ab"
                      checkedIcon={<Image style={styles.checkbox_img, { width: 20, height: 20 }} source={require('../assets/images/tick_1.png')} />}
                      uncheckedIcon={<Image style={styles.checkbox_img, { width: 20, height: 20, }} source={require('../assets/images/Unchecked.png')} />}
                      checked={this.state.Clientchecked}
                      fontFamily="Helvetica Neue"
                      fontWeight='400'
                      onPress={() => { (this.state.Clientchecked === false) ? this.setState({ category: 'client', followup_Category: 'client', Clientchecked: true, currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : this.setState({ Clientchecked: false }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) }}
                    />

                    <CheckBox
                      containerStyle={[styles.checkbox_style]}
                      title='Leads'
                      checkedColor="#1cd5ab"
                      checkedIcon={<Image style={styles.checkbox_img, { width: 20, height: 20 }} source={require('../assets/images/tick_1.png')} />}
                      uncheckedIcon={<Image style={styles.checkbox_img, { width: 20, height: 20, }} source={require('../assets/images/Unchecked.png')} />}
                      checked={this.state.Leadchecked}
                      fontFamily="Helvetica Neue"
                      fontWeight='400'
                      onPress={() => { (this.state.UserState && this.state.Leadchecked === false) ? this.setState({ category: 'lead', followup_Category: 'lead', Leadchecked: true, selectedButton: 'lead', currentPageNo: 1 }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) : this.setState({ Leadchecked: false }, () => { (this.state.selectedTab === 1) ? this.fetchGetContacts('') : this.fetchGetFollowups('') }) }}
                    />

                  </View>
                  :
                  null
              }

              <View style={{ height: 1, backgroundColor: '#efeff4' }} />

              <View style={[{ flexDirection: 'row', marginStart: 20, marginEnd: 20, marginTop: 10, marginBottom: 10, }]}>

                <Text style={[styles.text_style, { flex: 0.8, alignSelf: 'flex-start' }]}>{Constant.name}</Text>
                <Text style={[styles.text_style, { flex: 1.1 }]}>{Constant.company}</Text>
                <Text style={[styles.text_style, { flex: 1.0, }]}>{Constant.contact}</Text>
                <Text style={[styles.text_style, { flex: 0.9 }]}> {(this.state.selectedTab === 1) ? 'Stage' : 'Date & Time'} </Text>

              </View>

            </View>

          </View>

        </ScrollView>

      </View>
    );

  }


  render() {

    var optionArray = [
      'Call' + ' ' + this.state.NumbertoCall,

      'Cancel',
    ];

    return (

      <View style={styles.container}>

        {this.headerRender()}

        {/* <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }} 
      refreshControl={ */}
        {/* <RefreshControl refreshing={this.state.isLoading} onRefresh={()=> this.setState({isLoading:true},()=> this.onRefresh.bind(this)) } /> */}
      {/* }  
      > */}
        {

          (this.state.getContactData === null)

            ? null
            :

            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: Colors.lightGray, marginBottom: 2 }}>

              <FlatList
                style={{ width: '100%' }}
                ListHeaderComponent={this.renderContent()
                }
                contentContainerStyle={{ paddingBottom:12 }}
                data={this.state.getContactData}
                onEndReachedThreshold={0.5}
                bounces={false}
                onEndReached={({ distanceFromEnd }) => { this._handleLoadMore() }}
                keyboardShouldPersistTaps={'handled'}
                ListFooterComponent={this.renderFooterNote}
                keyExtractor={(item, index) => { return item.id + "" + index }}
                renderItem={({ item }) => this.DisplayContactList(item)}
              />

            </View>

        }
{/* </ScrollView> */}

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

        <ActionSheet

          ref={o => (this.ActionSheet = o)}

          options={optionArray}

          cancelButtonIndex={1}

          onPress={() => {
            var phoneNumber = '';

            if (Platform.OS === 'android') {

              phoneNumber = `tel:${this.state.NumbertoCall}`;

            }

            else {

              phoneNumber = `telprompt:${this.state.NumbertoCall}`;

            }

            Linking.openURL(phoneNumber);
            this.setState({ toolVisible: false })

          }}

        />


      </View>

    );
  }

}

// Styling Code for UI Elements of this Page

const styles = StyleSheet.create({

  top_layout: {
    width: 40,
    height: 40,
    justifyContent: 'center',

  },

  picker: {

    width: widthPercentageToDP('47%'),
    marginLeft: widthPercentageToDP(50),
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginTop: 60,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: { width: 2, height: -4 },
    shadowRadius: 21,
    borderRadius: 46 / 2,
    backgroundColor: '#ffffff',

  },

  container: {

    flex: 1,
    backgroundColor: Colors.white_color,

  },

  tab_text: {

    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'center'

  },

  indicatorText: {

    backgroundColor: 'green'

  },

  indicatorSelectedText: {

    color: 'orange'

  },

  top_view_btn: {

    flex: 1,
    height: 42,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center'

  },

  top_view_txt: {

    color: Colors.white_color,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center'

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

  followTimeRectangle3: {

    width: '100%',
    borderRadius: 46 / 2,
    alignContent: 'center',
    borderStyle: 'solid',

  },

  rectangle14: {

    width: widthPercentageToDP('100%'),
    height: 46,
    shadowColor: 'rgba(6, 163, 127, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    borderRadius: 60,
    paddingStart: 0,

  },

  dropdown_container: {

    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 8,

  },

  dropdown_container1: {

    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 18,

  },

  dropdown_view: {

    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 46 / 2, paddingEnd: 16

  },

  dropdown_view1: {

    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 46 / 2, paddingEnd: 16

  },

  icon_bg: {

    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',

  },

  padding_style: {

    paddingStart: 16,
    paddingEnd: 16

  },

  margin_style: {

    marginStart: 16,
    marginEnd: 16

  },

  text_style: {

    color: Colors.black_color,
    fontSize: 14,

  },

  image_style: {

    width: 14, height: 14,
    tintColor: Colors.green_start,
    alignItems: 'flex-end',
    justifyContent: 'center',

  },

  contact_icon: {

    width: 35,
    height: 35,
    marginLeft: 5,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',

  },

  contact_icon1: {

    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',

  },

  search: {

    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    flex: 1,
    backgroundColor: '#efeff4',
    height: 46,
    borderRadius: 46 / 2,
    alignItems: 'center',
    justifyContent: 'center',

  },

  checkbox_style: {

    backgroundColor: Colors.white_color,
    width: widthPercentageToDP(30),
    height: 30,
    borderWidth: 0

  },

  checkbox_img: {

    width: 20, height: 20,
    tintColor: '#1cd5ab',
    shadowOffset: { width: 2, height: 2, },
    shadowColor: Colors.primaryColor,
    shadowOpacity: .2,
    shadowRadius: 20 / 2,

  },

  rowFront: {

    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',

  },

  rowBack: {

    flex: 1,
    alignContent: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  potentialHigh: {

    flex: 1,
    marginTop: 5,
    marginRight: 2,
    marginLeft: 2,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 10,
    fontWeight: '400',

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
