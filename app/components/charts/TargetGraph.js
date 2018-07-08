import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import FlexAnimate from '../../components/animated/FlexAnimate';
import targetGraphStyles from './targetGraphStyles';

export default class TargetGraph extends Component {
  static calculateTargetSummary = target => {
    const {
      mtd,
      mt,
      dt
    } = target;
    target.aboveDt = mtd > dt;
    target.aboveMt = mtd > mt;
    target.additionalDealerUnitsSold = target.aboveDt ? mtd - dt : 0;
    if (mt) {
      const getFixedPerc = x => parseFloat(Number.parseFloat(x).toFixed(0));
      target.perc = getFixedPerc((mtd / mt) * 100);
      target.additionalManagerUnitsSold = target.aboveMt ? mtd - mt : 0;
      target.additionalManagerUnitsSoldPerc =
        target.aboveMt ? getFixedPerc((target.additionalManagerUnitsSold / (dt - mt)) * 100) : 0;
      target.additionalDealerUnitsSoldPerc =
        target.aboveDt ? getFixedPerc((target.additionalDealerUnitsSold / (dt - mt)) * 100) : 0;
    } else {
      const getFixedPerc = x => parseFloat(Number.parseFloat(x).toFixed(0));
      const derivedThirtyPerc = ((mtd / dt) * 100 > 70) ? (30 / dt) * 100 : 0;
      target.perc = getFixedPerc((mtd / dt) * 100);
      target.additionalManagerUnitsSold = 0;
      target.additionalManagerUnitsSoldPerc = getFixedPerc((mtd / derivedThirtyPerc) * 100);
      target.additionalDealerUnitsSoldPerc =
        target.aboveDt ? getFixedPerc((target.additionalDealerUnitsSold / (mtd - dt)) * 100) : 0;
    }
    return target;
  }
  static propTypes = {
    data: PropTypes.object.isRequired,
    style: PropTypes.object,
    highlights: PropTypes.object,
    animation: PropTypes.object,
    noDataText: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    style: null,
    highlights: null,
    animation: null,
    noDataText: null,
    onChange: null,
  }

  constructor(props) {
    super(props);
    let { data: targets } = this.props;
    if (targets && targets.length > 0) {
      targets = targets.map(data => TargetGraph.calculateTargetSummary(data));
    }
    this.state = {
      targetSummary: targets
    };
  }

  static getDerivedStateFromProps(nextProps) {
    let { data: { targets } } = nextProps;
    if (targets && targets.length > 0) {
      targets = targets.map(data => TargetGraph.calculateTargetSummary(data));
      return {
        targetSummary: targets
      };
    }
    return null;
  }
  render() {
    const { targetSummary } = this.state;
    const { data: { headerText, colors, targetLabels } } = this.props;
    const {
      style, highlights, animation, noDataText, onChange
    } = this.props;
    console.log(highlights, animation, noDataText, onChange);
    return (
      <View style={[style || {}, { flex: 1 }]}>
        <View style={{ marginHorizontal: 10 }}>
          <Text style={targetGraphStyles.targetSummaryHeader}>
            {headerText}
          </Text>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <View style={targetGraphStyles.targetSummaryContainer}>
            {
                    targetSummary.map((target, index) => {
                      const gradientColor = (() => {
                        if (target.aboveDt) {
                          return colors[0];
                        }
                        if (target.aboveMt) {
                          return colors[1];
                        }
                        if (index === 0) {
                          return colors[2];
                        }
                        return colors[3];
                      })();
                      return (
                        <View style={{ flex: 1, flexDirection: 'row' }} key={target.id}>
                          <View key={target.id} style={{ flex: 1, flexDirection: 'column' }}>

                            {/** First Row View Details* */}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                              <View style={{ flex: 7 }}>
                                <Text style={targetGraphStyles.targetFirstRowContent}>
                                  {target.targetName}
                                </Text>
                              </View>
                              <View style={{ flex: 3, flexDirection: 'row' }}>
                                <View style={{ flex: 7 }}>
                                  {
                                    index === 0 && target.mt &&
                                    <Text
                                      style={targetGraphStyles.targetFirstRowContentTextInitial}
                                      >{targetLabels[0]}
                                    </Text>
                                  }
                                </View>
                                <View style={{ flex: 3 }}>
                                  {
                                    index === 0 &&
                                    <Text
                                      style={targetGraphStyles.targetFirstRowContentTextSecondary}
                                      >{targetLabels[1]}
                                    </Text>
                                  }
                                </View>
                              </View>
                            </View>

                            {/* 2nd View Bar - Line Graph */}
                            <View style={{
                              flex: 1,
                              padding: 2,
                              flexDirection: 'row',
                              backgroundColor: '#f5f5f5',
                              borderRadius: 5
                            }}
                            >

                              {/* First Layer Of Bar Graph */}
                              <View style={{ flex: target.mt ? 7 : 10, borderRadius: 5, flexDirection: 'row' }}>
                                <FlexAnimate
                                  duration={1000}
                                  flexValue={target.perc > 0 ? target.perc / 10 : 0}
                                >
                                  <LinearGradient
                                    colors={gradientColor}
                                    start={{ x: 0.0, y: 0.0 }}
                                    end={{ x: 1.0, y: 1.0 }}
                                    style={
                                      [
                                        targetGraphStyles.targetGradient,
                                        {
                                          height: index === 0 ? 30 : 20
                                        }
                                      ]}
                                  >
                                    <TouchableOpacity
                                      onPress={() => {}}
                                      style={{ alignItems: 'center' }}
                                    >
                                      <Text style={targetGraphStyles.percentagetText}>
                                        {target.perc}%
                                      </Text>
                                    </TouchableOpacity>
                                  </LinearGradient>
                                </FlexAnimate>
                                <View style={{ flex: target.perc > 0 ? 10 - (target.perc / 10) : 1 }} />
                              </View>

                              {/* Second Layer Of Bar Graph */}
                              <View style={{ flex: target.mt ? 3 : 0 }}>
                                <View style={{ flex: 1, borderRadius: 5, flexDirection: 'row' }}>
                                  {/* Manufacturer Target Line Of Bar Graph */}
                                  <Text style={
                                    [
                                      targetGraphStyles.targetLineGraph,
                                      {
                                        height: index === 0 ? 32 : 22
                                      }
                                    ]}
                                  />

                                  {/* Second Layer Of Bar Graph */}
                                  {/* can be used flex: 10 - (((target.mt / target.dt) * 100) / 10), */}
                                  <View style={targetGraphStyles.primaryTargetFlex}>
                                    {target.additionalManagerUnitsSold > 0 &&
                                    <View style={{ flex: 10, flexDirection: 'row' }}>
                                      <FlexAnimate
                                        style={{}}
                                        duration={1000}
                                        flexValue={target.aboveMt ? target.additionalManagerUnitsSoldPerc / 10 : 10}
                                      >
                                        <LinearGradient
                                          colors={gradientColor}
                                          start={{ x: 0.0, y: 0.0 }}
                                          end={{ x: 1.0, y: 1.0 }}
                                          style={
                                            [
                                              targetGraphStyles.targetGradient, {
                                                height: index === 0 ? 30 : 22
                                              }
                                            ]}
                                        >
                                          <TouchableOpacity
                                            onPress={() => {}}
                                            style={{
                                            }}
                                          >
                                            <Text style={targetGraphStyles.targetOpacity}>
                                             + {target.additionalManagerUnitsSold}
                                            </Text>
                                          </TouchableOpacity>
                                        </LinearGradient>
                                      </FlexAnimate>
                                      {/* {
                                      !target.aboveDt && */}
                                      <View style={{
                                        flex: target.aboveMt ? 10 - (target.additionalManagerUnitsSoldPerc / 10) : 0
                                      }}
                                      />
                                      {/* } */}
                                    </View>
                                    }
                                  </View>

                                  {/* [***Second Layer  of Manufacturer [BAR] **** | ***] */}
                                  {/* flex: (((target.mt / target.dt) * 100) / 10), */}
                                  <View style={{
                                    flex: 3,
                                    borderRadius: 5,
                                    flexDirection: 'row'
                                  }}
                                  >
                                    {/* Dealer Target Line Of Bar Graph -|- */}
                                    <Text style={
                                      [
                                        targetGraphStyles.secondaryTargetContent, {
                                          height: index === 0 ? 32 : 22
                                        }
                                      ]}
                                    />
                                    <View style={{
                                      flex: 10,
                                      marginLeft: 5,
                                      flexDirection: 'row'
                                    }}
                                    >
                                      {target.aboveDt &&
                                        <FlexAnimate
                                          style={{}}
                                          duration={1000}
                                          flexValue={target.additionalDealerUnitsSoldPerc / 10}
                                          >
                                          <LinearGradient
                                            colors={gradientColor}
                                            start={{ x: 0.0, y: 0.0 }}
                                            end={{ x: 1.0, y: 1.0 }}
                                            style={
                                              [
                                                targetGraphStyles.targetGradient,
                                                {
                                                  height: index === 0 ? 30 : 20,
                                                }]}
                                          >
                                            <TouchableOpacity
                                              onPress={() => {}}
                                              style={{}}
                                            >
                                              <Text style={targetGraphStyles.targetOpacity}>
                                             + {target.additionalDealerUnitsSold}
                                              </Text>
                                            </TouchableOpacity>
                                          </LinearGradient>
                                        </FlexAnimate>
                                      }
                                      {
                                        <View style={{
                                          flex: target.aboveDt ? (10 - (target.additionalDealerUnitsSoldPerc / 10))
                                            : 10
                                        }}
                                        />
                                      }
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>

                            {/* Third Row of single bar */}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                              <View style={{
                                flex: 7,
                                borderRadius: 5,
                                flexDirection: 'row'
                              }}
                              >
                                <View style={{
                                  flex: target.perc > 0 ?
                                    (target.perc < 90 ? target.perc / 10 : 8.8) : 0
                                }}
                                >
                                  <Text style={targetGraphStyles.zeroPercentText}>
                                0
                                  </Text>
                                </View>

                                <FlexAnimate
                                  duration={1000}
                                  flexValue={target.perc > 0 ?
                                    (target.perc < 90 ? 10 - (target.perc / 10) : 1.2) : 0}
                                  style={{
                                    flexDirection: 'row'
                                  }}
                                >
                                  <Text style={targetGraphStyles.percentText}>
                                    {target.perc}% ({target.mtd} units)
                                  </Text>
                                </FlexAnimate>
                              </View>

                              <View style={{
                                flex: 3
                              }}
                              >
                                <View style={{
                                  flex: 1,
                                  borderRadius: 5,
                                  flexDirection: 'row'
                                }}
                                >
                                  {/** 0* */}

                                  {/* flex: 10 - (((target.mt / target.dt) * 100) / 10), */}
                                  <View style={{
                                    flex: 7,
                                    flexDirection: 'row'
                                  }}
                                  >
                                    {/** SOLD Percentage* */}
                                    <Text style={
                                      [
                                        targetGraphStyles.actualPercentage,
                                        {
                                          width: 200,
                                        }
                                      ]}
                                    >
                                      {target.mt}
                                    </Text>

                                    {
                                      target.additionalDealerUnitsSold > 0 &&
                                      <View style={{ flex: 10, flexDirection: 'row' }} >
                                        <View style={{
                                          flex: target.aboveMt ?
                                            target.additionalDealerUnitsSoldPerc / 10 : 10
                                        }}
                                        />
                                        <View style={{
                                          flex: !target.aboveMt ? 10
                                          - (target.additionalDealerUnitsSoldPerc / 10) : 0
                                        }}
                                        >
                                          <Text style={
                                            [
                                              targetGraphStyles.actualPercentage,
                                              {
                                                width: 100,
                                              }
                                            ]}
                                          >
                                            {target.mtd}
                                          </Text>
                                        </View>
                                      </View>
                                    }
                                  </View>

                                  {/** Manager Target* */}
                                  {/* flex: (((target.mt / target.dt) * 100) / 10), */}
                                  <View style={{
                                    flex: 3,
                                    borderRadius: 5,
                                    flexDirection: 'row'
                                  }}
                                  >
                                    {/* Dealer Target */}
                                    <Text style={targetGraphStyles.secondaryTargetActuals}>{target.dt}
                                    </Text>
                                    <View style={{
                                      flex: 10,
                                      marginLeft: 5,
                                      flexDirection: 'row'
                                    }}
                                    >
                                      {
                                        target.aboveMt &&
                                        <View style={{ flex: target.additionalManagerUnitsSoldPerc / 10 }}>
                                          <View style={{ flex: target.additionalManagerUnitsSoldPerc / 10 }} />
                                          <View>
                                            <Text style={targetGraphStyles.secondaryTargetActualText}>{target.mtd}
                                            </Text>
                                          </View>
                                        </View>
                                      }
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  }
          </View>
        </View>
      </View>);
  }
}

