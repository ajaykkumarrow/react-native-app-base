import { StyleSheet } from 'react-native';

const expandableTileStyles = StyleSheet.create({
  unitSoldSelectedStyle: {
    elevation: 6,
    backgroundColor: '#3D92DD',
    shadowColor: 'gray',
    shadowOffset: { width: 6, height: 0 }
  },

  unitSoldSelectedTextStyle: {
    color: '#FDFEFD'
  },

  bikeDetailStyle: {
    backgroundColor: '#91BDE9',
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { width: 3, height: 0 }
  },

  bikeDetailTextStyle: {
    color: '#FDFEFD'
  },

  scooterTileStyle: {
    backgroundColor: '#E3EFFA',
  },

  tileWidth: {
    width: 150
  }
});

export default expandableTileStyles;
