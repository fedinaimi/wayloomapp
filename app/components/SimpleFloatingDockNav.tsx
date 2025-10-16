import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'home' | 'medication' | 'calendar' | 'caregivers' | 'profile';

interface SimpleFloatingDockNavProps {
  active: TabType;
  onPress: (tab: TabType) => void;
}

interface TabConfig {
  key: TabType;
  icon: string;
  label: string;
}

const tabs: TabConfig[] = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'medication', icon: 'medical', label: 'Medications' },
  { key: 'calendar', icon: 'calendar', label: 'Calendar' },
  { key: 'caregivers', icon: 'people', label: 'Caregivers' },
  { key: 'profile', icon: 'person', label: 'Profile' },
];

const SimpleFloatingDockNav: React.FC<SimpleFloatingDockNavProps> = ({ active, onPress }) => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');
  
  // Responsive sizing based on screen width
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const isLargeScreen = screenWidth >= 414;
  
  const dockConfig = {
    height: isSmallScreen ? 64 : isMediumScreen ? 68 : 72,
    minWidth: isSmallScreen ? 300 : isMediumScreen ? 340 : 380,
    borderRadius: isSmallScreen ? 28 : isMediumScreen ? 30 : 32,
    tabItemHeight: isSmallScreen ? 48 : isMediumScreen ? 52 : 56,
    tabItemActiveWidth: isSmallScreen ? 100 : isMediumScreen ? 110 : 120,
    tabItemInactiveWidth: isSmallScreen ? 44 : isMediumScreen ? 48 : 52,
    iconSize: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
    fontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : 13,
    spacing: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
  };

  const renderTabItem = (tab: TabConfig) => {
    const isActive = tab.key === active;

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onPress(tab.key)}
        accessible={true}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        style={[styles.tabItemContainer, { 
          minWidth: isActive ? dockConfig.tabItemActiveWidth : dockConfig.tabItemInactiveWidth 
        }]}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.tabItem,
            {
              height: dockConfig.tabItemHeight,
              borderRadius: dockConfig.tabItemHeight / 2,
              width: isActive ? dockConfig.tabItemActiveWidth : dockConfig.tabItemInactiveWidth,
              backgroundColor: isActive ? '#007AFF' : 'rgba(255, 255, 255, 0.9)', // Apple blue
              borderWidth: isActive ? 0 : 0.5,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              shadowColor: isActive ? '#007AFF' : 'rgba(0, 0, 0, 0.1)',
              shadowOffset: { width: 0, height: isActive ? 4 : 2 },
              shadowOpacity: isActive ? 0.3 : 0.1,
              shadowRadius: isActive ? 8 : 4,
              elevation: isActive ? 8 : 2,
            },
          ]}
        >
          <Ionicons
            name={tab.icon as any}
            size={dockConfig.iconSize}
            color={isActive ? '#FFFFFF' : '#8E8E93'} // Apple gray
          />
          {isActive && (
            <Text style={[styles.labelText, { 
              fontSize: dockConfig.fontSize,
              marginLeft: 6,
            }]}>
              {tab.label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + (isSmallScreen ? 8 : 10),
          left: isSmallScreen ? 12 : 16,
          right: isSmallScreen ? 12 : 16,
        },
      ]}
    >
      <View style={[
        styles.dock,
        {
          height: dockConfig.height,
          borderRadius: dockConfig.borderRadius,
          minWidth: dockConfig.minWidth,
          paddingHorizontal: dockConfig.spacing,
          paddingVertical: dockConfig.spacing,
        }
      ]}>
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.key}>
            {renderTabItem(tab)}
            {index < tabs.length - 1 && (
              <View style={{ width: dockConfig.spacing }} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
  },
  dock: {
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.85)', // iOS glassmorphism effect
      android: 'rgba(255, 255, 255, 0.95)',
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  labelText: {
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: -0.2, // Apple typography
    fontFamily: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: undefined,
    }),
  },
});

export default SimpleFloatingDockNav;