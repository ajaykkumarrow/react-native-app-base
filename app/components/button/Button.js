import React from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { TouchableOpacity, Text, View, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import styles from './buttonStyles';

/**
 * Pass a style props if customisation is required
 */
export const ButtonWithPlainText = props => (
  <TouchableOpacity
    style={[styles.plainButton, props.style]}
    onPress={props.handleSubmit}
    activeOpacity={0.5}
  >
    <Text style={[styles.textColor, props.textStyle]}>{ props.title }</Text>
  </TouchableOpacity>
);

ButtonWithPlainText.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array
  ])
};

ButtonWithPlainText.defaultProps = {
  style: null,
  textStyle: null
};

/**
 * Pass a style props if customisation is required
 */
export const GradientButtonLarge = props => (
  <Ripple
    style={props.style}
    activeOpacity={0.5}
    disabled={props.disabled}
    onPress={props.handleSubmit}>
    <LinearGradient
      colors={props.colors || ['#ff8e3e', '#ff743f', '#fd5742', '#fb4645']}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{
        height: 50,
        width: 300,
        justifyContent: 'center',
        borderRadius: 4,
      }}>
      {
          props.loading &&
          <ActivityIndicator color="#ffffff" style={props.loaderStyle || styles.loading} />
        }
      <Text
        style={[styles.buttonLargeText, props.loading ? props.loadingTextStyle : {}]}
      >{props.loading ? props.loadingText : props.title}
      </Text>
    </LinearGradient>
  </Ripple>
);

GradientButtonLarge.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool,
  colors: PropTypes.array,
  loading: PropTypes.bool,
  loaderStyle: PropTypes.object,
  loadingTextStyle: PropTypes.object,
  loadingText: PropTypes.string
};

GradientButtonLarge.defaultProps = {
  style: null,
  disabled: false,
  colors: null,
  loading: false,
  loaderStyle: null,
  loadingTextStyle: {},
  loadingText: 'loading...'
};

export const MediumButton = props => (
  <Ripple
    onPress={props.handleSubmit}
    activeOpacity={0.5}>
    <LinearGradient
      colors={props.colors || ['#f16537', '#f79426']}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{
        height: 30,
        width: 80,
        justifyContent: 'center',
        borderRadius: 4,
      }}>
      <ActivityIndicator animating={props.loading} color="#ffffff" style={[props.loadingStyle, styles.loading]} />
      <Text
        style={styles.buttonMediumText}
      >{props.title}
      </Text>
    </LinearGradient>
  </Ripple>
);

MediumButton.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingStyle: PropTypes.object,
  colors: PropTypes.array
};

MediumButton.defaultProps = {
  loading: null,
  loadingStyle: null,
  colors: null
};

export const BookTestRideButton = props => (
  <Ripple
    onPress={props.handleSubmit}
    activeOpacity={0.5}
    disabled={props.disabled}>
    <LinearGradient
      colors={props.colors || ['#ff8e3e', '#ff743f', '#fd5742', '#fb4645']}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={[{
        opacity: props.disabled ? 0.8 : 1,
        height: 35,
        width: 130,
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'transparent'
      }, props.customStyles]}>
      <ActivityIndicator animating={props.loading} color="#ffffff" style={[props.loadingStyle, styles.loading]} />
      <Text
        style={[styles.bookTestRideButtonText, props.customTextStyles]}
      >{props.title}
      </Text>
    </LinearGradient>
  </Ripple>
);

BookTestRideButton.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  colors: PropTypes.array,
  loading: PropTypes.bool,
  loadingStyle: PropTypes.object,
  customStyles: PropTypes.number,
  customTextStyles: PropTypes.number
};
BookTestRideButton.defaultProps = {
  disabled: false,
  colors: null,
  loading: false,
  loadingStyle: null,
  customStyles: null,
  customTextStyles: null
};
export const ButtonWithLeftImage = props => (
  <TouchableOpacity
    onPress={props.handleSubmit}
    style={[styles.buttonStyles, styles.alignRow, props.style]}
    activeOpacity={0.5}
  >
    <Image source={props.image} style={props.imageStyle} />
    <Text style={[styles.textStyle, props.textStyle]}> { props.title }</Text>
  </TouchableOpacity>
);

ButtonWithLeftImage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array
  ]),
  imageStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ])
};

ButtonWithLeftImage.defaultProps = {
  image: null,
  style: null,
  textStyle: null,
  imageStyle: null
};

export const ButtonWithRightImage = props => (
  <TouchableOpacity
    onPress={props.handleSubmit}
    style={[styles.buttonStyles, styles.alignRow, props.style]}
    activeOpacity={0.5}
  >
    <Text style={[styles.textStyle, props.textStyle]}>{props.title} </Text>
    <Image source={props.image} />
  </TouchableOpacity>
);

ButtonWithRightImage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ])
};

ButtonWithRightImage.defaultProps = {
  image: null,
  style: null,
  textStyle: null
};

export const ButtonHighlightWithPlainText = props => (
  <TouchableHighlight
    underlayColor="#EAF2FE"
    style={[styles.bgColor, props.style]}
    onPress={props.handleSubmit}
  >
    <Text style={[styles.textColor, props.textStyle]}>{ props.title }</Text>
  </TouchableHighlight>
);

ButtonHighlightWithPlainText.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  handleSubmit: PropTypes.func.isRequired,
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  title: PropTypes.string.isRequired
};

ButtonHighlightWithPlainText.defaultProps = {
  style: {},
  textStyle: {}
};

export const ButtonWithRightImageForDropdown = props => (
  <View>
    <TouchableOpacity
      onPress={props.handleSubmit}
      style={props.style}
      activeOpacity={0.9}
    >
      <Text
        style={props.textStyle}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {props.title}
      </Text>
      <Image source={props.image} style={props.imageStyle} />
    </TouchableOpacity>
  </View>
);

ButtonWithRightImageForDropdown.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]),
  image: PropTypes.number.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  imageStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ])
};

ButtonWithRightImageForDropdown.defaultProps = {
  style: null,
  imageStyle: null,
  textStyle: null
};

export const ButtonWithTopImage = props => (
  <TouchableOpacity
    onPress={props.handleSubmit}
    style={[styles.buttonStyles, styles.alignColumn]}
    activeOpacity={0.9}
  >
    <Image source={props.image} />
    <Text style={styles.textStyle}>{props.title}</Text>
  </TouchableOpacity>
);

ButtonWithTopImage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number,
};

ButtonWithTopImage.defaultProps = {
  image: null,
};

export const RoundButtonText = props => (
  <TouchableOpacity style={styles.roundButtonStyle}>
    <Text style={styles.roundButtonLeftTextStyle}>{props.count}</Text>
    <Text style={styles.roundButtonRightTextStyle}>{props.title}</Text>
  </TouchableOpacity>
);

RoundButtonText.propTypes = {
  count: PropTypes.string,
  title: PropTypes.string
};

RoundButtonText.defaultProps = {
  count: '',
  title: ''
};

export const CheckboxWithText = props => {
  const onButtonSelect = button => {
    props.selectedCheckboxButtonValue(button);
  };
  return (
    <View style={[styles.alignRow, props.style]}>
      {
        props.data.map(eachButton => (
          <TouchableOpacity key={eachButton.id} onPress={() => onButtonSelect(eachButton)}>
            <View style={
              [
                styles.alignRowAndJustifyStart,
                props.eachRowStyle,
                props.eachColumnStyle
              ]
            }
            >
              <View style={[styles.activeCheckboxWrapper, { left: 5 }]}>
                {
                  props.activeCheckboxButton.map(eachVal => (
                    (eachButton.id === eachVal.id) ?
                      <View
                        key={eachVal.id}
                        style={styles.activeCheckbox}
                      />
                      :
                      null
                  ))
                }
              </View>
              <Text style={[styles.marginLeft10, props.textStyle]}>{eachButton.text}</Text>
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
  );
};

CheckboxWithText.defaultProps = {
  data: [],
  activeCheckboxButton: [],
  selectedCheckboxButtonValue: [],
  style: null,
  eachRowStyle: null,
  eachColumnStyle: null,
  textStyle: null
};

CheckboxWithText.propTypes = {
  data: PropTypes.array,
  activeCheckboxButton: PropTypes.array,
  selectedCheckboxButtonValue: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  eachRowStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]),
  eachColumnStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ])
};
