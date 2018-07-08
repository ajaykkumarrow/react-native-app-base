import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Picker,
  Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import storage from '../../helpers/AsyncStorage';
import { BookTestRideButton } from '../../components/button/Button';
import UserInput from '../../components/userInput/UserInput';
import styles from './ChooseVehicleAccessoriesStyles';
import ContinueSectionScreen from '../../components/ContinueSection/ContinueSectionScreen';
import selectedImage from '../../assets/images/selected.png';
import unSelectedImage from '../../assets/images/unselected.png';
import closeModal from '../../assets/images/close_modal.png';
import Sort from '../../assets/images/sort.png';
import { getManufacturerId, getVehicles } from '../../redux/actions/GetVehicles/actionCreators';
import { getVehicleAccessories, saveVehicleAccessories } from '../../redux/actions/VehicleAccessories/actionCreators';
import Loader from '../../components/loader/Loader';

let accessToken;
let recievedDealerId;
let accessoriesCopy;

@connect(
  state => ({
    manufacturer_id: state.getVehicles.manufacturer_id,
    vehicleList: state.getVehicles.vehicleData,
    accessories: state.vehicleAccessories.accessories,
    savedAccessories: state.vehicleAccessories.savedAccessories,
    loading: state.vehicleAccessories.loading
  }),
  {
    getManufacturerId, getVehicles, getVehicleAccessories, saveVehicleAccessories
  }
)
export default class ChooseVehicleAccessories extends Component {
  static propTypes = {
    getManufacturerId: PropTypes.func.isRequired,
    getVehicles: PropTypes.func.isRequired,
    getVehicleAccessories: PropTypes.func.isRequired,
    saveVehicleAccessories: PropTypes.func.isRequired,
    // manufacturer_id: PropTypes.string,
    vehicleList: PropTypes.array,
    accessories: PropTypes.array,
    changeStep: PropTypes.func.isRequired,
    savedAccessories: PropTypes.array,
    loading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    // manufacturer_id: null,
    vehicleList: [],
    accessories: [],
    savedAccessories: []
  }

  constructor(props) {
    super(props);
    this.state = ({
      orderField: 'name',
      orderBy: 'ASC',
      renderList: false,
      vehicleList: [],
      activeVehicle: '',
      activeVehicleId: null,
      modalVisible: false,
      currentAccessoryToEdit: {},
      openModal: false,
      nameOrder: 'DESC',
      codeOrder: 'DESC',
      priceOrder: 'DESC',
      accessoriesToSend: [],
      disableUpdateButton: true,
      showError: false,
      accessoriesData: []
    });
  }

  componentWillMount() {
    const self = this;
    return self.getFromStorage('currentUser')
      .then(recievedToken => {
        const { token, dealerId } = recievedToken;
        accessToken = token;
        recievedDealerId = dealerId;
        return this.props.getManufacturerId(recievedDealerId);
      })
      .then(() => this.props.getVehicles(recievedDealerId))
      .then(() => {
        if (this.props.vehicleList.length > 0) {
          return this.getSelectedVehicleAccessories(this.props.vehicleList[6].id, recievedDealerId, accessToken);
        }
      })
      .then(() => {
        this.setState({
          vehicleList: this.props.vehicleList,
          activeVehicle: this.props.vehicleList[6].name,
          activeVehicleId: this.props.vehicleList[6].id,
          accessoriesData: this.props.accessories,
          disableUpdateButton: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onEditSubmission = item => {
    const position = this.state.accessoriesData.findIndex(eachData => eachData.id === item.id);
    this.state.accessoriesData[position] = item;
    if (this.state.accessoriesData[position].dealerAccessories && this.state.accessoriesData[position].dealerAccessories.length > 0) {
      this.state.accessoriesData[position].dealerAccessories[0].price = item.price;
    }
    if (accessoriesCopy[position].price !== this.state.accessoriesData[position].price) {
      this.state.disableUpdateButton = false;
    } else {
      this.state.disableUpdateButton = true;
    }
    return this.props.saveVehicleAccessories(recievedDealerId, this.state.accessoriesData[position].dealerAccessories)
      .then(() => {
        this.setState({
          disableUpdateButton: this.state.disableUpdateButton,
          renderList: !this.state.renderList,
          accessoriesData: this.state.accessoriesData,
          modalVisible: false
        });
      });
  }

  getSelectedVehicleAccessories = (vehicleId, dealerId, token, orderField, orderBy) =>
    new Promise((resolve, reject) => {
      const filterData = {
        vehicle_id: vehicleId,
        order_field: orderField !== undefined ? orderField : this.state.orderField,
        order_by: orderBy !== undefined ? orderBy : this.state.orderBy,
      };
      return this.props.getVehicleAccessories(dealerId, filterData)
        .then(() => {
          if (this.props.accessories.length > 0) {
            this.props.accessories.map(eachAccessory => {
              if (eachAccessory.dealerAccessories.length > 0) {
                eachAccessory.is_available = eachAccessory.dealerAccessories[0].is_available;
                eachAccessory.is_mandatory = eachAccessory.dealerAccessories[0].is_mandatory;
                eachAccessory.price = eachAccessory.dealerAccessories[0].price;
              }
              return eachAccessory;
            });
            accessoriesCopy = this.props.accessories.slice();
            resolve(this.props.accessories);
          } else if (this.props.accessories.length === 0) {
            resolve('No Accessories Found');
          } else {
            reject(new Error('Server Error'));
          }
        });
    });

  getAccessoriesForSelectedVehicle = (vehicleName, vehicleIndex) => {
    const vehicleId = this.state.vehicleList[vehicleIndex].id;
    return this.getSelectedVehicleAccessories(vehicleId, recievedDealerId, accessToken)
      .then(() => {
        this.setState({
          activeVehicle: vehicleName,
          activeVehicleId: vehicleId,
          accessoriesData: this.props.accessories
        });
      });
  };

  getFromStorage = id => new Promise((resolve, reject) => {
    storage.getJsonObject(id, value => {
      if (value !== undefined && value !== null) {
        resolve(value);
      } else {
        reject(new Error('storage is undefined'));
      }
    });
  });

  getAccessoryList = (localStateVariable, orderField, orderBy) => {
    this.getSelectedVehicleAccessories(this.state.activeVehicleId, recievedDealerId, accessToken, orderField, orderBy)
      .then(() => {
        this.state[localStateVariable] = orderBy;
        this.setState({
          accessoriesData: this.props.accessories
        });
      });
  }

  sortAccessory = param => {
    this.state.orderField = param;
    let orderBy;
    if (param === 'name') {
      orderBy = (this.state.nameOrder === 'DESC') ? 'ASC' : 'DESC';
      this.getAccessoryList('nameOrder', param, orderBy);
    } else if (param === 'item_code') {
      orderBy = this.state.codeOrder === 'DESC' ? 'ASC' : 'DESC';
      this.getAccessoryList('codeOrder', param, orderBy);
    } else if (param === 'price') {
      orderBy = this.state.priceOrder === 'DESC' ? 'ASC' : 'DESC';
      this.getAccessoryList('priceOrder', param, orderBy);
    }
  }

  updateParam = (item, param) => {
    const itemsIndex = this.state.accessoriesData.indexOf(item);
    if (itemsIndex !== -1) {
      this.state.accessoriesData[itemsIndex][param] = !this.state.accessoriesData[itemsIndex][param];
      if (accessoriesCopy[itemsIndex].dealerAccessories.length > 0) {
        this.state.accessoriesData[itemsIndex].dealerAccessories[0][param]
        =
        this.state.accessoriesData[itemsIndex][param];
        if (accessoriesCopy[itemsIndex].dealerAccessories[0][param]
          ===
          this.state.accessoriesData[itemsIndex].dealerAccessories[0][param]) {
          this.state.disableUpdateButton = false;
        }
      } else if (accessoriesCopy[itemsIndex].dealerAccessories.length === 0) {
        this.state.accessoriesData[itemsIndex].dealerAccessories = [];
        const temp = {};
        temp[param] = this.state.accessoriesData[itemsIndex][param];
        this.state.accessoriesData[itemsIndex].dealerAccessories.push(temp);
        this.state.disableUpdateButton = false;
      }
      this.setState({
        renderList: !this.state.renderList,
        accessoriesData: this.state.accessoriesData,
        disableUpdateButton: this.state.disableUpdateButton
      });
    }
  }

  handleOnInputChange = (param, value) => {
    if (value.toString().length === 0) {
      this.state.showError = true;
    } else {
      this.state.showError = false;
    }
    this.state.currentAccessoryToEdit.price = value;
    if (param === 'price') {
      this.setState({
        currentAccessoryToEdit: this.state.currentAccessoryToEdit,
        showError: this.state.showError
      });
    }
  }

  editAccessory = item => {
    const temp = {};
    Object.assign(temp, item);
    this.setState({
      openModal: true,
      currentAccessoryToEdit: temp,
      modalVisible: true
    });
  }

  saveAccessories = () => {
    const showAccessories = [];
    this.state.accessoriesData.map(eachAccessory => {
      if (eachAccessory.is_available === undefined || eachAccessory.is_available === false) {
        eachAccessory.is_available = false;
      }
      if (eachAccessory.accessory_id === undefined) {
        eachAccessory.accessory_id = eachAccessory.id;
      }
      eachAccessory.dealer_id = recievedDealerId;
      this.state.accessoriesToSend.push(eachAccessory);
      return this.state.accessoriesToSend;
    });
    this.state.accessoriesToSend.map(eachAccessoryToSend => {
      delete eachAccessoryToSend.id;
      return eachAccessoryToSend;
    });
    return this.props.saveVehicleAccessories(recievedDealerId, this.state.accessoriesToSend)
      .then(() => {
        if (this.props.savedAccessories.length > 0) {
          this.props.savedAccessories.map(eachAccessory => {
            if (eachAccessory.dealerAccessories.length > 0 && eachAccessory.vehicle_id === this.state.activeVehicleId) {
              eachAccessory.is_available = eachAccessory.dealerAccessories[0].is_available;
              eachAccessory.is_mandatory = eachAccessory.dealerAccessories[0].is_mandatory;
              eachAccessory.price = eachAccessory.dealerAccessories[0].price;
              showAccessories.push(eachAccessory);
            }
            return eachAccessory;
          });
          this.setState({
            disableUpdateButton: true,
            accessoriesToSend: [],
            accessoriesData: showAccessories,
            renderList: !this.state.renderList,
          });
        }
      }).catch(error => {
        console.log(error);
      });
  }

  continueBtnAction = () => {
    const showAccessories = [];
    if (this.state.accessoriesData !== undefined && this.state.accessoriesData.length > 0) {
      this.state.accessoriesData.map(eachAccessory => {
        if (eachAccessory.is_available === undefined || eachAccessory.is_available === false) {
          eachAccessory.is_available = false;
        }
        if (eachAccessory.accessory_id === undefined) {
          eachAccessory.accessory_id = eachAccessory.id;
        }
        eachAccessory.dealer_id = recievedDealerId;
        this.state.accessoriesToSend.push(eachAccessory);
        return this.state.accessoriesToSend;
      });
      this.state.accessoriesToSend.map(eachAccessoryToSend => {
        delete eachAccessoryToSend.id;
        return eachAccessoryToSend;
      });
      return this.props.saveVehicleAccessories(recievedDealerId, this.state.accessoriesToSend)
        .then(() => {
          if (this.props.savedAccessories.length > 0) {
            this.props.savedAccessories.map(eachAccessory => {
              if (eachAccessory.dealerAccessories.length > 0 &&
                eachAccessory.vehicle_id === this.state.activeVehicleId) {
                eachAccessory.is_available = eachAccessory.dealerAccessories[0].is_available;
                eachAccessory.is_mandatory = eachAccessory.dealerAccessories[0].is_mandatory;
                eachAccessory.price = eachAccessory.dealerAccessories[0].price;
                showAccessories.push(eachAccessory);
              }
              return eachAccessory;
            });
            accessoriesCopy = this.props.savedAccessories.slice();
            this.props.changeStep(4);
          }
        }).catch(error => {
          console.log(error);
        });
    }
    this.props.changeStep(4);
  }

  backBtnAction = () => {
    this.props.changeStep(2);
  }

  renderedTable = item => (
    <View
      key={item.id}
      style={styles.renderedTable}
    >
      {/* Name */}
      <View style={styles.tableName}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.tableNameTextStyle}
        >{item.name}
        </Text>
      </View>
      {/* item_code */}
      <View style={styles.tableItemCode}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.tableItemCodeText}
        >{item.item_code}
        </Text>
      </View>
      {/* price */}
      <View style={styles.tablePrice}>
        <Text style={styles.tablePriceText}>
          {` ${item.price}`}/-
        </Text>
      </View>
      {/* Edit */}
      <View style={styles.tableEdit}>
        <TouchableOpacity style={styles.directionRow} onPress={() => this.editAccessory(item)}>
          <Image
            source={require('../../assets/images/edit.png')}
            style={styles.tableEditImageStyle}
          />
          {/* <Text style={styles.tableEditText}>
            Edit
          </Text> */}
        </TouchableOpacity>
      </View>
      {/* Available */}
      <View style={styles.tableAvailable}>
        <TouchableOpacity style={styles.directionRow} onPress={() => this.updateParam(item, 'is_available')}>
          {item.is_available ?
            <Image
              source={selectedImage}
              style={styles.checkboxImageStyle}
            /> :
            <Image
              source={unSelectedImage}
              style={styles.checkboxImageStyle}
            />}
        </TouchableOpacity>
      </View>
      {/* Mandatory */}
      <View style={styles.tableMandatoryStyle}>
        <TouchableOpacity style={styles.directionRow} onPress={() => this.updateParam(item, 'is_mandatory')}>
          {item.is_mandatory ?
            <Image
              source={selectedImage}
              style={styles.checkboxImageStyle}
            /> :
            <Image
              source={unSelectedImage}
              style={styles.checkboxImageStyle}
            />}
        </TouchableOpacity>
      </View>
    </View>
  )

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader loading={this.props.loading} />
        <View style={styles.modalAndHeaderWrapper}>
          {
            this.state.openModal ?
              <Modal
                animationType="fade"
                transparent
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: false, showError: false })}
              >
                <View style={styles.modalContentWrapper} />
                {/* Start of ModalContent */}
                <KeyboardAwareScrollView
                  contentContainerStyle={styles.modalContent}
                  keyboardShouldPersistTaps="always"
                >
                  <View style={styles.modalCloseIcon}>
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: false, showError: false })}>
                      <Image
                        source={closeModal}
                        style={styles.closeIconDimensions}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* Start of heading and close */}
                  <View style={styles.directionRow}>
                    <View>
                      <Text style={styles.modalHeader}>Edit accessory price: {this.state.currentAccessoryToEdit.name}
                      </Text>
                    </View>
                  </View>
                  {/* End of heading and close */}
                  {/* Start of Accessory name */}
                  <View style={styles.paddingVerticalTen}>
                    <View>
                      <Text style={styles.textOneStyle}>Accessory Name
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.textTwoStyle}>{this.state.currentAccessoryToEdit.name}
                      </Text>
                    </View>
                  </View>
                  {/* End of Accessory name */}
                  {/* Start of item item_code */}
                  <View style={styles.paddingVerticalTen}>
                    <View>
                      <Text style={styles.textOneStyle}>Item Code
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.textTwoStyle}>{this.state.currentAccessoryToEdit.item_code}
                      </Text>
                    </View>
                  </View>
                  {/* End of item code */}
                  {/* Start of price */}
                  <View>
                    <View>
                      <Text style={styles.textOneStyle}>Price
                      </Text>
                    </View>
                    <View style={styles.widthHundred}>
                      <UserInput
                        param="price"
                        placeholder="Price"
                        autoCapitalize="none"
                        keyboardType="numeric"
                        returnKeyType="done"
                        value={this.state.currentAccessoryToEdit.price.toString()}
                        onChange={this.handleOnInputChange}
                        autoCorrect={false}
                        textStyle={styles.userInputTextStyle}
                      />
                    </View>
                    {
                      this.state.showError ?
                        <Text style={[styles.textThreeStyle]}>Please enter atleast one character</Text>
                        :
                        null
                    }
                  </View>
                  {/* Available and Mandatory In Pop up, maybe required in future */}
                  {/* End of price */}
                  {/* Start of available */}
                  {/* <View style={styles.directionRow}>
                    <View>
                      {this.state.currentAccessoryToEdit.is_available ?
                        <Image
                          source={selectedImage}
                          style={styles.modalAvailableDimensions}
                        /> :
                        <Image
                          source={unSelectedImage}
                          style={styles.modalAvailableDimensions}
                        />}
                    </View>
                    <View style={styles.ml10}>
                      <Text style={styles.modalAvailableText}>Available</Text>
                    </View>
                  </View> */}
                  {/* End of available */}
                  {/* Start of mandatory */}
                  {/* <View style={styles.directionRow}>
                    <View>
                      {this.state.currentAccessoryToEdit.is_mandatory ?
                        <Image
                          source={selectedImage}
                          style={styles.modalAvailableDimensions}
                        /> :
                        <Image
                          source={unSelectedImage}
                          style={styles.modalAvailableDimensions}
                        />}
                    </View>
                    <View style={styles.ml10}>
                      <Text style={styles.modalAvailableText}>Mandatory</Text>
                    </View>
                  </View> */}
                  {/* End of mandatory */}
                  {/* Start of mandatory */}
                  <View style={styles.selfCenter}>
                    <BookTestRideButton
                      disabled={this.state.showError}
                      handleSubmit={() => { this.onEditSubmission(this.state.currentAccessoryToEdit); }}
                      title="Save Details"
                    />
                  </View>
                  {/* End of mandatory */}
                </KeyboardAwareScrollView>
                {/* End of ModalContent */}
              </Modal>
              :
              null
          }
          {/* start of choose accessories header */}
          <View style={styles.accessoriesHeader}>
            <View style={styles.chooseAccessoriesWrapper}>
              <Text style={styles.chooseAccessoriesText}>Choose Accessories for
              </Text>
            </View>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={this.state.activeVehicle}
                mode="dropdown"
                enabled={this.state.disableUpdateButton}
                style={styles.pickerStyle}
                onValueChange={(itemValue, itemIndex) => this.getAccessoriesForSelectedVehicle(itemValue, itemIndex)}
              >
                {
                  this.state.vehicleList.map(eachVehicle => (
                    <Picker.Item key={eachVehicle.id} label={eachVehicle.name} value={eachVehicle.name} />
                  ))
                }
              </Picker>
            </View>
            <View style={styles.ml40}>
              <BookTestRideButton
                // disabled={this.state.disableUpdateButton}
                handleSubmit={() => this.saveAccessories()}
                title="UPDATE"
              />
            </View>
          </View>
          {/* end of choose accessories header */}
          {/* Start of table header */}
          <View style={styles.pt20}>
            <View style={styles.tableHeaderWrapper}>
              {/* Name */}
              <View style={styles.tableHeaderName}>
                <Text style={styles.tableHeaderNameText}>Accessories Name
                </Text>
                <TouchableOpacity style={styles.directionRow} onPress={() => this.sortAccessory('name')}>
                  <Image
                    source={Sort}
                    style={styles.height15}
                  />
                </TouchableOpacity>
              </View>
              {/* Code */}
              <View style={styles.tableHeaderItemCode}>
                <Text style={styles.tableHeaderItemCodeText}>Item Code
                </Text>
              </View>
              {/* price */}
              <View style={styles.tableHeaderPrice}>
                <Text style={styles.tableHeaderText}>Cost (INR)
                </Text>
                {/*                 <TouchableOpacity style={styles.directionRow} onPress={() => this.sortAccessory('price')}>
                  <Image
                    source={Sort}
                    style={styles.height15}
                  />
                </TouchableOpacity> */}
              </View>
              {/* Available */}
              <View style={styles.tableHeaderAvailable}>
                <Text style={styles.tableHeaderText}>Available
                </Text>
              </View>
              {/* Mandatory */}
              <View style={styles.tableHeaderMandatory}>
                <Text style={styles.tableHeaderText}>Mandatory
                </Text>
              </View>
            </View>
          </View>
          {/* End of table header */}
          {
            this.state.accessoriesData && this.state.accessoriesData.length > 0 ?
              <View>
                <FlatList
                  data={this.state.accessoriesData}
                  keyExtractor={item => item.id}
                  renderItem={({ item, index }) => this.renderedTable(item, index)}
                  extraData={this.state.renderList}
                />
              </View>
              :
              <View style={styles.noAccessories}>
                <Text>No Accessories Found For {this.state.activeVehicle}</Text>
              </View>
          }
        </View>
        <View style={styles.flexTwo}>
          <ContinueSectionScreen
            continueBtnAction={this.continueBtnAction}
            backBtnAction={this.backBtnAction}
          />
        </View>
      </View>
    );
  }
}
