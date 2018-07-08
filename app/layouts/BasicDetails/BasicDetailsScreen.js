import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import UserInput from '../../components/userInput/UserInput';
import { BookTestRideButton } from '../../components/button/Button';
import styles from './basicDetailsStyles';
import {
  mobileNumberValidator,
  isStringEmpty } from '../../utils/validations';
import { createLead } from '../../redux/actions/CreateNewLead/actionCreators';

@connect(state => ({
  lead: state.createLead.lead
}), {
  createLead
})
class BasicDetailsScreen extends Component {
  static propTypes = {
    handleOnContinue: PropTypes.func.isRequired,
    dealerId: PropTypes.string.isRequired,
    createLead: PropTypes.func.isRequired,
    lead: PropTypes.object
  }

  static defaultProps = {
    lead: {},
  }

  constructor(props) {
    super(props);
    const { lead } = this.props;
    this.state = {
      lead,
      gender: lead && Object.keys(lead).length !== 0 ? lead.gender : '',
      name: lead && Object.keys(lead).length !== 0 ? lead.name : '',
      mobileNumber: lead && Object.keys(lead).length !== 0 ? lead.mobile_number : '',
      leadFieldError: false,
      mobileFieldError: false,
      genderFieldError: false,
      basicErrorMessage: 'Field cannot be empty.',
      mobileErrorMessage: 'Mobile number should have 10 digits.',
    };
  }

  handleOnInputChange = (param, value) => {
    if (param === 'name') {
      if (isStringEmpty(value)) {
        this.setState({
          leadFieldError: true,
          name: value,
          lead: {
            ...this.state.lead,
            name: value
          }
        });
      } else {
        this.setState({
          leadFieldError: false,
          name: value,
          lead: {
            ...this.state.lead,
            name: value
          }
        });
      }
    } else if (param === 'mobile_no') {
      if (!mobileNumberValidator(value)) {
        this.setState({
          mobileFieldError: true,
          mobileNumber: value,
          lead: {
            ...this.state.lead,
            mobile_number: value
          }
        });
      } else {
        this.setState({
          mobileFieldError: false,
          mobileNumber: value,
          lead: {
            ...this.state.lead,
            mobile_number: value
          }
        });
      }
    }
  }

  createNewLead = () => {
    const {
      name, gender, mobileNumber
    } = this.state;
    const { dealerId } = this.props;
    const data = {
      name,
      gender,
      mobile_number: mobileNumber
    };
    const isMobileNumberValid = mobileNumberValidator(mobileNumber);
    const isNameValid = !isStringEmpty(name);
    const isGenderSelected = !isStringEmpty(gender);
    if (isMobileNumberValid && isNameValid && dealerId.length > 0 && isGenderSelected) {
      this.props.createLead(dealerId, data).then(() => {
        this.props.handleOnContinue(this.props.lead);
      }, error => {
        console.log(error);
      });
    }
    this.setState({
      leadFieldError: !isNameValid,
      mobileFieldError: !isMobileNumberValid,
      genderFieldError: !isGenderSelected
    });
  }

  selectGender = value => {
    this.setState({
      genderFieldError: false,
      gender: value
    });
  }

  render() {
    const {
      lead,
      name,
      mobileNumber,
      gender,
      basicErrorMessage,
      leadFieldError,
      genderFieldError,
      mobileErrorMessage,
      mobileFieldError
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={styles.nameContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Name</Text>
              <Text style={styles.mandatoryField}>*</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <UserInput
                param="name"
                placeholder="Enter Name"
                autoCapitalize="none"
                returnKeyType="done"
                value={lead && lead.name ? lead.name : name}
                onChange={this.handleOnInputChange}
                autoCorrect={false}
                containerStyle={styles.fieldContainer}
                textStyle={styles.fieldValue}
                maxLength={50}
                showError={leadFieldError}
                errorTitle={basicErrorMessage}
                errorStyle={{ marginLeft: 10 }}
              />
            </View>
          </View>
          <View style={styles.gender}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Gender</Text>
              <Text style={styles.mandatoryField}>*</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              marginLeft: 2
            }}
            >
              <TouchableHighlight
                style={gender === 'male' ? [styles.selectedCard, styles.genderCard] : styles.genderCard}
                underlayColor="#fff"
                onPress={() => this.selectGender('male')}
              >
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/images/male.png')}
                    activeOpacity={0.5}
                    resizeMode="contain"
                    style={{ width: 80, height: 70 }}
                  />
                  {/* <Text style={styles.cardText}>Male
                  </Text> */}
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={[gender === 'female' ? [styles.selectedCard, styles.genderCard] :
                  styles.genderCard, { paddingHorizontal: 16 }]}
                underlayColor="#fff"
                onPress={() => this.selectGender('female')}
              >
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/images/female.png')}
                    activeOpacity={0.5}
                    style={{ width: 80, height: 70 }}
                    resizeMode="center"
                  />
                  {/* <Text style={styles.cardText}>Female
                  </Text> */}
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={gender === 'others' ? [styles.selectedCard, styles.genderCard] :
                  styles.genderCard}
                underlayColor="#fff"
                onPress={() => this.selectGender('others')}
              >
                <View style={{
                  alignItems: 'center', justifyContent: 'center', width: 80, height: 70
                }}>
                  <Text style={[styles.cardText, { textAlign: 'center' }]}>Others
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            {
            genderFieldError ?
              <Text style={[styles.errorTextStyle]}>Please select gender.
              </Text>
              :
              <Text style={styles.errorTextStyle} />
            }
          </View>
          <View style={styles.nameContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.fieldTitle, { lineHeight: 22 }]}>Phone Number</Text>
              <Text style={styles.mandatoryField}>*</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <UserInput
                param="mobile_no"
                placeholder="Enter Phone Number"
                autoCapitalize="none"
                returnKeyType="done"
                keyboardType="phone-pad"
                value={lead && lead.mobile_number ? lead.mobile_number : mobileNumber}
                onChange={this.handleOnInputChange}
                autoCorrect={false}
                containerStyle={styles.fieldContainer}
                textStyle={styles.fieldValue}
                showError={mobileFieldError}
                errorTitle={mobileErrorMessage}
                maxLength={10}
                errorStyle={{ marginLeft: 10 }}
              />
            </View>
          </View>
          <View style={styles.continueBtnContainer}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end' }} >
              <BookTestRideButton
                title="CONTINUE"
                handleSubmit={this.createNewLead}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default BasicDetailsScreen;
