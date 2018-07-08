import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ScrollView, Image, TouchableOpacity, Picker } from 'react-native';
import UserInput from '../../components/userInput/UserInput';
import styles from './dealershipDetailsStyles';
import { BookTestRideButton } from '../../components/button/Button';
import { getZones, getStates, getCities, saveDealership } from '../../redux/actions/DealershipDetails/actionCreators';
import {
  mobileNumberValidator,
  emailValidator,
  pincodeValidator,
  isStringEmpty } from '../../utils/validations';
import storage from '../../helpers/AsyncStorage';

/**
 * The annotation is used for getting state values and dispatching an action.
 */
@connect(state => ({
  zones: state.dealerInfo.zones,
  states: state.dealerInfo.states,
  cities: state.dealerInfo.cities,
}), {
  getZones, getStates, getCities, saveDealership
})

class DealershipDetails extends Component {
  static propTypes = {
    getZones: PropTypes.func.isRequired,
    getStates: PropTypes.func.isRequired,
    getCities: PropTypes.func.isRequired,
    saveDealership: PropTypes.func.isRequired,
    changeStep: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    zones: PropTypes.array,
    states: PropTypes.array,
    cities: PropTypes.array,
    dealer: PropTypes.object,
    user: PropTypes.object
  }

  static defaultProps = {
    dealer: {},
    zones: [],
    states: [],
    cities: [],
    user: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      dealershipInfo: this.props.dealer,
      user: this.props.user,
      mobileNumbersList: this.props.dealer.mobile_no ? this.props.dealer.mobile_no.split(',', 3) : [],
      emailList: this.props.dealer.email ? this.props.dealer.email.split(',', 3) : [],
      managerName: this.props.user && `${this.props.user.first_name} ${this.props.user.last_name}`,
      showMobileError: [],
      showEmailError: [],
      isPincodeValid: true,
      nameFieldError: false,
      userFieldError: false,
      addressFieldError: false,
      basicError: 'Field cannot be empty.',
      pincodeError: 'Pincode must contain 6 digits.',
      emailError: 'Enter a valid Email Id.',
      mobileError: 'Mobile number should have 10 digits.',
    };
  }

  componentWillMount() {
    const { dealershipInfo } = this.state;
    this.props.getZones();
    if (dealershipInfo.zone_id !== null) {
      this.props.getStates(dealershipInfo.zone_id);
    }
    if (dealershipInfo.state_id !== null) {
      this.props.getCities(dealershipInfo.state_id);
    }
  }

  handleOnContinue = () => {
    const {
      dealershipInfo,
      mobileNumbersList,
      emailList,
      user,
      nameFieldError,
      addressFieldError,
      userFieldError
    } = this.state;
    const showEmailError = [];
    const showMobileError = [];
    const isPincodeValid = pincodeValidator(dealershipInfo.pincode);
    mobileNumbersList.forEach((mobileNumber, index) => {
      showMobileError[index] = !mobileNumberValidator(mobileNumber);
    });
    emailList.forEach((email, index) => {
      showEmailError[index] = !emailValidator(email);
    });
    this.setState({
      showMobileError,
      showEmailError,
      isPincodeValid,
    });
    if (!nameFieldError && !addressFieldError && !userFieldError &&
        !showEmailError.includes(true) &&
        !showMobileError.includes(true) &&
        isPincodeValid) {
      const data = {
        dealer: {
          ...dealershipInfo
        },
        user
      };
      this.props.saveDealership(data).then(
        () => {
          this.props.updateUser(user);
          storage.getItem('currentUser').then(response => {
            const currentUser = {
              ...response,
              user
            };
            storage.storeJsonValues('currentUser', currentUser);
            this.props.changeStep(2);
          });
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  displayPhoneNumber = () => {
    const {
      mobileNumbersList, mobileError, showMobileError
    } = this.state;
    return (
      mobileNumbersList.map((mobileNumber, index) => (
        <View
          style={{
            flex: 0.7, flexDirection: 'row', alignContent: 'flex-start'
          }}
          key={index}
        >
          <UserInput
            param="mobile_no"
            placeholder="Enter Phone Number"
            autoCapitalize="none"
            returnKeyType="done"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChange={(param, value) => this.handleOnInputChange(param, value, index)}
            autoCorrect={false}
            containerStyle={styles.fieldContainer}
            textStyle={styles.fieldValue}
            showError={showMobileError[index]}
            errorTitle={mobileError}
            maxLength={10}
            errorStyle={{ marginLeft: 10 }}
          />
          {
            index !== 0 &&
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 15,
                marginBottom: 15
              }}
              onPress={() => this.removePhoneNumber(index)}
              activeOpacity={0.5}
              >
              <Image source={require('../../assets/images/delete.png')} />
            </TouchableOpacity>
          }
        </View>
      ))
    );
  }

  addPhoneNumber = () => {
    const { mobileNumbersList } = this.state;
    mobileNumbersList.push('');
    this.setState({
      mobileNumbersList
    });
  }

  removePhoneNumber = index => {
    const { mobileNumbersList, dealershipInfo } = this.state;
    mobileNumbersList.splice(index, 1);
    this.setState({
      dealershipInfo: {
        ...dealershipInfo,
        mobile_no: mobileNumbersList.join()
      },
      mobileNumbersList
    });
  }

  displayEmail = () => {
    const { emailList, showEmailError, emailError } = this.state;
    return (
      emailList.map((email, index) => (
        <View
          style={{
            flex: 0.7, flexDirection: 'row', alignContent: 'flex-start'
          }}
          key={index}
        >
          <UserInput
            param="email"
            placeholder="Enter E-mail Id"
            autoCapitalize="none"
            returnKeyType="done"
            value={email}
            onChange={(param, value) => this.handleOnInputChange(param, value, index)}
            autoCorrect={false}
            containerStyle={styles.fieldContainer}
            textStyle={styles.fieldValue}
            showError={showEmailError[index]}
            errorTitle={emailError}
            errorStyle={{ marginLeft: 10 }}
          />
          {
            index !== 0 &&
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                marginVertical: 15
              }}
              onPress={() => this.removeEmail(index)}
              activeOpacity={0.5}
              >
              <Image source={require('../../assets/images/delete.png')} />
            </TouchableOpacity>
          }
        </View>
      ))
    );
  }

  addEmail = () => {
    const { emailList } = this.state;
    emailList.push('');
    this.setState({
      emailList
    });
  }

  removeEmail = index => {
    const { emailList, dealershipInfo } = this.state;
    emailList.splice(index, 1);
    this.setState({
      dealershipInfo: {
        ...dealershipInfo,
        email: emailList.join()
      },
      emailList
    });
  }

  handleOnInputChange = (param, value, index) => {
    if (param === 'dealershipname') {
      if (isStringEmpty(value)) {
        this.setState({
          nameFieldError: true,
          dealershipInfo: {
            ...this.state.dealershipInfo,
            name: value
          }
        });
      } else {
        this.setState({
          nameFieldError: false,
          dealershipInfo: {
            ...this.state.dealershipInfo,
            name: value
          }
        });
      }
    } else if (param === 'mobile_no') {
      const { mobileNumbersList, showMobileError } = this.state;
      mobileNumbersList[index] = value;
      showMobileError[index] = false;
      this.setState({
        dealershipInfo: {
          ...this.state.dealershipInfo,
          mobile_no: mobileNumbersList.join(),
        },
        mobileNumbersList,
        showMobileError
      });
    } else if (param === 'email') {
      const { emailList, showEmailError } = this.state;
      emailList[index] = value;
      showEmailError[index] = false;
      this.setState({
        dealershipInfo: {
          ...this.state.dealershipInfo,
          email: emailList.join(),
        },
        emailList,
        showEmailError
      });
    } else if (param === 'landline_no') {
      this.setState({
        dealershipInfo: {
          ...this.state.dealershipInfo,
          landline_no: value
        }
      });
    } else if (param === 'address_line_1') {
      if (isStringEmpty(value)) {
        this.setState({
          addressFieldError: true,
          dealershipInfo: {
            ...this.state.dealershipInfo,
            address_line_1: value
          }
        });
      } else {
        this.setState({
          addressFieldError: false,
          dealershipInfo: {
            ...this.state.dealershipInfo,
            address_line_1: value
          }
        });
      }
    } else if (param === 'pincode') {
      if (pincodeValidator(value)) {
        this.setState({
          dealershipInfo: {
            ...this.state.dealershipInfo,
            pincode: value
          },
          isPincodeValid: true
        });
      } else {
        this.setState({
          dealershipInfo: {
            ...this.state.dealershipInfo,
            pincode: value
          },
          isPincodeValid: false
        });
      }
    } else if (param === 'managername') {
      if (isStringEmpty(value)) {
        this.setState({
          userFieldError: true,
          user: {
            ...this.state.user,
          },
          managerName: value
        });
      } else {
        const name = value.split(/ (.*)/);
        this.setState({
          userFieldError: false,
          user: {
            ...this.state.user,
            first_name: name[0],
            last_name: name[1]
          },
          managerName: value
        });
      }
    }
  }

  changeZone = itemValue => {
    this.setState({
      dealershipInfo: {
        ...this.state.dealershipInfo,
        zone_id: itemValue
      }
    });
    this.props.getStates(itemValue);
  }

  changeState = itemValue => {
    this.setState({
      dealershipInfo: {
        ...this.state.dealershipInfo,
        state_id: itemValue
      }
    });
    this.props.getCities(itemValue);
  }

  changeCity = itemValue => {
    this.setState({
      dealershipInfo: {
        ...this.state.dealershipInfo,
        city_id: itemValue
      }
    });
  }

  render() {
    const { zones, states, cities } = this.props;
    const {
      dealershipInfo,
      mobileNumbersList,
      emailList,
      isPincodeValid,
      pincodeError,
      managerName,
      addressFieldError,
      nameFieldError,
      userFieldError,
      basicError
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.bodyLayout}>
          <ScrollView style={styles.form}>
            <Text style={styles.formTitle}>Enter Dealership Details</Text>
            <View style={{ marginVertical: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.nameBlock}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Name</Text>
                    <Text style={styles.mandatoryField}>*</Text>
                  </View>
                  <UserInput
                    param="dealershipname"
                    placeholder="Enter Dealer Name"
                    autoCapitalize="none"
                    returnKeyType="done"
                    value={dealershipInfo.name}
                    onChange={this.handleOnInputChange}
                    autoCorrect={false}
                    containerStyle={styles.fieldContainer}
                    textStyle={styles.fieldValue}
                    maxLength={50}
                    showError={nameFieldError}
                    errorTitle={basicError}
                    errorStyle={{ marginLeft: 10 }}
                  />
                </View>
                <View style={styles.salesManagerWrap}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Manager Name</Text>
                    <Text style={styles.mandatoryField}>*</Text>
                  </View>
                  <UserInput
                    param="managername"
                    placeholder="Enter Sales Manager Name"
                    autoCapitalize="none"
                    returnKeyType="done"
                    // value={user && Object.keys(user).length !== 0 ? user.first_name : ''}
                    value={managerName}
                    onChange={this.handleOnInputChange}
                    autoCorrect={false}
                    containerStyle={styles.fieldContainer}
                    textStyle={styles.fieldValue}
                    maxLength={50}
                    showError={userFieldError}
                    errorTitle={basicError}
                    errorStyle={{ marginLeft: 10 }}
                  />
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.detailsWrap}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Phone</Text>
                    <Text style={styles.mandatoryField}>*</Text>
                  </View>
                  {this.displayPhoneNumber()}
                </View>
                {
                  mobileNumbersList.length < 3 &&
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginLeft: 60,
                      marginBottom: 10
                    }}
                    onPress={this.addPhoneNumber}
                    activeOpacity={0.5}
                    >
                    <Image source={require('../../assets/images/add_o.png')} />
                    <Text style={[styles.addInfo]}>Add Phone Number</Text>
                  </TouchableOpacity>
                }
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.detailsWrap}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Email Id</Text>
                    <Text style={styles.mandatoryField}>*</Text>
                  </View>
                  {this.displayEmail()}
                </View>
                {
                  emailList.length < 3 &&
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginLeft: 60,
                      marginBottom: 10
                    }}
                    onPress={this.addEmail}
                    activeOpacity={0.5}
                    >
                    <Image source={require('../../assets/images/add_o.png')} />
                    <Text style={[styles.addInfo]}>Add Email ID</Text>
                  </TouchableOpacity>
                }
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.detailsWrap}>
                  <Text style={styles.fieldTitle}>Landline Number</Text>
                  <UserInput
                    param="landline_no"
                    placeholder="Enter landline number"
                    autoCapitalize="none"
                    returnKeyType="done"
                    value={dealershipInfo.landline_no}
                    onChange={this.handleOnInputChange}
                    autoCorrect={false}
                    containerStyle={styles.addressContainer}
                    textStyle={styles.addressText}
                    // multiline
                    // numberOfLines={4}
                  />
                </View>
                <View style={styles.detailsWrap}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Address</Text>
                    <Text style={styles.mandatoryField}>*</Text>
                  </View>
                  <UserInput
                    param="address_line_1"
                    placeholder="Enter your address"
                    autoCapitalize="none"
                    returnKeyType="done"
                    value={dealershipInfo.address_line_1}
                    onChange={this.handleOnInputChange}
                    autoCorrect={false}
                    containerStyle={styles.addressContainer}
                    textStyle={styles.addressText}
                    showError={addressFieldError}
                    errorTitle={basicError}
                    errorStyle={{ marginLeft: 10 }}
                    // multiline
                    // numberOfLines={4}
                  />
                </View>
                <View style={styles.locationWrap}>
                  <View style={{ flex: 0.8, flexDirection: 'column' }}>
                    <View style={styles.locationField}>
                      <Text style={styles.fieldTitle}>Zone</Text>
                    </View>
                    <View style={styles.pickerWrapper}>
                      <Picker
                      // mode="dropdown"
                        selectedValue={dealershipInfo.zone_id}
                        style={styles.pickerStyle}
                        onValueChange={itemValue => this.changeZone(itemValue)}
                      >
                        {
                          zones && zones.map(zone => (
                            <Picker.Item label={zone.name} value={zone.id} key={zone.id} />
                          ))
                        }
                      </Picker>
                    </View>

                  </View>
                  <View style={{ flex: 0.8, flexDirection: 'column' }}>
                    <View style={styles.locationField}>
                      <Text style={styles.fieldTitle}>State</Text>
                    </View>
                    <View style={styles.pickerWrapper}>
                      <Picker
                      // mode="dropdown"
                        selectedValue={dealershipInfo.state_id}
                        style={styles.pickerStyle}
                        onValueChange={itemValue => this.changeState(itemValue)}
                      >
                        {
                          states && states.map(state => (
                            <Picker.Item label={state.name} value={state.id} key={state.id} />
                          ))
                        }
                      </Picker>
                    </View>
                  </View>
                </View>
                <View style={{
                  flex: 0.8, marginHorizontal: 60, flexDirection: 'row', marginVertical: 10
                }}
                >
                  <View style={{ flex: 0.8, flexDirection: 'column' }}>
                    <View style={styles.locationField}>
                      <Text style={styles.fieldTitle}>City</Text>
                    </View>
                    <View style={styles.pickerWrapper}>
                      <Picker
                      // mode="dropdown"
                        selectedValue={dealershipInfo.city_id}
                        style={styles.pickerStyle}
                        onValueChange={itemValue => this.changeCity(itemValue)}
                      >
                        {
                          cities && cities.map(city => (
                            <Picker.Item label={city.name} value={city.id} key={city.id} />
                          ))
                        }
                      </Picker>
                    </View>
                  </View>
                  <View style={{ flex: 0.8 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Pincode</Text>
                      <Text style={styles.mandatoryField}>*</Text>
                    </View>
                    <UserInput
                      param="pincode"
                      placeholder="Enter Pincode"
                      autoCapitalize="none"
                      returnKeyType="done"
                      keyboardType="numeric"
                      value={dealershipInfo.pincode !== null ? dealershipInfo.pincode.toString() : ''}
                      onChange={this.handleOnInputChange}
                      autoCorrect={false}
                      containerStyle={styles.fieldContainer}
                      textStyle={styles.fieldValue}
                      showError={!isPincodeValid}
                      errorTitle={pincodeError}
                      errorStyle={{ marginLeft: 10 }}
                      maxLength={6}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.continueBtnContainer}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end' }} >
                <BookTestRideButton
                  title="CONTINUE"
                  handleSubmit={this.handleOnContinue}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default DealershipDetails;
