import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, Alert, Text } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './vehicleEnquiredStyles';
import {
  BookTestRideButton,
} from '../../components/button/Button';
import {
  getAllVehicles,
  updateLeadDetail,
  createLeadDetail,
  getLeadDetails,
  updateLeadDetailStatus,
  updateLead,
  deleteLeadDetail
} from '../../redux/actions/LeadHistory/actionCreators';
import variables from '../../theme/variables';
import fonts from '../../theme/fonts';

const statusList = [
  {
    label: 'Enquired',
    status: 200
  },
  {
    label: 'Booked',
    status: 450
  },
  {
    label: 'Invoiced',
    status: 600
  }
];
@connect(state => ({
  lead: state.leadHistory.lead,
  loading: state.leadHistory.loading,
  vehicleList: state.leadHistory.vehicleList,
  currentUser: state.user.currentUser
}), {
  getAllVehicles,
  updateLeadDetail,
  createLeadDetail,
  getLeadDetails,
  updateLeadDetailStatus,
  updateLead,
  deleteLeadDetail
})
class VehicleEnquired extends Component {
  static propTypes = {
    screenProps: PropTypes.object.isRequired,
    lead: PropTypes.object.isRequired,
    vehicleList: PropTypes.array,
    getAllVehicles: PropTypes.func.isRequired,
    deleteLeadDetail: PropTypes.func.isRequired,
    updateLeadDetail: PropTypes.func.isRequired,
    updateLead: PropTypes.func.isRequired,
    updateLeadDetailStatus: PropTypes.func.isRequired,
    getLeadDetails: PropTypes.func.isRequired,
    createLeadDetail: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired
  }

  static defaultProps = {
    vehicleList: null
  }

  constructor(props) {
    super(props);
    this.state = {
      enquiredVehicles: []
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.vehicleList && nextProps.lead) {
      return {
        enquiredVehicles: nextProps.lead.lead_details,
        vehicleList: nextProps.vehicleList
      };
    }
    return null;
  }

  componentDidMount() {
    const { screenProps } = this.props;
    this.props.getAllVehicles(screenProps.dealerId);
    this.props.getLeadDetails(screenProps.lead.id);
  }

  onVehicleChange = (param, value, index, item) => {
    const { enquiredVehicles } = this.state;
    const variants = this.getVariantList(param === 'vehicle_id' ? value : item.vehicle_id);
    if (param === 'vehicle_id') {
      enquiredVehicles[index].variant_id = variants.length > 0 ? variants[0].id : '';
      enquiredVehicles[index].variant_colour_id =
        variants.length > 0 ? variants[0].colors.length > 0 ? variants[0].colors[0].id : '' : '';
    }
    if (param === 'variant_id') {
      enquiredVehicles[index].variant_colour_id =
        this.getColorList(item.vehicle_id, value, variants)[0].id;
    }
    enquiredVehicles[index][param] = value;
    enquiredVehicles[index].dirty = true;
    this.setState({ enquiredVehicles });
  }

  onStatusChange = (status, item) => {
    const { lead } = this.props;
    if (status === 600 || status === 450) {
      return this.props.updateLeadDetailStatus(lead.id, item.id)
        .then(() => {
          lead.status = status;
          lead.invoiced_on = new Date();
          lead.is_invoiced = true;
          delete lead.lead_details;
          delete lead.follow_up;
          delete lead.lead_finance_detail;
          return this.props.updateLead(lead.id, lead).then(() => this.props.getLeadDetails(lead.id)).then(() => {
            this.setState({
              enquiredVehicles: this.props.lead.lead_details
            });
          });
        }).catch(error => {
          console.log(error);
        });
    }
  }

  getVariantList = vehicleId => {
    const { vehicleList } = this.props;
    const vehicles = vehicleList.filter(vehicle => vehicle.id === vehicleId);
    return vehicles.length !== 0 ? vehicles[0].variants : [];
  }

  getColorList = (vehicleId, variantId, variantList = []) => {
    variantList = variantList.length === 0 ? this.getVariantList(vehicleId) : variantList;
    const variants = variantList.filter(variant => variant.id === variantId);
    return variants.length !== 0 ? variants[0].colors : [];
  }

  getVehicle = vehicleId => {
    const { vehicleList } = this.props;
    const result = vehicleList.find(vehicle => vehicle.id === vehicleId);
    return result.name;
  }

  getStatus = vehicleStatus => {
    const result = statusList.find(data => data.status === vehicleStatus);
    return result.label;
  }

  updateLeadDetail = index => {
    const { navigation } = this.props.screenProps;
    const leadId = navigation.state.params.lead.id;
    const { enquiredVehicles } = this.state;
    const leadDetailId = enquiredVehicles[index].id;
    if (leadDetailId) {
      delete enquiredVehicles[index].dirty;
      this.props.updateLeadDetail(leadDetailId, enquiredVehicles[index]);
      this.setState({ enquiredVehicles });
    } else {
      delete enquiredVehicles[index].dirty;
      this.props.createLeadDetail(leadId, enquiredVehicles[index]).then(({ response }) => {
        enquiredVehicles[index].id = response.id;
        this.setState({ enquiredVehicles });
      });
    }
    /*     if (leadDetailId) {
      delete enquiredVehicles[index].dirty;
      this.props.updateLeadDetail(leadDetailId, enquiredVehicles[index]);
    } else if (!this.checkDuplicateLeadDetail(enquiredVehicles[index], index)) {
      delete enquiredVehicles[index].dirty;
      this.props.createLeadDetail(leadId, enquiredVehicles[index]).then(({ response }) => {
        enquiredVehicles[index].id = response.id;
        this.setState({ enquiredVehicles });
      });
    } else {
      Alert.alert(
        'Message',
        'Vehicle already exists',
        [
          { text: 'OK', onPress: () => {} },
        ],
        { cancelable: false }
      );
    } */
  }

  checkDuplicateLeadDetail = (item, position) => {
    const { enquiredVehicles } = this.state;
    let isDuplicateExists = true;
    enquiredVehicles.forEach((vehicle, index) => {
      isDuplicateExists = (position !== index && vehicle.vehicle_id === item.vehicle_id);
    });
    return isDuplicateExists;
  }

  goToProductDetail = item => {
    const { navigation } = this.props.screenProps;
    // eslint-disable-next-line prefer-destructuring
    const id = navigation.state.params.lead.id;
    const vehicleId = item.vehicle_id;
    navigation.navigate('ProductDetailScreen', { id, vehicleId });
  }

  deleteLeadEnquiredVehicle = index => {
    Alert.alert(
      '',
      'Do you want to delete the Vehicle?',
      [
        {
          text: 'Ok',
          onPress: () => {
            const { enquiredVehicles } = this.state;
            const leadDetailId = enquiredVehicles[index].id;
            if (leadDetailId) {
              enquiredVehicles[index].vehicle_status = 900;
              delete enquiredVehicles[index].dirty;
              this.props.deleteLeadDetail(leadDetailId, enquiredVehicles[index]).then(() => {
                enquiredVehicles.splice(index, 1);
                this.setState({ enquiredVehicles });
              }, () => {});
            } else {
              enquiredVehicles.splice(index, 1);
              this.setState({ enquiredVehicles });
            }
          }
        },
        { text: 'Cancel', onPress: () => {}, style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  addNewCard = () => {
    const { navigation } = this.props.screenProps;
    const { vehicleList } = this.props;
    const leadId = navigation.state.params.lead.id;
    const { enquiredVehicles } = this.state;
    if (enquiredVehicles.length < 5) {
      const tempObject = {
        dealer_id: this.props.currentUser.dealerId,
        vehicle_status: 200,
        lead_id: leadId,
        vehicle_id: vehicleList[0].id,
        variant_id: vehicleList[0].variants[0].id,
        variant_colour_id: vehicleList[0].variants[0].colors[0].id,
        dirty: true
      };
      enquiredVehicles.unshift(tempObject);
      this.setState({
        enquiredVehicles
      });
    } else {
      Alert.alert(
        '',
        'You cannot add more than 5 vehicles. Remove 1 to add!',
        [
          { text: 'Ok' }
        ],
        { cancelable: false }
      );
    }
  }

  renderItem = (item, index) => {
    const { vehicleList } = this.props;
    return (
      <View style={styles.vehicleCard}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: variables.white,
          marginVertical: 10,
          marginHorizontal: 10,
          padding: 5,
          elevation: 5,
        }}>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              position: 'absolute',
              right: 0,
              top: 0,
              alignItems: 'center',
              backgroundColor: variables.warmGreyFour
            }}
            onPress={() => this.deleteLeadEnquiredVehicle(index)}
          >
            <Icon
              style={{
                top: 3,
                zIndex: 99
              }}
              name="times"
              size={12}
              color="white" />
          </TouchableOpacity>
          <View style={{
            flex: 1,
            flexDirection: 'column',
          }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={[{
                flex: 1,
                flexDirection: 'column',
              }]}>
                {
                  item.id !== undefined &&
                  <View>
                    <Text style={styles.fieldTitle}>Vehicle</Text>
                    <Text style={styles.vehicleName}>{this.getVehicle(item.vehicle_id)}</Text>
                  </View>
                }
                {
                  item.id === undefined &&
                  <Dropdown
                    label="Vehicle"
                    labelFontSize={15}
                    disabledItemColor="red"
                    containerStyle={{ flex: 1, marginHorizontal: 10 }}
                    fontSize={13}
                    itemTextStyle={{ fontSize: 10, fontFamily: fonts.sourceSansProBoldItalic }}
                    data={vehicleList || []}
                    baseColor={variables.lightGrey}
                    value={item.vehicle_id || ''}
                    onChangeText={value => this.onVehicleChange('vehicle_id', value, index, item)}
                    labelExtractor={({ name }) => name}
                    // eslint-disable-next-line camelcase
                    valueExtractor={({ id }) => id}
                    />
                }
              </View>
              <View style={[{
                flex: 1,
                flexDirection: 'column',
              }]}>
                <Dropdown
                  label="Variant"
                  labelFontSize={15}
                  containerStyle={{ flex: 1, marginHorizontal: 10 }}
                  fontSize={13}
                  itemTextStyle={{ fontSize: 10, fontFamily: fonts.sourceSansProBoldItalic }}
                  data={this.getVariantList(item.vehicle_id)}
                  baseColor={variables.lightGrey}
                  value={item.variant_id || ''}
                  onChangeText={value => this.onVehicleChange('variant_id', value, index, item)}
                      // eslint-disable-next-line camelcase
                  labelExtractor={({ name }) => name}
                  valueExtractor={({ id }) => id}
              />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={[{
                flex: 1,
                flexDirection: 'column',
              }]}>
                <Dropdown
                  label="Color"
                  labelFontSize={15}
                  containerStyle={{ flex: 1, marginHorizontal: 10 }}
                  fontSize={13}
                  itemTextStyle={{ fontSize: 10, fontFamily: fonts.sourceSansProBoldItalic }}
                  data={this.getColorList(item.vehicle_id, item.variant_id)}
                  baseColor={variables.lightGrey}
                  value={item.variant_colour_id || ''}
                  onChangeText={value => this.onVehicleChange('variant_colour_id', value, index, item)}
                      // eslint-disable-next-line camelcase
                  labelExtractor={({ color }) => color}
                  valueExtractor={({ id }) => id}
              />
              </View>
              <View style={[{
                flex: 1,
                flexDirection: 'column',
              }]}>
                {
                  item.vehicle_status === 600 &&
                  <View>
                    <Text style={styles.fieldTitle}>Status</Text>
                    <Text style={styles.vehicleName}>{this.getStatus(item.vehicle_status)}</Text>
                  </View>
                }
                {
                  item.vehicle_status === 900 &&
                  <View>
                    <Text style={styles.fieldTitle}>Status</Text>
                    <Text style={styles.vehicleName}>Closed</Text>
                  </View>
                }
                {
                item.vehicle_status < 600 &&
                <Dropdown
                  label="Status"
                  labelFontSize={15}
                  containerStyle={{ flex: 1, marginHorizontal: 10 }}
                  fontSize={13}
                  itemTextStyle={{ fontSize: 10, fontFamily: fonts.sourceSansProBoldItalic }}
                  data={statusList}
                  baseColor={variables.lightGrey}
                  value={item.vehicle_status}
                  onChangeText={value => this.onStatusChange(value, item)}
                  // eslint-disable-next-line camelcase
                  labelExtractor={({ label }) => label}
                  valueExtractor={({ status }) => status}
                  />
                }
              </View>
            </View>
            <View style={{
              flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10
            }}>
              { item.dirty &&
              <TouchableOpacity
                activeOpacity={0.5}
                style={{ alignItems: 'center' }}
                onPress={() => this.updateLeadDetail(index)}
                >
                <LinearGradient
                  colors={['#ff8e3e', '#ff743f', '#fd5742', '#fb4645']}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={[{
                    height: 35,
                    width: 100,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: 'transparent'
                  }, styles.continueBtnStyle]}>
                  <View style={{
                    flex: 1,
                    marginTop: 1,
                    marginLeft: 1,
                    marginBottom: 2,
                    marginRight: 2,
                    backgroundColor: 'white',
                    justifyContent: 'center'
                  }}>
                    <Text style={{ color: '#fd5742', fontSize: 12, textAlign: 'center' }}>
                      Update
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              }
              <TouchableOpacity
                activeOpacity={0.5}
                style={{ alignItems: 'center' }}
                onPress={() => {}}
                >
                <LinearGradient
                  colors={['#ff8e3e', '#ff743f', '#fd5742', '#fb4645']}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={[{
                    height: 35,
                    width: 100,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: 'transparent'
                  }, styles.continueBtnStyle]}>
                  <View style={{
                    flex: 1,
                    marginTop: 1,
                    marginLeft: 1,
                    marginBottom: 2,
                    marginRight: 2.5,
                    backgroundColor: 'white',
                    justifyContent: 'center'
                  }}>
                    <Text style={{ color: '#fd5742', fontSize: 12, textAlign: 'center' }}>
                        Book a test ride
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              <BookTestRideButton
                customStyles={styles.continueBtnStyle}
                title="View Vehicle"
                handleSubmit={() => this.goToProductDetail(item)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { enquiredVehicles } = this.state;
    return (
      <View style={{
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
            marginTop: 20,
          }}
          onPress={() => this.addNewCard()}
          >
          <Icon
            style={{
              position: 'absolute',
              right: 40,
              top: 10,
              zIndex: 99
            }}
            name="plus"
            size={12}
            color={variables.dustyOrange} />
          <Text style={styles.addBtnTextStyle}>Add</Text>
          {/*           <BookTestRideButton
            customStyles={styles.addBtnStyle}
            customTextStyles={styles.addBtnTextStyle}
            title="Add"
            handleSubmit={() => this.addNewCard()}
          /> */}
        </TouchableOpacity>
        <ScrollView style={styles.flatListViewStyles}>
          {
            enquiredVehicles && enquiredVehicles.length === 0 &&
            <Text style={{
              marginVertical: 80,
              alignSelf: 'center',
              fontFamily: fonts.sourceSansProBold,
              fontSize: 22
            }}
              >
             No vehicles to show :(
            </Text>
          }
          {
          enquiredVehicles && enquiredVehicles.length > 0 &&
          enquiredVehicles.map((item, index) => this.renderItem(item, index))
          }
        </ScrollView>
      </View>
    );
  }
}
export default VehicleEnquired;

