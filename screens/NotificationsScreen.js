import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Keyboard,
  View,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Overlay } from 'react-native-elements';
import { textHeader, font_style } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BadgeContext } from '../components/IconHome';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { apiBasePath } from '../constantApi';
import NetworkUtils from '../components/NetworkUtils';
import { NavigationEvents } from 'react-navigation';


export default class NotificationsScreen extends React.PureComponent {

  // Header and Elements of Header Display and did functionality of header's element 

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.notifications}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity style={[styles.top_layout]} activeOpacity={1}
          onPress={() => { navigation.goBack(null) }} >

          <Image source={require('./../assets/images/arrow-left.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity style={[styles.top_layout], { paddingTop: 5, flex: 0.6 }} activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }} >

          <Image source={require('./../assets/images/menu_3x.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,

    headerRight: () => <View />

    // <TouchableOpacity style={[styles.top_layout]} activeOpacity={1}
    //   onPress={() => { navigation.goBack(null) }} >

    //   <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Clear</Text>

    // </TouchableOpacity>,
  });

  // method for Toggle visibility of Update App Notification prompt

  setOverlayVisible(visible) {

    this.setState({ isVisible: visible });

  }

  // Initilise the State variable of this page

  constructor() {

    super();

    this.state = {
      isvisible: false,
      unread_Notification_count: '',
      NotificationData: [],
      FolowUpData: [],
      swipekey: '',
      notificationHeightArray: [],
      htmlContent: '',
      notificationType: 'all',
      swipeData: [{ name: 'Christopher Playford added new note', type: 'for prospect Ewen Khoo ', status: 'Added New Note', date: 'Today', time: '5:49PM', id: 0, show: 'true', notificationType: 'addNote' },
      { name: 'Upcoming follow-up (Call) for', type: 'prospect Paul Velusamy scheduled at 02:00 PM | 02/12/2019', status: 'Upcoming Follow-up Due', date: 'Today', time: '1:49PM', id: 1, show: 'false', notificationType: 'upcomingFollowup' },
      { name: 'Overdue follow-up (Call) for', type: 'prospect Farah Asrap scheduled at 02:00 PM | 02/12/2019', status: 'Upcoming Follow-up Due', date: '02/12/2019 ', time: '4:04PM', id: 2, show: 'false', notificationType: 'overDueFollowup' },
      { name: 'Victor Huot set new ', type: 'appointment for contact Kim Jeong Su', status: 'Set New Appointment', date: '20/12/2019', time: '4:04PM', id: 3, show: 'false', notificationType: 'setAppointment' },
      { name: 'Victor Huot set new ', type: 'appointment for contact Kim Jeong Su ', status: 'Set New Appointment', date: 'Today', time: '4:04PM', id: 4, show: 'false', notificationType: 'setAppointment' },
      { name: 'Victor Huot set new event.', type: 'new note for prospect Ewen Khoo', status: 'Added New Note', date: 'Today', time: '4:04PM', id: 5, show: 'false', notificationType: 'addNote' },
      { name: 'Victor Huot set new event.', type: 'Event name: Hyper Global - Finalize Config. Scheduled at 02:00 PM | 30/12/2019', status: 'Set New Event', date: 'Today', time: '4:04PM', id: 6, show: 'false', notificationType: 'setEvent' },
      { name: 'Victor Huot set new event.', type: 'Event name: Sales Process Meeting with Kerian. Scheduled at 02:00 PM | 30/12/2019', status: 'Set New Event', date: 'Today', time: '6:04PM', id: 7, show: 'false', notificationType: 'setEvent' },
      { name: 'Past event, Meet to finalize VoIP', type: 'Scheduled at 11:30 PM | 26/11/2019 ', status: 'Upcoming Event', date: '29/12/2019', time: '4:04PM', id: 8, show: 'false', notificationType: 'upcomingEvent' },
      { name: 'Past appointmet for prospect', type: 'Jonathan Lim scheduled at 03:00 PM | 29/11/2019', status: 'Upcoming Appointment', date: '29/12/2019', time: '4:04PM', id: 9, show: 'false', notificationType: 'upcomingAppointment1' },
      { name: 'Past event, Meet to finalize VoIP', type: 'Deck scheduled at 11:30 PM | 26/11/2019 ', status: 'Upcoming Event', date: '29/12/2019', time: '6:04PM', id: 10, show: 'false', notificationType: 'upcomingEvent1' },

      ],
      newArray: [],
      upcomingEvent1HeightLoding: true,
      DisplayOnlyFollowupNotification: true,
      isNotification: true,
      isNotificationSwiped: false,
      isCount: 1,
    }
  }

  // static Variable to update the badge value

  static contextType = BadgeContext;

  // Load Notification Data from Aync Storage which is set from push Notification and then append the remaining Data by calling api method notifications when page is loading 

  // componentDidMount = async () => {
  //   console.warn('componenat did mount')
  //   _this = this
  //   let value = this.context;

  //   const isConnected = await NetworkUtils.isNetworkAvailable()

  //   if (isConnected) {

  //     this.setState({ NotificationData: JSON.parse(await AsyncStorage.getItem('NotificationData')) })

  //     const api_token = await AsyncStorage.getItem(Constant.api_token);
  //     let formData = new FormData();

  //     formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
  //     formData.append('api_token', api_token);
  //     formData.append('method', 'notifications');
  //     formData.append('act', 0);


  //     fetch(apiBasePath, {
  //       method: 'POST',
  //       body: formData
  //     })

  //       .then(response => {

  //         if (response.status == 200) {

  //           return response.json();
  //         }

  //         else {

  //         }

  //       })
  //       .then(responseJson => {

  //         str = responseJson;


  //         if (str.error == 101) {

  //           AsyncStorage.removeItem(Constant.api_token);
  //           this.props.navigation.navigate('SignUp');

  //         }

  //         else {
  //           console.log(JSON.stringify(str))
  //           if (this.state.NotificationData === [] || this.state.NotificationData === null) {

  //             this.setState({ isLoading: false, NotificationData: str.notifications, unread_Notification_count: str.unread_count }, () => { value.updateBadge(this.state.unread_Notification_count) });

  //           }

  //           else {

  //             this.setState({ isLoading: false, NotificationData: [...this.state.NotificationData, ...str.notifications], unread_Notification_count: str.unread_count }, () => { value.updateBadge(this.state.unread_Notification_count) });

  //           }
  //         }
  //       })
  //       .catch(error => {


  //         this.setState({ isLoading: false });

  //       }
  //       )
  //   }
  //   else {

  //     alert('Check Your Internet Connection and Try Again')

  //   }
  // }


  // method for update the badge vaule to unread_notification_count by BadgeContext.consumer component

  updateBadgeText = () => {

    return (
      <BadgeContext.Consumer>

        {value =>

          value.updateBadge(this.state.unread_Notification_count)

        }

      </BadgeContext.Consumer>
    );

  }

  // method for mark all notification read when Mark All as read text button is clicked by calling api method mark_all_notif_as_read 

  fetch_Mark_All_Notif_as_Read = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'mark_all_notif_as_read');

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
            //  console.log(JSON.stringify(str))
            if (str.status === true) {
              this.fetch_New_Notification();
              this.onLoad(null);
              showMessage({
                message: "",
                description: "All Notifications are marked as read.",
                type: "success",
              });

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

  // method for mark selected notification read when tick icon button of notification is clicked by calling api method mark_notif_as_read 

  //mark_notif_as_unread

  fetch_Mark_Notif_as_UnRead = async (notification_id) => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'mark_notif_as_unread');
      formData.append('id', notification_id);

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

            if (str.status === true) {
              this.fetch_New_Notification();
              showMessage({
                message: "",
                description: "Selected Notification is marked as Unread.",
                type: "success",
              });
              //this.setState({},()=>{this.componentDidMount()})

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

  fetch_Mark_Notif_as_Read = async (notification_id) => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'mark_notif_as_read');
      formData.append('id', notification_id);

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

            if (str.status === true) {

              this.fetch_New_Notification();
              showMessage({
                message: "",
                description: "Selected Notification is marked as read.",
                type: "success",
              });
              //this.setState({},()=>{this.componentDidMount()})

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

  // method for New notifications when New Notification button is clicked by calling api method notifications with parameter act = 1 and most_recent_id

  fetch_New_Notification = async () => {
    //this.setState({ DisplayOnlyFollowupNotification: false });
    //  this.setState({FolowUpData:[]});
    let value = this.context;
    console.warn('notification : ', this.state.NotificationData[0])

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'notifications');
      formData.append('act', 1);
      formData.append('most_recent_id', this.state.NotificationData[0].id);


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

            console.warn('notification data :', (str))

            this.setState({ NotificationData: [...this.state.NotificationData, ...str.notifications], unread_Notification_count: str.unread_count }, () => { value.updateBadge(this.state.unread_Notification_count) })

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

  // method for load more notifications when load more text button is clicked by calling api method notifications with parameter act = 2 and last_id

  fetch_Load_More = async () => {

    let value = this.context;

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      var length = this.state.NotificationData.length;
      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'notifications');
      formData.append('act', 2);
      formData.append('last_id', this.state.NotificationData[length - 1].id);


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
            this.props.navigation.navigate('SignUp')

          }

          else {
            // console.log(JSON.stringify(str))

            this.setState({ NotificationData: [...this.state.NotificationData, ...str.notifications], unread_Notification_count: str.unread_count }, () => { value.updateBadge(this.state.unread_Notification_count) })

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

  deleteItemById = id => {
    const filteredData = this.state.NotificationData.filter(item => item.id !== id);
    this.setState({ NotificationData: filteredData });
  }

  toggle_Display_Other_Notification() {
    this.setState({ isNotification: false });
    // if (this.state.DisplayOnlyFollowupNotification) {

    //   this.setState({ DisplayOnlyFollowupNotification: false })

    // }
    // else {

    //   this.setState({ DisplayOnlyFollowupNotification: true })

    // }
    // this.setState({ DisplayOnlyFollowupNotification: true });
    this.setState({ NotificationData: [] });
  }

  async onLoad(payload) {
    console.warn('payload');
    console.warn('componenat did mount')
    _this = this
    let value = this.context;

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      this.setState({ NotificationData: JSON.parse(await AsyncStorage.getItem('NotificationData')) })

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'notifications');
      formData.append('filter_notif', this.state.notificationType)
      formData.append('act', 0);


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


          if (str.error == 101) {

            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp');

          }

          else {
            console.warn("========== , ", (str))
            if (this.state.NotificationData === [] || this.state.NotificationData === null) {

              this.setState({ isLoading: false, NotificationData: str.notifications, unread_Notification_count: str.unread_count }, () => { value.updateBadge(this.state.unread_Notification_count) });

            }

            else {

              this.setState({ isLoading: false, NotificationData: [...this.state.NotificationData, ...str.notifications], unread_Notification_count: str.unread_count }, () => { value.updateBadge(this.state.unread_Notification_count) });

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
  render() {

    return (

      <View style={styles.container}>
        <NavigationEvents onDidFocus={(payload) => { this.onLoad(payload) }} />
        <SafeAreaView>

          {/* Overlay for Update App Notification Prompt */}

          <Overlay
            isVisible={this.state.isvisible}
            windowBackgroundColor="rgba(0, 0, 0, 0.5)"
            overlayBackgroundColor="white"
            width="80%"
            height="35%"
          >

            <View style={{ marginTop: 30 }} >

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

          <View style={{ backgroundColor: '#fff', }} >

            <View style={{ flexDirection: 'row', marginBottom: 2 }} key={this.state.isNotification}>

              <TouchableOpacity onPress={() => { //this.fetch_New_Notification()
                this.setState({ notificationType: 'all' }, () => {
                  this.onLoad(null),
                    this.setState({ isCount: this.state.isCount + 1, isNotification: true })
                })

              }} style={{ opacity: this.state.isNotification ? 1 : 0.5 }}>

                <View style={[styles.new_notification]}>

                  <Image source={require('../assets/images/add_attch_bg.png')} style={styles.new_notofication_Image_Style} resizeMode="cover"></Image>
                  <Image source={require('../assets/images/bell.png')} style={styles.top_image_style1} resizeMode="contain" />
                  <Text style={[styles.newnotficationtext]}>All Notifications</Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => { 
               
                this.setState({ notificationType: 'followup' }, () => {
                  this.onLoad(null),
                    this.setState({ isCount: this.state.isCount + 1, isNotification: false })
                })

                }} style={{ opacity: this.state.isNotification ? 0.5 : 1 }}>

                <View style={[styles.follow_up]}>

                  <Image source={require('../assets/images/Follow_bg.png')} style={styles.follow_up_Image_style} resizeMode="cover"></Image>
                  <Image source={require('../assets/images/phone_call.png')} style={styles.call_btn_style} resizeMode="contain" />
                  <Text style={[styles.followtext]}>Follow up</Text>

                </View>

              </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', marginBottom: 5, }}>

              <TouchableOpacity style={[styles.markAllButton]} onPress={() => { this.fetch_Mark_All_Notif_as_Read() }} >

                <Text style={[styles.markAlltext]}>Mark all as Read</Text>

              </TouchableOpacity>

              {/* <View
                style={{
                  borderRadius: 10 / 2,
                  width: 5,
                  shadowColor: 'rgba(24, 146, 118, 0.44)',
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 6,
                  backgroundColor: '#333333',
                  height: 5,
                  marginTop: 8,
                  marginLeft: widthPercentageToDP(2),
                  flexDirection: 'row',
                }} />

              <TouchableOpacity onPress={() => { this.fetch_Load_More() }} >

                <Text style={[styles.loadMoretext]}>Load More</Text>

              </TouchableOpacity> */}

            </View>

          </View>
          <View key={this.state.isCount} style={{}}>
            <SwipeListView style={{ marginTop: 1, marginBottom: '17%'  }}
              useFlatList={true}
              showsVerticalScrollIndicator={false}
              data={this.state.NotificationData}
              initialNumToRender='16'
              extraData={this.state}
              onEndReachedThreshold={5}
              keyExtractor={(data, index) => {
                return data.id.toString();
              }}
              contentContainerStyle={{paddingBottom: Platform.OS ==='ios' ? 10 : 20}}
              //   stopLeftSwipe={()=>console.warn('stopleftswipe')}
              renderItem={({ item, rowMap }) => (

                <View style={styles.rowFront}>
                  {

                    item.categ === 'crm_contact_upcoming_fup' ?

                      <View onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        var arr = item;
                        arr["height"] = height;
                      }}
                        style={{ flexDirection: 'row', marginTop: 8 }}>

                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                          onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                        >
                          <View key={item.id} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                            <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                              <Image source={require('../assets/images/UPcoming_follow.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                              <View>

                                <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.subHeading}>{item.description}</Text>
                                {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                              </View>

                              <View>

                                <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                              </View>

                            </View>

                          </View>

                        </TouchableOpacity>

                      </View>

                      :

                      item.categ === 'crm_contact_scheduled_fup' ?

                        <View onLayout={(event) => {
                          var { x, y, width, height } = event.nativeEvent.layout;
                          var arr = item;
                          arr["height"] = height;
                        }}
                          style={{ flexDirection: 'row', marginTop: 8 }}>

                          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                            onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                          >
                            <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                              <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                <Image source={require('../assets/images/Overdue_follow.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                              </View>

                              <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                <View>

                                  <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                  <Text style={styles.subHeading}>{item.description}</Text>
                                  {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                </View>

                                <View>

                                  <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                  <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                </View>

                              </View>

                            </View>

                          </TouchableOpacity>

                        </View>

                        : (this.state.DisplayOnlyFollowupNotification) ?

                          item.categ === 'crm_contact_added_note' ?


                            <View onLayout={(event) => {
                              var { x, y, width, height } = event.nativeEvent.layout;
                              var arr = item;
                              arr["height"] = height;
                            }}
                              style={{ flexDirection: 'row', marginTop: 8 }}>

                              <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                              >
                                <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                  <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                    <Image source={require('../assets/images/New_note.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                  </View>

                                  <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                    <View>

                                      <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                      <Text style={styles.subHeading}>{item.description}</Text>
                                      {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                    </View>

                                    <View>

                                      <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                      <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                    </View>

                                  </View>

                                </View>

                              </TouchableOpacity>

                            </View>

                            :

                            item.categ === 'crm_new_adhoc_event' ?

                              <View onLayout={(event) => {
                                var { x, y, width, height } = event.nativeEvent.layout;
                                var arr = item;
                                arr["height"] = height;
                              }}
                                style={{ flexDirection: 'row', marginTop: 8 }}>

                                <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                //onPress={() => { this.props.navigation.navigate('Prospects', {  contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                >
                                  <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                    <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                      <Image source={require('../assets/images/New_note.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                    </View>

                                    <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                      <View>

                                        <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                        <Text style={styles.subHeading}>{item.description}</Text>
                                        {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                      </View>

                                      <View>

                                        <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                        <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                      </View>

                                    </View>

                                  </View>

                                </TouchableOpacity>

                              </View>

                              :

                              item.categ === 'crm_contact_assigned_prospect' ?

                                <View style={{ flexDirection: 'row', marginTop: 8 }}
                                  onLayout={(event) => {
                                    var { x, y, width, height } = event.nativeEvent.layout;
                                    var arr = item;
                                    arr["height"] = height;
                                  }}
                                >

                                  <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                    onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                  >
                                    <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                      <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                        <Image source={require('../assets/images/new_appointment.png')} style={[styles.top_image_style]} resizeMode="contain" />

                                      </View>

                                      <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                        <View>

                                          <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                          <Text style={styles.subHeading}>{item.description}</Text>
                                          {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                        </View>

                                        <View>

                                          <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                          <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                        </View>

                                      </View>

                                    </View>

                                  </TouchableOpacity>

                                </View>

                                :

                                item.categ === 'crm_contact_assigned_client' ?

                                  <View style={{ flexDirection: 'row', marginTop: 8 }}
                                    onLayout={(event) => {
                                      var { x, y, width, height } = event.nativeEvent.layout;
                                      var arr = item;
                                      arr["height"] = height;
                                    }}
                                  >

                                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                      onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                    >
                                      <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                        <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                          <Image source={require('../assets/images/new_appointment.png')} style={[styles.top_image_style]} resizeMode="contain" />

                                        </View>

                                        <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                          <View>

                                            <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                            <Text style={styles.subHeading}>{item.description}</Text>
                                            {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                          </View>

                                          <View>

                                            <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                            <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                          </View>

                                        </View>

                                      </View>

                                    </TouchableOpacity>

                                  </View>

                                  :

                                  item.categ === 'crm_contact_upcoming_appt' ?

                                    <View onLayout={(event) => {
                                      var { x, y, width, height } = event.nativeEvent.layout;
                                      var arr = item;
                                      arr["height"] = height;

                                    }}
                                      style={{ flexDirection: 'row', marginTop: 8 }}>

                                      <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                        // onPress={() => { this.props.navigation.navigate('Details', { Detail: item , Screen : 'Notification' }) }}
                                        onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}

                                      >

                                        <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                          <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                            <Image source={require('../assets/images/new_appointment.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                          </View>

                                          <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                            <View>

                                              <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                              <Text style={styles.subHeading}>{item.description}</Text>
                                              {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                            </View>

                                            <View>

                                              <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                              <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                            </View>

                                          </View>

                                        </View>

                                      </TouchableOpacity>

                                    </View>

                                    :

                                    item.categ === 'crm_contact_set_appt' ?

                                      <View onLayout={(event) => {
                                        var { x, y, width, height } = event.nativeEvent.layout;
                                        var arr = item;
                                        arr["height"] = height;

                                      }}
                                        style={{ flexDirection: 'row', marginTop: 8 }}>

                                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                          // onPress={() => { this.props.navigation.navigate('Details', { Detail: item , Screen : 'Notification' }) }}
                                          onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}

                                        >

                                          <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                            <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                              <Image source={require('../assets/images/new_appointment.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                            </View>

                                            <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                              <View>

                                                <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                                <Text style={styles.subHeading}>{item.description}</Text>
                                                {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                              </View>

                                              <View>

                                                <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                                <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                              </View>

                                            </View>

                                          </View>

                                        </TouchableOpacity>

                                      </View>

                                      :

                                      item.categ === 'addNote' ?

                                        <View onLayout={(event) => {
                                          var { x, y, width, height } = event.nativeEvent.layout;
                                          var arr = item;
                                          arr["height"] = height;
                                        }}
                                          style={{ flexDirection: 'row', marginTop: 8 }}>

                                          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                            onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                          >
                                            <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                              <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                                <Image source={require('../assets/images/New_note.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                              </View>

                                              <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                                <View>

                                                  <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                                  <Text style={styles.subHeading}>{item.description}</Text>
                                                  {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                                </View>

                                                <View>

                                                  <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                                  <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                                </View>

                                              </View>

                                            </View>

                                          </TouchableOpacity>

                                        </View>

                                        :

                                        item.categ === 'crm_contact_closed_won_prospect' ?

                                          <View onLayout={(event) => {
                                            var { x, y, width, height } = event.nativeEvent.layout;
                                            var arr = item;
                                            arr["height"] = height;
                                          }}
                                            style={{ flexDirection: 'row', marginTop: 8 }}>

                                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                              onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                            >
                                              <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                                <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                                  <Image source={require('../assets/images/new_event.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                                </View>

                                                <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                                  <View>

                                                    <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                                    <Text style={styles.subHeading}>{item.description}</Text>
                                                    {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                                  </View>

                                                  <View>

                                                    <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                                    <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                                  </View>

                                                </View>

                                              </View>

                                            </TouchableOpacity>

                                          </View>

                                          :

                                          item.categ === 'upcomingEvent' ?

                                            <View onLayout={(event) => {
                                              var { x, y, width, height } = event.nativeEvent.layout;
                                              var arr = item;
                                              arr["height"] = height;
                                            }}
                                              style={{ flexDirection: 'row', marginTop: 8 }}>

                                              <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                                onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                              >
                                                <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                                  <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                                    <Image source={require('../assets/images/file_with_bg.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                                  </View>

                                                  <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                                    <View>

                                                      <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                                      <Text style={styles.subHeading}>{item.description}</Text>
                                                      {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                                    </View>

                                                    <View>

                                                      <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                                      <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                                    </View>

                                                  </View>

                                                </View>

                                              </TouchableOpacity>

                                            </View>

                                            :

                                            item.categ === 'upcomingAppointment1' ?

                                              <View onLayout={(event) => {
                                                var { x, y, width, height } = event.nativeEvent.layout;
                                                var arr = item;
                                                arr["height"] = height;
                                              }}
                                                style={{ flexDirection: 'row', marginTop: 8 }}>

                                                <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                                  //onPress={() => { this.props.navigation.navigate('Details', { Detail: item , Screen : 'Notification' }) }}
                                                  onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}

                                                >

                                                  <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                                    <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                                      <Image source={require('../assets/images/upcoming_appointment.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                                    </View>

                                                    <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                                      <View>

                                                        <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                                        <Text style={styles.subHeading}>{item.description}</Text>
                                                        {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                                      </View>

                                                      <View>

                                                        <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                                        <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                                      </View>

                                                    </View>

                                                  </View>

                                                </TouchableOpacity>

                                              </View>

                                              :

                                              item.categ === 'crm_upcoming_adhoc_event' ?

                                                <View onLayout={(event) => {
                                                  var { x, y, width, height } = event.nativeEvent.layout;
                                                  var arr = item;
                                                  arr["height"] = height;
                                                }}
                                                  style={{ flexDirection: 'row', marginTop: 8, }}>

                                                  <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}
                                                  //onPress={() => { this.props.navigation.navigate('Prospects', {  contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                                  >

                                                    <View style={{ flexDirection: 'row', backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, borderRadius: 5, flex: 1, marginStart: 14, marginEnd: 16, justifyContent: 'center', }}>

                                                      <View style={{ marginLeft: 5, width: 50, height: 50, borderRadius: 50 / 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                                        <Image source={require('../assets/images/upcoming_event.png')} style={[styles.top_image_style,]} resizeMode="contain" />

                                                      </View>

                                                      <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8, flex: 1, paddingStart: 10, paddingEnd: 8 }}>

                                                        <View>

                                                          <Text style={{ fontWeight: '500', paddingTop: 5, color: '#333333', fontFamily: 'Helvetica Neue', fontSize: 18, width: widthPercentageToDP('45%') }} numberOfLines={2}>{item.title}</Text>
                                                          <Text style={styles.subHeading}>{item.description}</Text>
                                                          {/* <Text style={styles.subHeading}>{item.status}</Text> */}

                                                        </View>

                                                        <View>

                                                          <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '500' }}>{item.date}</Text>
                                                          <Text style={styles.subHeading, { width: widthPercentageToDP('22%'), paddingTop: 5, marginRight: 20, textAlign: 'right', alignItems: 'center', fontWeight: '300' }}>{item.time}</Text>

                                                        </View>

                                                      </View>

                                                    </View>

                                                  </TouchableOpacity>

                                                </View>
                                                :

                                                null

                          : null
                  }

                </View>

              )}
              //   onRowOpen={(rowKey, rowMap) => {

              //     for(var i=0;i<this.state.NotificationData.length;i++){
              //         console.warn(this.state.NotificationData[i]);
              //         console.warn("--------------------------" + i)
              //     }
              //     console.warn(item);

              //   console.warn('onRow Close');
              // }}
              // onScrollEnabled={false}
              onRowOpen={(rowKey, rowMap) => {
                console.warn('onRowOpen : ', rowKey);
                var val = rowMap[rowKey].currentTranslateX;

                // for(i in rowMap){
                //   console.warn(i , " == " , rowMap[i])
                //   var obj = rowMap[i]
                //   for(var j in obj){
                //     console.warn('j : ' , j , " == " , obj[j])
                //   }
                // }

                /// this.setState({isCount:this.state.isCount+1})

                if (val > 0) {
                  setTimeout(() => {
                    rowMap[rowKey].closeRow();
                    var arr = this.state.NotificationData;
                    for (var i = 0; i < arr.length; i++) {
                      if (arr[i].id == rowKey) {
                        console.warn('Before :', arr[i]);
                        arr[i].seen = (arr[i].seen == "1" ? "0" : "1");
                        if (arr[i].seen == 1)
                          this.fetch_Mark_Notif_as_Read(arr[i].id)
                        else
                          this.fetch_Mark_Notif_as_UnRead(arr[i].id)
                        console.warn('aFTER :', arr[i]);
                        break;
                      }
                    }
                    this.setState({ NotificationData: arr });
                    //  setTimeout(() => { this.setState({ isCount: this.state.isCount + 1 }) }, 500)


                  }
                    , 10
                  )

                }
                else {
                  rowMap[rowKey].closeRow();
                }
              }}
              renderHiddenItem={({ item, rowMap }) => (

                <View>

                  {

                    item.categ === 'crm_contact_upcoming_fup' ?

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                          <View style={{ backgroundColor: '#ffcc16', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                          <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray, }}>

                            <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                              onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                            >

                              <Image source={require('./../assets/images/tick_with_bg.png')}
                                style={{ width: 50, height: 50, }} resizeMode="contain" />

                            </TouchableOpacity>

                          </View>

                        </View>

                        <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: item.height, }}>

                          <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                            onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                          >

                            <Image source={require('./../assets/images/pen_with_bg.png')}
                              style={{ width: 50, height: 50, }} resizeMode="contain" />

                          </TouchableOpacity>

                          {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                          onPress={() => { }}
                        >

                          <Image source={require('./../assets/images/trash_with_bg.png')}
                            style={{ width: 50, height: 50, }} resizeMode="contain" />

                        </TouchableOpacity> */}

                        </View>

                      </View>

                      :

                      item.categ === 'crm_contact_scheduled_fup' ?

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                            <View style={{ backgroundColor: '#ffcc16', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                            <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                              <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                              >

                                <Image source={require('./../assets/images/tick_with_bg.png')}
                                  style={{ width: 50, height: 50, }} resizeMode="contain" />

                              </TouchableOpacity>

                            </View>

                          </View>

                          <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                            <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                              onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                            >

                              <Image source={require('./../assets/images/pen_with_bg.png')}
                                style={{ width: 50, height: 50, }} resizeMode="contain" />

                            </TouchableOpacity>

                            {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                            onPress={() => { }}
                          >

                            <Image source={require('./../assets/images/trash_with_bg.png')}
                              style={{ width: 50, height: 50, }} resizeMode="contain" />

                          </TouchableOpacity> */}

                          </View>

                        </View>

                        : (this.state.DisplayOnlyFollowupNotification) ?

                          item.categ === 'crm_contact_added_note' ?

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>

                                <View style={{ backgroundColor: '#6fc5f1', marginTop: 6, width: 4, height: item.height, alignContent: 'center', justifyContent: 'center', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                  <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                    onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                  >

                                    <Image source={require('./../assets/images/tick_with_bg.png')}
                                      style={{ width: 50, height: 50, }} resizeMode="contain" />

                                  </TouchableOpacity>

                                </View>

                              </View>

                              <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: item.height, }}>

                                <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                  onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                >

                                  <Image source={require('./../assets/images/pen_with_bg.png')}
                                    style={{ width: 50, height: 50, }} resizeMode="contain" />

                                </TouchableOpacity>

                                {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                onPress={() => { }}
                              >

                                <Image source={require('./../assets/images/trash_with_bg.png')}
                                  style={{ width: 50, height: 50, }} resizeMode="contain" />

                              </TouchableOpacity> */}

                              </View>

                            </View>


                            :

                            item.categ === 'crm_new_adhoc_event' ?

                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>

                                  <View style={{ backgroundColor: '#6fc5f1', marginTop: 6, width: 4, height: item.height, alignContent: 'center', justifyContent: 'center', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                  <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                    <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                      onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                    >

                                      <Image source={require('./../assets/images/tick_with_bg.png')}
                                        style={{ width: 50, height: 50, }} resizeMode="contain" />

                                    </TouchableOpacity>

                                  </View>

                                </View>

                                <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: item.height, }}>

                                  <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                  // onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                  >

                                    <Image source={require('./../assets/images/pen_with_bg.png')}
                                      style={{ width: 50, height: 50, }} resizeMode="contain" />

                                  </TouchableOpacity>

                                  {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                  onPress={() => { }}
                                >

                                  <Image source={require('./../assets/images/trash_with_bg.png')}
                                    style={{ width: 50, height: 50, }} resizeMode="contain" />

                                </TouchableOpacity> */}

                                </View>

                              </View>


                              :

                              item.categ === 'crm_contact_assigned_prospect' ?

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                    <View style={{ backgroundColor: '#29dfb4', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                    <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                      <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                        onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                      >

                                        <Image source={require('./../assets/images/tick_with_bg.png')}
                                          style={{ width: 50, height: 50, }} resizeMode="contain" />

                                      </TouchableOpacity>

                                    </View>

                                  </View>

                                  <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: item.height, }}>

                                    <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                      onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                    >

                                      <Image source={require('./../assets/images/pen_with_bg.png')}
                                        style={{ width: 50, height: 50, }} resizeMode="contain" />

                                    </TouchableOpacity>

                                    {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                    onPress={() => { }}
                                  >

                                    <Image source={require('./../assets/images/trash_with_bg.png')}
                                      style={{ width: 50, height: 50, }} resizeMode="contain" />

                                  </TouchableOpacity> */}

                                  </View>

                                </View>

                                :

                                item.categ === 'crm_contact_assigned_client' ?

                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                      <View style={{ backgroundColor: '#29dfb4', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                      <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                        <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                          onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                        >

                                          <Image source={require('./../assets/images/tick_with_bg.png')}
                                            style={{ width: 50, height: 50, }} resizeMode="contain" />

                                        </TouchableOpacity>

                                      </View>

                                    </View>

                                    <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: item.height, }}>

                                      <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                        onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                      >

                                        <Image source={require('./../assets/images/pen_with_bg.png')}
                                          style={{ width: 50, height: 50, }} resizeMode="contain" />

                                      </TouchableOpacity>

                                      {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                      onPress={() => { }}
                                    >

                                      <Image source={require('./../assets/images/trash_with_bg.png')}
                                        style={{ width: 50, height: 50, }} resizeMode="contain" />

                                    </TouchableOpacity> */}

                                    </View>

                                  </View>

                                  :

                                  item.categ === 'crm_contact_upcoming_appt' ?

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                        <View style={{ backgroundColor: '#29dfb4', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                        <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                          <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                            onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                          >

                                            <Image source={require('./../assets/images/tick_with_bg.png')}
                                              style={{ width: 50, height: 50, }} resizeMode="contain" />

                                          </TouchableOpacity>

                                        </View>

                                      </View>

                                      <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: item.height, }}>

                                        <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                          // onPress={() => { this.props.navigation.navigate('Details', { Detail: item , Screen : 'Notification' }) }}
                                          onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}

                                        >

                                          <Image source={require('./../assets/images/pen_with_bg.png')}
                                            style={{ width: 50, height: 50, }} resizeMode="contain" />

                                        </TouchableOpacity>

                                        {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                        onPress={() => { }}
                                      >

                                        <Image source={require('./../assets/images/trash_with_bg.png')}
                                          style={{ width: 50, height: 50, }} resizeMode="contain" />

                                      </TouchableOpacity> */}

                                      </View>

                                    </View>

                                    :

                                    item.categ === 'crm_contact_set_appt' ?

                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                          <View style={{ backgroundColor: '#29dfb4', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                          <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                            <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                              onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                            >

                                              <Image source={require('./../assets/images/tick_with_bg.png')}
                                                style={{ width: 50, height: 50, }} resizeMode="contain" />

                                            </TouchableOpacity>

                                          </View>

                                        </View>

                                        <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: item.height, }}>

                                          <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                            // onPress={() => { this.props.navigation.navigate('Details', { Detail: item , Screen : 'Notification' }) }}
                                            onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}

                                          >

                                            <Image source={require('./../assets/images/pen_with_bg.png')}
                                              style={{ width: 50, height: 50, }} resizeMode="contain" />

                                          </TouchableOpacity>

                                          {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                          onPress={() => { }}
                                        >

                                          <Image source={require('./../assets/images/trash_with_bg.png')}
                                            style={{ width: 50, height: 50, }} resizeMode="contain" />

                                        </TouchableOpacity> */}

                                        </View>

                                      </View>

                                      :

                                      item.categ === 'addNote' ?

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                            <View style={{ backgroundColor: '#6dc3f1', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                            <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                              <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                              >

                                                <Image source={require('./../assets/images/tick_with_bg.png')}
                                                  style={{ width: 50, height: 50, }} resizeMode="contain" />

                                              </TouchableOpacity>

                                            </View>

                                            <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                                              <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                              >

                                                <Image source={require('./../assets/images/pen_with_bg.png')}
                                                  style={{ width: 50, height: 50, }} resizeMode="contain" />

                                              </TouchableOpacity>
                                              {/* 
                                            <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                              onPress={() => { }}
                                            >

                                              <Image source={require('./../assets/images/trash_with_bg.png')}
                                                style={{ width: 50, height: 50, }} resizeMode="contain" />

                                            </TouchableOpacity> */}

                                            </View>

                                          </View>

                                        </View>
                                        :

                                        item.categ === 'crm_contact_closed_won_prospect' ?

                                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                              <View style={{ backgroundColor: '#f55fa1', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                              <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                                <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                  onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                                >

                                                  <Image source={require('./../assets/images/tick_with_bg.png')}
                                                    style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                </TouchableOpacity>

                                              </View>

                                            </View>

                                            <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                                              <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                              >

                                                <Image source={require('./../assets/images/pen_with_bg.png')}
                                                  style={{ width: 50, height: 50, }} resizeMode="contain" />

                                              </TouchableOpacity>

                                              {/* <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: '#f4599e' }, styles.icon]}
                                              onPress={() => { }}
                                            >

                                              <Image source={require('./../assets/images/trash_with_bg.png')}
                                                style={{ width: 50, height: 50, }} resizeMode="contain" />

                                            </TouchableOpacity> */}

                                            </View>

                                          </View>
                                          :

                                          item.categ === 'setEvent' ?

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                                <View style={{ backgroundColor: '#f4549b', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                                <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                                  <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                    onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                                  >

                                                    <Image source={require('./../assets/images/tick_with_bg.png')}
                                                      style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                  </TouchableOpacity>

                                                </View>

                                              </View>

                                              <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                                                <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                // onPress={() => { this.props.navigation.navigate('Prospects', {  contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                                >

                                                  <Image source={require('./../assets/images/pen_with_bg.png')}
                                                    style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                </TouchableOpacity>

                                                {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                onPress={() => { }}
                                              >

                                                <Image source={require('./../assets/images/trash_with_bg.png')}
                                                  style={{ width: 50, height: 50, }} resizeMode="contain" />

                                              </TouchableOpacity> */}

                                              </View>

                                            </View>

                                            :

                                            item.categ === 'upcomingEvent' ?

                                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                                  <View style={{ backgroundColor: '#b4b6b5', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                                  <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                                    <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                      onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                                    >

                                                      <Image source={require('./../assets/images/tick_with_bg.png')}
                                                        style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                    </TouchableOpacity>

                                                  </View>

                                                </View>

                                                <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                                                  <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                  //  onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                                  >

                                                    <Image source={require('./../assets/images/pen_with_bg.png')}
                                                      style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                  </TouchableOpacity>

                                                  {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                  onPress={() => { }}
                                                >

                                                  <Image source={require('./../assets/images/trash_with_bg.png')}
                                                    style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                </TouchableOpacity> */}

                                                </View>

                                              </View>

                                              :

                                              item.categ === 'upcomingAppointment1' ?

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                                    <View style={{ backgroundColor: '#b4b6b5', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                                    <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                                      <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                        onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                                      >

                                                        <Image source={require('./../assets/images/tick_with_bg.png')}
                                                          style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                      </TouchableOpacity>

                                                    </View>

                                                  </View>

                                                  <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                                                    <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                      // onPress={() => { this.props.navigation.navigate('Details', { Detail: item, Screen : 'Notification' }) }}
                                                      onPress={() => { this.props.navigation.navigate('Prospects', { contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}

                                                    >

                                                      <Image source={require('./../assets/images/pen_with_bg.png')}
                                                        style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                    </TouchableOpacity>

                                                    {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                    onPress={() => { }}
                                                  >

                                                    <Image source={require('./../assets/images/trash_with_bg.png')}
                                                      style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                  </TouchableOpacity> */}

                                                  </View>

                                                </View>
                                                :

                                                item.categ === 'crm_upcoming_adhoc_event' ?

                                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                                                      <View style={{ backgroundColor: '#b6b7b7', marginTop: 6, width: 4, height: item.height, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />

                                                      <View style={{ marginLeft: 12, marginTop: 8, backgroundColor: Colors.lightGray }}>

                                                        <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                          onPress={() => { this.fetch_Mark_Notif_as_Read(item.id) }}
                                                        >

                                                          <Image source={require('./../assets/images/tick_with_bg.png')}
                                                            style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                        </TouchableOpacity>

                                                      </View>

                                                    </View>

                                                    <View style={{ marginTop: 8, borderRadius: 5, marginEnd: 14, backgroundColor: (item.seen === "1") ? '#d7e2e0' : Colors.white_color, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', height: item.height, }}>

                                                      <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                      // onPress={() => { this.props.navigation.navigate('Prospects', {  contactID: item.details.contact_id, setValue: 0, tabValue: 1, Screen: 'Notification' }) }}
                                                      >

                                                        <Image source={require('./../assets/images/pen_with_bg.png')}
                                                          style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                      </TouchableOpacity>

                                                      {/* <TouchableOpacity activeOpacity={1} style={[styles.icon]}
                                                      onPress={() => { }}
                                                    >

                                                      <Image source={require('./../assets/images/trash_with_bg.png')}
                                                        style={{ width: 50, height: 50, }} resizeMode="contain" />

                                                    </TouchableOpacity> */}

                                                    </View>

                                                  </View>
                                                  :
                                                  null

                          : null
                  }

                </View>

              )}

              leftOpenValue={widthPercentageToDP('17%')}
              rightOpenValue={widthPercentageToDP('-19%')}
              onSwipeValueChange={this.onSwipeValueChange}
            />
          </View>
        </SafeAreaView>

      </View>

    );
  }

}

// styling Code for UI Elements of this page

const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: Colors.lightGray,

  },

  top_layout: {

    paddingTop: 5,
    height: 32,
    paddingRight: 20,
    paddingLeft: 20

  },

  top_image_style: {

    flexDirection: 'row',
    width: 50, height: 50,
    borderRadius: 50 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  top_image_style1: {

    flexDirection: 'row',
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  new_notification: {

    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: widthPercentageToDP('47%'),
    flexDirection: 'row',
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16,
    backgroundColor: '#29dfb4',

  },

  follow_up: {

    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: widthPercentageToDP('43%'),
    flexDirection: 'row',
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16,
    backgroundColor: '#29dfb4',
  },

  loadMore: {

    marginLeft: widthPercentageToDP(2),
    width: widthPercentageToDP('23%'),
    height: 42,
    alignItems: 'flex-end',

  },

  markAll: {

    marginLeft: widthPercentageToDP(2),
    width: widthPercentageToDP('40%'),
    flexDirection: 'row',
    height: 42,
    alignContent: 'flex-end'

  },

  call_btn_style: {

    flexDirection: 'row',
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginEnd: -4,
    marginStart: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  top_view_btn: {

    marginTop: 10,
    flexDirection: 'row',
    height: 36,
    borderRadius: 36 / 2,
    justifyContent: 'center',
    paddingStart: 16, paddingEnd: 16

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

  followUp1: {

    marginTop: 6,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 17,
    fontWeight: '600',

  },

  rowFront: {

    alignItems: 'center',
    justifyContent: 'center',

  },

  rowBack: {

    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  new_notofication_Image_Style: {

    flex: 1,
    position: 'absolute',
    width: widthPercentageToDP('47%'),
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: '#f0ab16',

  },

  follow_up_Image_style: {

    flex: 1,
    marginLeft: 20,
    paddingLeft: 20,
    position: 'absolute',
    width: widthPercentageToDP('43%'),
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: '#f0ab16',

  },

  newnotficationtext: {

    flex: 1,
    marginTop: 10,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,

  },

  followtext: {

    flex: 1,
    marginTop: 10,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,

  },

  loadMoretext: {

    color: '#4ba5e7',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    alignContent: 'flex-end',
    paddingLeft: widthPercentageToDP(2),

  },

  markAlltext: {

    color: '#4ba5e7',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',

  },

  markAllButton: {
    // alignContent: 'flex-end',
    marginLeft: widthPercentageToDP(65),

  },

  icon: {

    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    margin: 10,

  },

  list_txt: {

    color: Colors.primaryColor,
    fontSize: 18,

  },

  name: {

    color: '#4ba5e7',
    fontFamily: 'Helvetica Neue',
    fontSize: 20,
    fontWeight: '500',

  },

  list_item_des: {

    fontSize: 16,
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',

  },

  subHeading: {

    width: widthPercentageToDP('47%'),
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,

  },

  Heading: {

    color: '#333333',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 31,

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
