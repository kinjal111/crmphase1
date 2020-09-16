import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.multiDot';

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      marginTop: Platform.OS === 'android' ? 4 : 7,
      alignItems: 'center',
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 7,
      marginLeft:1,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    alignedText: {
       marginTop: Platform.OS === 'android' ? 4 : 7
    },
    selected: {
      backgroundColor: '#2de2b7',
      borderRadius: 16,

    },
    today: {
      backgroundColor: '#5cb5ed',
      borderRadius: 16,
     
    },
    todayText: {
      color: 'white'
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    dot: {
      width: 4.5,
      height: 4.5,
      marginLeft: 1,
      marginRight: 1,
      borderRadius: 3,
      opacity: 1
    },
    visibleDot: {
      opacity: 1,
      marginTop: 3,

      backgroundColor: appStyle.dotColor
    },
    selectedDot: {

      backgroundColor: appStyle.selectedDotColor
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
