import React, { Component } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { ImageTextTile } from '../../components/tile/Tile';
import sideNavStyles from './sideNavStyles';
import { toggleSideNav } from '../../redux/actions/Global/actionCreators';
import FromTopView from '../../components//animated/FromTopView';

const DEVICE_HEIGHT = Dimensions.get('window').height;

@connect(state => ({
  isSideNavOpen: state.global.isSideNavOpen
}), {
  toggleSideNav
})
class SideNav extends Component {
  static propTypes = {
    tileData: PropTypes.array.isRequired,
    selectedTile: PropTypes.number.isRequired,
    toggleSideNav: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTiles = () => (
    <View>
      {
        this.props.tileData.map(item => {
          const selectedTile = (this.props.selectedTile === item.id);
          return (
            <View
              style={sideNavStyles.tile}
              key={item.id}
            >
              <View style={sideNavStyles.tileContainer}>
                <LinearGradient
                  colors={selectedTile ?
                    ['#ef563c', '#f3842d'] :
                    ['#383737', '#383737']
                    }
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={[sideNavStyles.tileGradientBorder, {
                    borderRadius: selectedTile ? 4 : 0
                  }]}
                />
              </View>
              <View style={sideNavStyles.tileImage}>
                <LinearGradient
                  colors={selectedTile ? ['#5f5f64', '#3e3d3e'] : ['#383737', '#383737']}
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={sideNavStyles.tileGradientText}
                >
                  <ImageTextTile
                    selected={selectedTile}
                    key={item.id}
                    type={item.type}
                    tile={item}
                    icon={item.icon}
                    tileImage={item.image}
                    tileClick={() => item.handleSubmit(item.id)}
                  />
                </LinearGradient>
              </View>
            </View>
          );
        })
      }
    </View>
  )

  render() {
    return (
      <View style={[sideNavStyles.container]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            this.props.toggleSideNav();
          }
          }>
          <LinearGradient
            colors={
            ['#34312f', '#11100f']}
            style={sideNavStyles.gradient}>
            <View style={{ flex: 1 }} >
              <Image
                style={sideNavStyles.image}
                resizeMode="stretch"
                source={require('../../assets/images/suzuki_logo.png')}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <FromTopView
            initialValue={-DEVICE_HEIGHT}
            toValue={0}
            duration={200}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.renderTiles()}
            </ScrollView>
          </FromTopView>
        </View>
      </View>
    );
  }
}

export default SideNav;
