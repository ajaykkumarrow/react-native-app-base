import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import expandableTileStyles from './expandableTileStyles';
import { HorizontalTouchableTextTile, HorizontalImageTextTile } from '../../components/tile/Tile';

class ExpandableTile extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      showBikeView: false,
      showDetailedBikeView: false,
      showScooterDetailedView: false,
    };
  }

  summaryTileClick = () => {
    this.setState({
      showBikeView: !(this.state.showBikeView),
      showDetailedBikeView: false,
      showScooterDetailedView: false

    });
  }

  bikeDetailClick = () => {
    this.setState({
      showDetailedBikeView: !(this.state.showDetailedBikeView),
      showScooterDetailedView: false
    });
  }

  scooterDetailClick = () => {
    this.setState({
      showScooterDetailedView: !(this.state.showScooterDetailedView),
      showDetailedBikeView: false
    });
  }

  changeUnitSoldStyle() {
    if (this.state.showBikeView) {
      return expandableTileStyles.unitSoldSelectedStyle;
    }
  }

  changeUnitSoldTextColor() {
    if (this.state.showBikeView) {
      return expandableTileStyles.unitSoldSelectedTextStyle;
    }
  }

  changeBikeDetailView() {
    if (this.state.showDetailedBikeView) {
      return expandableTileStyles.bikeDetailStyle;
    }
  }

  changeBikeDetailTextColor() {
    if (this.state.showDetailedBikeView) {
      return expandableTileStyles.bikeDetailTextStyle;
    }
  }

  changeScooterTileColor() {
    if (this.state.showDetailedBikeView) {
      return expandableTileStyles.scooterTileStyle;
    } else if (this.state.showScooterDetailedView) {
      return expandableTileStyles.bikeDetailStyle;
    }
  }

  changeScooterTextColor() {
    if (this.state.showScooterDetailedView) {
      return expandableTileStyles.bikeDetailTextStyle;
    }
  }

  showDetailedBikeView() {
    return (
      <ScrollView horizontal style={{ width: 400 }}>
        {
          this.props.data.map(item => (
            <HorizontalImageTextTile
              key={item}
              tileText={item.titleText}
              tileCount={item.titleCount}
              tileStyle={expandableTileStyles.tileWidth}
            />
          ))
        }
      </ScrollView>
    );
  }

  showBikeView() {
    if (this.state.showBikeView) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <HorizontalTouchableTextTile
            tileText={'Bikes\nSold'}
            tileTotalCount="/40"
            tileUserCount="20"
            tileClick={this.bikeDetailClick}
            tileStyle={this.changeBikeDetailView()}
            textStyle={this.changeBikeDetailTextColor()}
          />
          {
            this.state.showDetailedBikeView ? this.showDetailedBikeView() : null
          }
          <HorizontalTouchableTextTile
            tileText={'Scooters\nSold'}
            tileTotalCount="/40"
            tileUserCount="20"
            tileClick={this.scooterDetailClick}
            tileStyle={this.changeScooterTileColor()}
            textStyle={this.changeScooterTextColor()}
          />
          {
            this.state.showScooterDetailedView ? this.showDetailedBikeView() : null
          }
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <HorizontalTouchableTextTile
          tileText={'Units\nsold'}
          tileClick={this.summaryTileClick}
          tileTotalCount="/70"
          tileUserCount="30"
          tileStyle={this.changeUnitSoldStyle()}
          textStyle={this.changeUnitSoldTextColor()}
        />
        {this.showBikeView()}
      </View>
    );
  }
}

export default ExpandableTile;
