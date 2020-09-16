import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import DatePicker from 'react-native-datepicker';

import LabelError from '../LabelError';

import styles from './styles';

export default class CustomDate extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    iconSource:PropTypes.string,
    placeholder: PropTypes.string,
    onDateChange: PropTypes.func,
    disabled: PropTypes.bool,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    dateFormat: PropTypes.string,
    error: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    value: '',
    placeholder: '',
    onDateChange: () => {},
    disabled: false,
    minDate: null,
    maxDate: null,
    dateFormat: 'DD-MM-YYYY',
    error: false,
    iconSource:'',
  };

  onDateChange = (date) => {
    const { onDateChange } = this.props;
    onDateChange(date);
    console.warn("ON CHANGE DATE",date);
  }

  render() {
    const {
      label,
      value,
      placeholder,
      disabled,
      minDate,
      maxDate,
      dateFormat,
      error,
      iconSource
    } = this.props;
    const moreOptions = {};
    if (minDate) {
      moreOptions.minDate = minDate;
    }
    if (maxDate) {
      moreOptions.maxDate = maxDate;
    }
    return (
      <View >
        <LabelError
          label={label}
          error={error}
        />
        <DatePicker
          {...moreOptions}
          style={styles.dateContainer}
          date={value}
          mode="date"
          placeholder={placeholder}
          format={dateFormat}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          disabled={disabled}
          iconSource={require('../../../../../assets/images/calender1.png')}
          customStyles={{
            datePickerCon: { backgroundColor: '#eff0f2' },
            datePicker: { backgroundColor: '#d0d3da' },
            btnTextCancel: {
              color: '#0b6ee6'
            },
            btnTextConfirm: {
              color: '#0b6ee6'
            },
            dateIcon: {
              position: 'absolute',
              right: 0,
              marginEnd: 15, width: 22, height: 22, justifyContent: 'center',
              tintColor:'#222222',
              // tintColor: 'red',//00b1f700
              borderColor: 'transparent'
            },
            dateInput: [{
              alignItems: 'flex-start',
              backgroundColor: '#eaf0f3',
              borderRadius : 23,
              height:46,
              flex: 1,
              paddingHorizontal:16,
              fontSize: 16,
              fontFamily: 'Helvetica Neue',
              fontWeight: '400',
              borderColor: 'transparent',
              marginTop: 15,
            
             },
            ]
          }}
          onDateChange={this.onDateChange}
        />
      </View>
    );
  }
}
