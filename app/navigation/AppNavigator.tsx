import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';
import { WellnessTheme } from '../utils/wellnessTheme';


import {
    CaregiverBasicsScreen,
    OTPVerificationScreen,
    PatientConnectScreen,
    PatientProfileForm,
    PhoneVerificationScreen,
    TestReadinessScreen,
    WelcomeScreen
} from '../screens/auth';

// Main tab navigator
import CaregiverTabNavigator from './CaregiverTabNavigator';
import MainTabNavigator from './MainTabNavigator';

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
        name="PatientProfileForm" 
        component={PatientProfileForm}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="TestReadiness" 
        component={TestReadinessScreen}
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