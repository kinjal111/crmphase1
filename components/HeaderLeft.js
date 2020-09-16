import React, { Component } from 'react'
import {
  Platform,
  TouchableOpacity,
  View,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons, FontAwesome } from 'react-native-vector-icons';
import Colors from '../constants/Colors';

export default class HeaderLeft extends Component {

  toggleDrawer = () => {

    this.props.navigationProps.toggleDrawer();
 

  }

  render() {
    return (
      <View style={{flexDirection:'row',
        justifyContent: 'center',
      }}>
          {/* <TouchableOpacity
      style={styles.top_layout}
      activeOpacity={1}
      onPress={() => { this.props.navigation.navigate('Home') }}
    >
      <Image source={require('./../assets/images/arrow-left.png')}
        style={{ width:20, height:20}} resizeMode="contain" />
    </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.top_layout}
          activeOpacity={1}
          onPress={this.toggleDrawer.bind(this)}
        >
          <Image source={require('./../assets/images/menu_3x.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  top_layout: {
    flexDirection:'row',
    width: 32,
    height: 32,
    paddingRight: 20,
    paddingLeft: 30,
    paddingTop:5,
    justifyContent: 'center',
  }
})
