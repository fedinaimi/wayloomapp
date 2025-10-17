import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import CaregiverFloatingDockNav from '../components/CaregiverFloatingDockNav';
import {
  CaregiverAlertsScreen,
  CaregiverHomeScreen,
  CaregiverPatientsScreen,
  CaregiverRemindersScreen,
  CaregiverSettingsScreen
} from '../screens/caregivers';
import { CaregiverTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<CaregiverTabParamList>();

type CaregiverTabType = 'caregiverHome' | 'caregiverPatients' | 'caregiverAlerts' | 'caregiverReminders' | 'caregiverSettings';

// Map route names to tab types
const routeToTabMap: Record<string, CaregiverTabType> = {
  'CaregiverHome': 'caregiverHome',
  'CaregiverPatients': 'caregiverPatients',
  'CaregiverAlerts': 'caregiverAlerts',
  'CaregiverReminders': 'caregiverReminders',
  'CaregiverSettings': 'caregiverSettings',
};

// Custom tab bar component
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const focusedRoute = state.routes[state.index];
  const activeTab = routeToTabMap[focusedRoute.name] || 'caregiverHome';

  const handleTabPress = (tab: CaregiverTabType) => {
    // Find the route name for this tab
    const routeName = Object.keys(routeToTabMap).find(
      key => routeToTabMap[key] === tab
    );
    
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  return (
    <CaregiverFloatingDockNav
      active={activeTab}
      onPress={handleTabPress}
    />
  );
};

export default function CaregiverTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="CaregiverHome"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="CaregiverHome" 
        component={CaregiverHomeScreen}
      />
      
      <Tab.Screen 
        name="CaregiverPatients" 
        component={CaregiverPatientsScreen}
      />
      
      <Tab.Screen 
        name="CaregiverAlerts" 
        component={CaregiverAlertsScreen}
      />
      
      <Tab.Screen 
        name="CaregiverReminders" 
        component={CaregiverRemindersScreen}
      />
      
      <Tab.Screen 
        name="CaregiverSettings" 
        component={CaregiverSettingsScreen}
      />
    </Tab.Navigator>
  );
}