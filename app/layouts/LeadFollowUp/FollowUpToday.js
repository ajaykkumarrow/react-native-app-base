import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Picker,
  Image,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './leadFollowUpStyles';
import { getFollowUpToday, getFollowUpAssignee, updateLead } from '../../redux/actions/FollowUpLeads/actionCreators';
import tickIcon from '../../assets/images/tick.png';
import storage from '../../helpers/AsyncStorage';
import avatar from '../../assets/images/avatar.png';
import view from '../../assets/images/ic_primary_view_icon.png';
import Loader from '../../components/loader/Loader';
import fonts from '../../theme/fonts';

@connect(state => ({
  followUpTodayResponse: state.followUpLeads.followUpTodayResponse,
  assignees: state.followUpLeads.assignees,
  loading: state.followUpLeads.loading
}), {
  getFollowUpToday,
  getFollowUpAssignee,
  updateLead
})
export default class FollowUpToday extends Component {
  static propTypes = {
    getFollowUpToday: PropTypes.func.isRequired,
    followUpTodayResponse: PropTypes.object,
    getFollowUpAssignee: PropTypes.func.isRequired,
    assignees: PropTypes.array,
    updateLead: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    navigation: PropTypes.object.isRequired
  }

  static defaultProps = {
    followUpTodayResponse: {},
    assignees: [],
  }

  constructor(props) {
    super(props);
    this.dealerId = '';
    this.state = {
      followUpsToday: {},
      categories: []
    };
  }

  componentDidMount() {
    this.getFollowTodayDetails();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getFollowTodayDetails();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getFollowTodayDetails = () => {
    storage.getItem('currentUser')
      .then(value => {
        const { dealerId } = value;
        this.dealerId = dealerId;
        return this.props.getFollowUpAssignee(dealerId);
      })
      .then(() => this.props.getFollowUpToday()).then(() => {
        this.setCategories();
      })
      .catch(error => {
        console.log(error);
      });
  }

  setCategories = () => {
    const { followUpTodayResponse } = this.props;
    const newArray = [];
    if (('overdue' in followUpTodayResponse) && followUpTodayResponse.overdue.length !== 0) {
      newArray.push('overdue');
    }
    if (('pending' in followUpTodayResponse) && followUpTodayResponse.pending.length !== 0) {
      newArray.push('pending');
    }
    this.setState({
      categories: newArray,
      followUpsToday: followUpTodayResponse
    });
  }

  getLeadbackgroundStyle = leadTypeList => {
    switch (leadTypeList) {
      case 'pending':
        return { backgroundColor: '#47AC50' };
      case 'overdue':
        return { backgroundColor: '#ffa166' };
      default:
        return { backgroundColor: '#ffa166' };
    }
  }

  getLeadTextColor = leadType => {
    switch (leadType) {
      case 'pending':
        return { color: 'white' };
      case 'overdue':
        return { color: 'white' };
      default:
        return { backgroundColor: 'white' };
    }
  }

  getDropDownValue = assignToId => {
    const val = this.props.assignees.filter(assigee => {
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

  _keyExtractor = item => item.id

  updateLeadDetail = (lead, index) => {
    lead.assigned_to = this.props.assignees[index].id;
    delete lead.lead_details;
    this.props.updateLead(lead.id, lead)
      .then(() => {
        this.getFollowTodayDetails();
      });
  }

  showLeadAlert = (lead, index) => {
    Alert.alert(
      'Message',
      `Do you want to change the lead to ${this.props.assignees[index].first_name}`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.updateLeadDetail(lead, index) },
      ],
      { cancelable: false }
    );
  }

  handleViewButton = lead => {
    this.navigateToLeadScreen(lead);
  }

  navigateToLeadScreen = lead => {
    const currentDealerId = this.dealerId;
    this.props.navigation.navigate('LeadHistory', { lead, currentDealerId });
  }

  addCommentsBtnTapped=lead => {
    this.navigateToLeadScreen(lead);
  }

  commentsBtnTapped=lead => {
    this.navigateToLeadScreen(lead);
  }

  renderCards = () => this.state.categories.map((currentItem, index) => (
    <View key={currentItem} style={styles.cardContainer}>
      <View style={[styles.overdueHeader, this.getLeadbackgroundStyle(currentItem)]}>
        <Text
          style={[styles.overdueText,
            this.getLeadTextColor(currentItem)]}>
          {`${currentItem.toUpperCase()} (${this.state.followUpsToday[currentItem].length})`}
        </Text>
      </View>
      <FlatList
        keyExtractor={this._keyExtractor}
        data={this.state.followUpsToday[currentItem]}
        renderItem={({ item }) => this.renderItem(item)}
        />
    </View>
  ))

  renderItem = item => (
    <View style={styles.card}>
      <View style={styles.bikeNameContainer}>
        <Text style={styles.bikeName}>
          {
                item.lead_details && item.lead_details.length > 0 ?
                  `${item.lead_details[0].vehicle.name} ${item.lead_details.length > 1 ? ` + ${item.lead_details.length - 1} ` : ''}`
                  :
                  <Text>
                NA
                  </Text>
          }
        </Text>
        <View style={styles.namePicker}>
          <View style={styles.assigneePicker}>
            <Image source={avatar} resizeMode="contain" style={{ marginLeft: 10 }} />
            <Picker
              selectedValue={this.getDropDownValue(item.assigned_to)}
              style={{ height: 25, flex: 1 }}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => this.showLeadAlert(item, itemIndex)}>
              {
                this.props.assignees.map(assigee => (
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
          <TouchableOpacity
            onPress={() => this.commentsBtnTapped(item)}
            style={styles.commentLabelView}>
            <Icon name="commenting" size={21} color="#ff7561" />
            <Text style={[styles.commentLabel, { color: '#ff7561' }]}>{
              (item && item.comments_count) ? `Comment (${item.comments_count})` : 'Comment (0)'
            }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.addCommentsBtnTapped(item)}>
            <Text style={[styles.addCommentLabel, { color: '#f3795c' }]}>Add Comment</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.testRideLeadContactView}>
        <View style={styles.testRideView}>
          <Text style={styles.cardSectionLabel}>Test Ride</Text>
          <Text style={styles.testRideStatus}>
            {
            (item && item.lead_details &&
              item.lead_details.length > 0 &&
              item.lead_details[0].test_ride_status) ?
              (`${moment.utc(item.lead_details[0].test_ride_status).utcOffset('+05:30').format('DD MMM')
              }@${moment.utc(item.lead_details[0].test_ride_status).utcOffset('+05:30').format('LT')}`) : 'NO'
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
        style={styles.viewButton}
        onPress={() => { this.handleViewButton(item); }}
      >
        <Image source={view} resizeMode="contain" />
        <Text style={styles.view}>VIEW</Text>
      </TouchableOpacity>
    </View>
  )
  render() {
    return (
      <View style={styles.container}>
        <Loader loading={this.props.loading} />
        {
(this.props.followUpTodayResponse &&
  this.props.followUpTodayResponse.overdue &&
  this.props.followUpTodayResponse.pending &&
  this.props.followUpTodayResponse.overdue.length === 0 &&
  this.props.followUpTodayResponse.pending.length === 0) ?
    <View style={{
      flex: 1, alignItems: 'center', justifyContent: 'center'
    }}>
      <Text style={{
        marginVertical: 80,
        alignSelf: 'center',
        fontFamily: fonts.sourceSansProBold,
        fontSize: 22
      }}
>
No leads to show :(
      </Text>
    </View>
  :
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      {this.renderCards()}
    </ScrollView>

  }
      </View>

    );
  }
}
