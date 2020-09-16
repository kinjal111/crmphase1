import React, { Component } from 'react';
import { Ionicons, FontAwesome } from 'react-native-vector-icons';
import { Platform, Image, View } from 'react-native';
import Colors from '../constants/Colors';
import { Badge } from 'react-native-elements'

const BadgeValue = 5;

export default class TabBarIcon extends Component {

  render() {
    return (

      ({ focused }) => (

        <View>

          <Image source={require('../assets/images/notification_bell.png')}
            style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />
            
            {(!BadgeValue) ? 
              null 
            :
           
            <Badge
              badgeStyle={{ backgroundColor: '#f4599e', paddingVertical: 2, height: 20, backgroundRadius: 30 / 2 }}
              containerStyle={{ position: 'absolute', top: -7, right: -25 }}
              value={BadgeValue}
            />
        
            }
        
        </View>
      )
    );
  }
}
