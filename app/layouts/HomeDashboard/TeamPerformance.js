import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Dimensions from 'Dimensions';
import FlexAnimate from './../../components/animated/FlexAnimate';
import SpringView from '../../components/animated/SpringView';
import teamPerformanceCardStyles from './temPerformanceStyles';

const DEVICE_WIDTH = Dimensions.get('screen').width;

@connect(state => ({
  isSideNavOpen: state.global.isSideNavOpen
}), null)
class TeamPerformance extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    teamMembers: PropTypes.array.isRequired,
    onManageTeamClick: PropTypes.func.isRequired,
    onEditTargetClick: PropTypes.func.isRequired,
    isSideNavOpen: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onCreateNewLeadClicked = () => {
    const {
      navigate
    } = this.props.navigation;
    navigate('CreateNewLead');
  }

  renderTeamDetailCard = teamDetail => {
    const { isSideNavOpen } = this.props;
    const maxWidth = (DEVICE_WIDTH - (isSideNavOpen ? 160 : 100)) / 3;
    const targetSoldPercentage =
      (((teamDetail.monthlyUnitsInvoiced / teamDetail.monthlyUnitTarget) * 100) / 10).toFixed(1);
    const colors = [
      ['#5a35da', '#475fdd'],
      ['#0ac7c4', '#51deb7'],
      ['green', 'yellowgreen'],
      ['#ef563c', '#f3842d']];
    const [colorZero, colorOne, colorTwo, colorThree, colorFour] = colors;
    let activeGradientColor = colorZero;
    if (targetSoldPercentage >= 10) {
      activeGradientColor = colorFour;
    } else if (targetSoldPercentage >= 9) {
      activeGradientColor = colorThree;
    } else if (targetSoldPercentage >= 8) {
      activeGradientColor = colorTwo;
    } else if (targetSoldPercentage >= 5) {
      activeGradientColor = colorOne;
    }
    if (colors) {
      return (
        <View style={[teamPerformanceCardStyles.container, {
          maxWidth
        }]}>
          <View style={teamPerformanceCardStyles.headerStyle}>
            <View style={teamPerformanceCardStyles.userImageStyle}>
              <Text style={teamPerformanceCardStyles.userImageText}>
                {teamDetail.name.split('')[0]}
                {teamDetail.name.split(' ')[1].split('')[0]}
              </Text>
            </View>
          </View>
          <View style={teamPerformanceCardStyles.nameContainer}>
            <Text style={teamPerformanceCardStyles.nameStyle}>
              {teamDetail.name.toUpperCase()}
            </Text>
            <View style={teamPerformanceCardStyles.activeUser} />
          </View>
          <View style={teamPerformanceCardStyles.followUpContainer}>
            <Text style={teamPerformanceCardStyles.followUpText}>Follow Up</Text>
            <Text style={teamPerformanceCardStyles.followUpDoneText}>{teamDetail.followupDone}
              <Text style={teamPerformanceCardStyles.followUpTarget}>/{teamDetail.target}</Text>
            </Text>
          </View>
          <View style={[teamPerformanceCardStyles.dealerTargetPillContainer]}>
            {
              teamDetail.pending &&
              <View style={[teamPerformanceCardStyles.dealerTargetPillContent, { backgroundColor: '#f5a166' }]}>
                <Text style={teamPerformanceCardStyles.dealerTargetPillContentLabel}>Pending</Text>
                <Text style={teamPerformanceCardStyles.dealerTargetPillContentValue}>{teamDetail.pending}</Text>
              </View>
            }
            {
              teamDetail.hot &&
              <View style={[teamPerformanceCardStyles.dealerTargetPillContent, { backgroundColor: '#4dbaf0' }]}>
                <Text style={teamPerformanceCardStyles.dealerTargetPillContentLabel}>Hot</Text>
                <Text style={teamPerformanceCardStyles.dealerTargetPillContentValue}>{teamDetail.hot}</Text>
              </View>
            }
            {
              teamDetail.warm &&
              <View style={[teamPerformanceCardStyles.dealerTargetPillContent, { backgroundColor: '#52dfbd' }]}>
                <Text style={teamPerformanceCardStyles.dealerTargetPillContentLabel}>Warm</Text>
                <Text style={teamPerformanceCardStyles.dealerTargetPillContentValue}>{teamDetail.warm}</Text>
              </View>
            }
            {
              teamDetail.cold &&
                <View style={[teamPerformanceCardStyles.dealerTargetPillContent, { backgroundColor: 'yellowgreen' }]}>
                  <Text style={teamPerformanceCardStyles.dealerTargetPillContentLabel}>Cold</Text>
                  <Text style={teamPerformanceCardStyles.dealerTargetPillContentValue}>{teamDetail.cold}</Text>
                </View>
            }
          </View>
          <View style={teamPerformanceCardStyles.newLeadsContainer}>
            <Text style={teamPerformanceCardStyles.newLeadsLabel}>New Leads
            </Text>
            <Text style={teamPerformanceCardStyles.newLeadsValue}>{teamDetail.newLeads}
            </Text>
          </View>
          <View style={teamPerformanceCardStyles.monthlyUnitsContainer}>
            <Text style={teamPerformanceCardStyles.monthlyUnitsLabel}>Monthly Units Invoiced</Text>
            <Text style={teamPerformanceCardStyles.monthlyUnitsValue}>{teamDetail.monthlyUnitsInvoiced}
              <Text style={teamPerformanceCardStyles.monthlyUnitsTagetValue}>/{teamDetail.monthlyUnitTarget}
              </Text>
            </Text>
          </View>
          <View style={teamPerformanceCardStyles.monthlyUnitsPerformance} >
            <FlexAnimate
              duration={1000}
              flexValue={targetSoldPercentage / 10} >
              <LinearGradient
                colors={activeGradientColor}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={[teamPerformanceCardStyles.monthlyUnitsPerformanceGradient, {
                  borderTopRightRadius: teamDetail.monthlyUnitsInvoiced < teamDetail.monthlyUnitTarget ?
                    0 : 4,
                  borderBottomRightRadius: teamDetail.monthlyUnitsInvoiced < teamDetail.monthlyUnitTarget ?
                    0 : 4
                }]} >
                <TouchableOpacity
                  onPress={() => {}}
                  style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 12, justifyContent: 'center' }}>
                    {targetSoldPercentage * 10}%
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </FlexAnimate>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{
        margin: 20,
      }} >
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', display: 'none' }}>
          <Text style={teamPerformanceCardStyles.teamPerformance}>Your Team's Performance: Today
          </Text>
          <View style={{ flex: 3, flexDirection: 'row' }}>
            <View style={{ flex: 1, borderRadius: 4 }}>
              <SpringView
                fadeIn={false}
                duration={1000}
                springValue={0.9}
                style={teamPerformanceCardStyles.teamPerformanceSpringButton}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{ alignItems: 'center' }}
                  onPress={this.props.onManageTeamClick}>
                  <LinearGradient
                    colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
                    start={{ x: 0.0, y: 1.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                    <View style={teamPerformanceCardStyles.teamPerformanceEditLinearButton}>
                      <View style={{ flex: 7, justifyContent: 'center' }}>
                        <Text style={{ color: '#4C64FF', paddingLeft: 10, fontSize: 15 }}>
                            Manage Team
                        </Text>
                      </View>
                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={{ color: '#4C64FF', fontSize: 20 }}>></Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </SpringView>
            </View>
            <View style={{
              flex: 1,
              borderRadius: 4,
            }}>
              <SpringView
                fadeIn={false}
                duration={1000}
                springValue={0.9}
                style={teamPerformanceCardStyles.teamPerformanceSpringButton}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{ alignItems: 'center' }}
                  onPress={this.props.onEditTargetClick}>
                  <LinearGradient
                    colors={['#ef5842', '#f05b3c', '#f16636', '#f37632', '#f3842b']}
                    start={{ x: 0.0, y: 1.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                    <View style={teamPerformanceCardStyles.teamPerformanceEditTargetLinearButton}>
                      <View style={{ flex: 7, justifyContent: 'center' }}>
                        <Text style={{ color: 'white', paddingLeft: 10, fontSize: 15 }}>
                          Edit Targets
                        </Text>
                      </View>
                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>></Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </SpringView>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10, display: 'none' }}>
          <FlatList
            data={this.props.teamMembers}
            renderItem={({ item }) => this.renderTeamDetailCard(item)}
            keyExtractor={item => item.id}
            horizontal={false}
            numColumns={3}
            extraData={this.props.isSideNavOpen}
              />
        </View>
      </View>
    );
  }
}

export default TeamPerformance;
