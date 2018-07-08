import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserInput from '../../components/userInput/UserInput';
import { BookTestRideButton } from '../../components/button/Button';
import { getTargetList, updateTargetDetails } from '../../redux/actions/Target/actionCreators';
import Table from '../../components/table/Table';
import AppHeader from '../../components/header/Header';
import editTargetStyles from './editTargetStyles';

@connect(
  state => ({
    targetList: state.target.targetList,
    currentUser: state.user.currentUser
  }),
  {
    getTargetList,
    updateTargetDetails
  }
)
export default class Target extends Component {
  static propTypes = {
    getTargetList: PropTypes.func.isRequired,
    targetList: PropTypes.array,
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    updateTargetDetails: PropTypes.func.isRequired,
  }
  static defaultProps = {
    targetList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      onDataChange: false,
      followUpDate: new Date(),
      currentTargetDetails: {},
      showError: false,
      modalVisible: false,
      pristine: true,
      totalTarget: [
        {
          label: 'Units',
          count: 22
        },
        {
          label: 'Scooters',
          count: 22
        },
        {
          label: 'Bikes',
          count: 22
        }
      ]
    };

    this.cols = [
      {
        label: 'Sales Executive',
        sortable: true,
        align: 'left',
        cellStyle: 'ibm-td-overflow',
        dataKey: 'first_name',
        dataType: String,
        headerCellStyle: '',
        textRenderer: this.nameRenderer,
        sortDirectionColor: '',
      },
      {
        label: 'Avg Target Completion',
        align: 'left',
        dataType: Number,
        dataKey: 'avg_target_completion',
        sortable: true,
        textRenderer: this.textRenderer,
      },
      {
        label: 'Last Month Completion',
        align: 'left',
        sortable: true,
        dataType: Number,
        dataKey: 'last_month_target_completion',
        textRenderer: this.textRenderer,
      },
      {
        label: 'Scooter',
        dataKey: 'scooter',
        align: 'left',
      },
      {
        label: 'Bike',
        dataKey: 'bike',
        align: 'left',
      },
      {
        label: 'Target',
        dataKey: 'total_target',
        align: 'left',
        dataType: Number,
        cellRenderer: item => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.onTargetEdit(item)}>
            <View style={{
              justifyContent: 'center',
              marginLeft: 5
            }}>
              <EvilIcon
                name="pencil"
                size={20}
                color="#f37e2e" />
            </View>
          </TouchableOpacity>)
      }
    ];
  }

  componentWillMount() {
    const { currentUser: { dealerId } } = this.props;
    this.props.getTargetList(dealerId);
  }

  onTargetEdit=data => {
    this.setState({
      currentTargetDetails: data, modalVisible: true, showError: false, errorMessage: 'Target cannot be 0'
    });
  }

  onTargetUpdate=targetDetails => {
    this.props.updateTargetDetails(targetDetails);
    this.setState({
      modalVisible: false,
      pristine: true,
      onDataChange: true
    });
  }

  handleOnInputChange = (param, value) => {
    const { currentTargetDetails } = this.state;
    this.state.showError = value.toString().length === 0;
    currentTargetDetails[param] = value;
    this.setState({
      currentTargetDetails,
      pristine: false
    });
  }

  textRenderer = (data, dataKey) => (
    <Fragment>
      {`${data[dataKey] ? data[dataKey] : '0'}`}<Text style={{ fontSize: 14 }} >{data[dataKey] ? '%' : ''}</Text>
    </Fragment>)

  nameRenderer = data => `${data.first_name ? data.first_name : ''} ${data.last_name ? data.last_name : ''}`

  renderFooter = () => {
    const { totalTarget } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={[editTargetStyles.center, { flex: 2 }]}>
          <Text style={{ color: 'black', fontWieght: 'bold' }}>Total target</Text>
        </View>
        <View style={[editTargetStyles.center, { flex: 8 }]}>
          <View style={{ flex: 0.2 }} />
          {
          totalTarget.map(target => (
            <View style={[editTargetStyles.center, { flex: 1 }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ paddingLeft: 50, color: '#4b4b4b' }}>{target.label}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={editTargetStyles.footerCount}>{target.count}
                </Text>
              </View>
            </View>))
          }
        </View>
      </View>
    );
  }

  render() {
    const { followUpDate, currentTargetDetails } = this.state;
    return (
      <Fragment>
        <View style={editTargetStyles.modalAndHeaderWrapper}>
          {this.state.modalVisible &&
          <Modal
            animationType="fade"
            transparent
            visible={this.state.modalVisible}
            onRequestClose={() => this.setState({ modalVisible: false, showError: false })}>
            <View style={[editTargetStyles.modalContentWrapper]} >
              <KeyboardAwareScrollView
                contentContainerStyle={[editTargetStyles.modalContent]}
                keyboardShouldPersistTaps="always" >
                <View style={[editTargetStyles.modalCloseIcon]}>
                  <LinearGradient
                    colors={['#ef563c', '#f3842d']}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={[{ borderRadius: 2 }]}>
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: false, showError: false })}>
                      <Text
                        style={editTargetStyles.closeIconDimensions}>
                        <EvilIcon name="close" size={21} color="white" />
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <View style={{ flex: 1 }}>
                  {/* Start of heading and close */}
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={[editTargetStyles.modalHeader]}>
                      Edit Target For: {currentTargetDetails.first_name}
                    </Text>
                  </View>

                  <View style={{
                    flex: 5, flexDirection: 'row',
                  }}>
                    <View style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Text style={[editTargetStyles.textStyle, {
                        paddingLeft: 35,
                      }]}>Bikes
                      </Text>
                      <View style={editTargetStyles.widthHundred}>
                        <UserInput
                          param="bike"
                          placeholder="Target"
                          autoCapitalize="none"
                          keyboardType="numeric"
                          returnKeyType="done"
                          value={currentTargetDetails.bike.toString()}
                          onChange={this.handleOnInputChange}
                          autoCorrect={false}
                          textStyle={editTargetStyles.userInputStyle}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={[editTargetStyles.textStyle, {
                        paddingLeft: 30,
                      }]}>Scooter
                      </Text>
                      <View style={editTargetStyles.widthHundred}>
                        <UserInput
                          param="scooter"
                          placeholder="Target"
                          autoCapitalize="none"
                          keyboardType="numeric"
                          returnKeyType="done"
                          value={currentTargetDetails.scooter.toString()}
                          onChange={this.handleOnInputChange}
                          autoCorrect={false}
                          textStyle={editTargetStyles.userInputStyle}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center', alignContent: 'center' }} >
                    {
                      this.state.showError &&
                        <Text style={editTargetStyles.errorMessage}> {this.state.errorMessage}
                        </Text>
                      }
                  </View>
                  <View style={{ flex: 2, justifyContent: 'center', alignContent: 'center' }} >
                    <View style={{ alignSelf: 'center', paddingBottom: 15 }}>
                      <BookTestRideButton
                        disabled={this.state.pristine}
                        handleSubmit={() => { this.onTargetUpdate(currentTargetDetails); }}
                        title="Update Targets"
                        />
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Modal>
        }
        </View>
        <AppHeader navigation={this.props.navigation} backEnabled >
          <View style={editTargetStyles.headerContainer}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={editTargetStyles.headerTextContent}>
                <Text style={{ color: 'white', paddingHorizontal: 5 }}>
                  To Follow Up:
                </Text>
                <Text style={{ color: 'gray', paddingHorizontal: 5 }}>
                  {moment(followUpDate).format('DD-MMM-YY')}
                </Text>
              </View>
              <View style={[editTargetStyles.headerDateContent, { display: 'none' }]}>
                <Text style={{ color: 'white', paddingHorizontal: 5 }} />
              </View>
              <TouchableOpacity
                style={editTargetStyles.headerSearchContent}
                onPress={this.onSearchProductClick}>
                <Text style={{ paddingHorizontal: 10 }}><Icon name="search" size={21} color="white" /></Text>
                <Text style={editTargetStyles.headerSearchContentText}>Search for Lead
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }} />
            </View>
          </View>
        </AppHeader>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2, flexDirection: 'row', backgroundColor: 'white' }} />
          <View style={{ flex: 8, marginHorizontal: 30, marginVertical: 20 }}>
            <Table
              cols={this.cols}
              data={this.props.targetList}
              onDataChange={this.state.onDataChange}
              renderFooter={this.renderFooter}
              tableBodyStyle={{}}
            />
          </View>
        </View>
      </Fragment>
    );
  }
}
