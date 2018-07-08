import { StyleSheet } from 'react-native';

const bankSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF1F9',
    paddingTop: 20,
  },
  unSelectedItemBlock: {
    flexDirection: 'row',
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: '#DCE8FA',
    backgroundColor: '#FFFFFF',
  },
  selectedItemBlock: {
    flexDirection: 'row',
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: '#d6d7da',
    backgroundColor: '#F1F6FD',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemMeta: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 6,
    flexDirection: 'row',
    height: 40,
  },
  selectedItemMeta: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 6,
    flexDirection: 'row',
    height: 40,
  },
  itemNameView: {
    flex: 1,
    justifyContent: 'center',

  },
  headertext: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  headerView: {
    backgroundColor: '#DCE8FC',
  },
  selectedRadioBtnView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unSelectedRadioBtnView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  unSelectedRadioBtnStyle: {
    paddingTop: 10,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    justifyContent: 'center',
  },
  selectedrRadioBtnStyle: {
    paddingTop: 10,
    backgroundColor: 'green',
    width: 20,
    height: 20,
    justifyContent: 'center',

  },
  bookARideBtnStyle: {
    width: 140,
    paddingTop: 6,
    alignItems: 'center',
    backgroundColor: '#007CDA',
    borderRadius: 20,
    margin: 5,
  },
});

export default bankSelectionStyles;
