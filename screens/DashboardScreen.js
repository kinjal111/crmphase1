import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ImageBackground,
  Alert,
  RefreshControl
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Overlay } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import Slider from 'react-native-slider'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Searchbar } from 'react-native-paper';
import { textHeader, font_style } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant'
import Colors from '../constants/Colors';
import HeaderLeft from '../components/HeaderLeft';
import NetworkUtils from '../components/NetworkUtils';
import { IonIcon, Icon } from 'react-native-elements';
import { apiBasePath } from '../constantApi';
import { BadgeContext } from '../components/IconHome';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Linking } from 'react-native';
//import VersionCheck from 'react-native-version-check';
//import { getAppstoreVersion, getAppstoreAppMetadata } from "react-native-appstore-version-checker"

const storeSpecificId = Platform.OS === 'ios' ? '1480661162' : 'com.designcheck.app'


export default class DashboardScreen extends React.Component {

  // header design and its working

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.dashboard}</Text>,

    headerLeft: () => <HeaderLeft navigationProps={navigation} />,

    headerRight: () => null,

  });

  constructor() {
    super();
    this.state = {
      unread_Notification_count: '',
      selectedTab: 0,
      isvisible: false,
      initialData: [],
      RecentNewDeal: [],
      LoginUserDetail: [],
      biggestWonDeal: '',
      biggestWonDealDataState: false,
      recentNewDealDataState: false,
      NewDealDataState: false,
      DashboardUserData: '',
      DashboardState: true,
      companyData: [],
      selected_company: '',
      SalesTargetSliderValue: 0,
      NewDeal: '',
      SalesTarget: '',
      userState: false,
      initialState: false,
      ViewUser: '',
      userData: [],
      userDatabeforeUpdate: [],
      monthmorethan1: false,
      DashboardData: '',
      MyRecentWonDeal: [],
      period: 'd',
      data: [
        { title: 'Lorem Ipsum is simply dummy text', show: true },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
      ],
      company: [
        { value: 'Crystal Demo Pte Ltd (Demo)' },
        { value: 'Crystal Demo Pte Ltd (Demo)' },
        { value: 'Crystal Demo Pte Ltd (Demo)' }
      ],
      Time: [
        { value: '10:30 AM' },
        { value: '11:00 AM' },
        { value: '11:30 AM' }
      ],
      isLoading:false,
    }
  }

  // static Variable for update the Badge Value

  static contextType = BadgeContext;

  // fetch Data from api which will be using for Initiate the app Data

  componentDidMount = async () => {

    this.setState({ userState: false, initialState: false }, () => { })

    const isConnected = await NetworkUtils.isNetworkAvailable()

    // alert(isConnected)

    if (isConnected) {

      this.fetch_get_unread_notif_count()

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

            this.setState({ isLoading: false, initialData: str.company_access, LoginUserDetail: str.user_details }, () => {
              this.modifyCompanyAccessKey()
            },
            );
          }

        })
        .catch(error => {

          this.setState({ isLoading: false }, () => { });
        }
        )

      // getAppstoreAppMetadata(storeSpecificId).then(latestVersion => {

      // })   // 0.1.2
      //   .catch(error => {

      //     this.setState({}, () => { });
      //   }
      //   )

    }

    else {

      alert('Check Your Internet Connection and Try Again')

    }

  }

  // fetch the Unread Notification Count value to upadate the value of badge in tab navigator

  fetch_get_unread_notif_count = async () => {

    let value = this.context;

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

          // console.log(JSON.stringify(str))

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

  // modify Company data in which change the keys like company_name into label and id into values

  modifyCompanyAccessKey = async () => {

    if (this.state.initialData == undefined || this.state.initialData.length == 0) {

    }
    else {

      const selectedCompany = await AsyncStorage.getItem(Constant.selectedCompany);

      var item = this.state.initialData;
      item.map((val) => {

        val.label = val.company_name;

        val.value = val.id;


      })

      if (selectedCompany === null || selectedCompany === undefined) {

        await AsyncStorage.setItem(Constant.selectedCompany, item[0].value).then(
          this.setState({ companyData: item, initialState: true, selected_company: item[0].value }, () => { this.fetchDashboardUserList() })
        )
      }
      else {

        await AsyncStorage.setItem(Constant.selectedCompany, selectedCompany).then(
          this.setState({ companyData: item, initialState: true, selected_company: selectedCompany }, () => { this.fetchDashboardUserList() })
        )

      }

    }
  }

  // modify User data in which change the keys like name into label and id into value

  modifyUserKey = async () => {

    if (this.state.userDatabeforeUpdate == undefined || this.state.userDatabeforeUpdate.length == 0) {

    }
    else {

      var DefaultUserValue;
      var item = this.state.userDatabeforeUpdate;


      item.map((val) => {

        val.label = val.name;

        val.value = val.id;

        if (val.id === this.state.LoginUserDetail.id) {
          DefaultUserValue = val.value;
        }

        delete val.id;
        delete val.name;
        delete val.account_status;


      })
      this.setState({ userData: item, userState: true, ViewUser: DefaultUserValue }, () => { this.fetchDashboardContent() })
    }

    await AsyncStorage.setItem(Constant.selectedCompany, this.state.selected_company)

  }

  // fetch Dashboard user Data from api which will be using for fill the the view user Data and its required parameter will be companyId

  fetchDashboardUserList = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);

      let formData = new FormData();
      formData.append('api_token', api_token);
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('method', 'dashb_users');
      formData.append('company_id', this.state.selected_company);

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
          console.log(JSON.stringify(str))

          // alert(JSON.stringify(str))

          if (str.error == 101) {

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

            this.setState({ isLoading: false, userDatabeforeUpdate: str }, () => { this.modifyUserKey() })

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

  // fetch Dashboard Data from api which will be using for fill the the  Data into the page and its required parameter will be companyId,viewuserId and period

  fetchDashboardContent = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_token', api_token);
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('method', 'dashb_content');
      formData.append('company_id', this.state.selected_company);
      formData.append('user_id', this.state.ViewUser);
      formData.append('period', this.state.period);

      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {

          if (response.status == 200) {
            return response.json();
          }

          else {

            this.setState({ isLoading: true })
          }
        })
        .then(responseJson => {
          str = responseJson;

          if (str.error == 101) {

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
            // console.log(JSON.stringify(str))

            this.setState({

              DashboardData: str,
              SalesTarget: str.sales_target,
              NewDeal: str.recent_deals_by_company.new_deals_by,
              RecentNewDeal: str.recent_deals_by_company.recent_new_deals,
              biggestWonDeal: str.recent_deals_by_company.biggest_won_deal,
              MyRecentWonDeal: str.my_recent_won_deals,
              isLoading: false

            }, () => { this.fillRecentNewDeal(), this.fillRecentDeal(), this.fillBiggestWonDeal() })

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


  // set the parameter biggestWonDealDataState to true for display Biggestwondeal portion With Data

  fillBiggestWonDeal() {

    if (this.state.biggestWonDeal === undefined || this.state.biggestWonDeal === null || this.state.biggestWonDeal === 'null') {

      this.setState({ biggestWonDealDataState: false })

    }
    else {

      if (this.state.biggestWonDeal.name === undefined || this.state.biggestWonDeal.name === null || this.state.biggestWonDeal.date_closed === undefined || this.state.biggestWonDeal.date_closed === null || this.state.biggestWonDeal.company_name === undefined || this.state.biggestWonDeal.company_name === null || this.state.biggestWonDeal.deal_amount === undefined || this.state.biggestWonDeal.deal_amount === null) {

        this.setState({ biggestWonDealDataState: false, DashboardState: false })

      }

      else {

        this.setState({ biggestWonDealDataState: true, DashboardState: false })

      }


    }

  }

  // set the parameter recentNewDealDataState to true for display recentdeal portion With Data

  fillRecentDeal() {

    if (this.state.RecentNewDeal === undefined || this.state.RecentNewDeal === 'null' || this.state.RecentNewDeal === null) {

      this.setState({ recentNewDealDataState: false })

    }



    else {

      if (this.state.RecentNewDeal.name === undefined || this.state.RecentNewDeal.name === null || this.state.RecentNewDeal.date_closed === undefined || this.state.RecentNewDeal.date_closed === null || this.state.RecentNewDeal.company_name === undefined || this.state.RecentNewDeal.company_name === null) {

        this.setState({ recentNewDealDataState: true, DashboardState: false })

      }

      else {

        this.setState({ recentNewDealDataState: true, DashboardState: false })


      }


    }
  }

  // set the parameter NewDealDataState to true for display NewDeal portion With Data

  fillRecentNewDeal() {

    if (this.state.NewDeal === undefined || this.state.NewDeal === null || this.state.NewDeal === 'null' || this.state.NewDeal === '' || this.state.NewDealDataState === true) {

      this.setState({ NewDealDataState: false })

    }

    else {

      if (this.state.NewDeal.name === undefined || this.state.NewDeal.name === null || this.state.NewDeal.deal_amount_total === undefined || this.state.NewDeal.deal_amount_total === null) {

        this.setState({ NewDealDataState: false, DashboardState: false }, () => { })

      }
      else {

        this.setState({ NewDealDataState: true, DashboardState: false }, () => { })


      }


    }
  }

  // Set Visibility show or hide of update app Notification Prompt

  setOverlayVisible(visible) {

    this.setState({ isvisible: visible });

  }

  //initial state of slider of this month

  getInitialState() {

    return {
      value: 0.3,
    }

  }; 
 
  render() {

    var value = this.state.value;

    return (

      <KeyboardAwareScrollView  
        refreshControl={
          <RefreshControl refreshing={this.state.isLoading} onRefresh={()=> this.setState({isLoading:true},()=>this.fetchDashboardContent()) } />
        }  
        style={{ backgroundColor: '#ffffff' }}
      >

        <View style={styles.container}>

          <ScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
         
          >

            <NavigationEvents
              onWillFocus={() => this.componentDidMount
                ()}
              onDidFocus={() => this.componentDidMount
                ()}

            />

            <View>

              <Text style={[styles.company_text]}>Company:</Text>

              <View
                activeOpacity={1}
                style={[styles.dropdown_view, { paddingStart: 20, PaddingLeft: 20, }]}>
                <View style={styles.img_view}>

                  <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.white_color }]} resizeMode="contain" />

                </View>

                {(this.state.initialState) ?

                  <View>

                    <RNPickerSelect
                      placeholder={{}
                      }
                      textInputProps={{ color: '#ffffff' }}
                      onValueChange={(value) => this.setState({ selected_company: value, NewDealDataState: false, biggestWonDealDataState: false }, () => { this.fetchDashboardUserList() })}
                      value={(this.state.initialState) ? this.state.selected_company : ''}
                      onDonePress={() => this.fetchDashboardUserList()}
                      color={'#ffffff'}

                      style={{ ...pickerSelectStyles, marginLeft: 20, paddingStart: 20, paddingLeft: 20, marginTop: 10 }}
                      items={(this.state.initialState) ? this.state.companyData : []}

                    />

                  </View>
                  :
                  null
                }

              </View>

              <Text style={[styles.user_dashboard_text]}>View User Dashboards:</Text>

              <View
                activeOpacity={1}
                style={[styles.dropdown_view1, { paddingStart: 20, PaddingLeft: 20, color: '#ffffff' }]}>

                <View style={styles.img_view}>

                  <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

                </View>

                {(this.state.userState) ?

                  <View>

                    <RNPickerSelect

                      placeholder={
                        {}
                      }
                      textInputProps={{ color: Colors.black_color }}
                      onValueChange={(value) => this.setState({ ViewUser: value, NewDealDataState: false, biggestWonDealDataState: false }, () => { this.fetchDashboardContent() }, () => { })}
                      value={(this.state.userState) ? this.state.ViewUser : ''}

                      onDonePress={() => this.fetchDashboardContent()}
                      color={'#000000'}
                      style={{ ...pickerSelectStyles, marginLeft: 20, paddingStart: 20, paddingLeft: 20, marginTop: 10 }}
                      items={(this.state.userState) ? this.state.userData : []}


                    />

                  </View>

                  :
                  null

                }

              </View>

              <ScrollView style={{ marginTop: 10 }} horizontal={true} showsHorizontalScrollIndicator={false}>

                <View style={{ flexDirection: 'row', height: 42, width: widthPercentageToDP(90), alignItems: 'center', borderRadius: 42 / 2, backgroundColor: '#26b3f1', marginLeft: widthPercentageToDP(4.5), marginEnd: widthPercentageToDP(5), marginBottom: 10 }}>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'd') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', marginLeft: widthPercentageToDP(2), }]}
                    onPress={() => { this.setState({ period: 'd', monthmorethan1: false, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>


                    <Text style={[styles.dayWeek1, font_style.font_medium, { color: (this.state.period === 'd') ? Colors.primaryColor : Colors.white_color }]}> Day </Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'w') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', }]}
                    onPress={() => { this.setState({ period: 'w', monthmorethan1: false, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'w') ? Colors.primaryColor : Colors.white_color }]}>Week</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'm') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', }]}
                    onPress={() => { this.setState({ period: 'm', monthmorethan1: false, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'm') ? Colors.primaryColor : Colors.white_color }]}>Month</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'q1') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', }]}
                    onPress={() => { this.setState({ period: 'q1', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'q1') ? Colors.primaryColor : Colors.white_color }]}>Q1</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'q2') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', }]}
                    onPress={() => { this.setState({ period: 'q2', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'q2') ? Colors.primaryColor : Colors.white_color }]}>Q2</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'q3') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', }]}
                    onPress={() => { this.setState({ period: 'q3', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'q3') ? Colors.primaryColor : Colors.white_color }]}>Q3</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: (this.state.period === 'q4') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', }]}
                    onPress={() => { this.setState({ period: 'q4', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, { color: (this.state.period === 'q4') ? Colors.primaryColor : Colors.white_color }]}>Q4</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view, { backgroundColor: Colors.primaryColor, flexDirection: 'row', marginLeft: widthPercentageToDP(6.4) }]}
                  >

                    <View style={styles.img_view}>

                      <Image source={require('../assets/images/LeftButton.png')} style={[styles.top_image_style, { tintColor: Colors.white_color, marginBottom: 6, justifyContent: 'center', alignItems: 'center' }]} resizeMode="contain" />

                    </View>

                  </TouchableOpacity>

                </View>

                <View style={{ flexDirection: 'row', height: 42, alignItems: 'center', borderRadius: 42 / 2, backgroundColor: '#26b3f1', marginRight: widthPercentageToDP(2), marginBottom: 10 }}>

                  <TouchableOpacity style={[styles.btn_view1, { backgroundColor: (this.state.period === 'lm') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row', marginLeft: widthPercentageToDP(2), }]}
                    onPress={() => { this.setState({ period: 'lm', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'lm') ? Colors.primaryColor : Colors.white_color }]}>Last Month</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view1, { backgroundColor: (this.state.period === 'l3m') ? Colors.white_color : Colors.primaryColor, marginEnd: 6, flexDirection: 'row' }]}
                    onPress={() => { this.setState({ period: 'l3m', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.last3month, font_style.font_medium, { color: (this.state.period === 'l3m') ? Colors.primaryColor : Colors.white_color }]}>Last 3 Month</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view1, { backgroundColor: (this.state.period === 'l6m') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row' }]}
                    onPress={() => { this.setState({ period: 'l6m', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'l6m') ? Colors.primaryColor : Colors.white_color }]}>Last 6 Month</Text>

                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn_view1, { backgroundColor: (this.state.period === 'l1y') ? Colors.white_color : Colors.primaryColor, flexDirection: 'row' }]}
                    onPress={() => { this.setState({ period: 'l1y', monthmorethan1: true, biggestWonDealDataState: false, NewDealDataState: false }, () => { this.fetchDashboardContent() }) }}>

                    <Text style={[styles.dayWeek, font_style.font_medium, { color: (this.state.period === 'l1y') ? Colors.primaryColor : Colors.white_color }]}>Last 1 Year</Text>

                  </TouchableOpacity>

                </View>

              </ScrollView>

              <View style={{ marginTop: 16, height: 10, paddingStart: 16, paddingEnd: 16, backgroundColor: Colors.bg_color }} />

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: '#53cef7', borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Most new deals by</Text>

                  {
                    (this.state.NewDealDataState) ?

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 8 }}>

                        <Text style={[styles.txt_style1]}>{this.state.NewDeal.name}</Text>
                        <Text style={[styles.txt_style1]}>{'S$ ' + this.state.NewDeal.deal_amount_total}</Text>

                      </View>

                      :

                      null
                  }
                </View>

              </View>

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: '#53cef7', borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Biggest Won Deal</Text>

                  {(this.state.biggestWonDealDataState) ?

                    <View>

                      <View style={{ flexDirection: "row" }}>

                        <Text style={[styles.sgd119small, { fontSize: 16, marginTop: 9, textAlign: 'left', color: '#5089e4', fontWeight: '500' }]}>{'SGD ' + this.state.biggestWonDeal.deal_amount}</Text>

                        <Text style={[styles.sgd119small, { fontSize: 15, paddingLeft: 4 }]}>{this.state.biggestWonDeal.company_name}</Text>

                      </View>

                      <Text style={[styles.sgd119small, { fontSize: 15, textAlign: 'right', paddingRight: 8, paddingBottom: 4 }]}>{'by ' + this.state.biggestWonDeal.name}</Text>

                      <Text style={[styles.sgd119small, { fontSize: 15, textAlign: 'right', marginTop: 0, paddingRight: 8, paddingBottom: 20 }]}>{this.state.biggestWonDeal.date_closed}</Text>

                    </View>

                    : null
                  }


                </View>


              </View>

              {(this.state.recentNewDealDataState) ?

                <View style={{ marginTop: 16 }}>

                  <View style={{ borderWidth: 1, borderColor: '#53cef7', borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                    <Text style={[styles.txt_style1]}>Most recent new deals</Text>

                    {this.state.RecentNewDeal.map((val) =>

                      <View>

                        <View style={{ flexDirection: "row" }}>

                          <Text style={[styles.sgd119small, { fontSize: 16, marginTop: 9, textAlign: 'left', color: '#5089e4', fontWeight: '500' }]}>{'SGD ' + (val.deal_amount) ? val.deal_amount : ''}</Text>

                          <Text style={[styles.sgd119small, { fontSize: 15, paddingLeft: 4 }]}>{!(val.company_name === '') ? val.company_name : ''}</Text>


                        </View>

                        <Text style={[styles.sgd119small, { fontSize: 15, textAlign: 'right', paddingRight: 8, paddingBottom: 4 }]}>{!(val.name === '') ? 'by ' + val.name : 'by '}</Text>

                        <Text style={[styles.sgd119small, { fontSize: 15, textAlign: 'right', marginTop: 0, paddingRight: 8, paddingBottom: 20 }]}>{!(val.date_closed === '') ? val.date_closed : ' '}</Text>

                        <View style={{ borderWidth: 0.3, marginLeft: 4, marginRight: 4, borderColor: '#5089e4' }} />

                      </View>
                    )}

                  </View>

                </View>

                : null}

              <View style={{ marginTop: 16, height: 10, paddingStart: 16, paddingEnd: 16, backgroundColor: Colors.bg_color }} />

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: '#53cef7', borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.overdueFollow]}>Overdue (Follow-up)</Text>

                  <View style={{ flexDirection: "row" }}>

                    <Text style={[styles.lead, { flex: 1.0, textAlign: 'left' }]}>Lead</Text>
                    <Text style={[styles.prospects, { flex: 1.0, textAlign: 'center', }]}>Prospects</Text>
                    <Text style={[styles.client, { flex: 1.0, textAlign: 'center', }]}>Client</Text>

                  </View>

                  {(this.state.DashboardState) ?

                    null

                    :
                    <View style={{ flexDirection: "row" }}>

                      <Text style={[styles.text0, { textAlign: 'left', paddingLeft: 28 }]}>{(this.state.DashboardData.overdue_followup.lead === null) ? '0' : this.state.DashboardData.overdue_followup.lead}</Text>
                      <Text style={[styles.text0, { textAlign: 'center', paddingRight: 16 }]}>{(this.state.DashboardData.overdue_followup.prospect === null) ? '0' : this.state.DashboardData.overdue_followup.prospect}</Text>
                      <Text style={[styles.text0]}>{(this.state.DashboardData.overdue_followup.client === null) ? '0' : this.state.DashboardData.overdue_followup.client}</Text>

                    </View>
                  }
                </View>

              </View>

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Opportunities (Not Created Yet)</Text>

                  <View style={{ flexDirection: "row" }}>

                    <Text style={[styles.prospectMet]}>Prospect Met</Text>
                    <Text style={[styles.prospectsNot]}>Prospects Not Met</Text>
                    <Text style={[styles.clientMet]}>Client Met</Text>
                    <Text style={[styles.clientNot]}>Client Not Met</Text>

                  </View>

                  {(this.state.DashboardState) ?
                    null
                    :

                    <View style={{ flexDirection: "row" }}>

                      <Text style={[styles.text0, { paddingLeft: 4 }]}>{(this.state.DashboardData.opp_nc.prospect_met === null) ? '0' : this.state.DashboardData.opp_nc.prospect_met}</Text>
                      <Text style={[styles.text0, {}]}>{(this.state.DashboardData.opp_nc.prospect_notmet === null) ? '0' : this.state.DashboardData.opp_nc.prospect_notmet}</Text>
                      <Text style={[styles.text0, {}]}>{(this.state.DashboardData.opp_nc.client_met === null) ? '0' : this.state.DashboardData.opp_nc.client_met}</Text>
                      <Text style={[styles.text0, { paddingLeft: 4 }]}>{(this.state.DashboardData.opp_nc.client_notmet === null) ? '0' : this.state.DashboardData.opp_nc.client_notmet}</Text>

                    </View>
                  }
                </View>

              </View>

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Activites completed (Call)</Text>

                  <View style={{ flexDirection: "row" }}>

                    <Text style={[styles.lead, { flex: 1.0, textAlign: 'left' }]}>Lead</Text>
                    <Text style={[styles.prospects, { flex: 1.0, textAlign: 'center', }]}>Prospects</Text>
                    <Text style={[styles.client, { flex: 1.0, textAlign: 'center', }]}>Client</Text>

                  </View>

                  {(this.state.DashboardState) ?
                    null
                    :
                    <View style={{ flexDirection: "row" }}>

                      <Text style={[styles.text0, { textAlign: 'left', paddingLeft: 28 }]}>{(this.state.DashboardData.act_completed_call.lead === null) ? '0' : this.state.DashboardData.act_completed_followup.lead}</Text>
                      <Text style={[styles.text0, { textAlign: 'center', paddingRight: 16 }]}>{(this.state.DashboardData.act_completed_followup.prospect === null) ? '0' : this.state.DashboardData.act_completed_followup.prospect}</Text>
                      <Text style={[styles.text0]}>{(this.state.DashboardData.act_completed_followup.client === null) ? '0' : this.state.DashboardData.act_completed_followup.client}</Text>

                    </View>
                  }
                </View>

              </View>

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Acivities completed (Meeting)</Text>

                  <View style={{ flexDirection: "row" }}>

                    <Text style={[styles.prospects, { flex: 3.5, textAlign: 'center' }]}>Prospect</Text>
                    <Text style={[styles.client, { flex: 3.5, textAlign: 'center' }]}>Client</Text>

                  </View>

                  {(this.state.DashboardState) ?

                    null

                    :

                    <View style={{ flexDirection: "row" }}>

                      <Text style={[styles.text0, { flex: 3.5, textAlign: 'center', paddingLeft: 8 }]}>{(this.state.DashboardData.act_completed_meeting.prospect === null) ? '0' : this.state.DashboardData.act_completed_meeting.prospect}</Text>
                      <Text style={[styles.text0, { flex: 3.5, textAlign: 'center' }]}>{(this.state.DashboardData.act_completed_meeting.client === null) ? '0' : this.state.DashboardData.act_completed_meeting.client}</Text>

                    </View>
                  }

                </View>

              </View>

              <View style={{ marginTop: 16 }}>

                <View style={{ borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Activities completed (Follow-up)</Text>

                  <View style={{ flexDirection: "row" }}>

                    <Text style={[styles.lead, { flex: 1.0, textAlign: 'left' }]}>Lead</Text>
                    <Text style={[styles.prospects, { flex: 1.0, textAlign: 'center', }]}>Prospects</Text>
                    <Text style={[styles.client, { flex: 1.0, textAlign: 'center', }]}>Client</Text>

                  </View>

                  {(this.state.DashboardState) ?
                    null
                    :

                    <View style={{ flexDirection: "row" }}>

                      <Text style={[styles.text0, { textAlign: 'left', paddingLeft: 28 }]}>{(this.state.DashboardData.act_completed_followup.lead === null) ? '0' : this.state.DashboardData.act_completed_followup.lead}</Text>
                      <Text style={[styles.text0, { textAlign: 'center', paddingRight: 16 }]}>{(this.state.DashboardData.act_completed_followup.prospect === null) ? '0' : this.state.DashboardData.act_completed_followup.prospect}</Text>
                      <Text style={[styles.text0]}>{(this.state.DashboardData.act_completed_followup.client === null) ? '0' : this.state.DashboardData.act_completed_followup.client}</Text>

                    </View>
                  }

                </View>

              </View>

              <View style={{ marginTop: 16 }}>

                <View style={{ flex: 1, borderWidth: 1, borderColor: '#53ecf7', borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>Sales Target</Text>

                  {(this.state.DashboardState) ?
                    null
                    :
                    <View>

                      <Text style={[styles.november2016, { marginTop: 16 }]}>{(this.state.DashboardData.sales_target.date_display === null) ? '' : this.state.DashboardData.sales_target.date_display}</Text>

                    </View>
                  }

                  <View style={{ borderWidth: 1, borderColor: '#53ecf7', borderRadius: 10, marginTop: 20 }}></View>

                  <View style={{ flexDirection: 'row', marginTop: 16, paddingLeft: 16, }}>

                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>

                      {(this.state.DashboardState) ?
                        null
                        :
                        <View>

                          <Text style={[styles.txt_style1], { paddingLeft: 30, width: 100, fontSize: 16, textAlign: 'left', }}>{(this.state.DashboardData.sales_target.total_deals === null) ? 'Acheived SGD 0.00' : 'Acheived SGD ' + this.state.DashboardData.sales_target.total_deals}</Text>

                        </View>
                      }

                    </View>

                    {(this.state.DashboardState) ?
                      null
                      :

                      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>

                        <Text style={[styles.txt_style1], { paddingLeft: 30, width: 100, fontSize: 16, textAlign: 'left', }}>{(this.state.DashboardData.sales_target.monthly_target === null) ? 'Target SGD 0.00' : 'Target SGD ' + this.state.DashboardData.sales_target.monthly_target}</Text>

                      </View>
                    }

                  </View>

                  <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', marginTop: 16, }}>

                    <Text style={[{ textAlign: 'center', color: '#222222', fontFamily: 'Helvetica Neue', fontSize: 18, fontWeight: '400' }]}>Closed Won Deals:</Text>

                    {(this.state.DashboardState) ?
                      null
                      :
                      <View>

                        <Text style={[styles.text0, { paddingLeft: 0, textAlign: 'left' }]}>{(this.state.DashboardData.sales_target.number_of_deals === null) ? '0' : this.state.DashboardData.sales_target.number_of_deals}</Text>

                      </View>
                    }

                  </View>

                  {(this.state.DashboardState) ?

                    null
                    :
                    <View>

                      <View style={{ paddingHorizontal: 8, marginBottom: 16, flexDirection: 'row' }}>

                        <Slider style={{ width: '75%', marginBottom: 16, }}
                          trackStyle={styles.track}
                          thumbTouchSize={{ width: 40, height: 40 }}
                          thumbStyle={{ width: 0, height: 0 }}
                          minimumTrackTintColor={Colors.primaryColor}
                          value={(this.state.SalesTarget.monthly_target === null || this.state.SalesTarget.total_deals === null || this.state.SalesTarget.monthly_target === undefined || this.state.SalesTarget.total_deals === undefined) ? 0 : (parseInt(this.state.SalesTarget.total_deals) / parseInt(this.state.SalesTarget.monthly_target) >= 1 || this.state.SalesTarget.total_deals == 0) ? 1 : parseInt(this.state.SalesTarget.total_deals) / parseInt(this.state.SalesTarget.monthly_target)}
                          onValueChange={(value) => { this.setState({ value }) }}

                        />

                        <Text style={[styles.txt_style1], { width: 180, flex: 1, marginLeft: 8, fontSize: 16, marginTop: 10, height: 30 }}>{(this.state.SalesTarget.monthly_target === null || this.state.SalesTarget.total_deals === null || this.state.SalesTarget.monthly_target === undefined || this.state.SalesTarget.total_deals === undefined) ? 0 : (this.state.SalesTarget.total_deals == 0) ? 100 : (parseInt(this.state.SalesTarget.total_deals) / parseInt(this.state.SalesTarget.monthly_target) * 100)} %</Text>

                      </View>

                    </View>

                  }

                </View>

              </View>

              <View style={{ marginTop: 16, marginBottom: 16 }}>

                <View style={{ borderWidth: 1, borderColor: Colors.primaryColor, borderRadius: 10, marginLeft: 16, marginRight: 16 }}>

                  <Text style={[styles.txt_style1]}>My recent Won deals</Text>
                  {
                    (this.state.MyRecentWonDeal) ?

                      this.state.MyRecentWonDeal.map((val) =>

                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                          <Text style={[styles.text0, { textAlign: 'left', paddingLeft: 28, marginTop: 10 }]}>SGD {val.deal_amount}</Text>
                          <Text style={[styles.text0, { textAlign: 'left', paddingLeft: 28, marginTop: 10 }]}>{val.company_name}</Text>
                          <Text style={[styles.text0, { textAlign: 'left', paddingLeft: 28, marginTop: 10 }]}>{val.date_closed}</Text>

                        </View>
                      )
                      :
                      <Text style={[styles.noWon]}>No won deals for this period.</Text>
                  }

                </View>

              </View>

            </View>

          </ScrollView>

          <SafeAreaView />

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

// Styling Code for elements
const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white_color,
  },
  search: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    flex: 1,
    backgroundColor: '#efeff4',
    height: 42,
    borderRadius: 42 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followTimeRectangle3: {
    height: 46,
    width: '90%',
    borderRadius: 46 / 2,
    alignContent: 'center',
    borderRadius: 60,
    paddingStart: 40,
    paddingEnd: 40,
    borderStyle: 'solid',
    borderWidth: 2,
  },

  boxSearch: {
    elevation: 0,
    flex: 1,
    height: 42,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 2, height: -3 },
    shadowRadius: 7,
    borderRadius: 42 / 2,
    backgroundColor: '#efeff4',
  },
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  txt_style1: {
    paddingLeft: 16,
    marginTop: 10,
    marginBottom: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },
  noWon: {
    flex: 1,
    marginBottom: 16,
    paddingLeft: 16,
    marginTop: 10,
    color: '#a565fd',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  text0: {
    flex: 1.0,
    paddingLeft: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',

  },
  sgd119: {
    flex: 1,
    color: '#5089e4',
    fontFamily: 'Helvetica Neue',
    fontSize: 40,
    fontWeight: '500',
    textAlign: 'center',
  },
  sgd119small: {
    marginTop: 10,
    paddingLeft: 16,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '400',
  },
  company_text: {
    paddingLeft: 16,
    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '400',
  },
  user_dashboard_text: {
    paddingLeft: 16,
    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '400',
  },
  crystalDemo: {

    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  newDeals: {
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  thisMonth: {
    paddingTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  txt_style: {
    paddingLeft: 8,
    fontSize: 14, color: Colors.black_color,
    marginTop: 10,
    fontFamily: 'Helvetica-Light'

  },
  dayWeek: {
    color: Colors.white_color,
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    // width:36,
  },

  last3month: {
    color: Colors.white_color,
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    // width:36,
  },
  dayWeek1: {
    color: Colors.white_color,
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    width: 36,
  },

  btn_view: {
    backgroundColor: Colors.primaryColor,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPercentageToDP(1.9)
  },
  btn_view1: {
    backgroundColor: Colors.primaryColor,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPercentageToDP(1)
  },
  txt_view: {
    color: Colors.white_color,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Light'
  },
  txt_view1: {
    color: Colors.primaryColor,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Light'
  },
  top_image_style: {
    width: 16, height: 16,
    tintColor: Colors.white_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  img_view: {
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingEnd: 16
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
    elevation: 1,
    height: 42,
    justifyContent: 'center',
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    borderRadius: 42 / 2,
    backgroundColor: '#5cb5ed',
    paddingEnd: 16,
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16
  },
  overdueFollow: {
    paddingLeft: 16,
    marginTop: 10,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  lead: {
    paddingLeft: 16,
    marginBottom: 10,
    marginTop: 10,
    color: '#72c8f2',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  prospects: {
    marginBottom: 10,
    marginTop: 10,
    color: '#18d3a8',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  client: {
    marginBottom: 10,
    paddingLeft: 16,
    marginTop: 10,
    color: '#f44995',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  prospectMet: {
    flex: 1.1,
    marginEnd: 8,
    marginBottom: 10,
    paddingTop: 10,
    textAlign: 'center',
    color: '#72c8f2',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  prospectsNot: {
    flex: 1.2,
    marginEnd: 8,
    paddingTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#a565fd',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  clientMet: {
    flex: 1.0,
    marginEnd: 8,
    marginBottom: 10,
    paddingTop: 10,
    textAlign: 'center',
    color: '#18d3a8',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  clientNot: {
    flex: 1.0,
    marginEnd: 8,
    paddingTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#f44995',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '700',
  },
  november2016: {
    // width:600,
    textAlign: 'center',
    color: '#72c8f2',
    fontFamily: 'Helvetica Neue',
    fontSize: 22,
    fontWeight: '500',
  },

  dropdown_view1: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    borderRadius: 42 / 2, paddingEnd: 16,
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderColor: 'rgba(216, 219, 222, 0.5)',
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: '#e7ebee',
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

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    width: widthPercentageToDP('105%'),
  }
})
