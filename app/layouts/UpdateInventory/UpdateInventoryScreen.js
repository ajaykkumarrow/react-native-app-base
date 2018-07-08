import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  alert,
  TextInput,
  ScrollView,
  Dimensions,
  Animated } from 'react-native';
import fonts from '../../theme/fonts';
import styles from './updateInventoryStyles';
// import ExpandableTile from '../../components/expandableTile/ExpandableTile';
// import whiteAddIcon from '../../assets/images/whiteAddIcon.png';
// import NotificationIcon from '../../assets/images/Notification.png';
// import sampleImage from '../../assets/images/username.png';
import { GradientButtonLarge } from '../../components/button/Button';
import { GradientCountTile } from '../../components/tile/Tile';
import myLeadHeaderStyles from '../LeadDashboard/components/leadHeader/myleadHeaderStyles';
import Close from '../../assets/images/close.png';
import Loader from '../../components/loader/Loader';
import SpringView from '../../components/animated/SpringView';
import AppHeader from '../../components/header/Header';

import { getInventoryList,
  getVarientList,
  getInventoryPriceDetails,
  updateInventoryPriceDetails,
  getStockDetails,
  updateStockDetails,
  getIncentiveOfferDetails,
  updateIncentiveOfferDetails,
  getCurrentVariantDetails
} from '../../redux/actions/Inventory/actionCreators';
import storage from '../../helpers/AsyncStorage';

const DEVICE_WIDTH = Dimensions.get('screen').width;

let currentDealerId;
let currentUserId;
let priceData;
@connect(
  state => ({
    inventoryList: state.inventory.inventoryList,
    variantList: state.inventory.variantList,
    variantPriceDetails: state.inventory.variantPriceDetails,
    variantStockList: state.inventory.variantStockList,
    incentiveOfferDetails: state.inventory.incentiveOfferDetails,
    currentVariantVehicleDetails: state.inventory.currentVariantVehicleDetails,
    loading: state.inventory.loading
  }),
  {
    getInventoryList,
    getVarientList,
    getInventoryPriceDetails,
    updateInventoryPriceDetails,
    getStockDetails,
    updateStockDetails,
    getIncentiveOfferDetails,
    updateIncentiveOfferDetails,
    getCurrentVariantDetails
  }
)
class UpdateInventoryScreen extends Component {
  static propTypes = {
    getInventoryList: PropTypes.func.isRequired,
    getInventoryPriceDetails: PropTypes.func.isRequired,
    updateInventoryPriceDetails: PropTypes.func.isRequired,
    getStockDetails: PropTypes.func.isRequired,
    updateStockDetails: PropTypes.func.isRequired,
    getIncentiveOfferDetails: PropTypes.func.isRequired,
    updateIncentiveOfferDetails: PropTypes.func.isRequired,
    inventoryList: PropTypes.array,
    variantStockList: PropTypes.array,
    variantPriceDetails: PropTypes.object,
    incentiveOfferDetails: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired
  }
  static defaultProps = {
    inventoryList: [],
    variantPriceDetails: {},
    variantStockList: [],
    incentiveOfferDetails: {},
  }
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(-70);
    this.state = {
      selectedType: 'Price',
      modalVisible: false,
      currentlySelectedVehicle: {},
      currentVariantColorList: [],
      incentiveOfferObject: {},
      inventoryListMain: [],
      inventoryListCopy: [],
      refreshList: false,
      toastMessage: '',

      /**
       * Default values
       */
      exshowroomPrice: '',
      rtoAndOthersPrice: '',
      insurancePrice: '',
      accessoriesPrice: '',
      onRoadPrice: '',
      unitsAvailableToday: '',
      ridesPerBike: '',
      incentivePerUnitSold: '',
      /* expandableTileData: [
        {
          titleText: 'Gixxer',
          titleCount: '5'
        },
        {
          titleText: 'Gixxer SF',
          titleCount: '5'
        },
        {
          titleText: 'Intruder',
          titleCount: '5'
        },
        {
          titleText: 'Gixxer',
          titleCount: '5'
        },
        {
          titleText: 'Gixxer',
          titleCount: '5'
        },
        {
          titleText: 'Gixxer',
          titleCount: '5'
        },
      ], */
      tabLayoutData: [
        {
          id: 1,
          name: 'Price',
        },
        {
          id: 2,
          name: 'Units Available',
        },
        {
          id: 3,
          name: 'Test Ride Vehicles',
        },
        {
          id: 4,
          name: 'Incentive',
        },
        {
          id: 5,
          name: 'Offers',
        },
      ],
      tabPosition: 1,
    };
  }
  componentWillMount() {
    storage.getItem('currentUser')
      .then(recievedToken => {
        currentDealerId = recievedToken.dealerId;
        currentUserId = recievedToken.userId;
        return this.props.getInventoryList(currentDealerId);
      })
      .then(() => {
        this.setState({
          inventoryListMain: this.props.inventoryList
        });
      })
      .catch(error => {
        console.log('Error.....:', error);
      });
  }

  onTabPress = tabInfo => {
    this.setState({
      tabPosition: tabInfo.id,
      selectedType: tabInfo.name
    });
    this.getTabDetails(tabInfo);
  }

  onTap = (val, item) => {
    this.setState({
      currentlySelectedVehicle: item
    });
    this.getPriceDetails(item);
    this.setModalVisible(!this.state.modalVisible);
  }

  getTabDetails=tabInfo => {
    switch (tabInfo.name) {
      case 'Price':
        this.getPriceDetails(this.state.currentlySelectedVehicle);
        break;
      case 'Units Available':
        this.getcurrentvarientStockDetails(this.state.currentlySelectedVehicle);
        break;
      default:
        this.getIncentiveOfferDetails(this.state.currentlySelectedVehicle);
        break;
    }
  }

  getTabPosition=value => {
    switch (value) {
      case 'Price':
        return 1;
      case 'Units Available':
        return 2;
      case 'Test Ride Vehicles':
        return 3;
      case 'Incentive':
        return 4;
      case 'Offers':
        return 5;
      default:
        return 1;
    }
  }

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
    if (!visible) {
      this.props.getInventoryList(currentDealerId);
      this.setState({
        tabPosition: 1,
        selectedType: 'Price',
        currentlySelectedVehicle: {},
        currentVariantColorList: [],
        incentiveOfferObject: {},
      });
    }
  }

   getPriceDetails=item => {
     this.props.getInventoryPriceDetails(
       item.id,
       item.variant_id,
       currentDealerId
     )
       .then(() => {
         if (this.props.variantPriceDetails && Object.keys(this.props.variantPriceDetails).length !== 0) {
           console.log('PRICE DETAILS', this.props.variantPriceDetails);
           this.setState({
             insurancePrice: (this.props.variantPriceDetails.insurance != null) ?
               this.props.variantPriceDetails.insurance.split('.')[0] : '',
             rtoAndOthersPrice: (this.props.variantPriceDetails.rto_charges != null) ?
               this.props.variantPriceDetails.rto_charges.split('.')[0] : '',
             onRoadPrice: (this.props.variantPriceDetails.onroad_price != null) ?
               this.props.variantPriceDetails.onroad_price.split('.')[0] : '',
             exshowroomPrice: (this.props.variantPriceDetails.ex_showroom_price != null) ?
               this.props.variantPriceDetails.ex_showroom_price.split('.')[0] : '',
             accessoriesPrice: (this.props.variantPriceDetails.accessories_price != null) ?
               this.props.variantPriceDetails.accessories_price.split('.')[0] : '',
           });
         } else {
           this.setState({
             exshowroomPrice: '',
             rtoAndOthersPrice: '',
             insurancePrice: '',
             accessoriesPrice: '',
             onRoadPrice: '',
           });
         }
       });
   }

      getcurrentvarientStockDetails=curvehicle => {
        this.props.getStockDetails(currentDealerId, curvehicle.variant_id).then(() => {
          this.setState({
            currentVariantColorList: this.props.variantStockList,
          });
        });
      }
    getIncentiveOfferDetails=curVehicle => {
      this.props.getIncentiveOfferDetails(currentDealerId, curVehicle.id).then(() => {
        this.setState({
          incentiveOfferObject: {
            ...this.props.incentiveOfferDetails,
          }
        });
      }, error => {
        console.log(error);
      });
    }

  getCurrentView = () => {
    switch (this.state.selectedType) {
      case 'Price': {
        return (
          <View style={styles.tabCurrentViewStyle}>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>Ex-Showroom</Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text>
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  onChangeText={text => this.setState({ exshowroomPrice: text })}
                  value={this.state.exshowroomPrice}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>RTO & Others</Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text>
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  onChangeText={text => this.setState({ rtoAndOthersPrice: text })}
                  value={this.state.rtoAndOthersPrice}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>Insurance(Comprehensive)</Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text>
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  onChangeText={text => this.setState({ insurancePrice: text })}
                  value={this.state.insurancePrice}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>Accessories</Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text>
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  editable={false}
                  onChangeText={text => this.setState({ accessoriesPrice: text })}
                  value={this.state.accessoriesPrice}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ height: 60, backgroundColor: '#F6F6F6', flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={{
                  color: '#2c2c2c',
                  fontSize: 14,
                  fontFamily: fonts.sourceSansProSemiBold
                }}
                >On Road price
                </Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text >
                <Text style={[styles.detailTextInputStyle, { width: DEVICE_WIDTH * 0.1 }]}>
                  {
                    (parseInt((this.state.exshowroomPrice.length !== 0 ? this.state.exshowroomPrice : 0), 10) +
                    parseInt((this.state.rtoAndOthersPrice.length !== 0 ? this.state.rtoAndOthersPrice : 0), 10) +
                    parseInt((this.state.insurancePrice.length !== 0 ? this.state.insurancePrice : 0), 10) +
                    parseInt((this.state.accessoriesPrice.length !== 0 ?
                      this.state.accessoriesPrice : 0), 10)).toString()
                  }
                </Text>
              </View>
            </View>
          </View>
        );
      }
      case 'Units Available':
        return (
          <View style={styles.tabCurrentViewStyle}>
            <ScrollView style={{ height: 100 }}>
              {this.displayStocksBasedOnColorView()}
            </ScrollView>
          </View>
        );
      case 'Test Ride Vehicles':
        return (
          <View style={styles.tabCurrentViewStyle}>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 0.7, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>Units available </Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  onChangeText={text => {
                    this.testRideUnitAvailableOnChange(text);
                  }
                  }
                  value={(
                    this.state.incentiveOfferObject &&
                    Object.keys(this.state.incentiveOfferObject).length !== 0 &&
                    ('test_ride_vehicle' in this.state.incentiveOfferObject) &&
                     (this.state.incentiveOfferObject.test_ride_vehicle != null)) ?
                    ((this.state.incentiveOfferObject.test_ride_vehicle).toString()).split('.')[0] :
                    this.state.unitsAvailableToday}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>Number of rides per slot </Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  onChangeText={text => {
                    this.testRidesPerSlotOnChange(text);
                  }
                  }
                  value={(this.state.incentiveOfferObject &&
                     Object.keys(this.state.incentiveOfferObject).length !== 0 &&
                     ('slots_per_vechile' in this.state.incentiveOfferObject) &&
                     (this.state.incentiveOfferObject.slots_per_vechile != null)) ?
                    ((this.state.incentiveOfferObject.slots_per_vechile).toString()).split('.')[0] :
                    this.state.ridesPerBike}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
          </View>
        );
      case 'Incentive':
        return (
          <View style={styles.tabCurrentViewStyle}>
            <View style={{ height: 60, backgroundColor: '#F6F6F6', flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={{
                  color: '#2c2c2c',
                  fontSize: 14,
                  fontFamily: fonts.sourceSansProSemiBold
                }}
                >On Road price
                </Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text >
                <Text style={[styles.detailTextInputStyle, { width: DEVICE_WIDTH * 0.1 }]}>
                  {this.state.onRoadPrice}
                </Text>
              </View>
            </View>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 0.7, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>Incentive per unit sold</Text>
              </View>
              <View style={styles.textInputViewStyle}>
                <Text style={[styles.detailTextInputStyle, { marginHorizontal: 10 }]}>
        RS.
                </Text >
                <TextInput
                  style={styles.fieldContainer}
                  keyboardType="numeric"
                  onChangeText={text => {
                    this.IncentivePerUnitOnChange(text);
                  }
                  }
                  value={(this.state.incentiveOfferObject &&
                     Object.keys(this.state.incentiveOfferObject).length !== 0 &&
                     ('incentive_amount' in this.state.incentiveOfferObject) &&
                      this.state.incentiveOfferObject.incentive_amount !== null) ?
                    (this.state.incentiveOfferObject.incentive_amount.toString()).split('.')[0] :
                    this.state.incentivePerUnitSold}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style={{ height: 60, flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
              }}
              >
                <Text style={styles.detailTextStyle}>
                *The incentives are applicable when the salesperson has reached the target
                </Text>
              </View>
            </View>
          </View>
        );
      case 'Offers':
        return (
          <View style={styles.tabCurrentViewStyle}>
            <View style={styles.textInputViewStyle}>
              <TextInput
                style={[styles.offerFieldContainer]}
                multiline
                onChangeText={text => {
                  this.offerTFOnChange(text);
                }
                }
                value={(this.state.incentiveOfferObject &&
                     Object.keys(this.state.incentiveOfferObject).length !== 0 &&
                      this.state.incentiveOfferObject.offer !== null) ?
                  this.state.incentiveOfferObject.offer : 'No Offer'}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        );
      default:
        return (
          <View style={{ height: 100 }} />
        );
    }
  }

  getTabData = () => (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      {
        this.state.tabLayoutData.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={this.changeTabColor(tab.id)}
            onPress={() => this.onTabPress(tab)}
          >
            <Text style={this.changeTextColor(tab.id)}>{tab.name}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
  callToast(msg) {
    this.setState({
      toastMessage: msg
    });
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 350
      }
    ).start(this.closeToast());
  }

  closeToast() {
    setTimeout(() => {
      Animated.timing(
        this.animatedValue,
        {
          toValue: -70,
          duration: 350
        }
      ).start();
    }, 2000);
  }

  displayStocksBasedOnColorView=() => {
    const { currentVariantColorList } = this.state;
    return (
      currentVariantColorList.map((currentStock, index) => (
        <View
          style={{
            height: 60, flexDirection: 'row'
          }}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        >
          <View style={{
            flex: 1, flexDirection: 'row', margin: 20, justifyContent: 'flex-start'
          }}
          >
            <Text style={styles.detailTextStyle}>{currentStock.color}</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput
              style={styles.fieldContainer}
              keyboardType="numeric"
              onChangeText={text => {
                this.unitsAvailableTFOnChange(text, index);
              }
              }
              value={(currentVariantColorList[index].dealer_inventories.length !== 0) ?
                currentVariantColorList[index].dealer_inventories[0].stock_available.toString() : '0'
              }
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      ))
    );
  }

  unitsAvailableTFOnChange=(value, index) => {
    const { currentVariantColorList, currentlySelectedVehicle } = this.state;
    if (currentVariantColorList[index].dealer_inventories.length > 0) {
      currentVariantColorList[index].dealer_inventories[0].stock_available = value;
    } else {
      const currentObj = {
        stock_available: value,
        dealer_manager_id: currentUserId,
        dealer_id: currentDealerId,
        variant_colours_id: currentVariantColorList[index].id,
        variant_id: currentlySelectedVehicle.variant_id,
        vehicle_id: currentlySelectedVehicle.id
      };
      currentVariantColorList[index].dealer_inventories.push(currentObj);
    }
    this.setState({
      currentVariantColorList
    });
  }

  testRideUnitAvailableOnChange = value => {
    const { incentiveOfferObject, currentlySelectedVehicle } = this.state;
    if (incentiveOfferObject &&
       Object.keys(incentiveOfferObject).length !== 0 &&
       ('test_ride_vehicle' in this.state.incentiveOfferObject)) {
      this.setState({
        incentiveOfferObject: {
          ...incentiveOfferObject,
          test_ride_vehicle: value
        }
      });
    } else if (incentiveOfferObject &&
      Object.keys(incentiveOfferObject).length !== 0) {
      this.state.incentiveOfferObject.test_ride_vehicle = value;
      this.setState({
        incentiveOfferObject: this.state.incentiveOfferObject
      });
    } else {
      const currentObj = {
        test_ride_vehicle: value,
        user_id: currentUserId,
        dealer_id: currentDealerId,
        vehicle_id: currentlySelectedVehicle.id,
      };
      this.setState({
        incentiveOfferObject: {
          ...currentObj
        }
      });
    }
  }

  testRidesPerSlotOnChange = value => {
    const { incentiveOfferObject, currentlySelectedVehicle } = this.state;
    if (incentiveOfferObject &&
       Object.keys(incentiveOfferObject).length !== 0 &&
        ('slots_per_vechile' in this.state.incentiveOfferObject)) {
      this.setState({
        incentiveOfferObject: {
          ...incentiveOfferObject,
          slots_per_vechile: value
        }
      });
    } else if (incentiveOfferObject &&
      Object.keys(incentiveOfferObject).length !== 0) {
      this.state.incentiveOfferObject.slots_per_vechile = value;
      this.setState({
        incentiveOfferObject: this.state.incentiveOfferObject
      });
    } else {
      const currentObj = {
        slots_per_vechile: value,
        user_id: currentUserId,
        dealer_id: currentDealerId,
        vehicle_id: currentlySelectedVehicle.id,
      };
      this.setState({
        incentiveOfferObject: {
          ...currentObj
        }
      });
    }
  }

  IncentivePerUnitOnChange = value => {
    const { incentiveOfferObject } = this.state;
    if (incentiveOfferObject &&
      Object.keys(incentiveOfferObject).length !== 0 &&
       ('incentive_amount' in this.state.incentiveOfferObject)) {
      this.setState({
        incentiveOfferObject: {
          ...incentiveOfferObject,
          incentive_amount: value
        }
      });
    } else {
      const currentObj = {
        incentive_amount: value,
        user_id: currentUserId,
        dealer_id: currentDealerId,
        vehicle_id: this.state.currentlySelectedVehicle.id,
      };
      this.setState({
        incentiveOfferObject: {
          ...currentObj
        }
      });
    }
  }

  offerTFOnChange = value => {
    const { incentiveOfferObject } = this.state;
    if (incentiveOfferObject && Object.keys(incentiveOfferObject).length !== 0) {
      this.setState({
        incentiveOfferObject: {
          ...incentiveOfferObject,
          offer: value
        }
      });
    } else {
      const currentObj = {
        offer: value,
        user_id: currentUserId,
        dealer_id: currentDealerId,
        vehicle_id: this.state.currentlySelectedVehicle.id,
      };
      this.setState({
        incentiveOfferObject: {
          ...currentObj
        }
      });
    }
  }

  updateBtnAction=() => {
    priceData = {
      ex_showroom_price: this.state.exshowroomPrice,
      rto_charges: this.state.rtoAndOthersPrice,
      insurance: this.state.insurancePrice,
      dealer_id: currentDealerId,
      variant_id: this.state.currentlySelectedVehicle.variant_id,
      vehicle_id: this.state.currentlySelectedVehicle.id,
      onroad_price: (parseInt((this.state.exshowroomPrice.length !== 0 ? this.state.exshowroomPrice : 0), 10) +
      parseInt((this.state.rtoAndOthersPrice.length !== 0 ? this.state.rtoAndOthersPrice : 0), 10) +
      parseInt((this.state.insurancePrice.length !== 0 ? this.state.insurancePrice : 0), 10) +
      parseInt((this.state.accessoriesPrice.length !== 0 ? this.state.accessoriesPrice : 0), 10)).toString(),
    };
    if (this.props.variantPriceDetails !== null) {
      priceData.id = this.props.variantPriceDetails.id;
    }
    switch (this.state.selectedType) {
      case 'Price':
        this.props.updateInventoryPriceDetails(priceData)
          .then(() => {
            // To use toast message
            // this.callToast('Updated successfully!');
            this.setModalVisible(!this.state.modalVisible);
          }).catch(error => {
            console.log(error);
            // To use toast message
            // this.callToast('Update failed!');
          });
        break;
      case 'Units Available':
        {
          const stockArrayList = this.state.currentVariantColorList.map(currentStock => {
            let stockArray = {};
            if (currentStock.dealer_inventories.length > 0) {
              stockArray = {
                ...currentStock.dealer_inventories[0],
              };
            }
            return stockArray;
          });

          const newStockArray = stockArrayList.filter(value => Object.keys(value).length !== 0);
          this.props.updateStockDetails(newStockArray)
            .then(() => {
              // this.setModalVisible(!this.state.modalVisible);
              this.callToast('Updated successfully!');
            }).catch(error => {
              console.log(error);
              this.callToast('Update failed!');
            });
        }
        return 2;
      default:
        this.props.updateIncentiveOfferDetails(this.state.incentiveOfferObject)
          .then(() => {
            // this.setModalVisible(!this.state.modalVisible);
            this.callToast('Updated successfully!');
          }).catch(error => {
            console.log(error);
            this.callToast('Update failed!');
          });
        return 1;
    }
  }

  changeTabColor = id => {
    if (this.state.tabPosition === id) {
      return myLeadHeaderStyles.tabSelectedStyle;
    }
    return myLeadHeaderStyles.tabStyle;
  }

  changeTextColor = id => {
    if (this.state.tabPosition === id) {
      return myLeadHeaderStyles.tabSelectedTextStyle;
    }
    return myLeadHeaderStyles.tabTextStyle;
  }
  searchProduct = (param, value) => this.searchVehicle(value)
    .then(res => {
      this.setState({
        // searchVal: value,
        // inventoryListMain: res,
      });
    }).catch(() => {
      this.setState({
        // searchVal: value,
        // inventoryListMain: null
      });
    });

  searchVehicle = value => new Promise((resolve, reject) => {
    const obj = this.state.inventoryListCopy.filter(o => o.name.toLowerCase().includes(value.toLowerCase()));
    if (obj) {
      resolve(obj);
    } else {
      reject(new Error('error'));
    }
  })

  /**
 * Add Button functionality yet to be added
 */
  OnAddBtntap = () => {
  }

  /**
 * Done Button functionality yet to be added
 */
  doneBtnTap = () => {
  }

  _keyExtractor = item => item.id

  renderItem = item => (
    <View style={styles.FlatListCellStyle}>
      <View style={styles.flatListCellViewStyles}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}
          >
          <Image
            source={{ uri: item.image_url }}
            style={{
              height: 40, width: 40, resizeMode: 'center', backgroundColor: 'white', marginLeft: 15
            }}
            />
          <TouchableOpacity
            >
            <Text style={[styles.flatListHeaderViewTextStyle, {
              fontSize: 14,
              fontFamily: fonts.sourceSansProSemiBold,
              textAlign: 'left',
            }]}
              >
              {item.name}
            </Text>
            <Text
              style={[styles.flatListHeaderViewTextStyle, {
                fontSize: 14,
                fontFamily: fonts.sourceSansProRegular,
                textAlign: 'left',
                width: 100
              }]}
              ellipsizeMode="tail"
              numberOfLines={1}
              >
              {item.variant_name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListHeaderTitleViewStyle}>
          <TouchableOpacity
            >
            <Text
              style={[styles.flatListHeaderViewTextStyle, { fontSize: 12 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
              >
              {
                    item.price === null &&
                '0'
                  }
              {
                    item.price !== null &&
                (item.price).split('.')[0]
                  }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListHeaderTitleViewStyle}>
          <TouchableOpacity
            >
            <Text
              style={[styles.flatListHeaderViewTextStyle, { fontSize: 12 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
              >
              {
                    item.stock_available === null &&
                '0'
                  }
              {
                    item.stock_available !== null &&
                item.stock_available
                  }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListHeaderTitleViewStyle}>
          <TouchableOpacity
            >
            <Text
              style={[styles.flatListHeaderViewTextStyle, { fontSize: 12 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
              >
              {
                    item.test_ride_vehicle === null &&
                '0'
                  }
              {
                  item.test_ride_vehicle !== null &&
                  item.test_ride_vehicle
                }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListHeaderTitleViewStyle}>
          <TouchableOpacity
            >
            <Text
              style={[styles.flatListHeaderViewTextStyle, { fontSize: 12 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
              >
              {
                  item.incentive_amount === null &&
                'No incentive'
                  }
              {
                    item.incentive_amount !== null &&
                (item.incentive_amount).split('.')[0]
                }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListHeaderTitleViewStyle}>
          <TouchableOpacity
            >
            <Text
              style={[styles.flatListHeaderViewTextStyle, { fontSize: 12 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
              >
              {
                  item.offer === null &&
                'No Offer'
                }
              {
                  item.offer !== null &&
                item.offer
                }
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatListHeaderTitleViewStyle}>
          <TouchableOpacity
            onPress={() => this.onTap('Edit', item)}
            // onPress={() => this.callToast('Updated successfully!')}
            >
            <View style={{
              borderColor: '#EF7432',
              borderWidth: 1,
              width: 50,
              margin: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}
              >
              <Text style={styles.flatlistTextEntryView}>
                Edit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  render() {
    const { currentlySelectedVehicle } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <AppHeader navigation={this.props.navigation} />
        <Loader loading={this.props.loading} />
        <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}
        >
          <View style={styles.modalMainContainer}>
            <ScrollView style={styles.bikeInfoView}>
              <Image
                source={
                  { uri: currentlySelectedVehicle.image_url }
                }
                style={{
                  height: 150, resizeMode: 'center', backgroundColor: 'white', padding: 10
                }}
              />
              <View style={{
                flexDirection: 'column', height: 40, alignItems: 'flex-start', justifyContent: 'center'
              }}
              >
                <Text style={{
                  marginLeft: 30,
                  fontSize: 16,
                  fontFamily: fonts.sourceSansProSemiBold,
                  flex: 4,
                  color: '#454545',
                }}
                >
                  {currentlySelectedVehicle.name}
                </Text>
                <Text
                  style={[styles.flatListHeaderViewTextStyle, {
                    fontSize: 14,
                    fontFamily: fonts.sourceSansProRegular,
                    textAlign: 'left',
                    marginLeft: 20,
                  }]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
              >
                  {currentlySelectedVehicle.variant_name}
                </Text>
              </View>
              <View style={styles.specificationViewStyle}>
                <Text style={styles.specheadertextStyle}>
                       Price
                </Text>
                <Text style={styles.specsDetailTextStyle}>
                  {
                    currentlySelectedVehicle === null &&
                '0'
                  }
                  {
                    (currentlySelectedVehicle &&
                      Object.keys(currentlySelectedVehicle).length !== 0 &&
                      ('price' in currentlySelectedVehicle) &&
                      currentlySelectedVehicle.price !== null) ?
                      (currentlySelectedVehicle.price.toString()).split('.')[0] :
                      '0'
                  }
                </Text>
              </View>
              <View style={styles.specificationViewStyle}>
                <Text style={styles.specheadertextStyle}>
                       Units Available
                </Text>
                <Text style={styles.specsDetailTextStyle}>
                  {
                    currentlySelectedVehicle === null &&
                '0'
                  }
                  {
                    (currentlySelectedVehicle &&
                      Object.keys(currentlySelectedVehicle).length !== 0 &&
                      ('stock_available' in currentlySelectedVehicle) &&
                      currentlySelectedVehicle.stock_available !== null) ?
                      (currentlySelectedVehicle.stock_available.toString()).split('.')[0] :
                      '0'
                  }
                </Text>
              </View>
              <View style={styles.specificationViewStyle}>
                <Text style={styles.specheadertextStyle}>
                       Test Ride Vehicle Available
                </Text>
                <Text style={styles.specsDetailTextStyle}>
                  {
                    currentlySelectedVehicle === null &&
                '0'
                  }
                  {
                    (currentlySelectedVehicle &&
                      Object.keys(currentlySelectedVehicle).length !== 0 &&
                      ('test_ride_vehicle' in currentlySelectedVehicle) &&
                      currentlySelectedVehicle.test_ride_vehicle !== null) ?
                      (currentlySelectedVehicle.test_ride_vehicle.toString()).split('.')[0] :
                      '0'
                  }
                </Text>
              </View>
              <View style={styles.specificationViewStyle}>
                <Text style={styles.specheadertextStyle}>
                       Incentive per unit sold
                </Text>
                <Text style={styles.specsDetailTextStyle}>
                  {
                    currentlySelectedVehicle === null &&
                '0'
                  }
                  {
                    (currentlySelectedVehicle &&
                      Object.keys(currentlySelectedVehicle).length !== 0 &&
                      ('incentive_amount' in currentlySelectedVehicle) &&
                      currentlySelectedVehicle.incentive_amount !== null) ?
                      (currentlySelectedVehicle.incentive_amount.toString()).split('.')[0] :
                      '0'
                  }
                </Text>
              </View>
              <View style={styles.specificationViewStyle}>
                <Text style={styles.specheadertextStyle}>
                       Offers
                </Text>
                <Text style={styles.specsDetailTextStyle}>
                  {
                    this.state.currentlySelectedVehicle.offer === null &&
                  'No offer'
                  }
                  {
                    this.state.currentlySelectedVehicle.offer !== null &&
                    this.state.currentlySelectedVehicle.offer
                  }
                </Text>
              </View>
            </ScrollView>
            <ScrollView style={styles.rightTabView}>
              <View style={{
                flex: 7, margin: 20, marginTop: 50, backgroundColor: 'white'
              }}
              >
                <View style={{ flexDirection: 'row', margin: 20 }}>
                  {this.getTabData()}
                </View>
                <View style={{ height: 400, justifyContent: 'space-between' }}>
                  <ScrollView>
                    {this.getCurrentView()}
                  </ScrollView>
                  <View style={{
                    alignSelf: 'flex-end', paddingRight: 20, paddingBottom: 20
                  }}
                  >
                    <GradientButtonLarge
                      style={styles.updateBtnStyle}
                      title="UPDATE"
                      handleSubmit={() => this.updateBtnAction()}
                    />
                  </View>
                </View>

              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                right: 0,
                top: 0,
                alignItems: 'center',
                backgroundColor: '#f26537'
              }}
              onPress={() => {
                this.setState({
                  tabPosition: 1,
                  selectedType: 'Price'
                });
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Image
                style={{ resizeMode: 'center', flex: 1 }}
                source={Close}
              />
            </TouchableOpacity>
          </View>
        </Modal>
        {/* <View style={{ flex: 1, backgroundColor: 'red' }} /> */}
        <View style={{ flex: 9, backgroundColor: 'white', flexDirection: 'row' }}>
          {/* <View style={{ flex: 1, backgroundColor: 'brown' }} /> */}
          <View style={{ flex: 9, backgroundColor: 'white' }} >
            {/* <View style={{ flex: 15, backgroundColor: 'green' }}> */}
            <View style={[styles.overViewStyles]}>
              <Text style={{
                color: '#4a4a4a', fontSize: 12, fontWeight: 'bold', marginLeft: 20, marginTop: 20
              }}
              >
          Overview - Yesterday,15 Mar 2018
              </Text>
              <View style={[styles.expandableTileContainer, { marginLeft: 20, marginTop: 10 }]}>
                {/* <ExpandableTile data={this.state.expandableTileData} /> */}
                <SpringView
                  duration={500}
                  springValue={0.1}
                  style={styles.springView}>
                  <GradientCountTile
                    id={0}
                    colors={['#34cad4', '#34aff9']}
                    tileCount={4}
                    tileText="Units Sold"
                    style={{ flex: 1, justifyContent: 'center', borderRadius: 5 }}
                    countStyle={{ fontSize: 22, alignSelf: 'center' }}
                    textStyle={{ fontSize: 15, fontWeight: '400' }}
                    />
                </SpringView>
                <SpringView
                  duration={500}
                  springValue={0.1}
                  style={styles.springView}>
                  <GradientCountTile
                    id={0}
                    colors={['#c578fa', '#9775fb']}
                    tileCount={4}
                    tileText="Test Rides Booked"
                    style={{ flex: 1, justifyContent: 'center', borderRadius: 5 }}
                    countStyle={{ fontSize: 22, alignSelf: 'center' }}
                    textStyle={{ fontSize: 15, fontWeight: '400' }}
                    />
                </SpringView>
              </View>
            </View>
            {/* </View> */}
            <View style={{ flex: 85, backgroundColor: 'white' }} >
              {/* <View>
                <TextInput
                  inlineImageLeft="search_products"
                  inlineImagePadding={5}
                  placeholder="Search for the product"
                  style={styles.searchBoxStyle}
                  underlineColorAndroid="transparent"
                  value={this.state.searchVal}
                  selectionColor="black"// "white"
                  placeholderTextColor="black"// "white"
                  onChangeText={searchVal => this.searchProduct('search', searchVal)}
          />
              </View> */}
              <View style={styles.flatListContainerStyle}>
                <View >
                  <View style={styles.flatListHeaderViewStyles} >
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]}>
              Product
                      </Text>
                    </View>
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]}>
              Price
                      </Text>
                    </View>
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]}>
              Units Available
                      </Text>
                    </View>
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]}>
              Test Ride Vehicle Available
                      </Text>
                    </View>
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]}>
              Incentive Per Unit Sold
                      </Text>
                    </View>
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]}>
              Active Offers
                      </Text>
                    </View>
                    <View style={styles.flatListHeaderTitleViewStyle}>
                      <Text style={[styles.flatListHeaderViewTextStyle, { color: 'white' }]} />
                    </View>
                  </View >
                  <View style={[styles.itemSeparatorStyle, { marginHorizontal: 0 }]} />
                  <View>
                    <FlatList
                      style={styles.flatListViewStyles}
                      keyExtractor={item => item.id}
                      data={this.props.inventoryList}
                      // data={this.state.inventoryListMain}
                      renderItem={({ item }) => this.renderItem(item)}
                      extraData={this.state}
                      ListHeaderComponent={this.renderHeader}
                      ItemSeparatorComponent={() => (
                        <View style={[styles.itemSeparatorStyle]} />
                      )}
                      scrollEnabled
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Animated.View style={[styles.toastView, {
          transform: [{ translateY: this.animatedValue }],
          // zIndex: 999
        }]}>
          <Text style={styles.toastTextStyle}>
            {this.state.toastMessage}
            {/* Hello from Toast! */}
          </Text>
        </Animated.View>
      </View>
    );
  }
}

export default UpdateInventoryScreen;
