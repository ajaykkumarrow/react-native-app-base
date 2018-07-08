import { StyleSheet } from 'react-native';
import variables from '../../theme/variables';

export const cardStyles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    margin: 10,
    maxWidth: 280,
    borderRadius: 4
  },
  cardHeaderWrapper: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#285279',
  },
  cardSubheaderWrapper: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mb10: {
    marginBottom: 10,
  },
  cardSubheader: {
    fontWeight: 'normal',
    fontSize: 10,
    color: '#ACBCCB'
  },
  cardSubheaderDate: {
    fontWeight: 'normal',
    fontSize: 20,
    color: '#96A5BC'
  },
  cardSubheaderMonth: {
    fontWeight: 'normal',
    fontSize: 12,
    color: '#ACBCCB'
  },
  tileWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10
  },
  cardInfoTextOne: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 5
  },
  cardInfoTextTwo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20
  },
  cardViewSeperator: {
    borderBottomColor: variables.secondaryTextColor,
    paddingTop: 5,
    borderBottomWidth: 1
  },
  cardButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5
  },
  cardLongerTextHandler: {
    flex: 0.8
  },
  smallCircle: {
    height: 6,
    width: 6,
    borderRadius: 30,
    margin: 8,
    backgroundColor: '#ADB9CC'
  },
  commentSection: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#ACBCCB'
  },
  invoicedCardSubheaderWrapper: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  handledByLabel: {
    fontSize: 10
  },
  dealerSalesLabel: {
    fontSize: 10,
    color: '#1B4770',
    paddingLeft: 5
  },
  bankInformation: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#DEE7F3',
    borderStyle: 'dotted',
    flexDirection: 'row'
  },
  dateStyle: {
    fontSize: 20,
    color: '#96A5BC'
  },
  monthStyle: {
    fontSize: 15,
    color: '#96A5BC'
  },
  dateMonthWrapper: {
    paddingLeft: 10
  },
  amountInfoStyles: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  priceStyle: {
    color: '#17446E'
  },
  amountLabel: {
    color: '#A9B6CA',
    paddingTop: 3
  },
  logoWrapper: {
    margin: 10
  },
  logoSize: {
    width: 90,
    height: 30
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    elevation: 12,
    width: 300,
    height: 300
  },
  flexOne: {
    flex: 1
  },
  paddingOne: {
    padding: 1
  },
  bgWhite: {
    backgroundColor: 'white'
  },
  cardTextColor: {
    color: '#3F92DD'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  cardButton: {
    borderRadius: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
    paddingLeft: 15
  }
});

export const teamPerformanceCardStyles = StyleSheet.create({
  container: {
    borderColor: '#C7DAF6',
    borderWidth: 2,
    maxWidth: 300,
    padding: 10,
    backgroundColor: 'white'
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  userImageStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'blue',
  },
  editImageStyle: {
    position: 'absolute',
    right: 10
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  greenDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'green',
    marginLeft: 5
  },
  followUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  dividerStyle: {
    height: 1,
    backgroundColor: 'gray'
  },
  newLeadsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  unitsInvoicedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  dividerStyleWithTopMargin: {
    height: 1,
    backgroundColor: 'gray',
    marginTop: 10
  }
});
