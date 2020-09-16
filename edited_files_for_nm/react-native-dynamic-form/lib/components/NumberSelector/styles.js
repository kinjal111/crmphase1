import {
  textPrimary,
  placeholderTextColor,
} from '../../../config/colors';
import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf0f3',
    borderColor: placeholderTextColor,
    borderRadius: 23,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 16,
    textAlign: 'left',
    color: '#222222',
    marginRight: 10,
    opacity: 1,
  },
  controllersContainer: {
    padding: 5,
  },
});
