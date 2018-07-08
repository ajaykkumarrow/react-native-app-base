import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Picker,
  Dimensions
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import storage from '../../helpers/AsyncStorage';
import tick from '../../assets/images/tick.png';
import cancel from '../../assets/images/cancel.png';
import filter from '../../assets/images/filter.png';
import saveIcon from '../../assets/images/save_icon.png';
import fonts from '../../theme/fonts';
import { getManufacturerId, getVehicles } from '../../redux/actions/filteredVehicles/actionCreators';
import { BookTestRideButton } from '../../components/button/Button';
import Loader from '../../components/loader/Loader';

@connect(
  state => ({
    manufacturer_id: state.filteredVehicles.manufacturer_id,
    vehicleList: state.filteredVehicles.vehicleList,
    loading: state.filteredVehicles.loading
  }),
  {
    getManufacturerId,
    getVehicles
  }
)

export default class FilteredProductsScreen extends Component {
  static propTypes = {
    getManufacturerId: PropTypes.func.isRequired,
    manufacturer_id: PropTypes.string,
    getVehicles: PropTypes.func.isRequired,
    vehicleList: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.boolean
  }

  static defaultProps = {
    manufacturer_id: null,
    vehicleList: [],
    loading: false
  }

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: null,
      name: '',
      mobile: '',
      searchVal: '',
      sliderVal: -375,
      toVal: 0,
      bikeSelected: true,
      defaultVal: new Animated.Value(-375),
      currentDealer: null,
      filterBudget: [
        {
          id: 1,
          name: 'all',
          active: false
        },
        {
          id: 2,
          name: '< Rs 70,000',
          active: false
        },
        {
          id: 3,
          name: 'Rs 70,000 - Rs 1,00,000',
          active: false
        },
        {
          id: 4,
          name: '> Rs 1 lakh',
          active: false
        }
      ],
      filterCapacity: [
        {
          id: 1,
          name: '< 150 cc',
          active: false
        },
        {
          id: 2,
          name: '150cc - 250cc',
          active: false
        },
        {
          id: 3,
          name: '> 250 cc',
          active: false
        }
      ],
      sortData: [{
        id: 1,
        name: 'Mileage',
        value: 'fuel_efficiency_overall'
      },
      {
        id: 2,
        name: 'Power',
        value: 'bhp'
      },
      {
        id: 3,
        name: 'Price',
        value: 'price'
      }
      ],
      filterData: {},
      currentSortName: 'Mileage',
      variantSelected: null,
      vehicleList: [],
      initialLoad: true,
      availableColors: []
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { navigation } = nextProps;
    if (navigation && navigation.state && navigation.state.params && navigation.state.params.lead
       && navigation.state.params.filterData) {
      const { filterData, lead } = nextProps.navigation.state.params;
      return {
        filterData,
        lead,
        name: lead.name,
        mobile: lead.mobile_number
      };
    }

    return null;
  }

  componentDidMount() {
    let dealerId;
    storage.getItem('currentUser').then(response => {
      if (response !== undefined) {
        dealerId = response.user.user_type_id;
        this.state.currentDealer = dealerId;
        return this.props.getManufacturerId(dealerId)
          .then(() => {
            if (this.state.filterData) {
              const budgetRanges = this.state.filterData.budget.split('-');
              budgetRanges.map((range, index) => {
                budgetRanges[index] = parseInt(range, 10);
              });
              if (budgetRanges[0] >= 0 && budgetRanges[0] < 100000 && budgetRanges[1] > 100000) {
                this.state.filterData.budget = '';
                this.state.filterData.showBudget = 'all';
                this.state.filterBudget[0].active = true;
              } else if (budgetRanges[0] >= 0 && budgetRanges[1] <= 70000) {
                this.state.filterData.budget = '0-70000';
                this.state.filterData.showBudget = '< Rs 70,000';
                this.state.filterBudget[1].active = true;
              } else if (budgetRanges[0] >= 70000 && budgetRanges[1] <= 100000) {
                this.state.filterData.budget = '70000-100000';
                this.state.filterData.showBudget = 'Rs 70,000 - Rs 1,00,000';
                this.state.filterBudget[2].active = true;
              } else if (budgetRanges[0] >= 100000 && budgetRanges[1] >= 1000000) {
                this.state.filterData.budget = '100000-100000000';
                this.state.filterData.showBudget = '> Rs 1 lakh';
                this.state.filterBudget[3].active = true;
              }
            }
            return this.props.getVehicles(dealerId, this.props.manufacturer_id, this.state.filterData);
          }).then(() => {
            this.props.vehicleList.map(eachVehicle => eachVehicle.variants.map((eachVariant, index) => {
              if (index === 0) {
                eachVariant.activeVariant = true;
                if (eachVariant.prices !== undefined) {
                  eachVehicle.priceToShow = eachVariant.prices.onroad_price;
                }
              } else {
                eachVariant.activeVariant = false;
              }
              eachVariant.colors.map((eachColor, ind) => {
                if (index === 0 && ind === 0) {
                  eachVehicle.imageToShow = eachColor.image_url;
                  eachColor.activeColor = true;
                } else if (ind === 0) {
                  eachColor.activeColor = true;
                } else {
                  eachColor.activeColor = false;
                }
                return eachColor;
              });
              return eachVariant;
            }));
            this.setState({
              filterBudget: this.state.filterBudget,
              filterData: this.state.filterData,
              vehicleList: this.props.vehicleList,
              renderList: !this.state.renderList,
            });
          }).catch(err => {
            console.log('err', err);
          });
      }
      return new Error('Unable to get Dealer Information, Please login Again.');
    });
  }

  getActiveFilter = (data, selectedData, toUpdate) => {
    data.map(eachData => {
      if (eachData.id === selectedData.id) {
        eachData.active = true;
      } else {
        eachData.active = false;
      }
      return data;
    });
    this.state[toUpdate] = data;
    this.setState({
      filterBudget: this.state.filterBudget,
      filterCapacity: this.state.filterCapacity
    });
  }

  getSelectedVariant = (itemValue, item, variantIndex, vehicleIndex) => {
    const vehicleData = this.state.vehicleList;
    vehicleData[vehicleIndex].selectedVariant = itemValue;
    item.variants.map(eachVariant => {
      if (eachVariant.name === itemValue) {
        eachVariant.activeVariant = true;
        item.imageToShow = eachVariant.colors[0].image_url;
        item.priceToShow = eachVariant.prices.onroad_price;
      } else {
        eachVariant.activeVariant = false;
      }
      return eachVariant;
    });
    this.setState({
      renderList: !this.state.renderList,
      vehicleList: vehicleData
    });
  }

  getVehiclesBasedOnSort = (itemValue, itemIndex) => {
    if (itemValue === 'Price') {
      this.state.filterData.orderBy = 'asc';
    } else {
      this.state.filterData.orderBy = 'desc';
    }
    this.state.filterData.orderField = this.state.sortData[itemIndex].value;
    this.state.currentSortName = this.state.sortData[itemIndex].name;
    this.getFilteredListData(this.state.filterData);
  }

  getFilteredData = () => {
    if (this.state.filterData.type === '0') {
      this.state.filterData.type = '0';
      this.state.filterData.typeName = 'bike';
    } else if (this.state.filterData.type === '1') {
      this.state.filterData.type = '1';
      this.state.filterData.typeName = 'scotter';
    }
    this.state.filterBudget.map(eachFilterBudget => {
      if (eachFilterBudget.active === true) {
        switch (eachFilterBudget.name) {
          case 'all':
            this.state.filterData.budget = '';
            this.state.filterData.showBudget = 'all';
            break;
          case '< Rs 70,000':
            this.state.filterData.budget = '0-70000';
            this.state.filterData.showBudget = '< Rs 70,000';
            break;
          case 'Rs 70,000 - Rs 1,00,000':
            this.state.filterData.budget = '70000-100000';
            this.state.filterData.showBudget = 'Rs 70,000 - Rs 1,00,000';
            break;
          case '> Rs 1 lakh':
            this.state.filterData.budget = '100000-100000000';
            this.state.filterData.showBudget = '> Rs 1 lakh';
            break;
          default:
            this.state.filterData.budget = '';
            this.state.filterData.showBudget = 'all';
            break;
        }
      }
      return this.state.filterData;
    });
    this.state.filterCapacity.map(eachCapacity => {
      if (eachCapacity.active === true) {
        switch (eachCapacity.name) {
          case '< 150 cc':
            this.state.filterData.engine = '0-150';
            this.state.filterData.showCapacity = '< 150 cc';
            break;
          case '150cc - 250cc':
            this.state.filterData.engine = '150-250';
            this.state.filterData.showCapacity = '150cc - 250cc';
            break;
          case '> 250 cc':
            this.state.filterData.engine = '250-100000';
            this.state.filterData.showCapacity = '> 250 cc';
            break;
          default:
            this.state.filterData.engine = '0-150';
            this.state.filterData.showCapacity = '< 150 cc';
            break;
        }
      }
      return this.state.filterData;
    });
    // Hit the API
    this.props.getVehicles(this.state.currentDealer, this.props.manufacturer_id, this.state.filterData).then(() => {
      this.props.vehicleList.map(eachVehicle => eachVehicle.variants.map((eachVariant, index) => {
        if (index === 0) {
          eachVariant.activeVariant = true;
          if (eachVariant.prices !== undefined) {
            eachVehicle.priceToShow = eachVariant.prices.onroad_price;
          }
        } else {
          eachVariant.activeVariant = false;
        }
        eachVariant.colors.map((eachColor, ind) => {
          if (index === 0 && ind === 0) {
            eachVehicle.imageToShow = eachColor.image_url;
            eachColor.activeColor = true;
          } else if (ind === 0) {
            eachColor.activeColor = true;
          } else {
            eachColor.activeColor = false;
          }
          return eachColor;
        });
        return eachVariant;
      }));
      this.setState({
        vehicleList: this.props.vehicleList,
        renderList: !this.state.renderList
      }, () => {
        this.slide();
      });
    });
  }

  getFilteredListData = filterData => {
    this.props.getVehicles(this.state.currentDealer, this.props.manufacturer_id, filterData).then(() => {
      this.props.vehicleList.map(eachVehicle => eachVehicle.variants.map((eachVariant, index) => {
        if (index === 0) {
          eachVariant.activeVariant = true;
          if (eachVariant.prices !== undefined) {
            eachVehicle.priceToShow = eachVariant.prices.onroad_price;
          }
        } else {
          eachVariant.activeVariant = false;
        }
        eachVariant.colors.map((eachColor, ind) => {
          if (index === 0 && ind === 0) {
            eachVehicle.imageToShow = eachColor.image_url;
            eachColor.activeColor = true;
          } else if (ind === 0) {
            eachColor.activeColor = true;
          } else {
            eachColor.activeColor = false;
          }
          return eachColor;
        });
        return eachVariant;
      }));
      this.setState({
        vehicleList: this.props.vehicleList,
        renderList: !this.state.renderList
      });
    });
  }

  slide = () => {
    if (this.state.toVal === -375) {
      this.state.toVal = 0;
      this.state.defaultVal = new Animated.Value(-375);
    } else if (this.state.initialLoad) {
      this.state.toVal = 0;
      this.state.defaultVal = new Animated.Value(-375);
      this.state.initialLoad = false;
    } else {
      this.state.toVal = -375;
      this.state.defaultVal = new Animated.Value(0);
    }
    this.setState({
      defaultVal: this.state.defaultVal,
      toVal: this.state.toVal
    }, () => {
      Animated.timing(this.state.defaultVal, {
        toValue: this.state.toVal,
      }).start();
    });
  };

  openFilter = () => {
    this.slide();
  }

  cancelType = type => {
    switch (type) {
      case 'Type':
        this.state.filterData.type = '';
        this.state.filterData.typeName = null;
        this.getFilteredListData(this.state.filterData);
        break;
      case 'Budget':
        this.state.filterData.budget = '';
        this.state.filterData.showBudget = null;
        this.state.filterBudget.map(eachBudget => {
          eachBudget.active = false;
          return eachBudget;
        });
        this.getFilteredListData(this.state.filterData);
        break;
      case 'Capacity':
        this.state.filterData.engine = '';
        this.state.filterData.showCapacity = null;
        this.state.filterCapacity.map(eachBudget => {
          eachBudget.active = false;
          return eachBudget;
        });
        this.getFilteredListData(this.state.filterData);
        break;
      case 'all':
        this.state.filterData.type = '';
        this.state.filterData.engine = '';
        this.state.filterData.budget = '';
        this.state.filterData.showBudget = null;
        this.state.filterData.showCapacity = null;
        this.state.filterData.typeName = null;
        this.state.filterCapacity.map(eachCapacity => {
          eachCapacity.active = false;
          return eachCapacity;
        });
        this.state.filterBudget.map(eachBudget => {
          eachBudget.active = false;
          return eachBudget;
        });
        this.getFilteredListData(this.state.filterData);
        break;
      default:
        this.getFilteredListData(this.state.filterData);
        break;
    }
  }

  resetFilter = () => {
    this.state.filterData.type = '';
    this.state.filterData.engine = '';
    this.state.filterData.budget = '';
    this.state.filterData.showBudget = null;
    this.state.filterData.showCapacity = null;
    this.state.filterData.typeName = null;
    this.state.filterCapacity.map(eachCapacity => {
      eachCapacity.active = false;
      return eachCapacity;
    });
    this.state.filterBudget.map(eachBudget => {
      eachBudget.active = false;
      return eachBudget;
    });
    this.setState({
      vehicleList: this.props.vehicleList
    });
  }

  showColors = item => (
    <TouchableOpacity
      style={{
        height: 30,
        width: 30,
        marginRight: 10
      }}
      onPress={() => this.selectedColor(item.id, item)}
    >
      {
      item.color_codes.map(eachColorCode =>
        !item.activeColor ?
          (<View
            key={eachColorCode}
            style={{
              flex: 1,
              borderColor: 'black',
              borderWidth: 1,
              backgroundColor: eachColorCode
            }}
          />) :
          (<View
            key={eachColorCode}
            style={{
              flex: 1,
              borderColor: '#f79426',
              borderWidth: 3,
              backgroundColor: eachColorCode
            }}
          />))
      }
    </TouchableOpacity>
  )

  showVariants = variantItem => {
    let colorsToSend;
    if (variantItem.activeVariant === true) {
      colorsToSend = variantItem.colors;
      return (
        <FlatList
          data={colorsToSend}
          renderItem={({ item, index }) => this.showColors(item, index)}
          keyExtractor={() => variantItem.id}
          extraData={this.state.renderList}
          horizontal
        />
      );
    }
  }

  searchProduct = (param, value) => this.searchVehicle(value)
    .then(() => {
      this.setState({
        searchVal: value
      });
    }).catch(() => {
      this.setState({
        searchVal: value,
      });
    });

    selectedColor = id => {
      const vehicleData = this.state.vehicleList;
      vehicleData.map(eachVehicle => {
        eachVehicle.variants.map(eachVariant => {
          eachVariant.colors.map(eachColor => {
            if (eachColor.id === id) {
              eachVehicle.imageToShow = eachColor.image_url;
              eachColor.activeColor = true;
            } else {
              eachColor.activeColor = false;
            }
            return eachColor;
          });
          return eachVariant;
        });
        return eachVehicle;
      });
      this.setState({
        renderList: !this.state.renderList,
        vehicleList: vehicleData
      });
      // vehicleData[vehicleIndex].selectedVariant = itemValue;
    }

    goToProductDetail = item => {
      const { navigate } = this.props.navigation;
      const { id } = this.state.lead;
      const vehicleId = item.id;
      navigate('ProductDetailScreen', { id, vehicleId });
    }

    showCard = (item, cardIndex) => (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => { this.goToProductDetail(item); }}
        style={{
          width: Dimensions.get('screen').width * 0.859,
          alignSelf: 'center',
          backgroundColor: 'white',
          paddingVertical: 30,
          marginHorizontal: Dimensions.get('screen').width * 0.0705,
        }}
      >
        {/* start of the top view bike and text */}
        <View style={{ flexDirection: 'row' }}>
          {/* start of bike image */}
          <View style={{ flex: 1, backgroundColor: 'white', padding: 5 }}>
            {!item.imageToShow ?
              <View>
                <Text>N/A</Text>
              </View>
              :
              <Image
                source={{
                  uri: item.imageToShow
                }}
                resizeMode="contain"
                style={{ height: 250, width: 400 }}
              />
          }
          </View>
          {/* end of bike image */}
          {/* start of text */}
          <View style={{
            flex: 1,
            paddingTop: 20,
            padding: 20,
            backgroundColor: 'white'
          }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
            >
              <View>
                <Text style={{
                  fontFamily: 'SourceSansPro-SemiBold',
                  fontSize: 14
                }}
                >Suzuki
                </Text>
                <Text style={{
                  fontFamily: 'SourceSansPro-Bold',
                  fontSize: 22
                }}
                >{item.name}
                </Text>
              </View>
              {/* dropdown here */}
              <View style={{
                marginRight: 10,
                borderBottomColor: 'black',
                borderWidth: 1,
                justifyContent: 'center'
              }}
              >
                {/* May be useful in future */}
                {/* <Picker
                  selectedValue={item.selectedVariant ? item.selectedVariant : item.variants[0]}
                  mode="dropdown"
                  enabled={item.variants.length > 0}
                  style={{
                    height: 35,
                    width: 120
                  }}
                  onValueChange={(itemValue, index) => this.getSelectedVariant(itemValue, item, index, cardIndex)}
                >
                  {
                  item.variants.length > 0 && item.variants.map(eachVariant => (
                    <Picker.Item key={eachVariant.id} label={eachVariant.name} value={eachVariant.name} />
                  ))
                }
                </Picker> */}
              </View>
              {/* end of dropdown here */}
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: 20
            }}
            >
              <View style={{ paddingRight: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{
                    fontFamily: 'PTSans-Bold',
                    fontSize: 16,
                    color: '#373636'
                  }}>{item.displacement ? item.displacement : 'N/A'}
                  </Text>
                  <Text style={{
                    color: '#867d7d',
                    fontFamily: 'LucidaGrande',
                    fontSize: 12,
                    marginTop: 4
                  }}
                  > cc
                  </Text>
                </View>
                <Text style={{
                  fontFamily: 'SourceSansPro-Regular',
                  fontSize: 13,
                  color: '#302e2e'
                }}>Engine
                </Text>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{
                    fontFamily: 'PTSans-Bold',
                    fontSize: 16,
                    color: '#373636'
                  }}>{item.fuel_efficiency_overall ? item.fuel_efficiency_overall : 'N/A'}
                  </Text>
                  <Text style={{
                    color: '#867d7d',
                    fontFamily: 'LucidaGrande',
                    fontSize: 12,
                    marginTop: 4
                  }}
                  > kmpl
                  </Text>
                </View>
                <Text style={{
                  fontFamily: 'SourceSansPro-Regular',
                  fontSize: 13,
                  color: '#302e2e'
                }}>Mileage
                </Text>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{
                    fontFamily: 'PTSans-Bold',
                    fontSize: 16,
                    color: '#373636'
                  }}>{item.overall_weight ? item.overall_weight : 'N/A'}
                  </Text>
                  <Text style={{
                    color: '#867d7d',
                    fontFamily: 'LucidaGrande',
                    fontSize: 12,
                    marginTop: 4
                  }}
                  > kg
                  </Text>
                </View>
                <Text style={{
                  fontFamily: 'SourceSansPro-Regular',
                  fontSize: 13,
                  color: '#302e2e'
                }}>weight
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text
                numberOfLines={5}
                style={{
                  paddingVertical: 10,
                  fontSize: 12,
                  color: '#8b8b8b',
                  fontFamily: 'SourceSansPro-Regular'
                }}
              >{item.description}
              </Text>
              {/* It might be asked in future */}
              <View style={{ marginVertical: 10 }}>
                {/* <Text style={{
                  color: '#2c2c2c',
                  fontSize: 15,
                  fontFamily: 'SourceSansPro-SemiBold'
                }}
                >Available Colors
                </Text>
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                  <FlatList
                    data={item.variants}
                    renderItem={() => this.showVariants(item, cardIndex)}
                    keyExtractor={() => item.id}
                    extraData={this.state.renderList}
                  />
                </View> */}
              </View>
            </View>
          </View>
          {/* end of text */}
        </View>
        {/* end of the top view bike and text */}
        {/* start of the bottom view price and button */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingBottom: 10
        }}
        >
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: 10
          }}
          >
            <View style={{
              marginRight: 20
            }}
            >
              <Text style={{
                color: '#a4a4a4',
                fontFamily: 'SourceSansPro-Regular',
                fontSize: 11
              }}
              >On-Road Price
              </Text>
              <Text style={{
                color: '#34323b',
                fontFamily: 'SourceSansPro-Bold',
                fontSize: 21
              }}
              >{
              !item.priceToShow ?
                'N/A'
                :
                item.priceToShow
              }
              </Text>
            </View>
            <View style={{
              backgroundColor: '#6aec5130',
              flexDirection: 'row',
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              marginLeft: 20,
            }}
            >
              <Image source={tick} resizeMode="contain" />
              <Text style={{
                fontSize: 10,
                fontFamily: fonts.sourceSansProRegular,
                color: '#454545',
                marginLeft: 2,
              }}
              >Emi Options Available
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <BookTestRideButton
                // disabled={this.state.disableUpdateButton}
              handleSubmit={() => { console.log('To be Implemented'); }}
              title="BOOK TEST RIDE"
            />
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderColor: '#f79426',
                borderWidth: 1,
                height: 35,
                width: 120,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 15,
                borderRadius: 5
              }}
              onPress={() => { console.log('To be Implemented'); }}
            >
              <Text style={{
                fontSize: 12,
                fontFamily: 'SourceSansPro-SemiBold',
                color: '#f79426'
              }}
              >ADD TO COMPARE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* end of the bottom view price and button */}
      </TouchableOpacity>)

    render() {
      return (
        <View>
          <Loader loading={this.props.loading} />
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#2B2928',
            zIndex: 2,
            elevation: 2
          }}
          >
            <View>
              <TouchableOpacity onPress={() => { this.props.navigation.dispatch(NavigationActions.back()); }} >
                <Image
                  source={require('../../assets/images/close_black.png')}
              />
              </TouchableOpacity>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1
            }}
            >
              {/* Start of left side of the header */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
              >
                <Text style={{
                  color: 'white',
                  paddingHorizontal: 10,
                  fontSize: 14,
                  fontFamily: fonts.sourceSansProRegular
                }}
                >{this.state.name}
                </Text>
                <Text style={
                  {
                    color: '#ffffff',
                    fontSize: 14,
                    paddingHorizontal: 10,
                    fontFamily: fonts.sourceSansProRegular
                  }
                }
                >{this.state.mobile}
                </Text>
              </View>
              {/* End of left side of the header */}
              {/* Start of right side of the header */}
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
              >
                {/* <View>
                  <TextInput
                    inlineImageLeft="search_products"
                    inlineImagePadding={5}
                    placeholder="Search for product"
                    style={{
                      color: 'white',
                      width: 250
                    }}
                    underlineColorAndroid="transparent"
                    value={this.state.searchVal}
                    selectionColor="white"
                    placeholderTextColor="white"
                    onChangeText={searchVal => this.searchProduct('search', searchVal)}
                  />
                </View> */}
                <TouchableOpacity
                  onPress={this.openFilter}
                >
                  <Image
                    source={filter}
                    style={{ height: 47 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.openFilter}
                >
                  <Image
                    source={saveIcon}
                    style={{ height: 47 }}
                  />
                </TouchableOpacity>
              </View>
              {/* End of right side of the header */}
            </View>
          </View>
          <Animated.View
            style={[{ backgroundColor: 'white', zIndex: 1 }, {
              transform: [
                {
                  translateY: this.state.defaultVal
                }
              ]
            }, {
              alignSelf: 'center',
              marginLeft: 2,
              width: Dimensions.get('screen').width * 0.859,
              height: 375,
              elevation: 2,
              position: 'absolute',
              top: 49,
            }]}
          >
            <View style={{
              flex: 1
            }}
            >
              <View style={{
                paddingLeft: 40,
                paddingTop: 20,
              }}
              >
                <Text style={{
                  fontFamily: 'SourceSansPro-Bold',
                  fontSize: 15,
                  color: '#4a4a4a'
                }}
                >Filters
                </Text>
              </View>
              <View style={{
                paddingTop: 10,
                justifyContent: 'space-around',
                flexDirection: 'row'
              }}
              >
                <View>
                  <Text style={{
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 15,
                    color: '#4a4a4a',
                    paddingBottom: 20
                  }}
                  >Type
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={[{
                        backgroundColor: 'white',
                        paddingHorizontal: 40,
                        paddingVertical: 10,
                        elevation: 2
                      }, this.state.filterData.type === '0' ? {
                        borderColor: '#e14e0e',
                        borderWidth: 1
                      } :
                        null]}
                      onPress={() => {
                        this.state.filterData.type = '0';
                        this.setState({
                          filterData: this.state.filterData
                        });
                      }}
                    >
                      <Text style={[{
                        fontSize: 11,
                        fontFamily: 'SourceSansPro-SemiBold'
                      }, this.state.filterData.type === '0' ? {
                        color: '#e14e0e'
                      } : {
                        color: 'black'
                      }]}
                      >Bike
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[{
                        backgroundColor: 'white',
                        elevation: 2,
                        paddingHorizontal: 40,
                        marginLeft: 2,
                        paddingVertical: 10
                      }, this.state.filterData.type === '1' ? {
                        borderColor: '#e14e0e',
                        borderWidth: 1
                      } : null]}
                      onPress={() => {
                        this.state.filterData.type = '1';
                        this.setState({
                          filterData: this.state.filterData
                        });
                      }}
                    >
                      <Text style={[{
                        fontSize: 11,
                        fontFamily: 'SourceSansPro-SemiBold'
                      }, this.state.filterData.type === '1' ? {
                        color: '#e14e0e'
                      } : {
                        color: 'black'
                      }]}
                      >Scooter
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={{
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 15,
                    color: '#4a4a4a',
                    paddingBottom: 15
                  }}
                  >Budget
                  </Text>
                  <View style={{
                    backgroundColor: '#F4F4F4',
                    justifyContent: 'space-between',
                    paddingVertical: 10
                  }}
                  >
                    {
                    this.state.filterBudget.map(eachFilterBudget => (
                      <View
                        key={eachFilterBudget.id}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginVertical: 15
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.getActiveFilter(
                            this.state.filterBudget,
                            eachFilterBudget, 'filterBudget'
                          )}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            borderColor: '#ee4b40',
                            borderWidth: 1,
                            marginHorizontal: 10,
                            backgroundColor: '#F4F4F4',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          {
                            eachFilterBudget.active ?
                              <View style={{
                                width: 10,
                                height: 10,
                                borderRadius: 15,
                                borderColor: '#ee4b40',
                                borderWidth: 1,
                                marginHorizontal: 10,
                                backgroundColor: '#ee4b40',
                              }}
                              />
                              :
                              null
                        }
                        </TouchableOpacity>
                        <Text style={{
                          marginRight: 40,
                          fontFamily: 'SourceSansPro-Regular',
                          fontSize: 13
                        }}
                        >
                          {eachFilterBudget.name}
                        </Text>
                      </View>
                    ))
                  }
                  </View>
                </View>
                <View>
                  <Text style={{
                    fontFamily: 'SourceSansPro-Bold',
                    fontSize: 15,
                    color: '#4a4a4a',
                    paddingBottom: 15
                  }}
                  >Engine Capacity
                  </Text>
                  <View style={{
                    backgroundColor: '#F4F4F4',
                    justifyContent: 'space-between',
                    paddingVertical: 10
                  }}
                  >
                    {
                    this.state.filterCapacity.map(eachFilterCapacity => (
                      <View
                        key={eachFilterCapacity.id}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginVertical: 15
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.getActiveFilter(
                            this.state.filterCapacity,
                            eachFilterCapacity, 'filterCapacity'
                          )}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            borderColor: '#ee4b40',
                            borderWidth: 1,
                            marginHorizontal: 10,
                            backgroundColor: '#F4F4F4',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          { eachFilterCapacity.active ?
                            <View style={{
                              width: 10,
                              height: 10,
                              borderRadius: 15,
                              borderColor: '#ee4b40',
                              borderWidth: 1,
                              marginHorizontal: 10,
                              backgroundColor: '#ee4b40',
                            }}
                            />
                            :
                            null
                        }
                        </TouchableOpacity>
                        <Text style={{
                          marginRight: 55,
                          fontFamily: 'SourceSansPro-Regular',
                          fontSize: 13
                        }}
                        >
                          {eachFilterCapacity.name}
                        </Text>
                      </View>
                    ))
                  }
                  </View>
                </View>
              </View>
              <View style={{
                justifyContent: 'flex-end',
                padding: 20,
                flexDirection: 'row',
                alignItems: 'flex-end'
              }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    paddingBottom: 7,
                    marginRight: 10
                  }}
                  onPress={() => this.resetFilter()}
                >
                  <Text style={{
                    color: '#7f7f7f',
                    borderBottomColor: '#7f7f7f',
                    borderBottomWidth: 1,
                  }}
                  >
                Reset Filters
                  </Text>
                </TouchableOpacity>
                <BookTestRideButton
                // disabled={this.state.disableUpdateButton}
                  handleSubmit={() => this.getFilteredData()}
                  title="Apply Filter"
                />
              </View>
            </View>
          </Animated.View>
          {/* Main View */}
          <View style={{ justifyContent: 'space-around' }}>
            <View style={{
              elevation: 1,
              alignSelf: 'center',
              height: 65,
              backgroundColor: 'white',
              width: Dimensions.get('screen').width * 0.859,
              marginLeft: 2,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
            >
              <View style={{
                flexDirection: 'row',
                marginHorizontal: 20
              }}
              >
                {this.state.filterData.typeName ?
                  <View style={{
                    flexDirection: 'row',
                    marginRight: 20,
                    borderColor: '#ee4b40',
                    borderWidth: 1,
                    padding: 5,
                    backgroundColor: '#fff7ed',
                    borderRadius: 5,
                  }}
                  >
                    <Text style={{
                      paddingHorizontal: 5,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 12,
                      color: '#191919'
                    }}
                    >Type:
                    </Text>
                    <Text style={{
                      paddingRight: 5,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 12,
                      color: '#191919'
                    }}
                    >{this.state.filterData.typeName}
                    </Text>
                    <TouchableOpacity
                      style={{
                        paddingRight: 5,
                        justifyContent: 'center'
                      }}
                      onPress={() => { this.cancelType('Type'); }}
                    >
                      <Image source={cancel} style={{ height: 10, width: 10 }} />
                    </TouchableOpacity>
                  </View>
                  :
                  null
            }
                {this.state.filterData.showBudget ?
                  <View style={{
                    flexDirection: 'row',
                    marginRight: 20,
                    borderColor: '#ee4b40',
                    borderWidth: 1,
                    padding: 5,
                    backgroundColor: '#fff7ed',
                    borderRadius: 5
                  }}
                  >
                    <Text style={{
                      paddingHorizontal: 5,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 12,
                      color: '#191919'
                    }}
                    >Budget:
                    </Text>
                    <Text style={{
                      paddingRight: 5,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 12,
                      color: '#191919'
                    }}
                    >{this.state.filterData.showBudget}
                    </Text>
                    <TouchableOpacity
                      style={{
                        paddingRight: 5,
                        justifyContent: 'center'
                      }}
                      onPress={() => { this.cancelType('Budget'); }}
                    >
                      <Image source={cancel} style={{ height: 10, width: 10 }} />
                    </TouchableOpacity>
                  </View>
                  :
                  null
            }
                {this.state.filterData.showCapacity ?
                  <View style={{
                    flexDirection: 'row',
                    marginRight: 20,
                    borderColor: '#ee4b40',
                    borderWidth: 1,
                    padding: 5,
                    backgroundColor: '#fff7ed',
                    borderRadius: 5
                  }}
                  >
                    <Text style={{
                      paddingHorizontal: 5,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 12,
                      color: '#191919'
                    }}
                    >Capacity:
                    </Text>
                    <Text style={{
                      paddingRight: 5,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 12,
                      color: '#191919'
                    }}
                    >{this.state.filterData.showCapacity}
                    </Text>
                    <TouchableOpacity
                      style={{
                        paddingRight: 5,
                        justifyContent: 'center'
                      }}
                      onPress={() => { this.cancelType('Capacity'); }}
                    >
                      <Image source={cancel} style={{ height: 10, width: 10 }} />
                    </TouchableOpacity>
                  </View>
                  :
                  null
            }
                {
                  (this.state.filterData.showCapacity ||
                    this.state.filterData.showBudget ||
                    this.state.filterData.typeName) ?
                      <TouchableOpacity onPress={() => { this.cancelType('all'); }}>
                        <Text style={{
                          marginTop: 4,
                          color: '#7f7f7f',
                          borderBottomColor: '#7f7f7f',
                          borderBottomWidth: 1
                        }}
                      >Clear All
                        </Text>
                      </TouchableOpacity>
                    :
                    null
                }
              </View>
              <View style={{
                borderWidth: 1,
                borderColor: 'black',
                padding: 5,
                marginRight: 10,
                width: 140,
                flexDirection: 'row'
              }}
              >
                <Text style={{ alignSelf: 'center' }}>
                  <Icon
                    name={
                    this.state.currentSortName === 'Price' ?
                      'sort-amount-asc'
                      :
                      'sort-amount-desc'
                  }
                    size={15}
                    color="red" />
                </Text>
                <Picker
                  selectedValue={this.state.currentSortName}
                  mode="dropdown"
                  // enabled={item.variants.length > 0}
                  style={{
                    width: 130,
                    height: 20
                  }}
                  onValueChange={(itemValue, itemIndex) => this.getVehiclesBasedOnSort(itemValue, itemIndex)}
                >
                  {
                  this.state.sortData.map(eachSortVal => (
                    <Picker.Item key={eachSortVal.id} label={eachSortVal.name} value={eachSortVal.name} />
                  ))
                }
                </Picker>
              </View>
            </View>
            <View style={{
              // marginLeft: Dimensions.get('screen').width * 0.0705,
              marginVertical: 15
            }}
            >
              {
            this.state.vehicleList.length !== 0 ?
              <FlatList
                data={this.state.vehicleList}
                renderItem={({ item, index }) => this.showCard(item, index)}
                keyExtractor={item => item.id}
                horizontal
                extraData={this.state.renderList}
              />
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={{
                  marginVertical: 50,
                  fontFamily: 'SourceSansPro-Bold',
                  fontSize: 22
                }}
                >
                  {this.props.loading ? '' : 'No Vehicles to show :('}
                </Text>
                {!this.props.loading &&
                <BookTestRideButton
                // disabled={this.state.disableUpdateButton}
                  handleSubmit={() => this.slide()}
                  title="Click to open Filter"
                  />
                }
              </View>
            }
            </View>
          </View>
        </View>
      );
    }
}
