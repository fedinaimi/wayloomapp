import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WellnessTheme } from '../utils/wellnessTheme';

interface CaregiverHeaderProps {
  caregiverName?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

const CaregiverHeader: React.FC<CaregiverHeaderProps> = ({
  caregiverName = 'Alex',
  notificationCount = 0,
  onNotificationPress
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.avatarText}>
            {caregiverName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
        <Ionicons name="notifications" size={24} color={WellnessTheme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.sm,
    paddingBottom: WellnessTheme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...WellnessTheme.shadows.sm,
  },
  avatarText: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
  notificationButton: {
    position: 'relative',
    padding: WellnessTheme.spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: WellnessTheme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
});

export default CaregiverHeader;