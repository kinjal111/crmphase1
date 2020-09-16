import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { textHeader, font_style } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Colors from '../constants/Colors';


export default class ProgressScreen extends React.Component {

  // Display the Header In the Screen 

  static navigationOptions = ({ navigation }) => ({

    headerBackground: <HeaderBackground />,

    headerTitle: <Text style={textHeader.header}>Work in Progress</Text>,

  });

  // Initilize the State And It's Variable

  constructor() {
    super();
    this.state = {

    }
  }

  componentDidMount() {

  }

  // Display the Ui Content

  render() {

    return (

      <View style={styles.container}>

      </View >
    );
  }

}

// styleing Code for ui Elements of this Page

const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: Colors.white_color,

  },

});
