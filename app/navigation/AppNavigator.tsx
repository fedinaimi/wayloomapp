import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';
import { WellnessTheme } from '../utils/wellnessTheme';


import {
  CaregiverBasicsScreen,
  OTPVerificationScreen,
  PatientBasicsScreen,
  PatientConnectScreen,
  PhoneVerificationScreen,
  WelcomeScreen
} from '../screens/auth';

// Main tab navigator
import MainTabNavigator from './MainTabNavigator';
import CaregiverTabNavigator from './CaregiverTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
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
      {/* New Auth Flow */}
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PhoneVerification" 
        component={PhoneVerificationScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="OTPVerification" 
        component={OTPVerificationScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PatientBasics" 
        component={PatientBasicsScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="CaregiverBasics" 
        component={CaregiverBasicsScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PatientConnect" 
        component={PatientConnectScreen}
        options={{ 
          headerShown: false,
        }}
      />

      {/* Original Auth Flow (keeping for compatibility) */}
     

      {/* Main App Flow */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ 
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="CaregiverTabs" 
        component={CaregiverTabNavigator}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}