import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './chooseFinancierStyles';
import FinancierAddIcon from '../../assets/images/FinancierAddIcon.png';
import Close from '../../assets/images/close.png';
import { getFinancierList, updateFinancierList, updateUserStatus } from '../../redux/actions/Financier/actionCreators';
import { GradientButtonLarge } from '../../components/button/Button';
import storage from '../../helpers/AsyncStorage';
import ContinueSectionScreen from '../../components/ContinueSection/ContinueSectionScreen';
import Loader from '../../components/loader/Loader';

let currentDealerId;
const addObj = [{
  id: '1',
  name: 'Add',
  Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_5-min.png'
}];

@connect(
  state => ({
    addedFinancierList: state.financier.addedFinancierList,
    unaddedFinancierList: state.financier.unaddedFinancierList,
    loading: state.financier.loading
  }),
  {
    getFinancierList,
    updateFinancierList,
    updateUserStatus
  }
)

class ChooseFinancierScreen extends Component {
  static propTypes = {
    getFinancierList: PropTypes.func.isRequired,
    updateFinancierList: PropTypes.func.isRequired,
    updateUserStatus: PropTypes.func.isRequired,
    addedFinancierList: PropTypes.array,
    unaddedFinancierList: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    previousStep: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  }
  static defaultProps = {
    addedFinancierList: [],
    unaddedFinancierList: []
  }
  constructor(props) {
    super(props);
    this.state = {
      selecetdArray: [],
      currentlyAddedFinanciers: this.props.addedFinancierList,
      currentlyUnaddedFinanciers: this.props.unaddedFinancierList,
      modalVisible: false,
      refreshFlatList: false
    };
  }

  /**
   * Just to avoid pure function warning from ESlint
   */
  componentWillMount() {
    storage.getItem('currentUser')
      .then(recievedToken => {
        currentDealerId = recievedToken.dealerId;
        return this.props.getFinancierList(currentDealerId)
          .then(() => {
            this.setState({
              currentlyAddedFinanciers: [...this.props.addedFinancierList, ...addObj],
              currentlyUnaddedFinanciers: this.props.unaddedFinancierList
            });
          });
      })
      .catch(error => {
        console.log('Error.....:', error);
      });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  continueBtnAction = () => {
    const { navigate } = this.props.navigation;
    const updatedAddedList = this.state.currentlyAddedFinanciers;
    updatedAddedList.splice(updatedAddedList.length - 1, 1);
    this.props.updateFinancierList(
      currentDealerId,
      updatedAddedList
    ).then(() => storage.getItem('currentUser')).then(recievedToken => {
      const temp = {
        is_onboarding_done: true
      };
      return this.props.updateUserStatus(recievedToken.userId, temp);
    }).then(() => {
      navigate('Dashboard');
    })
      .catch(error => {
        console.log('Error.....:', error);
      });
    this.setModalVisible(false);
    this.setState({
      selecetdArray: [],
    });
  }
  backBtnAction = () => {
    this.props.previousStep(4);
  }
  removeFiancierIconTapped = item => {
    const index = this.state.currentlyAddedFinanciers.indexOf(item);
    this.state.currentlyAddedFinanciers.splice(index, 1);
    this.state.currentlyUnaddedFinanciers.push(item);
    this.setState({
      currentlyAddedFinanciers: this.state.currentlyAddedFinanciers,
      currentlyUnaddedFinanciers: this.state.currentlyUnaddedFinanciers,
      refreshFlatList: !this.state.refreshFlatList
    });
  }
  _keyExtractor = item => item.id
  _addFinancierKeyExtractor = item => item.id

  _addMoreBtnClicked = () => {
    this.setModalVisible(true);
  }

  _addNewFinancierBtnClicked = () => {
    this.state.selecetdArray.forEach(item => {
      this.state.currentlyAddedFinanciers.splice(this.state.currentlyAddedFinanciers.length - 1, 0, item);
      const currentIndex = this.state.currentlyUnaddedFinanciers.findIndex(eachObj =>
        eachObj.id === item.id);
      if (currentIndex !== -1) {
        this.state.currentlyUnaddedFinanciers.splice(currentIndex, 1);
      }
    });
    this.setState({
      currentlyAddedFinanciers: this.state.currentlyAddedFinanciers,
      currentlyUnaddedFinanciers: this.state.currentlyUnaddedFinanciers,
      selecetdArray: [],
      refreshFlatList: !this.state.refreshFlatList
    });
    this.setModalVisible(false);
  }

  OntRadioBtntap = rowItem => {
    this.checkObjectAlreadyExist(rowItem);
  }

  checkObjectAlreadyExist = item => {
    const currentIndex = this.state.selecetdArray.findIndex(eachObj =>
      eachObj.id === item.id);
    if (currentIndex === -1) {
      this.state.selecetdArray.push(item);
    } else {
      this.state.selecetdArray.splice(currentIndex, 1);
    }
    this.setState({
      selecetdArray: this.state.selecetdArray,
      refreshFlatList: !this.state.refreshFlatList
    });
  }

  addFinancierRenderItem = data => {
    const { item } = data;
    if (item.name === 'Add') {
      return (
        <View>
          <TouchableOpacity onPress={this._addNewFinancierBtnClicked}>
            <View style={{
              justifyContent: 'center',
              marginHorizontal: 20
            }}
            >
              <Text style={{ color: '#4E92DF' }}>
              + Add New Financier
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => this.OntRadioBtntap(item)}
      >
        <View style={
          (this.state.selecetdArray.findIndex(eachObj =>
            eachObj.id === item.id) === -1)
            ? [styles.withoutFinancierSelected] : styles.withFinancierSelected
        }
        >
          <Image
            style={styles.imageStyle}
            source={
              { uri: item.logo_url }}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderItem = data => {
    const { item } = data;
    if (item.name === 'Add') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={[styles.financierItemContainer, {
            backgroundColor: '#fff8ee',
            borderColor: '#ff5a11',
            borderWidth: 2,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }]
          }
          >
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: 'center',
              }}
              source={FinancierAddIcon}
            />
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.financierItemContainer]}>
        <TouchableOpacity
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            right: 0,
            top: 0,
            alignItems: 'center',
            backgroundColor: '#f26537'
          }}
          onPress={() => this.removeFiancierIconTapped(item)}
        >
          <Image
            style={{ resizeMode: 'center', flex: 1 }}
            source={Close}
          />
        </TouchableOpacity>
        <Image
          style={styles.financierItemImageStyle}
          source={
            { uri: item.logo_url }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.mainContainer} onLayout={this.findDimensions}>
        <Loader loading={this.props.loading} />
        <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}
        >
          <View style={styles.popUpViewStyle}>
            <View style={[styles.sliderHeaderStyles, { flexDirection: 'row' }]}>
              <Text style={{ marginLeft: 20, marginTop: 20 }}>Add Financiers </Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  alignItems: 'center',
                  backgroundColor: '#f26537'
                }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Image
                  style={{ resizeMode: 'center', flex: 1 }}
                  source={Close}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.seperatorView} />
            <View style={{ flex: 1 }}>
              <FlatList
                keyExtractor={this._addFinancierKeyExtractor}
                data={this.state.currentlyUnaddedFinanciers}
                renderItem={this.addFinancierRenderItem}
                extraData={this.state.refreshFlatList}
                horizontal={false}
                numColumns={3}
              />
            </View>
            <GradientButtonLarge
              style={styles.addNewFinancierStyle}
              title="Add Financiers"
              handleSubmit={this._addNewFinancierBtnClicked}
            />
          </View>
        </Modal>
        <View style={styles.dataContainer}>
          <ScrollView>
            <View>
              <Text style={[styles.textStyles, { textAlign: 'center', fontWeight: 'bold', marginTop: 20 }]}>
              Choose Financiers
              </Text>
              <View style={styles.mainDataContainer}>
                <Text style={[styles.textStyles, {
                  textAlign: 'left', fontSize: 12, height: 40, justifyContent: 'center', padding: 10
                }]}
                >
                Your Financiers
                </Text>
                <View style={styles.seperatorView} />
                <FlatList
                  style={styles.financierListContainer}
                  keyExtractor={this._keyExtractor}
                  data={this.state.currentlyAddedFinanciers}
                  renderItem={this.renderItem}
                  extraData={this.state.refreshFlatList}
                  ListHeaderComponent={this.renderHeader}
                  horizontal
                />
              </View>
            </View>
          </ScrollView>
          <View style={{ backgroundColor: 'white', height: 60 }}>
            <ContinueSectionScreen
              style={styles.continueBtnAction}
              continueBtnAction={this.continueBtnAction}
              backBtnAction={this.backBtnAction}
            />
          </View>
        </View>
      </View>
    );
  }
}
export default ChooseFinancierScreen;

