import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableOpacity, Image
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import storage from '../../helpers/AsyncStorage';
import TypeDetailsScreen from '../TypeDetails/TypeDetailsScreen';
import BudgetDetailsScreen from '../BudgetDetails/BudgetDetailsScreen';
import BasicDetailsScreen from '../BasicDetails/BasicDetailsScreen';
import StepperScreen from '../../components/Stepper/StepperScreen';
import { clearLead } from '../../redux/actions/CreateNewLead/actionCreators';

@connect(null, {
  clearLead
})
class CreateNewLeadScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    clearLead: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      lead: {},
      dealerId: ''
    };
  }

  componentDidMount() {
    this.props.clearLead();
    storage.getItem('currentUser').then(response => {
      this.setState({
        dealerId: response.dealerId
      });
    });
  }

  componentWillUnmount() {
    this.props.clearLead();
  }

  continueBtnAction = updatedLead => {
    const { lead } = this.state;
    if (updatedLead && Object.keys(updatedLead).length !== 0) {
      this.setState({
        position: this.state.position += 1,
        lead: updatedLead
      });
    } else {
      this.setState({
        position: this.state.position += 1,
        lead
      });
    }
  }

  backBtnAction = () => {
    this.setState({ position: this.state.position -= 1 });
    if (this.state.position < 0) {
      const {
        navigate
      } = this.props.navigation;
      navigate('Dashboard');
    }
  }

  render() {
    const { position, dealerId, lead } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          elevation: 10,
          backgroundColor: '#fff'
        }}
        >
          <View style={{
            flex: 1.8, elevation: 1, backgroundColor: '#fff', paddingHorizontal: 5, zIndex: 1
          }}
          >
            <StepperScreen position={this.state.position} />
            <View style={{
              position: 'absolute', top: 0, right: 0, zIndex: 99
            }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.dispatch(NavigationActions.back());
                }}
                activeOpacity={0.5}
              >
                <Image
                  resizeMode="contain"
                  source={require('../../assets/images/close.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 8.2 }}>
            {
              position === 0 &&
              <BasicDetailsScreen
                handleOnContinue={this.continueBtnAction}
                dealerId={dealerId}
                lead={lead}
                />
            }
            {
              position === 1 &&
              <TypeDetailsScreen
                handleOnContinue={this.continueBtnAction}
                lead={lead}
                handleOnBack={this.backBtnAction}
                />
            }
            {
              position === 2 &&
              <BudgetDetailsScreen
                handleOnContinue={this.continueBtnAction}
                handleOnBack={this.backBtnAction}
                lead={lead}
                navigation={this.props.navigation}
                dealerId={dealerId}
                />
            }
          </View>
        </View>
      </View>
    );
  }
}

export default CreateNewLeadScreen;
