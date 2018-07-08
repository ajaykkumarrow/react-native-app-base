import React from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, TouchableWithoutFeedback, Image, Text } from 'react-native';
import { imageTextStyles, horizontalImageTextStyles,
  horizontalTextStyles, tileStyles, gradientCountTile } from './tileStyles';
import fonts from '../../theme/fonts';

export const ImageTextTile = ({
  tile, tileClick, tileColor, selected, icon, type
}) => (
  <TouchableOpacity onPress={tileClick}>
    <View style={[imageTextStyles.container, tileColor]}>
      { type === 'Feather' &&
        <Feather name={icon} size={15} color={selected ? 'white' : '#827773'} />
       }
      { type === 'MaterialCommunityIcons' &&
        <MaterialCommunityIcon name={icon} size={15} color={selected ? 'white' : '#827773'} />
       }
      { type === 'SimpleLineIcons' &&
        <SimpleLineIcon name={icon} size={15} color={selected ? 'white' : '#827773'} />
       }
      { type === 'FontAwesome' &&
        <FontAwesome name={icon} size={15} color={selected ? 'white' : '#827773'} />
       }
      { type === 'MaterialIcons' &&
        <MaterialIcon name={icon} size={15} color={selected ? 'white' : '#827773'} />
       }
      <Text style={{
        fontSize: 11,
        marginTop: 5,
        alignSelf: 'center',
        color: selected ? 'white' : '#827773',
        textAlign: 'center',
        fontFamily: fonts.sourceSansProRegular
      }}
      >{tile.name}
      </Text>
    </View>
  </TouchableOpacity>
);

ImageTextTile.propTypes = {
  tileColor: PropTypes.number,
  tile: PropTypes.object.isRequired,
  tileClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired
};

ImageTextTile.defaultProps = {
  tileColor: null,
};

export const HorizontalTextTile = ({ tileText, tileValue, tileStyle }) => (
  <View style={[horizontalTextStyles.container, tileStyle]}>
    <Text style={[horizontalTextStyles.leftTextStyle]}>{tileValue}</Text>
    <Text style={[horizontalTextStyles.rightTextStyle]}>{tileText}</Text>
  </View>
);

HorizontalTextTile.propTypes = {
  tileText: PropTypes.string,
  tileValue: PropTypes.string,
  tileStyle: PropTypes.number
};

HorizontalTextTile.defaultProps = {
  tileText: ' ',
  tileValue: ' ',
  tileStyle: null
};

export const HorizontalTouchableTextTile = ({
  tileText, tileTotalCount, tileUserCount, tileStyle, textStyle, tileClick
}) => (
  <TouchableWithoutFeedback onPress={tileClick}>
    <View style={[horizontalTextStyles.container, tileStyle]}>
      <Text style={[horizontalTextStyles.leftTextStyle, textStyle]}>{tileUserCount}<Text>{tileTotalCount}</Text></Text>
      <Text style={[horizontalTextStyles.rightTextStyle, textStyle]}>{tileText}</Text>
    </View>
  </TouchableWithoutFeedback>
);

HorizontalTouchableTextTile.propTypes = {
  tileText: PropTypes.string,
  tileTotalCount: PropTypes.string,
  tileUserCount: PropTypes.string,
  tileStyle: PropTypes.number,
  textStyle: PropTypes.number,
  tileClick: PropTypes.func
};

HorizontalTouchableTextTile.defaultProps = {
  tileText: '',
  tileUserCount: '',
  tileTotalCount: '',
  tileStyle: null,
  textStyle: null,
  tileClick: ' '
};

export const HorizontalImageTextTile = ({ tileText, tileStyle, tileCount }) => (
  <View style={[horizontalImageTextStyles.container, tileStyle]}>
    <View style={horizontalImageTextStyles.circle} />
    <View style={horizontalImageTextStyles.rightContainer}>
      <Text style={horizontalImageTextStyles.rightTextStyle}>{tileText}</Text>
      <Text style={horizontalImageTextStyles.countTextStyle}>{tileCount}</Text>
    </View>
  </View>
);

HorizontalImageTextTile.propTypes = {
  tileText: PropTypes.string,
  tileStyle: PropTypes.number,
  tileCount: PropTypes.string
};

HorizontalImageTextTile.defaultProps = {
  tileText: '',
  tileStyle: null,
  tileCount: ''
};

export const CardTile = props => {
  let colorOfTile;
  if (props.data.length === 1) {
    colorOfTile = tileStyles.darkTile;
  } else {
    colorOfTile = tileStyles.lightTile;
  }

  return (
    <View style={[tileStyles.cardTile, colorOfTile]}>
      {props.data.map(text => (<Text key={text.id} style={tileStyles.textSize}>{text.name}</Text>))}
    </View>
  );
};

CardTile.defaultProps = {
  data: [],
};

CardTile.propTypes = {
  data: PropTypes.array
};

export const LinearGradientTile = props => (
  <TouchableOpacity
    onPress={props.handleSubmit}
    activeOpacity={0.5}>
    <LinearGradient
      colors={[props.startColor, props.endColor]}
      style={{
        width: 153,
        height: 52.5,
        borderRadius: 3,
        justifyContent: 'space-between',
        alignContent: 'center'
      }}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#FFF',
          paddingTop: 10,
          paddingLeft: 10,
          alignSelf: 'flex-start',
          textAlign: 'center',
          fontFamily: 'SourceSansPro-Semibold'
        }}
      >{props.count}
      </Text>
      <Text
        style={{
          fontSize: 12,
          paddingBottom: 10,
          paddingRight: 10,
          fontWeight: 'bold',
          color: '#FFF',
          alignSelf: 'flex-end',
          textAlign: 'center',
          fontFamily: 'SourceSansPro-Semibold'
        }}
      >{props.text1} {props.text2}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

LinearGradientTile.propTypes = {
  startColor: PropTypes.string.isRequired,
  endColor: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func
};

LinearGradientTile.defaultProps = {
  handleSubmit: null
};

export const GradientCountTile = props => (
  <LinearGradient
    colors={props.colors}
    style={[gradientCountTile.container, props.style]}
    key={props.id}>
    <TouchableOpacity
      onPress={() => { if (props.onClick) props.onClick(); }}
      style={{ flex: 1 }}>
      <View style={gradientCountTile.tileView}>
        <View style={{
          flex: props.hasDivide ? 5 : 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {
            props.hasImage &&
            <Image
              source={props.imgSrc}
              resizeMode="contain"
              style={[props.imgStyle || {}]} />
          }
          <Text style={[gradientCountTile.innerTextStyle, props.textStyle]}>{props.tileText}</Text>
        </View>
        <View style={[gradientCountTile.content, { flex: props.hasDivide ? 5 : 4 }]} >
          {
            !props.hasDivide ?
              <Text style={[gradientCountTile.countStyle, props.countStyle]}>
                {props.tileCount}
              </Text>
              :
              <View style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Text style={[gradientCountTile.tileTextStyle, props.countStyle]}>
                    {props.tileCount.split('/') && props.tileCount.split('/')[0]}/
                  </Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Text style={[gradientCountTile.secondCountStyle, props.countStyle]}>
                    {props.tileCount.split('/') && props.tileCount.split('/')[1]}
                  </Text>
                </View>
              </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  </LinearGradient>
);

GradientCountTile.propTypes = {
  colors: PropTypes.array.isRequired,
  tileCount: PropTypes.string.isRequired,
  tileText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.any.isRequired,
  style: PropTypes.object,
  countStyle: PropTypes.object,
  textStyle: PropTypes.object,
  hasDivide: PropTypes.bool,
  hasImage: PropTypes.bool,
  imgSrc: PropTypes.any,
  imgStyle: PropTypes.object
};

GradientCountTile.defaultProps = {
  style: null,
  countStyle: null,
  textStyle: null,
  hasDivide: false,
  hasImage: false,
  imgSrc: null,
  imgStyle: {}
};
