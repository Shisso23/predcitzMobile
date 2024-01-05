import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {AppStackList} from './types';
import PredictScreen from '../../screens/predict.screen';
import ThankYouScreen from '../../screens/thank-you.screen';
import FixtureDetailsScreen from '../../screens/fixtureDetails.screen';
import HomeScreen from '../../screens/Home';

const AppStack = createStackNavigator<AppStackList>();

const AppNavigator = () => {
  return (
    <AppStack.Navigator screenOptions={{}} initialRouteName="home">
      <AppStack.Screen name="home" component={HomeScreen} />
      <AppStack.Screen
        name="predict"
        component={PredictScreen}
        options={{headerLeft: () => null}}
      />
      <AppStack.Screen name="fixtureDetails" component={FixtureDetailsScreen} />
      <AppStack.Screen name="thankyou" component={ThankYouScreen} />
    </AppStack.Navigator>
  );
};
export default AppNavigator;
