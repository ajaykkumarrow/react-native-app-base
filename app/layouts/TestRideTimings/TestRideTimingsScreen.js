import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, TimePickerAndroid, Picker } from 'react-native';
import styles from './testRideTimingsStyles';
import testRideTimings from '../../redux/actions/TestRideTimings/actionCreators';
import storage from '../../helpers/AsyncStorage';
import ContinueSectionScreen from '../../components/ContinueSection/ContinueSectionScreen';
import Loader from '../../components/loader/Loader';

@connect(state => ({
  testRidedata: state.rideTimings.data,
  loading: state.rideTimings.loading
}), { testRideTimings })

export default class TestRideTimingsScreen extends Component {
  static propTypes = {
    testRideTimings: PropTypes.func.isRequired,
    changeStep: PropTypes.func.isRequired,
    dealer: PropTypes.object,
    previousStep: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    dealer: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      weekdays: this.props.dealer.weekly_holiday || '',
      daysCalculate: [
        {
          id: 1,
          daySlots: 'Monday - Friday',
          startTime: this.splittedTime(this.props.dealer.monday_friday_start),
          endTime: this.splittedTime(this.props.dealer.monday_friday_end),
          methodCall: (param, index) => { this.handleDatePicker(param, index); }
        },
        {
          id: 2,
          daySlots: 'Saturday',
          startTime: this.splittedTime(this.props.dealer.saturday_start),
          endTime: this.splittedTime(this.props.dealer.saturday_end),
          methodCall: (param, index) => { this.handleDatePicker(param, index); }
        },
        {
          id: 3,
          daySlots: 'Sunday',
          startTime: this.splittedTime(this.props.dealer.sunday_start),
          endTime: this.splittedTime(this.props.dealer.sunday_end),
          methodCall: (param, index) => { this.handleDatePicker(param, index); }
        }
      ],
      mondayFridayStart: '',
      mondayFridayEnd: '',
      saturdayStart: '',
      saturdayEnd: '',
      sundayStart: '',
      sundayEnd: ''
    };
  }

  getCurrentTime = (hour, minute, meridian, slot, param) => {
    if (typeof (minute) === 'number' && minute.toString().length === 1) {
      minute = (`0${minute}`).substring(0, 2);
    }
    switch (slot) {
      case 'Monday - Friday':
        if (param === 'startTime') {
          this.state.mondayFridayStart = `${hour}:${minute} ${meridian}`;
        } else {
          this.state.mondayFridayEnd = `${hour}:${minute} ${meridian}`;
        }
        return `${hour}:${minute} ${meridian}`;
      case 'Saturday':
        if (param === 'startTime') {
          this.state.saturdayStart = `${hour}:${minute} ${meridian}`;
        } else {
          this.state.saturdayEnd = `${hour}:${minute} ${meridian}`;
        }
        return `${hour}:${minute} ${meridian}`;
      case 'Sunday':
        if (param === 'startTime') {
          this.state.sundayStart = `${hour}:${minute} ${meridian}`;
        } else {
          this.state.sundayEnd = `${hour}:${minute} ${meridian}`;
        }
        return `${hour}:${minute} ${meridian}`;
      default:
        this.state.saturdayStart = `${hour}:${minute} ${meridian}`;
    }
  }

  splittedTime = recievedTime => {
    if (recievedTime === null) {
      return {
        hour: '00',
        minute: '00',
        meridian: 'am'
      };
    }
    const splittedByColon = recievedTime.split(':');
    const hour = splittedByColon[0];
    const splittedBySpace = splittedByColon[1].split(' ');
    const minute = splittedBySpace[0];
    const meridian = splittedBySpace[1];
    return {
      hour,
      minute,
      meridian
    };
  }

  handleDatePicker = (param, index) => {
    TimePickerAndroid.open({
      is24Hour: false,
    }).then(({ action, hour, minute }) => {
      if (action !== TimePickerAndroid.dismissedAction) {
        if (param === 'startTime') {
          if (hour > 12) {
            this.state.daysCalculate[index].startTime.meridian = 'pm';
            hour -= 12;
          } else if (hour === 0) {
            this.state.daysCalculate[index].startTime.meridian = 'am';
            hour = 12;
          } else if (hour === 12) {
            this.state.daysCalculate[index].startTime.meridian = 'pm';
            hour = 12;
          } else if (hour < 12) {
            this.state.daysCalculate[index].startTime.meridian = 'am';
          }
          if (minute === '00') {
            minute = '0';
          }
          this.state.daysCalculate[index].startTime.hour = hour;
          this.state.daysCalculate[index].startTime.minute = minute;
          this.setState({
            daysCalculate: this.state.daysCalculate
          });
        } else {
          if (hour > 12) {
            this.state.daysCalculate[index].endTime.meridian = 'pm';
            hour -= 12;
          } else if (hour === 0) {
            this.state.daysCalculate[index].endTime.meridian = 'am';
            hour = 12;
          } else if (hour === 12) {
            this.state.daysCalculate[index].endTime.meridian = 'pm';
            hour = 12;
          } else if (hour < 12) {
            this.state.daysCalculate[index].endTime.meridian = 'am';
          }
          if (minute === '00') {
            minute = '0';
          }
          this.state.daysCalculate[index].endTime.hour = hour;
          this.state.daysCalculate[index].endTime.minute = minute;
          this.setState({
            daysCalculate: this.state.daysCalculate
          });
        }
      }
    }).catch(() => {
      console.alert('Cannot open time picker. Please try it again.');
    });
  }

  updateDays = weekdays => {
    this.setState({
      weekdays
    });
  }

  handleSubmit = () => {
    const holiday = this.state.weekdays;
    storage.getItem('currentUser').then(user => {
      const data = {
        id: user.dealerId,
        monday_friday_start: this.state.mondayFridayStart,
        monday_friday_end: this.state.mondayFridayEnd,
        saturday_start: this.state.saturdayStart,
        saturday_end: this.state.saturdayEnd,
        sunday_start: this.state.sundayStart,
        sunday_end: this.state.sundayEnd,
        weekly_holiday: holiday
      };
      this.props.testRideTimings(data).then(() => {
        this.props.changeStep(5);
      }, err => {
        console.log(err);
      });
    });
  }

  backBtnAction = () => {
    this.props.previousStep(3);
  }

  render() {
    const { daysCalculate } = this.state;
    return (
      <View style={styles.container}>
        <Loader loading={this.props.loading} />
        <View style={styles.bodyLayout}>
          <View style={styles.innerLayout}>
            <View style={styles.innerSection}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title]}>Test Ride Timings</Text>
              </View>
            </View>
            <View style={styles.timingsSection}>
              { daysCalculate && daysCalculate.map((days, index) =>
                (
                  <View style={styles.timingSelect} key={days.id}>
                    <View style={styles.weekDays}>
                      <Text style={styles.weekDaysTitle}> { days.daySlots } </Text>
                    </View>
                    <View>
                      <TouchableOpacity>
                        <Text
                          onPress={() => days.methodCall('startTime', index)}
                          style={styles.timeSlot}
                        >
                          {this.getCurrentTime(
                            days.startTime.hour,
                            days.startTime.minute,
                            days.startTime.meridian,
                            days.daySlots,
                            'startTime'
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text> to </Text>
                    </View>
                    <View>
                      <TouchableOpacity>
                        <Text
                          onPress={() => days.methodCall('endTime', index)}
                          style={styles.timeSlot}
                        >
                          {this.getCurrentTime(
                            days.endTime.hour,
                            days.endTime.minute,
                            days.endTime.meridian,
                            days.daySlots,
                            'endTime'
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              }
            </View>
            <View style={styles.weeklyHoliday}>
              <View>
                <Text style={styles.weekDaysTitle}>Holiday on</Text>
              </View>
              <View style={styles.dropDown}>
                <Picker
                  selectedValue={this.state.weekdays}
                  style={styles.dayPicker}
                  mode="dropdown"
                  onValueChange={this.updateDays}
                >
                  <Picker.Item label="Monday" value="Monday" />
                  <Picker.Item label="Tuesday" value="Tuesday" />
                  <Picker.Item label="Wednesday" value="Wednesday" />
                  <Picker.Item label="Thursday" value="Thursday" />
                  <Picker.Item label="Friday" value="Friday" />
                  <Picker.Item label="Saturday" value="Saturday" />
                  <Picker.Item label="Sunday" value="Sunday" />
                </Picker>
              </View>
            </View>
            <View style={{ backgroundColor: 'white', height: 70 }}>
              <ContinueSectionScreen
                style={styles.continueBtnAction}
                continueBtnAction={this.handleSubmit}
                backBtnAction={this.backBtnAction}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
