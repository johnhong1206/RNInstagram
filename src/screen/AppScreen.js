import React from 'react';
import {AuthProvider} from '../hooks/useAuth';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './StackNavigator';

const AppScreen = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppScreen;
