import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '../../helpers/AsyncStorage';
import HandleTabNavigation from './components/tabNavigator';
import { getLeads, getExecutives, getCount } from '../../redux/actions/Leads/actionCreators';
import Loader from '../../components/loader/Loader';
import AppHeader from '../../components/header/Header';
import styles from './leadDashboardStyles';

@connect(
  state => ({
    leads: state.leads.leads,
    executives: state.leads.executives,
    count: state.leads.count,
    loading: state.leads.loading,
    currentUser: state.user.currentUser
  }),
  {
    getLeads, getExecutives, getCount
  }
)
export default class LeadDashboard extends Component {
  static propTypes = {
    getLeads: PropTypes.func.isRequired,
    getExecutives: PropTypes.func.isRequired,
    getCount: PropTypes.func.isRequired,
    leads: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    executives: PropTypes.array,
    count: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    leads: [] || {},
    executives: [],
    count: []
  }

  constructor(props) {
    super(props);
    this.state = {
      leads: [],
      executives: [],
      count: []
    };
  }

  componentDidMount() {
    this.onInitalLoad();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.onInitalLoad();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onInitalLoad =() => {
    const { dealerId } = this.props.currentUser;
    this.props.getLeads('new').then(() => {
      this.props.getExecutives(dealerId).then(() => {
        const filterObj = {
          manufacturer_id: this.props.leads.length > 0 ? this.props.leads[0].manufacturer_id : null,
          count: true
        };
        return this.props.getCount(filterObj);
      }).then(() => {
        this.setState({
          count: this.props.count,
          leads: this.props.leads,
          executives: this.props.executives,
        });
      });
    });
  }

  onSearchProductClick = () => {
    this.props.navigation.navigate('SearchLead', { isFilterOpen: false });
  }

  getCurrentMonth = () => {
    const locale = 'en-us';
    const objDate = new Date();
    const Year = new Date().getFullYear().toString();
    return `${objDate.toLocaleString(locale, { month: 'short' })}'${Year.substr(Year.length - 2)}`;
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white'
      }}>
        <Loader loading={this.props.loading} />

        <AppHeader navigation={this.props.navigation}>
          <View style={styles.headerContainer}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={styles.headerTextContent}>
                <Text style={{ color: 'white', paddingHorizontal: 5 }}>
                  Leads
                </Text>
              </View>
              <View style={[styles.headerDateContent, { display: 'none' }]}>
                <Text style={{ color: 'white', paddingHorizontal: 5 }} />
              </View>
              <TouchableOpacity
                style={styles.headerSearchContent}
                onPress={this.onSearchProductClick}>
                <Text style={{ paddingHorizontal: 10 }}><Icon name="search" size={21} color="white" /></Text>
                <Text style={styles.headerSearchContentText}>Search for Lead
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }} />
            </View>
          </View>
        </AppHeader>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 10
        }}>
          <View>
            <Text style={{
              marginBottom: 5,
              paddingLeft: 3,
              color: '#4a4a4a',
              fontSize: 11,
              fontFamily: 'SourceSansPro-SemiBold'
            }}>
                Overview
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                alignItems: 'center',
                marginRight: 20,
              }} >
              <LinearGradient
                colors={['#00C9D3', '#00B4EC']}
                style={{
                  flexDirection: 'row',
                  borderRadius: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 10
                }}>
                <View style={{ marginLeft: 5 }}>
                  <Text
                    style={{
                      fontFamily: 'SourceSansPro-SemiBold',
                      color: 'white',
                      fontSize: 13,
                      lineHeight: 18
                    }}>Leads {'\n'}
                 to take action
                  </Text>
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={{
                    fontFamily: 'SourceSansPro-SemiBold',
                    color: 'white',
                    fontSize: 20
                  }}>{this.state.count.length > 0 ? this.state.count[0].leads_count : 0}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{
              marginBottom: 5,
              paddingLeft: 3,
              color: '#4a4a4a',
              fontSize: 11,
              fontFamily: 'SourceSansPro-SemiBold'
            }}>
                Targets-
              {`${moment.utc(new Date()).format('MMM')}'${moment.utc(new Date()).format('YY')}`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                alignItems: 'center',
                marginRight: 20
              }} >
              <LinearGradient
                colors={['#C57CF5', '#8F7AF6']}
                style={{
                  flexDirection: 'row',
                  borderRadius: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 10
                }}>
                <View style={{ marginLeft: 5 }}>
                  <Text
                    style={{
                      fontFamily: 'SourceSansPro-SemiBold',
                      color: 'white',
                      fontSize: 13,
                      lineHeight: 18
                    }}>Units {'\n'}
                 Invoiced
                  </Text>
                </View>
                <View style={{
                  marginLeft: 20,
                  paddingTop: 5,
                  flexDirection: 'row'
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 15,
                    fontFamily: 'SourceSansPro-SemiBold',
                  }}>20
                  </Text>
                  <Text style={{
                    paddingTop: 5,
                    paddingLeft: 2,
                    color: 'white',
                    fontSize: 10,
                    fontFamily: 'SourceSansPro-SemiBold',
                  }}>/100
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 9 }}>
          <HandleTabNavigation
            stackNavigation={this.props.navigation}
            loading={this.props.loading}
            leads={this.state.leads}
            executives={this.state.executives}
            count={this.state.count} />
        </View>
      </View>
    );
  }
}
