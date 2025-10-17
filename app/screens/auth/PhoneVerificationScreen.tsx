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

interface PhoneVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      role: 'patient' | 'caregiver';
    };
  };
}

export default function PhoneVerificationScreen({ navigation, route }: PhoneVerificationScreenProps) {
  const insets = useSafeAreaInsets();
  const { role } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
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
    setPhoneNumber(formatted);
  };

  const isValidPhone = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 10;
  };

  const handleSendCode = async () => {
    if (!isValidPhone()) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to OTP screen
      navigation.navigate('OTPVerification', { 
        role, 
        phoneNumber: phoneNumber.replace(/\D/g, '') 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = () => {
    const text = `Phone verification step. Enter your phone number to receive a 6-digit verification code. No password needed. Current role: ${role}.`;
    AccessibilityInfo.announceForAccessibility(text);
  };

  const handleBack = () => {
    navigation.goBack();
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
              onPress={handleBack}
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

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.dotComplete]} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.progressText}>Step 2 of 3</Text>
          </View>

          {/* Content */}
          <View style={styles.mainContent}>
            <View style={styles.titleSection}>
              <Text style={styles.title} accessibilityRole="header">
                Enter your phone number
              </Text>
              <Text style={styles.subtitle}>
                We'll send you a 6-digit verification code
              </Text>
            </View>

            {/* Phone Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  placeholder="(555) 123-4567"
                  placeholderTextColor={WellnessTheme.colors.textLight}
                  keyboardType="phone-pad"
                  maxLength={14} // (XXX) XXX-XXXX
                  autoFocus
                  accessibilityLabel="Phone number input"
                  accessibilityHint="Enter your 10-digit phone number"
                />
              </View>
              
              <View style={styles.hintContainer}>
                <Ionicons name="information-circle-outline" size={16} color={WellnessTheme.colors.textSecondary} />
                <Text style={styles.hintText}>
                  No password needed. We'll text a code.
                </Text>
              </View>
            </View>

            {/* Role Badge */}
            <View style={styles.roleBadge}>
              <Ionicons 
                name={role === 'patient' ? 'person' : 'people'} 
                size={16} 
                color={WellnessTheme.colors.primary} 
              />
              <Text style={styles.roleBadgeText}>
                Signing up as {role === 'patient' ? 'Patient' : 'Caregiver'}
              </Text>
            </View>
          </View>

          {/* Send Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !isValidPhone() && styles.sendButtonDisabled,
                isLoading && styles.sendButtonLoading
              ]}
              onPress={handleSendCode}
              disabled={!isValidPhone() || isLoading}
              accessibilityRole="button"
              accessibilityLabel="Send verification code"
              accessibilityHint="Sends a 6-digit code to your phone number"
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingSpinner} />
                  <Text style={styles.sendButtonText}>Sending...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="send" size={20} color="white" />
                  <Text style={styles.sendButtonText}>Send me a 6-digit code</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Security Info */}
          <View style={styles.securityInfo}>
            <View style={styles.securityRow}>
              <Ionicons name="shield-checkmark" size={16} color={WellnessTheme.colors.success} />
              <Text style={styles.securityText}>Your number is encrypted and secure</Text>
            </View>
            <View style={styles.securityRow}>
              <Ionicons name="time" size={16} color={WellnessTheme.colors.textSecondary} />
              <Text style={styles.securityText}>Code expires in 2 minutes</Text>
            </View>
          </View>
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
  dotComplete: {
    backgroundColor: WellnessTheme.colors.success,
  },
  progressText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Content
  mainContent: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xxxl,
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
  },
  
  // Input
  inputSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    overflow: 'hidden',
    marginBottom: WellnessTheme.spacing.md,
  },
  countryCode: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    backgroundColor: WellnessTheme.colors.background,
    borderRightWidth: 1,
    borderRightColor: WellnessTheme.colors.border,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    fontSize: 18,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  hintText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    marginLeft: WellnessTheme.spacing.sm,
    lineHeight: 20,
  },
  
  // Role Badge
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primaryLight,
    borderRadius: WellnessTheme.borderRadius.md,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.xl,
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: WellnessTheme.colors.primary,
    marginLeft: WellnessTheme.spacing.sm,
  },
  
  // Button
  buttonContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.xl,
    minHeight: 56, // Accessibility
  },
  sendButtonDisabled: {
    backgroundColor: WellnessTheme.colors.textLight,
  },
  sendButtonLoading: {
    backgroundColor: WellnessTheme.colors.textSecondary,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: WellnessTheme.spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    marginRight: WellnessTheme.spacing.sm,
  },
  
  // Security Info
  securityInfo: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    marginLeft: WellnessTheme.spacing.sm,
    lineHeight: 20,
  },
});