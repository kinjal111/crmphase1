// import React from 'react';
// import { Platform, Image, View } from 'react-native';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
// import DashboardScreen from '../screens/DashboardScreen';
// import CalllistScreen from '../screens/CalllistScreen';
// import CalendarScreen from '../screens/CalendarScreen';
// import NotificationsScreen from '../screens/NotificationsScreen';
// import DetailsScreen from '../screens/DetailsScreen';
// import Constant from '../constants/Constant';
// import Colors from '../constants/Colors';
// import { Badge } from 'react-native-elements'
// import { apiBasePath } from '../constantApi';




// const config = Platform.select({
//   web: { headerMode: 'screen' },
//   ios: {}
// });


// fetch_get_unread_notif_count = async () => {

//   const api_token = await AsyncStorage.getItem(Constant.api_token);
//   let formData = new FormData();
//   formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
//   formData.append('api_token', api_token);
//   formData.append('method', 'get_unread_notif_count');

//   fetch(apiBasePath, {
//     method: 'POST',
//     body: formData
//   })

//     .then(response => {
//       if (response.status == 200) {

//         return response.json();
//       }
//       else if (response.status == 101) {
//         AsyncStorage.removeItem(Constant.api_token);
//         this.props.navigation.navigate('SignUp');
//       }
//       else {

//       }

//     })
//     .then(responseJson => {
//       str = responseJson;

//       if (str.error === 101) {
//         AsyncStorage.removeItem(Constant.api_token);
//         this.props.navigation.navigate('SignUp')

//       }
//       else {
//         // alert(JSON.stringify(str))   
//       }

//     })
//     .catch(error => {

//       this.setState({ }, () => { });
//     }
//     )

// }


// const DashboardStack = createStackNavigator(
//   {
//     Home: DashboardScreen,
//   },
//   config
// );


// DashboardStack.navigationOptions = {
//   tabBarLabel: Constant.dashboard,

//   tabBarIcon: ({ focused }) => (

//     <Image source={require('../assets/images/home.png')}
//       style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />

//   ), headerMode: 'none', navigationOptions: {
//     headerVisible: false,

//   },
// };

// DashboardStack.path = '';



// const ContactStack = createStackNavigator(
//   {
//     Contacts: CalllistScreen,
//   },
//   config
// );

// ContactStack.navigationOptions = {
//   tabBarLabel: Constant.contacts,
//   tabBarIcon: ({ focused }) => (


//     <Image source={require('../assets/images/User_2.png')}
//       style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />
//   ),
// };

// ContactStack.path = '';



// const CalendarStack = createStackNavigator(
//   {
//     Calender: CalendarScreen,
//   },
//   config
// );

// CalendarStack.navigationOptions = {
//   tabBarLabel: Constant.calendar,
//   tabBarIcon: ({ focused }) => (

//     <Image source={require('../assets/images/calendar.png')}
//       style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />
//   ),
// };

// CalendarStack.path = '';

// const NotificationsStack = createStackNavigator(
//   {
//     NotificationSettings: NotificationsScreen,
//   },
//   config
// );





// NotificationsStack.navigationOptions = (navigation) => ({

//   tabBarLabel: Constant.notifications,
//   tabBarIcon: ({ focused }) => (

//     <View> 

//       <Image source={require('../assets/images/notification_bell.png')}
//        style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" /> 
//   {(focused) ? null :
//       <Badge
//         badgeStyle = {{backgroundColor: '#f4599e',height:15,backgroundRadius:30}}
//         containerStyle={{ position: 'absolute', top: -4, right: -20 }}
//         value = { 10
//         }
//   />}
//   </View>
//   ),
// });

// NotificationsStack.path = '';

// const tabNavigator = createBottomTabNavigator({
//    DashboardStack,
//    ContactStack,
//    CalendarStack,
//    NotificationsStack

// },
//   {
//     /* The header config from HomeScreen is now here */
//     defaultNavigationOptions: ({ navigation }) => ({


//     }),
//     tabBarOptions: {
//       tabBarVisible:true,
//       activeTintColor: Colors.tabIconSelected,
//       inactiveTintColor: Colors.tabIconDefault,
//       labelStyle: {
//         marginBottom: 2,
//         fontSize: 12,

//       },
//       style: {
//         height: 50,
//         justifyContent: 'center'
//       },
//     },
//   });

// tabNavigator.path = '';

// module.exports = tabNavigator;
