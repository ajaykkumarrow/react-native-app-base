import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../../theme/fonts';
import variables from '../../theme/variables';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListViewStyles: {
    marginTop: 15,
    height: DEVICE_HEIGHT - 215,
    width: DEVICE_WIDTH - 325
  },
  cardViewStyle: {
    flex: 1,
    width: DEVICE_WIDTH - 365,
    elevation: 5,
    backgroundColor: '#ffffff',
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 20,
  },
  vehicleCard: {
    flex: 1,
    elevation: 5,
    marginHorizontal: 5,
  },
  vehicleName: {
    color: variables.headerBackgroundColor,
    fontSize: 14,
    marginLeft: 10,
    fontFamily: fonts.sourceSansProBoldItalic
  },
  fieldTitle: {
    marginTop: 10,
    marginLeft: 10,
    color: variables.dustyOrange,
    alignItems: 'center',
    fontSize: 15,
    fontFamily: fonts.sourceSansProSemiBold
  },
  pickerViewStyles: {
    height: 30,
    borderColor: variables.lightGrey,
    borderBottomWidth: 1,
    marginTop: 10,
    marginRight: 10,
    justifyContent: 'center'
  },
  pickerStyle: {
    color: variables.primaryTextColor,
    marginHorizontal: 2
  },
  continueBtnStyle: {
    marginHorizontal: 10
  },
  PickerStyle: {
    height: 30,
    width: DEVICE_WIDTH / 3,
    color: 'black',
    backgroundColor: 'red',
    borderColor: 'red',
  },
  colorFlatListStyle: {
    width: (DEVICE_WIDTH / 3) - 40,
    marginLeft: 20,
    marginTop: 5,
  },
  colorCellStyle: {
    height: 30,
    width: 30,
    marginRight: 20,
    borderColor: 'gray',
    borderWidth: 2
  },
  bookNowTestRideBtnStyle: {
    height: 30,
    backgroundColor: '#f37730',
    width: (DEVICE_WIDTH / 6) - 40,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 10
  },
  bookNowTestRideBtnTextStyle: {
    color: 'white',
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 14
  },
  fianceOptionBtnStyle: {
    height: 40,
    backgroundColor: '#ffffff',
    width: (DEVICE_WIDTH / 3) - 70,
    marginRight: 10,
    marginBottom: 10,
    borderColor: '#f37730',
    borderWidth: 1
  },
  financeOptionBtnTextStyle: {
    color: '#f37730',
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 14
  },
  addButtonStyle: {
    backgroundColor: '#f37730',
    width: 60,
    height: 40
  },
  addButtonTextStyle: {
    fontFamily: fonts.sourceSansProBold,
    fontSize: 15
  },
  saveBtnStyle: {
    height: 40,
    width: 75,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 10,
    zIndex: 99
  },
  addBtnStyle: {
    height: 30,
    width: 75,
    marginRight: 10,
    zIndex: 99
  },
  addBtnTextStyle: {
    color: variables.dustyOrange,
    fontSize: 14,
    paddingTop: 6,
    paddingRight: 10
  }
});

export default styles;
