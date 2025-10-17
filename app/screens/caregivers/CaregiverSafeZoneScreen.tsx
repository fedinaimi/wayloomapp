import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CaregiverHeader from '../../components/CaregiverHeader';
import CaregiverGreetingSection from '../../components/CaregiverGreetingSection';
import { WellnessTheme } from '../../utils/wellnessTheme';

// Mock patient location data
const mockPatientLocation = {
  latitude: 37.78825,
  longitude: -122.4324,
  address: "123 Main Street, San Francisco, CA"
};

// Mock safe zones data
const mockSafeZones = [
  {
    id: 'zone_1',
    name: 'Home Area',
    center: { latitude: 37.78825, longitude: -122.4324 },
    radius: 500, // meters
    isActive: true,
    color: '#10B981'
  },
  {
    id: 'zone_2',
    name: 'Grocery Store Area',
    center: { latitude: 37.78925, longitude: -122.4334 },
    radius: 200,
    isActive: true,
    color: '#3B82F6'
  }
];

export default function CaregiverSafeZoneScreen() {
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  
  // Responsive design calculations
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  
  // Navigation height calculation for bottom padding
  const navigationHeight = isSmallScreen ? 64 : isMediumScreen ? 68 : 72;
  const navigationBottomMargin = isSmallScreen ? 8 : 10;
  const totalNavigationSpace = navigationHeight + navigationBottomMargin + insets.bottom + 20;

  const [safeZones, setSafeZones] = useState(mockSafeZones);
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [newZone, setNewZone] = useState({
    name: '',
    center: null,
    radius: 300,
    color: '#10B981'
  });

  const handleCreateZone = () => {
    setIsCreatingZone(true);
    Alert.alert(
      'Create Safe Zone',
      'Tap on the map to set the center of the safe zone, then adjust the radius.',
      [
        { text: 'Cancel', onPress: () => setIsCreatingZone(false) },
        { text: 'Start', onPress: () => {} }
      ]
    );
  };

  const handleSaveZone = () => {
    if (!newZone.center || !newZone.name.trim()) {
      Alert.alert('Error', 'Please set a location and name for the safe zone.');
      return;
    }

    const zone = {
      id: `zone_${Date.now()}`,
      name: newZone.name,
      center: newZone.center,
      radius: newZone.radius,
      isActive: true,
      color: newZone.color
    };

    setSafeZones(prev => [...prev, zone]);
    setNewZone({ name: '', center: null, radius: 300, color: '#10B981' });
    setIsCreatingZone(false);
    
    Alert.alert('Success', 'Safe zone created successfully!');
  };

  const handleDeleteZone = (zoneId: string) => {
    Alert.alert(
      'Delete Safe Zone',
      'Are you sure you want to delete this safe zone?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setSafeZones(prev => prev.filter(zone => zone.id !== zoneId))
        }
      ]
    );
  };

  const toggleZoneActive = (zoneId: string) => {
    setSafeZones(prev => prev.map(zone => 
      zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone
    ));
  };

  const renderMapPlaceholder = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={64} color={WellnessTheme.colors.textSecondary} />
        <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Tap "Add Zone" to create a new safe zone
        </Text>
        
        {/* Mock patient location indicator */}
        <View style={styles.patientLocationIndicator}>
          <View style={styles.patientDot} />
          <Text style={styles.patientLocationText}>Patient Location</Text>
        </View>
        
        {/* Mock safe zones preview */}
        <View style={styles.zonesPreview}>
          {safeZones.filter(zone => zone.isActive).map((zone, index) => (
            <View 
              key={zone.id} 
              style={[
                styles.zonePreview, 
                { 
                  backgroundColor: zone.color + '20',
                  borderColor: zone.color,
                  top: 100 + (index * 30),
                  left: 80 + (index * 20)
                }
              ]}
            >
              <Text style={[styles.zonePreviewText, { color: zone.color }]}>
                {zone.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {isCreatingZone && (
        <View style={styles.creatingZoneOverlay}>
          <Text style={styles.creatingZoneText}>
            Tap to set safe zone center
          </Text>
        </View>
      )}
    </View>
  );

  const renderZonesList = () => (
    <View style={styles.zonesListContainer}>
      <View style={styles.zonesHeader}>
        <Text style={styles.zonesTitle}>Safe Zones ({safeZones.length})</Text>
        <TouchableOpacity 
          style={styles.addZoneButton}
          onPress={handleCreateZone}
          disabled={isCreatingZone}
        >
          <Ionicons name="add" size={20} color={WellnessTheme.colors.white} />
          <Text style={styles.addZoneText}>Add Zone</Text>
        </TouchableOpacity>
      </View>
      
      {safeZones.map((zone) => (
        <View key={zone.id} style={styles.zoneCard}>
          <View style={styles.zoneCardHeader}>
            <View style={styles.zoneInfo}>
              <View style={[styles.zoneColorIndicator, { backgroundColor: zone.color }]} />
              <View style={styles.zoneDetails}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneRadius}>Radius: {zone.radius}m</Text>
              </View>
            </View>
            
            <View style={styles.zoneActions}>
              <TouchableOpacity 
                style={[styles.zoneToggle, zone.isActive && styles.zoneToggleActive]}
                onPress={() => toggleZoneActive(zone.id)}
              >
                <Ionicons 
                  name={zone.isActive ? 'checkmark' : 'close'} 
                  size={16} 
                  color={zone.isActive ? WellnessTheme.colors.white : WellnessTheme.colors.textSecondary} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteZoneButton}
                onPress={() => handleDeleteZone(zone.id)}
              >
                <Ionicons name="trash-outline" size={16} color={WellnessTheme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.zoneStats}>
            <View style={styles.zoneStat}>
              <Ionicons name="location-outline" size={16} color={WellnessTheme.colors.textSecondary} />
              <Text style={styles.zoneStatText}>
                {zone.center.latitude.toFixed(4)}, {zone.center.longitude.toFixed(4)}
              </Text>
            </View>
            
            <View style={[styles.zoneStatus, zone.isActive && styles.zoneStatusActive]}>
              <Text style={[styles.zoneStatusText, zone.isActive && styles.zoneStatusTextActive]}>
                {zone.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
      ))}
      
      {safeZones.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="shield-outline" size={48} color={WellnessTheme.colors.textSecondary} />
          <Text style={styles.emptyStateTitle}>No Safe Zones</Text>
          <Text style={styles.emptyStateText}>
            Create your first safe zone to start monitoring patient location
          </Text>
        </View>
      )}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionCard}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="home" size={24} color={WellnessTheme.colors.primary} />
          </View>
          <Text style={styles.quickActionTitle}>Home Zone</Text>
          <Text style={styles.quickActionSubtitle}>Set home as safe zone</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionCard}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="medical" size={24} color={WellnessTheme.colors.primary} />
          </View>
          <Text style={styles.quickActionTitle}>Hospital Zone</Text>
          <Text style={styles.quickActionSubtitle}>Add nearby hospital</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionCard}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="storefront" size={24} color={WellnessTheme.colors.primary} />
          </View>
          <Text style={styles.quickActionTitle}>Shopping Zone</Text>
          <Text style={styles.quickActionSubtitle}>Add shopping areas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionCard}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="settings" size={24} color={WellnessTheme.colors.primary} />
          </View>
          <Text style={styles.quickActionTitle}>Zone Settings</Text>
          <Text style={styles.quickActionSubtitle}>Configure alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      <CaregiverHeader 
        caregiverName="Alex"
        notificationCount={0}
        onNotificationPress={() => Alert.alert('Notifications', 'View all notifications')}
      />

      <View style={styles.content}>
        {/* Greeting Section */}
        <CaregiverGreetingSection 
          title="Safe Zones"
          subtitle="Define safe areas for patient monitoring"
        />
        
        {/* Map Container */}
        {renderMapPlaceholder()}
        
        {/* Zones List */}
        {renderZonesList()}
        
        {/* Quick Actions */}
        {renderQuickActions()}
        
        <View style={{ height: totalNavigationSpace }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  content: {
    flex: 1,
  },
  
  // Map Styles
  mapContainer: {
    height: 250,
    marginHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
    borderRadius: WellnessTheme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    borderStyle: 'dashed',
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginTop: WellnessTheme.spacing.sm,
  },
  mapPlaceholderSubtext: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: WellnessTheme.spacing.xs,
  },
  
  // Patient Location
  patientLocationIndicator: {
    position: 'absolute',
    top: 60,
    left: 60,
    alignItems: 'center',
  },
  patientDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: WellnessTheme.colors.error,
    borderWidth: 3,
    borderColor: WellnessTheme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  patientLocationText: {
    fontSize: 10,
    color: WellnessTheme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  
  // Safe Zones Preview
  zonesPreview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  zonePreview: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  zonePreviewText: {
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Creating Zone Overlay
  creatingZoneOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatingZoneText: {
    fontSize: WellnessTheme.fontSize.lg,
    color: WellnessTheme.colors.white,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: WellnessTheme.spacing.md,
    borderRadius: WellnessTheme.borderRadius.md,
  },
  
  // Zones List
  zonesListContainer: {
    marginHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
  },
  zonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  zonesTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  addZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
  },
  addZoneText: {
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
    color: WellnessTheme.colors.white,
    marginLeft: WellnessTheme.spacing.xs,
  },
  
  // Zone Cards
  zoneCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  zoneCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: WellnessTheme.spacing.md,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: WellnessTheme.spacing.md,
  },
  zoneDetails: {
    flex: 1,
  },
  zoneName: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 2,
  },
  zoneRadius: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  zoneActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WellnessTheme.spacing.sm,
  },
  zoneToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WellnessTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneToggleActive: {
    backgroundColor: WellnessTheme.colors.success,
  },
  deleteZoneButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WellnessTheme.colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Zone Stats
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneStat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneStatText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    marginLeft: WellnessTheme.spacing.xs,
  },
  zoneStatus: {
    paddingHorizontal: WellnessTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: WellnessTheme.borderRadius.sm,
    backgroundColor: WellnessTheme.colors.border,
  },
  zoneStatusActive: {
    backgroundColor: WellnessTheme.colors.success + '20',
  },
  zoneStatusText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    fontWeight: '600',
  },
  zoneStatusTextActive: {
    color: WellnessTheme.colors.success,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: WellnessTheme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginTop: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.sm,
  },
  emptyStateText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Quick Actions
  quickActionsContainer: {
    marginHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
  },
  quickActionsTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.sm,
  },
  quickActionTitle: {
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
  },
});