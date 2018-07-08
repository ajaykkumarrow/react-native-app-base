import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './app/App';
import configureStore from './app/redux/store';

const store = configureStore();

export default class InstaBikeApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('InstaBike', () => InstaBikeApp);
