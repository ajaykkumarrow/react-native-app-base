import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import headerStyles from './headerStyles';
import { toggleSideNav } from '../../redux/actions/Global/actionCreators';

@connect(state => ({
  isSideNavOpen: state.global.isSideNavOpen
}), {
  toggleSideNav
})
export default class AppHeader extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isSideNavOpen: PropTypes.bool.isRequired,
    toggleSideNav: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    backEnabled: PropTypes.bool,
    onBackClick: PropTypes.func
  };

  static defaultProps = {
    backEnabled: false,
    onBackClick: null
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  onCreateNewLeadClicked = () => {
    const {
      navigate
    } = this.props.navigation;
    navigate('CreateNewLead');
  }

  render() {
    const { isSideNavOpen } = this.props;
    return (
      <View style={{ height: 50 }}>
        <LinearGradient
          colors={['#34312f', '#11100f']}
          style={headerStyles.appHeaderContent}>
          <View style={{ flex: 1, flexDirection: 'row' }} >
            {
              this.props.backEnabled ? (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      const { onBackClick } = this.props;
                      if (onBackClick) onBackClick();
                      this.props.navigation.goBack();
                    }}>
                    <LinearGradient
                      colors={['#565252', '#403c3c']}
                      style={headerStyles.gradient}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ justifyContent: 'center', alignSelf: 'center' }}>
                          <SimpleLineIcon name="arrow-left" size={21} color="#9d9c9c" />
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) :
                !isSideNavOpen &&
                <View style={{ flex: 1 }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={this.props.toggleSideNav}>
                    <LinearGradient
                      colors={['#565252', '#403c3c']}
                      style={headerStyles.gradient}>
                      <View style={{ flex: 1 }} >
                        <View style={{
                          flex: 1,
                          justifyContent: 'center'
                        }}>
                          <Text style={{ paddingTop: 10 }}>
                            <SimpleLineIcon name="arrow-down" size={24} color="#615e5e" />
                          </Text>
                        </View>
                        <View style={{
                          flex: 1,
                          justifyContent: 'center'
                        }}>
                          <Text style={{ paddingBottom: 20, fontWeight: 'bold' }}>
                            <SimpleLineIcon name="arrow-down" size={24} color="#9c9a9a" />
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
            }
            <View style={{
              flex: 12,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
              {
                this.props.children ?
                  this.props.children :
                  <View style={{ flex: 1 }} />
              }
              <View style={{ width: 75, flexDirection: 'row' }}>
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  display: 'none'
                }}>
                  <TouchableOpacity
                    style={{ marginLeft: 5, justifyContent: 'center' }}
                    onPress={() => { this.onCreateNewLeadClicked(); }}>
                    <Text>
                      <Icon name="bell" size={30} color="gray" />
                    </Text>
                    <View style={headerStyles.headerBellNotify} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      marginLeft: 5,
                      flex: 1
                    }}
                    onPress={() => { this.onCreateNewLeadClicked(); }}>
                    <LinearGradient
                      colors={['#f3842d', '#ef563c']}
                      style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <Icon name="plus" size={21} color="white" />
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}
