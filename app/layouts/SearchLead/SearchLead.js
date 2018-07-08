import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Picker,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  Animated,
  TouchableOpacity,
  DatePickerAndroid,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import styles from './searchLeadStyles';
import { getFollowUpAssignee, updateLead } from '../../redux/actions/FollowUpLeads/actionCreators';
import { searchLead, clearLeads } from '../../redux/actions/Leads/actionCreators';
import { getVehicles } from '../../redux/actions/GetVehicles/actionCreators';
import tickIcon from '../../assets/images/tick.png';
import comment from '../../assets/images/comments_ic.png';
import avatar from '../../assets/images/avatar.png';
import view from '../../assets/images/ic_primary_view_icon.png';
import Loader from '../../components/loader/Loader';
import AppHeader from '../../components/header/Header';
import { isNumeric } from '../../utils/validations';
import { BookTestRideButton } from '../../components/button/Button';
import { toast } from '../../utils/toaster';
import Card from '../../components/card/Card';

const DEVICE_WIDTH = Dimensions.get('screen').width;

const { width } = Dimensions.get('screen');
@connect(state => ({
  loading: state.followUpLeads.loading,
  leads: state.leads.searchedLeads,
  searchLoading: state.leads.loading,
  leadOwners: state.followUpLeads.assignees,
  currentUser: state.user.currentUser,
  products: state.getVehicles.vehicleData,
}), {
  getFollowUpAssignee,
  getVehicles,
  updateLead,
  searchLead,
  clearLeads
})
export default class SearchLead extends Component {
  static propTypes = {
    leads: PropTypes.array,
    leadOwners: PropTypes.array,
    searchLead: PropTypes.func.isRequired,
    getVehicles: PropTypes.func.isRequired,
    getFollowUpAssignee: PropTypes.func.isRequired,
    updateLead: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    clearLeads: PropTypes.func.isRequired,
    searchLoading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    leads: {},
    leadOwners: []
  }

  constructor(props) {
    super(props);
    this.defaultFilterData = {
      fromDate: moment().subtract(2, 'months').format(),
      toDate: moment().format(),
      dealer: true,
      interestedVehicles: [],
      orderField: 'created_at',
      mobile_number: '',
      name: '',
      owner: [],
      filterBy: 'created'
    };
    this.state = {
      refreshFlatList: false,
      filterOpen: false,
      initialLoad: true,
      searchValue: '',
      toVal: 10,
      leadOwners: [],
      products: [],
      filterData: JSON.parse(JSON.stringify(this.defaultFilterData)),
      defaultVal: new Animated.Value(-450),
      currentStepValue: new Animated.Value(width),
    };
  }

  static getDerivedStateFromProps({ leadOwners, products }) {
    if (leadOwners || products) {
      return {
        leadOwners,
        products,
      };
    }
    return null;
  }

  componentDidMount() {
    this.initializeFilterData();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        if (this.isFilterApplied()) {
          this.applyFilter();
        }
        this.animate({ endValue: 0, duration: this.props.navigation.state.params.isFilterOpen ? 0 : 200 });
      }
    );
  }

  componentWillUnmount() {
    this.props.clearLeads();
    this.willFocusSubscription.remove();
  }

  onVehicleFilter= (vehicleDetails, index) => {
    const { products, filterData, refreshFlatList } = this.state;
    products[index].marked = !vehicleDetails.marked;
    const { interestedVehicles } = filterData;
    const vehicleDetailIndex = interestedVehicles.findIndex(data => data === vehicleDetails.id);
    if (vehicleDetailIndex === -1) {
      interestedVehicles.push(vehicleDetails.id);
    } else {
      interestedVehicles.splice(vehicleDetailIndex, 1);
    }
    filterData.interestedVehicles = interestedVehicles;
    this.setState({ products, filterData, refreshFlatList: !refreshFlatList });
  }

  onViewLeadClicked = lead => {
    try {
      const { currentUser: { dealerId } } = this.props;
      this.props.navigation.navigate(
        'LeadHistory',
        { lead, currentDealerId: dealerId }
      );
    } catch (error) {
      console.log('Cannot View Lead Details', error);
    }
  }

  setOwnersInFilter = (ownerDetails, index) => {
    const { leadOwners, filterData } = this.state;
    leadOwners[index].marked = !ownerDetails.marked;
    const { owner } = filterData;
    const ownerDetailsIndex = owner.findIndex(data => data === ownerDetails.id);
    if (ownerDetailsIndex === -1) {
      owner.push(ownerDetails.id);
    } else {
      owner.splice(ownerDetailsIndex, 1);
    }
    filterData.owner = owner;
    this.setState({ leadOwners, filterData });
  }

  setFilterLeadType = param => {
    const { filterData } = this.state;
    filterData.filterBy = param;
    this.setState({
      filterData
    });
  }

  setFilterDate = param => (
    async () => {
      const { filterData } = this.state;
      const dateToEdit = filterData[param];
      try {
        const {
          action, year, month, day
        } = await DatePickerAndroid.open({
          date: new Date(dateToEdit),
          mode: 'calendar'
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const retrievedDate = moment({ years: year, months: month, date: day }).format();
          if (this.validateDates(filterData.fromDate, filterData.toDate, retrievedDate, param)) {
            filterData[param] = moment({ years: year, months: month, date: day }).format();
            this.setState({ filterData });
          }
        }
      } catch (error) {
        console.log('Cannot open date picker', error);
      }
    }
  )

  getLeadbackgroundStyle = leadTypeList => {
    switch (leadTypeList) {
      case 'NEW':
        return { backgroundColor: '#47AC50' };
      case 'HOT':
        return { backgroundColor: '#FA381E' };
      case 'WARM':
        return { backgroundColor: '#FF9900' };
      case 'COLD':
        return { backgroundColor: '#02baf0' };
      case 'LOST':
        return { backgroundColor: '#606060' };
      case 'INVOICED':
        return { backgroundColor: '#b677fa' };
      default:
        return { backgroundColor: '#ffa166' };
    }
  }

  getLeadTextColor = leadType => {
    switch (leadType) {
      case 'NEW':
        return { color: 'white' };
      default:
        return { color: 'white' };
    }
  }

  getDropDownValue = assignToId => {
    const val = this.state.leadOwners.filter(assigee => {
      if (assignToId === assigee.id) {
        return assigee;
      }
    });
    let name;
    if (val.length > 0) {
      name = val[0].first_name;
    } else {
      name = 'Select';
    }
    return name;
  }

  isFilterApplied() {
    const { filterData } = this.state;
    const {
      searchValue,
      fromDate,
      toDate,
      interestedVehicles,
      mobile_number,
      name,
      owner,
      filterBy
    } = filterData;
    return !(fromDate === this.defaultFilterData.fromDate &&
      toDate === this.defaultFilterData.toDate &&
      // eslint-disable-next-line  camelcase
      !searchValue && !mobile_number &&
      !interestedVehicles.length &&
      !owner.length &&
      !name &&
      filterBy === 'created');
  }

  initializeFilterData = () => {
    try {
      const { currentUser: { dealerId } } = this.props;
      this.props.getFollowUpAssignee(dealerId);
      this.props.getVehicles(dealerId);
      if (this.props.navigation.state.params.isFilterOpen) {
        this.slide();
      }
      this.setCategories();
    } catch (error) {
      console.log('Cannot fetch leadOwners', error);
    }
  }

  applyFilter =() => {
    const { filterData, filterOpen } = this.state;
    if (filterOpen) {
      this.slide();
    }
    this.props.searchLead(filterData);
  }

  openFilter=() => {
    this.slide();
  }

  slide = () => {
    const { filterOpen } = this.state;
    if (this.state.toVal === -450) {
      this.state.toVal = 10;
      this.state.defaultVal = new Animated.Value(-450);
    } else if (this.state.initialLoad) {
      this.state.toVal = 10;
      this.state.defaultVal = new Animated.Value(-450);
      this.state.initialLoad = false;
    } else {
      this.state.toVal = -450;
      this.state.defaultVal = new Animated.Value(10);
    }
    this.setState({
      defaultVal: this.state.defaultVal,
      toVal: this.state.toVal,
      filterOpen: !filterOpen
    }, () => {
      Animated.timing(this.state.defaultVal, {
        toValue: this.state.toVal,
        duration: 200
      }).start();
    });
  };

  animate = ({ endValue, duration }) => {
    Animated.timing(
      this.state.currentStepValue,
      {
        toValue: endValue,
        duration
      }
    ).start();
  }

  _keyExtractor = item => item.id

  updateLeadDetail = (lead, index) => {
    lead.assigned_to = this.state.leadOwners[index].id;
    delete lead.lead_details;
    this.props.updateLead(lead.id, lead).then(() => {
      this.applyFilter();
    });
  }

  resetFilter= () => {
    let { products, leadOwners } = this.state;
    products = products.map(product => ({ ...product, marked: false }));
    leadOwners = leadOwners.map(owner => ({ ...owner, marked: false }));
    this.setState({
      filterData: JSON.parse(JSON.stringify(this.defaultFilterData)),
      products,
      searchValue: '',
      leadOwners
    });
  }

	searchLead = searchValue => {
	  const { filterData } = this.state;
	  const isNumber = isNumeric(searchValue);
	  filterData.mobile_number = isNumber ? searchValue : '';
	  filterData.name = !isNumber ? searchValue : '';
	  this.setState({ searchValue, filterData }, () => {
	    this.props.searchLead(filterData);
	  });
	}

  showLeadAlert = (lead, index) => {
    Alert.alert(
      'Message',
      `Do you want to change the lead to ${this.props.leadOwners[index].first_name}`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.updateLeadDetail(lead, index) },
      ],
      { cancelable: false }
    );
  }

  validateDates=(fromDate, toDate, retrievedDate, param) => {
    const validated = (() => param === 'toDate' ?
      moment(fromDate).isSameOrBefore(retrievedDate) :
      moment(toDate).isSameOrAfter(retrievedDate))();
    if (!validated) {
      // eslint-disable-next-line  max-len
      toast(`${param === 'fromDate' ? 'Start Date' : 'End Date'} cannot be ${param === 'fromDate' ? 'higher' : 'lower'} than ${moment(param === 'toDate' ? fromDate : toDate).format('DD MMM YY')} !`);
    }
    console.log(validated);
    return validated;
  }

  renderCards = () => Object.keys(this.props.leads).map(currentItem => (
    <View key={currentItem} style={styles.cardContainer}>
      <View style={[styles.overdueHeader, this.getLeadbackgroundStyle(currentItem)]}>
        <Text
          style={[styles.overdueText,
            this.getLeadTextColor(currentItem)]}>
          {`${currentItem.toUpperCase()} (${this.props.leads[currentItem] && this.props.leads[currentItem].length})`}
        </Text>
      </View>
      {
        this.props.leads[currentItem].length > 0 &&
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.props.leads[currentItem]}
          renderItem={({ item }) => this.renderItem(item, currentItem)}
          />
      }
    </View>
  ))

  renderItem = (item, currentItem) => (<Card
    item={item}
    dropdownData={this.state.leadOwners}
    widthOfCard={(DEVICE_WIDTH / 3) - 20}
    onDropDownChange={() => this.onDropDownChange()}
    tab={currentItem.toLowerCase()}
    onViewClicked={() => { this.onViewLeadClicked(item); }} />)

  renderItems = item => (
    <View style={styles.card}>
      <View style={styles.bikeNameContainer}>
        <Text style={styles.bikeName}>
          {
          (item && item.lead_details && item.lead_details.length > 0 && item.lead_details.vehicle
            && item.lead_details.vehicle.length > 0 && item.lead_details.vehicle[0].name)
            ? item.lead_details.vehicle[0].name : 'NA'
        }
        </Text>
        <View style={styles.namePicker}>
          <View style={styles.assigneePicker}>
            <Image source={avatar} resizeMode="contain" style={{ marginLeft: 10 }} />
            <Picker
              selectedValue={this.getDropDownValue(item.assigned_to)}
              style={{ height: 25, flex: 1 }}
              mode="dropdown"
              disabled
              onValueChange={(itemValue, itemIndex) => this.showLeadAlert(item, itemIndex)}>
              {
                this.state.leadOwners.map(assigee => (
                  <Picker.Item key={assigee.id} label={assigee.first_name} value={assigee.first_name} />
                ))
              }
            </Picker>
          </View>
        </View>
      </View>
      <View style={styles.followCommentView}>
        <View style={styles.followView}>
          <View style={{ borderRadius: 2, paddingHorizontal: 8, paddingVertical: 4 }}>
            <View style={styles.followUpLabelView}>
              <Image source={tickIcon} resizeMode="contain" />
              <Text style={styles.followUpGreenLabel}>Follow up</Text>
            </View>
            <View style={styles.followUpDateView}>
              <Text style={[styles.followUpGreyDate, styles.followUpDateGreyBorder]}>{
                (item && item.next_followup_on) ?
                  moment.utc(item.next_followup_on).utcOffset('+05:30').format('LT') : 'NA'
              }
              </Text>
              <Text style={styles.followUpGreyDate}>{
                (item && item.next_followup_on) ?
                  moment.utc(item.next_followup_on).utcOffset('+05:30').format('D MMMM') : 'NA'
              }
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.commentView}>
          <View style={styles.commentLabelView}>
            <Image source={comment} resizeMode="contain" />
            <Text style={styles.commentLabel}>{
              (item && item.comments_count) ? `Comment (${item.comments_count})` : 'Comments (0)'
            }
            </Text>
          </View>
          <Text style={styles.addCommentLabel} />
        </View>
      </View>
      <View style={styles.testRideLeadContactView}>
        <View style={styles.testRideView}>
          <Text style={styles.cardSectionLabel}>Test Ride</Text>
          <Text style={styles.testRideStatus}>{
            (item && item.lead_details &&
              item.lead_details.length > 0 &&
              item.lead_details[0].test_ride_status) ?
              moment.utc(item.lead_details[0].test_ride_status).utcOffset('+05:30').format('D MMMM') : 'NA'
          }
          </Text>
        </View>
        <View style={styles.contactView}>
          <Text style={styles.cardSectionLabel}>Lead Contact</Text>
          <Text style={styles.testRideStatus}>{
            (item && item.mobile_number) ?
              item.mobile_number : 'NA'
          }
          </Text>
        </View>
      </View>
      <View style={styles.leadDetailsView}>
        <Text style={styles.cardSectionLabel}>Lead Details</Text>
        <View style={styles.userDetailsView}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.greyCircle} />
          <Text style={styles.userName}>{item.gender}</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => { this.onViewLeadClicked(item); }}>
        <View style={styles.viewButton}>
          <Image source={view} resizeMode="contain" />
          <Text style={styles.view}>VIEW</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  renderVehicle = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => this.onVehicleFilter(item, index)}>
      <View style={
        !item.marked ? [styles.withoutVehicleSelected] : styles.withVehicleSelected
        }>
        <LinearGradient
          colors={item.marked ? ['#ff8e3e', '#ff743f', '#fd5742', '#fb4645'] : ['white', 'white']}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            flex: 1,
            borderRadius: 4
          }}>
          <View style={{
            backgroundColor: 'white',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            margin: item.marked ? 2 : 0
          }}>
            <Image
              style={styles.imageStyle}
              source={
              { uri: item.image_url }}
            />
            <Text style={{ fontSize: 10, color: '#4a4a4a', alignSelf: 'center' }}>{item.name}</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  )

  render() {
    const hasData = Object.keys(this.props.leads).length > 0;
    const {
      searchValue, currentStepValue, filterOpen, filterData
    } = this.state;
    const {
      fromDate, toDate, filterBy
    } = filterData;
    const { loading } = this.props;
    return (
      <View style={styles.container}>
        <Loader loading={loading} />
        <AppHeader
          backEnabled
          onBackClick={() => {
            this.props.clearLeads();
          }}
          navigation={this.props.navigation}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Animated.View
              style={{
                flex: 1,
                flexDirection: 'row',
                transform: [{
                  translateX: currentStepValue
                }],
              }} >
              <View style={styles.appHeaderTextContent}>
                <Text style={{ paddingHorizontal: 10 }}><Icon name="search" size={21} color="white" /></Text>
                <TextInput
                  placeholder="Type to start searching..."
                  style={{ height: 40, color: 'white', width: 190 }}
                  underlineColorAndroid="transparent"
                  autoFocus={!this.props.navigation.state.params.isFilterOpen}
                  value={searchValue}
                  selectionColor="white"
                  placeholderTextColor="white"
                  onChangeText={this.searchLead}
            />
              </View>
            </Animated.View>
            <TouchableOpacity
              onPress={this.openFilter}
              actveOpacity={0.8}
              style={styles.filterIcon} >
              <Text style={{ paddingHorizontal: 10, alignSelf: 'center' }}>
                <Icon name="sliders" size={21} color="white" />
              </Text>
            </TouchableOpacity>
          </View>
        </AppHeader>
        <Animated.View
          style={[{
            backgroundColor: 'white',
            top: -100,
            zIndex: filterOpen ? 1 : -1
          }, {
            transform: [
              {
                translateY: this.state.defaultVal
              }
            ]
          }, {
            width: Dimensions.get('screen').width * 0.859,
          }, styles.filterContainer]}
          >
          <View style={{ flex: 1, borderRadius: 2 }}>
            <View style={styles.filterContent}>
              <Text style={styles.filterHeaderText}>Filter {this.state.toval}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.filterCloseIcon]}
                onPress={() => {
                  this.slide();
                }}>
                <Text style={{ alignSelf: 'center', fontWeight: '600' }}>
                  <EvilIcon name="close" size={21} color="#e14e0e" />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 8.5, flexDirection: 'row' }} >
              <View style={{ flex: 1 }} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.showLeadText}>Show Leads From
                  </Text>
                </View>
                <View style={{ flex: 5 }}>
                  <View style={styles.filterDateContainer}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      activeOpacity={0.8}
                      onPress={this.setFilterDate('fromDate')}
                      >
                      <View style={styles.filterDateContent} >
                        <Text style={styles.filterDateText}>Start date</Text>
                        <Text style={styles.filterDateFormattedText}>{moment(fromDate).format('DD MMM YY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      activeOpacity={0.8}
                      onPress={this.setFilterDate('toDate')} >
                      <View style={styles.filterDateContent} >
                        <Text style={styles.filterDateText}>End date</Text>
                        <Text style={styles.filterDateFormattedText}>{moment(toDate).format('DD MMM YY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={styles.checkBoxView}>
                    <TouchableOpacity
                      onPress={() => this.setFilterLeadType('created')}
                      style={styles.checkBoxTouchable}>
                      { filterBy === 'created' &&
                        <LinearGradient colors={['#f3842d', '#ef563c']} style={styles.checkBoxSelectedTouchable} />
                      }
                    </TouchableOpacity>
                    <Text style={styles.leadsFilterText}>
                      Created Leads
                    </Text>
                  </View>
                  <View style={styles.checkBoxView}>
                    <TouchableOpacity
                      onPress={() => this.setFilterLeadType('invoiced')}
                      style={styles.checkBoxTouchable}>
                      { filterBy === 'invoiced' &&
                        <LinearGradient colors={['#f3842d', '#ef563c']} style={styles.checkBoxSelectedTouchable} />
                      }
                    </TouchableOpacity>
                    <Text style={styles.leadsFilterText}>
                      Invoiced Leads
                    </Text>
                  </View>
                  <View
                    style={[styles.checkBoxView, { paddingRight: 25 }]}>
                    <TouchableOpacity
                      onPress={() => this.setFilterLeadType('lost')}
                      style={styles.checkBoxTouchable}>
                      { filterBy === 'lost' &&
                        <LinearGradient colors={['#f3842d', '#ef563c']} style={styles.checkBoxSelectedTouchable} />
                      }
                    </TouchableOpacity>
                    <Text style={styles.leadsFilterText}>
                      Lost Leads
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }} >
                <View style={{ flex: 1 }} >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.leadsOwnerHeader}>Leads owned by</Text>
                  </View>
                  <View style={{ flex: 9 }} >
                    <View style={styles.leadsOwnerContent}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {this.state.leadOwners.map((owner, index) => (
                          <View
                            style={styles.leadsOwnerTouchableView}>
                            <TouchableOpacity
                              onPress={() => this.setOwnersInFilter(owner, index)}
                              style={styles.checkBoxTouchable}>
                              { owner.marked &&
                                <LinearGradient colors={['#f3842d', '#ef563c']} style={styles.checkBoxSelectedTouchable} />
                              }
                            </TouchableOpacity>
                            <Text style={styles.leadsOwnerTouchableText}>
                              {owner.first_name}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.leadsOwnedHeaderText}>Leads owned by</Text>
                </View>
                <View style={{ flex: 9 }} >
                  <View style={styles.leadsOwnedFlatListView}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <FlatList
                        keyExtractor={data => data.id}
                        data={this.state.products}
                        renderItem={this.renderVehicle}
                        extraData={this.state.refreshFlatList}
                        horizontal={false}
                        numColumns={2}
                      />
                    </ScrollView>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.resetFilterView}>
              <TouchableOpacity
                style={{ justifyContent: 'center', paddingBottom: 7, marginRight: 10 }}
                activeOpacity={0.8}
                onPress={() => this.resetFilter()}>
                <Text style={styles.resetFilterText}>
                  Reset Filters
                </Text>
              </TouchableOpacity>
              <BookTestRideButton
                disabled={this.filterData}
                handleSubmit={() => this.applyFilter()}
                title="Apply Filter" />
            </View>
          </View>
        </Animated.View>
        { !hasData ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              alignSelf: 'center',
              fontSize: 18,
              fontFamily: 'SourceSansPro-Bold',
              color: '#4a4a4a'
            }}> {
              !this.isFilterApplied() ?
                'Your Search results appear here...' :
                this.props.searchLoading ? 'Searching...' :
                  'No Leads Found... :('
              }
            </Text>
          </View> :
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            {
              hasData &&
              this.renderCards()
            }
          </ScrollView>
        }

      </View>
    );
  }
}

