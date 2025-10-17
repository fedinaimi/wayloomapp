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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../../utils/wellnessTheme';

interface CaregiverBasicsScreenProps {
  navigation: any;
  route: {
    params: {
      phoneNumber: string;
      biometricEnabled: boolean;
    };
  };
}

const relationships = [
  { id: 'spouse', label: 'Spouse/Partner', icon: 'heart' },
  { id: 'child', label: 'Adult Child', icon: 'people' },
  { id: 'parent', label: 'Parent', icon: 'person' },
  { id: 'sibling', label: 'Sibling', icon: 'people-circle' },
  { id: 'friend', label: 'Friend', icon: 'hand-left' },
  { id: 'nurse', label: 'Healthcare Professional', icon: 'medical' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

export default function CaregiverBasicsScreen({ navigation, route }: CaregiverBasicsScreenProps) {
  const insets = useSafeAreaInsets();
  const { phoneNumber, biometricEnabled } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('');
  const [otherRelationship, setOtherRelationship] = useState('');
  const [agreedToConsent, setAgreedToConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = () => {
    const hasValidName = firstName.trim().length >= 2 && lastName.trim().length >= 2;
    const hasValidRelationship = selectedRelationship && 
      (selectedRelationship !== 'other' || otherRelationship.trim().length >= 2);
    return hasValidName && hasValidRelationship && agreedToConsent;
  };

  const handleContinue = async () => {
    if (!canContinue()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call to create caregiver account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to patient connection screen
      navigation.navigate('PatientConnect', {
        caregiverData: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          relationship: selectedRelationship === 'other' ? otherRelationship.trim() : 
            relationships.find(r => r.id === selectedRelationship)?.label,
          phoneNumber,
          biometricEnabled
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = () => {
    const text = `Caregiver setup. Enter your name, select your relationship to the patient, and confirm you have permission to support them. Current entries: ${firstName || 'no first name'}, ${lastName || 'no last name'}, ${selectedRelationship ? relationships.find(r => r.id === selectedRelationship)?.label : 'no relationship selected'}.`;
    AccessibilityInfo.announceForAccessibility(text);
  };

  const toggleConsent = () => {
    setAgreedToConsent(!agreedToConsent);
    AccessibilityInfo.announceForAccessibility(
      agreedToConsent ? 'Consent agreement unchecked' : 'Consent agreement checked'
    );
  };

  const RelationshipOption = ({ relationship }: { relationship: typeof relationships[0] }) => {
    const isSelected = selectedRelationship === relationship.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.relationshipOption,
          isSelected && styles.relationshipOptionSelected
        ]}
        onPress={() => setSelectedRelationship(relationship.id)}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={relationship.label}
        accessibilityHint="Select your relationship to the patient"
      >
        <View style={[
          styles.relationshipIcon,
          isSelected && styles.relationshipIconSelected
        ]}>
          <Ionicons 
            name={relationship.icon as any} 
            size={20} 
            color={isSelected ? WellnessTheme.colors.primary : WellnessTheme.colors.textSecondary} 
          />
        </View>
        
        <Text style={[
          styles.relationshipLabel,
          isSelected && styles.relationshipLabelSelected
        ]}>
          {relationship.label}
        </Text>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color={WellnessTheme.colors.primary} />
        )}
      </TouchableOpacity>
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
                <Ionicons name="people-circle" size={48} color={WellnessTheme.colors.primary} />
              </View>
              
              <Text style={styles.title} accessibilityRole="header">
                Caregiver Information
              </Text>
              <Text style={styles.subtitle}>
                Help us understand your relationship and how you'll provide support
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      firstName.trim().length >= 2 && styles.textInputValid
                    ]}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor={WellnessTheme.colors.textLight}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={50}
                    accessibilityLabel="First name input"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      lastName.trim().length >= 2 && styles.textInputValid
                    ]}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor={WellnessTheme.colors.textLight}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={50}
                    accessibilityLabel="Last name input"
                  />
                </View>
              </View>

              {/* Relationship */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Relationship</Text>
                <Text style={styles.inputHint}>
                  How are you connected to the person you'll be caring for?
                </Text>
                
                <View style={styles.relationshipGrid}>
                  {relationships.map((relationship) => (
                    <RelationshipOption key={relationship.id} relationship={relationship} />
                  ))}
                </View>

                {/* Other Relationship Input */}
                {selectedRelationship === 'other' && (
                  <View style={styles.otherRelationshipContainer}>
                    <TextInput
                      style={[
                        styles.textInput,
                        otherRelationship.trim().length >= 2 && styles.textInputValid
                      ]}
                      value={otherRelationship}
                      onChangeText={setOtherRelationship}
                      placeholder="Please specify your relationship"
                      placeholderTextColor={WellnessTheme.colors.textLight}
                      autoCapitalize="words"
                      maxLength={50}
                      accessibilityLabel="Other relationship input"
                    />
                  </View>
                )}
              </View>

              {/* Consent */}
              <TouchableOpacity
                style={styles.consentContainer}
                onPress={toggleConsent}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreedToConsent }}
                accessibilityLabel="Consent to provide care"
                accessibilityHint="Tap to confirm you have permission to support this person"
              >
                <View style={[
                  styles.checkbox,
                  agreedToConsent && styles.checkboxChecked
                ]}>
                  {agreedToConsent && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <View style={styles.consentText}>
                  <Text style={styles.consentMainText}>
                    I confirm I have permission to support this person
                  </Text>
                  <Text style={styles.consentSubText}>
                    I have explicit consent from the person I'll be caring for to access their health information and provide support through this app.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Privacy Info */}
              <View style={styles.privacyInfo}>
                <View style={styles.privacyRow}>
                  <Ionicons name="shield-checkmark" size={16} color={WellnessTheme.colors.success} />
                  <Text style={styles.privacyText}>All care data is encrypted and secure</Text>
                </View>
                <View style={styles.privacyRow}>
                  <Ionicons name="people" size={16} color={WellnessTheme.colors.textSecondary} />
                  <Text style={styles.privacyText}>Only authorized caregivers can access patient data</Text>
                </View>
              </View>
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
              accessibilityLabel="Continue to patient connection"
              accessibilityHint="Creates your caregiver account and continues to patient connection"
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
  nameRow: {
    flexDirection: 'row',
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
  inputHint: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: WellnessTheme.spacing.md,
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
  
  // Relationship Selection
  relationshipGrid: {
    gap: WellnessTheme.spacing.sm,
  },
  relationshipOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    padding: WellnessTheme.spacing.lg,
    minHeight: 60,
  },
  relationshipOptionSelected: {
    borderColor: WellnessTheme.colors.primary,
    backgroundColor: WellnessTheme.colors.primaryLight,
  },
  relationshipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WellnessTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  relationshipIconSelected: {
    backgroundColor: 'white',
  },
  relationshipLabel: {
    flex: 1,
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  relationshipLabelSelected: {
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
  },
  otherRelationshipContainer: {
    marginTop: WellnessTheme.spacing.md,
  },
  
  // Consent
  consentContainer: {
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
  consentText: {
    flex: 1,
  },
  consentMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  consentSubText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
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