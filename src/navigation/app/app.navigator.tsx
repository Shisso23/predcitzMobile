import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {AppStackList} from './types';
import WelcomeScreen from '../../screens/welcome';
import ThankYouScreen from '../../screens/thank-you.screen';
import FixtureDetailsScreen from '../../screens/fixtureDetails.screen';

const AppStack = createStackNavigator<AppStackList>();

const AppNavigator = () => {
  return (
    <AppStack.Navigator screenOptions={{}}>
      <AppStack.Screen name="home" component={WelcomeScreen} />
      <AppStack.Screen name="fixtureDetails" component={FixtureDetailsScreen} />
      <AppStack.Screen name="thankyou" component={ThankYouScreen} />
    </AppStack.Navigator>
  );
};
export default AppNavigator;
