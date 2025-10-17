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

type TabType = 'home' | 'exercises' | 'results' | 'safety' | 'settings';

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
  { key: 'exercises', icon: 'fitness', label: 'Exercises' },
  { key: 'results', icon: 'analytics', label: 'Results' },
  { key: 'safety', icon: 'shield-checkmark', label: 'Safety' },
  { key: 'settings', icon: 'settings', label: 'Settings' },
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
              backgroundColor: isActive ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderWidth: isActive ? 1 : 0,
              borderColor: isActive ? 'rgba(139, 92, 246, 0.4)' : 'transparent',
              shadowColor: isActive ? '#8B5CF6' : 'transparent',
              shadowOffset: { width: 0, height: isActive ? 4 : 0 },
              shadowOpacity: isActive ? 0.3 : 0,
              shadowRadius: isActive ? 8 : 0,
              elevation: isActive ? 8 : 0,
            },
          ]}
        >
          <Ionicons
            name={tab.icon as any}
            size={dockConfig.iconSize}
            color={isActive ? '#8B5CF6' : '#6B7280'} // Better contrast with more opaque background
          />
          {isActive && (
            <Text style={[styles.labelText, { 
              fontSize: dockConfig.fontSize,
              marginLeft: 6,
              color: '#8B5CF6',
              fontWeight: '600',
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
      {/* Solid backdrop to prevent any content showing through */}
      <View style={[
        styles.backdrop,
        {
          borderTopLeftRadius: dockConfig.borderRadius,
          borderTopRightRadius: dockConfig.borderRadius,
        }
      ]} />
      
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
  backdrop: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    right: -10,
    height: 40,
    backgroundColor: '#F8FAFC', // Match HomeScreen background color

    zIndex: -1,
  },
  dock: {
    backgroundColor: '#FFFFFF', // Completely solid white background - 0% transparency
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Minimal shadow - much smaller and subtle
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
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