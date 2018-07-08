import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Picker,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createOffer,
  deleteOffer,
  updateProformaAccessories,
  updateProformaColor,
  getProformaInvoice,
  getVehicleDetails } from '../../redux/actions/PriceBreakdown/actionCreators';
import styles from './bikePriceStyles';
import { BookTestRideButton } from '../../components/button/Button';
import UserInput from '../../components/userInput/UserInput';
import closeIcon from '../../assets/images/ic_close_white.png';
import offerTickIcon from '../../assets/images/ic_offer_applied.png';
import deleteIcon from '../../assets/images/ic_delete.png';
import backIcon from '../../assets/images/ic_back.png';
import editIcon from '../../assets/images/edit.png';
import saveIcon from '../../assets/images/ic_save.png';
import offerIcon from '../../assets/images/ic_offer.png';
import selectedCb from '../../assets/images/ic_selected.png';
import unselectedCb from '../../assets/images/ic_unselected.png';
import storage from '../../helpers/AsyncStorage';
import Loader from '../../components/loader/Loader';

@connect(state => ({
  createOfferResponse: state.priceBreakdown.createOfferResponse,
  deleteOfferResponse: state.priceBreakdown.deleteOfferResponse,
  accessoriesResponse: state.priceBreakdown.accessoriesResponse,
  updateResponse: state.priceBreakdown.updateResponse,
  proformaResponse: state.priceBreakdown.proformaResponse,
  vehicleResponse: state.priceBreakdown.vehicleResponse,
  loading: state.priceBreakdown.loading

}), {
  createOffer,
  deleteOffer,
  updateProformaAccessories,
  updateProformaColor,
  getProformaInvoice,
  getVehicleDetails
})
class BikePriceDetails extends Component {
  static propTypes = {
    createOffer: PropTypes.func.isRequired,
    deleteOffer: PropTypes.func.isRequired,
    updateProformaAccessories: PropTypes.func.isRequired,
    getVehicleDetails: PropTypes.func.isRequired,
    updateProformaColor: PropTypes.func.isRequired,
    getProformaInvoice: PropTypes.func.isRequired,
    proformaResponse: PropTypes.object,
    createOfferResponse: PropTypes.object,
    deleteOfferResponse: PropTypes.object,
    updateResponse: PropTypes.object,
    vehicleResponse: PropTypes.object,
    accessoriesResponse: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired
  }

  static defaultProps = {
    proformaResponse: {},
    createOfferResponse: {},
    deleteOfferResponse: {},
    updateResponse: {},
    vehicleResponse: {},
    accessoriesResponse: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshList: false,
      modalVisible: false,
      offerValue: '',
      variantIndex: 0,
      variantValue: '',
      colorIndex: 0,
      totalAccessoryPrice: 0,
      isAccessory: false,
      priceBreakdownData: {},
      bikeDetails: {},
      totalOfferAmount: 0
    };
  }
  componentWillMount() {
    let priceBreakdown;
    const leadId = this.props.navigation.state.params.leadDetail.lead_id;
    const leadDetailId = this.props.navigation.state.params.leadDetail.id;
    this.props.getProformaInvoice(leadId, leadDetailId)
      .then(() => {
        priceBreakdown = this.props.proformaResponse;
        return this.props.getVehicleDetails(priceBreakdown.proformaInvoice.vehicle_id);
      }).then(() => {
        const variantId = priceBreakdown.proformaInvoice.variant_id;
        const colorId = priceBreakdown.proformaInvoice.variant_colour_id;
        let proformaVariantIndex = 0;
        let proformaColorIndex = 0;
        let proformaVariantValue = '';
        this.props.vehicleResponse.variants.forEach((variant, index) => {
          if (variant.id === variantId) {
            proformaVariantIndex = index;
            proformaVariantValue = variant.name;
          }
          variant.colors.forEach((color, colorIndex) => {
            if (color.id === colorId) {
              proformaColorIndex = colorIndex;
            }
          });
        });
        this.setState({
          priceBreakdownData: priceBreakdown,
          totalOfferAmount:
            this.getTotalOfferAmount(priceBreakdown.proformaInvoice.proforma_invoice_offer),
          bikeDetails: this.props.vehicleResponse,
          variantIndex: proformaVariantIndex,
          variantValue: proformaVariantValue,
          colorIndex: proformaColorIndex,
          totalAccessoryPrice:
            this.getTotalAccessoryPrice(
              priceBreakdown.mandatoryAccessories,
              priceBreakdown.proformaInvoice.proforma_invoice_accessory
            )
        });
      }).catch(error => {
        console.log(error);
      });
  }

  onChangeText = (param, value) => {
    if (param === 'offer') {
      this.setState({ offerValue: value });
    }
  }

  onModalShow = () => {
    const { priceBreakdownData } = this.state;
    priceBreakdownData.nonMandatoryAccessories.map(item => {
      priceBreakdownData.proformaInvoice.proforma_invoice_accessory.forEach(invoiceItem => {
        if (invoiceItem.dealer_accessory.id === item.id) {
          item.isChecked = true;
        }
      });
      item.isChecked = item.isChecked || false;
      return item;
    });
    this.setState({
      priceBreakdownData,
      isAccessory: true,
      modalVisible: true
    });
  }

  getTotalAccessoryPrice = (mandatoryAccessories, nonMandatoryAccessories) => {
    let totalPrice = 0;
    if (mandatoryAccessories.length > 0) {
      mandatoryAccessories.forEach(item => {
        totalPrice += Number(item.price || 0);
      });
    }
    if (nonMandatoryAccessories.length > 0) {
      nonMandatoryAccessories.forEach(item1 => {
        totalPrice += Number(item1.dealer_accessory.price || 0);
      });
    }
    return totalPrice;
  }

  getTotalOfferAmount = offers => {
    let totalOffer = 0;
    if (offers.length > 0) {
      offers.forEach(item => {
        totalOffer += Number(item.amount);
      });
    }
    return totalOffer;
  }

  updateProformaInvoice = index => {
    let dealerID;
    const { bikeDetails, colorIndex, priceBreakdownData } = this.state;
    storage.getItem('currentUser')
      .then(id => {
        const { dealerId } = id;
        dealerID = dealerId;
        const colorData = {
          dealer_id: dealerID,
          vehicle_id: bikeDetails.id,
          variant_id: bikeDetails.variants[index].id,
          variant_colour_id: bikeDetails.variants[index].colors[colorIndex].id
        };
        this.props.updateProformaColor(priceBreakdownData.proformaInvoice.id, colorData)
          .then(() => {
            this.setState({
              variantIndex: index,
              colorIndex: 0,
              priceBreakdownData: this.props.updateResponse,
              totalOfferAmount:
                this.getTotalOfferAmount(this.props.updateResponse.proformaInvoice.proforma_invoice_offer)
            });
          }).catch(error => {
            console.log(error);
          });
      });
  }

  updateProformaInvoiceColor = index => {
    let dealerID;
    const {
      bikeDetails, priceBreakdownData, variantIndex
    } = this.state;
    storage.getItem('currentUser')
      .then(id => {
        const { dealerId } = id;
        dealerID = dealerId;

        const colorData = {
          dealer_id: dealerID,
          vehicle_id: bikeDetails.id,
          variant_id: bikeDetails.variants[variantIndex].id,
          variant_colour_id: bikeDetails.variants[variantIndex].colors[index].id
        };
        this.props.updateProformaColor(priceBreakdownData.proformaInvoice.id, colorData)
          .then(() => {
            this.setState({
              colorIndex: index,
              priceBreakdownData: this.props.updateResponse,
              totalOfferAmount:
                this.getTotalOfferAmount(this.props.updateResponse.proformaInvoice.proforma_invoice_offer)
            });
          }).catch(error => {
            console.log(error);
          });
      });
  }

  createBikeOffer = () => {
    const { priceBreakdownData } = this.state;
    if (priceBreakdownData.proformaInvoice.id) {
      const offerData = {
        amount: Number(this.state.offerValue),
        name: 'Test',
        type: 'Test',
        proforma_invoice_id: priceBreakdownData.proformaInvoice.id
      };
      this.props.createOffer(priceBreakdownData.proformaInvoice.id, offerData)
        .then(() => {
          this.setState({
            priceBreakdownData: this.props.createOfferResponse,
            totalOfferAmount:
              this.getTotalOfferAmount(this.props.createOfferResponse.proformaInvoice.proforma_invoice_offer),
            modalVisible: false
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  deleteBikeOffer = item => {
    this.props.deleteOffer(item.proforma_invoice_id, item.id)
      .then(() => {
        this.setState({
          priceBreakdownData: this.props.deleteOfferResponse,
          totalAccessoryPrice:
            this.getTotalAccessoryPrice(
              this.props.deleteOfferResponse.mandatoryAccessories,
              this.props.deleteOfferResponse.proformaInvoice.proforma_invoice_accessory
            ),
          totalOfferAmount:
            this.getTotalOfferAmount(this.props.deleteOfferResponse.proformaInvoice.proforma_invoice_offer)
        });
      }).catch(error => {
        console.log(error);
      });
  }

  updateProformaAccessories = () => {
    const { priceBreakdownData } = this.state;
    const accessories = [];
    if (priceBreakdownData.nonMandatoryAccessories.length > 0) {
      priceBreakdownData.nonMandatoryAccessories.forEach(item => {
        if (item.isChecked) {
          delete item.isChecked;
          accessories.push(item);
        }
      });
    }
    this.props.updateProformaAccessories(priceBreakdownData.proformaInvoice.id, accessories)
      .then(() => {
        this.setState({
          modalVisible: false,
          priceBreakdownData: this.props.accessoriesResponse,
          totalAccessoryPrice:
          this.getTotalAccessoryPrice(
            this.props.accessoriesResponse.mandatoryAccessories,
            this.props.accessoriesResponse.proformaInvoice.proforma_invoice_accessory
          )
        });
      }).catch(error => {
        console.log(error);
      });
  }

  savingPercentage = offerAmount => {
    const { priceBreakdownData } = this.state;
    const onRoadPrice = priceBreakdownData.proformaInvoice.vehicle_price.onroad_price;
    const savingPerc = (offerAmount / onRoadPrice) * 100;
    return (
      <Text style={styles.savingPercentageBold}> {savingPerc.toFixed(2)}%  </Text>
    );
  }

  _keyExtractor = item => item.id;

  renderItem = item => (
    <View style={styles.offerView}>
      <View style={styles.offerAppliedView}>
        <View style={styles.offerBackground}>
          <Image source={offerTickIcon} resizeMode="contain" />
          <Text style={styles.offerAppliedText}>1 Offer applied</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.offerTextStyle}>- {item.amount}</Text>
          <TouchableOpacity
            style={styles.deleteView}
            onPress={() => {
              this.deleteBikeOffer(item);
            }}
          >
            <Image source={deleteIcon} resizeMode="contain" />
            <Text style={styles.offerTextStyle}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.offerSavingText}>You are saving
        {this.savingPercentage(item.amount)}on the On-Road Price
      </Text>
      <View style={styles.line} />
    </View>
  )

  renderAccessoryItem = item => (
    <View style={styles.accessoryRowView}>
      <Text style={styles.accessoryNameText}>{item.name}</Text>
      <Text style={styles.accessoryPriceText}>{Number(item.price || 0)}</Text>
      <TouchableOpacity
        onPress={() => {
          item.isChecked = !item.isChecked;
          this.setState({
            refreshList: !this.state.refreshList
          });
        }}
        style={styles.checkBoxView}
      >
        {
          item.isChecked ?
            <Image source={selectedCb} resizeMode="contain" />
            :
            <Image source={unselectedCb} resizeMode="contain" />
        }
      </TouchableOpacity>
    </View>
  )

  render() {
    const {
      variantIndex, colorIndex, priceBreakdownData, totalAccessoryPrice, totalOfferAmount,
      bikeDetails
    } = this.state;
    return (
      <View style={styles.container}>
        <Loader loading={this.props.loading} />
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContentWrapper} />
          {
            this.state.isAccessory ?
              <View
                style={styles.accessoryModalContent}
              >
                <View style={styles.modalCloseView}>
                  <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                    <Image
                      source={closeIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.accessoryText}>Accessories</Text>
                  <View style={[styles.line]} />
                </View>
                <View style={styles.accessoriesView}>
                  <FlatList
                    keyExtractor={this._keyExtractor}
                    data={priceBreakdownData.nonMandatoryAccessories}
                    renderItem={({ item }) => this.renderAccessoryItem(item)}
                    extraData={this.state.refreshList}
                  />
                </View>
                <View style={styles.applyButtonStyle}>
                  <LinearGradient
                    colors={['#f79426', '#f16537']}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 1.0 }} >
                    <TouchableOpacity onPress={() => { this.updateProformaAccessories(); }}>
                      <Text style={{
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        color: 'white',
                        fontFamily: 'SourceSansPro-Bold',
                        fontSize: 14
                      }}>APPLY
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
              :
              <KeyboardAwareScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="always"
              >
                <View style={styles.modalCloseView}>
                  <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                    <Image
                      source={closeIcon}
                      style={styles.closeIconDimensions}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <UserInput
                  numberOfLines={1}
                  placeholder="Offer Amount"
                  param="offer"
                  keyboardType="numeric"
                  onChange={this.onChangeText}
                  value={this.state.offerValue}
                  containerStyle={styles.offerInputStyle}
                />
                <LinearGradient
                  colors={['#f79426', '#f16537']}
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }} >
                  <TouchableOpacity onPress={() => { this.createBikeOffer(); }}>
                    <Text style={{
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      color: 'white',
                      fontFamily: 'SourceSansPro-Bold',
                      fontSize: 14
                    }}>APPLY
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </KeyboardAwareScrollView>
          }
        </Modal>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => { this.props.navigation.dispatch(NavigationActions.back()); }}>
            <Image source={backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.headerNameView}>
            {
              (priceBreakdownData.proformaInvoice && priceBreakdownData.proformaInvoice.lead) ?
                (priceBreakdownData.proformaInvoice.lead.name) ?
                  <Text style={styles.nameText}>{priceBreakdownData.proformaInvoice.lead.name}</Text>
                  :
                  <Text style={styles.nameText}>N/A</Text>
                :
                null
            }
            <Text style={[styles.nameText, { marginLeft: 12 }]}>
              {
              (priceBreakdownData.proformaInvoice && priceBreakdownData.proformaInvoice.lead) ?
                (priceBreakdownData.proformaInvoice.lead.mobile_number) ?
                  <Text style={styles.nameText}>{priceBreakdownData.proformaInvoice.lead.mobile_number}</Text>
                  :
                  <Text style={styles.nameText}>N/A</Text>
                :
                null
            }
            </Text>
          </View>
          <View style={styles.headerBikeValueStyle}>
            {
              (bikeDetails.manufacturer) ?
                (bikeDetails.manufacturer && bikeDetails.name && bikeDetails.manufacturer.display_name) ?
                  <Text style={styles.headerBikeValueTextStyle}>
                    {bikeDetails.manufacturer.display_name} {bikeDetails.name}
                  </Text>
                  :
                  <Text style={styles.headerBikeValueTextStyle}>N/A</Text>
                :
                null
            }
          </View>
          <View style={styles.headerBikeValueStyle}>
            <Text style={styles.headerBikeValueTextStyle}>{
              (priceBreakdownData.proformaInvoice && priceBreakdownData.proformaInvoice.vehicle_price) ?
                (priceBreakdownData.proformaInvoice.vehicle_price.onroad_price) ?
                  <Text style={styles.nameText}>
                  Rs. {Number(priceBreakdownData.proformaInvoice.vehicle_price.onroad_price)}
                  </Text>
                  :
                  <Text style={styles.nameText}>N/A</Text>
                :
                null
            }
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerBikeValueStyle}
            onPress={() => { this.setState({ modalVisible: true, offerValue: '', isAccessory: false }); }}
            activeOpacity={0.8}
          >
            <Image source={offerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.bookTestRideView}>
            <Text style={styles.bookTestRideText}>Book Test Ride</Text>
          </View>
          <View style={styles.saveView}>
            <Image source={saveIcon} resizeMode="contain" />
          </View>
        </View>
        {/* Loan finance view will be added later */}
        {/* <View style={styles.loanSplitView}>
            <View style={styles.loanSplitLabelView}>
              <Text style={styles.loanSplitLabel}>Financier</Text>
              <Text style={styles.loanSplitLabel}>Loan</Text>
              <Text style={styles.loanSplitLabel}>Interest</Text>
              <Text style={styles.loanSplitLabel}>Downpayments</Text>
              <Text style={styles.loanSplitLabel}>EMI</Text>
              <Text style={styles.loanSplitLabel}>Tenure</Text>
              <Text style={styles.loanSplitLabel}>Advance EMI</Text>
              <Text style={styles.loanSplitLabel} />
            </View>
            <View style={styles.loanSplitValueView}>
              <Text style={styles.loanSplitValue}>HDFC</Text>
              <Text style={styles.loanSplitValue}>Rs. 109000</Text>
              <Text style={styles.loanSplitValue}>11%</Text>
              <Text style={styles.loanSplitValue}>Rs. 5000</Text>
              <Text style={styles.loanSplitValue}>Rs. 6000</Text>
              <Text style={styles.loanSplitValue}>10 months</Text>
              <Text style={styles.loanSplitValue}>Rs. 12000/2 months</Text>
              <Image source={editIcon} style={{ flex: 1 }} resizeMode="contain" />
            </View>
          </View> */}
        <View style={styles.mainContainer}>
          <View style={[styles.bikeContainer]}>
            <View style={styles.bikeHeader}>
              <View style={{ flex: 1 }}>
                {
                (bikeDetails.manufacturer) ?
                  (bikeDetails.manufacturer.display_name) ?
                    <Text style={styles.bikeNameText}>{bikeDetails.manufacturer.display_name.toUpperCase()}</Text>
                    :
                    <Text style={styles.bikeNameText}>N/A</Text>
                  : null
                }
                {
                  <Text style={styles.bikeModelText}>{(bikeDetails.name) ? bikeDetails.name : ''}</Text>
                }
              </View>
              <View style={styles.bikeSpecsView}>
                <View>
                  <View style={styles.bikeSpecValueView}>
                    {
                        (
                          bikeDetails.variants
                        ) ?
                          (bikeDetails.variants.length > 0 &&
                        bikeDetails.variants[variantIndex].displacement) ?
                          <Text style={styles.bikeSpecsBoldText}>
                            {bikeDetails.variants[variantIndex].displacement}
                          </Text>
                            :
                          <Text style={styles.bikeSpecsBoldText}>N/A</Text>
                          :
                          null
                      }
                    <Text style={styles.bikeSpecLightText}>
                  cc
                    </Text>
                  </View>
                  <Text style={styles.specLabelText}>Engine</Text>
                </View>
                <View>
                  <View style={styles.bikeSpecValueView}>
                    {
                      (bikeDetails.variants &&
                        bikeDetails.variants.length > 0 &&
                        bikeDetails.variants[variantIndex].fuel_efficiency_overall
                        ) ?
                        (bikeDetails.variants.length > 0 &&
                        bikeDetails.variants[variantIndex].fuel_efficiency_overall) ?
                          <Text style={styles.bikeSpecsBoldText}>
                            {bikeDetails.variants[variantIndex].fuel_efficiency_overall}
                          </Text>
                          :
                          <Text style={styles.bikeSpecsBoldText}>N/A</Text>
                        :
                        null
                      }
                    <Text style={styles.bikeSpecLightText}>
                  kmpl
                    </Text>
                  </View>
                  <Text style={styles.specLabelText}>Mileage</Text>
                </View>
                <View>
                  <View style={styles.bikeSpecValueView}>
                    {
                      (bikeDetails.variants) ?
                        (bikeDetails.variants.length > 0 &&
                          bikeDetails.variants[variantIndex].overall_weight) ?
                            <Text style={styles.bikeSpecsBoldText}>
                              {Number(bikeDetails.variants[variantIndex].overall_weight)}
                            </Text>
                          :
                            <Text style={styles.bikeSpecsBoldText}>N/A</Text>
                        :
                        null
                      }
                    <Text style={styles.bikeSpecLightText}>
                  kg
                    </Text>
                  </View>
                  <Text style={styles.specLabelText}>Weight</Text>
                </View>
              </View>
            </View>
            {
                  (bikeDetails.variants &&
                    bikeDetails.variants.length > 0
                    && bikeDetails.variants[variantIndex].colors[colorIndex].image_url
                  ) ?
                    <Image
                      source={{ uri: bikeDetails.variants[variantIndex].colors[colorIndex].image_url }}
                      resizeMode="contain"
                      style={styles.bikeImageStyle}
                    />
                    :
                    null
                }
            <View style={styles.bikePriceView}>
              <View style={styles.variantDropdownView}>
                <Picker
                  selectedValue={this.state.variantValue}
                  mode="dropdown"
                  style={{ height: 20 }}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({
                      variantValue: itemValue,
                    });
                    this.updateProformaInvoice(itemIndex);
                  }}
                >
                  {
                      (bikeDetails.variants && bikeDetails.variants.length > 0) ?
                        bikeDetails.variants.map(item => (
                          <Picker.Item label={item.name} value={item.name} key={item.id} />
                        ))
                        :
                        null
                      }
                </Picker>
              </View>
              <View style={styles.availableColorView}>
                <Text style={styles.availableColorText}>Available Colors</Text>
                <ScrollView horizontal contentContainerStyle={styles.colorView}>
                  {
                        (bikeDetails.variants &&
                          bikeDetails.variants.length > 0 &&
                          bikeDetails.variants[variantIndex] &&
                          bikeDetails.variants[variantIndex].colors.length > 0
                        ) ?
                          bikeDetails.variants[variantIndex].colors.map((color, index) => (
                            <TouchableOpacity
                              key={color}
                              style={{ marginRight: 10 }}
                              onPress={() => {
                                this.updateProformaInvoiceColor(index);
                              }}
                            >
                              {
                                (color.color_codes.length > 0) ?
                                  <View style={(index === colorIndex) ?
                                    styles.colorSelectedView : styles.colorNormalView}>
                                    {
                                      color.color_codes.map(colorCodes => (
                                        <View style={{ flex: 1, backgroundColor: `${colorCodes}` }} />
                                      ))
                                    }
                                  </View>
                                  :
                                  null
                              }
                            </TouchableOpacity>
                          ))
                          :
                          null
                      }
                </ScrollView>
              </View>
              <View style={styles.onRoadPriceView}>
                <Text style={styles.bikePriceLabel}>On-road price</Text>
                {
                      (bikeDetails.variants) ?
                        (bikeDetails.variants.length > 0 && bikeDetails.variants[variantIndex].prices
                          && bikeDetails.variants[variantIndex].prices.onroad_price) ?

                            <Text style={styles.bikePrice}>
                            &#8377; {Number(bikeDetails.variants[variantIndex].prices.onroad_price)}
                            </Text>
                          :
                            <Text style={styles.bikePrice}>N/A</Text>
                        :
                        null
                    }
              </View>
            </View>
          </View>
          <View style={styles.breakdownContainer} >
            <Text style={styles.priceBreakdownText}>Price Breakdown</Text>
            <View style={styles.line} />
            <ScrollView>
              <View style={{ marginHorizontal: 14, marginVertical: 10 }}>
                <View style={styles.breakdownLabelView}>
                  <Text style={styles.priceText}>Ex-Showroom</Text>
                  {
                    (
                      priceBreakdownData.proformaInvoice &&
                      priceBreakdownData.proformaInvoice.vehicle_price
                    ) ?
                      (priceBreakdownData.proformaInvoice.vehicle_price.ex_showroom_price) ?
                        <Text style={styles.priceText}>
                    &#8377; {Number(priceBreakdownData.proformaInvoice.vehicle_price.ex_showroom_price)}
                        </Text>
                        :
                        <Text style={styles.priceText}>
                    N/A
                        </Text>
                      :
                      null
                  }
                </View>
                <View style={styles.breakdownLabelView}>
                  <Text style={styles.priceText}>RTO & Others</Text>
                  {
                    (
                      priceBreakdownData.proformaInvoice &&
                      priceBreakdownData.proformaInvoice.vehicle_price
                    ) ?
                      (priceBreakdownData.proformaInvoice.vehicle_price.rto_charges) ?
                        <Text style={styles.priceText}>
                    &#8377; {Number(priceBreakdownData.proformaInvoice.vehicle_price.rto_charges)}
                        </Text>
                        :
                        <Text style={styles.priceText}>
                    N/A
                        </Text>
                      :
                      null
                  }
                </View>
                <View style={styles.breakdownLabelView}>
                  <Text style={styles.priceText}>Insurance</Text>
                  {
                    (
                      priceBreakdownData.proformaInvoice &&
                      priceBreakdownData.proformaInvoice.vehicle_price
                    ) ?
                      (priceBreakdownData.proformaInvoice.vehicle_price.insurance) ?
                        <Text style={styles.priceText}>
                    &#8377; {Number(priceBreakdownData.proformaInvoice.vehicle_price.insurance)}
                        </Text>
                        :
                        <Text style={styles.priceText}>
                    N/A
                        </Text>
                      :
                      null
                  }
                </View>
                <View style={styles.breakdownLabelView}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.priceText}>Accessories</Text>
                    <TouchableOpacity onPress={() => { this.onModalShow(); }}>
                      <Image source={editIcon} style={{ marginLeft: 10 }} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.priceText}>&#8377; {this.state.totalAccessoryPrice}</Text>
                </View>
                <View style={{ marginLeft: 5 }}>
                  {
                   (priceBreakdownData.mandatoryAccessories &&
                    priceBreakdownData.mandatoryAccessories.length > 0) ?
                     priceBreakdownData.mandatoryAccessories.map(item => (
                       <View
                         key={item.id}
                         style={styles.accessoryTextView} >
                         <Text style={styles.priceText}>- {item.name}</Text>
                         <Text style={styles.priceText}>&#8377; {Number(item.price)}</Text>
                       </View>
                     ))
                     :
                     null
                  }
                  {
                    (priceBreakdownData.proformaInvoice &&
                      priceBreakdownData.proformaInvoice.proforma_invoice_accessory.length > 0
                    ) ?
                      priceBreakdownData.proformaInvoice.proforma_invoice_accessory.map(item => (
                        <View style={styles.accessoryTextView} >
                          <Text style={styles.priceText}>- {item.dealer_accessory.name}</Text>
                          <Text style={styles.priceText}>&#8377; {Number(item.dealer_accessory.price)}</Text>
                        </View>
                      ))
                      :
                      null
                  }
                </View>
              </View>
              <View style={styles.line} />
              <View style={[styles.onRoadView, { marginLeft: 12 }]}>
                <Text style={styles.onRoadPriceLabel}>On Road Price</Text>
                {
                    (
                      priceBreakdownData.proformaInvoice &&
                      priceBreakdownData.proformaInvoice.vehicle_price
                    ) ?
                      (priceBreakdownData.proformaInvoice.vehicle_price.onroad_price) ?
                        <Text style={[styles.onRoadPrice, { marginRight: 12 }]}>
                    &#8377; {Number(priceBreakdownData.proformaInvoice.vehicle_price.onroad_price)}
                        </Text>
                        :
                        <Text style={[styles.onRoadPrice, { marginRight: 12 }]}>
                    N/A
                        </Text>
                      :
                      null
                  }
              </View>
              <View style={styles.line} />
              <View>
                <FlatList
                  keyExtractor={this._keyExtractor}
                  data={(priceBreakdownData.proformaInvoice &&
                  priceBreakdownData.proformaInvoice.proforma_invoice_offer.length > 0)
                    ? priceBreakdownData.proformaInvoice.proforma_invoice_offer : []}
                  renderItem={({ item }) => this.renderItem(item)}
                  extraData={this.state.refreshList}
                />
              </View>
              <View style={styles.amountPayableView}>
                <Text style={styles.onRoadPriceLabel}>Amount Payable</Text>
                {
                    (
                      priceBreakdownData.proformaInvoice &&
                      priceBreakdownData.proformaInvoice.vehicle_price
                    ) ?
                      (priceBreakdownData.proformaInvoice.vehicle_price.onroad_price) ?
                        <Text style={styles.onRoadPrice}>
                    &#8377; {(Number(priceBreakdownData.proformaInvoice.vehicle_price.onroad_price)
                      + Number(totalAccessoryPrice)) - Number(totalOfferAmount)}
                        </Text>
                        :
                        <Text style={styles.onRoadPrice}>
                    N/A
                        </Text>
                      :
                      null
                  }
              </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
              <Text style={styles.helpFinanceText}>NEED HELP WITH FINANCING?</Text>
              <View style={{ marginTop: 10 }}>
                <BookTestRideButton title="FINANCE OPTIONS" handleSubmit={() => {}} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default BikePriceDetails;
