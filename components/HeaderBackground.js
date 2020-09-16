import React, { Component } from 'react'
import {
  Platform,
  View,
  ImageBackground
} from 'react-native';

export default class HeaderBackground extends Component {

  render() {
    return (
      <View style = {{width: '100%', height: '100%',backgroundColor:'#00b1f7'}}>
      <ImageBackground
        source={require('../assets/images/header_bg.png')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      </View>
    )
  }
}
