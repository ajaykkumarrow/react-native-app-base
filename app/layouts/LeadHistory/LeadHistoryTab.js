import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

import VehicleEnquired from './VehicleEnquired';
import fonts from '../../theme/fonts';
import variables from '../../theme/variables';
import LeadActions from './LeadDetailAction';

const LeadHistoryTab = props => {
  const { navigation } = props;
  const data = {
    navigation,
    dealerId: navigation.getParam('currentDealerId'),
    lead: navigation.getParam('lead')
  };
  return (
    <Navigator screenProps={data} />
  );
};

LeadHistoryTab.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const Navigator = createMaterialTopTabNavigator({
  Actions: LeadActions,
  'Vehicle(s)': VehicleEnquired,
}, {
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: variables.mango,
    inactiveTintColor: variables.lightGrey,
    upperCaseLabel: false,
    style: {
      backgroundColor: 'white',
    },
    labelStyle: {
      fontSize: 12,
      fontFamily: fonts.sourceSansProSemiBold,
    },
    tabStyle: {
      width: 100,
      height: 40
    },
    indicatorStyle: {
      backgroundColor: variables.mango,
    }
  },
});

export default LeadHistoryTab;
