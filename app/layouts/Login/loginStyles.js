import { StyleSheet } from 'react-native';
import Dimensions from 'Dimensions';

import variables from '../../theme/variables';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: variables.primaryBackgroundColor,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  body: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 20,
    marginRight: 50,
    height: Dimensions.get('screen').height - 80,
  },
  bodyResetPassword: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 20,
    marginRight: 50,
    height: Dimensions.get('screen').height - 80
  },
  form: {
    paddingVertical: 20,
    flexDirection: 'column',
    elevation: 15,
    shadowColor: variables.primaryIosShadowColor,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    alignSelf: 'flex-end',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: '#fff',
    paddingLeft: 35,
    paddingRight: 15,
  },
  formResetPassword: {
    paddingVertical: 10,
    flexDirection: 'column',
    elevation: 15,
    shadowColor: variables.primaryIosShadowColor,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 35,
    paddingRight: 15,
    height: Dimensions.get('screen').height - 160
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 0,
    marginTop: 10,
  },
  footerText: {
    paddingTop: 10,
    paddingRight: 10,
    color: '#989898',
    fontSize: 10
  },
  userInputContainer: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: DEVICE_WIDTH / 3
  },
  textInputStyle: {
    width: DEVICE_WIDTH / 3
  }
});

export default styles;
