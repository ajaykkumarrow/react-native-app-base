import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getVehicles } from '../../redux/actions/GetVehicles/actionCreators';
import sampleBike from '../../assets/images/bike.png';
import { BookTestRideButton, CheckboxWithText } from '../../components/button/Button';
import storage from '../../helpers/AsyncStorage';
import styles from './MyProductsStyles';
import Loader from './../../components/loader/Loader';
import AppHeader from '../../components/header/Header';

const DEVICE_WIDTH = Dimensions.get('window').width;

@connect(state => ({
  vehicleList: state.getVehicles.vehicleData,
  loading: state.getVehicles.loading,
  isSideNavOpen: state.global.isSideNavOpen,
  currentUser: state.user.currentUser
}), { getVehicles })
export default class MyProductsScreen extends Component {
  static propTypes = {
    getVehicles: PropTypes.func.isRequired,
    vehicleList: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    isSideNavOpen: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
  }

  static defaultProps = {
    vehicleList: []
  }

  constructor(props) {
    super(props);
    this.state = ({
      activeCheckboxButton: [],
      renderList: false,
      vehicleData: [],
      searchVal: '',
      copy_vehicleData: [],
      cardSize: null
    });
  }

  componentDidMount() {
    this.onInitialLoad();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.onInitialLoad();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onInitialLoad() {
    const { dealerId } = this.props.currentUser;
    this.props.getVehicles(dealerId).then(() => {
      Object.assign(this.state.copy_vehicleData, this.props.vehicleList);
      this.setState({
        vehicleData: this.props.vehicleList
      });
    });
  }

  getCheckboxButtonValue = value => {
    const position = this.state.activeCheckboxButton.map(e => e.id).indexOf(value.id);
    if (position === -1) {
      if (this.state.activeCheckboxButton.length > 2) {
        Alert.alert(
          'Info',
          'Choose only 3 vehicles',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        );
      } else {
        this.state.activeCheckboxButton.push(value);
        this.setState({
          activeCheckboxButton: this.state.activeCheckboxButton,
          renderList: !this.state.renderList,
        });
      }
    } else {
      this.state.activeCheckboxButton.splice(position, 1);
      this.setState({
        activeCheckboxButton: this.state.activeCheckboxButton,
        renderList: !this.state.renderList,
      });
    }
  }

  getSelectedVehicles = () => {
    this.state.activeCheckboxButton.map(eachVehicle => (
      <View>
        <Text>{eachVehicle.name}</Text>
      </View>
    ));
  }

  getDimensions = (e, param) => {
    const { width } = e.nativeEvent.layout;
    switch (param) {
      case 'page':
        this.setState({
          cardSize: width / 3.3
        });
        break;
      default:
        return 0;
    }
  }

  getValueOfPower = item => {
    const val = item.split('@');
    return val[0];
  }

  searchVehicle(value) {
    return new Promise((resolve, reject) => {
      const obj = this.state.copy_vehicleData.filter(o => o.name.toLowerCase().includes(value.toLowerCase()));
      if (obj) {
        resolve(obj);
      } else {
        reject(new Error('error'));
      }
    });
  }

  searchProduct = (param, value) => this.searchVehicle(value)
    .then(res => {
      this.setState({
        searchVal: value,
        vehicleData: res
      });
    }).catch(() => {
      this.setState({
        searchVal: value,
        vehicleData: null
      });
    });

  cancelVehicle = cancelledVehicle => {
    const position = this.state.activeCheckboxButton.map(e => e.id).indexOf(cancelledVehicle.id);
    this.state.activeCheckboxButton.splice(position, 1);
    this.setState({
      activeCheckboxButton: this.state.activeCheckboxButton,
      renderList: !this.state.renderList,
    });
  };

  // after selecting vehicle on click of book test ride
  bookTestRide = () => {
    console.log('Book test ride');
  }

  // After selecting on click of compare button
  compareVehicle = () => {
    console.log('compare bikes');
  }

  // Onclick of back image
  goBack = () => {
    console.log('Go to previous screen');
  }

  clearAll = () => {
    this.setState({
      activeCheckboxButton: [],
      renderList: !this.state.renderList
    });
  }

  // To be implemented
  saveLead = () => {
    console.log('Save Lead Clicked');
  }

  // To be implemented
  cardClicked= item => {
    const { navigate } = this.props.navigation;
    navigate('ProductDetailScreen', { item });
  }

  headerComponent = () => (
    <View style={styles.container}>
      {/* start of Section 1 Left pane */}
      <View style={styles.directionRow}>
        <View style={styles.sectionOneWrapper}>
          <Text style={styles.whiteColor}>
          Products
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{
            alignContent: 'center',
            alignSelf: 'center',
            paddingHorizontal: 10
          }}><Icon name="search" size={21} color="white" />
          </Text>
          <TextInput
            placeholder="Search for the product"
            style={styles.searchBoxStyle}
            underlineColorAndroid="transparent"
            value={this.state.searchVal}
            selectionColor="white"
            placeholderTextColor="white"
            onChangeText={searchVal => this.searchProduct('search', searchVal)}
          />
        </View>
      </View>
    </View>
  );

  showCard = item => {
    const { isSideNavOpen } = this.props;
    const maxWidth = (DEVICE_WIDTH - (isSideNavOpen ? 160 : 80)) / 3;
    return (
      <TouchableOpacity
      // onPress={() => this.cardClicked(item)}
        onPress={() => this.props.navigation.navigate('CreateNewLead')}
        activeOpacity={0.5}
    >
        <View style={[styles.paddingTen, { flex: 1 }]}>
          {/* start of card */}
          <View style={[styles.cardWrapper, {
            width: maxWidth
          }]}>
            <View style={styles.cardName}>
              <View style={[styles.paddingTopTen, { flex: 2 }]}>
                {
                (item.name === null || item.name === undefined) ?
                  <Text style={styles.vehicleName}>N/A</Text>
                  :
                  <Text style={styles.vehicleName}>{item.name}</Text>
              }
              </View>
              <View style={[styles.paddingTopTen, { flex: 1, marginLeft: 20 }]}>
                <CheckboxWithText
                  textStyle={styles.checkboxTextStyle}
                  data={[
                    {
                      id: item.id, name: item.name, text: 'compare', item
                    }
                  ]}
                  activeCheckboxButton={this.state.activeCheckboxButton}
                  selectedCheckboxButtonValue={val => this.getCheckboxButtonValue(val)}
              />
              </View>
            </View>
            <View style={styles.bikeCardImage}>
              {/* Bike card image */}
              <View style={[styles.cardImage]} >
                {
                (item.image_url === undefined || item.image_url === null) ?
                  <Image
                    resizeMode="contain"
                    source={sampleBike}
                    style={styles.bikeImageResolution}
                  />
                  :
                  <Image
                    resizeMode="contain"
                    source={{ uri: item.image_url }}
                    style={styles.bikeImageResolution}
                  />
              }
              </View>
              {/* Right Side of card - image */}
              <View style={styles.cardRightWrapper}>
                {/* displacement start */}
                <View style={styles.displacementWrapper}>
                  <Text
                    style={styles.displacementStyles}
                >
                    {
                    (item.displacement === null || item.displacement === undefined)
                      ?
                      'N/A'
                      :
                      `${item.displacement} cc`
                  }
                  </Text>
                </View>
                {/* displacement end */}
                {/* bhp start */}
                <View style={styles.rightPaneWrapper}>
                  <Text style={styles.fuelEfficiencyText}>
                    {(item.max_power === undefined || item.max_power === null)
                      ?
                      'N/A'
                      :
                      `${this.getValueOfPower(item.max_power)} BHP`}
                  </Text>
                </View>
                {/* bhp end */}
                {/* kmpl start */}
                <View style={styles.rowMarginRight10}>
                  <Text style={styles.weightStyle}>
                    {(item.fuel_efficiency_overall === null || item.fuel_efficiency_overall === undefined)
                      ?
                      'N/A'
                      :
                      `${item.fuel_efficiency_overall} kmpl`}
                  </Text>
                </View>
                {/* kmpl end */}
                {/* kg start */}
                <View style={styles.rowMarginRight10}>
                  <Text style={styles.weightStyle}>
                    {(item.overall_weight === null || item.overall_weight === undefined)
                      ?
                      'N/A'
                      :
                      `${item.overall_weight} kg`}
                  </Text>
                </View>
                {/* kg end */}
              </View>
              {/* End of Right Side of card - image */}
              {/* End of bike card image */}
            </View>
            {/* start of card bottom view */}
            <View style={styles.cardBottomView}>
              {/* start of on road price */}
              <View>
                <Text style={styles.onRoadPrice}>On-road Price</Text>
                <Text style={styles.priceValue}>
                  { (item.prices.length > 0 && item.prices[0].onroad_price !== undefined) ?
                    `₹ ${item.prices[0].onroad_price}/-`
                    :
                    'N/A'
                }
                </Text>
              </View>
              {/* end of on road price */}
              {/* start of button */}
              <BookTestRideButton
                style={styles.testRideButtonColor}
                handleSubmit={this.bookTestRide}
                title="BOOK A TEST RIDE"
                imageStyle={styles.buttonLeftImage}
                textStyle={styles.testRideButtonTextStyle}
            />
              {/* end of button */}
            </View>
            {/* end of card bottom view */}
          </View>
          {/* end of card */}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader navigation={this.props.navigation}>
          {this.headerComponent()}
        </AppHeader>
        <KeyboardAvoidingView style={styles.flexOne} onLayout={e => this.getDimensions(e, 'page')}>
          {/* Section 1 */}
          <Loader loading={this.props.loading} />
          {/* Section 2 */}
          {
          (this.state.activeCheckboxButton.length > 0) ?
            <View style={styles.sectionTwoWrapper}>
              {/* start of Section 2 Left pane */}
              <View style={styles.directionRow}>
                {this.state.activeCheckboxButton.map(eachVehicle => (
                  <View
                    key={eachVehicle.item.id}
                    style={styles.vehicleCheckbox}
                    activeOpacity={0.5}
                  >
                    <View style={styles.vehicleNameView}>
                      <Text style={styles.vehicleTextColor}>{eachVehicle.item.name}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.cancelVehicle(eachVehicle)}
                    >
                      <Icon name="times-circle" size={18} color="#F6673D" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.compareButtonWrapperCenter}>
                  <TouchableOpacity
                    onPress={this.clearAll}
                    style={styles.clearAllButton}
                  >
                    <Text style={styles.clearAllText}> Clear All </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* end of Section 2 Left pane */}
              {/* start of Section 2 Right pane */}
              <View style={styles.directionRow}>
                <BookTestRideButton
                  handleSubmit={() => this.compareVehicle()}
                  style={styles.SectionTworightPaneWrapper}
                  activeOpacity={0.5}
                  title="Compare"
                >
                  <View style={styles.compareButtonWrapper}>
                    <Text style={styles.compareButtonColor}>Compare</Text>
                  </View>
                  <View style={styles.activeVehicleCheckbox}>
                    <Text style={styles.activeCheckBox}>{this.state.activeCheckboxButton.length}</Text>
                  </View>
                </BookTestRideButton>
              </View>
              {/* end of Section 2 Right pane */}
            </View>
            :
            null
        }
          {/* Section 3 */}
          <View style={[styles.cardListWrapper]}>
            <FlatList
              data={this.state.vehicleData}
              renderItem={({ item }) => this.showCard(item)}
              keyExtractor={item => item.id}
              horizontal={false}
              numColumns={3}
              extraData={this.state.renderList || this.props.isSideNavOpen}
          />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
