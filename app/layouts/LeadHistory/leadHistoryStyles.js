import { StyleSheet, Dimensions } from 'react-native';
import variables from '../../theme/variables';
import fonts from '../../theme/fonts';

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  panelContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  pageTitle: {
    color: variables.charcoalGrey,
    fontSize: 18,
    fontFamily: fonts.sourceSansProSemiBold,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  fieldTitle: {
    color: variables.lightGrey,
    alignItems: 'center',
    fontSize: 15,
    fontFamily: fonts.sourceSansProSemiBold
  },
  fieldValue: {
    height: 40,
    fontSize: 14,
    fontFamily: fonts.sourceSansProRegular,
    color: variables.charcoalGrey,
  },
  fieldContainer: {
    width: DEVICE_WIDTH / 5,
  },
  pickerStyle: {
    color: variables.charcoalGrey,
    marginHorizontal: 2
  },
  gender: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 10
  },
  pickerViewStyles: {
    height: 30,
    borderColor: variables.lightGrey,
    borderBottomWidth: 1,
    marginTop: 10,
    justifyContent: 'center'
  },
  PickerStyle: {
    height: 30,
    width: DEVICE_WIDTH / 3,
    color: 'black',
    backgroundColor: 'red',
    borderColor: 'red',
  },
  saveBtnStyle: {
    width: 75,
    height: 35,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff'
  },
  saveBtnTextStyle: {
    color: 'white',
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 14
  },
  selectedCard: {
    borderColor: variables.mango,
    borderWidth: 2
  },
  genderCard: {
    marginRight: 10,
    flexDirection: 'column',
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 2
  },
  cardText: {
    fontSize: 10,
    fontFamily: fonts.sourceSansProRegular
  },
  errorTextStyle: {
    color: 'red',
    fontSize: 11,
    fontFamily: fonts.sourceSansProRegular
  }
});

export default styles;
