import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity,
  ScrollView, processColor } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Components
import SpringView from '../../components/animated/SpringView';
import { GradientCountTile } from '../../components/tile/Tile';

// Styles
import { homeDashboardStyles, homeDashboardHeaderStyles } from './homeDashboardStyles';

// Graphs
import TargetGraph from '../../components/charts/TargetGraph';
import PieChartScreen from './../../components/charts/Pie';

// Card
import TeamPerformance from './TeamPerformance';

// Images
import bikeImg from './../../assets/images/type_bike.png';
import scooterImg from './../../assets/images/type_scooter.png';

// Header HOC
import AppHeader from '../../components/header/Header';

import { getLeadsMonthlySummaryCount } from '../../redux/actions/HomeDashBoard/actionCreators';

@connect(
  state => ({
    currentUser: state.user.currentUser,
    leadsSummaryCount: state.homeDashboard.leadsSummaryCount
  }),
  {
    getLeadsMonthlySummaryCount
  }
)
class HomeDashboard extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getLeadsMonthlySummaryCount: PropTypes.func.isRequired
  }
  // eslint-disable-next-line  react/sort-comp
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentUser && prevState.userName === '') {
      const { user } = nextProps.currentUser;
      return {
        userName: `${user.first_name} ${user.last_name}`,
      };
    }
    if (nextProps.leadsSummaryCount) {
      const {
        followup,
        newLeads,
        invoice,
        bike,
        scooter
      } = nextProps.leadsSummaryCount;
      const { todaySummary, monthlySummary } = prevState;
      todaySummary[0].tileCount = newLeads || 0;
      todaySummary[1].tileCount = followup || 0;
      todaySummary[2].tileCount = invoice || 0;
      monthlySummary[0].tileCount = bike || 0;
      monthlySummary[1].tileCount = scooter || 0;
      monthlySummary[2].tileCount = `${invoice && newLeads ? ((invoice / newLeads) * 100).toFixed(0) : 0} %`;
      return {
        todaySummary
      };
    }
    return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      availableBikes: '02',
      ongoingTestRide: '05',
      userName: '',
      teamMembers: [
        {
          id: 1,
          name: 'Althaf Roshan',
          followupDone: 10,
          target: 20,
          pending: 10,
          hot: 2,
          cold: 2,
          newLeads: 10,
          monthlyUnitsInvoiced: 10,
          monthlyUnitTarget: 50
        },
        {
          id: 1,
          name: 'Rajesh Singh',
          followupDone: 8,
          target: 20,
          pending: 15,
          hot: 3,
          warm: 5,
          newLeads: 15,
          monthlyUnitsInvoiced: 38,
          monthlyUnitTarget: 40
        },
        {
          id: 1,
          name: 'Vijay Kumar',
          followupDone: 10,
          target: 20,
          pending: 10,
          hot: 2,
          warm: 2,
          newLeads: 10,
          monthlyUnitsInvoiced: 30,
          monthlyUnitTarget: 50
        },
        {
          id: 1,
          name: 'Arun Venugopal',
          followupDone: 10,
          target: 14,
          pending: 50,
          hot: 4,
          warm: 5,
          newLeads: 17,
          monthlyUnitsInvoiced: 25,
          monthlyUnitTarget: 30
        }
      ],
      targets: [
        {
          id: 1,
          targetName: 'Overall Completion',
          mtd: 100,
          mt: 100,
          dt: 120,
        },
        {
          id: 2,
          targetName: 'Scooter Target Completion',
          mtd: 10,
          mt: 80,
          dt: 96,
        },
        {
          id: 3,
          targetName: 'Bike Target Completion',
          mtd: 8,
          mt: 20,
          dt: 24,
        }
      ],
      todaySummary: [
        {
          id: 1,
          text: 'Leads created',
          tileCount: '',
          colors: ['#ef563c', '#f3842d'],
          style: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 5
          },
          countStyle: { fontSize: 23, alignSelf: 'center' },
          textStyle: { fontSize: 15, paddingLeft: 10, fontWeight: '400' },
          onClick: () => {
            const { navigate } = this.props.navigation;
            navigate('NewLeadsOverview');
          }
        },
        {
          id: 2,
          text: 'Leads to follow',
          tileCount: '',
          hasDivide: false,
          colors: ['#0ac7c4', '#51deb7'],
          style: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 5
          },
          countStyle: { fontSize: 23, alignSelf: 'center' },
          textStyle: { fontSize: 15, paddingLeft: 10, fontWeight: '400' },
          onClick: () => {
            const { navigate } = this.props.navigation;
            navigate('LeadFollowUpScreen');
          }
        },
        {
          id: 3,
          text: 'Units Invoiced',
          tileCount: '',
          colors: ['#5a35da', '#475fdd'],
          style: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 5
          },
          countStyle: { fontSize: 23, alignSelf: 'center' },
          textStyle: {
            fontSize: 15, paddingTop: 5, paddingLeft: 10, fontWeight: '400'
          }
        }
      ],
      monthlySummary: [
        {
          id: 1,
          text: '',
          tileCount: '',
          hasDivide: false,
          hasImage: true,
          imgSrc: bikeImg,
          colors: ['white', 'white'],
          style: {
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            borderRadius: 5
          },
          imgStyle: {
            marginTop: 20,
            width: 70,
            height: 80,
            alignSelf: 'center'
          },
          countStyle: {
            color: 'black', alignSelf: 'center', fontWeight: '400', fontSize: 23
          },
          textStyle: { color: '#5a35da', paddingTop: 5, fontWeight: '400' }
        },
        {
          id: 2,
          text: '',
          tileCount: '',
          hasImage: true,
          hasDivide: false,
          imgSrc: scooterImg,
          colors: ['white', 'white'],
          style: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 5
          },
          imgStyle: {
            marginTop: 15,
            width: 50,
            height: 100,
            padding: 20,
            alignSef: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          },
          countStyle: {
            color: '#061b8b', alignSelf: 'center', fontWeight: '400', fontSize: 23
          },
          textStyle: { color: '#5a35da', paddingTop: 5 }
        },
        /* *  {
          id: 1,
          text: 'Units Invoiced',
          tileCount: '40/100',
          hasDivide: true,
          colors: ['white', 'white'],
          style: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 5
          },
          countStyle: { color: '#5a35da', alignSelf: 'center' },
          textStyle: { color: '#5a35da', paddingTop: 5, fontWeight: '400' }
        }, * */
        {
          id: 3,
          text: 'Leads converted',
          tileCount: '',
          colors: ['#f7f7f7', '#f7f7f7'],
          style: { flex: 1, justifyContent: 'center', borderRadius: 5 },
          countStyle: { color: 'black', paddingLeft: 15 },
          textStyle: {
            color: '#494949', fontSize: 15, paddingTop: 5, paddingLeft: 10, fontWeight: '400'
          }
        }
      ],
      leadDistribution: {
        values: [
          { value: 20, label: 'Pending' },
          { value: 20, label: 'Overdue' },
          { value: 20, label: 'UnAssigned' }
        ],
        styledCenterText: { text: '60 To action', color: processColor('black'), size: 25 },
        colors: [
          '#5bccd3',
          '#5c86fd',
          '#afafaf'
        ],
        label: 'Lead Distribution'
      },
      testRideBookings: {
        values: [
          { value: 20, label: 'Bikes' },
          { value: 20, label: 'Scooters' }
        ],
        styledCenterText: { text: '20', color: processColor('black'), size: 50 },
        colors: [
          '#5bccd3',
          '#5c86fd'],
        label: 'Test Ride Bookings'
      },
    };
  }

  componentDidMount() {
    this.props.getLeadsMonthlySummaryCount();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.getLeadsMonthlySummaryCount();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onCreateNewLeadClicked = () => {
    const {
      navigate
    } = this.props.navigation;
    navigate('CreateNewLead');
  }

  onSearchProductClick = () => {
    this.props.navigation.navigate('SearchLead', { isFilterOpen: false });
  }

  header = () => {
    const {
      userName
    } = this.state;
    return (
      <View style={homeDashboardHeaderStyles.headerContainer}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={homeDashboardHeaderStyles.headerTextContent}>
            <Text style={{ color: 'white', paddingHorizontal: 5 }}>
              {userName}
            </Text>
            <Text style={{ color: 'gray', paddingHorizontal: 5 }} />
          </View>
          <View style={[homeDashboardHeaderStyles.headerDateContent, { display: 'none' }]}>
            <Text style={{ color: 'white', paddingHorizontal: 5 }} />
          </View>
          <TouchableOpacity
            style={homeDashboardHeaderStyles.headerSearchContent}
            onPress={this.onSearchProductClick}>
            <Text style={{ paddingHorizontal: 10 }}><Icon name="search" size={21} color="white" /></Text>
            <Text style={homeDashboardHeaderStyles.headerSearchContentText}>Search for Lead
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }} />
        </View>
      </View>
    );
  }

  navigateTo = screen => {
    this.props.navigation.navigate(screen);
  }

  render() {
    const { targets, todaySummary, monthlySummary } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <AppHeader navigation={this.props.navigation}>
          {this.header()}
        </AppHeader>
        <View style={homeDashboardStyles.mainContainer}>
          <ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[homeDashboardStyles.scrollContainer, {}]}>
                <View style={{
                  height: 30,
                  flexDirection: 'row',
                }} >
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={homeDashboardStyles.todaySummaryText} >
                      Monthly summary
                    </Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Text style={homeDashboardStyles.monthlyPerformanceOverView} />
                  </View>
                </View>
                <View style={{
                  height: 65, marginVertical: 5, flexDirection: 'row'
                }}>
                  {todaySummary.map(summary => (
                    <SpringView
                      duration={1000}
                      springValue={0.1}
                      key={summary.id}
                      style={homeDashboardStyles.summarySpringView}>
                      <GradientCountTile
                        id={summary.id}
                        onClick={summary.onClick}
                        colors={summary.colors}
                        tileCount={summary.tileCount}
                        tileText={summary.text}
                        hasDivide={summary.hasDivide}
                        imgStyle={summary.imgStyle}
                        hasImage={summary.hasImage}
                        imgSrc={summary.imgSrc}
                        style={summary.style}
                        countStyle={summary.countStyle}
                        textStyle={summary.textStyle}
                    />
                    </SpringView>))}
                  {monthlySummary.map(summary => (
                    <SpringView
                      key={summary.id}
                      duration={1000}
                      springValue={0.1}
                      style={homeDashboardStyles.summarySpringView}
                  >
                      <GradientCountTile
                        id={summary.id}
                        onClick={summary.onClick}
                        colors={summary.colors}
                        tileCount={summary.tileCount}
                        tileText={summary.text}
                        hasDivide={summary.hasDivide}
                        imgStyle={summary.imgStyle}
                        hasImage={summary.hasImage}
                        imgSrc={summary.imgSrc}
                        style={summary.style}
                        countStyle={summary.countStyle}
                        textStyle={summary.textStyle}
                    />
                    </SpringView>
                  ))}
                  <SpringView
                    duration={1000}
                    springValue={0.1}
                    style={[homeDashboardStyles.summarySpringView, {
                      display: 'none'
                    }]}
                >
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {}}
                      style={{ flex: 1, justifyContent: 'center' }}
                  >
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={homeDashboardStyles.updateInventory}>
                        Update Inventory
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </SpringView>
                </View>
              </View>
            </ScrollView>
            <TargetGraph
              style={{ display: 'none' }}
              data={{
                targets,
                headerText: 'Target Summary for March 18',
                colors: [
                  ['#0ac7c4', '#51deb7'],
                  ['green', 'yellowgreen'],
                  ['#5a35da', '#475fdd'],
                  ['#ef563c', '#f3842d']
                ],
                targetLabels: ['Target From Suzuki', 'Dealer Target']
              }} />

            {/* Lead Distribution Test Ride */}
            <View style={{
              height: 400,
              flexDirection: 'row',
              marginBottom: 40,
              display: 'none'
            }} >
              <View style={{ flex: 4, marginLeft: 10, marginRight: 5 }} >
                <View>
                  <Text style={{ marginTop: 10, marginLeft: 20, color: 'black' }} >
                  Your leads: Today
                  </Text>
                </View>
                <View style={{ height: 400 }}
              >
                  <View style={homeDashboardStyles.leadDistributionContent}>
                    <View style={{ elevation: 2, flex: 1 }}>
                      <Text style={{ marginTop: 10, marginLeft: 20, color: '#7f7f7f' }}>
                        {this.state.leadDistribution.label}
                      </Text>
                    </View>
                    <View style={homeDashboardStyles.leadDistributionGraph}>
                      <PieChartScreen data={this.state.leadDistribution} />
                    </View>
                    <View style={{
                      elevation: 2, flex: 1.5, padding: 10, flexDirection: 'row'
                    }}>
                      {this.state.leadDistribution.values.map((value, index) => (
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <View style={[homeDashboardStyles.leadDistributionLegend, {
                            backgroundColor: this.state.leadDistribution.colors[index]
                          }]}
                        />
                          <View style={homeDashboardStyles.leadDistributionLegendText}>
                            <Text>{value.label}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flex: 6, marginLeft: 5, marginRight: 10 }} >
                <View>
                  <Text style={{
                    marginTop: 10,
                    marginLeft: 20,
                    color: 'black',
                    display: 'none'
                  }}>
                  Test Ride Status: Today
                  </Text>
                </View>
                <View style={{
                  height: 400,
                  display: 'none'
                }} >
                  <View style={homeDashboardStyles.testRideStatusContent}>
                    <View style={{ elevation: 2, flex: 1 }}>
                      <Text style={{ marginTop: 10, marginLeft: 20, color: '#7f7f7f' }}>
                        {this.state.testRideBookings.label}
                      </Text>
                    </View>
                    <View style={homeDashboardStyles.testRideStatusChart} >
                      <View style={{ flex: 5, paddingLeft: 50, paddingRight: 50 }} >
                        <PieChartScreen data={this.state.testRideBookings} />
                      </View>
                      <View style={{ flex: 5 }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }} >
                          <View style={homeDashboardStyles.testRideStatusButton}>
                            <SpringView
                              fadeIn={false}
                              duration={1000}
                              springValue={0.9}
                              style={homeDashboardStyles.testRideStatusButtonAnimate} >
                              <TouchableOpacity
                                activeOpacity={0.5}
                                style={{ alignItems: 'center' }} >
                                <LinearGradient
                                  colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
                                  start={{ x: 0.0, y: 1.0 }}
                                  end={{ x: 1.0, y: 1.0 }}
                                  style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                  <View style={
                                     [homeDashboardStyles.updateInventoryButtonContent,
                                       { justifyContent: 'center' }]}>
                                    <View style={{ flex: 3, alignItems: 'center' }}>
                                      <Text style={{ color: '#4C64FF', paddingLeft: 10, fontSize: 20 }}>
                                        {this.state.availableBikes}
                                      </Text>
                                    </View>
                                    <View style={{ flex: 7, justifyContent: 'center' }}>
                                      <Text style={{ color: '#4C64FF', fontSize: 12 }}>
                                    Update Inventory
                                      </Text>
                                    </View>
                                  </View>
                                </LinearGradient>
                              </TouchableOpacity>
                            </SpringView>
                          </View>
                        </View>
                        <View style={{ flex: 1, marginTop: 10, justifyContent: 'flex-start' }} >
                          <View style={homeDashboardStyles.testRideStatusButton}>
                            <SpringView
                              fadeIn={false}
                              duration={1000}
                              springValue={0.9}
                              style={homeDashboardStyles.testRideStatusButtonAnimate} >
                              <TouchableOpacity
                                activeOpacity={0.5}
                                style={{ alignItems: 'center' }} >
                                <LinearGradient
                                  colors={['#ef563c', '#FF9A00', '#f3842d']}
                                  start={{ x: 0.0, y: 1.0 }}
                                  end={{ x: 1.0, y: 1.0 }}
                                  style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} >
                                  <View style={homeDashboardStyles.updateInventoryButtonContent}>
                                    <View style={{ flex: 3, justifyContent: 'center' }}>
                                      <Text style={{ color: '#ef563c', paddingLeft: 10, fontSize: 20 }}>
                                        {this.state.ongoingTestRide}
                                      </Text>
                                    </View>
                                    <View style={{ flex: 7, justifyContent: 'center' }}>
                                      <Text style={{ color: '#ef563c', fontSize: 12 }}>
                                        Ongoing Test Ride
                                      </Text>
                                    </View>
                                  </View>
                                </LinearGradient>
                              </TouchableOpacity>
                            </SpringView>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={homeDashboardStyles.testRideStatusLabel}>
                      {this.state.testRideBookings.values.map((value, index) => (
                        <View style={[
                          homeDashboardStyles.testRideStatusLabelContent, {
                            marginLeft: index ? 50 : 0,
                            marginRight: index ? 50 : 0,
                            justifyContent: index ? 'flex-start' : 'flex-end'
                          }]}>
                          <View style={[
                            homeDashboardStyles.testRideStatusLabelContentText, {
                              backgroundColor: this.state.testRideBookings.colors[index]
                            }]} />
                          <View style={{ borderRadius: 50, paddingLeft: 5, alignSelf: 'center' }}>
                            <Text>{value.label}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <TeamPerformance
              style={{}}
              teamMembers={this.state.teamMembers}
              onManageTeamClick={() => {}}
              onEditTargetClick={() => { this.props.navigation.navigate('TargetScreen'); }}
          />
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default HomeDashboard;
