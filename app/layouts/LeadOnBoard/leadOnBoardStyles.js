import { StyleSheet } from 'react-native';
import variables from '../../theme/variables';
import fonts from '../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: variables.headerBackground,
  },
  headerText: {
    color: '#fff',
    alignSelf: 'center',
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: fonts.sourceSansProRegular
  },
  body: {
    flex: 9,
  },
  formLayout: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 50,
    marginVertical: 20
  },
  formContent: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 100,
    marginVertical: 50
  },
  searchContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  searchWrapper: {
    flex: 1,
    marginHorizontal: 40,
    paddingLeft: 10,
    borderColor: '#efefef',
    borderWidth: 2
  },
  guestCard: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 45,
    marginRight: 30,
    marginVertical: 20,
    elevation: 10
  },
  rideCard: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 45,
    marginVertical: 20,
    elevation: 10
  },
  cardText: {
    fontSize: 14,
    fontFamily: fonts.sourceSansProRegular
  }
});

export default styles;
