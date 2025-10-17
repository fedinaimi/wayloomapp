import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput,
  TouchableOpacity, 
  View, 
  ScrollView,
  AccessibilityInfo,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../../utils/wellnessTheme';

interface PatientConnectScreenProps {
  navigation: any;
  route: {
    params: {
      caregiverData: {
        firstName: string;
        lastName: string;
        relationship: string;
        phoneNumber: string;
        biometricEnabled: boolean;
      };
    };
  };
}

export default function PatientConnectScreen({ navigation, route }: PatientConnectScreenProps) {
  const insets = useSafeAreaInsets();
  const { caregiverData } = route.params;
  const [patientPhone, setPatientPhone] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return cleaned;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPatientPhone(formatted);
  };

  const isValidPhone = () => {
    const digits = patientPhone.replace(/\D/g, '');
    return digits.length === 10;
  };

  const handleInvitePatient = async () => {
    if (!isValidPhone()) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setIsInviting(true);
    
    try {
      // Simulate API call to send invitation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Invitation Sent! 📱',
        `We've sent an SMS link to ${patientPhone} with instructions to connect with you as their caregiver. They'll need to approve your request.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to caregiver dashboard with pending status
              navigation.navigate('CaregiverDashboard', {
                caregiverData,
                pendingPatients: [{
                  phone: patientPhone,
                  status: 'pending',
                  invitedAt: new Date().toISOString()
                }]
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleScanQR = () => {
    // In a real app, this would open the camera for QR scanning
    Alert.alert(
      'QR Code Scanner',
      'This feature would open your camera to scan a QR code displayed on the patient\'s device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Camera', 
          onPress: () => {
            // Simulate QR scan success
            setTimeout(() => {
              Alert.alert(
                'QR Code Scanned! ✅',
                'Connection request sent to the patient. They will need to approve your request to become their caregiver.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.navigate('CaregiverDashboard', {
                        caregiverData,
                        pendingPatients: [{
                          name: 'Patient Name',
                          status: 'pending',
                          connectedAt: new Date().toISOString()
                        }]
                      });
                    }
                  }
                ]
              );
            }, 2000);
          }
        }
      ]
    );
  };

  const handleTextToSpeech = () => {
    const text = `Patient connection screen. Choose how to connect with a patient: invite them by phone number or scan their QR code. You are ${caregiverData.firstName} ${caregiverData.lastName}, ${caregiverData.relationship}.`;
    AccessibilityInfo.announceForAccessibility(text);
  };

  const ConnectionOption = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    disabled = false 
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.connectionOption,
        disabled && styles.connectionOptionDisabled
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <View style={[
        styles.connectionIcon,
        disabled && styles.connectionIconDisabled
      ]}>
        <Ionicons 
          name={icon as any} 
          size={32} 
          color={disabled ? WellnessTheme.colors.textLight : WellnessTheme.colors.primary} 
        />
      </View>
      
      <View style={styles.connectionContent}>
        <Text style={[
          styles.connectionTitle,
          disabled && styles.connectionTitleDisabled
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.connectionDescription,
          disabled && styles.connectionDescriptionDisabled
        ]}>
          {description}
        </Text>
      </View>
      
      <Ionicons 
        name="arrow-forward" 
        size={20} 
        color={disabled ? WellnessTheme.colors.textLight : WellnessTheme.colors.textSecondary} 
      />
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={WellnessTheme.colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.ttsButton}
            onPress={handleTextToSpeech}
            accessibilityRole="button"
            accessibilityLabel="Listen to screen content"
          >
            <Ionicons name="volume-high" size={24} color={WellnessTheme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="link" size={48} color={WellnessTheme.colors.primary} />
            </View>
            
            <Text style={styles.title} accessibilityRole="header">
              Connect with a Patient
            </Text>
            <Text style={styles.subtitle}>
              Choose how you'd like to connect with the person you'll be caring for
            </Text>
          </View>

          {/* Caregiver Info */}
          <View style={styles.caregiverInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {caregiverData.firstName.charAt(0)}{caregiverData.lastName.charAt(0)}
              </Text>
            </View>
            <View style={styles.caregiverDetails}>
              <Text style={styles.caregiverName}>
                {caregiverData.firstName} {caregiverData.lastName}
              </Text>
              <Text style={styles.caregiverRole}>
                {caregiverData.relationship}
              </Text>
            </View>
          </View>

          {/* Connection Options */}
          <View style={styles.optionsSection}>
            <Text style={styles.optionsTitle}>How would you like to connect?</Text>
            
            {/* Invite by Phone */}
            <View style={styles.optionCard}>
              <ConnectionOption
                icon="call-outline"
                title="Invite my patient"
                description="Send them an SMS link to connect securely"
                onPress={() => {}} // Handled by the phone input below
                disabled={true} // This option is handled by the form below
              />
              
              <View style={styles.phoneInputSection}>
                <Text style={styles.phoneInputLabel}>Patient's phone number</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    value={patientPhone}
                    onChangeText={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    placeholderTextColor={WellnessTheme.colors.textLight}
                    keyboardType="phone-pad"
                    maxLength={14}
                    accessibilityLabel="Patient phone number input"
                  />
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.inviteButton,
                    !isValidPhone() && styles.inviteButtonDisabled
                  ]}
                  onPress={handleInvitePatient}
                  disabled={!isValidPhone() || isInviting}
                  accessibilityRole="button"
                  accessibilityLabel="Send invitation"
                >
                  {isInviting ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.loadingSpinner} />
                      <Text style={styles.inviteButtonText}>Sending...</Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="send" size={16} color="white" />
                      <Text style={styles.inviteButtonText}>Send Invitation</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Scan QR Code */}
            <View style={styles.optionCard}>
              <ConnectionOption
                icon="qr-code-outline"
                title="Scan patient QR code"
                description="If they have the app open and showing a QR code"
                onPress={handleScanQR}
              />
            </View>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need help connecting?</Text>
            <Text style={styles.helpText}>
              The patient needs to have the Wayloom app installed and create their account first. 
              They can then either:
            </Text>
            <View style={styles.helpList}>
              <Text style={styles.helpListItem}>• Accept your SMS invitation</Text>
              <Text style={styles.helpListItem}>• Show you their QR code to scan</Text>
              <Text style={styles.helpListItem}>• Invite you from their app</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={() => Alert.alert('Help', 'This would open the help center with detailed connection instructions.')}
              accessibilityRole="button"
              accessibilityLabel="Get help with connecting"
            >
              <Ionicons name="help-circle-outline" size={20} color={WellnessTheme.colors.primary} />
              <Text style={styles.helpButtonText}>View Connection Guide</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.xl,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
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
  
  // Content
  mainContent: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  
  // Caregiver Info
  caregiverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  caregiverDetails: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 2,
  },
  caregiverRole: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Options
  optionsSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  optionCard: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    overflow: 'hidden',
  },
  connectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WellnessTheme.spacing.lg,
    minHeight: 80,
  },
  connectionOptionDisabled: {
    opacity: 0.6,
  },
  connectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.lg,
  },
  connectionIconDisabled: {
    backgroundColor: WellnessTheme.colors.background,
  },
  connectionContent: {
    flex: 1,
  },
  connectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  connectionTitleDisabled: {
    color: WellnessTheme.colors.textLight,
  },
  connectionDescription: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  connectionDescriptionDisabled: {
    color: WellnessTheme.colors.textLight,
  },
  
  // Phone Input
  phoneInputSection: {
    padding: WellnessTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: WellnessTheme.colors.border,
    backgroundColor: WellnessTheme.colors.background,
  },
  phoneInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.md,
  },
  countryCode: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.background,
    borderRightWidth: 1,
    borderRightColor: WellnessTheme.colors.border,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.md,
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.md,
    paddingVertical: WellnessTheme.spacing.md,
    paddingHorizontal: WellnessTheme.spacing.lg,
    minHeight: 48,
    gap: WellnessTheme.spacing.sm,
  },
  inviteButtonDisabled: {
    backgroundColor: WellnessTheme.colors.textLight,
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WellnessTheme.spacing.sm,
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: WellnessTheme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: WellnessTheme.colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    fontWeight: '500',
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  
  // Help Section
  helpSection: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  helpText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: WellnessTheme.spacing.md,
  },
  helpList: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  helpListItem: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.md,
    paddingVertical: WellnessTheme.spacing.md,
    paddingHorizontal: WellnessTheme.spacing.lg,
    gap: WellnessTheme.spacing.sm,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: WellnessTheme.colors.primary,
  },
});