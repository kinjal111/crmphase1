import React, { Component } from 'react'
import {
  Platform,
  ImageBackground
} from 'react-native';

export default class HeaderBackground1 extends Component {

  render() {
    return (
      <ImageBackground
        source={require('../assets/images/header_bg.png')}
        style={{ width: '100%' }}
        resizeMode="cover"
      />
    )
  }
}
