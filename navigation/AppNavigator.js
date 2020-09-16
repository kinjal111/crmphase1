import React from 'react';
import { Platform, Image, View } from 'react-native';
import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import { Dimensions } from "react-native";
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import AddContactScreen from '../screens/AddContactScreen';
import Constant from '../constants/Constant';
import DashboardScreen from '../screens/DashboardScreen';
import ProspectsScreen from '../screens/ProspectsScreen';
import Colors from '../constants/Colors';
import DrawerContent from './DrawerContent';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SalesReportScreen from '../screens/SalesReportScreen';
import EventScreen from '../screens/EventScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import OpportunityScreen from '../screens/OpportunityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AccountSettingsSecondScreen from '../screens/AccountSettingsSecondScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FollowUpScreen from '../screens/FollowUpScreen';
import CalllistScreen from '../screens/CalllistScreen';
import UpdateNotificationsScreen from '../screens/UpdateNotificationsScreen';
import IconWithBadge from '../components/IconWithBadge';
import SecondComponent from '../components/SecondComponent';
import { backgroundColor } from 'react-native-calendars/src/style';

// congigaration for web and IOS for headerMode

const config = Platform.select({
  web: { headerMode: 'screen' },
  ios: {}

});




//Authentication stack on which login, signup and its relative routes are defined

const AuthStack = createStackNavigator({

  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },

  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
},

  {
    initialRouteName: 'Login',


  });

// Define ProspectsStack on which Dashboard routes and all routes for screen from which we can jump directly to Dashboard Screen are defined 

const ProspectsStack = createStackNavigator({

  Dashboard: {
    screen: DashboardScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  SecondComponent: {
    screen: SecondComponent,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  Contact: {
    screen: CalllistScreen,
    navigationOptions: {
      headerBackTitle: null,

    }
  },
  AddContact: {
    screen: AddContactScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  AccountSettingSecond: {
    screen: AccountSettingsSecondScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },

  Appointment: {
    screen: AppointmentsScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  Event: {
    screen: EventScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  Opportunity: {
    screen: OpportunityScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  Followup: {
    screen: FollowUpScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
  Notification: {
    screen: NotificationsScreen,
    navigationOptions: {
      headerBackTitle: null,
    }
  },
}

);

// For the Tab Navigation Bar Icon and Text for DashBoard Page is defined

ProspectsStack.navigationOptions = {
  tabBarLabel: Constant.dashboard,

  tabBarIcon: ({ focused }) => (

    <Image source={require('../assets/images/home.png')}
      style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />

  ), navigationOptions: {

  },
};

ProspectsStack.path = '';

// Define ContactStack on which Contact routes and all routes for screen from which we can jump directly or Indirectly to Contact/call list Screen are defined 

const ContactStack = createStackNavigator(
  {
    Contact: {
      screen: CalllistScreen,
      navigationOptions: {
        headerBackTitle: null,

      }
    },
    AddContact: {
      screen: AddContactScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Prospects: {
      screen: ProspectsScreen,
      navigationOptions: {
        headerBackTitle: null,

      }
    },
    AccountSettingSecond: {
      screen: AccountSettingsSecondScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },

    Appointment: {
      screen: AppointmentsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Followup: {
      screen: FollowUpScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Add: {
      screen: AddNoteScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Opportunity: {
      screen: OpportunityScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
  },
  {
    //  cardStyle:{backgroundColor:'#00b1f7'}
  }

);

// For the Tab Navigation Bar Icon and Text for Contact Page is defined

ContactStack.navigationOptions = {
  tabBarLabel: Constant.contacts,
  tabBarIcon: ({ focused }) => (

    <Image source={require('../assets/images/User_2.png')}
      style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />
  ),
};

ContactStack.path = '';

// Define CalendarStack on which Calendar routes and all routes for screen from which we can jump directly or Indirectly to CalendarScreen are defined 

const CalendarStack = createStackNavigator(
  {

    Calendar: {
      screen: CalendarScreen,
      navigationOptions: {
        headerBackTitle: null,

      }
    },
    Details: {
      screen: DetailsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Prospects: {
      screen: ProspectsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    AccountSettingSecond: {
      screen: AccountSettingsSecondScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Appointment: {
      screen: AppointmentsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Event: {
      screen: EventScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Followup: {
      screen: FollowUpScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Add: {
      screen: AddNoteScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Opportunity: {
      screen: OpportunityScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
  },
  {
    // cardStyle:{backgroundColor:'#00b1f7'}
  }
);

// For the Tab Navigation Bar Icon and Text for calendar Page is defined

CalendarStack.navigationOptions = {
  tabBarLabel: Constant.calendar,
  tabBarIcon: ({ focused }) => (

    <Image source={require('../assets/images/calendar.png')}
      style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />
  ),
};

CalendarStack.path = '';

// Define NotificationsStack Separately for navigation in Notification Screen from Bottom Tab Bar Menu  

const NotificationsStack = createStackNavigator(
  {
    NotificationSettings: NotificationsScreen,
    Prospects: {
      screen: ProspectsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    AccountSettingSecond: {
      screen: AccountSettingsSecondScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Appointment: {
      screen: AppointmentsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Event: {
      screen: EventScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Followup: {
      screen: FollowUpScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Add: {
      screen: AddNoteScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Opportunity: {
      screen: OpportunityScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
    Details: {
      screen: DetailsScreen,
      navigationOptions: {
        headerBackTitle: null,
      }
    },
  },

  {
    // cardStyle:{backgroundColor:'#00b1f7'}
  }

);

// For the Tab Navigation Bar Icon and Text and the badge with Icon for Notification Page is defined

NotificationsStack.navigationOptions = (navigation) => ({

  tabBarLabel: Constant.notifications,
  tabBarIcon:
    ({ focused }) => (

      <View>

        <IconWithBadge focused={focused} />

      </View>
    ),
});

// Defined Stack which is visible in the Bottom Tab Bar menu

const tabNavigator = createBottomTabNavigator({

  ProspectsStack,
  ContactStack,
  CalendarStack,
  NotificationsStack

},
  {
    /* The header config from HomeScreen is now here */

    defaultNavigationOptions: ({ navigation }) => ({
    }),
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected,
      inactiveTintColor: Colors.tabIconDefault,
      labelStyle: {
        marginBottom: 2,
        fontSize: 12,

      },
      style: {
        height: 50,
        justifyContent: 'center'
      },
    },
  });

// defined the drawer navigator and its property 

const MyDrawerNavigator = createDrawerNavigator(
  {
    [Constant.home]: tabNavigator,
  },
  {

    contentComponent: DrawerContent,
    drawerPosition: 'left',
    drawerWidth: Dimensions.get('window').width,
    drawerBackgroundColor: Colors.primaryColor,

  }
);

// Defined AppContainer in which with the hepl of switchNavigator we switch between the differnt navigation Options

export default createAppContainer(
  createSwitchNavigator({

    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Splash: SplashScreen,
    Auth: AuthStack,
    Main: MyDrawerNavigator,

  }
  )
);
