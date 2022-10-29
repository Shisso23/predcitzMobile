import 'react-native-gesture-handler';

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';

const Root = () => (
  <Provider store={store}>
    <App />
    <Toast ref={ref => Toast.setRef(ref)} />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
