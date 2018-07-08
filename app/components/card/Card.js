import React, { Component } from 'react';
import { View, Text, Image, Picker, TouchableOpacity, Dimensions, Alert } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonWithLeftImage } from '../button/Button';
import { updateLead } from '../../redux/actions/FollowUpLeads/actionCreators';
import ViewIcon from '../../assets/images/ic_primary_view_icon.png';
import avatar from '../../assets/images/avatar.png';
import fonts from '../../theme/fonts';
import styles from '../../layouts/NewLeadsOverview/newLeadOverviewStyles';

const DEVICE_WIDTH = Dimensions.get('screen').width;

@connect(state => ({
  updateResponse: state.followUpLeads.updateResponse,
}), {
  updateLead
})

export default class Card extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    searchOn: PropTypes.bool,
    dropdownData: PropTypes.array,
    widthOfCard: PropTypes.number,
    updateLead: PropTypes.func.isRequired,
    onDropDownChange: PropTypes.func.isRequired,
    tab: PropTypes.string,
    onViewClicked: PropTypes.func.isRequired
  }

  static defaultProps = {
    dropdownData: [],
    widthOfCard: 0,
    searchOn: false,
    tab: 'fresh'
  }

  constructor(props) {
    super(props);
    this.state = ({
    });
  }

  getLabel = labelDefault => {
    switch (this.props.tab) {
      case 'invoiced':
        return 'Invoiced';
      case 'lost':
        return 'Lead Lost';
      default:
        return labelDefault;
    }
  }

  getRespectiveDate = (state, item) => {
    switch (this.props.tab) {
      case 'invoiced':
        return moment.utc(item.invoiced_on).utcOffset('+05:30').format('LT');
      case 'lost':
        return moment.utc(item.lost_on).utcOffset('+05:30').format('LT');
      default:
        return moment.utc(state).utcOffset('+05:30').format('LT');
    }
  }

  getRespectiveMonth = (state, item) => {
    switch (this.props.tab) {
      case 'invoiced':
        return moment.utc(item.invoiced_on).format('D MMMM');
      case 'lost':
        return moment.utc(item.lost_on).format('D MMMM');
      default:
        return moment.utc(state).format('D MMMM');
    }
  }

  getCurrentLeadStatus = item => {
    if (item.last_followup_on != null) {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            {
            this.props.tab === 'lost' ?
              <Icon
                style={[styles.greenTickImageStyle, { marginLeft: 0 }]}
                name="times-circle"
                size={20}
                color="#D5180D" />
              :
              <Icon
                style={[styles.greenTickImageStyle, { marginLeft: 0 }]}
                name="check-circle"
                size={20}
                color="#89ce59" />
          }

            <Text style={[styles.leadCreatedTextStyle, { paddingTop: 2 },
              this.props.tab === 'lost' ? { color: '#D5180D' } : null]}>
              {
                this.getLabel('Follow Up Done')
              }
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 5 }} >
            <Text style={styles.timeTextStyle}>
              {
              // moment.utc(item.last_followup_on).utcOffset('+05:30').format('LT')
                this.getRespectiveDate(item, item.last_followup_on)
              }
            </Text>
            <View style={{
              height: 20, width: 1, backgroundColor: '#e6e6e6', marginHorizontal: 5
            }} />
            <Text style={styles.timeTextStyle}>
              {
                 // moment.utc(item.last_followup_on).format('D MMMM')
                this.getRespectiveMonth(item, item.last_followup_on)
                }
            </Text>
          </View>
        </View>
      );
    } else if (item.next_followup_on != null) {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            {
            this.props.tab === 'lost' ?
              <Icon
                style={[styles.greenTickImageStyle, { marginLeft: 0 }]}
                name="times-circle"
                size={20}
                color="#D5180D" />
              :
              <Icon
                style={[styles.greenTickImageStyle, { marginLeft: 0 }]}
                name="check-circle-o"
                size={20}
                color="#8c8c8c" />
          }

            <Text style={[styles.leadCreatedTextStyle, { color: '#454545', paddingTop: 2 },
              this.props.tab === 'lost' ? { color: '#D5180D' } : null]}>
              {
                this.getLabel('Next Follow Up')
              }
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 5 }} >
            <Text style={styles.timeTextStyle}>
              {
                // moment.utc(item.next_followup_on).utcOffset('+05:30').format('LT')
                this.getRespectiveDate(item, item.next_followup_on)
              }
            </Text>
            <View style={{
              height: 20, width: 1, backgroundColor: '#e6e6e6', marginHorizontal: 5
            }} />
            <Text style={styles.timeTextStyle}>
              {
                // moment.utc(item.next_followup_on).format('D MMMM')
                this.getRespectiveMonth(item, item.next_followup_on)
                }
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          {
            this.props.tab === 'lost' ?
              <Icon
                style={[styles.greenTickImageStyle, { marginLeft: 0 }]}
                name="times-circle"
                size={20}
                color="#D5180D" />
              :
              <Icon
                style={[styles.greenTickImageStyle, { marginLeft: 0 }]}
                name="check-circle"
                size={20}
                color="#63a719" />
          }

          <Text style={[styles.leadCreatedTextStyle, { paddingTop: 2 },
            this.props.tab === 'lost' ? { color: '#D5180D' } : null]}>
            {
              this.getLabel('Leads Created')
            }
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }} >
          <Text style={styles.timeTextStyle}>
            {
              // moment.utc(item.created_at).utcOffset('+05:30').format('LT')
              this.getRespectiveDate(item, item.created_at)
            }
          </Text>
          <View style={{
            height: 20, width: 1, backgroundColor: '#e6e6e6', marginHorizontal: 5
          }} />
          <Text style={styles.timeTextStyle}>
            {
              // moment.utc(item.created_at).format('D MMMM')
              this.getRespectiveMonth(item, item.created_at)
              }
          </Text>
        </View>
      </View>
    );
  }

  getExecutiveForSelectedLead = (value, index, item) => {
    Alert.alert(
      'Message',
      `Do you want to change the lead to ${value}`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.updateLeadDetails(index, item) },
      ],
      { cancelable: false }
    );
  }

  updateLeadDetails = (index, item) => {
    item.assigned_to = this.props.dropdownData[index].id;
    const temp = {};
    Object.assign(temp, item);
    if (!temp.lead_details && !temp.follow_up && !temp.lead_finance_detail) {
      delete temp.lead_details;
      delete temp.follow_up;
      delete temp.lead_finance_detail;
      if (temp.lostReason) {
        delete temp.lostReason;
      }
    }
    this.props.updateLead(item.id, temp)
      .then(() => this.props.onDropDownChange()).then(() => {
      }).catch(() => {
      });
  }

  currentlySelectedExecutive = item => {
    const tempObj = this.props.dropdownData.filter(eachDropDownData => {
      if (eachDropDownData.id === item.assigned_to) {
        return eachDropDownData;
      }
    });
    if (tempObj.length > 0) {
      return tempObj[0].first_name;
    }
    return null;
  }

  commentsBtnTapped = () => {
    this.props.onViewClicked();
  }

  addCommentsBtnTapped = () => {
    this.props.onViewClicked();
  }

  render() {
    const { item } = this.props;
    return (
      <View style={[
        this.props.widthOfCard !== 0 ? {
          width: this.props.widthOfCard,
        } : { flex: 1 },
        {
          marginHorizontal: 10,
          marginVertical: 10,
          backgroundColor: 'white',
          elevation: 4,
          borderRadius: 4
        }]}>
        {
          this.props.searchOn ?
            <View>
              <Text>Tag</Text>
            </View>
            :
            null
        }
        <View style={{
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          marginTop: 15
        }}>
          <View style={{
            marginTop: 5,
            justifyContent: 'space-between',
            flex: 1,
            marginHorizontal: 18,
            flexDirection: 'column'
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'SourceSansPro-Bold',
                color: '#3A3A3A',
                fontSize: 15,
              }}>
                {
                item.lead_details && item.lead_details.length > 0 ?
                  `${item.lead_details[0].vehicle.name} ${item.lead_details.length > 1 ? ` + ${item.lead_details.length - 1} ` : ''}`
                  :
                  <Text>
                NA
                  </Text>
          }
              </Text>
            </View>
            {
              this.props.tab === 'invoiced' || this.props.tab === 'lost' ?
                <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                  <Image
                    source={avatar}
                    style={{ marginRight: 5, marginVertical: 5 }}
              />
                  <Text style={{ paddingTop: 3 }}>{this.currentlySelectedExecutive(item)}</Text>
                </View>
                :
                null
            }
          </View>
          {
            this.props.tab !== 'invoiced' && this.props.tab !== 'lost' ?
              <View style={{
                marginTop: 10,
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
                padding: 5,
                backgroundColor: '#FCFCFC'
              }}>
                <Image
                  source={avatar}
                  style={{ margin: 5 }}
              />
                <Picker
                  selectedValue={this.currentlySelectedExecutive(item)}
                  mode="dropdown"
                  style={{
                    height: 20,
                    width: 220
                  }}
                  onValueChange={(itemValue, itemIndex) => this.getExecutiveForSelectedLead(itemValue, itemIndex, item)}
                >
                  {
                this.props.dropdownData.map(eachExecutive => (
                  <Picker.Item
                    key={eachExecutive.id}
                    label={eachExecutive.first_name}
                    value={eachExecutive.first_name} />
                ))
              }
                </Picker>
              </View>
              :
              null
          }
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 15
        }}>
          {this.getCurrentLeadStatus(item)}
          <View style={{
            flex: 1, marginLeft: 40, marginBottom: 10
          }}>
            <TouchableOpacity
              onPress={() => this.commentsBtnTapped()}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="commenting" size={21} color="#ff7561" />
                <Text style={[styles.leadCreatedTextStyle, { color: '#f3795c', marginTop: 2 }]}>
                  {`Comment(${item.comments_count})`}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }} >
              <TouchableOpacity
                onPress={() => this.addCommentsBtnTapped()}>
                <Text style={[styles.timeTextStyle, {
                  color: '#f3795c',
                  paddingTop: 5
                }]}>
                Add comment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {
          this.props.tab === 'lost' ?
            item.lostReason ?
              <View>
                <Text style={{
                  paddingLeft: 20,
                  fontSize: 14,
                  fontFamily: 'SourceSansPro-Regular',
                  paddingBottom: 10,
                  color: '#D5180D'
                }}>
                  {item.lostReason.reason}
                </Text>
              </View>
              :
              <View style={{ }}>
                <Text style={{
                  paddingLeft: 20,
                  fontSize: 14,
                  fontFamily: 'SourceSansPro-Regular',
                  paddingBottom: 10,
                  color: '#D5180D'
                }}>
                NA
                </Text>
              </View>
            :
            null
        }
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          borderTopColor: '#e6e6e6',
          borderTopWidth: 0.5,
          borderBottomColor: '#e6e6e6',
          borderBottomWidth: 0.5,
          paddingHorizontal: 20
        }}>
          <View style={{
            paddingVertical: 10
          }}>
            <Text style={{
              color: '#8c8c8c',
              fontSize: 12,
              fontFamily: 'SourceSansPro-Regular',
            }}>
                Test Ride
            </Text>
            <Text style={{
              color: '#454545',
              fontFamily: 'SourceSansPro-SemiBold',
              fontSize: 17,
            }}>
              {
                item.lead_details.length > 0 ?
                  `${item.lead_details[0].test_ride_status ?
                    item.lead_details[0].test_ride_status :
                    'No'}`
                  :
                  'NO'
              }
            </Text>
          </View>
          <View style={{
            marginHorizontal: 8,
            paddingLeft: 20,
            borderLeftWidth: 0.5,
            borderLeftColor: '#e6e6e6',
            paddingVertical: 10
          }}>
            <Text style={{
              color: '#8c8c8c',
              fontSize: 12,
              fontFamily: 'SourceSansPro-Regular',
            }}>
                Lead Contact
            </Text>
            <Text style={{
              color: '#454545',
              fontFamily: 'SourceSansPro-SemiBold',
              fontSize: 17,
              // fontWeight: 'bold'
            }}>
              {item.mobile_number}
            </Text>
          </View>
        </View>
        {/* Lead Details */}
        <View style={{
          flexDirection: 'column',
          marginVertical: 5
        }}>
          <Text style={{
            color: '#8c8c8c',
            fontSize: 13,
            fontFamily: 'SourceSansPro-Regular',
            marginLeft: 20,
            marginBottom: 5
          }}>Lead Details
          </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginHorizontal: 20,
            paddingRight: 20
          }}>
            <Text style={{
              color: '#464646',
              fontSize: 12,
              fontFamily: 'SourceSansPro-Regular',
            }}>{item.name}
            </Text>
            {/* If location is asked in future, can uncomment this */}
            {/* {
              item.location ?
                <View style={{
                  flexDirection: 'row'
                }}>
                  <View style={{
                    borderColor: '#D9D9D9',
                    borderWidth: 5,
                    // backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    marginTop: 5,
                    marginBottom: 7,
                    marginHorizontal: 10
                  }} />
                  <Text style={{
                    color: '#464646',
                    fontSize: 12,
                    fontFamily: 'SourceSansPro-Regular'
                  }}>{item.location}
                  </Text>

                </View>
                :
                null
            } */}
            {
              item.gender ?
                <View style={{
                  flexDirection: 'row'
                }}>
                  <View style={{
                    borderColor: '#D9D9D9',
                    borderWidth: 5,
                    // backgroundColor: '#D9D9D9',
                    borderRadius: 5,
                    marginTop: 5,
                    marginBottom: 7,
                    marginHorizontal: 10
                  }} />
                  <Text style={{
                    color: '#464646',
                    fontSize: 12,
                    fontFamily: 'SourceSansPro-Regular'
                  }}>{item.gender}
                  </Text>
                </View> :
                null
            }
          </View>
        </View>
        {/* View Button */}
        <LinearGradient
          colors={['#FFEEE5', '#FFEEE5']}
          style={{
            flexDirection: 'row',
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 10,
            justifyContent: 'center'
          }}>
          <ButtonWithLeftImage
            image={ViewIcon}
            style={{
              width: (DEVICE_WIDTH / 3) - 40,
              height: 30,
              alignItems: 'center',
              backgroundColor: '#ffefe5'
            }}
            textStyle={{
              width: 40,
              color: '#f26a35',
              fontFamily: fonts.sourceSansProSemiBold,
              fontSize: 15,
            }}
            handleSubmit={() => { this.props.onViewClicked(); }}
            title="VIEW"
          />
        </LinearGradient>
      </View>
    );
  }
}
