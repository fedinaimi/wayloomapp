import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import SimpleFloatingDockNav from '../components/SimpleFloatingDockNav';
import ExercisesScreen from '../screens/ExercisesScreen';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SafetyScreen from '../screens/SafetyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MainTabParamList } from '../types/navigation';
import { WellnessTheme } from '../utils/wellnessTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabType = 'home' | 'exercises' | 'results' | 'safety' | 'settings';

// Map route names to tab types
const routeToTabMap: Record<string, TabType> = {
  'Home': 'home',
  'Exercises': 'exercises',
  'Results': 'results',
  'Safety': 'safety',
  'Settings': 'settings',
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
          name="Exercises" 
          component={ExercisesScreen}
        />
        <Tab.Screen 
          name="Results" 
          component={ResultsScreen}
        />
        <Tab.Screen 
          name="Safety" 
          component={SafetyScreen}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
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