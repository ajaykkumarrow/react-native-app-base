import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

import FreshLeads from './FreshLeads';
import HotLeads from './HotLeads';
import ColdLeads from './ColdLeads';
import WarmLeads from './WarmLeads';
import InvoicedLeads from './InvoicedLeads';
import LostLeads from './LostLeads';

const HandleTabNavigation = props => {
  const newObj = {
    leads: props.leads || [],
    executives: props.executives || [],
    count: props.count || [],
    stackNavigation: props.stackNavigation
  };
  return (
    <Navigator screenProps={newObj} />
  );
};

HandleTabNavigation.propTypes = {
  leads: PropTypes.array,
  executives: PropTypes.array,
  count: PropTypes.array,
  stackNavigation: PropTypes.object.isRequired
};

HandleTabNavigation.defaultProps = {
  leads: [],
  executives: [],
  count: []
};

const Navigator = createMaterialTopTabNavigator({
  Fresh: {
    screen: FreshLeads
  },
  Hot: {
    screen: HotLeads
  },
  Cold: {
    screen: ColdLeads
  },
  Warm: {
    screen: WarmLeads
  },
  Invoiced: {
    screen: InvoicedLeads
  },
  Lost: {
    screen: LostLeads
  }
}, {
  animationEnabled: true,
  tabBarOptions: {
    upperCaseLabel: false,
    labelStyle: {
      fontSize: 12,
    },
    tabStyle: {
      width: 100,
    },
    activeTintColor: '#ffa166',
    indicatorStyle: {
      backgroundColor: '#ffa166'
    },
    inactiveTintColor: 'black',
    style: {
      backgroundColor: 'white'
    }
  }
});

export default HandleTabNavigation;
