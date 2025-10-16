import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import SimpleFloatingDockNav from '../components/SimpleFloatingDockNav';
import CalendarScreen from '../screens/CalendarScreen';
import CaregiversScreen from '../screens/CaregiversScreen';
import HomeScreen from '../screens/HomeScreen';
import MedicationsScreen from '../screens/MedicationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MainTabParamList } from '../types/navigation';
import { WellnessTheme } from '../utils/wellnessTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabType = 'home' | 'medication' | 'calendar' | 'caregivers' | 'profile';

// Map route names to tab types
const routeToTabMap: Record<string, TabType> = {
  'Home': 'home',
  'Medications': 'medication',
  'Calendar': 'calendar',
  'Caregivers': 'caregivers',
  'Profile': 'profile',
};

// Custom tab bar component
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const focusedRoute = state.routes[state.index];
  const activeTab = routeToTabMap[focusedRoute.name] || 'home';

  const handleTabPress = (tab: TabType) => {
    // Find the route name for this tab
    const routeName = Object.keys(routeToTabMap).find(
      key => routeToTabMap[key] === tab
    );
    
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  return (
    <SimpleFloatingDockNav
      active={activeTab}
      onPress={handleTabPress}
    />
  );
};

export default function MainTabNavigator() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Tab.Screen 
          name="Medications" 
          component={MedicationsScreen}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen}
        />
        <Tab.Screen 
          name="Caregivers" 
          component={CaregiversScreen}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
});