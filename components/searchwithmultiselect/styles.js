/*!
 * react-native-multi-select
 * Copyright(c) 2017 Mustapha Babatunde Oluwaleke
 * MIT Licensed
 */

export const colorPack = {
  primary: '#00A5FF',
  primaryDark: '#215191',
  light: '#FFF',
  textPrimary: '#525966',
  placeholderTextColor: '#A9A9A9',
  danger: '#C62828',
  borderColor: '#e9e9e9',
  backgroundColor: '#b1b1b1',
};

export default {
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  footerWrapperNC: {
    width: 320,
    flexDirection: 'column',
  },
  subSection: {
    backgroundColor: '#eaf0f3',
    borderColor: colorPack.borderColor,
    paddingRight: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    //@ltpl changes

    paddingLeft: 16,
    borderBottomWidth: 0,
    borderRadius: 20
  },
  greyButton: {
    minHeight: 46,
    borderRadius: 5,
    elevation: 0,
    backgroundColor: '#222222',
  },
  indicator: {
    fontSize: 25,
    color: '#222222',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    //borderWidth: 2,
  },
  button: {
    minHeight: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#222222',
    fontSize: 14,
  },
  selectorView: (fixedHeight) => {
    const style = {
      flexDirection: 'column',
      marginBottom: 10,
      elevation: 2,
    };
    if (fixedHeight) {
      style.height = 250;
    }
    return style;
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    minHeight:46,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#eaf0f3',
    borderRadius: 23,
  },
  dropdownView: {
    alignItems: 'flex-start',
    minHeight: 46,
    marginBottom: 10,
    borderRadius: 23,
    backgroundColor: '#eaf0f3',
  },
};
