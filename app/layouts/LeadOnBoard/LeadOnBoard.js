import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, Image, TextInput, TouchableHighlight, TouchableOpacity
} from 'react-native';
import styles from './leadOnBoardStyles';

class LeadOnBoardScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  gotoHome = () => {
    const { navigate } = this.props.navigation;
    navigate('Dashboard');
  }

  gotoSearch = () => {
    const { navigate } = this.props.navigation;
    navigate('MyProductsScreen');
  }

  createNewLead = () => {
    const { navigate } = this.props.navigation;
    navigate('CreateNewLead');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ flex: 0.08, backgroundColor: '#454545' }}
            onPress={this.gotoHome}
            activeOpacity={0.5}
          >
            <Image
              style={{ alignSelf: 'center', justifyContent: 'center' }}
              resizeMode="contain"
              source={require('../../assets/images/back.png')}
            />
          </TouchableOpacity>
          <View style={{ flex: 0.92, flexDirection: 'row' }}>
            <Text style={styles.headerText}>Create New Lead</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.formLayout}>
            <View style={styles.formContent}>
              <View style={styles.searchContainer}>
                <TouchableOpacity
                  style={styles.searchWrapper}
                  activeOpacity={0.5}
                  onPress={() => {}}
                >
                  <TextInput
                    inlineImageLeft="search_icon"
                    placeholder="Search for product"
                    inlineImagePadding={10}
                    underlineColorAndroid="transparent"
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 2, flexDirection: 'row' }}>
                <TouchableHighlight
                  style={styles.guestCard}
                  underlayColor="#f16537"
                  onPress={this.createNewLead}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/guide_guest.png')}
                      activeOpacity={0.5}
                      resizeMode="center"
                    />
                    <Text style={styles.cardText}>Guide Guest
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.rideCard}
                  underlayColor="#f16537"
                  onPress={() => {}}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/test_ride.png')}
                      activeOpacity={0.5}
                      resizeMode="center"
                    />
                    <Text style={styles.cardText}>Book a Test Ride
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default LeadOnBoardScreen;
