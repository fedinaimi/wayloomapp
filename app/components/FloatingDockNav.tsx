import React, { useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TabType = 'home' | 'medication' | 'calendar' | 'caregivers' | 'profile';

interface FloatingDockNavProps {
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
  { key: 'medication', icon: 'pill', label: 'Medications' },
  { key: 'calendar', icon: 'calendar-clock', label: 'Calendar' },
  { key: 'caregivers', icon: 'account-group', label: 'Caregivers' },
  { key: 'profile', icon: 'account', label: 'Profile' },
];

const FloatingDockNav: React.FC<FloatingDockNavProps> = ({ active, onPress }) => {
  const insets = useSafeAreaInsets();
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({});
  const scaleValues = useRef<{ [key: string]: Animated.Value }>({});

  // Initialize animated values for all tabs
  React.useEffect(() => {
    tabs.forEach((tab) => {
      if (!animatedValues.current[tab.key]) {
        animatedValues.current[tab.key] = new Animated.Value(tab.key === active ? 1 : 0);
      }
      if (!scaleValues.current[tab.key]) {
        scaleValues.current[tab.key] = new Animated.Value(1);
      }
    });
  }, []);

  // Animate when active tab changes
  React.useEffect(() => {
    tabs.forEach((tab) => {
      const targetValue = tab.key === active ? 1 : 0;
      if (animatedValues.current[tab.key]) {
        Animated.spring(animatedValues.current[tab.key], {
          toValue: targetValue,
          useNativeDriver: true, // Enable native driver for better performance
          tension: 300,
          friction: 35,
        }).start();
      }
    });
  }, [active]);

  const handlePress = (tab: TabType) => {
    // Press animation
    const scaleAnim = scaleValues.current[tab];
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onPress(tab);
  };

  const renderTabItem = (tab: TabConfig) => {
    const isActive = tab.key === active;

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => handlePress(tab.key)}
        accessible={true}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        style={styles.tabItemContainer}
      >
        <View
          style={[
            styles.tabItem,
            {
              width: isActive ? 130 : 56,
              backgroundColor: isActive ? '#8B5CF6' : '#ffffff',
              borderColor: isActive ? '#8B5CF6' : '#E5E7EB',
              borderWidth: isActive ? 0 : 1,
            },
          ]}
        >
          <Icon
            name={tab.icon}
            size={isActive ? 20 : 22}
            color={isActive ? '#ffffff' : '#6B7280'}
          />
          {isActive && (
            <Text style={[styles.labelText, { marginLeft: 8 }]}>
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
          bottom: insets.bottom + 10, // 8-12px above safe area
        },
      ]}
    >
      <View style={styles.dock}>
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.key}>
            {renderTabItem(tab)}
            {index < tabs.length - 1 && <View style={styles.spacer} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16, // 16px outer margin
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  dock: {
    height: 76, // 72-80px range
    backgroundColor: '#FFFFFFE6', // Translucent white
    borderRadius: 30, // 28-32px range
    paddingHorizontal: 10, // 8-12px padding
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    height: 56, // Exact 56px height
    borderRadius: 28, // Fully rounded (56/2)
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  labelContainer: {
    marginLeft: 10, // 8-12px gap between icon and label
  },
  labelText: {
    color: '#ffffff',
    fontSize: 14, // 14sp
    fontWeight: '600', // semi-bold
  },
  spacer: {
    width: 14, // 12-16px gap between items
  },
});

export default FloatingDockNav;