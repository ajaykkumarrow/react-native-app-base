import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Modal
} from 'react-native';
import Bar from './Bars';
import styles from './styles';

const Loader = props => (
  <Modal
    transparent
    animationType="none"
    visible={props.loading}
    onRequestClose={() => {}}
    style={{ opacity: 0 }} >
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <View style={[styles.container, styles.horizontal, { opacity: props.loading ? 1 : 0 }]}>
          <Bar
            style={{ opacity: props.loading ? 1 : 0 }}
            size={10}
            colors={['#dd381c', '#f95303', '#f65f05', '#ef8700', '#fa8f1a']}
            />
          <View />
        </View>
      </View>
    </View>
  </Modal>
);

Loader.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default Loader;
