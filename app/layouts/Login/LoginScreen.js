import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TouchableOpacity, Keyboard, ScrollView, Alert, KeyboardAvoidingView, Image } from 'react-native';
import { GradientButtonLarge } from '../../components/button/Button';
import UserInput from '../../components/userInput/UserInput';
import styles from './loginStyles';
import { authUser, resetPassword } from '../../redux/actions/Login/actionCreators';
import { setUser } from '../../redux/actions/User/actionCreators';
import storage from '../../helpers/AsyncStorage';
import { passwordStrengthValidator } from '../../utils/validations';
import { resetScreens } from '../../actions/stackActions';

let isPasswordValid;
@connect(state => ({
  token: state.login.token,
  user: state.login.user,
  newAuthToken: state.login.newAuthToken,
  loading: state.login.loading
}), {
  authUser,
  resetPassword,
  setUser
})
export default class LoginScreen extends Component {
  static propTypes = {
    authUser: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    newAuthToken: PropTypes.string,
    token: PropTypes.string,
    user: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    setUser: PropTypes.func.isRequired
  }

  static defaultProps = {
    token: '',
    newAuthToken: '',
    user: {}
  }

  constructor(props) {
    super(props);
    this.state = ({
      password: '',
      mobile_no: '',
      newPassword: '',
      confirmPassword: '',
      showPass: true,
      showNewPass: true,
      showConfirmPass: true,
      signIn: true,
      showError: false,
      errorTitle: ''
    });
  }

  handleOnInputChange = (param, value) => {
    if (param === 'mobile_no') {
      this.setState({ mobile_no: value });
    } else if (param === 'password') {
      this.setState({ password: value });
    } else if (param === 'newPassword') {
      this.setState({ newPassword: value, showError: false });
    } else if (param === 'confirmPassword') {
      this.setState({
        confirmPassword: value,
        showError: false
      });
    }
  }

  handleSubmit = () => {
    const { navigate } = this.props.navigation;
    const { mobile_no, password } = this.state;
    const data = {
      mobile_no, password
    };
    this.props.authUser(data).then(() => {
      if (this.props.token !== undefined || this.props.token !== null) {
        const currentUser = {
          token: this.props.token,
          is_onboarding_done: this.props.user.is_onboarding_done,
          dealerId: this.props.user.user_type_id,
          user: this.props.user,
          userId: this.props.user.id
        };
        storage.storeJsonValues('currentUser', currentUser);
        this.props.setUser(currentUser);
        Keyboard.dismiss();
        if (this.props.user.is_new) {
          this.setState({
            signIn: false
          });
        } else if (!this.props.user.is_new && !this.props.user.is_onboarding_done) {
          this.props.navigation.dispatch(resetScreens({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'OnboardingScreen' })],
          }));
          navigate('OnboardingScreen');
        } else {
          this.props.navigation.dispatch(resetScreens({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
          }));
          navigate('Dashboard');
        }
      }
    }).catch(error => {
      Alert.alert(
        'Alert',
        error.err.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
        { cancelable: false }
      );
    });
  }

  handleResetPassword = () => {
    const { navigate } = this.props.navigation;
    const { confirmPassword, newPassword } = this.state;
    if (newPassword && confirmPassword) {
      if (isPasswordValid.length && isPasswordValid.alphaNumeric && isPasswordValid.specialChar) {
        storage.getItem('currentUser').then(response => {
          if (confirmPassword === newPassword) {
            const data = {
              newPassword: confirmPassword
            };
            this.props.resetPassword(this.props.user.id, data, response.token).then(() => {
              const currentUser = {
                ...response,
                user: this.props.user,
                token: this.props.newAuthToken,
              };
              storage.storeJsonValues('currentUser', currentUser);
              navigate('OnboardingScreen');
            }).catch(error => {
              console.log('Error.....:', error);
            });
          } else {
            this.setState({
              showError: true,
              errorTitle: 'Password mismatch'
            });
          }
        });
      }
    } else {
      this.setState({
        showError: true,
        errorTitle: 'Please enter the password'
      });
    }
  }

  render() {
    const {
      signIn, newPassword, showError, errorTitle
    } = this.state;
    isPasswordValid = passwordStrengthValidator(newPassword);
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={{ flexDirection: 'column', justifyContent: 'space-around' }}
            activeOpacity={1}
          >
            <Image
              style={styles.backgroundImage}
              source={require('../../assets/images/logoBike.png')}
              activeOpacity={0.5}
            />
            <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-start'
                }}
                onPress={() => {}}
                activeOpacity={0.5}
              >
                <Text style={{
                  color: '#989898', fontSize: 10
                }}
                >Privacy Policy  |
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end'
                }}
                onPress={() => {}}
                activeOpacity={0.5}
              >
                <Text style={{
                  color: '#989898', fontSize: 10
                }}
                >  Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={signIn ? styles.body : styles.bodyResetPassword}
          >
            <KeyboardAvoidingView style={signIn ? styles.form : styles.formResetPassword}>
              <View style={{ flex: 0.1, paddingTop: 10 }} >
                <Image
                  style={{
                    resizeMode: 'contain',
                    width: 50,
                    height: 50,
                  }}
                  source={require('../../assets/images/suzukiLogo.png')}
                  activeOpacity={0.5}
                />
              </View>
              <View style={signIn ? { flex: 0.2, paddingTop: 20 } : { flex: 0.2, paddingTop: 10 }} >
                <Text style={{ color: '#6A777A', fontSize: 24, fontWeight: 'bold' }}>
                  {signIn ? 'Sign In' : 'Reset Your Password'}
                </Text>
                <Text style={{ color: '#6A777A', fontSize: 14, fontWeight: 'bold' }}>To continue Instabike</Text>
              </View>
              {
                signIn ?
                  <View style={{ flex: 0.5 }} >
                    <UserInput
                      param="mobile_no"
                      placeholder="Mobile Number"
                      autoCapitalize="none"
                      returnKeyType="done"
                      keyboardType="numeric"
                      value={this.state.mobile_no}
                      onChange={this.handleOnInputChange}
                      autoCorrect={false}
                      containerStyle={styles.userInputContainer}
                      textInputStyle={styles.textInputStyle}
                      maxLength={10}
                      showGradient
                    />
                    <UserInput
                      secureTextEntry={this.state.showPass}
                      param="password"
                      placeholder="Password"
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={this.state.password}
                      onChange={this.handleOnInputChange}
                      autoCorrect={false}
                      containerStyle={styles.userInputContainer}
                      textInputStyle={styles.textInputStyle}
                      maxLength={30}
                      showGradient
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute', right: 20, top: 90, zIndex: 99
                      }}
                      onPress={() => { this.setState({ showPass: !this.state.showPass }); }}
                      activeOpacity={0.6}
                    >
                      <Icon
                        name={this.state.showPass ? 'eye' : 'eye-slash'}
                        size={18}
                        color={this.state.showPass ? '#f3842d' : '#a4a4a4'} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', paddingTop: 20 }} >
                      <GradientButtonLarge
                        disabled={this.props.loading}
                        loadingText="Logging in..."
                        loading={this.props.loading}
                        title="LOGIN"
                        handleSubmit={this.handleSubmit}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ marginTop: 10 }}
                      onPress={() => {}}
                      activeOpacity={0.5}
                    >
                      <Text style={{ color: '#989898', paddingBottom: 30 }} >Need Help?</Text>
                    </TouchableOpacity>
                  </View> :
                  <View style={{ flex: 0.5 }} >
                    <UserInput
                      param="newPassword"
                      placeholder="New Password"
                      secureTextEntry={this.state.showNewPass}
                      autoCapitalize="none"
                      returnKeyType="done"
                      value={this.state.newPassword}
                      onChange={this.handleOnInputChange}
                      autoCorrect={false}
                      containerStyle={styles.userInputContainer}
                      maxLength={30}
                      showGradient
                    />
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 25, top: 20 }}
                      onPress={() => { this.setState({ showNewPass: !this.state.showNewPass }); }}
                      activeOpacity={0.5}
                    >
                      <Icon
                        name={this.state.showNewPass ? 'eye' : 'eye-slash'}
                        size={18}
                        color={this.state.showNewPass ? '#f3842d' : '#a4a4a4'} />
                    </TouchableOpacity>
                    <UserInput
                      param="confirmPassword"
                      placeholder="Re-Type New Password"
                      returnKeyType="done"
                      autoCapitalize="none"
                      secureTextEntry={this.state.showConfirmPass}
                      value={this.state.confirmPassword}
                      onChange={this.handleOnInputChange}
                      autoCorrect={false}
                      containerStyle={styles.userInputContainer}
                      maxLength={30}
                      showError={showError}
                      errorTitle={errorTitle}
                      showGradient
                    />
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 25, top: 90 }}
                      onPress={() => { this.setState({ showConfirmPass: !this.state.showConfirmPass }); }}
                      activeOpacity={0.5}
                    >
                      <Icon
                        name={this.state.showConfirmPass ? 'eye' : 'eye-slash'}
                        size={18}
                        color={this.state.showConfirmPass ? '#f3842d' : '#a4a4a4'} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                      <Text
                        style={isPasswordValid.length
                          ? { color: '#008000', fontSize: 10 }
                          : { color: '#a4a4a4', fontSize: 10 }}
                      >8 Characters
                      </Text>
                      <Text
                        style={isPasswordValid.alphaNumeric
                          ? { color: '#008000', fontSize: 10 }
                          : { color: '#a4a4a4', fontSize: 10 }}
                      >Alpha-Numeric
                      </Text>
                      <Text
                        style={isPasswordValid.specialChar
                          ? { color: '#008000', fontSize: 10 }
                          : { color: '#a4a4a4', fontSize: 10 }}
                      >1 Special Character
                      </Text>
                    </View>
                    <View style={{
                      flexDirection: 'column', alignItems: 'flex-start'
                    }}>
                      <GradientButtonLarge
                        title="RESET"
                        loaderStyle={{ left: 30, position: 'absolute' }}
                        disabled={this.props.loading}
                        loadingText="Resetting password..."
                        loading={this.props.loading}
                        handleSubmit={this.handleResetPassword}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ marginTop: 10 }}
                      onPress={() => {}}
                      activeOpacity={0.5}
                    >
                      <Text style={{ color: '#989898', paddingBottom: 30 }} >Need Help?</Text>
                    </TouchableOpacity>
                  </View>
              }
            </KeyboardAvoidingView>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Powered By</Text>
              <Image
                style={{
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/instabikeLogo.png')}
                activeOpacity={0.5}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
