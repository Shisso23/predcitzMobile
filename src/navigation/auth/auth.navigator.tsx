import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import userInfoScreen from '../../screens/user-info.screen';

import {AuthStackList} from './types';

const AuthStack = createStackNavigator<AuthStackList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen
        name="auth"
        component={userInfoScreen}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};
export default AuthNavigator;
