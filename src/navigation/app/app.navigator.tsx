import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {AppStackList} from './types';
import WelcomeScreen from '../../screens/welcome';
import ThankYouScreen from '../../screens/thank-you.screen';

const AppStack = createStackNavigator<AppStackList>();

const AppNavigator = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="home" component={WelcomeScreen} />
      <AppStack.Screen name="thankyou" component={ThankYouScreen} />
    </AppStack.Navigator>
  );
};
export default AppNavigator;
