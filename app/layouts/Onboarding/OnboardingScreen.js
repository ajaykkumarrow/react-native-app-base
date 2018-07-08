import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './onboardingStyles';
import { ButtonWithPlainText } from '../../components/button/Button';
import instaBikeLogo from '../../assets/images/instabikeLogo.png';
import ChooseFinancierScreen from '../ChooseFinancier/ChooseFinancierScreen';
import DealershipDetails from '../DealershipDetails/DealershipDetails';
import storage from '../../helpers/AsyncStorage';
import getDealerById from '../../redux/actions/Onboarding/actionCreators';
import TestRideTimingsScreen from '../../layouts/TestRideTimings/TestRideTimingsScreen';
import TeamMemberScreen from '../../layouts/TeamMember/TeamMemberScreen';
import ChooseAccessories from '../../layouts/ChooseAccessories/ChooseVehicleAccessories';
import { capitalizeFirstLetter } from '../../utils/validations';
import Loader from '../../components/loader/Loader';

@connect(
  state => ({
    dealer: state.onboarding.dealer,
    loading: state.onboarding.loading
  }),
  {
    getDealerById
  }
)

class OnboardingScreen extends Component {
  static propTypes = {
    /**
     * Use dealer object from below variable
     */
    dealer: PropTypes.object,
    getDealerById: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    dealer: null
  }

  constructor(props) {
    super(props);
    this.state = {
      position: 1,
      user: {}
    };
  }

  componentWillMount() {
    storage.getItem('currentUser')
      .then(recievedToken => {
        const currentDealerId = recievedToken.dealerId;
        this.setState({
          user: {
            ...recievedToken.user
          }
        });
        return this.props.getDealerById(currentDealerId);
      })
      .catch(error => {
        console.log('Error.....:', error);
      });
  }

  /**
   * Privacy Policy Button action
   */
  privacyPolicyBtnAction = () => {

  }
  /**
   * Terms and Condition Button action
   */
  termsAndConditionBtnAction = () => {

  }
  /**
   * Change position step
   */
  changeStep = value => {
    this.setState({
      position: value
    });
  }

  updateUser = user => {
    this.setState({
      user
    });
  }

  previousStep = value => {
    storage.getItem('currentUser')
      .then(recievedToken => {
        const currentDealerId = recievedToken.dealerId;
        this.props.getDealerById(currentDealerId).then(() => {
          this.setState({
            position: value
          });
        }, () => {});
      })
      .catch(error => {
        console.log('Error.....:', error);
      });
  }

  updateCurrentScreen = () => {
    const { user } = this.state;
    switch (this.state.position) {
      case 1:
        return (
          this.props.dealer !== null && this.props.dealer !== undefined &&
          <DealershipDetails
            dealer={this.props.dealer}
            changeStep={this.changeStep}
            user={user}
            updateUser={this.updateUser}
            />
        );
      case 2:
        return (
          <TeamMemberScreen changeStep={this.changeStep} previousStep={this.previousStep} />
        );
      case 3:
        return (
          <ChooseAccessories changeStep={this.changeStep} />
        );
      case 4:
        return (
          this.props.dealer !== null && this.props.dealer !== undefined &&
          <TestRideTimingsScreen
            dealer={this.props.dealer}
            changeStep={this.changeStep}
            previousStep={this.previousStep}
            />
        );
      case 5:
        return (
          <ChooseFinancierScreen
            changeStep={this.changeStep}
            navigation={this.props.navigation}
            previousStep={this.previousStep}
          />
        );
      default:
        return (
          <TeamMemberScreen changeStep={this.changeStep} />
        );
    }
  }

  render() {
    const { user } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Loader loading={this.props.loading} />
        <View style={styles.headerView}>
          <View style={styles.brandLogoView}>
            <Image
              style={styles.brandLogoImage}
              source={instaBikeLogo}
            />
            <Text style={{ color: 'white', fontSize: 12 }}>
            Platinum
            </Text>
          </View>
          <View style={styles.seperatorView} />
          <Text style={{ color: 'white', marginHorizontal: 20, fontSize: 10 }}>
            { user !== undefined && user !== null && `${user.first_name} ${user.last_name}` }
          </Text>
          <Text style={{ color: 'white', fontSize: 12 }}>
            {
              user !== undefined && Object.keys(user).length !== 0 &&
              capitalizeFirstLetter(Object.values(user.user_role)[0].role.name)
            }
          </Text>
          <View style={{
            flexDirection: 'row', justifyContent: 'flex-end', flex: 1
          }}
          >
            <Text style={{
              color: 'white', fontSize: 16, fontWeight: 'bold'
            }}
            >
              STEP {this.state.position}/5
            </Text>
          </View>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.mainDataContainer}>
            {this.updateCurrentScreen()}
          </View>
        </View>
        <View style={styles.footerView}>
          <View style={styles.privacyPolicyView}>
            <ButtonWithPlainText
              title="Privacy Policy"
              style={{ backgroundColor: 'transparent' }}
              textStyle={{ fontSize: 10 }}
              handleSubmit={this.privacyPolicyBtnAction}
            />
            <View style={styles.seperatorView} />
            <ButtonWithPlainText
              title="Terms & Conditions"
              style={{ backgroundColor: 'transparent' }}
              textStyle={{ fontSize: 10 }}
              handleSubmit={this.termsAndConditionBtnAction}
            />
          </View>
          <View style={styles.logoView}>
            <Text style={{ color: 'white', fontSize: 10 }}>
          Powered by
            </Text>
            <Image
              style={styles.logoImage}
              source={instaBikeLogo}
            />
          </View>
        </View>
      </View>
    );
  }
}
export default OnboardingScreen;
