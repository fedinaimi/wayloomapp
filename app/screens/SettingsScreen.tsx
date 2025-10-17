import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../utils/wellnessTheme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  
  // State for various toggles and settings
  const [twoStepVerification, setTwoStepVerification] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeTapTargets, setLargeTapTargets] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [testReminders, setTestReminders] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(false);
  const [outsideZoneAlerts, setOutsideZoneAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(true);
  const [geofencing, setGeofencing] = useState(false);
  const [textSize, setTextSize] = useState(1.0);
  
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTestLanguage, setSelectedTestLanguage] = useState('English');
  const [selectedAppearance, setSelectedAppearance] = useState('System');
  const [selectedDominantHand, setSelectedDominantHand] = useState('Right');
  const [selectedHearingStatus, setSelectedHearingStatus] = useState('Normal');
  const [selectedVisionStatus, setSelectedVisionStatus] = useState('Normal');
  const [selectedVoiceGuidance, setSelectedVoiceGuidance] = useState('Voice');
  const [selectedSafetyAlerts, setSelectedSafetyAlerts] = useState('Loud');
  const [selectedCheckInFreq, setSelectedCheckInFreq] = useState('Daily');
  const [selectedLocationDuration, setSelectedLocationDuration] = useState('30');

  const navigationHeight = 80;
  const bottomMargin = 20;
  const totalNavigationSpace = navigationHeight + bottomMargin + insets.bottom + 10;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
        <Ionicons name="notifications" size={24} color={WellnessTheme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderSettingsRow = (
    icon: string, 
    title: string, 
    subtitle?: string, 
    rightElement?: React.ReactNode,
    onPress?: () => void,
    danger?: boolean
  ) => (
    <TouchableOpacity 
      style={styles.settingsRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsRowLeft}>
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={danger ? '#DC2626' : WellnessTheme.colors.textSecondary} 
          style={styles.settingsIcon} 
        />
        <View style={styles.settingsTextContainer}>
          <Text style={[styles.settingsTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (onPress && <Ionicons name="chevron-forward" size={20} color={WellnessTheme.colors.textSecondary} />)}
    </TouchableOpacity>
  );

  const renderCard = (title: string, children: React.ReactNode) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderBadge = (text: string, type: 'verified' | 'unverified' | 'missing') => {
    const badgeColors = {
      verified: { bg: WellnessTheme.colors.success, text: 'white' },
      unverified: { bg: WellnessTheme.colors.warning, text: 'white' },
      missing: { bg: WellnessTheme.colors.textLight, text: 'white' }
    };
    
    return (
      <View style={[styles.badge, { backgroundColor: badgeColors[type].bg }]}>
        <Text style={[styles.badgeText, { color: badgeColors[type].text }]}>{text}</Text>
      </View>
    );
  };

  const showGeofencingBanner = !geofencing;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {renderHeader()}
      
      {/* Geofencing Banner */}
      {showGeofencingBanner && (
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Ionicons name="location-outline" size={20} color={WellnessTheme.colors.warning} />
            <Text style={styles.bannerText}>Geofencing is disabled</Text>
          </View>
          <TouchableOpacity 
            style={styles.bannerButton}
            onPress={() => setGeofencing(true)}
          >
            <Text style={styles.bannerButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingBottom: totalNavigationSpace }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your app experience</Text>
        </View>

        {/* Profile & Account */}
        {renderCard('Profile & Account', (
          <>
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.profileAvatar}>
                <Text style={styles.avatarText}>A</Text>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Anna Wilson</Text>
                <Text style={styles.profileRole}>Patient</Text>
              </View>
            </View>
            
            {renderSettingsRow(
              'call-outline', 
              'Phone', 
              '+1 (555) 123-4567', 
              <View style={styles.contactRow}>
                {renderBadge('Verified', 'verified')}
              </View>
            )}
            
            {renderSettingsRow(
              'mail-outline', 
              'Email', 
              'anna.wilson@email.com', 
              <View style={styles.contactRow}>
                {renderBadge('Not verified', 'unverified')}
                <TouchableOpacity style={styles.verifyButton}>
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {renderSettingsRow(
              'people-outline', 
              'Linked Caregivers', 
              '2 caregivers', 
              undefined,
              () => Alert.alert('Manage Caregivers', 'Navigate to caregivers management')
            )}
            
            {renderSettingsRow(
              'shield-checkmark-outline', 
              'Emergency Contact', 
              undefined, 
              undefined,
              () => Alert.alert('Edit Emergency Contact', 'Edit emergency contact details')
            )}
            
            {renderSettingsRow(
              'lock-closed-outline', 
              '2-Step Verification', 
              undefined, 
              <Switch 
                value={twoStepVerification} 
                onValueChange={setTwoStepVerification}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'key-outline', 
              'Change Login Method', 
              'Phone or Email', 
              undefined,
              () => Alert.alert('Change Login Method', 'Select new login method')
            )}
          </>
        ))}

        {/* App Preferences */}
        {renderCard('App Preferences', (
          <>
            {renderSettingsRow(
              'language-outline', 
              'Language', 
              selectedLanguage, 
              undefined,
              () => Alert.alert('Select Language', 'Choose app language')
            )}
            
            {renderSettingsRow(
              'chatbox-outline', 
              'Test Language', 
              selectedTestLanguage, 
              undefined,
              () => Alert.alert('Select Test Language', 'Choose test language')
            )}
            
            {renderSettingsRow(
              'time-outline', 
              'Timezone', 
              'UTC-5 (Auto)', 
              undefined,
              () => Alert.alert('Timezone Settings', 'Configure timezone')
            )}
            
            {renderSettingsRow(
              'resize-outline', 
              'Units', 
              'Metric', 
              undefined,
              () => Alert.alert('Units', 'Select measurement units')
            )}
            
            {renderSettingsRow(
              'contrast-outline', 
              'Appearance', 
              selectedAppearance, 
              undefined,
              () => Alert.alert('Appearance', 'Select app theme')
            )}
          </>
        ))}

        {/* Accessibility & Test Adaptation */}
        {renderCard('Accessibility & Test Adaptation', (
          <>
            {renderSettingsRow(
              'text-outline', 
              'Text Size', 
              textSize === 0.8 ? 'Small' : textSize === 1.0 ? 'Medium' : textSize === 1.2 ? 'Large' : 'Extra Large', 
              undefined,
              () => {
                const sizes = [0.8, 1.0, 1.2, 1.4];
                const labels = ['Small', 'Medium', 'Large', 'Extra Large'];
                const currentIndex = sizes.indexOf(textSize);
                const nextIndex = (currentIndex + 1) % sizes.length;
                setTextSize(sizes[nextIndex]);
              }
            )}
            
            {renderSettingsRow(
              'hand-left-outline', 
              'Large Tap Targets', 
              undefined, 
              <Switch 
                value={largeTapTargets} 
                onValueChange={setLargeTapTargets}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'contrast-outline', 
              'High Contrast', 
              undefined, 
              <Switch 
                value={highContrast} 
                onValueChange={setHighContrast}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'phone-portrait-outline', 
              'Haptics', 
              undefined, 
              <Switch 
                value={haptics} 
                onValueChange={setHaptics}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'hand-right-outline', 
              'Dominant Hand', 
              selectedDominantHand, 
              undefined,
              () => Alert.alert('Dominant Hand', 'Select your dominant hand')
            )}
            
            {renderSettingsRow(
              'ear-outline', 
              'Hearing Status', 
              selectedHearingStatus, 
              undefined,
              () => Alert.alert('Hearing Status', 'Select your hearing status')
            )}
            
            {renderSettingsRow(
              'eye-outline', 
              'Vision Status', 
              selectedVisionStatus, 
              undefined,
              () => Alert.alert('Vision Status', 'Select your vision status')
            )}
            
            {renderSettingsRow(
              'volume-high-outline', 
              'Voice Guidance', 
              selectedVoiceGuidance + ' guidance', 
              undefined,
              () => Alert.alert('Voice Guidance', 'Select guidance type')
            )}
          </>
        ))}

        {/* Notifications */}
        {renderCard('Notifications', (
          <>
            {renderSettingsRow(
              'alarm-outline', 
              'Test Reminders', 
              testReminders ? 'Quiet hours: 22:00–08:00' : undefined, 
              <Switch 
                value={testReminders} 
                onValueChange={setTestReminders}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'medical-outline', 
              'Medication Reminders', 
              undefined, 
              <Switch 
                value={medicationReminders} 
                onValueChange={setMedicationReminders}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'warning-outline', 
              'Safety Alerts', 
              selectedSafetyAlerts, 
              undefined,
              () => Alert.alert('Safety Alerts', 'Select alert volume')
            )}
            
            {renderSettingsRow(
              'send-outline', 
              'Notification Channels', 
              'Push, SMS, Email', 
              undefined,
              () => Alert.alert('Channels', 'Configure notification channels')
            )}
            
            {renderSettingsRow(
              'stats-chart-outline', 
              'Weekly Summary Report', 
              undefined, 
              <Switch 
                value={weeklyReport} 
                onValueChange={setWeeklyReport}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
          </>
        ))}

        {/* Safety & Location */}
        {renderCard('Safety & Location', (
          <>
            {renderSettingsRow(
              'home-outline', 
              'Safe Zones', 
              'Home, Clinic', 
              undefined,
              () => Alert.alert('Safe Zones', 'Manage safe zones')
            )}
            
            {renderSettingsRow(
              'location-outline', 
              'Outside-Zone Alerts', 
              undefined, 
              <Switch 
                value={outsideZoneAlerts} 
                onValueChange={setOutsideZoneAlerts}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'time-outline', 
              'Live Location Duration', 
              selectedLocationDuration + ' minutes', 
              undefined,
              () => Alert.alert('Duration', 'Select default duration')
            )}
            
            {renderSettingsRow(
              'checkmark-circle-outline', 
              'Check-in Frequency', 
              selectedCheckInFreq, 
              undefined,
              () => Alert.alert('Check-in', 'Set check-in frequency')
            )}
            
            {renderSettingsRow(
              'map-outline', 
              'Geofencing', 
              geofencing ? 'Enabled' : 'Disabled', 
              <Switch 
                value={geofencing} 
                onValueChange={setGeofencing}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
          </>
        ))}

        {/* Data & Privacy */}
        {renderCard('Data & Privacy', (
          <>
            {renderSettingsRow(
              'document-text-outline', 
              'Consent Agreement', 
              'Version 2.1 (Oct 2025)', 
              undefined,
              () => Alert.alert('Consent', 'View consent PDF')
            )}
            
            {renderSettingsRow(
              'shield-checkmark-outline', 
              'App Permissions', 
              'Camera, Microphone, Location', 
              undefined,
              () => Alert.alert('Permissions', 'Manage app permissions')
            )}
            
            {renderSettingsRow(
              'download-outline', 
              'Download My Data', 
              'Export as JSON or ZIP', 
              undefined,
              () => Alert.alert('Export Data', 'Download your data')
            )}
            
            {renderSettingsRow(
              'share-outline', 
              'Share with Clinician', 
              'FHIR/CSV export', 
              undefined,
              () => Alert.alert('Share Data', 'Export for clinician')
            )}
            
            {renderSettingsRow(
              'analytics-outline', 
              'Usage Analytics', 
              'Send anonymized data', 
              <Switch 
                value={analyticsData} 
                onValueChange={setAnalyticsData}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary }}
              />
            )}
            
            {renderSettingsRow(
              'trash-outline', 
              'Delete Account', 
              'Permanently delete all data', 
              undefined,
              () => Alert.alert('Delete Account', 'This action cannot be undone', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive' }
              ]),
              true
            )}
          </>
        ))}

        {/* Devices */}
        {renderCard('Devices', (
          <>
            {renderSettingsRow(
              'phone-portrait-outline', 
              'Current Device', 
              'iPhone 15 Pro, iOS 17.1, 85% battery', 
              undefined,
              () => Alert.alert('Device Diagnostics', 'View detailed device info')
            )}
            
            {renderSettingsRow(
              'tablet-portrait-outline', 
              'Linked Devices', 
              '1 other device', 
              undefined,
              () => Alert.alert('Linked Devices', 'Manage connected devices')
            )}
          </>
        ))}

        {/* About & Support */}
        {renderCard('About & Support', (
          <>
            {renderSettingsRow(
              'information-circle-outline', 
              'App Version', 
              'v2.1.0 (build 147)', 
              undefined,
              () => Alert.alert('Version Info', 'Detailed version information')
            )}
            
            {renderSettingsRow(
              'help-circle-outline', 
              'Help Center', 
              undefined, 
              undefined,
              () => Alert.alert('Help', 'Open help center')
            )}
            
            {renderSettingsRow(
              'chatbubble-outline', 
              'Contact Support', 
              undefined, 
              undefined,
              () => Alert.alert('Support', 'Contact our support team')
            )}
            
            {renderSettingsRow(
              'document-outline', 
              'Terms of Service', 
              undefined, 
              undefined,
              () => Alert.alert('Terms', 'View terms of service')
            )}
            
            {renderSettingsRow(
              'shield-outline', 
              'Privacy Policy', 
              undefined, 
              undefined,
              () => Alert.alert('Privacy', 'View privacy policy')
            )}
            
            {renderSettingsRow(
              'code-outline', 
              'Open Source Licenses', 
              undefined, 
              undefined,
              () => Alert.alert('Licenses', 'View open source licenses')
            )}
          </>
        ))}

        {/* Sign Out */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive' }
          ])}
        >
          <Ionicons name="log-out-outline" size={20} color={WellnessTheme.colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
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
  
  // Banner
  banner: {
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerText: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
    marginLeft: WellnessTheme.spacing.sm,
    fontWeight: '500',
  },
  bannerButton: {
    backgroundColor: WellnessTheme.colors.warning,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.sm,
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  scrollView: {
    flex: 1,
  },
  content: {
    padding: WellnessTheme.spacing.lg,
  },
  headerSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Cards
  card: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.xl,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.lg,
    paddingBottom: WellnessTheme.spacing.md,
  },
  
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  profileInfo: {
    marginLeft: WellnessTheme.spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Settings Rows
  settingsRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    marginRight: WellnessTheme.spacing.md,
    width: 24,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    color: '#DC2626',
  },
  
  // Contact Row
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WellnessTheme.spacing.sm,
  },
  
  // Badges
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifyButton: {
    backgroundColor: WellnessTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#DC2626',
    paddingVertical: WellnessTheme.spacing.lg,
    marginTop: WellnessTheme.spacing.xl,
    marginHorizontal: WellnessTheme.spacing.lg,
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: WellnessTheme.spacing.sm,
  },
});