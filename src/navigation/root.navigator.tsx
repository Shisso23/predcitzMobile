import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import AuthNavigator from './auth/auth.navigator';
import AppNavigator from './app/app.navigator';
import {userSelector} from '../reducers/user/user.reducer';

const RootStack = createStackNavigator();

const AppContainer: React.FC = () => {
  const {username} = useSelector(userSelector);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {username.length > 0 ? (
          <RootStack.Screen name="APP" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="AUTH" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
console.log({AppContainer});
export default AppContainer;
