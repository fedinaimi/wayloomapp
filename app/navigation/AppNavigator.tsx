import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';
import { WellnessTheme } from '../utils/wellnessTheme';

// Auth screens
import SignInScreen from '../screens/SignInScreen';
import ConsentScreen from '../screens/ConsentScreen';

// Main tab navigator
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: WellnessTheme.colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: WellnessTheme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: WellnessTheme.colors.background,
        },
      }}
    >
      {/* Auth Flow */}
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Consent" 
        component={ConsentScreen}
        options={{ 
          title: 'Terms & Privacy',
        }}
      />

      {/* Main App Flow */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}