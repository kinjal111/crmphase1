import {
  textPrimary,
} from '../../../config/colors';
import { StyleSheet } from 'react-native';
import { Row } from 'native-base';


export default StyleSheet.create({
  checkboxContainer: {
    width: '80%',
    flex : 1,
    flexWrap : 'wrap',
    flexDirection:'column',
    shadowColor: 'rgba(88, 176, 234, 0.44)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
 
  },
  otherRow: {
    flexDirection: 'row',
    alignItems: 'center',
   // borderWidth:1
  },
  switchRow: {
   alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    color: '#222222',
    fontFamily: "Helvetica Neue",
    fontWeight: '400',
    marginLeft: 20,
    marginRight: 20,

  },
});
