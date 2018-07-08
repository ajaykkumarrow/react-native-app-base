import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Picker,
  Image,
  Alert
} from 'react-native';

// Reducer
import { connect } from 'react-redux';

// Date extension
import moment from 'moment';

// Component
import Loader from '../../components/loader/Loader';
import { ButtonWithLeftImage } from '../../components/button/Button';

// Header HOC
import AppHeader from '../../components/header/Header';

// Styles
import styles from './newLeadOverviewStyles';

// Images
import DealerAvatarIcon from '../../assets/images/avatar.png';
import ViewIcon from '../../assets/images/ic_primary_view_icon.png';

// Action Methods
import {
  getLeadCretaedList,
  getAssigneList,
  updateLead,
  getLeadTypeCount } from '../../redux/actions/NewLeadOverView/actionCreators';

// Storage
import storage from '../../helpers/AsyncStorage';

@connect(
  state => ({
    leadCreatedList: state.newLeadOverView.leadCreatedList,
    assignedToList: state.newLeadOverView.assignedToList,
    leadCountDetails: state.newLeadOverView.leadCountDetails,
    loading: state.newLeadOverView.loading,
    currentUser: state.user.currentUser
  }),
  {
    getLeadCretaedList, getAssigneList, updateLead, getLeadTypeCount
  }
)

export default class NewLeadOverview extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getLeadCretaedList: PropTypes.func.isRequired,
    getAssigneList: PropTypes.func.isRequired,
    updateLead: PropTypes.func.isRequired,
    getLeadTypeCount: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    assignedToList: PropTypes.array,
    leadCreatedList: PropTypes.object,
    leadCountDetails: PropTypes.object,
    currentUser: PropTypes.object.isRequired
  }

  static defaultProps = {
    leadCreatedList: {},
    assignedToList: [],
    leadCountDetails: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      overAlLeadList: {},
      categoryList: [],
      currentAssignedList: [],
      newCount: 0,
      hotCount: 0,
      warmCount: 0,
      coldCount: 0,
      invoicedCount: 0,
      lostCount: 0,
      showroomTabLayoutData: [
        {
          id: 1,
          name: 'In Showroom (0)',
        },
        {
          id: 2,
          name: 'Out of Showroom (0)',
        },
      ],
      tabPosition: 1,
    };
  }

  componentDidMount() {
    this.onInitialLoad();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.onInitialLoad();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onSearchProductClick = () => {
    this.props.navigation.navigate('SearchLead', { isFilterOpen: false });
  }

  onInitialLoad() {
    const { dealerId } = this.props.currentUser;
    this.props.getLeadCretaedList().then(() => {
      this.getCountsForEachCategory(this.props.leadCreatedList);
      this.setState({
        overAlLeadList: this.props.leadCreatedList,
      });
    });
    this.props.getAssigneList(dealerId).then(() => {
      this.setState({
        currentAssignedList: this.props.assignedToList,
      });
    });
    this.props.getLeadTypeCount().then(() => {
      const { showroomTabLayoutData } = this.state;
      showroomTabLayoutData[0].name = `In Showroom (${this.props.leadCountDetails.inShowroom})`;
      showroomTabLayoutData[1].name = `Out of Showroom (${this.props.leadCountDetails.outOfShowroom})`;

      this.setState({
        showroomTabLayoutData
      });
    });
  }

  onTabPress = tabInfo => {
    if (tabInfo.id === 0) {
      this.setState({
        tabPosition: tabInfo.id,
      });
    }
  }

  onDealerPickerChange=(dealer, currentlead) => {
    Alert.alert(
      'Message',
      `Do you want to change the lead to ${dealer.first_name}`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.updateLeadDetails(currentlead, dealer) },
      ],
      { cancelable: false }
    );
  }

  getCountsForEachCategory=overAllList => {
    const { showroomTabLayoutData } = this.state;
    let {
      newCount, hotCount, warmCount, coldCount, invoicedCount, lostCount
    } = this.state;
    const newArray = [];
    if (('NEW' in overAllList) && overAllList.NEW.length !== 0) {
      newCount = overAllList.NEW.length;
      newArray.push('NEW');
    }
    if (('HOT' in overAllList) && overAllList.HOT.length !== 0) {
      hotCount = overAllList.HOT.length;
      newArray.push('HOT');
    }
    if (('WARM' in overAllList) && overAllList.WARM.length !== 0) {
      warmCount = overAllList.WARM.length;
      newArray.push('WARM');
    }
    if (('COLD' in overAllList) && overAllList.COLD.length !== 0) {
      coldCount = overAllList.COLD.length;
      newArray.push('COLD');
    }
    if (('INVOICED' in overAllList) && overAllList.INVOICED.length !== 0) {
      invoicedCount = overAllList.INVOICED.length;
      newArray.push('INVOICED');
    }
    if (('LOST' in overAllList) && overAllList.LOST.length !== 0) {
      lostCount = overAllList.LOST.length;
      newArray.push('LOST');
    }
    showroomTabLayoutData[0].name =
    `In Showroom (${newCount + hotCount + warmCount + coldCount + invoicedCount + lostCount})`;
    this.setState({
      showroomTabLayoutData,
      newCount,
      hotCount,
      warmCount,
      coldCount,
      invoicedCount,
      lostCount,
      categoryList: newArray
    });
  }

  getTabData = () => (
    <View style={styles.tabDataInnerView}>
      {
        this.state.showroomTabLayoutData.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={this.changeTabColor(tab.id)}
            onPress={() => this.onTabPress(tab)}
          >
            <Text style={this.changeTextColor(tab.id)}>{tab.name}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )

  getLeadOverViewList = () => (
    <View style={styles.leadOverviewStyle}>
      {
        this.state.categoryList.map((currentItem, index) => (
          <View
            style={styles.leadCardOverviewStyle}
            key={index}
            >
            <View style={[styles.leadHeaderView, this.getLeadbackgroundStyle(currentItem)]} >
              <Text style={[styles.pendingTextStyle, { flex: 1 }]}>
                {this.updateCategoryCount(currentItem)}
              </Text>
            </View>
            <FlatList
              style={styles.flatListViewStyles}
              keyExtractor={item => item.id}
              data={this.state.overAlLeadList[currentItem]}
              renderItem={({ item }) => this.renderItem(item)}
              extraData={this.state}
              scrollEnabled
                    />
          </View>
        ))
      }
    </View>
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
        return { backgroundColor: '#00ABF4' };
      case 'INVOICED':
        return { backgroundColor: '#b677fa' };
      case 'LOST':
        return { backgroundColor: '#606060' };
      default:
        return { backgroundColor: '#606060' };
    }
  }

  getNameForUUId=id => {
    const currentVal = this.state.currentAssignedList.filter(currentAssigne => {
      if (currentAssigne.id === id) {
        return currentAssigne;
      }
    });
    if (currentVal.length > 0) {
      return currentVal[0].first_name;
    }
    return 'test';
  }
  getCurrentLeadStatus = item => {
    if (item.status >= 600 && item.status <= 800) {
      return (
        <View>
          <View style={styles.leadCreatedViewStyle}>
            <Icon
              style={[styles.greenTickImageStyle]}
              name="check-circle"
              size={20}
              color="#63a719" />
            <Text style={styles.leadCreatedTextStyle}>
                  Invoiced
            </Text>
          </View>
          <View style={styles.dateTimeView} >
            <Text style={styles.timeTextStyle}>
              {
              moment.utc(item.invoiced_on).utcOffset('+05:30').format('LT')
              }
            </Text>
            <View style={styles.dateTimeSeperatorView} />
            <Text style={styles.timeTextStyle}>
              {
                 moment.utc(item.invoiced_on).format('D MMMM')
                }
            </Text>
          </View>
        </View>
      );
    } else if (item.status > 800) {
      return (
        <View>
          <View style={styles.leadCreatedViewStyle}>
            <Icon
              style={[styles.greenTickImageStyle]}
              name="times-circle"
              size={20}
              color="red" />
            <Text style={[styles.leadCreatedTextStyle, { color: 'red' }]}>
                  Lead Lost
            </Text>
          </View>
          <View style={styles.dateTimeView} >
            <Text style={styles.timeTextStyle}>
              {
              moment.utc(item.lost_on).utcOffset('+05:30').format('LT')
              }
            </Text>
            <View style={styles.dateTimeSeperatorView} />
            <Text style={styles.timeTextStyle}>
              {
                 moment.utc(item.lost_on).format('D MMMM')
                }
            </Text>
          </View>
        </View>
      );
    } else if (item.last_followup_on != null) {
      return (
        <View>
          <View style={styles.leadCreatedViewStyle}>
            <Icon
              style={[styles.greenTickImageStyle]}
              name="check-circle"
              size={20}
              color="#63a719" />
            <Text style={styles.leadCreatedTextStyle}>
                  Follow Up Done
            </Text>
          </View>
          <View style={styles.dateTimeView} >
            <Text style={styles.timeTextStyle}>
              {
              moment.utc(item.last_followup_on).utcOffset('+05:30').format('LT')
              }
            </Text>
            <View style={styles.dateTimeSeperatorView} />
            <Text style={styles.timeTextStyle}>
              {
                 moment.utc(item.last_followup_on).format('D MMMM')
                }
            </Text>
          </View>
        </View>
      );
    } else if (item.next_followup_on != null) {
      return (
        <View>
          <View style={styles.leadCreatedViewStyle}>
            <Icon
              style={[styles.greenTickImageStyle]}
              name="check-circle"
              size={20}
              color="#8c8c8c" />
            <Text style={[styles.leadCreatedTextStyle, { color: '#454545' }]}>
            Next Follow Up
            </Text>
          </View>
          <View style={styles.dateTimeView} >
            <Text style={styles.timeTextStyle}>
              {
                moment.utc(item.next_followup_on).utcOffset('+05:30').format('LT')
              }
            </Text>
            <View style={styles.dateTimeSeperatorView} />
            <Text style={styles.timeTextStyle}>
              {
                moment.utc(item.next_followup_on).format('D MMMM')
                }
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={styles.leadCreatedViewStyle}>
          <Icon
            style={[styles.greenTickImageStyle]}
            name="check-circle"
            size={20}
            color="#63a719" />
          <Text style={[styles.leadCreatedTextStyle]}>
            Lead created
          </Text>
        </View>
        <View style={styles.dateTimeView} >
          <Text style={styles.timeTextStyle}>
            {
              moment.utc(item.created_at).utcOffset('+05:30').format('LT')
            }
          </Text>
          <View style={styles.dateTimeSeperatorView} />
          <Text style={styles.timeTextStyle}>
            {
              moment.utc(item.created_at).format('D MMMM')
              }
          </Text>
        </View>
      </View>
    );
  }

  updateLeadDetails = (lead, dealer) => {
    if (!lead.lead_details && !lead.follow_up && !lead.lead_finance_detail) {
      delete lead.lead_details;
      delete lead.follow_up;
      delete lead.lead_finance_detail;
      if (lead.lostReason) {
        delete lead.lostReason;
      }
    }
    lead.assigned_to = dealer.id;
    this.props.updateLead(lead.id, lead).then(() => {
      this.onInitialLoad();
    });
  }

  updateCategoryCount=category => {
    switch (category) {
      case 'NEW':
        return `NEW (${this.state.newCount})`;
      case 'HOT':
        return `HOT (${this.state.hotCount})`;
      case 'WARM':
        return `WARM (${this.state.warmCount})`;
      case 'COLD':
        return `COLD (${this.state.coldCount})`;
      case 'INVOICED':
        return `INVOICED (${this.state.invoicedCount})`;
      case 'LOST':
        return `LOST (${this.state.lostCount})`;
      default:
        break;
    }
  }

  navigateToLeadScreen = lead => {
    const { dealerId } = this.props.currentUser;
    this.props.navigation.navigate('LeadHistory', { lead, currentDealerId: dealerId });
  }

  ViewBtnTapped = lead => {
    this.navigateToLeadScreen(lead);
  }

  addCommentsBtnTapped=lead => {
    this.navigateToLeadScreen(lead);
  }

  commentsBtnTapped=lead => {
    this.navigateToLeadScreen(lead);
  }

  changeTabColor = id => {
    if (this.state.tabPosition === id) {
      return styles.tabSelectedStyle;
    }
    return styles.tabStyle;
  }
  header = () => (
    <View style={styles.headerContainer}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.headerTextContent}>
          <Text style={{ color: 'white', paddingHorizontal: 5 }}>
              New leads
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
  )

  changeTextColor = id => {
    if (this.state.tabPosition === id) {
      return styles.tabSelectedTextStyle;
    }
    return styles.tabTextStyle;
  }

  renderItem = item => (
    <View style={styles.cardViewStyle}>
      <View style={styles.nameAssignView} >
        <Text style={[styles.cardVehicleNametext]}>
          {
          (item &&
        Object.keys(item).length !== 0 &&
        ('lead_details' in item) &&
        item.lead_details.length !== 0 &&
        ('vehicle' in item.lead_details[0]) &&
        Object.keys(item.lead_details[0].vehicle).length !== 0 &&
        ('name' in item.lead_details[0].vehicle)) ?
            `${item.lead_details[0].vehicle.name} ${item.lead_details.length > 1 ? ` + ${item.lead_details.length - 1}` : ''}` : 'NA'}
        </Text>
        <View style={styles.assignPickerViewStyle}
                >
          <Image
            style={styles.assignAvatarImageView}
            source={DealerAvatarIcon}
            resizeMode="contain"
                  />
          <View style={{
            flex: 6,
          }}
                  >
            <Picker
              style={styles.assignPickerStyle}
              selectedValue={this.getNameForUUId(item.assigned_to)}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) =>
                this.onDealerPickerChange(this.state.currentAssignedList[itemIndex], item)}
                    >
              {
                        this.state.currentAssignedList && this.state.currentAssignedList.map(currentAssigne => (
                          <Picker.Item
                            label={currentAssigne.first_name}
                            value={currentAssigne.first_name}
                            key={currentAssigne.id} />
                        ))
                    }
            </Picker>
          </View>
        </View>
      </View>
      <View style={{ height: 50 }} >
        <View style={{ flexDirection: 'row' }} >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              {this.getCurrentLeadStatus(item)}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => this.commentsBtnTapped(item)}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="commenting" size={21} color="#ff7561" />
                <Text style={[styles.leadCreatedTextStyle, { color: '#f3795c' }]}>
                  {`Comment(${item.comments_count})`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.addCommentsBtnTapped(item)}>
              <Text style={[styles.addCommentTextStyle, { color: '#f3795c' }]}>
              Add comment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.cardVerticalSeperator} />
      <View style={styles.rieContactView} >
        <View style={styles.testRideView} >
          <Text style={styles.specTitleTextStyle}>
                Test Ride
          </Text>
          <Text style={styles.specTitleDesTextStyle}>
            {
          (item &&
        Object.keys(item).length !== 0 &&
        ('lead_details' in item) &&
        item.lead_details.length !== 0 &&
        ('booked_on' in item.lead_details[0]) &&
           item.lead_details.booked_on != null) ? item.lead_details[0].vehicle.name : 'Not Taken'}
          </Text>
        </View>
        <View style={styles.rideContactSeperator} />
        <View style={styles.testRideView} >
          <Text style={styles.specTitleTextStyle}>
                Lead Contact
          </Text>
          <Text style={styles.specTitleDesTextStyle}>
            {item.mobile_number}
          </Text>
        </View>
      </View>
      <View style={styles.cardVerticalSeperator} />
      <View style={styles.leadDetailView} >
        <Text style={[styles.specTitleTextStyle, { marginTop: 20 }]}>
                Lead Details
        </Text>
        <View style={styles.nameGenderView} >
          <Text style={[styles.leadDetailsTextStyle]}>
            {item.name}
          </Text>
          <View style={styles.dotView} />
          <Text style={styles.leadDetailsTextStyle}>
            {item.gender}
          </Text>
        </View>
      </View>
      <ButtonWithLeftImage
        image={ViewIcon}
        style={styles.viewButtonStyle}
        textStyle={styles.viewButtonTextStyle}
        handleSubmit={() => this.ViewBtnTapped(item)}
        title="VIEW"
                    />
    </View>
  )

  render() {
    return (
      <View style={styles.container} >
        <Loader loading={this.props.loading} />
        <AppHeader backEnabled navigation={this.props.navigation}>
          {this.header()}
        </AppHeader>
        <View style={styles.tabviewStyle}>
          {this.getTabData()}
        </View>
        {
          (this.state.overAlLeadList && this.state.newCount === 0 &&
          this.state.hotCount === 0 &&
          this.state.warmCount === 0 &&
          this.state.coldCount === 0 &&
          this.state.invoicedCount === 0 &&
          this.state.lostCount === 0) ?
            <View style={styles.newLeadsView}>
              <Text style={styles.noLeadsText}
      >
      No leads to show :(
              </Text>
            </View>
            :
            <ScrollView
              style={styles.scrollViewStyles}
              scrollEnabled
              horizontal
              overScrollMode="always"
            >
              {this.getLeadOverViewList()}
            </ScrollView>
        }
      </View>
    );
  }
}

