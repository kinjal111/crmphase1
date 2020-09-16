import { primary, white } from '../../../config/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    elevation: 0,
    backgroundColor: primary,
    borderRadius: 3,
  },
  buttonLabel: {
    flex: 1,
    color: white,
    fontSize: 14,
    textAlign: 'center',
  },
});
