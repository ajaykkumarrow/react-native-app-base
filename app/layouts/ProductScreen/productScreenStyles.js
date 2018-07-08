import { StyleSheet, Dimensions } from 'react-native';

const DEVICEP_HEIGHT = Dimensions.get('window').height;
const DEVICEP_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  FlatListStyles: {
    height: DEVICEP_HEIGHT - 120,
    width: DEVICEP_WIDTH
  },
  FilterFlatListStyles: {
    height: 50,
  }
});

export default styles;
