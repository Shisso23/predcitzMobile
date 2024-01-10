import 'react-native-gesture-handler';
import {PersistGate} from 'redux-persist/integration/react';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import {persistor} from './src/redux/configureStore';

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toast ref={ref => Toast.setRef(ref)} />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
