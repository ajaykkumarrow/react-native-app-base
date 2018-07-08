import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, BackHandler } from 'react-native';
import { StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import LeadDashboard from '../LeadDashboard/LeadDashboard';
import storage from '../../helpers/AsyncStorage';
import SideNav from '../../components/sideNav/SideNav';
import Home from '../../assets/images/ic_home_selected.png';
import DealerShip from '../../assets/images/ic_mydealership_selected.png';
import Products from '../../assets/images/ic_products_selected.png';
import Team from '../../assets/images/ic_team_selected.png';
import TestRide from '../../assets/images/ic_testride_selected.png';
import updateInventory from '../../assets/images/ic_updateinventory_selected.png';
import Logout from '../../assets/images/Logout.png';
import Lead from '../../assets/images/ic_target_selected.png';
import styles from './dashboardStyles';
import { clearUser } from '../../redux/actions/User/actionCreators';
import MyProductsScreen from '../MyProducts/MyProductsScreen';
import HomeDashBoard from '../HomeDashboard/HomeDashboard';
import UpdateInventoryScreen from '../UpdateInventory/UpdateInventoryScreen';

import { handleSideNav } from '../../redux/actions/Global/actionCreators';

@connect(state => ({
  currentUser: state.user.currentUser,
  isSideNavOpen: state.global.isSideNavOpen
}), {
  clearUser,
  handleSideNav
})
export default class DashboardScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    clearUser: PropTypes.func.isRequired,
    isSideNavOpen: PropTypes.bool.isRequired,
    handleSideNav: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          name: 'Home',
          image: Home,
          icon: 'home',
          type: 'Feather',
          handleSubmit: () => this.onSideNavClick(1)
        },
        {
          id: 2,
          name: 'Leads',
          image: Lead,
          icon: 'target',
          type: 'MaterialCommunityIcons',
          handleSubmit: () => this.onSideNavClick(2)
        },
        {
          id: 3,
          name: 'Products',
          image: Products,
          icon: 'handbag',
          type: 'SimpleLineIcons',
          handleSubmit: () => this.onSideNavClick(3)
        },
        {
          id: 4,
          name: 'Team',
          image: Team,
          icon: 'user-o',
          type: 'FontAwesome',
          handleSubmit: () => this.onSideNavClick(4)
        },
        {
          id: 5,
          name: 'Test Ride',
          image: TestRide,
          icon: 'timer',
          type: 'MaterialIcons',
          handleSubmit: () => this.onSideNavClick(5)
        },
        {
          id: 6,
          name: 'Update Inventory',
          icon: 'folder-alt',
          image: updateInventory,
          type: 'SimpleLineIcons',
          handleSubmit: () => this.onSideNavClick(6)
        },
        {
          id: 8,
          name: 'Dealers',
          image: DealerShip,
          icon: 'sort-by-alpha',
          type: 'MaterialIcons',
          handleSubmit: () => this.onSideNavClick(7)
        },
        {
          id: 9,
          name: 'Logout',
          image: Logout,
          icon: 'logout',
          type: 'SimpleLineIcons',
          handleSubmit: this.onLogout
        }
      ],
      clickedPosition: 1
    };
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload)));
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload)));
  }

  componentWillUnmount() {
    if (this._didFocusSubscription) {
      this._didFocusSubscription.remove();
    }
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
  }

  onSideNavClick = position => {
    this.setState({
      clickedPosition: position
    });
    if (position > 9) {
      this.props.handleSideNav(false);
    }
  }

  onLogout = () => {
    const { navigate } = this.props.navigation;
    this.props.clearUser();
    storage.clearValues();
    navigate('Login');
  }

  /**
   * payload can be retrieved as parameter
   */
  onBackButtonPressAndroid = () => {
    const { clickedPosition } = this.state;
    if (clickedPosition === 1 && this.props.navigation.isFocused()) {
      Alert.alert(
        'Exit App',
        'Dou you want to quit?', [{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }, {
          text: 'OK',
          onPress: () => BackHandler.exitApp()
        }], {
          cancelable: false
        }
      );
    } else {
      this.props.navigation.dispatch(StackActions.pop({
        n: 1
      }));
    }
    return true;
  }

  createNewLead = () => {
    const { navigate } = this.props.navigation;
    navigate('CreateNewLead');
  }

  renderMainView = () => {
    switch (this.state.clickedPosition) {
      case 1:
        return (<HomeDashBoard
          {...this.props}
          setHeader={this.setHeader} />);
      case 2:
        return <LeadDashboard {...this.props} />;
        // this.props.navigation.navigate('LeadHistory', this.props.currentUser);
        // break;
      case 3:
        return (<MyProductsScreen
          navigation={this.props.navigation}
          leadOnBoard={this.createNewLead} />);
      case 4:
        break;
      case 5:
        break;
      case 6:
        return <UpdateInventoryScreen />;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      default:
        break;
    }
  }

  render() {
    const { isSideNavOpen } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          {isSideNavOpen &&
            <SideNav
              navigation={this.props.navigation}
              tileData={this.state.data}
              selectedTile={this.state.clickedPosition}
              />
          }
          <View style={{ flex: 12, backgroundColor: '#ECF1F8' }} >
            {this.renderMainView()}
          </View>
        </View>
      </View>
    );
  }
}
