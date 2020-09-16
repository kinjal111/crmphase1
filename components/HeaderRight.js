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

export default class HeaderRight extends Component {

  _clickAction = (action) => {
    switch (action) {
      case "feed":
        this.props.navigationProps.push('AddFeed')
        break

      default:

        break
    }
  }

  renderIcon = (action) => {
    switch (action) {
      case "feed":
        return (
          <TouchableOpacity
            style={styles.top_layout}
            activeOpacity={1}
          >
            <Image source={require('./../assets/images/menu.png')}
              style={{ width: 20, height: 20, }} />
          </TouchableOpacity>
        )

      default:
        return (
          <TouchableOpacity
            style={styles.top_layout}
            activeOpacity={1}
          
          >
            <Image source={require('./../assets/images/menu.png')}
              style={{ width: 20, height: 20, }} />
          </TouchableOpacity>
        )
    }
  }

  render() {
    return (
      <View style={{
        justifyContent: 'center',
        marginEnd: 16
      }}>
        {this.renderIcon(this.props.screen)}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  top_layout: {
    width: 32,
    height: 32,
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'center',
  }
})
