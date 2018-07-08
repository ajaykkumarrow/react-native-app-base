import { createMaterialTopTabNavigator } from 'react-navigation';
import FollowUpToday from './FollowUpToday';
import FollowUpDone from './FollowUpDone';
import fonts from '../../theme/fonts';

export default createMaterialTopTabNavigator({
  'Follow Up Today': FollowUpToday,
  'Follow Up Done': FollowUpDone
}, {
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#ee4b40',
    inactiveTintColor: '#aaaeb3',
    style: {
      backgroundColor: 'white',
      paddingLeft: 16
    },
    labelStyle: {
      fontSize: 12,
      fontFamily: fonts.sourceSansProSemiBold,
    },
    tabStyle: {
      width: 150,
    },
    indicatorStyle: {
      marginLeft: 16,
      backgroundColor: '#ee4b40',
    }
  }
});
