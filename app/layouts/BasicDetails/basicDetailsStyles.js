import { StyleSheet, Dimensions } from 'react-native';
import variables from '../../theme/variables';
import fonts from '../../theme/fonts';

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  nameContainer: {
    flex: 1,
    left: 175,
    width: DEVICE_WIDTH / 2,
    justifyContent: 'center',
  },
  gender: {
    flex: 1,
    left: 175,
    width: DEVICE_WIDTH / 2,
    // paddingBottom: 20
  },
  fieldTitle: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: variables.titleColor,
    fontFamily: fonts.sourceSansProRegular,
    marginLeft: 10
  },
  fieldValue: {
    fontSize: 15,
    fontFamily: fonts.sourceSansProSemiBold,
    color: variables.primaryTextColor,
  },
  fieldContainer: {
    width: DEVICE_WIDTH / 2,
    marginTop: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: variables.textInputBorderColor,
    borderRadius: 2,
  },
  mandatoryField: {
    color: 'red',
    lineHeight: 18,
    marginLeft: 2
  },
  selectedCard: {
    borderColor: variables.mango,
    borderWidth: 2,
    borderRadius: 2,
  },
  genderCard: {
    marginHorizontal: 10,
    flexDirection: 'column',
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2
  },
  cardText: {
    fontSize: 14,
    fontFamily: fonts.sourceSansProRegular
  },
  continueBtnContainer: {
    flex: 0.5,
    height: 70,
    marginRight: 70,
  },
  errorTextStyle: {
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 10,
    height: 14,
    fontFamily: fonts.sourceSansProRegular
  }
});

export default styles;
