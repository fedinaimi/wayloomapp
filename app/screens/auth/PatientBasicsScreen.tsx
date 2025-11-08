import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../../utils/wellnessTheme';

interface PatientBasicsScreenProps {
  navigation: any;
  route: {
    params: {
      phoneNumber: string;
      biometricEnabled: boolean;
    };
  };
}

export default function PatientBasicsScreen({ navigation, route }: PatientBasicsScreenProps) {
  const insets = useSafeAreaInsets();
  const { phoneNumber, biometricEnabled } = route.params;
  
  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  
  // Health Information
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  
  // Education & Lifestyle
  const [educationLevel, setEducationLevel] = useState('');
  const [livingArrangement, setLivingArrangement] = useState('');
  
  // Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  
  // Agreement & Consent
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // UI State
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Health, 3: Emergency

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 13; // Minimum age 13

  const isValidBirthYear = () => {
    const year = parseInt(birthYear);
    return year >= minYear && year <= maxYear;
  };

  // Validation for each step
  const isStep1Valid = () => {
    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      isValidBirthYear() &&
      gender.length > 0
    );
  };

  const isStep2Valid = () => {
    return (
      (medicalHistory.length > 0 || medicalHistory.length === 0) && // optional but good practice
      currentMedications.trim().length >= 0 &&
      allergies.trim().length >= 0 &&
      educationLevel.length > 0 &&
      livingArrangement.length > 0
    );
  };

  const isStep3Valid = () => {
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    return (
      emergencyContactName.trim().length >= 2 &&
      emergencyContactPhone.trim().length >= 7 &&
      phoneRegex.test(emergencyContactPhone.trim())
    );
  };

  const canContinueStep = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    if (currentStep === 3) return isStep3Valid() && agreedToTerms;
    return false;
  };

  const handleBirthYearChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setBirthYear(cleaned);
  };

  const toggleMedicalHistory = (condition: string) => {
    setMedicalHistory(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleNextStep = async () => {
    if (!canContinueStep()) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final step - submit
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to main app with patient data
      navigation.navigate('MainTabs', {
        patientData: {
          firstName,
          lastName,
          birthYear,
          gender,
          medicalHistory,
          currentMedications,
          allergies,
          educationLevel,
          livingArrangement,
          emergencyContactName,
          emergencyContactPhone,
          phoneNumber,
          biometricEnabled,
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTextToSpeech = () => {
    let text = '';
    if (currentStep === 1) {
      text = `Step 1 of 3: Personal Information. Enter your first name, last name, birth year, and select your gender.`;
    } else if (currentStep === 2) {
      text = `Step 2 of 3: Health Information. Tell us about your medical history, medications, allergies, education level, and living arrangement.`;
    } else {
      text = `Step 3 of 3: Emergency Contact. Enter your emergency contact name and phone number, then agree to create your account.`;
    }
    AccessibilityInfo.announceForAccessibility(text);
  };

  const toggleAgreement = () => {
    setAgreedToTerms(!agreedToTerms);
    AccessibilityInfo.announceForAccessibility(
      agreedToTerms ? 'Terms agreement unchecked' : 'Terms agreement checked'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 20 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
                <Ionicons name="person-add" size={48} color={WellnessTheme.colors.primary} />
              </View>
              
              <Text style={styles.title} accessibilityRole="header">
                Tell us about yourself
              </Text>
              <Text style={styles.subtitle}>
                Just a few quick details to personalize your experience
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              {/* First Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    firstName.trim().length >= 2 && styles.textInputValid
                  ]}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                  accessibilityLabel="First name input"
                  accessibilityHint="Enter your first name, minimum 2 characters"
                />
                {firstName.trim().length > 0 && firstName.trim().length < 2 && (
                  <Text style={styles.errorText}>
                    First name must be at least 2 characters
                  </Text>
                )}
              </View>

              {/* Birth Year */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Birth Year</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isValidBirthYear() && styles.textInputValid
                  ]}
                  value={birthYear}
                  onChangeText={handleBirthYearChange}
                  placeholder="YYYY"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  keyboardType="number-pad"
                  maxLength={4}
                  accessibilityLabel="Birth year input"
                  accessibilityHint={`Enter your birth year between ${minYear} and ${maxYear}`}
                />
                <Text style={styles.hintText}>
                  Enter the year you were born (e.g., 1980)
                </Text>
                {birthYear.length === 4 && !isValidBirthYear() && (
                  <Text style={styles.errorText}>
                    Please enter a valid birth year ({minYear}-{maxYear})
                  </Text>
                )}
              </View>

              {/* Privacy Info */}
              <View style={styles.privacyInfo}>
                <View style={styles.privacyRow}>
                  <Ionicons name="shield-checkmark" size={16} color={WellnessTheme.colors.success} />
                  <Text style={styles.privacyText}>Your information is encrypted and secure</Text>
                </View>
                <View style={styles.privacyRow}>
                  <Ionicons name="eye-off" size={16} color={WellnessTheme.colors.textSecondary} />
                  <Text style={styles.privacyText}>Only you and your caregivers can see your data</Text>
                </View>
              </View>

              {/* Agreement */}
              <TouchableOpacity
                style={styles.agreementContainer}
                onPress={toggleAgreement}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreedToTerms }}
                accessibilityLabel="Agreement to create account"
                accessibilityHint="Tap to agree to terms and privacy policy"
              >
                <View style={[
                  styles.checkbox,
                  agreedToTerms && styles.checkboxChecked
                ]}>
                  {agreedToTerms && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <View style={styles.agreementText}>
                  <Text style={styles.agreementMainText}>
                    I agree to create my account
                  </Text>
                  <Text style={styles.agreementSubText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.linkText}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !canContinue() && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={!canContinue() || isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue to dashboard"
              accessibilityHint="Creates your patient account and continues to dashboard"
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingSpinner} />
                  <Text style={styles.continueButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Biometric Badge */}
          {biometricEnabled && (
            <View style={styles.biometricBadge}>
              <Ionicons name="finger-print" size={16} color={WellnessTheme.colors.success} />
              <Text style={styles.biometricText}>Face ID enabled for secure sign-in</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
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
    marginBottom: WellnessTheme.spacing.xxxl,
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
  
  // Form
  formSection: {
    gap: WellnessTheme.spacing.xl,
    marginBottom: WellnessTheme.spacing.xl,
  },
  inputGroup: {
    gap: WellnessTheme.spacing.sm,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
    minHeight: 56,
  },
  textInputValid: {
    borderColor: WellnessTheme.colors.success,
    backgroundColor: '#F0FDF4',
  },
  hintText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: WellnessTheme.colors.error,
    fontWeight: '500',
  },
  
  // Privacy Info
  privacyInfo: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    gap: WellnessTheme.spacing.sm,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    marginLeft: WellnessTheme.spacing.sm,
    lineHeight: 20,
  },
  
  // Agreement
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: WellnessTheme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    backgroundColor: WellnessTheme.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  agreementText: {
    flex: 1,
  },
  agreementMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  agreementSubText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  linkText: {
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
  },
  
  // Button
  buttonContainer: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.xl,
    minHeight: 56,
    gap: WellnessTheme.spacing.sm,
  },
  continueButtonDisabled: {
    backgroundColor: WellnessTheme.colors.textLight,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WellnessTheme.spacing.sm,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
  },
  
  // Biometric Badge
  biometricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: WellnessTheme.borderRadius.md,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    marginTop: WellnessTheme.spacing.lg,
  },
  biometricText: {
    fontSize: 14,
    fontWeight: '500',
    color: WellnessTheme.colors.success,
    marginLeft: WellnessTheme.spacing.sm,
  },
});