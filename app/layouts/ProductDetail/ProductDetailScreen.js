import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView,
  Dimensions,
  PanResponder,
  Picker,
} from 'react-native';

// Reducer
import { connect } from 'react-redux';

// Style
import styles from '../ProductDetail/productDetailStyles';

// Action Methods
import {
  getProductDetails,
  get360ImageDetails,
  getLeadInfo,
  updateLeadInfo,
  createLeadDetailsObject,
  updateLeadDetailsObject } from '../../redux/actions/ProductDetail/actionCreators';

// Components
import Loader from '../../components/loader/Loader';
import {
  GradientButtonLarge,
  ButtonWithLeftImage,
  ButtonWithRightImage,
  ButtonWithPlainText } from '../../components/button/Button';

// Storage
import storage from '../../helpers/AsyncStorage';

// Images
import backButton from '../../assets/images/backArrow.png';
import nextButton from '../../assets/images/nextArrow.png';
import GreenTickIcon from '../../assets/images/ic_greentick.png';
import LeftArrowOrange from '../../assets/images/ic_primary_lefticon.png';
import RightArrowOrange from '../../assets/images/ic_primary_righticon.png';
import backArrow from '../../assets/images/white_back.png';
import downArrowOrange from '../../assets/images/ic_primary_scrollbutton.png';

const DEVICE_WIDTH = Dimensions.get('screen').width;
let pointsArr = [];

  @connect(
    state => ({
      productDetail: state.ProductDetail.productDetail,
      images360Array: state.ProductDetail.images360Array,
      leadObj: state.ProductDetail.leadObj,
      leadDetailObj: state.ProductDetail.leadDetailObj,
      loading: state.ProductDetail.loading,
    }),
    {
      getProductDetails,
      get360ImageDetails,
      getLeadInfo,
      updateLeadInfo,
      createLeadDetailsObject,
      updateLeadDetailsObject
    }
  )

class ProductDetailScreen extends Component {
  static propTypes = {
    getProductDetails: PropTypes.func.isRequired,
    get360ImageDetails: PropTypes.func.isRequired,
    createLeadDetailsObject: PropTypes.func.isRequired,
    updateLeadDetailsObject: PropTypes.func.isRequired,
    getLeadInfo: PropTypes.func.isRequired,
    updateLeadInfo: PropTypes.func.isRequired,
    productDetail: PropTypes.object,
    leadDetailObj: PropTypes.object,
    images360Array: PropTypes.array,
    leadObj: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  }
  static defaultProps = {
    productDetail: {},
    images360Array: [],
    leadObj: {},
    leadDetailObj: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      currentDealerId: '',
      currentProductDetails: {},
      currentVariantArray: [],
      currentVariantDetails: {},
      currentVehicleColorObject: {},
      currentVehicleFeatureArray: [],
      currentFeature: {},
      currentFeatureIndex: 0,
      current360ImagesArray: [],
      currentLeadObject: {},
      value: 1,
      tabLayoutData: [
        {
          id: '1',
          name: 'Overview',
        },
        {
          id: '2',
          name: '360',
        },
        {
          id: '3',
          name: 'Features',
        },
        {
          id: '4',
          name: 'Specs',
        },
      ],
      tabPosition: '1',
      specTabLayoutData: [
        {
          id: '1',
          name: 'Engine & Transmission',
        },
        {
          id: '2',
          name: 'Brakes, Wheels & Suspension',
        },
        {
          id: '3',
          name: 'Dimensions & Chassis',
        },
        {
          id: '4',
          name: 'Fuel Efficiency & Performance',
        },
      ],
      specTabPosition: '1',
      selectedType: 'Overview',
      selectedSpecTabType: 'Engine & Transmission'
    };
  }
  componentDidMount() {
    storage.getItem('currentUser')
      .then(recievedToken => {
        this.setState({
          currentDealerId: recievedToken.dealerId,
        }, () => {
          this.onInitialLoad();
        });
      });
  }

  onInitialLoad() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this.props.getProductDetails(this.props.navigation.state.params.vehicleId).then(() => {
      this.setState({
        currentProductDetails: this.props.productDetail,
        currentVariantArray: (this.props.productDetail &&
          Object.keys(this.props.productDetail).length !== 0 &&
          ('variants' in this.props.productDetail) &&
          this.props.productDetail.variants.length !== 0) ?
          this.props.productDetail.variants : [],
        currentVariantDetails: (this.props.productDetail &&
          Object.keys(this.props.productDetail).length !== 0 &&
          ('variants' in this.props.productDetail) &&
          this.props.productDetail.variants.length !== 0) ?
          this.props.productDetail.variants[0] : {},
        currentVehicleFeatureArray: (this.props.productDetail &&
            Object.keys(this.props.productDetail).length !== 0 &&
            ('features' in this.props.productDetail) &&
            this.props.productDetail.features.length !== 0) ?
          this.props.productDetail.features : [],
        currentFeature: (this.props.productDetail &&
            Object.keys(this.props.productDetail).length !== 0 &&
            ('features' in this.props.productDetail) &&
            this.props.productDetail.features.length !== 0) ?
          this.props.productDetail.features[0] : {},
        currentVehicleColorObject: (
          this.props.productDetail &&
          Object.keys(this.props.productDetail).length !== 0 &&
          ('variants' in this.props.productDetail) &&
          this.props.productDetail.variants.length !== 0 &&
          this.props.productDetail.variants[0] &&
           Object.keys(this.props.productDetail.variants[0]).length !== 0 &&
           ('colors' in this.props.productDetail.variants[0]) &&
           this.props.productDetail.variants[0].colors.length !== 0) ?
          this.props.productDetail.variants[0].colors[0] : {},
      });
    }).catch(err => { console.log(err); });
    this.props.get360ImageDetails(this.props.navigation.state.params.vehicleId).then(() => {
      this.props.images360Array.map(currentImageObj => (
        <Image
          source={{ uri: currentImageObj.image_url }}
          key={currentImageObj.id}
        />
      ));
      this.setState({
        current360ImagesArray: this.props.images360Array
      });
    });
    this.props.getLeadInfo(this.props.navigation.state.params.id).then(() => {
      this.setState({
        currentLeadObject: this.props.leadObj
      });
    });
  }

  onTabPress = tabInfo => {
    this.setState({
      tabPosition: tabInfo.id,
      selectedType: tabInfo.name
    });
  }
  onSpecTabPress = specTabInfo => {
    this.setState({
      specTabPosition: specTabInfo.id,
      selectedSpecTabType: specTabInfo.name
    });
  }
  onPickerChange=curVariant => {
    this.setState({
      currentVariantDetails: curVariant,
      currentVehicleColorObject: (
        curVariant &&
         Object.keys(curVariant).length !== 0 &&
         ('colors' in curVariant) &&
         curVariant.colors.length !== 0) ?
        curVariant.colors[0] : {},
    });
  }
  getTabData = () => (
    <View style={styles.tabviewStyle}>
      {
        this.state.tabLayoutData.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={this.changeTabColor(tab.id)}
            onPress={() => this.onTabPress(tab)}
          >
            <Text style={this.changeTextColor(tab.id)}>{tab.name}
              {
               tab.name === '360' ?
                 <Text>&deg;</Text> : ''
                 }
            </Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
  getSpecTabData = () => (
    <View style={styles.specTabviewStyle}>
      {
        this.state.specTabLayoutData.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={this.changeSpecTabColor(tab.id)}
            onPress={() => this.onSpecTabPress(tab)}
          >
            <Text style={this.changeSpecTextColor(tab.id)}>{tab.name}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
  getCurrentView=() => {
    const BoldText = props =>
      <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#34323b' }}>{props.children}</Text>;
    const { currentProductDetails, currentVariantDetails, currentVehicleColorObject } = this.state;
    switch (this.state.selectedType) {
      case 'Overview': {
        return (
          <View style={styles.DataContainer}>
            <Image
              style={styles.mainBikeImageStyle}
              resizeMode="contain"
              source={{
                uri: (currentVehicleColorObject &&
              Object.keys(currentVehicleColorObject).length !== 0 &&
              ('image_url' in currentVehicleColorObject) &&
              currentVehicleColorObject.image_url !== null) ? currentVehicleColorObject.image_url : 'http://'
              }}
            />
            <View style={[styles.splitViewStyle, { backgroundColor: '#272121' }]} >
              <View style={{ flex: 8 }} />
              <View style={styles.imageBottomView}>
                <FlatList
                  style={[styles.colorFlatListStyle, { height: 20 }]}
                  horizontal
                  keyExtractor={this._KeyExtractor}
                  data={
                  (currentVariantDetails &&
                    ('colors' in currentVariantDetails) &&
                  Object.keys(currentVariantDetails.colors).length !== 0) ? currentVariantDetails.colors : []
                }
                  renderItem={this._renderItem}
                  extraData={this.state}
                />
                <View style={{
                  flexDirection: 'row', height: 40, alignItems: 'center', marginLeft: 20, marginBottom: 10
                }}
                >
                  <View style={{
                    flexDirection: 'row',
                    width: 200,
                    borderColor: '#EF7432',
                    borderWidth: 1,
                    height: 40,
                    marginRight: 10,
                    marginVertical: 20,
                    backgroundColor: 'white'
                  }}
                >
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        marginLeft: 5,
                        alignSelf: 'center'
                      }}
                      source={GreenTickIcon}
                  />
                    <View style={{
                      flex: 6,
                    }}
                  >
                      <Picker
                        style={{ height: 35 }}
                        selectedValue={this.state.currentVariantDetails.name}
                        mode="dropdown"
                        onValueChange={(itemValue, itemIndex) =>
                          this.onPickerChange(this.state.currentVariantArray[itemIndex])}
                    >
                        {
                      this.state.currentVariantArray && this.state.currentVariantArray.map(currentVarient => (
                        <Picker.Item label={currentVarient.name} value={currentVarient.name} key={currentVarient.id} />
                      ))
                    }
                      </Picker>
                    </View>
                  </View>
                  <Text
                    style={[styles.detailDescriptionTextStyle, { color: 'white', marginHorizontal: 10 }]}
                  >
            On Road Price
                  </Text>
                  <Text
                    style={[styles.bikeNameTextStyle, { color: 'white' }]}
                  >
                  RS.
                    {
                    (currentVariantDetails &&
                  ('prices' in currentVariantDetails) &&
                  Object.keys(currentVariantDetails.prices).length !== 0 &&
                  ('onroad_price' in currentVariantDetails.prices) &&
                  currentVariantDetails.prices.onroad_price !== null) ?
                      (currentVariantDetails.prices.onroad_price).split('.')[0] :
                      '0'
                  }/-
                  </Text>
                </View>
                <GradientButtonLarge
                  style={{ marginLeft: 20, marginBottom: 10, marginTop: 0 }}
                  title="Show Price Breakdown"
                  handleSubmit={() => this._onShowPriceBreakDownBtnClicked()}
                />
              </View>
            </View>
            <View style={[styles.splitViewStyle, { alignItems: 'flex-start' }]}>
              <View style={styles.dataView}>
                <Text
                  style={styles.bikeNameTextStyle}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {(currentProductDetails &&
                    Object.keys(currentProductDetails).length !== 0 &&
                    ('manufacturer' in currentProductDetails) &&
                    Object.keys(currentProductDetails.manufacturer).length !== 0 &&
                    ('display_name' in currentProductDetails.manufacturer)) ?
                    (currentProductDetails.manufacturer.display_name).toUpperCase() : ''}
                </Text>
                <Text
                  style={styles.descriptionTextStyle}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {Object.keys(currentProductDetails).length !== 0 &&
                   ('name' in currentProductDetails) &&
                    currentProductDetails.name !== null ?
                    currentProductDetails.name.toUpperCase() : '' }
                </Text>
                <View style={styles.detailView} >
                  <View style={{
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center'
                  }}
                  >
                    <Text style={styles.unitsTextStyle}>
                      <BoldText>{(currentProductDetails &&
                  Object.keys(currentProductDetails).length !== 0 &&
                  ('displacement' in currentProductDetails) &&
                  currentProductDetails.displacement !== null) ? (currentProductDetails.displacement).split(' ')[0]
                        : '0'
                    }
                      </BoldText> cc
                    </Text>
                    <Text style={styles.detailDescriptionTextStyle}>
                      Engine
                    </Text>
                  </View>
                  <View style={{
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center'
                  }}
                  >
                    <Text style={styles.unitsTextStyle}>
                      <BoldText>{(currentProductDetails &&
                  Object.keys(currentProductDetails).length !== 0 &&
                  ('fuel_efficiency_overall' in currentProductDetails) &&
                  currentProductDetails.fuel_efficiency_overall !== null) ?
                        (currentProductDetails.fuel_efficiency_overall).split(' ')[0]
                        : '0'
                    }
                      </BoldText> kmpl
                    </Text>
                    <Text style={styles.detailDescriptionTextStyle}>
                      Mileage
                    </Text>
                  </View>
                  <View style={{
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center'
                  }}
                  >
                    <Text style={styles.unitsTextStyle}>
                      <BoldText>{(currentProductDetails &&
                  Object.keys(currentProductDetails).length !== 0 &&
                  ('overall_weight' in currentProductDetails) &&
                  currentProductDetails.overall_weight !== null) ? (currentProductDetails.overall_weight).split('.')[0]
                        : '0'
                    }
                      </BoldText> kg
                    </Text>
                    <Text style={styles.detailDescriptionTextStyle}>
                      Weight
                    </Text>
                  </View>
                </View>
                <Text
                  style={styles.detailDescriptionTextStyle}
                  ellipsizeMode="tail"
                  numberOfLines={6}
                >
                  {currentProductDetails.description}
                </Text>
                <View style={{
                  flexDirection: 'row', height: 50, marginTop: 10
                }}
                >
                  <ButtonWithPlainText
                    title="SCHEDULE TEST RIDE"
                    style={styles.scheduleTestRideBtnStyle}
                    handleSubmit={() => this._onScheduleTestRideBtnClicked()}
                    textStyle={styles.scheduleTestRideBtnTextStyle}
                  />
                  <ButtonWithPlainText
                    title="I WANT FINANCE"
                    style={styles.financeBtnStyle}
                    handleSubmit={() => this._onIWantFinanceBtnClicked()}
                    textStyle={styles.financeBtnTextStyle}
                  />
                </View>
                <TouchableOpacity
                  style={styles.downArrowStyle}
                  onPress={() => this.overviewDownArrowTapped()}
                  activeOpacity={1}
                >
                  <Image
                    style={[styles.backArrowImageStyle, { height: 70, width: 70 }]}
                    source={downArrowOrange}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
      case '360': {
        const { current360ImagesArray, value } = this.state;
        return (
          <View style={styles.image360View} >
            <TouchableOpacity
              style={styles.image360LeftArrowIcon}
              onPress={() => this.image360LeftArrowtapped()}>
              <Image
                source={LeftArrowOrange}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.image360RightArrowIcon]}
              onPress={() => this.image360RightArrowtapped()}>
              <Image
                source={RightArrowOrange}
              />
            </TouchableOpacity>
            {
              current360ImagesArray.map((eachItem, index) => (
                <Image
                  style={[styles.image360Style, { opacity: (value === index) ? 1 : 0 }]}
                  fadeDuration={0}
                  resizeMode="contain"
                  key={index}
                  source={{
                    uri: (eachItem &&
            Object.keys(eachItem).length !== 0 &&
            ('image_url' in eachItem) &&
            eachItem.image_url !== null) ? eachItem.image_url : 'http://'
                  }}
                  {...this._panResponder.panHandlers}
          />
              ))
          }
            <TouchableOpacity
              style={[styles.downArrowStyle, { position: 'absolute', bottom: 20, left: (DEVICE_WIDTH / 2) - 35 }]}
              onPress={() => this.image360DownArrowTapped()}
              activeOpacity={1}
            >
              <Image
                style={[styles.backArrowImageStyle, { height: 70, width: 70 }]}
                source={downArrowOrange}
              />
            </TouchableOpacity>
          </View>
        );
      }
      case 'Features': {
        const { currentFeature } = this.state;
        return (
          <View style={styles.DataContainer}>
            <View style={[styles.splitViewStyle,
              {
                backgroundColor: 'white',
              }]}
            >
              <Image
                style={styles.featureImageView}
                resizeMode="center"
                source={{
                  uri: (currentFeature &&
              Object.keys(currentFeature).length !== 0 &&
              ('image_url' in currentFeature) &&
              currentFeature.image_url !== null) ? currentFeature.image_url : 'http://'
                }}
              />
            </View>
            <View style={[styles.splitViewStyle,
              {
                backgroundColor: 'white',
              }]}
            >
              <View style={styles.featureRightContentView}>
                <View style={styles.fetureRightDataView}>
                  <Text
                    style={styles.featuresTitleTextStyle}
                    ellipsizeMode="tail"
                    numberOfLines={2}
                  >
                    {currentFeature &&
                      Object.keys(currentFeature).length !== 0 &&
                      ('name' in currentFeature) &&
                        currentFeature.name !== null ? currentFeature.name : ''}
                  </Text>
                  <Text
                    style={styles.featuresDesTextStyle}
                    ellipsizeMode="tail"
                    numberOfLines={6}
                  >
                    {currentFeature.description}
                  </Text>
                  <View style={styles.featureRightDataBtnView} >
                    <ButtonWithLeftImage
                      image={backButton}
                      style={styles.backButtonStyle}
                      textStyle={styles.backButtonTextStyle}
                      handleSubmit={() => this.backBtnTapped()}
                      title="Back"
                    />
                    <ButtonWithRightImage
                      image={nextButton}
                      style={styles.nextBtnStyle}
                      textStyle={styles.nextButtonTextStyle}
                      handleSubmit={() => this.nextBtnTapped()}
                      title="Next"
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.downArrowStyle, {
                      marginTop: 20,
                      position: 'absolute',
                      bottom: 20,
                      right: 150
                    }]}
                    onPress={() => this.featureDownArrowTapped()}
                    activeOpacity={1}
                  >
                    <Image
                      style={[styles.backArrowImageStyle, { height: 70, width: 70 }]}
                      source={downArrowOrange}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.featureRightSliderView}>
                  <Text style={styles.slidertextStyle}>
                    {this.state.currentFeatureIndex + 1}/{this.state.currentVehicleFeatureArray.length}
                  </Text>
                  <View style={styles.sliderViewStyle} >
                    {this.getSliderView()}
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      }
      case 'Specs': {
        return (
          <View style={styles.DataContainer}>
            <View style={[styles.splitViewStyle,
              {
                backgroundColor: '#272121',
              }]}
            >
              <View style={styles.specLeftUpperView}>
                <View style={{ flex: 1 }}>
                  <Image
                    style={styles.specVehicleView}
                    resizeMode="center"
                    source={require('../../assets/images/logoBike.png')}
                  />
                </View>
                <View style={styles.specsListView}>
                  {this.getSpecTabData()}
                </View>
              </View>
              <View style={styles.specVehicleDetailView}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{
                    marginTop: 10, flex: 1, flexDirection: 'row'
                  }}
                  >
                    <View style={styles.dotterView} />
                    <View>
                      <Text style={styles.specBottomTitleStyle}>
                      Width
                      </Text>
                      <Text style={styles.specBottomDesStyle}>
                        {(currentVariantDetails.overall_width !== null) ?
                          currentVariantDetails.overall_width : '--'} mm
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    marginTop: 10, flex: 1, flexDirection: 'row'
                  }}
                  >
                    <View style={styles.dotterView} />
                    <View>
                      <Text style={styles.specBottomTitleStyle}>
                      Weight
                      </Text>
                      <Text style={styles.specBottomDesStyle}>
                        {(currentVariantDetails.overall_weight !== null) ?
                          (currentVariantDetails.overall_weight).split('.')[0] : '--'} kg
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    marginTop: 10, flex: 1, flexDirection: 'row'
                  }}
                  >
                    <View style={styles.dotterView} />
                    <View>
                      <Text style={styles.specBottomTitleStyle}>
                      Height
                      </Text>
                      <Text style={styles.specBottomDesStyle}>
                        {(currentVariantDetails.overall_height !== null) ?
                          currentVariantDetails.overall_height : '--'} mm
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.splitViewStyle, { backgroundColor: 'white' }]} >
              <ScrollView style={styles.scrollViewStyle}>
                {this.getCurrentSpecView()}
              </ScrollView>
              <TouchableOpacity
                style={[styles.downArrowStyle, { marginTop: 20 }]}
                onPress={() => this.specsDownArrowTapped()}
                activeOpacity={1}
              >
                <Image
                  style={[styles.backArrowImageStyle, { height: 70, width: 70 }]}
                  source={downArrowOrange}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      case 'Price': {
        return (
          <View style={styles.DataContainer}>
            <Image
              style={styles.breakDownPageImagePosition}
              source={{
                uri: (currentVehicleColorObject &&
              Object.keys(currentVehicleColorObject).length !== 0 &&
              ('image_url' in currentVehicleColorObject) &&
              currentVehicleColorObject.image_url !== null) ? currentVehicleColorObject.image_url : 'http://'
              }}
            />
            <View style={[styles.splitViewStyle, { backgroundColor: '#272121' }]} >
              <View style={[styles.breakdownLeftContentView, { height: 120 }]}>
                <View style={{
                  flexDirection: 'column', height: 40, alignItems: 'flex-start', marginLeft: 20
                }}
                >
                  <Text
                    style={[styles.detailDescriptionTextStyle, {
                      color: '#827773', textAlign: 'left'
                    }]}
                  >
                  On Road Price
                  </Text>
                  <Text
                    style={[styles.bikeNameTextStyle, { color: 'white', marginVertical: 10 }]}
                  >
                  RS.
                    {
                    (currentVariantDetails &&
                  ('prices' in currentVariantDetails) &&
                  Object.keys(currentVariantDetails.prices).length !== 0 &&
                  ('onroad_price' in currentVariantDetails.prices) &&
                  currentVariantDetails.prices.onroad_price !== null) ?
                      (currentVariantDetails.prices.onroad_price).split('.')[0] :
                      '0'
                  }
                  </Text>
                </View>
                <ButtonWithRightImage
                  image={nextButton}
                  style={styles.showBreakDownButton}
                  textStyle={styles.showBreakDownTextStyle}
                  handleSubmit={() => this._onShowPriceBreakDownBtnClicked()}
                  title="Show Price Breakdown"
                />
              </View>
            </View>
            <View style={[styles.splitViewStyle, { alignItems: 'flex-start' }]}>
              <View style={styles.dataView}>
                <View style={{
                  flexDirection: 'row',
                  width: 200,
                  borderColor: '#EF7432',
                  borderWidth: 1,
                  height: 40,
                  marginRight: 10,
                  marginVertical: 20
                }}
                >
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      alignSelf: 'center'
                    }}
                    source={GreenTickIcon}
                  />
                  <View style={{
                    flex: 6,
                  }}
                  >
                    <Picker
                      style={{ height: 35 }}
                      selectedValue={this.state.currentVariantDetails.name}
                      mode="dropdown"
                      onValueChange={(itemValue, itemIndex) =>
                        this.onPickerChange(this.state.currentVariantArray[itemIndex])}
                    >
                      {
                      this.state.currentVariantArray && this.state.currentVariantArray.map(currentVarient => (
                        <Picker.Item label={currentVarient.name} value={currentVarient.name} key={currentVarient.id} />
                      ))
                    }
                    </Picker>
                  </View>
                </View>
                <Text
                  style={[styles.bikeNameTextStyle, { fontSize: 12 }]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {(currentProductDetails &&
                    Object.keys(currentProductDetails).length !== 0 &&
                    ('manufacturer' in currentProductDetails) &&
                    Object.keys(currentProductDetails.manufacturer).length !== 0 &&
                    ('display_name' in currentProductDetails.manufacturer)) ?
                    (currentProductDetails.manufacturer.display_name).toUpperCase() : ''}
                </Text>
                <Text
                  style={[styles.descriptionTextStyle, { fontSize: 16 }]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {Object.keys(currentProductDetails).length !== 0 &&
                   ('name' in currentProductDetails) &&
                    currentProductDetails.name !== null ?
                    currentProductDetails.name.toUpperCase() : '' }
                </Text>
                <View style={[styles.detailView, { height: 60 }]} >
                  <View style={{
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center'
                  }}
                  >
                    <Text style={styles.unitsTextStyle}>
                      <BoldText>{(currentProductDetails &&
                  Object.keys(currentProductDetails).length !== 0 &&
                  ('displacement' in currentProductDetails) &&
                  currentProductDetails.displacement !== null) ? (currentProductDetails.displacement).split(' ')[0]
                        : '0'
                    }
                      </BoldText>cc
                    </Text>
                    <Text style={styles.detailDescriptionTextStyle}>
                      Engine
                    </Text>
                  </View>
                  <View style={{
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center'
                  }}
                  >
                    <Text style={styles.unitsTextStyle}>
                      <BoldText>{(currentProductDetails &&
                  Object.keys(currentProductDetails).length !== 0 &&
                  ('fuel_efficiency_overall' in currentProductDetails) &&
                  currentProductDetails.fuel_efficiency_overall !== null) ?
                        (currentProductDetails.fuel_efficiency_overall).split(' ')[0]
                        : '0'
                    }
                      </BoldText>kmpl
                    </Text>
                    <Text style={styles.detailDescriptionTextStyle}>
                      Mileage
                    </Text>
                  </View>
                  <View style={{
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'center'
                  }}
                  >
                    <Text style={styles.unitsTextStyle}>
                      <BoldText>{(currentProductDetails &&
                  Object.keys(currentProductDetails).length !== 0 &&
                  ('overall_weight' in currentProductDetails) &&
                  currentProductDetails.overall_weight !== null) ? (currentProductDetails.overall_weight).split(' ')[0]
                        : '0'
                    }
                      </BoldText>kmpl
                    </Text>
                    <Text style={styles.detailDescriptionTextStyle}>
                      Weight
                    </Text>
                  </View>
                </View>
                <Text
                  style={styles.detailDescriptionTextStyle}
                  ellipsizeMode="tail"
                  numberOfLines={4}
                >
                  {currentProductDetails.description}
                </Text>
                <View style={{
                  flexDirection: 'row', height: 50
                }}
                >
                  <Text style={{ alignSelf: 'center' }}>
                    <BoldText>Available colors</BoldText>
                  </Text>
                  <FlatList
                    style={[styles.colorFlatListStyle, { width: 120, height: 30 }]}
                    horizontal
                    keyExtractor={this._KeyExtractor}
                    data={
                  (currentVariantDetails &&
                    ('colors' in currentVariantDetails) &&
                  Object.keys(currentVariantDetails.colors).length !== 0) ? currentVariantDetails.colors : []
                }
                    renderItem={this._renderItem}
                    extraData={this.state}
                  />
                </View>
                <View style={{
                  flexDirection: 'row', height: 50, flex: 1
                }}
                >
                  <ButtonWithPlainText
                    title="SCHEDULE TEST RIDE"
                    style={styles.scheduleTestRideBtnStyle}
                    handleSubmit={() => this._onScheduleTestRideBtnClicked()}
                    textStyle={styles.scheduleTestRideBtnTextStyle}
                  />
                  <ButtonWithPlainText
                    title="I WANT FINANCE"
                    style={styles.financeBtnStyle}
                    handleSubmit={() => this._onIWantFinanceBtnClicked()}
                    textStyle={styles.financeBtnTextStyle}
                  />
                </View>
                <TouchableOpacity
                  style={styles.downArrowStyle}
                  onPress={null}
                  activeOpacity={1}
                >
                  <Image
                    style={[styles.backArrowImageStyle, { height: 70, width: 70 }]}
                    source={downArrowOrange}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
      default:
        return (
          <View style={{ height: 100 }} />
        );
    }
  }

  getCurrentSpecView=() => {
    const { currentVariantDetails } = this.state;
    switch (this.state.selectedSpecTabType) {
      case 'Engine & Transmission':
        return (
          <View style={{ flex: 1, margin: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Displacement
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.displacement !== null) ?
                    `${currentVariantDetails.displacement} cc` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Fuel Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.fuel_type !== null) ?
                    currentVariantDetails.fuel_type : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Cylinders
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.cylinders !== null) ?
                    currentVariantDetails.cylinders : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Ignition
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.ignition !== null) ?
                    currentVariantDetails.ignition : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Max Power
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.max_power_rpm !== null) ?
                    `${currentVariantDetails.max_power_rpm} rpm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Spark Plugs
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.spark_plugs !== null) ?
                    currentVariantDetails.spark_plugs : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Maximum Torque
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.torque_rpm !== null) ?
                    `${currentVariantDetails.torque_rpm} rpm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Cooling System
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.cooling_system !== null) ?
                    currentVariantDetails.cooling_system : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Bore
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.bore !== null) ?
                    `${currentVariantDetails.bore.split('.')[0]} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Gearbox Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.gearbox_type !== null) ?
                    currentVariantDetails.gearbox_type : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Stroke
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.stroke !== null) ?
                    `${currentVariantDetails.stroke.split('.')[0]} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                No. of Gears
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.no_of_gears !== null) ?
                    currentVariantDetails.no_of_gears : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Valves Per Cylinder
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.valves_per_cylinder !== null) ?
                    currentVariantDetails.valves_per_cylinder : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Transmission Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.transmission_type !== null) ?
                    currentVariantDetails.transmission_type : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Fuel Delivery System
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.fuel_delivery_system !== null) ?
                    currentVariantDetails.fuel_delivery_system : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Clutch
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.clutch !== null) ?
                    currentVariantDetails.clutch : '--'}
                </Text>
              </View>
            </View>
          </View>
        );
      case 'Brakes, Wheels & Suspension':
        return (
          <View style={{ flex: 1, margin: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Front Brake Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.front_brake_type !== null) ?
                    currentVariantDetails.front_brake_type : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Rear Tyre Size
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.rear_tyre_size !== null) ?
                    currentVariantDetails.rear_tyre_size : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Front Brake Size
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.front_brake_size !== null) ?
                    `${currentVariantDetails.front_brake_size} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Tyre Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.tyre_type !== null) ?
                    currentVariantDetails.tyre_type : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Rear Brake Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.rear_brake_type !== null) ?
                    currentVariantDetails.rear_brake_type : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Radial Tyres
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.radial_tyres !== null) ?
                    currentVariantDetails.radial_tyres.toString() : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Rear Brake Size
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.rear_brake_size !== null) ?
                    `${currentVariantDetails.rear_brake_size} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Wheel Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.wheel_type !== null) ?
                    currentVariantDetails.wheel_type : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Calliper Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.calliper_type !== null) ?
                    currentVariantDetails.calliper_type : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Front Suspension
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.front_suspension !== null) ?
                    currentVariantDetails.front_suspension : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Front Wheel Size
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.front_wheel_size !== null) ?
                    currentVariantDetails.front_wheel_size : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Rear Suspension
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.rear_suspension !== null) ?
                    currentVariantDetails.rear_suspension : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Front Tyre Size
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.front_tyre_size !== null) ?
                    currentVariantDetails.front_tyre_size : '--'}
                </Text>
              </View>
            </View>
          </View>
        );
      case 'Dimensions & Chassis':
        return (
          <View style={{ flex: 1, margin: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Overall Weight
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.overall_weight !== null) ?
                    `${(currentVariantDetails.overall_weight).split('.')[0]} kg` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Wheelbase
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.wheelbase !== null) ?
                    `${currentVariantDetails.wheelbase} mm` : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Overall Length
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.overall_width !== null) ?
                    `${currentVariantDetails.overall_width} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Ground Clearance
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.ground_clearance !== null) ?
                    `${currentVariantDetails.ground_clearance} mm` : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Overall Width
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.overall_width !== null) ?
                    `${currentVariantDetails.overall_width} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Seat Height
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.seat_height !== null) ?
                    `${currentVariantDetails.seat_height} mm` : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Overall Height
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.overall_height !== null) ?
                    `${currentVariantDetails.overall_height} mm` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Chassis Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.chasis_type !== null) ?
                    currentVariantDetails.chasis_type : '--'}
                </Text>
              </View>
            </View>
          </View>
        );
      case 'Fuel Efficiency & Performance':
        return (
          <View style={{ flex: 1, margin: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Fuel Tank Capacity
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.fuel_tank_capacity !== null) ?
                    `${currentVariantDetails.fuel_tank_capacity} litres` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                0 to 60 kmph
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.zero_to_sixty_kmph !== null) ?
                    currentVariantDetails.zero_to_sixty_kmph : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Reserve Fuel Capacity
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.reserve_fuel_capacity !== null) ?
                    `${currentVariantDetails.reserve_fuel_capacity} litres` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                0 to 80 kmph
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.zero_to_eighty_kmph !== null) ?
                    currentVariantDetails.zero_to_eighty_kmph : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Mileage
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.fuel_efficiency_overall !== null) ?
                    `${currentVariantDetails.fuel_efficiency_overall} kmpl` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                0 to 40 kmph
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.zero_to_forty_kmph !== null) ?
                    currentVariantDetails.zero_to_forty_kmph : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Fuel Efficiency Range
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.fuel_efficiency_range !== null) ?
                    `${currentVariantDetails.fuel_efficiency_range} Km` : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                60 to 0 kmph
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.sixty_to_zero_kmph !== null) ?
                    currentVariantDetails.sixty_to_zero_kmph : '--'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Top Speed
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.top_speed !== null) ? currentVariantDetails.top_speed : '--'}
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                80 to 0 kmph
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                  {(currentVariantDetails.eighty_to_zero_kmph !== null) ?
                    currentVariantDetails.eighty_to_zero_kmph : '--'}
                </Text>
              </View>
            </View>
          </View>
        );
      case 'Features':
        return (
          <View style={{ flex: 1, margin: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Speedometer
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              Analogue
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Digital Fuel Guage
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Fuel Guage
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              Yes
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Start Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              Electric Start
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Tachometer
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              --
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Shift Light
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Stand Alarm
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Antilock Braking System
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Stepped Seat
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              Killswitch
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                No. of Tripmeters
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                2
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Clock
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Tripmeter Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Digital
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Electric System
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                12V DC
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Low Fuel Indicator
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Yes
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Battery
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Maintenance Free 12V, 3Ah
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Low Oil Indicator
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Yes
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Headlight Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Bulb and Reflector Type
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Low Battery Indicator
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                No
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Headlight Bulb Type
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                12V 35/35W
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Pillion Backrest
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Brake/Tail Light
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                12V 21/5 W
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Pillion Grabrail
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Yes
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Turn Signal
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Yes
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Pillion Seat
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Yes
                </Text>
              </View>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
                Pass Light
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
              No
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text style={styles.specTitleTextStyle}>
              SPillion Footrest
                </Text>
                <Text style={styles.specTitleDesTextStyle}>
                Yes
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={{ height: 100 }} />
        );
    }
  }

  getSliderView=() => (
    <View style={{ flex: 1 }}>
      {
        this.state.currentVehicleFeatureArray.map((eachItem, index) => (
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => this.sliderViewTapped(eachItem, index)}
            key={index}
          >
            <View
              style={{
                flex: 1,
                width: 5,
                backgroundColor: (index === this.state.currentFeatureIndex) ?
                  '#f3795c' : 'gray',
                marginVertical: 5,
                borderRadius: 3
              }}
            />
          </TouchableOpacity>
        ))
      }
    </View>
  )
  _KeyExtractor = item => item.id

  _renderItem = data => {
    const { item } = data;
    return (
      <TouchableOpacity
        onPress={() => this.colorViewTapped(item)}
        activeOpacity={1}
      >
        <View style={[styles.colorCellStyle,
          {
            backgroundColor: (item &&
            Object.keys(item).length !== 0 &&
            ('color_codes' in item) &&
            item.color_codes.length !== 0) ?
              item.color_codes[0] :
              'white',
            borderColor: (item.id === this.state.currentVehicleColorObject.id) ? '#F17C3A' : 'gray'
          }
        ]}
        >
          {
            item &&
            Object.keys(item).length !== 0 &&
            ('color_codes' in item) &&
            item.color_codes.length !== 0 &&
            this.updateCurrentColorView(item.color_codes)
          }
        </View>
      </TouchableOpacity>
    );
  }
  updateCurrentColorView=item => (
    <View style={{ flex: 1 }}>
      {
        item.map((eachItem, index) => (
          <View
            style={{ flex: 1, backgroundColor: eachItem }}
            key={index}
          />
        ))
      }
    </View>
  )
  changeTabColor(id) {
    if (this.state.tabPosition === id) {
      return styles.tabSelectedStyle;
    }
    return styles.tabStyle;
  }
  changeTextColor(id) {
    if (this.state.tabPosition === id) {
      return styles.tabSelectedTextStyle;
    }
    return styles.tabTextStyle;
  }
  changeSpecTabColor(id) {
    if (this.state.specTabPosition === id) {
      return styles.specTabSelectedStyle;
    }
    return styles.SpecTabStyle;
  }
  changeSpecTextColor(id) {
    if (this.state.specTabPosition === id) {
      return styles.specTabSelectedTextStyle;
    }
    return styles.specTabTextStyle;
  }
  _backArrowBtnClicked =() => {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  _onShowPriceBreakDownBtnClicked =() => {
    let currentIndex = -1;
    console.log('_onShowPriceBreakDownBtnClicked CLicked');
    const {
      currentProductDetails, currentVariantDetails, currentVehicleColorObject, currentDealerId
    } = this.state;
    console.log('BEFORE CURRENT LEAD OBJECT', this.state.currentLeadObject);

    const currentLeadObject = JSON.parse(JSON.stringify(this.state.currentLeadObject));
    const leadDetailObj = {
      dealer_id: currentDealerId,
      vehicle_id: currentProductDetails.id,
      variant_id: currentVariantDetails.id,
      variant_colour_id: currentVehicleColorObject.id,
      manufacturer_id: currentLeadObject.manufacturer_id,
      lead_id: currentLeadObject.id,
      vehicle_status: 200
    };
    if (currentLeadObject &&
        Object.keys(currentLeadObject).length !== 0 &&
        ('lead_details' in currentLeadObject) &&
        currentLeadObject.lead_details.length !== 0) {
      currentIndex = currentLeadObject.lead_details.findIndex(eachObj =>
        eachObj.vehicle_id === currentProductDetails.id);
    }
    if (currentIndex !== -1) {
      currentLeadObject.lead_details[currentIndex] = {
        ...currentLeadObject.lead_details[currentIndex],
        ...leadDetailObj
      };
    }
    if (currentIndex === -1) {
      this.props.createLeadDetailsObject(currentLeadObject.id, leadDetailObj)
        .then(() => {
          this.updateLeadStatus(currentLeadObject);
        });
    } else {
      this.props.updateLeadDetailsObject(
        currentLeadObject.lead_details[currentIndex].id,
        currentLeadObject.lead_details[currentIndex]
      )
        .then(() => {
          this.updateLeadStatus(currentLeadObject);
        });
    }
  }

  updateLeadStatus = leadObj => {
    leadObj.status = 400;
    if (!leadObj.lead_details && !leadObj.follow_up && !leadObj.lead_finance_detail) {
      delete leadObj.lead_details;
      delete leadObj.follow_up;
      delete leadObj.lead_finance_detail;
      if (leadObj.lostReason) {
        delete leadObj.lostReason;
      }
    }
    console.log('LEAD DETAILS', leadObj);
    this.props.updateLeadInfo(leadObj.id, leadObj)
      .then(() => {
        this.props.navigation.navigate('BikePriceScreen', { leadDetail: this.props.leadDetailObj });
      });
  }

  checkLeadDetailHasLeadDetail = () => {
    const {
      currentProductDetails, currentLeadDetailObject, currentVariantDetails, currentVehicleColorObject, currentDealerId
    } = this.state;
    if (currentLeadDetailObject &&
        Object.keys(currentLeadDetailObject).length !== 0 &&
        ('lead_details' in currentLeadDetailObject) &&
        currentLeadDetailObject.lead_details.length !== 0) {
      const currentIndex = currentLeadDetailObject.lead_details.findIndex(eachObj =>
        eachObj.vehicle_id === currentProductDetails.id);
      const leadDetailObj = {
        dealer_id: currentDealerId,
        vehicle_id: currentProductDetails.id,
        variant_id: currentVariantDetails.id,
        variant_colour_id: currentVehicleColorObject.id,
        manufacturer_id: currentLeadDetailObject.manufacturer_id,
        lead_id: currentLeadDetailObject.id
      };
      if (currentIndex === -1) {
        currentLeadDetailObject.lead_details.push({
          ...leadDetailObj
        });
      } else {
        currentLeadDetailObject.lead_details[currentIndex] = {
          ...currentLeadDetailObject.lead_details[currentIndex],
          ...leadDetailObj
        };
      }
      this.setState({
        currentLeadDetailObject
      });
    }
  }
  _onScheduleTestRideBtnClicked =() => {
    console.log('_onScheduleTestRideBtnClicked CLicked');
  }
  _onIWantFinanceBtnClicked =() => {
    console.log('_onIWantFinanceBtnClicked CLicked');
  }
  image360LeftArrowtapped =() => {
    const { value, current360ImagesArray } = this.state;
    let currentVal = value - 1;
    if (currentVal < 0) {
      currentVal = current360ImagesArray.length - 1;
    } else if (currentVal > current360ImagesArray.length) {
      currentVal = 0;
    } else if (currentVal === current360ImagesArray.length) {
      currentVal = 0;
    }
    this.setState({
      value: currentVal
    });
  }
  image360RightArrowtapped =() => {
    const { value, current360ImagesArray } = this.state;
    let currentVal = value + 1;
    if (currentVal < 0) {
      currentVal = current360ImagesArray.length - 1;
    } else if (currentVal > current360ImagesArray.length) {
      currentVal = 0;
    } else if (currentVal === current360ImagesArray.length) {
      currentVal = 0;
    }
    this.setState({
      value: currentVal
    });
  }

  colorViewTapped = item => {
    this.setState({
      currentVehicleColorObject: item
    });
  }
  sliderViewTapped = (item, index) => {
    this.setState({
      currentFeatureIndex: index,
      currentFeature: item
    });
  }
  emiOptionsbtnTapped = () => {
    console.log('EMI OPTIONS View CLicked');
  }
  backBtnTapped = () => {
    let curIndex = this.state.currentFeatureIndex - 1;
    if (curIndex < 0) {
      curIndex = this.state.currentVehicleFeatureArray.length - 1;
    }
    this.setState({
      currentFeatureIndex: curIndex,
      currentFeature: this.state.currentVehicleFeatureArray[curIndex]
    });
  }
  nextBtnTapped = () => {
    let curIndex = this.state.currentFeatureIndex + 1;
    if (curIndex === this.state.currentVehicleFeatureArray.length) {
      curIndex = 0;
    }
    this.setState({
      currentFeatureIndex: curIndex,
      currentFeature: this.state.currentVehicleFeatureArray[curIndex]
    });
  }
  overviewDownArrowTapped = () => {
    console.log('Down arrow Tapped');
    this.onTabPress(this.state.tabLayoutData[1]);
  }
  image360DownArrowTapped = () => {
    console.log('Down arrow Tapped');
    this.onTabPress(this.state.tabLayoutData[2]);
  }
  featureDownArrowTapped = () => {
    console.log('Down arrow Tapped');
    this.onTabPress(this.state.tabLayoutData[3]);
  }
  specsDownArrowTapped = () => {
    console.log('Down arrow Tapped');
  }

  _handlePanResponderMove = e => {
    pointsArr.push(e.nativeEvent.locationX);
    this.updateSlider();
  };

  _handlePanResponderEnd = () => {
    pointsArr = [];
  };
  _handleStartShouldSetPanResponder = () =>
    // Should we become active when the user presses down on the circle?
    true
  ;

  _handleMoveShouldSetPanResponder = () =>
    // Should we become active when the user moves a touch over the circle?
    true
  ;

  _handlePanResponderGrant = () => {
    // this._highlight();
  };

  updateSlider() {
    const { current360ImagesArray } = this.state;
    const sliderStep = DEVICE_WIDTH / current360ImagesArray.length;
    const firstEle = pointsArr[0];
    const lastEle = pointsArr[pointsArr.length - 1];
    let drag = lastEle - firstEle;
    if (Math.abs(Math.round(drag / sliderStep)) >= 1) {
      pointsArr = [];
      let currentVal = Math.round(this.state.value + Math.round(drag / sliderStep));
      if (currentVal < 0) {
        currentVal = current360ImagesArray.length - 1;
      } else if (currentVal > current360ImagesArray.length) {
        currentVal = 0;
      } else if (currentVal === current360ImagesArray.length) {
        currentVal = 0;
      }
      drag = 0;
      this.setState({
        value: currentVal
      });
    }
  }

  render() {
    const { currentProductDetails } = this.state;
    return (
      <View style={styles.mainContainer} >
        <Loader loading={this.props.loading} />
        <View style={styles.headerView} >
          <TouchableOpacity
            onPress={() => this._backArrowBtnClicked()}
            style={styles.backbuttonStyle}
            activeOpacity={1}
          >
            <Image
              style={styles.backArrowImageStyle}
              source={backArrow}
            />
          </TouchableOpacity>
          <View style={styles.headerInlineSeperator} />
          <Text style={styles.headerTextStyle}>
            {currentProductDetails.name}
          </Text>
          <View />
        </View>
        <View style={styles.tabViewStyles}>
          {this.getTabData()}
        </View>
        { this.getCurrentView()}
      </View>
    );
  }
}
export default ProductDetailScreen;
