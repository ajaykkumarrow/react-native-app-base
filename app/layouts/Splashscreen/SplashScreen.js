import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import storage from '../../helpers/AsyncStorage';
import variables from '../../theme/variables';
import { setUser } from '../../redux/actions/User/actionCreators';
import { resetScreens } from '../../actions/stackActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: variables.primaryBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    position: 'absolute',
    width: 300,
    height: 100
  },
});

@connect(
  null,
  { setUser }
)
class SplashScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;
    setTimeout(() => {
      storage.getAllKeys((error, response) => {
        if (response.indexOf('currentUser') !== -1) {
          storage.getJsonObject('currentUser', currentUser => {
            let userLoggedIn = false;
            if (currentUser !== undefined && currentUser !== null && currentUser.is_onboarding_done) {
              userLoggedIn = true;
            }
            if (userLoggedIn) {
              this.props.setUser(currentUser);
            }
            const onLoadRoute = userLoggedIn ? 'Dashboard' : 'Login';
            const resetAction = resetScreens({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: onLoadRoute })],
            });
            this.props.navigation.dispatch(resetAction);
            navigate(onLoadRoute);
          });
        } else {
          const resetAction = resetScreens({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
          });
          this.props.navigation.dispatch(resetAction);
          navigate('Login');
        }
      });
    }, 1500);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require('../../assets/images/instabike_logo_banner.png')}
        />
      </View>
    );
  }
}

export default SplashScreen;
