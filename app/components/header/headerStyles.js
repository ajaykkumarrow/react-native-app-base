import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  appHeaderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
    shadowOffset: {
      width: 10,
      height: 10,
    }
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    zIndex: 9999,
    height: 50
  },
  image: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    margin: 5
  },
  headerBellNotify: {
    flex: 1,
    color: '#f16238',
    width: 4,
    height: 4,
    alignSelf: 'center',
    borderRadius: 50
  },
});

export default headerStyles;
