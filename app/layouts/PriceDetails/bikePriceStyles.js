import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../../theme/fonts';
import colors from '../../theme/variables';

const { width, height } = Dimensions.get('screen');
const modalHeight = height;
const modalWidth = width;

const bikePriceStyles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 72
  },
  header: {
    backgroundColor: colors.headerBackgroundColor,
    flexDirection: 'row',
    height: 50
  },
  loanSplitView: {
    elevation: 4,
    marginTop: 20,
    marginHorizontal: 6,
    marginBottom: 6,
    backgroundColor: 'white'
  },
  loanSplitLabelView: {
    flexDirection: 'row',
    backgroundColor: '#e9e9e9',
  },
  loanSplitLabel: {
    color: '#5f5f5f',
    fontSize: 12,
    fontFamily: fonts.sourceSansProSemiBold,
    flex: 1,
    paddingVertical: 12,
    textAlign: 'center'
  },
  loanSplitValueView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  loanSplitValue: {
    flex: 1,
    color: '#959595',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10
  },
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 72,
    marginVertical: 20,
  },
  bikeContainer: {
    flex: 2,
    backgroundColor: 'white',
    elevation: 4,
    justifyContent: 'space-between'
  },
  bikeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginVertical: 22
  },
  bikeSpecsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bikeSpecsBoldText: {
    fontFamily: fonts.sourceSansProBold,
    fontSize: 14,
    color: colors.blackColor
  },
  bikeSpecLightText: {
    color: colors.warmGrey,
    fontSize: 10,
    marginLeft: 2,
    fontFamily: fonts.sourceSansProRegular
  },
  specLabelText: {
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 14,
    color: colors.blackBikeSpec
  },
  bikeNameText: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 12,
    color: colors.greyishBrown
  },
  bikeModelText: {
    fontFamily: fonts.sourceSansProBold,
    fontSize: 18,
    color: colors.greyishBrown
  },
  bikePriceLabel: {
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 12,
    color: colors.warmGrey
  },
  bikePrice: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 18,
    color: colors.charcoalGrey
  },
  breakdownContainer: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 4,
    marginLeft: 10,
  },
  priceBreakdownText: {
    fontSize: 12,
    fontFamily: fonts.sourceSansProSemiBold,
    color: colors.greyishBrown,
    marginLeft: 12,
    paddingVertical: 12
  },
  nameText: {
    fontSize: 12,
    fontFamily: fonts.sourceSansProRegular,
    color: 'white'
  },
  line: {
    height: 1,
    backgroundColor: '#E2E2E2'
  },
  breakdownLabelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  priceText: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 12,
    color: colors.greyishBrown,
  },
  onRoadPrice: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 14,
    color: colors.offerBlack,
  },
  onRoadPriceLabel: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 12,
    color: colors.offerBlack,
  },
  financeText: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 14,
    color: '#464646',
    marginTop: 12
  },
  modalContentWrapper: {
    backgroundColor: 'black',
    position: 'absolute',
    width: modalWidth,
    height: modalHeight,
    opacity: 0.8
  },
  modalContent: {
    backgroundColor: 'white',
    width: modalWidth / 2.75,
    marginTop: 40,
    height: modalHeight / 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  accessoryModalContent: {
    backgroundColor: 'white',
    width: modalWidth / 2.75,
    marginTop: 40,
    justifyContent: 'space-between',
    height: modalHeight / 2,
    alignSelf: 'center',
  },
  offerView: {
    marginTop: 10
  },
  onRoadView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  offerAppliedView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 14,
  },
  offerBackground: {
    backgroundColor: '#6aec5130',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  offerTextStyle: {
    fontSize: 10,
    color: colors.frogGreen,
    textAlign: 'center',
    marginLeft: 2,
    fontFamily: fonts.sourceSansProRegular
  },
  deleteView: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center'
  },
  offerSavingText: {
    fontSize: 10,
    color: '#B0B0B0',
    marginHorizontal: 14,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: fonts.sourceSansProRegular
  },
  savingPercentageBold: {
    fontSize: 8,
    fontFamily: fonts.sourceSansProBold
  },
  modalCloseView: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#f79426',
    padding: 2
  },

  offerInputStyle: {
    width: 200,
    borderColor: '#FDD2B8',
    borderWidth: 1,
    alignSelf: 'center',
  },
  offerAppliedText: {
    fontSize: 10,
    fontFamily: fonts.sourceSansProRegular,
    color: colors.offerBlack,
    marginLeft: 2
  },
  headerBack: {
    flex: 0.5,
    backgroundColor: '#4C4949',
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerNameView: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  headerNameStyle: {
    color: '#F5F5F4',
    fontSize: 12
  },
  headerBikeValueStyle: {
    flex: 1,
    borderLeftColor: fonts.headerLine,
    borderLeftWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerBikeValueTextStyle: {
    color: colors.warmGrey,
    fontSize: 12,
    fontFamily: fonts.sourceSansProSemiBold,
  },
  bookTestRideView: {
    flex: 1,
    backgroundColor: '#494847',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookTestRideText: {
    color: colors.warmGrey,
    fontSize: 12,
    fontFamily: fonts.sourceSansProRegular
  },
  saveView: {
    flex: 0.5,
    backgroundColor: '#f79426',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  bikePriceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    alignItems: 'center',
    marginBottom: 30
  },
  availableColorView: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  amountPayableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    paddingVertical: 10
  },
  helpFinanceText: {
    color: colors.warmGrey,
    fontSize: 10
  },
  applyButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10
  },
  accessoriesView: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flex: 1
  },
  accessoryTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  accessoryText: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 12,
    color: colors.offerBlack
  },
  availableColorText: {
    color: colors.greyishBrown,
    fontSize: 12,
    fontFamily: fonts.sourceSansProSemiBold
  },
  colorView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorNormalView: {
    width: 20,
    height: 20,
    borderColor: 'grey',
    borderWidth: 2,
  },
  colorSelectedView: {
    width: 20,
    height: 20,
    borderColor: 'orange',
    borderWidth: 2,
  },
  onRoadPriceView: {
    flex: 1,
    marginLeft: 20
  },
  accessoryNameText: {
    flex: 1.5,
    fontSize: 12,
    color: colors.warmGrey,
    fontFamily: fonts.sourceSansProRegular
  },
  accessoryPriceText: {
    flex: 1,
    fontSize: 12,
    color: colors.warmGrey,
    fontFamily: fonts.sourceSansProRegular
  },
  accessoryRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    alignItems: 'center'
  },
  checkBoxView: {
    flex: 0.3,
    alignItems: 'center'
  },
  bikeSpecValueView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bikeImageStyle: {
    alignSelf: 'center',
    width: 500,
    height: 250
  },
  variantDropdownView: {
    borderColor: 'grey',
    borderWidth: 1,
    flex: 1
  }
});

export default bikePriceStyles;
