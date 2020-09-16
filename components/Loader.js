
import React from './node_modules/react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

export default class Loader extends React.Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="small" color={Colors.primaryColor} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});