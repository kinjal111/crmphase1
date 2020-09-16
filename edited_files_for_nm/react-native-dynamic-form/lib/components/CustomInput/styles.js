import { StyleSheet, Platform } from 'react-native';

import {
  error as errorColor,
  textPrimary,
  textInputBorderColor,
} from '../../../config/colors';

export default (
  fontSize,
  error,
  icon,
  disabled,
  showBorder,
  multiline,
) => (
  StyleSheet.create({
    container: {
      borderBottomWidth: showBorder ? 0 : 0,
      borderBottomColor: textInputBorderColor,
      opacity: disabled ? 0.7 : 1,
    },
    inputStyle: {
      minHeight : 46,
      height: multiline ? 100 : 50,
      borderWidth: 0,
      textAlignVertical: 'center',
      fontSize,
      color: error ? errorColor : textPrimary,
      paddingRight: icon ? 25 : 0,
      marginTop: (Platform.OS === 'ios' && multiline) ? 15 : 15,
    },
    iconStyle: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
  })
);
