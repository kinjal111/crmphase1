import React from 'react';
import {
  View,
  Button,
  Image,
  Text
} from 'react-native';
import Colors from '../constants/Colors';
import { BadgeContext } from './IconHome';

export default class IconWithBadge extends React.Component {

  constructor(props) {
    super(props)
  }

  static contextType = BadgeContext;

  // and Display the Updated Value of badge with Badge Style and Icon with the help of BadgeContext.Consumer

  render() {
    const { focused } = this.props;
    return (

      <BadgeContext.Consumer>
        {value =>

          <View style={{ width: 24, height: 24, marginTop: 1 }}>

            <Image source={require('../assets/images/notification_bell.png')}
              style={{ width: 20, height: 20, tintColor: focused ? Colors.tabIconSelected : Colors.tabIconDefault }} resizeMode="cover" />

            {

              (value.badge == 0 || !value.badge) ? null :
                <View
                  style={{
                    // If you're using react-native < 0.57 overflow outside of parent
                    // will not work on Android, see https://git.io/fhLJ8
                    position: 'absolute', top: -3, right: -30,
                    backgroundColor: '#fff',
                    backgroundColor: '#f4599e', paddingVertical: 2, height: 20, width: 40,
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >

                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', fontFamily: 'Helvetica Neue' }}>

                    {value.badge}

                  </Text>

                </View>
            }
          </View>
        }
      </BadgeContext.Consumer>
    );
  }
}