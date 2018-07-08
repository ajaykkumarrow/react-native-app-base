import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

export default class FadeInView extends React.Component {
    static propTypes = {
      style: PropTypes.object,
      children: PropTypes.any.isRequired,
      duration: PropTypes.number.isRequired,
      delay: PropTypes.number,
      springValue: PropTypes.number,
      fadeIn: PropTypes.bool
    }

    static defaultProps = {
      style: PropTypes.object,
      delay: 0,
      springValue: 0.8,
      fadeIn: true
    }

    constructor(props) {
      super(props);
      this.state = {
        fadeAnim: new Animated.Value(0),
      };
      this.springValue = new Animated.Value(this.props.springValue || 0.9);
    }

    animateTo = () => {
      const { delay } = this.props;
      Animated.parallel([
        Animated.delay(delay || 0),
        Animated.spring(
          this.springValue,
          {
            toValue: 1,
            friction: 5
          }
        ),
        Animated.timing(
          this.state.fadeAnim,
          {
            toValue: 1,
            duration: this.props.duration,
          }
        )
      ]).start();
    }

    render() {
      const { fadeAnim } = this.state;
      const { fadeIn } = this.props;
      this.animateTo();
      return (
        <Animated.View
          style={
            [this.props.style, {
              opacity: fadeIn ? fadeAnim : 1,
              transform: [{ scale: this.springValue }]
            }]
          }>
          {this.props.children}
        </Animated.View>
      );
    }
}

