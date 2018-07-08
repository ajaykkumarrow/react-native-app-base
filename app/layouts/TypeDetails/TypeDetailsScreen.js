import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import styles from './typeDetailsStyles';
import { isStringEmpty } from '../../utils/validations';
import { BookTestRideButton } from '../../components/button/Button';

class TypeDetailsScreen extends Component {
  static propTypes = {
    handleOnContinue: PropTypes.func.isRequired,
    lead: PropTypes.object
  }

  static defaultProps = {
    lead: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      typeFieldError: false,
      lead: {
        ...this.props.lead
      }
    };
  }

  gotoBudget = () => {
    const { lead } = this.state;
    if (lead.search_criteria_type !== undefined) {
      const isTypeSelected = !isStringEmpty(lead.search_criteria_type);
      if (typeof lead.search_criteria_type !== 'undefined'
        && isTypeSelected) {
        this.props.handleOnContinue(lead);
      }
      this.setState({
        typeFieldError: !isTypeSelected
      });
    } else {
      this.setState({
        typeFieldError: true
      });
    }
  }

  selectVehicleType = value => {
    const { lead } = this.state;
    this.setState({
      typeFieldError: false,
      lead: { ...lead, search_criteria_type: value }
    });
  }

  render() {
    const { lead, typeFieldError } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{
            flex: 7, flexDirection: 'row', margin: 50
          }}
          >
            <TouchableHighlight
              style={lead.search_criteria_type === '0' ? [styles.selectedCard, styles.bikeCard] : styles.bikeCard}
              underlayColor="#ffff"
              onPress={() => this.selectVehicleType('0')}
            >
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../../assets/images/type_bike.png')}
                  activeOpacity={0.5}
                  resizeMode="contain"
                />
                <Text style={styles.cardText}>Bike
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={lead.search_criteria_type === '1' ? [styles.selectedCard, styles.scooterCard] : styles.scooterCard}
              underlayColor="#ffff"
              onPress={() => this.selectVehicleType('1')}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../../assets/images/type_scooter.png')}
                  activeOpacity={0.5}
                  resizeMode="contain"
                />
                <Text style={styles.cardText}>Scooter
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          {
            typeFieldError ?
              <Text style={[styles.errorTextStyle]}>Please select vehicle type.
              </Text>
              :
              <Text style={styles.errorTextStyle} />
            }
          <View style={styles.continueBtnContainer}>
            <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'flex-end' }} >
              <BookTestRideButton
                title="CONTINUE"
                handleSubmit={this.gotoBudget}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default TypeDetailsScreen;
