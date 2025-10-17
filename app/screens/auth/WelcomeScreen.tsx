import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  AccessibilityInfo,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../../utils/wellnessTheme';

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'caregiver' | null>(null);

  const handleRoleSelect = (role: 'patient' | 'caregiver') => {
    setSelectedRole(role);
    
    // Announce selection for screen readers
    AccessibilityInfo.announceForAccessibility(
      `Selected ${role === 'patient' ? 'Patient' : 'Caregiver'} role`
    );
    
    // Navigate to phone verification after selection
    setTimeout(() => {
      navigation.navigate('PhoneVerification', { role });
    }, 500);
  };

  const handleTextToSpeech = () => {
    const text = "Welcome to Wayloom. Choose your role: I'm a patient, or I'm a caregiver. This app helps with cognitive health monitoring and caregiver support.";
    AccessibilityInfo.announceForAccessibility(text);
  };

  const RoleButton = ({ 
    role, 
    icon, 
    title, 
    description 
  }: { 
    role: 'patient' | 'caregiver';
    icon: string;
    title: string;
    description: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.roleButton,
        selectedRole === role && styles.roleButtonSelected
      ]}
      onPress={() => handleRoleSelect(role)}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint="Double tap to select this role"
    >
      <View style={styles.roleButtonIcon}>
        <Ionicons 
          name={icon as any} 
          size={32} 
          color={selectedRole === role ? WellnessTheme.colors.primary : WellnessTheme.colors.textSecondary} 
        />
      </View>
      
      <View style={styles.roleButtonContent}>
        <Text style={[
          styles.roleButtonTitle,
          selectedRole === role && styles.roleButtonTitleSelected
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.roleButtonDescription,
          selectedRole === role && styles.roleButtonDescriptionSelected
        ]}>
          {description}
        </Text>
      </View>
      
      {selectedRole === role && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={WellnessTheme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with TTS */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.ttsButton}
            onPress={handleTextToSpeech}
            accessibilityRole="button"
            accessibilityLabel="Listen to screen content"
            accessibilityHint="Activates text-to-speech for this screen"
          >
            <Ionicons name="volume-high" size={24} color={WellnessTheme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Welcome Content */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="bulb-outline" size={48} color={WellnessTheme.colors.primary} />
            </View>
          </View>
          
          <Text style={styles.welcomeTitle} accessibilityRole="header">
            Welcome to Wayloom
          </Text>
          
          <Text style={styles.welcomeSubtitle}>
            Who's using the app?
          </Text>
          
          <Text style={styles.welcomeDescription}>
            Choose your role to get started with personalized cognitive health monitoring
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.progressText}>Step 1 of 3</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSelection}>
          <RoleButton
            role="patient"
            icon="person"
            title="I'm a patient"
            description="Take cognitive tests and monitor your health"
          />
          
          <RoleButton
            role="caregiver"
            icon="people"
            title="I'm a caregiver"
            description="Support and monitor your loved one's health"
          />
        </View>

        {/* Accessibility Features */}
        <View style={styles.accessibilityInfo}>
          <View style={styles.accessibilityRow}>
            <Ionicons name="volume-high" size={16} color={WellnessTheme.colors.primary} style={styles.accessibilityIcon} />
            <Text style={styles.accessibilityText}>
              Tap the speaker icon for audio assistance
            </Text>
          </View>
          <View style={styles.accessibilityRow}>
            <Ionicons name="phone-portrait" size={16} color={WellnessTheme.colors.primary} style={styles.accessibilityIcon} />
            <Text style={styles.accessibilityText}>
              Large fonts and high contrast available in settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: WellnessTheme.spacing.xl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.xl,
  },
  ttsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xxxl,
  },
  logoContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: WellnessTheme.spacing.sm,
  },
  welcomeDescription: {
    fontSize: 16,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  
  // Progress
  progressContainer: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xxxl,
  },
  progressDots: {
    flexDirection: 'row',
    marginBottom: WellnessTheme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WellnessTheme.colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: WellnessTheme.colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Role Selection
  roleSelection: {
    gap: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xxxl,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    padding: WellnessTheme.spacing.xl,
    minHeight: 88, // Accessibility: minimum 48px touch target + padding
  },
  roleButtonSelected: {
    borderColor: WellnessTheme.colors.primary,
    backgroundColor: WellnessTheme.colors.primaryLight,
  },
  roleButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.lg,
  },
  roleButtonContent: {
    flex: 1,
  },
  roleButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  roleButtonTitleSelected: {
    color: WellnessTheme.colors.primary,
  },
  roleButtonDescription: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  roleButtonDescriptionSelected: {
    color: WellnessTheme.colors.textPrimary,
  },
  selectedIndicator: {
    marginLeft: WellnessTheme.spacing.md,
  },
  
  // Accessibility
  accessibilityInfo: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  accessibilityText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
    flex: 1,
  },
  accessibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  accessibilityIcon: {
    marginRight: WellnessTheme.spacing.sm,
  },
});