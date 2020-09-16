import React from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import { BadgeContext } from './IconHome';

//  This Screen is designed for testing the Badge value update functionality from textbox 

export default class SecondComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  static contextType = BadgeContext;

  render() {
    
    return (
      <BadgeContext.Consumer>
        {value =>

          <View style={{ width: 24, height: 24, margin: 5 }}>

            <TextInput
              style={styles.input}
              placeholder='name'
              onChangeText={text => value.updateBadge(text)}
            />
          </View>
        }
      </BadgeContext.Consumer>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  title: {
    fontSize: 40,
    color: 'purple'
  },
  subTitle: {
    fontSize: 22,
    margin: 16,
    color: 'blue'
  },
  input: {
    height: 40,
    padding: 8,
    margin: 8,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 20,
    width: 100
  }
});
