import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaregiverGreetingSection from '../../components/CaregiverGreetingSection';
import CaregiverHeader from '../../components/CaregiverHeader';
import { WellnessTheme } from '../../utils/wellnessTheme';

export default function CaregiverSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [simpleModeEnabled, setSimpleModeEnabled] = useState(false);
  const [readAloudEnabled, setReadAloudEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') }
      ]
    );
  };

  const handleLogoutAllDevices = () => {
    Alert.alert(
      'Logout All Devices',
      'This will sign you out of all devices. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout All', style: 'destructive', onPress: () => console.log('Logout all') }
      ]
    );
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  const SettingsRow = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    rightElement,
    showBorder = true 
  }: { 
    icon: string; 
    title: string; 
    description?: string; 
    onPress?: () => void; 
    rightElement?: React.ReactNode;
    showBorder?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingsRow, !showBorder && styles.settingsRowNoBorder]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsIcon}>
        <Ionicons name={icon as any} size={20} color={WellnessTheme.colors.primary} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {description && <Text style={styles.settingsDescription}>{description}</Text>}
      </View>
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color={WellnessTheme.colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      <CaregiverHeader 
        caregiverName="Alex"
        notificationCount={0}
        onNotificationPress={() => Alert.alert('Notifications', 'View all notifications')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <CaregiverGreetingSection 
          title="Settings"
          subtitle="Manage your caregiver preferences"
        />
        
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <SettingsRow
            icon="person-outline"
            title="Personal Information"
            description="Name, email, phone number"
            onPress={() => Alert.alert('Feature', 'Edit profile coming soon')}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            title="Account Security"
            description="Password, two-factor authentication"
            onPress={() => Alert.alert('Feature', 'Security settings coming soon')}
          />
          <SettingsRow
            icon="people-outline"
            title="Linked Patients"
            description="Manage patient connections"
            onPress={() => Alert.alert('Feature', 'Patient management coming soon')}
            showBorder={false}
          />
        </SettingsSection>

        {/* Notifications & Alerts */}
        <SettingsSection title="Notifications & Alerts">
          <SettingsRow
            icon="notifications-outline"
            title="Push Notifications"
            description="Receive alerts and reminders"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                thumbColor={notificationsEnabled ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
              />
            }
          />
          <SettingsRow
            icon="moon-outline"
            title="Quiet Hours"
            description={quietHoursEnabled ? "11:00 PM - 7:00 AM" : "Disabled"}
            rightElement={
              <Switch
                value={quietHoursEnabled}
                onValueChange={setQuietHoursEnabled}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                thumbColor={quietHoursEnabled ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
              />
            }
          />
          <SettingsRow
            icon="warning-outline"
            title="Emergency Alerts"
            description="Critical notifications always enabled"
            onPress={() => Alert.alert('Info', 'Emergency alerts cannot be disabled for safety reasons')}
          />
          <SettingsRow
            icon="mail-outline"
            title="Email Notifications"
            description="Weekly summaries and reports"
            onPress={() => Alert.alert('Feature', 'Email settings coming soon')}
            showBorder={false}
          />
        </SettingsSection>

        {/* Accessibility */}
        <SettingsSection title="Accessibility">
          <SettingsRow
            icon="text-outline"
            title="Font Size"
            description="Large text for better readability"
            onPress={() => Alert.alert('Feature', 'Font size settings coming soon')}
          />
          <SettingsRow
            icon="eye-outline"
            title="Simple Mode"
            description="Simplified interface with larger buttons"
            rightElement={
              <Switch
                value={simpleModeEnabled}
                onValueChange={setSimpleModeEnabled}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                thumbColor={simpleModeEnabled ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
              />
            }
          />
          <SettingsRow
            icon="volume-high-outline"
            title="Read Aloud"
            description="Voice narration for alerts and instructions"
            rightElement={
              <Switch
                value={readAloudEnabled}
                onValueChange={setReadAloudEnabled}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                thumbColor={readAloudEnabled ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
              />
            }
          />
          <SettingsRow
            icon="contrast-outline"
            title="High Contrast"
            description="Better visibility for text and buttons"
            onPress={() => Alert.alert('Feature', 'High contrast mode coming soon')}
            showBorder={false}
          />
        </SettingsSection>

        {/* Data & Privacy */}
        <SettingsSection title="Data & Privacy">
          <SettingsRow
            icon="refresh-outline"
            title="Auto Sync"
            description="Automatically sync data with patients"
            rightElement={
              <Switch
                value={autoSyncEnabled}
                onValueChange={setAutoSyncEnabled}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                thumbColor={autoSyncEnabled ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
              />
            }
          />
          <SettingsRow
            icon="download-outline"
            title="Data Export"
            description="Download patient data and reports"
            onPress={() => Alert.alert('Feature', 'Data export coming soon')}
          />
          <SettingsRow
            icon="document-text-outline"
            title="Privacy Policy"
            description="How we protect your information"
            onPress={() => Alert.alert('Feature', 'Privacy policy coming soon')}
          />
          <SettingsRow
            icon="trash-outline"
            title="Delete Account"
            description="Permanently remove your account"
            onPress={() => Alert.alert('Feature', 'Account deletion coming soon')}
            showBorder={false}
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection title="Security">
          <SettingsRow
            icon="finger-print-outline"
            title="Biometric Authentication"
            description="Use fingerprint or Face ID to sign in"
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                thumbColor={biometricEnabled ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
              />
            }
          />
          <SettingsRow
            icon="phone-portrait-outline"
            title="Trusted Devices"
            description="Manage devices that can access your account"
            onPress={() => Alert.alert('Feature', 'Device management coming soon')}
          />
          <SettingsRow
            icon="log-out-outline"
            title="Logout All Devices"
            description="Sign out from all other devices"
            onPress={handleLogoutAllDevices}
            showBorder={false}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsRow
            icon="help-circle-outline"
            title="Help Center"
            description="FAQs and user guides"
            onPress={() => Alert.alert('Feature', 'Help center coming soon')}
          />
          <SettingsRow
            icon="chatbubble-outline"
            title="Contact Support"
            description="Get help from our team"
            onPress={() => Alert.alert('Feature', 'Contact support coming soon')}
          />
          <SettingsRow
            icon="star-outline"
            title="Rate App"
            description="Share your feedback"
            onPress={() => Alert.alert('Feature', 'App rating coming soon')}
          />
          <SettingsRow
            icon="information-circle-outline"
            title="About"
            description="App version and legal information"
            onPress={() => Alert.alert('About', 'Wayloom Caregiver App v1.0.0')}
            showBorder={false}
          />
        </SettingsSection>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={WellnessTheme.colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoText}>Wayloom Caregiver App</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Wayloom. All rights reserved.</Text>
        </View>

        <View style={styles.bottomPadding} />
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
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  title: {
    fontSize: WellnessTheme.fontSize.xxxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  sectionCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    overflow: 'hidden',
    ...WellnessTheme.shadows.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
    minHeight: 60,
  },
  settingsRowNoBorder: {
    borderBottomWidth: 0,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '500',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.error + '30',
    ...WellnessTheme.shadows.sm,
  },
  signOutText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.error,
    marginLeft: WellnessTheme.spacing.sm,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.xl,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  appInfoText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  versionText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  copyrightText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textLight,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});