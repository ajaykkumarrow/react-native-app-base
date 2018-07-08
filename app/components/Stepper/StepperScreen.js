import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styles from './stepperStyles';

const Stepper = props => {
  const { position } = props;
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.detailImage}>
          <View style={position >= 0 ? [styles.circle, styles.inProgress] : styles.circle}>
            <Text style={position >= 0 ? [styles.circleText, styles.modifyPositionText] : styles.circleText}>01</Text>
          </View>
          <Text style={position >= 0 ? [styles.title, styles.modifyText] : styles.title}>Basic Details</Text>
        </View>

        <View style={styles.progress}>
          <View style={position >= 1 ? [styles.bar, styles.inProgress] : styles.bar} />
        </View>

        <View style={styles.detailImage}>
          <View style={position >= 1 ? [styles.circle, styles.inProgress] : styles.circle}>
            <Text style={position >= 1 ? [styles.circleText, styles.modifyPositionText] : styles.circleText}>02</Text>
          </View>
          <Text style={position >= 1 ? [styles.title, styles.modifyText] : styles.title}>Type</Text>
        </View>

        <View style={styles.progress2}>
          <View style={position === 2 ? [styles.bar, styles.inProgress] : styles.bar} />
        </View>

        <View style={styles.detailImage}>
          <View style={position === 2 ? [styles.circle, styles.inProgress] : styles.circle}>
            <Text style={position === 2 ? [styles.circleText, styles.modifyPositionText] : styles.circleText}>03</Text>
          </View>
          <Text style={position === 2 ? [styles.title, styles.modifyText] : styles.title}>Budget</Text>
        </View>
      </View>
    </View>
  );
};

Stepper.propTypes = {
  position: PropTypes.number.isRequired
};

export default Stepper;
