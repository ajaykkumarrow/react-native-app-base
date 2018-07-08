import React, { Component } from 'react';
import { View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Picker,
  Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonWithLeftImage, GradientButtonLarge, BookTestRideButton } from '../../components/button/Button';
import ContinueSectionScreen from '../../components/ContinueSection/ContinueSectionScreen';
import UserInput from '../../components/userInput/UserInput';
import editIcon from '../../assets/images/edit.png';
import sendIcon from '../../assets/images/send.png';
import deleteIcon from '../../assets/images/delete.png';
import close from '../../assets/images/close.png';
import resendIcon from '../../assets/images/ic_resend.png';
import styles from './teamMemberStyles';
import { emailValidator, mobileNumberValidator } from '../../utils/validations';
import Loader from '../../components/loader/Loader';
import {
  getTeamMembers,
  createSalesHead,
  createSalesMember,
  sendCredential,
  resendCredential,
  getDirectReportingMember,
  deleteTeamMember,
  editTeamMember } from '../../redux/actions/TeamMembers/actionCreators';

import storage from '../../helpers/AsyncStorage';

const columns = [{
  id: '1',
  label: 'Name'
},
{
  id: '2',
  label: 'Role'
},
{
  id: '3',
  label: 'Email'
},
{
  id: '4',
  label: 'Phone'
},
{
  id: '5',
  label: ''
},
{
  id: '6',
  label: ''
}];

let dealerID = '';

@connect(state => ({
  loading: state.teamMember.loading,
  users: state.teamMember.users,
  directReportingMembers: state.teamMember.directReportingMembers,
  salesLead: state.teamMember.salesLead,
  salesMember: state.teamMember.salesMember,
  sendCredentialResponse: state.teamMember.sendCredentialResponse,
  resendCredentialResponse: state.teamMember.resendCredentialResponse,
  deleteTeamMemberResponse: state.teamMember.deleteTeamMemberResponse,
  editTeamMemberResponse: state.teamMember.editTeamMemberResponse
}), {
  getTeamMembers,
  createSalesHead,
  createSalesMember,
  sendCredential,
  resendCredential,
  getDirectReportingMember,
  deleteTeamMember,
  editTeamMember
})
export default class TeamMemberScreen extends Component {
  static propTypes = {
    users: PropTypes.array,
    getTeamMembers: PropTypes.func.isRequired,
    getDirectReportingMember: PropTypes.func.isRequired,
    createSalesHead: PropTypes.func.isRequired,
    createSalesMember: PropTypes.func.isRequired,
    deleteTeamMember: PropTypes.func.isRequired,
    sendCredential: PropTypes.func.isRequired,
    editTeamMember: PropTypes.func.isRequired,
    previousStep: PropTypes.func.isRequired,
    changeStep: PropTypes.func.isRequired,
    directReportingMembers: PropTypes.array,
    salesLead: PropTypes.object,
    salesMember: PropTypes.object,
    editTeamMemberResponse: PropTypes.object,
    loading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    users: [],
    directReportingMembers: [],
    salesLead: {},
    salesMember: {},
    editTeamMemberResponse: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: [],
      teamLeads: [],
      columns,
      modifyFlatList: false,
      selectedRole: '',
      name: '',
      mobileNumber: '',
      email: '',
      isEdit: false,
      isLeadDropDown: false,
      selectedLead: '',
      selectedLeadIndex: -1,
      userEditObject: {},
      editIndex: -1,
      emailError: false,
      mobileNumberError: false,
      nameError: false,
      roleError: false
    };
  }

  componentWillMount() {
    storage.getItem('currentUser')
      .then(value => {
        const { dealerId } = value;
        dealerID = dealerId;
        return this.props.getTeamMembers(dealerID);
      }).then(() => {
        this.setState({
          data: this.props.users
        });
      }).catch(error => {
        Alert.alert(
          '',
          error.err.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
          { cancelable: false }
        );
      });
  }

  onModalShow = () => {
    this.props.getDirectReportingMember(dealerID)
      .then(() => {
        this.setState({
          teamLeads: this.props.directReportingMembers,
          selectedLead: this.props.directReportingMembers[0],
          selectedLeadIndex: 0
        });
      }).catch(error => {
        Alert.alert(
          '',
          error.err.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
          { cancelable: false }
        );
      });
  }

  getRole = role => {
    if (role === 'DEALER_TEAM_HEAD') {
      return 'Team Leader';
    } else if (role === 'DEALER_SALES') {
      return 'Sales Executive';
    }
  }

  changeStep = () => {
    this.props.changeStep(3);
  }

  backBtnAction = () => {
    this.props.previousStep(1);
  }

  handleOnInputChange = (param, value) => {
    if (param === 'name') {
      this.setState({ name: value, nameError: false });
    } else if (param === 'email') {
      this.setState({ email: value, emailError: false });
    } else if (param === 'mobileNumber') {
      this.setState({ mobileNumber: value, mobileNumberError: false });
    }
  }

  editValue = (item, index) => {
    this.setState({
      name: item.first_name,
      email: item.email,
      selectedRole: this.getRole(item.role),
      mobileNumber: item.mobile_no,
      modalVisible: true,
      isEdit: true,
      isLeadDropDown: false,
      userEditObject: item,
      editIndex: index,
      emailError: false,
      mobileNumberError: false,
      nameError: false,
      roleError: false
    });
  }

    _keyExtractor = item => item.id;

    sendCredentialsView = (item, index) => (
      item.is_credential_send ?
        <View style={styles.flexDirectionRow}>
          <ButtonWithLeftImage
            title="RESEND"
            style={styles.resendButton}
            handleSubmit={() => {
              this.sendCredential(item, index);
            }
            }
            image={resendIcon}
            textStyle={styles.sendCredentialsText}
          />
        </View> :
        <View style={styles.flexDirectionRow}>
          <ButtonWithLeftImage
            title="Send Credentials"
            style={styles.sendCredentialsBtn}
            handleSubmit={() => {
              this.sendCredential(item, index);
            }
            }
            image={sendIcon}
            textStyle={styles.sendCredentialsText}
          />
        </View>

    );

    sendCredential = (user, index) => this.props.sendCredential(dealerID, user.id, user)
      .then(() => {
        this.state.data[index].is_credential_send = true;
        this.setState({
          data: this.state.data,
          modifyFlatList: !this.state.modifyFlatList
        });
      })

    createTeamMember = () => {
      if (this.validate()) {
        let userID = '';
        storage.getItem('currentUser')
          .then(value => {
            const { userId } = value;
            userID = userId;
            let createTeamObj = {};
            if (this.state.selectedRole === 'Sales Executive') {
              const leadId = this.state.teamLeads[this.state.selectedLeadIndex].id;
              createTeamObj = {
                first_name: this.state.name,
                email: this.state.email,
                mobile_no: this.state.mobileNumber,
                manager_id: leadId,
                user_type_id: dealerID,
              };
              return this.props.createSalesMember(dealerID, createTeamObj)
                .then(() => {
                  this.state.data.push(this.props.salesMember);
                  this.setState({
                    modalVisible: false,
                    data: this.state.data,
                    modifyFlatList: !this.state.modifyFlatList
                  });
                });
            } else if (this.state.selectedRole === 'Team Leader') {
              createTeamObj = {
                first_name: this.state.name,
                email: this.state.email,
                mobile_no: this.state.mobileNumber,
                manager_id: userID,
                user_type_id: dealerID
              };
              return this.props.createSalesHead(dealerID, createTeamObj)
                .then(() => {
                  this.state.data.push(this.props.salesLead);
                  this.setState({
                    modalVisible: false,
                    data: this.state.data,
                    modifyFlatList: !this.state.modifyFlatList
                  });
                });
            }
          }).catch(error => {
            Alert.alert(
              '',
              error.err.message,
              [
                { text: 'OK', onPress: () => {} },
              ],
              { cancelable: false }
            );
          });
      }
    }

    validate = () => {
      let isEmailError = false;
      let isMobileNumberError = false;
      let isNameError = false;
      let isRoleError = false;
      if (this.state.email.length > 0) {
        if (!emailValidator(this.state.email)) {
          isEmailError = true;
        }
      }
      if (!mobileNumberValidator(this.state.mobileNumber)) {
        isMobileNumberError = true;
      }
      if (this.state.name === '') {
        isNameError = true;
      }
      if (this.state.selectedRole === '') {
        isRoleError = true;
      }
      if (!isEmailError && !isMobileNumberError && !isNameError && !isRoleError) {
        return true;
      }
      this.setState({
        emailError: isEmailError,
        mobileNumberError: isMobileNumberError,
        nameError: isNameError,
        roleError: isRoleError
      });
    }

    editSalesMember = () => {
      let isEmailError = false;
      let isMobileNumberError = false;
      let isNameError = false;

      if (this.state.email.length > 0) {
        if (!emailValidator(this.state.email)) {
          isEmailError = true;
        }
      }

      if (!mobileNumberValidator(this.state.mobileNumber)) {
        isMobileNumberError = true;
      }
      if (this.state.name === '') {
        isNameError = true;
      }

      if (!isEmailError && !isMobileNumberError && !isNameError) {
        const editData = this.state.userEditObject;
        editData.first_name = this.state.name;
        editData.email = this.state.email;
        editData.mobile_no = this.state.mobileNumber;
        return this.props.editTeamMember(dealerID, editData.id, editData)
          .then(() => {
            const index = this.state.editIndex;
            this.state.data[index] = this.props.editTeamMemberResponse;
            this.setState({
              data: this.state.data,
              modifyFlatList: !this.state.modifyFlatList,
              modalVisible: false
            });
          }).catch(error => {
            Alert.alert(
              '',
              error.err.message,
              [
                { text: 'OK', onPress: () => {} },
              ],
              { cancelable: false }
            );
          });
      }
      this.setState({
        emailError: isEmailError,
        mobileNumberError: isMobileNumberError,
        nameError: isNameError,
      });
    }

    deleteSalesMember = (user, index) => this.props.deleteTeamMember(user.id)
      .then(() => {
        this.state.data.splice(index, 1);
        this.setState({
          data: this.state.data,
          modifyFlatList: !this.state.modifyFlatList
        });
      }).catch(error => {
        Alert.alert(
          '',
          error.err.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
          { cancelable: false }
        );
      })

    renderHeader = () => (
      <View style={styles.tableHeader}>
        {
          this.state.columns.map(column => (
            <View key={column.id} style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>{column.label}</Text>
            </View>
          ))
        }
      </View>
    )

    renderItem = (item, index) => (
      <View style={styles.item}>
        <View style={styles.cell}>
          <Text style={styles.cellText} ellipsizeMode="tail" numberOfLines={1}>{item.first_name}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText} ellipsizeMode="tail" numberOfLines={1}>{this.getRole(item.role)}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText} ellipsizeMode="tail" numberOfLines={1}>{item.email}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText} ellipsizeMode="tail" numberOfLines={1}>{item.mobile_no}</Text>
        </View>
        <View style={styles.cell}>
          {this.sendCredentialsView(item, index)}
        </View>
        <View style={[styles.cell, styles.flexDirectionRow]}>
          <TouchableOpacity
            style={styles.editTouchWrapper}
            activeOpacity={0.5}
            onPress={() => {
              this.editValue(item, index);
            }}
          >
            <View style={styles.editView}>
              <Image source={editIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteTouchWrapper}
            activeOpacity={0.5}
            onPress={() => {
              Alert.alert(
                '',
                'Do you want to delete this team member',
                [
                  { text: 'DELETE', onPress: () => { this.deleteSalesMember(item, index); } },
                  { text: 'CANCEL', onPress: () => {}, style: 'cancel' }
                ],
                { cancelable: false }
              );
            }}
          >
            <View style={styles.deleteView}>
              <Image source={deleteIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )

    render() {
      return (
        <View style={styles.container}>
          <Loader loading={this.props.loading} />
          {
            this.state.modalVisible ?
              <Modal
                transparent
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: false, isLeadDropDown: false })}
                onShow={this.onModalShow}
              >
                <View style={styles.backgroundOverlay} />
                <KeyboardAwareScrollView
                  style={styles.teamAddView}
                  keyboardShouldPersistTaps="always"
                >
                  <View style={styles.flexOne}>
                    <View style={styles.addViewHeader}>
                      <Text style={styles.addMemberTextStyle}>{this.state.isEdit ?
                        'Edit Team Member' : 'Add Team Member'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.setState({ modalVisible: false, isLeadDropDown: false })}
                        style={styles.hideModalStyle}
                      >
                        <Image source={close} resizeMode="contain" style={styles.closeButton} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.memberInfoView}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.nameText}>Name</Text>
                        <Text style={styles.requiredStyle}>*</Text>
                      </View>
                      <UserInput
                        containerStyle={styles.nameInput}
                        param="name"
                        placeholder="Name"
                        onChange={this.handleOnInputChange}
                        value={this.state.name}
                        showError={this.state.nameError}
                        errorTitle="Enter a valid name"
                      />
                      {
                        this.state.isEdit ?
                          null
                          :
                          <View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.nameText}>Select Role</Text>
                              <Text style={styles.requiredStyle}>*</Text>
                            </View>
                            <View style={styles.roleTouchWrapper}>
                              {
                                this.state.teamLeads.length > 0 ?
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({
                                        selectedRole: 'Sales Executive',
                                        isLeadDropDown: true,
                                        roleError: false
                                      });
                                    }}
                                  >
                                    <View style={this.state.selectedRole === 'Sales Executive' ?
                                      styles.activatedRoleStyle : styles.normalRoleStyle
                                    }
                                    >
                                      <Text style={this.state.selectedRole === 'Sales Executive' ?
                                        styles.roleActivatedTextColor : styles.roleText}>Sales Executive
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                  :
                                  <TouchableOpacity
                                    disabled
                                    onPress={() => {
                                      this.setState({
                                        selectedRole: 'Sales Executive',
                                        roleError: false
                                      });
                                    }}
                                  >
                                    <View style={
                                      this.state.selectedRole === 'Sales Executive' ?
                                        styles.activatedRoleStyle : styles.normalRoleStyle}
                                    >
                                      <Text style={this.state.selectedRole === 'Sales Executive' ?
                                        styles.roleActivatedTextColor : styles.roleText}>Sales Executive
                                      </Text>
                                    </View>

                                  </TouchableOpacity>
                              }
                              <TouchableOpacity onPress={() => {
                                this.setState({
                                  selectedRole: 'Team Leader',
                                  isLeadDropDown: false,
                                  roleError: false
                                });
                              }}
                              >
                                <View style={
                                  this.state.selectedRole === 'Team Leader' ?
                                    styles.activatedRoleStyle : styles.normalRoleStyle}
                                >
                                  <Text style={this.state.selectedRole === 'Team Leader' ?
                                    styles.roleActivatedTextColor : styles.roleText}>Team Leader
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                            {
                              this.state.isLeadDropDown ?
                                <View style={{ marginTop: 14 }}>
                                  <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.nameText}>Select Team Lead</Text>
                                    <Text style={styles.requiredStyle}>*</Text>
                                  </View>
                                  <View style={styles.nameInput}>
                                    <Picker
                                      mode="dropdown"
                                      selectedValue={this.state.selectedLead}
                                      onValueChange={(item, index) =>
                                        this.setState({ selectedLead: item, selectedLeadIndex: index })}
                                    >
                                      {
                                        this.state.teamLeads.map(item => (
                                          <Picker.Item label={item.first_name} value={item.first_name} key={item.id} />
                                        ))
                                      }
                                    </Picker>
                                  </View>

                                </View>
                                :
                                null
                            }
                          </View>
                      }
                      {
                        this.state.roleError ?
                          <Text style={styles.errorTextStyle}>Role must be selected</Text>
                          : null
                      }
                      <View style={styles.nameTextView}>
                        <Text style={styles.nameText}>Email ID</Text>
                      </View>
                      <UserInput
                        containerStyle={styles.nameInput}
                        param="email"
                        onChange={this.handleOnInputChange}
                        value={this.state.email}
                        placeholder="Email"
                        showError={this.state.emailError}
                        errorTitle="Enter a valid email"
                      />
                      <View style={styles.nameTextView}>
                        <Text style={styles.nameText}>Phone Number</Text>
                        <Text style={styles.requiredStyle}>*</Text>
                      </View>
                      <UserInput
                        boxStyle={styles.flexOne}
                        param="mobileNumber"
                        onChange={this.handleOnInputChange}
                        placeholder="Mobile Number"
                        keyboardType="numeric"
                        maxLength={10}
                        containerStyle={styles.phoneBorder}
                        value={this.state.mobileNumber.toString()}
                        showError={this.state.mobileNumberError}
                        errorTitle="Enter a valid mobile number"
                      />
                      <Text style={styles.passwordText}>The <Text style={styles.passwordBoldText}>Password</Text> will
                      be sent via SMS and email to the new member.
                      </Text>
                      <View style={styles.modalButtonViewStyle}>
                        {
                          this.state.isEdit ?
                            <GradientButtonLarge
                              title="Save Details"
                              style={styles.modalButtonStyle}
                              handleSubmit={this.editSalesMember}
                            />
                            :
                            <GradientButtonLarge
                              title="Add New Member"
                              style={styles.modalButtonStyle}
                              handleSubmit={this.createTeamMember}
                            />
                        }
                      </View>
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              </Modal>
              :
              null
          }
          <View style={styles.header}>
            <Text style={styles.formTitle}>Your Team Members</Text>
            <View style={styles.addTeamMemberButton}>
              <BookTestRideButton
                title="Add Team Member"
                style={styles.addTeamMember}
                handleSubmit={() => {
                  this.setState({
                    modalVisible: true,
                    isEdit: false,
                    name: '',
                    mobileNumber: '',
                    email: '',
                    selectedRole: '',
                    emailError: false,
                    mobileNumberError: false,
                    nameError: false,
                    roleError: false

                  });
                }}
                textStyle={styles.addTeamMemberText}
              />
            </View>
          </View>
          <View style={styles.gridContainer}>
            <View style={styles.tableView}>
              {this.renderHeader()}
              <FlatList
                keyExtractor={this._keyExtractor}
                data={this.state.data}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                extraData={this.state.modifyFlatList}
              />
            </View>
          </View>
          <View style={styles.continueSectionView}>
            <ContinueSectionScreen
              continueBtnAction={this.changeStep}
              backBtnAction={this.backBtnAction}
            />
          </View>
        </View>
      );
    }
}

