import React, { Component } from 'react';
import { View, Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { Dropdown } from 'react-native-material-dropdown';
import LeadHistoryTab from './LeadHistoryTab';
import styles from './leadHistoryStyles';
import {
  BookTestRideButton
} from '../../components/button/Button';
import {
  getLeadDetails,
  getTeamMembers,
  updateLead
} from '../../redux/actions/LeadHistory/actionCreators';
import Loader from '../../components/loader/Loader';
import {
  mobileNumberValidator,
  isStringEmpty } from '../../utils/validations';
import variables from '../../theme/variables';
import fonts from '../../theme/fonts';

@connect(state => ({
  lead: state.leadHistory.lead,
  loading: state.leadHistory.loading,
  teamMembers: state.leadHistory.teamMembers
}), { getLeadDetails, getTeamMembers, updateLead })
class LeadHistoryScreen extends Component {
  static propTypes = {
    lead: PropTypes.object,
    teamMembers: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
    getLeadDetails: PropTypes.func.isRequired,
    getTeamMembers: PropTypes.func.isRequired,
    updateLead: PropTypes.func.isRequired
  }

  static defaultProps = {
    teamMembers: null,
    lead: null
  }

  constructor(props) {
    super(props);
    this.state = {
      lead: {},
      leadFieldError: false,
      mobileFieldError: false,
      genderFieldError: false,
      basicErrorMessage: 'Field cannot be empty.',
      mobileErrorMessage: 'Mobile number should have 10 digits.',
      genderErrorMessage: 'Please select gender',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.teamMembers) {
      return {
        teamMembers: nextProps.teamMembers
      };
    }
    return null;
  }

  componentDidMount() {
    this.onInitalLoad();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.onInitalLoad();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onInitalLoad = () => {
    const { navigation } = this.props;
    const lead = navigation.getParam('lead');
    const currentDealerId = navigation.getParam('currentDealerId');
    this.props.getTeamMembers(currentDealerId);
    this.props.getLeadDetails(lead.id).then(() => {
      this.setState({
        lead: {
          ...this.props.lead
        }
      });
    }, error => {
      console.log(error);
    });
  }

  onChangeText = text => {
    this.setState({
      lead: {
        ...this.state.lead,
        assigned_to: text
      }
    });
  }

  selectGender = value => {
    this.setState({
      lead: {
        ...this.state.lead,
        gender: value
      }
    });
  }

  updateLead = () => {
    const { lead } = this.state;
    if (!lead.lead_details && !lead.follow_up && !lead.lead_finance_detail) {
      delete lead.lead_details;
      delete lead.follow_up;
      delete lead.lead_finance_detail;
      if (lead.lostReason) {
        delete lead.lostReason;
      }
    }
    this.props.updateLead(lead.id, lead);
  }

  handleOnInputChange = (param, value) => {
    const { lead, mobileFieldError, leadFieldError } = this.state;
    lead[param] = value;
    this.setState({
      leadFieldError:
        param === 'name' ? isStringEmpty(value) : leadFieldError,
      mobileFieldError:
        param === 'mobile_number' ? !mobileNumberValidator(value) : mobileFieldError,
      lead
    });
  }

  closeLeadHistory = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  render() {
    const {
      lead,
      leadFieldError,
      basicErrorMessage,
      mobileErrorMessage,
      mobileFieldError,
      genderErrorMessage,
      genderFieldError
    } = this.state;
    const { teamMembers } = this.props;
    return (
      <View style={styles.container}>
        <Loader loading={this.props.loading} />
        {/* close icon */}
        <View style={styles.body}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }} >
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  alignItems: 'center',
                  backgroundColor: '#f26537'
                }}
                onPress={this.closeLeadHistory}
                >
                <Image
                  style={{ resizeMode: 'center', flex: 1 }}
                  source={require('../../assets/images/close.png')}
                  />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.panelContent}>
            {/* Left pane */}
            <View style={{
              flex: 3,
              flexDirection: 'column',
              marginHorizontal: 15,
              marginVertical: 15,
              backgroundColor: 'white',
              elevation: 5
            }}>
              <View style={{
                flex: 2,
                flexDirection: 'column',
                marginLeft: 10,
                marginTop: 15
              }}>
                <Text style={styles.pageTitle}>Lead Details</Text>
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginHorizontal: 10
                }}>
                  <Text style={styles.fieldTitle}>Name</Text>
                  <View style={{
                    flexDirection: 'column',
                    backgroundColor: variables.placeholderBackgroundColor,
                  }}
                  >
                    <TextInput
                      param="name"
                      placeholder="Enter the name."
                      placeholderTextColor="#9DA5B9"
                      value={lead && lead.name ? lead.name : ''}
                      onChangeText={value => this.handleOnInputChange('name', value)}
                      style={styles.fieldValue}
                      underlineColorAndroid={variables.lightGrey}
                      maxLength={50}
                    />
                  </View>
                  {
                  leadFieldError &&
                    <Text style={styles.errorTextStyle}>{basicErrorMessage}
                    </Text>
                  }
                </View>
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginHorizontal: 10
                }}>
                  <Text style={styles.fieldTitle}>Mobile Number</Text>
                  <TextInput
                    param="mobile_number"
                    placeholder="Enter Phone Number."
                    placeholderTextColor="#9DA5B9"
                    value={lead && lead.mobile_number ? lead.mobile_number : ''}
                    onChangeText={value => this.handleOnInputChange('mobile_number', value)}
                    style={styles.fieldValue}
                    underlineColorAndroid={variables.lightGrey}
                    maxLength={10}
                  />
                  {
                  mobileFieldError &&
                    <Text style={styles.errorTextStyle}>{mobileErrorMessage}
                    </Text>
                  }
                </View>
                <View style={styles.gender}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.fieldTitle]}>Gender</Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    marginLeft: 2
                  }}
                    >
                    <TouchableHighlight
                      style={lead && lead.gender === 'male'
                        ? [styles.selectedCard, styles.genderCard] : styles.genderCard}
                      underlayColor="#f16537"
                      onPress={() => this.selectGender('male')}
                      >
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          source={require('../../assets/images/male.png')}
                          activeOpacity={0.5}
                          resizeMode="contain"
                          style={{ width: 40, height: 30 }}
                          />
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={[lead && lead.gender === 'female' ? [styles.selectedCard, styles.genderCard] :
                        styles.genderCard, { paddingHorizontal: 16 }]}
                      underlayColor="#f16537"
                      onPress={() => this.selectGender('female')}
                        >
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          source={require('../../assets/images/female.png')}
                          activeOpacity={0.5}
                          style={{ width: 30, height: 30 }}
                          resizeMode="center"
                          />
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={lead && lead.gender === 'others'
                        ? [styles.selectedCard, styles.genderCard] :
                        styles.genderCard}
                      underlayColor="#f16537"
                      onPress={() => this.selectGender('others')}
                      >
                      <View style={{
                        alignItems: 'center', justifyContent: 'center', width: 40, height: 40
                      }}>
                        <Text style={[styles.cardText, { textAlign: 'center' }]}>Others
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                  {
                    genderFieldError ?
                      <Text style={[styles.errorTextStyle]}>{genderErrorMessage}
                      </Text>
                      :
                      <Text style={styles.errorTextStyle} />
                  }
                </View>
              </View>
              <View style={{
                flex: 1, marginLeft: 10, marginTop: 10
              }}>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  {/* <Text style={styles.fieldTitle}>Assigned To</Text> */}
                  <Dropdown
                    label="Assigned To"
                    data={teamMembers || []}
                    // baseColor="red"
                    value={lead.assigned_to || ''}
                    fontSize={14}
                    itemTextStyle={{ fontSize: 10, fontFamily: fonts.sourceSansProBoldItalic }}
                    onChangeText={this.onChangeText}
                    // eslint-disable-next-line camelcase
                    labelExtractor={({ first_name }) => first_name}
                    valueExtractor={({ id }) => id}
                  />
                </View>
                <View style={{ alignItems: 'flex-end', marginRight: 20, marginBottom: 20 }}>
                  <BookTestRideButton
                    customStyles={styles.saveBtnStyle}
                    title="Update"
                    handleSubmit={this.updateLead}
                    />
                </View>
              </View>
            </View>
            {/* Right pane */}
            <View style={{
              flex: 7,
              marginRight: 15,
              marginVertical: 15,
              backgroundColor: 'white',
              elevation: 5
            }} >
              <LeadHistoryTab navigation={this.props.navigation} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default LeadHistoryScreen;
