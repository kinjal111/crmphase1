import React, { PureComponent } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import LabelError from '../LabelError';

import {
  textPrimary,
  iconDark,
} from '../../../config/colors';
import styles from './styles';

export default class NumberSelector extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number.isRequired,
    step: PropTypes.number,
    value: PropTypes.number,
    placeholder: PropTypes.any,
    onNumberChanged: PropTypes.func,
    disabled: PropTypes.bool,
    directTextEdit: PropTypes.bool,
    error: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    max: null,
    step: 1,
    value: 0,
    onNumberChanged: () => {},
    placeholder: 0,
    disabled: false,
    directTextEdit: false,
    error: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  onChangeText = (value) => {
    const {
      max,
      min,
      step,
      onNumberChanged,
    } = this.props;
  //  const sanitizedValue = Number(value);
    const sanitizedValue = (value);
    console.warn('value : ', value , ' :: ' , sanitizedValue)
    // if (isNaN(sanitizedValue)) {
    //   console.warn("111");
    //   return;
    // }
    // if (step && sanitizedValue % step !== 0) {
    //   console.warn("222");
    //   return;
    // }
    // if (min && sanitizedValue < min) {
    //   console.warn("333");
    //   return;
    // }
    // if (max && sanitizedValue > max) {
    //   console.warn("444");
    //   return;
    // }
    console.warn("555");
    this.setState({
      value: sanitizedValue,
    }, () => {
      onNumberChanged(sanitizedValue);
    });
  };

  update = (increment) => {
    const {
      max,
      min,
      step,
      onNumberChanged,
    } = this.props;
    const { value } = this.state;
    let finalValue;
    if (increment) {
      finalValue = step ? value + step : value + 1;
      if (max && finalValue > max) {
        finalValue = value;
      }
    } else {
      finalValue = step ? value - step : value - 1;
      if ((min || min === 0) && finalValue < min) {
        finalValue = value;
      }
    }
    this.setState({
      value: finalValue,
    }, () => {
      onNumberChanged(finalValue);
    });
  };

  render() {
    const {
      label,
      value,
      error,
      placeholder,
      disabled,
      directTextEdit,
    } = this.props;
    return (
      <View>
        <LabelError
          label={label}
          error={error}
        />
        <View style={styles.inputContainer}>
          <View style={styles.controllersContainer}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              disabled={disabled}
              onPress={() => {
                this.update(false);
              }}
            >
             
            </TouchableOpacity>
          </View>
          <TextInput
            onChangeText={this.onChangeText}
            underlineColorAndroid="transparent"
            placeholder={`${placeholder}`}
            value={value ? `${value}` : ''}
            placeholderTextColor={textPrimary}
            style={styles.input}
            keyboardType={'numeric'}
          />
          <View style={styles.controllersContainer}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              disabled={disabled}
              onPress={() => {
                this.update(true);
              }}
            >
              
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
