import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SectionList,
  ListView,
  PanResponder,
  FlatList,
  TextInput } from 'react-native';
import downArrow from '../../assets/images/Downarrow.png';
import AddIcon from '../../assets/images/AddIcon.png';
import close from '../../assets/images/close.png';
import CloseWithBorder from '../../assets/images/CloseWithBorder.png';
import { ButtonWithPlainText } from '../../components/button/Button';
import ProductListingStyles from './productListingStyles';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const SPECDATA = ['Engine', 'Dimensions & Weight', 'Brakes', 'Tyre Size', 'Suspension', 'Electrical'];
const stepCount = 32;
let pointsArr = [];
let str = '';

const SECTIONS = [
  {
    data: [
      {
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
        description: 'Internal state is not preserved when content scrolls out of the render window.' +
        ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.',
        cc: '125',
        kmpl: '32',
        weight: '150',
        rate: '1,14,000',
        title: 'LIST 0'
      }
    ],
    title: 'SECTION 0',
  },
  {
    data: [
      {
        title: 'LIST 0',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
      },
      {
        title: 'LIST 1',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
      },
      {
        title: 'LIST 2',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
        titleText: 'LEGENDERY INTRUDER STYLE HEADLAMP',
        deacription: 'Internal state is not preserved when content scrolls out of the render window.' +
        ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.'
      },
      {
        title: 'LIST 3',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
      },
      {
        title: 'LIST 4',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
        onRoadPrice: 'Rs. 100,000'
      },
      {
        title: 'LIST 5',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
        imagesArray: [
          {
            name: 'Gixer',
            imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
          },
          {
            name: 'Gixer',
            imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
          },
          {
            name: 'Gixer',
            imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
          }
        ]
      },
      {
        title: 'LIST 6',
        imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
        imagesArray: [
          {
            name: 'Gixer',
            imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
          },
          {
            name: 'Gixer',
            imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
          }
        ]
      }
    ],
    title: 'SECTION 1',
  },
];

const VEHICLE_DATA = [
  {
    id: '1',
    name: 'Gixer',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
  },
  {
    id: '2',
    name: 'Suzuki',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_2-min.png'
  },
  {
    id: '3',
    name: 'Honda',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_3-min.png'
  },
  {
    id: '4',
    name: 'R15',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_4-min.png'
  },
  {
    id: '5',
    name: 'Bike 1',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_5-min.png'
  },
  {
    id: '6',
    name: 'Bike 2',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_6-min.png'
  },
  {
    id: '7',
    name: 'Gixer',
    Imageurl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_7-min.png'
  },
];

export default class ProductListingScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(SPECDATA),
      value: 1,
      selectedBike: {},
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

   onBikeTypeClicked = rowItem => {
     this.setState({
       selectedBike: rowItem,
     });
   }

   /**
    * Difference functionality in product listing screen
    */
    _onShowDifferenceBtnClicked = () => {
    }

  /**
    * Compare functionality in product listing screen
    */
    _onCompareBtnClicked = () => {
    }

    _onCloseBtnClicked = () => {
      this.setState({
        selectedBike: {}
      });
      this.state.selectedBike = null;
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: 1,
        itemIndex: 5,
        viewPosition: 0,
        viewOffset: 50,
      });
    }

    _onOverViewBtnClicked = () => {
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
        viewOffset: 50,
      });
    }
    _on360BtnClicked = () => {
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: 1,
        itemIndex: 0,
        viewPosition: 0,
        viewOffset: 50,
      });
    }
    _onFeaturesBtnClicked = () => {
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: 1,
        itemIndex: 1,
        viewPosition: 0,
        viewOffset: 50,
      });
    }
    _onSpecsBtnClicked = () => {
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: 1,
        itemIndex: 3,
        viewPosition: 0,
        viewOffset: 50,
      });
    }
    _addMoreVehicleBtnClicked = () => {
      this.state.selectedBike = null;
      this.sectionListRef.scrollToLocation({
        animated: true,
        sectionIndex: 1,
        itemIndex: 5,
        viewPosition: 0,
        viewOffset: 50,
      });
    }
    firstColorIndextapped = () => {
      this.setState({
        isFirstColorTapped: true
      });
    }
    secondColorIndextapped = () => {
      this.setState({
        isFirstColorTapped: false
      });
    }
    change(value) {
      this.setState(() => ({
        value: parseFloat(value),
      }));
    }

  _handlePanResponderMove = e => {
    pointsArr.push(e.nativeEvent.locationX);
    this.updateSlider();
  };

  _handlePanResponderEnd = () => {
    pointsArr = [];
  };
  _handleStartShouldSetPanResponder = () =>
    // Should we become active when the user presses down on the circle?
    true
  ;

  _handleMoveShouldSetPanResponder = () =>
    // Should we become active when the user moves a touch over the circle?
    true
  ;

  _handlePanResponderGrant = () => {
    // this._highlight();
  };

  updateSlider() {
    const sliderStep = DEVICE_WIDTH / stepCount;
    const firstEle = pointsArr[0];
    const lastEle = pointsArr[pointsArr.length - 1];
    let drag = lastEle - firstEle;
    if (Math.abs(Math.round(drag / sliderStep)) >= 1) {
      pointsArr = [];
      let currentVal = Math.round(this.state.value + Math.round(drag / sliderStep));
      if (currentVal < 0) {
        currentVal = stepCount;
      } else if (currentVal > stepCount) {
        currentVal = 0;
      }
      drag = 0;
      this.setState({
        value: currentVal
      });
    }
  }

  keyExtractor = item => (
    item.title
  )

  _vehicleKeyExtractor = item => item.id

  _vehicleRenderItem = data => {
    const { item } = data;
    return (
      <View >
        <TouchableOpacity onPress={() => this.onBikeTypeClicked(item)}>
          <Image
            style={{
              height: ((DEVICE_HEIGHT - 100) / 2) - 50,
              width: ((DEVICE_HEIGHT - 100) / 2) - 50,
              resizeMode: 'stretch'
            }}
            source={
              { uri: item.Imageurl }}
          />
          <Text style={{
            color: '#79869E',
            alignSelf: 'center',
            fontSize: 20,
            margin: 20
          }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSectionHeader = ({ section }) => {
    switch (section.title) {
      case 'SECTION 0': {
        return (
          <View style={ProductListingStyles.firstheaderStyle}>
            <View style={{
              flex: 1,
              flexDirection: 'row'
            }}
            >
              <TouchableOpacity style={{ backgroundColor: '#4E92DF', width: 50 }} >
                <Image
                  source={close}
                />
              </TouchableOpacity>
              <Text style={ProductListingStyles.firstSectiontitleStyle}>Sizuki Intruder 150
              </Text>
            </View>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
            >
              <View style={ProductListingStyles.saveBgViewStyle}>
                <View style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#D0E1FE',
                  margin: 5
                }}
                />
                <Text>
                  Save
                </Text>
              </View>
            </View>
          </View>
        );
      }
      case 'SECTION 1':
      {
        return (
          <View style={{
            backgroundColor: '#E8EDFA',
            flexDirection: 'row',
            height: 50,
            zIndex: 99
          }}
          >
            <View style={{
              flex: 1,
              flexDirection: 'row'
            }}
            >
              <TouchableOpacity style={{
                backgroundColor: '#4E92DF',
                width: 50,
                alignItems: 'center'
              }}
              >
                <Image
                  source={close}
                />
              </TouchableOpacity>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              flex: 3
            }}
            >
              <ButtonWithPlainText
                title="OverView"
                style={{
                  flex: 1,
                  backgroundColor: '#E8EDFA',
                }}
                textStyle={{
                  color: '#007CDA',
                  fontSize: 20,
                  padding: 10
                }}
                handleSubmit={this._onOverViewBtnClicked}
              />
              <ButtonWithPlainText
                title="360"
                style={{
                  flex: 0.5,
                  backgroundColor: '#E8EDFA',
                }}
                textStyle={{
                  color: '#007CDA',
                  fontSize: 20,
                  padding: 10
                }}
                handleSubmit={this._on360BtnClicked}
              />
              <ButtonWithPlainText
                title="Features"
                style={{
                  flex: 1,
                  backgroundColor: '#E8EDFA',
                }}
                textStyle={{
                  color: '#007CDA',
                  fontSize: 20,
                  padding: 10
                }}
                handleSubmit={this._onFeaturesBtnClicked}
              />
              <ButtonWithPlainText
                title="Specs"
                style={{
                  flex: 0.8,
                  backgroundColor: '#E8EDFA',
                }}
                textStyle={{
                  color: '#007CDA',
                  fontSize: 20,
                  padding: 10
                }}
                handleSubmit={this._onSpecsBtnClicked}
              />
            </View>
            <View style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
            >
              <View style={ProductListingStyles.onRoadPriceBgView}>
                <Text style={{ margin: 10 }}>
                  On Road Price
                </Text>
              </View>
              <View style={ProductListingStyles.saveBgViewStyle}>
                <View style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#D0E1FE',
                  margin: 5,
                  alignSelf: 'center'
                }}
                />
                <Text>
                  Save
                </Text>
              </View>
            </View>
          </View>
        );
      }
      default:
    }
  }

  renderItem = ({ item, section }) => {
    const BoldText = props => <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{props.children}</Text>;
    switch (section.title) {
      case 'SECTION 0': {
        return (
          <View style={{
            width: DEVICE_WIDTH,
            backgroundColor: 'white',
            marginHorizontal: 20
          }}
          >
            <Image
              style={{
                width: DEVICE_WIDTH,
                height: DEVICE_HEIGHT - 200,
                resizeMode: 'contain'
              }}
              source={{ uri: item.imageUrl }}
            />
            <View style={{
              width: 50,
              height: 120,
              position: 'absolute',
              right: 200,
              top: DEVICE_HEIGHT - 350
            }}
            >
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.firstColorIndextapped}>
                <View style={(this.state.isFirstColorTapped) ? {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'black',
                  marginBottom: 10
                } : {
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'black',
                  marginBottom: 10
                }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.secondColorIndextapped}>
                <View style={(this.state.isFirstColorTapped) ? {
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'gray',
                  marginBottom: 10
                } : {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'gray',
                  marginBottom: 1
                }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 2 }}>
              <View style={{ flex: 2 }} />
              <View style={{
                flex: 6,
                flexDirection: 'column'
              }}
              >
                <Text style={{ color: '#2A4F78' }} >{item.description}</Text>
                <View style={{
                  flexDirection: 'row',
                  height: 50,
                  justifyContent: 'space-around',
                  marginTop: 10
                }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      backgroundColor: 'lightgray',
                      width: 40,
                      margin: 5,
                      borderRadius: 5
                    }}
                    />
                    <View style={{
                      margin: 5,
                      flexDirection: 'column',
                      alignItems: 'center',
                      alignSelf: 'center'
                    }}
                    >
                      <Text>
                        <BoldText>{item.cc}</BoldText>cc
                      </Text>
                      <Text>
                      Engine
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: 50, width: 1, backgroundColor: 'gray' }} />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      backgroundColor: 'lightgray', width: 40, margin: 5, borderRadius: 5
                    }}
                    />
                    <View style={{
                      margin: 5,
                      flexDirection: 'column',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}
                    >
                      <Text>
                        <BoldText>{item.kmpl}</BoldText>kmpl
                      </Text>
                      <Text>
                      mileage
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    height: 50,
                    width: 1,
                    backgroundColor: 'gray'
                  }}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      backgroundColor: 'lightgray',
                      width: 40,
                      margin: 5,
                      borderRadius: 5
                    }}
                    />
                    <View style={{
                      margin: 5,
                      flexDirection: 'column',
                      alignItems: 'center',
                      alignSelf: 'center'
                    }}
                    >
                      <Text>
                        <BoldText>{item.weight}</BoldText>kg
                      </Text>
                      <Text>
                      Weight
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    height: 50,
                    width: 1,
                    backgroundColor: 'gray'
                  }}
                  />
                  <View>
                    <Text>
                      Starting {item.rate}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      backgroundColor: '#E8EDFA',
                      borderRadius: 5,
                      margin: 5,
                      alignItems: 'center'
                    }}
                    >
                      <Text style={{ margin: 5 }}>
                  EMI Option Available
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 2 }} />
            </View>
            <View style={{
              height: 100,
              width: DEVICE_WIDTH
            }}
            >
              <View style={{
                flexDirection: 'column',
                alignItems: 'center'
              }}
              >
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <Text style={{
                    color: '#4E92DF',
                    fontSize: 20,
                    padding: 10
                  }}
                  >Schedule A Test Ride
                  </Text>
                </TouchableOpacity>
                <View style={{
                  width: 140,
                  height: 1,
                  alignItems: 'center',
                  backgroundColor: '#79869E'
                }}
                />
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 20
                    }}
                    source={downArrow}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
      case 'SECTION 1': {
        switch (item.title) {
          case 'LIST 0': {
            str = `https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_${
              this.state.value}-min.png`;
            return (
              <View style={{
                width: DEVICE_WIDTH,
                marginHorizontal: 20
              }}
              >
                <Image
                  style={{
                    width: DEVICE_WIDTH,
                    height: DEVICE_HEIGHT - 100,
                    resizeMode: 'contain'
                  }}
                  fadeDuration={0}
                  source={{ uri: str }}
                  {...this._panResponder.panHandlers}
                />
                <View style={{
                  width: 50,
                  height: 120,
                  position: 'absolute',
                  right: 50,
                  bottom: DEVICE_HEIGHT / 2
                }}
                >
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.firstColorIndextapped}>
                    <View style={(this.state.isFirstColorTapped) ? {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'black',
                      marginBottom: 10
                    } : {
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'black',
                      marginBottom: 10
                    }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.secondColorIndextapped}>
                    <View style={(this.state.isFirstColorTapped) ? {
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'gray',
                      marginBottom: 10
                    } : {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'gray',
                      marginBottom: 10
                    }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ height: 100, width: DEVICE_WIDTH }} >
                  <View style={{
                    flexDirection:
                    'column',
                    alignItems: 'center'
                  }}
                  >
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Text style={{
                        color: '#4E92DF',
                        fontSize: 20,
                        padding: 10
                      }}
                      >Schedule A Test Ride
                      </Text>
                    </TouchableOpacity>
                    <View style={{
                      width: 140,
                      height: 1,
                      alignItems: 'center',
                      backgroundColor: '#79869E'
                    }}
                    />
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 20
                        }}
                        source={downArrow}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }
          case 'LIST 1': {
            return (
              <View style={{
                width: DEVICE_WIDTH - 40,
                marginHorizontal: 20
              }}
              >
                <Image
                  style={{
                    width: DEVICE_WIDTH,
                    height: DEVICE_HEIGHT,
                    resizeMode: 'contain'
                  }}
                  source={{ uri: item.imageUrl }}
                />
                <View style={{
                  width: 50,
                  height: 120,
                  position: 'absolute',
                  right: 50,
                  bottom: DEVICE_HEIGHT / 2
                }}
                >
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.firstColorIndextapped}>
                    <View style={(this.state.isFirstColorTapped) ? {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'black',
                      marginBottom: 10
                    } : {
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'black',
                      marginBottom: 10
                    }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.secondColorIndextapped}>
                    <View style={(this.state.isFirstColorTapped) ? {
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'gray',
                      marginBottom: 10
                    } : {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'gray',
                      marginBottom: 10
                    }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ height: 100, width: DEVICE_WIDTH }} >
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Text style={{
                        color: '#4E92DF',
                        fontSize: 20,
                        padding: 10
                      }}
                      >Schedule A Test Ride
                      </Text>
                    </TouchableOpacity>
                    <View style={{
                      width: 140,
                      height: 1,
                      alignItems: 'center',
                      backgroundColor: '#79869E'
                    }}
                    />
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 20
                        }}
                        source={downArrow}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }
          case 'LIST 2': {
            return (
              <View style={{
                width: DEVICE_WIDTH - 40,
                height: DEVICE_HEIGHT - 50,
                flexDirection: 'row',
                marginHorizontal: 20
              }}
              >
                <View style={{ flex: 1 }}>
                  <Image
                    style={{
                      flex: 1,
                      resizeMode: 'stretch'
                    }}
                    source={{ uri: item.imageUrl }}
                  />
                </View>
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginLeft: 20
                }}
                >
                  <TouchableOpacity style={{
                    alignItems: 'center',
                    backgroundColor: '#9FB0D8',
                    width: 100,
                    height: 30
                  }}
                  >
                    <Text style={{
                      color: '#183F6C',
                      fontWeight: 'bold',
                      fontSize: 20,
                      paddingTop: 3
                    }}
                    >
                      G0 back
                    </Text>
                  </TouchableOpacity>
                  <Text style={{
                    color: '#183F6C',
                    fontWeight: 'bold',
                    fontSize: 35,
                    padding: 10
                  }}
                  >
                      LEGENDARY INTRUDER STYLE HEADLAMP
                  </Text>
                  <Text style={{
                    color: '#2A4F78',
                    fontSize: 20,
                    padding: 10
                  }}
                  >
                    Internal state is not preserved when content scrolls out of the render window.
                    Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.
                  </Text>
                </View>
              </View>
            );
          }
          case 'LIST 3': {
            return (
              <View>
                <View style={{
                  width: DEVICE_WIDTH - 40,
                  height: DEVICE_HEIGHT - 50,
                  flexDirection: 'row',
                  marginHorizontal: 20
                }}
                >
                  <View style={{ flex: 1 }}>
                    <Image
                      style={{
                        flex: 1,
                        resizeMode: 'stretch'
                      }}
                      source={{ uri: item.imageUrl }}
                    />
                  </View>
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 20
                  }}
                  >
                    <View style={{
                      height: 50,
                      flexDirection: 'row'
                    }}
                    >
                      <Text style={{
                        color: '#183F6C',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: 25,
                        padding: 10
                      }}
                      >
                      INTRUDER 150
                      </Text>
                      <Text style={{
                        color: '#183F6C',
                        fontSize: 20,
                        padding: 10
                      }}
                      >
                      Specs
                      </Text>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      height: 35
                    }}
                    >
                      <ListView
                        horizontal
                        dataSource={this.state.dataSource}
                        renderRow={data => (
                          <ButtonWithPlainText
                            title={data}
                            style={{
                              height: 30,
                              borderRadius: 15,
                              backgroundColor: '#9FB0D8',
                              borderColor: '#183F6C',
                              borderWidth: 1,
                              marginRight: 20
                            }}
                            textStyle={{
                              color: '#183F6C', fontSize: 14, padding: 10
                            }}
                            handleSubmit={this._onCompareBtnClicked}
                          />
                        )
                        }
                      />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 14
                          }}
                          >
                        Engine type
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 15
                          }}
                          >
                        4 stoke,1 cylinder,Air-cooled
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Valve System
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        SOHC,2 valve
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Displacement
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        154.9 cm3
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Bore x Stroke
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        14.0 mm x 32.0 mm
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Engine output
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        14.8ps@8000rpm
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Torque
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        14Nm@6000rpm
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Fuel system
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                       Carburater
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Starter system
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        Electric
                          </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontSize: 10
                          }}
                          >
                        Transmission type
                          </Text>
                          <Text style={{
                            color: '#183F6C',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                          >
                        5 speed,MT
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 100, width: DEVICE_WIDTH }} >
                  <View style={{
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                  >
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Text style={{
                        color: '#4E92DF',
                        fontSize: 20,
                        padding: 10
                      }}
                      >Schedule A Test Ride
                      </Text>
                    </TouchableOpacity>
                    <View style={{
                      width: 140,
                      height: 1,
                      alignItems: 'center',
                      backgroundColor: '#79869E'
                    }}
                    />
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 20
                        }}
                        source={downArrow}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }
          case 'LIST 4': {
            return (
              <View>
                <View style={{
                  width: DEVICE_WIDTH - 40,
                  height: DEVICE_HEIGHT - 50,
                  flexDirection: 'row',
                  marginHorizontal: 20
                }}
                >
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 20
                  }}
                  >
                    <Text style={{
                      color: '#183F6C',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: 20
                    }}
                    >
                      Interested in Intruder 150
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    >
                      <View>
                        <TextInput
                          style={{
                            height: 40,
                            borderBottomWidth: 0,
                            width: DEVICE_WIDTH / 5
                          }}
                          onChangeText={text => this.setState({ text })}
                          value={this.state.text}
                          placeholder="standad version"
                        />
                      </View>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'grey',
                        marginRight: 10,
                        marginLeft: 10
                      }}
                      />
                      <Text>Grey</Text>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'black',
                        marginRight: 10,
                        marginLeft: 10
                      }}
                      />
                      <Text>Balck</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text style={{
                        color: 'gray',
                        alignItems: 'center',
                        fontSize: 10
                      }}
                      >
                        On Road Price
                      </Text>
                      <Text style={{
                        color: '#183F6C',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                      }}
                      >
                        Rs. 1,22,000
                      </Text>
                    </View>
                    <TouchableOpacity style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#4E92DF',
                      height: 40,
                      borderRadius: 20,
                      width: 170,
                      marginTop: 10
                    }}
                    >
                      <Text style={{
                        color: '#fff', fontWeight: 'bold', fontSize: 13,
                      }}
                      >
                      Show price breakdown
                      </Text>
                    </TouchableOpacity>
                    <View style={{
                      height: 1,
                      paddingLeft: 20,
                      paddingRight: 40,
                      marginTop: 20,
                      backgroundColor: 'gray',
                    }}
                    />
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}
                    >
                      <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        height: 40,
                        borderRadius: 20,
                        width: 120,
                        marginRight: 10,
                        marginTop: 20,
                        borderColor: '#4E92DF',
                        borderWidth: 1
                      }}
                      >
                        <Text style={{
                          color: '#4E92DF',
                          fontSize: 15,
                          padding: 10
                        }}
                        >
                        Schedule Test Ride
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        height: 40,
                        borderRadius: 20,
                        width: 120,
                        marginRight: 10,
                        marginTop: 20,
                        borderColor: '#4E92DF',
                        borderWidth: 1
                      }}
                      >
                        <Text style={{
                          color: '#4E92DF',
                          fontSize: 15,
                          padding: 10
                        }}
                        >
                      I Want Finance
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        height: 40,
                        borderRadius: 20,
                        width: 120,
                        marginRight: 10,
                        marginTop: 20,
                        borderColor: '#4E92DF',
                        borderWidth: 1
                      }}
                      >
                        <Text style={{
                          color: '#4E92DF',
                          fontSize: 15,
                          padding: 10
                        }}
                        >
                      Add To Compare
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image
                      style={{
                        flex: 1,
                        resizeMode: 'stretch'
                      }}
                      source={{ uri: item.imageUrl }}
                    />
                  </View>
                </View>
                <View style={{
                  height: 100,
                  width: DEVICE_WIDTH
                }}
                >
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Text style={{
                        color: '#4E92DF',
                        fontSize: 20,
                        padding: 10
                      }}
                      >Schedule A Test Ride
                      </Text>
                    </TouchableOpacity>
                    <View style={{
                      width: 140,
                      height: 1,
                      alignItems: 'center',
                      backgroundColor: '#79869E'
                    }}
                    />
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                          marginTop: 20
                        }}
                        source={downArrow}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }
          case 'LIST 5': {
            return (
              <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                height: DEVICE_HEIGHT,
                width: DEVICE_WIDTH - 40,
                marginHorizontal: 20
              }}
              >
                <View style={{
                  flexDirection: 'row',
                  width: (DEVICE_WIDTH / 3) * 2,
                  height: (DEVICE_HEIGHT - 100) / 2,
                }}
                >
                  <View style={{
                    flex: 1,
                    alignItems: 'center'
                  }}
                  >
                    <Image
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        resizeMode: 'stretch'
                      }}
                      source={{ uri: this.state.selectedBike.Imageurl }
                      }
                    />
                  </View>
                  <View style={{
                    flex: 1,
                  }}
                  >
                    <Image
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        resizeMode: 'stretch'
                      }}
                      source={
                        {
                          uri: 'https://d1xq83t889f8oi.cloudfront.net/' +
                        'gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
                        }}
                    />
                  </View>
                </View>
                <View style={{ height: 50 }}>
                  <Text style={{ color: '#007CDA', fontSize: 20, margin: 20 }}>
                    Drag or Tap Any Bike To Compare
                  </Text>
                </View>
                <View style={{
                  height: ((DEVICE_HEIGHT - 100) / 2),
                  width: DEVICE_WIDTH,
                  position: 'absolute',
                  left: 0
                }}
                >
                  <FlatList
                    style={{
                      position: 'absolute',
                      top: DEVICE_HEIGHT / 2
                    }}
                    horizontal
                    keyExtractor={this._vehicleKeyExtractor}
                    data={VEHICLE_DATA}
                    renderItem={this._vehicleRenderItem}
                    extraData={this.state}
                  />
                </View>
              </View>
            );
          }
          case 'LIST 6': {
            return (
              <View style={{
                alignItems: 'center',
                height: DEVICE_HEIGHT,
                marginHorizontal: 20
              }}
              >
                <View style={{
                  flexDirection: 'row',
                  height: DEVICE_HEIGHT / 2,
                }}
                >
                  <View style={{
                    flex: 1,
                  }}
                  >
                    <Image
                      style={{
                        width: ((DEVICE_WIDTH / 4) * 3) / 2,
                        height: (DEVICE_HEIGHT / 2) - 50,
                        resizeMode: 'center'
                      }}
                      source={
                        {
                          uri: 'https://d1xq83t889f8oi.cloudfront.net' +
                        '/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png'
                        }}
                    />
                    <Text style={{
                      color: '#79869E',
                      alignSelf: 'center',
                      fontSize: 20,
                      margin: 20
                    }}
                    >
                      Gixer
                    </Text>
                  </View>
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                  }}
                  >
                    <Image
                      style={{
                        width: ((DEVICE_WIDTH / 4) * 3) / 2,
                        height: (DEVICE_HEIGHT / 2) - 50,
                        resizeMode: 'stretch'
                      }}
                      source={
                        { uri: this.state.selectedBike.Imageurl }}
                    />
                    <Text style={{
                      color: '#79869E',
                      alignSelf: 'center',
                      fontSize: 20,
                      margin: 20
                    }}
                    >
                      {this.state.selectedBike.name}
                    </Text>
                  </View>
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  >
                    <TouchableOpacity onPress={this._addMoreVehicleBtnClicked}>
                      <View style={{
                        backgroundColor: '#E8EDFA',
                        width: ((DEVICE_WIDTH / 3) * 0.6),
                        height: ((DEVICE_HEIGHT / 2) * 0.6),
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      >
                        <Image
                          style={{
                            width: 40,
                            height: 40
                          }}
                          source={AddIcon}
                        />
                        <Text style={{
                          color: '#79869E',
                          alignSelf: 'center',
                        }}
                        >
                      Add 1 more vehicle
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                >
                  <ButtonWithPlainText
                    title=""
                    style={{
                      height: 15,
                      width: 15,
                      borderColor: '#4E92DF',
                      borderWidth: 1,
                      backgroundColor: '#fff'
                    }}
                    handleSubmit={this._onShowDifferenceBtnClicked}
                  />
                  <Text style={{
                    color: '#4E92DF',
                    alignSelf: 'center',
                    fontSize: 15,
                    margin: 10
                  }}
                  >
                      Show Only Differences
                  </Text>
                </View>
                <ButtonWithPlainText
                  title="Compare Models"
                  style={{
                    height: 50,
                    borderRadius: 25,
                    width: 160,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  handleSubmit={this._onCompareBtnClicked}
                />
                <TouchableOpacity
                  style={{
                    width: 60, height: 60, marginTop: 10
                  }}
                  onPress={this._onCloseBtnClicked}
                >
                  <Image
                    source={CloseWithBorder}
                  />
                </TouchableOpacity>
              </View>
            );
          }
          default: {
            return (
              <View style={{
                width: DEVICE_WIDTH,
                height: 200,
                backgroundColor: 'red'
              }}
              >
                <Text>HI</Text>
              </View>
            );
          }
        }
      }
      default:
        return (
          <View />
        );
    }
  };
  render() {
    return (
      <View>
        <SectionList
          scrollEnabled={this.state.shouldScrollSectionList}
          keyExtractor={this.keyExtractor}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          extraData={this.state}
          sections={SECTIONS}
          ref={ref => (this.sectionListRef = ref)}
          onViewableItemsChanged={this.getVisibleItems}
          stickySectionHeadersEnabled
        />
      </View>
    );
  }
}
