import React from 'react';
import {Platform} from 'react-native';
import AppContainer from './src/navigation/root.navigator';
import DeviceInfo from 'react-native-device-info';
import flashService from './src/services/flash-service/flash.service';

const App = () => {
  return <AppContainer />;
};

export default App;
