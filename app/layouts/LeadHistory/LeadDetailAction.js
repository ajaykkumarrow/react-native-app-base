import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  DatePickerAndroid,
  TimePickerAndroid,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import styles from './leadDetailActionStyles';
import Timeline from '../../components/timeline/Timeline';
import unselectedIcon from '../../assets/images/ic_unselected.png';
import selectedIcon from '../../assets/images/ic_selected.png';
import moveToIcon from '../../assets/images/ic_move_to.png';
import {
  getLead,
  getLostReasons,
  postLeadFollowUp,
  updateLead,
  updateLeadFollowUp,
  postComment,
  getLeadActivities
} from '../../redux/actions/LeadAction/actionCreators';
import Loader from '../../components/loader/Loader';

@connect(state => ({
  loading: state.leadAction.loading,
  leadResponse: state.leadAction.leadResponse,
  updateLeadResponse: state.leadAction.updateLeadResponse,
  followUpResponse: state.leadAction.followUpResponse,
  lostReasonResponse: state.leadAction.lostReasonResponse,
  updateLeadFollowResponse: state.leadAction.updateLeadFollowResponse,
  leadActivitiesResponse: state.leadAction.leadActivitiesResponse
}), {
  getLead,
  getLostReasons,
  postLeadFollowUp,
  updateLead,
  updateLeadFollowUp,
  postComment,
  getLeadActivities
})
export default class LeadDetailAction extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    getLead: PropTypes.func.isRequired,
    leadResponse: PropTypes.object,
    screenProps: PropTypes.object.isRequired,
    getLostReasons: PropTypes.func.isRequired,
    lostReasonResponse: PropTypes.array,
    updateLeadFollowUp: PropTypes.func.isRequired,
    updateLead: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
    postLeadFollowUp: PropTypes.func.isRequired,
    getLeadActivities: PropTypes.func.isRequired,
    leadActivitiesResponse: PropTypes.array,
    navigation: PropTypes.func.isRequired
  }

  static defaultProps = {
    leadResponse: {},
    lostReasonResponse: [],
    leadActivitiesResponse: []
  }
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      categoryIndex: 0,
      scheduleFollowUp: false,
      date: '',
      time: '',
      reasons: {},
      isExpand: [],
      followUpDone: false,
      hours: 0,
      minutes: 0,
      day: 0,
      months: 0,
      years: 0,
      reasonId: ''
    };
  }

  componentDidMount() {
    const { screenProps } = this.props;
    this.getLead(screenProps.navigation.state.params.lead.id);
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getLead(screenProps.navigation.state.params.lead.id);
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  onChangeText = value => {
    this.setState({ comment: value });
  }

  onFollowUpSwitch = value => {
    this.setState({ scheduleFollowUp: value, date: '', time: '' });
  }

  getLead = leadId => {
    this.props.getLead(leadId)
      .then(() => {
        const index = this.getIndex();
        this.setState({
          categoryIndex: index,
          reasonId: this.props.leadResponse.lost_reason_id
        });
        return this.props.getLeadActivities(leadId);
      })
      .then(() => this.props.getLostReasons()).then(() => {
        this.getReasonCategories();
      })
      .catch(error => {
        console.log(error);
      });
  }

  getReasonCategories = () => {
    const reasons = {};
    const isExpand = [];
    this.props.lostReasonResponse.forEach(item => {
      if (reasons[item.category]) {
        item.active = false;
        reasons[item.category].push(item);
      } else {
        item.active = false;
        isExpand.push(false);
        reasons[item.category] = [item];
      }
    });

    this.setState({
      reasons,
      isExpand,
      comment: '',
      date: '',
      time: '',
      scheduleFollowUp: false
    });
  }

  getCategoriesColor = category => {
    switch (category) {
      case 'NEW':
        return { backgroundColor: '#47AC50' };
      case 'WARM':
        return { backgroundColor: '#FF9900' };
      case 'HOT':
        return { backgroundColor: '#FA381E' };
      case 'COLD':
        return { backgroundColor: '#00ABF4' };
      case 'LOST':
        return { backgroundColor: '#606060' };
      default:
        break;
    }
  }

  getCategoryView = rowData => {
    if (rowData.type === 'Change Category') {
      if (rowData.move_to && rowData.move_from) {
        return (
          <View style={styles.categoryView}>
            <Text style={[styles.categoryLabel, this.getCategoriesColor(rowData.move_from)]}>{rowData.move_from}</Text>
            <Image source={moveToIcon} resizeMode="contain" style={{ marginHorizontal: 10 }} />
            <Text style={[styles.categoryLabel, this.getCategoriesColor(rowData.move_to)]}>{rowData.move_to}</Text>
          </View>
        );
      }
    } else if (rowData.type === 'Lead Transfered') {
      return (
        <View style={styles.categoryView}>
          <Text style={[styles.categoryLabel, { color: '#838383' }]}>To: </Text>
          <Text style={[styles.categoryLabel, { color: '#838383' }]}>{rowData.move_to}</Text>
        </View>
      );
    } else {
      return (
        <Text style={[styles.categoryLabel, this.getCategoriesColor(rowData.move_to)]}>{rowData.move_to}</Text>
      );
    }
  }

  getIndex = () => {
    const { leadResponse } = this.props;
    if (leadResponse.status < 600) {
      switch (leadResponse.category) {
        case 'NEW':
          return 0;
        case 'HOT':
          return 1;
        case 'WARM':
          return 2;
        case 'COLD':
          return 3;
        default:
          break;
      }
    } else if (leadResponse.status >= 600 && leadResponse.status < 900) {
      return 5;
    } else if (leadResponse.status >= 900) {
      return 4;
    }
  }

  scheduleFollowUp = () => {
    const {
      years, months, day, minutes, hours
    } = this.state;
    const { leadResponse } = this.props;
    const date = moment({
      years, months, date: day, hours, minutes
    }).utc().format();
    const followUpData = {
      follow_up_at: date,
      comment: this.state.comment
    };
    this.props.postLeadFollowUp(leadResponse.id, followUpData)
      .then(() => {
        this.getLead(leadResponse.id);
      }).catch(error => {
        console.log(error);
      });
  }

  handleConfirmFollowUp = () => {
    const {
      comment
    } = this.state;
    const { leadResponse } = this.props;
    const followUp = leadResponse.follow_up[0];
    const confirmData = {
      id: followUp.id,
      completed_at: moment(new Date()).utc('+5:30').format(),
      is_completed: true,
      comment,
    };

    this.props.updateLeadFollowUp(leadResponse.id, followUp.id, confirmData)
      .then(() => {
        this.getLead(leadResponse.id);
      }).catch(error => {
        console.log(error);
      });
  }

  handleRadioChange = (currentItem, currentIndex) => {
    const keys = Object.keys(this.state.reasons);
    let reasonId = null;
    keys.forEach(item => {
      this.state.reasons[item].forEach((keyItem, keyIndex) => {
        if (item === currentItem && keyIndex === currentIndex) {
          keyItem.active = true;
          reasonId = keyItem.id;
        } else {
          keyItem.active = false;
        }
      });
    });
    this.setState({
      reasons: this.state.reasons,
      reasonId,
      date: '',
      time: ''
    });
  }

  handleTimePicker = () => {
    try {
      TimePickerAndroid.open({
        is24Hour: false
      }).then(({
        action, hour, minute
      }) => {
        if (action !== TimePickerAndroid.dismissedAction) {
          const time = moment({ hours: hour, minutes: minute }).format('LT');
          this.setState({ time, hours: hour, minutes: minute });
        }
      });
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  handleDatePicker = () => {
    try {
      DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date()
      }).then(({
        action, year, month, day
      }) => {
        if (action !== DatePickerAndroid.dismissedAction) {
          const date = moment({ years: year, months: month, date: day }).format('DD MMM, YYYY');
          this.setState({
            date, years: year, months: month, day
          });
        }
      });
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  handleInvoice = () => {
    Alert.alert(
      '',
      'Lead cannot be moved to invoiced here.',
      [
        { text: 'Ok', onPress: () => { } },
      ],
      { cancelable: false }
    );
  }

  handleDoneClick = () => {
    const { leadResponse } = this.props;
    const { categoryIndex, reasonId } = this.state;
    const lead = JSON.parse(JSON.stringify(leadResponse));
    delete lead.lead_details;
    switch (categoryIndex) {
      case 0:
        // NEW
        lead.category = 'NEW';
        break;
      case 1:
        // HOT
        lead.category = 'HOT';
        break;
      case 2:
        // WARM
        lead.category = 'WARM';
        break;
      case 3:
        // COLD
        lead.category = 'COLD';
        break;
      case 4:
        // LOST
        lead.status = 900;
        lead.lost_on = moment(new Date()).utc('+5:30').format();
        if (reasonId !== 0) {
          lead.lost_reason_id = reasonId;
        }
        break;
      case 5:
        // INVOICED
        lead.status = 600;
        lead.invoiced_on = moment(new Date()).utc('+5:30').format();
        break;
      default:
        break;
    }

    if (categoryIndex === 4 && reasonId === null) {
      Alert.alert(
        '',
        'Please select the lost reason to continue',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      );
    } else {
      this.props.updateLead(lead.id, lead)
        .then(() => {
          if (this.state.scheduleFollowUp && this.state.date.length > 0 && this.state.time.length > 0) {
            this.scheduleFollowUp();
          } else if (this.state.comment.length > 0) {
            const commentData = {
              comment: this.state.comment
            };
            this.props.postComment(lead.id, commentData)
              .then(() => {
                this.getLead(lead.id);
              }).catch(error => {
                console.log(error);
              });
          } else {
            this.getLead(lead.id);
          }
        }).catch(() => {

        });
    }
  }

  renderDetail = rowData => (
    <View style={styles.timelineCard}>
      <View>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>{
                (rowData.type) ?
                  rowData.type : ''
                }
            </Text>
          </View>
          <View style={[styles.categoryWrapper, { flex: 1 }]}>
            {
              this.getCategoryView(rowData)
            }
          </View>
        </View>
        {
          (rowData.type === 'Comments Added') ?
            <Text style={styles.commentLabel}>{`"${rowData.comment}"`}</Text>
            :
            null
        }
        <Text style={styles.doneBy}>{`Done by: ${rowData.doneBy.first_name}`}</Text>
      </View>
    </View>
  )

  renderTime = rowData => (
    <View style={{ width: 50 }}>
      <Text style={styles.timelineDay}>{moment(rowData.created_at).utc('+5:30').format('DD')}</Text>
      <Text style={styles.timelineMonth}>{moment(rowData.created_at).utc('+5:30').format('MMM')}</Text>
      <Text style={styles.timelineTime}>{moment(rowData.created_at).utc('+5:30').format('LT')}</Text>
    </View>
  )

  renderReasons = () => {
    const { leadResponse } = this.props;

    if (leadResponse.lost_reason_id === null) {
      const keys = Object.keys(this.state.reasons);
      return keys.map((currentItem, currentIndex) => (
        <View>
          <TouchableOpacity
            style={styles.reasonHeader}
            onPress={() => {
              this.state.isExpand[currentIndex] = !this.state.isExpand[currentIndex];
              this.setState({
                isExpand: this.state.isExpand
              });
            }}>
            <Text style={styles.actionLabel}>{currentItem}</Text>
          </TouchableOpacity>
          {
            (this.state.isExpand[currentIndex]) ?

              <View style={styles.reasonView}>
                {
                this.state.reasons[currentItem].map((item, index) => (

                  <View style={styles.reasonRowItem}>
                    <TouchableOpacity
                      onPress={() => { this.handleRadioChange(currentItem, index); }}
                      style={styles.radioNormal}
                          >
                      {
                              item.active ?
                                <View style={styles.radioSelected}
                                />
                                :
                                null
                          }
                    </TouchableOpacity>
                    <Text style={styles.actionLabel}>{item.reason}</Text>
                  </View>
                ))
              }
              </View>
              :
              null
          }
        </View>
      ));
    }
    const lostReasonId = leadResponse.lost_reason_id;
    let reason = '';
    if (lostReasonId) {
      this.props.lostReasonResponse.forEach(item => {
        if (item.id === lostReasonId) {
          reason = item.reason;
        }
      });
      return (
        <View>
          <Text style={[styles.reasonLabel, { marginTop: 20 }]}>{`Reason: ${reason}`}</Text>
        </View>
      );
    }
  }

  renderCategories = () => {
    const { leadResponse } = this.props;
    const { categoryIndex } = this.state;
    if (leadResponse.status < 600) {
      if (leadResponse.category === 'NEW') {
        return (
          <View style={styles.moveToView}>
            <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 0 }); }}>
              <Text style={[(categoryIndex === 0)
                ? [styles.categoriesTextActivated, { backgroundColor: '#47AC50' }]
                : styles.categoriesTextNormal, { marginRight: 20 }]}>New
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 1 }); }}>
              <Text style={[(categoryIndex === 1)
                ? [styles.categoriesTextActivated, { backgroundColor: '#FA381E' }]
                : styles.categoriesTextNormal, { marginRight: 20 }]}>Hot
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 2 }); }}>
              <Text style={[(categoryIndex === 2)
                ? [styles.categoriesTextActivated, { backgroundColor: '#FF9900' }]
                : styles.categoriesTextNormal, { marginRight: 20 }]}>Warm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 3 }); }}>
              <Text style={[(categoryIndex === 3)
                ? [styles.categoriesTextActivated, { backgroundColor: '#00ABF4' }]
                :
                styles.categoriesTextNormal, { marginRight: 20 }]}>Cold
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 4 }); }}>
              <Text style={[(categoryIndex === 4)
                ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
                : styles.categoriesTextNormal, { marginRight: 20 }]}>Lost
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.handleInvoice(); }}>
              <Text style={[(categoryIndex === 5)
                ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
                : styles.categoriesTextNormal, { marginRight: 20 }]}>Invoiced
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <View style={styles.moveToView}>
          <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 1 }); }}>
            <Text style={[(categoryIndex === 1)
              ? [styles.categoriesTextActivated, { backgroundColor: '#FA381E' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Hot
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 2 }); }}>
            <Text style={[(categoryIndex === 2)
              ? [styles.categoriesTextActivated, { backgroundColor: '#FF9900' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Warm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 3 }); }}>
            <Text style={[(categoryIndex === 3)
              ? [styles.categoriesTextActivated, { backgroundColor: '#00ABF4' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Cold
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 4 }); }}>
            <Text style={[(categoryIndex === 4)
              ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Lost
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.handleInvoice(); }}>
            <Text style={[(categoryIndex === 5)
              ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Invoiced
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (leadResponse.status >= 600 && leadResponse.status < 900) {
      return (
        <View style={styles.moveToView}>
          {/* <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 4 }); }}>
            <Text style={[(categoryIndex === 4)
              ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Lost
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 5 }); }}>
            <Text style={[(categoryIndex === 5)
              ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Invoiced
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (leadResponse.status >= 900) {
      return (
        <View style={styles.moveToView}>
          <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 4 }); }}>
            <Text style={[(categoryIndex === 4)
              ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Lost
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => { this.setState({ categoryIndex: 5 }); }}>
            <Text style={[(categoryIndex === 5)
              ? [styles.categoriesTextActivated, { backgroundColor: '#606060' }]
              : styles.categoriesTextNormal, { marginRight: 20 }]}>Invoiced
            </Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  }

  render() {
    const { categoryIndex } = this.state;
    const { leadResponse } = this.props;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Loader loading={this.props.loading} />
        <View style={styles.commentWrapper}>
          <Text style={styles.actionLabel}>Add Comment</Text>
          <View style={styles.commentView}>
            <TextInput
              returnKeyType="done"
              style={{ height: 80 }}
              numberOfLines={4}
              onChangeText={text => this.setState({ comment: text })}
              value={this.state.comment}
              underlineColorAndroid="transparent" />
          </View>
        </View>
        <View style={styles.moveToWrapper}>
          <Text style={styles.actionLabel}>Move To</Text>
          {this.renderCategories()}
        </View>
        {
          (categoryIndex === 4) ?
            this.renderReasons()
            :
            null
        }

        {
          (categoryIndex !== 4) ? (
            (leadResponse && leadResponse.follow_up && leadResponse.follow_up.length > 0) ?
              <View style={styles.followUpDateView}>
                <View style={styles.dateView}>
                  <Text style={styles.actionLabel}>Date & Time: </Text>

                  <Text style={[styles.actionLabel, { marginLeft: 10 }]}>{
                  (leadResponse && leadResponse.follow_up && leadResponse.follow_up.length > 0
                  && leadResponse.follow_up[0].follow_up_at) ?

                    moment(leadResponse.follow_up[0].follow_up_at).utc('+5:30').format('DD MMM, YYYY  LT')
                    :
                    null
                }
                  </Text>
                </View>
                <View style={styles.followUpDone}>
                  <Text style={[styles.actionLabel, { marginRight: 10 }]}>Follow Up Done</Text>
                  {

                    <TouchableOpacity onPress={() => {
                      this.setState({ followUpDone: true }, () => {
                        Alert.alert(
                          '',
                          'Do you want to close the existing Follow Up?',
                          [
                            {
                              text: 'Ok',
                              onPress: () => {
                                this.handleConfirmFollowUp();
                              }
                            },
                            { text: 'Cancel', onPress: () => { this.setState({ followUpDone: false }); }, style: 'cancel' }
                          ],
                          { cancelable: false }
                        );
                      });
                    }}>
                      {
                    (this.state.followUpDone) ?
                      <Image source={selectedIcon} style={{ width: 15, height: 15 }} resizeMode="contain" />
                      :
                      <Image source={unselectedIcon} style={{ width: 15, height: 15 }} resizeMode="contain" />
                  }
                    </TouchableOpacity>
            }
                </View>
              </View>
              :
              <View style={styles.scheduleFollowView}>
                <View style={styles.newScheduleView}>
                  <Text style={[styles.actionLabel, { marginRight: 10 }]}>Schedule Follow Up?</Text>
                  <Switch
                    onValueChange={this.onFollowUpSwitch}
                    value={this.state.scheduleFollowUp}
                    thumbTintColor="#f2f2f2"
                    onTintColor="#6fc511" />
                </View>
                {
          (this.state.scheduleFollowUp) ?
            <View style={styles.dateTimeView}>
              <TouchableOpacity style={{ flexDirection: 'row' }}onPress={() => { this.handleDatePicker(); }}>
                <Text style={[styles.actionLabel, {
                  marginRight: 10,
                  elevation: 2,
                  backgroundColor: '#f2f2f2',
                  margin: 2,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  color: '#4a4a4a',
                  borderRadius: 2
                }]} >Select Date
                </Text>
              </TouchableOpacity>
              <Text style={[styles.actionLabel, { marginRight: 10, width: 90 }]}>{this.state.date}</Text>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.handleTimePicker(); }}>
                <Text style={[styles.actionLabel, {
                  marginRight: 10,
                  elevation: 2,
                  backgroundColor: '#f2f2f2',
                  margin: 2,
                  borderRadius: 2,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  color: '#4a4a4a'
                }]} >Select Time
                </Text>
              </TouchableOpacity>
              <Text style={[styles.actionLabel, { marginRight: 10, width: 90 }]}>{this.state.time}</Text>
            </View>
            :
            null
        }
              </View>
          )
            :
            null
        }
        <View style={{ alignItems: 'flex-end', marginRight: 20, marginTop: 20 }}>
          <TouchableOpacity onPress={() => { this.handleDoneClick(); }}>
            <LinearGradient
              colors={['#f79426', '#f16537']}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 1.0 }} >
              <Text style={{
                paddingHorizontal: 15,
                paddingVertical: 5,
                color: 'white',
                fontFamily: 'SourceSansPro-Bold',
                fontSize: 14
              }}>DONE
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.activityText}>Activities
          </Text>
          {
            (this.props.leadActivitiesResponse.length > 0) ?
              <View style={{ marginTop: 30 }}>
                <Timeline
                  style={styles.list}
                  data={this.props.leadActivitiesResponse}
                  circleColor="#cdd7d7"
                  lineColor="#cdd7d7"
                  renderDetail={this.renderDetail}
                  renderTime={this.renderTime}
          />
              </View>
              :
              <Text style={[styles.actionLabel, { alignSelf: 'center' }]}>No activities available</Text>

          }
        </View>
      </ScrollView>
    );
  }
}
