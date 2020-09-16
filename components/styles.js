import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const textInput = StyleSheet.create({

  auth_textInput: {

    width: '100%',
    height: 46,
    borderRadius: 46/2,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,

  },

  gray_textInput: {
// borderWidth:3,borderColor:'red',
    width: '100%',
    height: 46,
    borderRadius: 46/2,
    color: Colors.black_color,
    paddingStart: 20,
    marginTop: 10,
    backgroundColor: Colors.white_shade,
    fontFamily: 'Helvetica-Light',
    fontSize: 16,
    
  }
});

const buttonStyle = StyleSheet.create({

  auth_btn: {

    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.pink_color,
    borderRadius: 46/2,
    width: '100%',
    height: 46,
    justifyContent: 'center',

  },
  loginText: {

    color: Colors.white_color,
    textAlign: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 18
  
  },

  login_btn: {

    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.shades_blue,
    borderRadius: 46/2,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  
  },

  btnText: {

    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14
 
  },

  primaryBtn: {

    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.primaryColor,
    borderRadius: 46/2,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  
  },

  lightGrayBtn: {

    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.light_gray,
    borderRadius: 46/2,
    width: '100%',
    height: 46,
    justifyContent: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    color: Colors.dark_gray
  
  },

  spinnerTextStyle: {

    color: '#fff',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,
  
  },

});

const textHeader = StyleSheet.create({

  header: {

    flex:1,
    color: '#fff',
    marginTop:8,
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    // borderWidth:2,
  
  },

  header_style: {
  
    height: 70
  
  }
});


const text_color = StyleSheet.create({
  white_color: {
    color: '#fff'
  },
  gray_color: {
    color: Colors.light_gray
  },
  black_color: {
    color: '#000'
  }
});

const font_style = StyleSheet.create({
  font_heavy: {
    fontFamily: 'HelveticaNeue-CondensedBlack'
  },
  font_ultra_light: {
    fontFamily: 'HelveticaNeue-UltraLight'
  },
  font_bold: {
    fontFamily: 'HelveticaNeue-Bold'
  },
  font_medium: {
    fontFamily: 'HelveticaNeue-Medium'
  },
  font_light: {
    fontFamily: 'Helvetica-Light'
  }
});

export { textInput, buttonStyle, text_color, font_style, textHeader }


