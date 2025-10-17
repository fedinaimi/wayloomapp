import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../utils/wellnessTheme';

interface SafetyScreenProps {
  navigation: any;
}

export default function SafetyScreen({ navigation }: SafetyScreenProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [sosState, setSosState] = useState<'idle' | 'arming' | 'alertSent' | 'active'>('idle');
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [isInSafeZone, setIsInSafeZone] = useState(true);
  const [showTipsAccordion, setShowTipsAccordion] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  
  const sosButtonScale = useRef(new Animated.Value(1)).current;
  const sosProgressAnim = useRef(new Animated.Value(0)).current;

  // Mock data
  const mockData = {
    battery: 78,
    lastSeen: '2m ago',
    locationSharingEnd: '12:50',
    caregivers: [
      { id: 1, name: 'Sarah', avatar: 'S', phone: '+1234567890', isPrimary: true },
      { id: 2, name: 'Mark', avatar: 'M', phone: '+1234567891', isPrimary: false },
    ],
    emergencyNumber: '911',
    safeZone: 'Home'
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>2</Text>
        </View>
        <Ionicons name="notifications" size={24} color={WellnessTheme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const handleSOSPress = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSosState('arming');
    
    Animated.parallel([
      Animated.timing(sosButtonScale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sosProgressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setSosState('alertSent');
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });
  };

  const handleSOSRelease = () => {
    if (sosState === 'arming') {
      setSosState('idle');
      Animated.parallel([
        Animated.timing(sosButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(sosProgressAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const renderSOSSection = () => (
    <View style={styles.sosSection}>
      <View style={styles.sosContainer}>
        <Animated.View
          style={[
            styles.sosButton,
            {
              transform: [{ scale: sosButtonScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.sosButtonInner}
            onPressIn={handleSOSPress}
            onPressOut={handleSOSRelease}
            accessible={true}
            accessibilityLabel="SOS button. Hold two seconds to send alert."
          >
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
          
          {sosState === 'arming' && (
            <Animated.View
              style={[
                styles.sosProgressRing,
                {
                  borderColor: sosProgressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', WellnessTheme.colors.white],
                  }),
                },
              ]}
            />
          )}
        </Animated.View>
        
        <Text style={styles.sosLabel}>Hold 2s to alert</Text>
        <Text style={styles.sosSubtext}>
          Not a medical device. Call emergency services if needed.
        </Text>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={[styles.quickActionChip, styles.emergencyChip]}>
          <Ionicons name="call" size={20} color={WellnessTheme.colors.error} />
          <Text style={[styles.quickActionText, { color: WellnessTheme.colors.error }]}>
            Call {mockData.emergencyNumber}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.quickActionChip, isLocationSharing && styles.activeChip]}
          onPress={() => setIsLocationSharing(!isLocationSharing)}
        >
          <Ionicons 
            name="location" 
            size={20} 
            color={isLocationSharing ? WellnessTheme.colors.primary : WellnessTheme.colors.textSecondary} 
          />
          <Text style={[
            styles.quickActionText,
            { color: isLocationSharing ? WellnessTheme.colors.primary : WellnessTheme.colors.textSecondary }
          ]}>
            Share Location
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionChip}>
          <Ionicons name="people" size={20} color={WellnessTheme.colors.textSecondary} />
          <Text style={styles.quickActionText}>Call Caregiver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatusCards = () => (
    <View style={styles.statusSection}>
      {/* Safe Zone Card */}
      <View style={[styles.statusCard, !isInSafeZone && styles.warningCard]}>
        <View style={styles.statusCardHeader}>
          <Ionicons 
            name={isInSafeZone ? "home" : "warning"} 
            size={20} 
            color={isInSafeZone ? WellnessTheme.colors.success : WellnessTheme.colors.warning} 
          />
          <Text style={styles.statusCardTitle}>
            {isInSafeZone ? `Inside ${mockData.safeZone} zone` : 'Outside safe zone'}
          </Text>
        </View>
        <View style={styles.mapPreview}>
          <Text style={styles.mapPlaceholder}>📍 Map Preview</Text>
        </View>
        <TouchableOpacity style={styles.checkInButton}>
          <Text style={styles.checkInButtonText}>
            {isInSafeZone ? "I'm here" : "I'm OK"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Battery & Last Seen Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusCardHeader}>
          <Ionicons name="pulse" size={20} color={WellnessTheme.colors.textSecondary} />
          <Text style={styles.statusCardTitle}>Device Status</Text>
        </View>
        <Text style={styles.statusText}>
          Last update {mockData.lastSeen} • Battery {mockData.battery}%
        </Text>
        <View style={styles.batteryIndicator}>
          <View style={[styles.batteryBar, { width: `${mockData.battery}%` }]} />
        </View>
      </View>

      {/* Location Sharing Card */}
      {isLocationSharing && (
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Ionicons name="radio" size={20} color={WellnessTheme.colors.primary} />
            <Text style={styles.statusCardTitle}>Location Sharing</Text>
          </View>
          <View style={styles.sharingTimer}>
            <Text style={styles.sharingText}>Sharing until {mockData.locationSharingEnd}</Text>
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={() => setIsLocationSharing(false)}
            >
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderCaregivers = () => (
    <View style={styles.caregiversSection}>
      <Text style={styles.sectionTitle}>Caregivers</Text>
      <View style={styles.caregiversRow}>
        {mockData.caregivers.map((caregiver) => (
          <View key={caregiver.id} style={styles.caregiverChip}>
            <View style={[styles.caregiverAvatar, caregiver.isPrimary && styles.primaryAvatar]}>
              <Text style={styles.caregiverAvatarText}>{caregiver.avatar}</Text>
            </View>
            <Text style={styles.caregiverName}>{caregiver.name}</Text>
            <View style={styles.caregiverActions}>
              <TouchableOpacity style={styles.caregiverAction}>
                <Ionicons name="call" size={16} color={WellnessTheme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.caregiverAction}>
                <Ionicons name="chatbubble" size={16} color={WellnessTheme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addCaregiverChip}>
          <Ionicons name="add" size={20} color={WellnessTheme.colors.textSecondary} />
          <Text style={styles.addCaregiverText}>Add caregiver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTipsAccordion = () => (
    <View style={styles.tipsSection}>
      <TouchableOpacity 
        style={styles.accordionHeader}
        onPress={() => setShowTipsAccordion(!showTipsAccordion)}
      >
        <Text style={styles.accordionTitle}>Tips & Guidance</Text>
        <Ionicons 
          name={showTipsAccordion ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={WellnessTheme.colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {showTipsAccordion && (
        <View style={styles.accordionContent}>
          <Text style={styles.tipsTitle}>If you feel lost:</Text>
          <Text style={styles.tipsBullet}>1. Stay calm and look for landmarks</Text>
          <Text style={styles.tipsBullet}>2. Call a caregiver or tap SOS</Text>
          <Text style={styles.tipsBullet}>3. Share your location</Text>
          
          <TouchableOpacity style={styles.emergencyCardButton}>
            <Ionicons name="qr-code" size={16} color={WellnessTheme.colors.primary} />
            <Text style={styles.emergencyCardText}>Show my emergency card</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        This feature provides additional safety support but is not a substitute for medical care or emergency services.
      </Text>
    </View>
  );

  // Calculate navigation height for bottom padding
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const navigationHeight = isSmallScreen ? 64 : isMediumScreen ? 68 : 72;
  const navigationBottomMargin = isSmallScreen ? 8 : 10;
  const totalNavigationSpace = navigationHeight + navigationBottomMargin + insets.bottom + 20;

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: totalNavigationSpace }]}
      >
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Safety & Support</Text>
          <Text style={styles.pageSubtitle}>Emergency contacts and safety features</Text>
        </View>
        
        {renderSOSSection()}
        {renderQuickActions()}
        {renderStatusCards()}
        {renderCaregivers()}
        {renderTipsAccordion()}
        {renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: WellnessTheme.spacing.lg,
  },
  
  // Title Section
  titleSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  pageSubtitle: {
    fontSize: 16,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 24,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.md,
    paddingBottom: WellnessTheme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WellnessTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: WellnessTheme.spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: WellnessTheme.colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // SOS Section
  sosSection: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
  },
  sosContainer: {
    alignItems: 'center',
  },
  sosButton: {
    position: 'relative',
    marginBottom: WellnessTheme.spacing.lg,
  },
  sosButtonInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: WellnessTheme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(220, 38, 38, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  sosText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
  sosProgressRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  sosLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  sosSubtext: {
    fontSize: 12,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
  
  // Quick Actions
  quickActionsSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  quickActionChip: {
    flex: 1,
    minWidth: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.sm,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    minHeight: 72,
  },
  emergencyChip: {
    borderColor: WellnessTheme.colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  activeChip: {
    borderColor: WellnessTheme.colors.primary,
    backgroundColor: WellnessTheme.colors.primaryLight,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: WellnessTheme.colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  
  // Status Cards
  statusSection: {
    marginBottom: WellnessTheme.spacing.xl,
    gap: WellnessTheme.spacing.md,
  },
  statusCard: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.xl,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  warningCard: {
    borderColor: WellnessTheme.colors.warning,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginLeft: WellnessTheme.spacing.sm,
  },
  mapPreview: {
    height: 120,
    backgroundColor: WellnessTheme.colors.border,
    borderRadius: WellnessTheme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  mapPlaceholder: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
  },
  checkInButton: {
    backgroundColor: WellnessTheme.colors.primary,
    paddingVertical: WellnessTheme.spacing.sm,
    paddingHorizontal: WellnessTheme.spacing.lg,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  checkInButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: WellnessTheme.colors.white,
  },
  statusText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  batteryIndicator: {
    height: 4,
    backgroundColor: WellnessTheme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  batteryBar: {
    height: '100%',
    backgroundColor: WellnessTheme.colors.success,
    borderRadius: 2,
  },
  sharingTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sharingText: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
  },
  stopButton: {
    backgroundColor: WellnessTheme.colors.error,
    paddingVertical: 6,
    paddingHorizontal: WellnessTheme.spacing.md,
    borderRadius: 16,
  },
  stopButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: WellnessTheme.colors.white,
  },
  
  // Caregivers
  caregiversSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  caregiversRow: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.md,
    flexWrap: 'wrap',
  },
  caregiverChip: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    flex: 1,
    minWidth: 120,
    maxWidth: 150,
  },
  caregiverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WellnessTheme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: WellnessTheme.spacing.sm,
  },
  primaryAvatar: {
    backgroundColor: WellnessTheme.colors.primary,
  },
  caregiverAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
  caregiverName: {
    fontSize: 12,
    fontWeight: '500',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  caregiverActions: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.sm,
  },
  caregiverAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: WellnessTheme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCaregiverChip: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    borderStyle: 'dashed',
    flex: 1,
    minWidth: 120,
    maxWidth: 150,
    minHeight: 100,
  },
  addCaregiverText: {
    fontSize: 12,
    color: WellnessTheme.colors.textSecondary,
    marginTop: WellnessTheme.spacing.sm,
  },
  
  // Tips Accordion
  tipsSection: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.xl,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: WellnessTheme.spacing.lg,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  accordionContent: {
    padding: WellnessTheme.spacing.lg,
    paddingTop: 0,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  tipsBullet: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  emergencyCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
  },
  emergencyCardText: {
    fontSize: 14,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
    marginLeft: WellnessTheme.spacing.sm,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: WellnessTheme.colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});