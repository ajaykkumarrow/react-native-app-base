import { StyleSheet, Dimensions } from 'react-native';
import fonts from '../../theme/fonts';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerView: {
    height: 40,
    backgroundColor: '#2d2a29',
    flexDirection: 'row'
  },
  backbuttonStyle: {
    backgroundColor: '#2d2a29',
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerInlineSeperator: {
    width: 1,
    height: 40,
    backgroundColor: 'grey'
  },
  backArrowImageStyle: {
    width: 15,
    height: 15,
    alignSelf: 'center'
  },
  headerTextStyle: {
    fontSize: 15,
    fontFamily: fonts.sourceSansProRegular,
    color: 'white',
    marginHorizontal: 20,
    alignSelf: 'center'
  },
  tabViewStyles: {
    height: 40,
    backgroundColor: '#282121',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabBtnStyle: {
    width: 100,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBtnTextStyle: {
    color: '#848588',
    alignSelf: 'center',
    fontFamily: fonts.sourceSansProRegular
  },
  DataContainer: {
    height: DEVICE_HEIGHT - 80,
    flexDirection: 'row'
  },
  splitViewStyle: {
    width: DEVICE_WIDTH / 2,
    height: DEVICE_HEIGHT - 150
  },
  dataView: {
    flex: 1,
    alignItems: 'flex-start',
    width: (DEVICE_WIDTH / 2) - 100,
    marginLeft: 70,
    marginTop: 30
  },
  bikeNameTextStyle: {
    fontFamily: fonts.sourceSansProSemiBold,
    fontSize: 20,
    color: '#4a4a4a'
  },
  descriptionTextStyle: {
    fontFamily: fonts.sourceSansProBold,
    fontSize: 42,
    color: '#4a4a4a'
  },
  detailDescriptionTextStyle: {
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 12,
    color: '#7f7f7f'
  },
  detailView: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (DEVICE_WIDTH / 3)
  },
  imageBottomView: {
    flex: 4,
  },
  colorFlatListStyle: {
    width: (DEVICE_WIDTH / 2) - 40,
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
  mainBikeImageStyle: {
    position: 'absolute',
    width: (DEVICE_WIDTH / 2) - 40,
    height: (DEVICE_HEIGHT / 2) - 20,
    top: 20,
    left: 40,
    zIndex: 999
  },
  downArrowStyle: {
    width: 70,
    height: 70,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  tabSelectedStyle: {
    borderBottomColor: '#F17C3A',
    borderBottomWidth: 2,
    marginHorizontal: 20
  },
  tabTextStyle: {
    color: '#aaaeb3',
    fontSize: 15,
    fontFamily: fonts.sourceSansProRegular
  },
  tabSelectedTextStyle: {
    color: '#F17C3A',
    fontSize: 16,
    fontFamily: fonts.sourceSansProSemiBold
  },
  tabStyle: {
    marginHorizontal: 20,
  },
  tabviewStyle: {
    flexDirection: 'row',
    marginLeft: 50,
    width: DEVICE_WIDTH / 2
  },
  unitsTextStyle: {
    color: '#34323b',
    fontFamily: fonts.sourceSansProRegular,
    fontSize: 16
  },
  specsListView: {
    flexDirection: 'column'
  },
  specTabviewStyle: {
    marginTop: 20,
    marginRight: 20
  },
  specTabSelectedStyle: {
    justifyContent: 'space-between',
    marginVertical: 20
  },
  specTabTextStyle: {
    color: '#a4a4a4',
    fontSize: 16,
    fontFamily: fonts.sourceSansProRegular,
    alignSelf: 'flex-end',
  },
  specTabSelectedTextStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: fonts.sourceSansProBold,
    alignSelf: 'flex-end',
    borderBottomColor: '#F17C3A',
    borderBottomWidth: 2,
  },
  SpecTabStyle: {
    justifyContent: 'space-between',
    marginVertical: 20
  },
  scrollViewStyle: {
    flex: 1,
    marginHorizontal: 30
  },
  specTitleTextStyle: {
    color: '#6a6a6a',
    alignItems: 'center',
    fontSize: 14,
    fontFamily: fonts.sourceSansProRegular
  },
  specTitleDesTextStyle: {
    color: '#171717',
    alignItems: 'center',
    fontSize: 15,
    fontFamily: fonts.sourceSansProBold
  },
  specLeftUpperView: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  specVehicleDetailView: {
    flex: 2,
    marginHorizontal: 30
  },
  specVehicleView: {
    position: 'absolute',
    left: 0,
    top: 40,
    height: DEVICE_HEIGHT / 2,
    width: DEVICE_WIDTH / 3
  },
  specBottomTitleStyle: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: fonts.sourceSansProSemiBold
  },
  specBottomDesStyle: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: fonts.sourceSansProRegular
  },
  dotterView: {
    width: 20,
    height: 20,
    backgroundColor: '#f26b34',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#863a25',
    marginRight: 10
  },
  featureRightContentView: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  featuresTitleTextStyle: {
    color: '#4a4a4a',
    fontSize: 18,
    fontFamily: fonts.sourceSansProBold,
    margin: 10,
    borderBottomWidth: 2,
    borderColor: '#f16537',
    paddingBottom: 10,
  },
  featuresDesTextStyle: {
    color: '#8b8b8b',
    fontSize: 14,
    fontFamily: fonts.sourceSansProRegular,
    margin: 20
  },
  fetureRightDataView: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureRightSliderView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureRightDataBtnView: {
    flexDirection: 'row'
  },
  backButtonStyle: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent'
  },
  nextBtnStyle: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  backButtonTextStyle: {
    width: 40,
    color: '#f16537',
  },
  nextButtonTextStyle: {
    width: 40,
    color: '#f16537',
  },
  featureImageView: {
    flex: 1,
    margin: 60
  },
  sliderViewStyle: {
    width: 20,
    flex: 1,
    marginBottom: 20,
    marginTop: 5,
  },
  slidertextStyle: {
    marginTop: 10,
    color: '#868686'
  },
  image360View: {
    flex: 1,
  },
  image360Style: {
    position: 'absolute',
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT - 200,
    top: 10,
    left: 0,
  },
  image360LeftArrowIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    left: 100,
    top: (DEVICE_HEIGHT / 2) - 100,
    zIndex: 999
  },
  image360RightArrowIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 100,
    top: (DEVICE_HEIGHT / 2) - 100,
    zIndex: 999
  },
  breakDownPageImagePosition: {
    position: 'absolute',
    width: (DEVICE_WIDTH / 2) - 40,
    height: (DEVICE_HEIGHT / 2) - 20,
    bottom: 100,
    left: 40,
    zIndex: 999
  },
  showBreakDownButton: {
    width: 200,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#383131',
    margin: 20
  },
  showBreakDownTextStyle: {
    color: '#f16537',
  },
  breakdownLeftContentView: {
    height: 100
  },
  scheduleTestRideBtnStyle: {
    height: 40,
    backgroundColor: '#f37730',
    flex: 1,
    marginRight: 10,
    marginBottom: 20
  },
  financeBtnStyle: {
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#f8d9d9',
    marginLeft: 10,
    flex: 1
  },
  scheduleTestRideBtnTextStyle: {
    color: 'white'
  },
  financeBtnTextStyle: {
    color: '#f58b59'
  },
});
export default styles;
