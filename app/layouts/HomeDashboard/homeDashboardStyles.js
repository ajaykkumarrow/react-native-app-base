import { StyleSheet } from 'react-native';

export const homeDashboardStyles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f3f3f2' },
  scrollContainer: {
    height: 130,
    backgroundColor: 'white',
    padding: 10,
  },
  summaryContainer: { flex: 1 },
  summaryView: {
    flex: 2,
  },
  todaySummaryText: {
    textAlign: 'left',
    color: '#505050',
    paddingLeft: 10,
    fontSize: 15,
  },
  todaySummaryView: {
    flex: 8,
    flexDirection: 'row'
  },
  summarySpringView: {
    borderRadius: 4,
    alignSelf: 'stretch',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    backgroundColor: 'white',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    width: 150,
    marginLeft: 10,
    marginRight: 10
  },
  monthlyPerformanceOverView: {
    textAlign: 'left',
    color: '#505050',
    paddingLeft: 10,
    fontSize: 15,
  },
  updateInventory: {
    backgroundColor: 'white',
    flex: 1,
    color: '#f0593a',
    fontSize: 13,
    paddingTop: 15,
    paddingLeft: 15,
    paddingHorizontal: 10
  },
  leadDistributionContent: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 20,
    flex: 8,
    elevation: 2,
    borderRadius: 4,
    shadowColor: '#DFE5F0',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  leadDistributionGraph: {
    backgroundColor: 'white',
    paddingLeft: 70,
    paddingRight: 70,
    flex: 7.5,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  leadDistributionLegend: {
    flex: 1,
    borderRadius: 50,
    height: 10,
    width: 10,
    alignSelf: 'center'
  },
  leadDistributionLegendText: {
    flex: 9,
    borderRadius: 50,
    paddingLeft: 5,
    alignSelf: 'center'
  },
  testRideStatusContent: {
    backgroundColor: 'white',
    elevation: 2,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 20,
    shadowColor: '#DFE5F0',
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  testRideStatusChart: {
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    flex: 7.5,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  testRideStatusButton: {
    justifyContent: 'center',
    width: 160,
    height: 50,
    borderRadius: 4
  },
  testRideStatusButtonAnimate: {
    shadowOffset: {
      width: 5,
      height: 5,
    },
    backgroundColor: 'white',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
  },
  updateInventoryButtonContent: {
    borderRadius: 5,
    margin: 2,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  testRideStatusLabel: {
    elevation: 2,
    flex: 1.5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  testRideStatusLabelContent: {
    flex: 1,
    flexDirection: 'row'
  },
  testRideStatusLabelContentText: {
    borderRadius: 50,
    height: 10,
    width: 10,
    alignSelf: 'center',
  }
});

export const homeDashboardHeaderStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  headerTextContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    borderRightColor: '#2E2C2C',
    borderRightWidth: 1
  },
  headerDateContent: {
    color: 'gray',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRightColor: '#2E2C2C',
    borderRightWidth: 1
  },
  headerSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightColor: '#2E2C2C',
    borderRightWidth: 1
  },
  headerBellNotify: {
    flex: 1,
    color: '#f16238',
    width: 4,
    height: 4,
    alignSelf: 'center',
    borderRadius: 50
  },
  headerSearchContentText: {
    paddingTop: 10,
    height: 40,
    color: 'white',
    width: 190
  }

});

