import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      role: 'patient' | 'caregiver';
      phoneNumber: string;
    };
  };
}

export default function OTPVerificationScreen({ navigation, route }: OTPVerificationScreenProps) {
  const insets = useSafeAreaInsets();
  const { role, phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatPhoneDisplay = (phone: string) => {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next field
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyCode(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (code?: string) => {
    const verificationCode = code || otp.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show biometric prompt
      Alert.alert(
        'Use Face ID next time?',
        'Make signing in faster and more secure with Face ID.',
        [
          {
            text: 'Not now',
            style: 'cancel',
            onPress: () => navigateToNextScreen(false)
          },
          {
            text: 'Yes',
            onPress: () => navigateToNextScreen(true)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Invalid Code', 'The verification code is incorrect. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToNextScreen = (biometricEnabled: boolean) => {
    if (role === 'patient') {
      navigation.navigate('PatientProfileForm', { phoneNumber, biometricEnabled });
    } else {
      navigation.navigate('CaregiverBasics', { phoneNumber, biometricEnabled });
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCountdown(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  const handleCallCode = () => {
    Alert.alert(
      'Voice Call',
      'We will call you now and speak the verification code.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Me', onPress: () => {
          Alert.alert('Calling...', 'You will receive a call shortly with your verification code.');
        }}
      ]
    );
  };

  const handleUseEmail = () => {
    Alert.alert(
      'Use Email Instead',
      'Would you like to receive the verification code via email?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Email', onPress: () => {
          // Navigate to email verification
          navigation.navigate('EmailVerification', { role });
        }}
      ]
    );
  };

  const handleTextToSpeech = () => {
    const text = `Code verification step. Enter the 6-digit code sent to ${formatPhoneDisplay(phoneNumber)}. ${countdown > 0 ? `Code expires in ${Math.floor(countdown / 60)} minutes and ${countdown % 60} seconds.` : 'You can request a new code.'}`;
    AccessibilityInfo.announceForAccessibility(text);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.dotComplete]} />
              <View style={[styles.dot, styles.dotComplete]} />
              <View style={[styles.dot, styles.dotActive]} />
            </View>
            <Text style={styles.progressText}>Step 3 of 3</Text>
          </View>

          {/* Content */}
          <View style={styles.mainContent}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="chatbox" size={48} color={WellnessTheme.colors.primary} />
              </View>
              
              <Text style={styles.title} accessibilityRole="header">
                Enter verification code
              </Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to{'\n'}
                <Text style={styles.phoneNumber}>{formatPhoneDisplay(phoneNumber)}</Text>
              </Text>
            </View>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    isLoading && styles.otpInputDisabled
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!isLoading}
                  accessibilityLabel={`Digit ${index + 1} of verification code`}
                  accessibilityHint="Enter one digit"
                />
              ))}
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              {countdown > 0 ? (
                <Text style={styles.timerText}>
                  Code expires in {formatTime(countdown)}
                </Text>
              ) : (
                <Text style={styles.expiredText}>
                  Code expired
                </Text>
              )}
            </View>
          </View>

          {/* Verify Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                (otp.join('').length !== 6 || isLoading) && styles.verifyButtonDisabled
              ]}
              onPress={() => handleVerifyCode()}
              disabled={otp.join('').length !== 6 || isLoading}
              accessibilityRole="button"
              accessibilityLabel="Verify code"
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingSpinner} />
                  <Text style={styles.verifyButtonText}>Verifying...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.verifyButtonText}>Verify Code</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Alternative Options */}
          <View style={styles.alternativeOptions}>
            <TouchableOpacity
              style={[styles.optionButton, !canResend && styles.optionButtonDisabled]}
              onPress={handleResendCode}
              disabled={!canResend}
              accessibilityRole="button"
              accessibilityLabel={canResend ? 'Resend code' : `Resend code in ${formatTime(countdown)}`}
            >
              <Ionicons 
                name="refresh" 
                size={16} 
                color={canResend ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight} 
              />
              <Text style={[
                styles.optionButtonText,
                !canResend && styles.optionButtonTextDisabled
              ]}>
                {canResend ? 'Resend code' : `Resend (${formatTime(countdown)})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleCallCode}
              accessibilityRole="button"
              accessibilityLabel="Call me with the code"
            >
              <Ionicons name="call" size={16} color={WellnessTheme.colors.primary} />
              <Text style={styles.optionButtonText}>Call me with the code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleUseEmail}
              accessibilityRole="button"
              accessibilityLabel="Use email instead"
            >
              <Ionicons name="mail" size={16} color={WellnessTheme.colors.primary} />
              <Text style={styles.optionButtonText}>Use email instead</Text>
            </TouchableOpacity>
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
  },
  phoneNumber: {
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  
  // OTP Input
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    backgroundColor: WellnessTheme.colors.cardBackground,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: WellnessTheme.colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: WellnessTheme.colors.primary,
    backgroundColor: WellnessTheme.colors.primaryLight,
  },
  otpInputDisabled: {
    backgroundColor: WellnessTheme.colors.background,
    opacity: 0.6,
  },
  
  // Timer
  timerContainer: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
  },
  timerText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    fontWeight: '500',
  },
  expiredText: {
    fontSize: 14,
    color: WellnessTheme.colors.error,
    fontWeight: '600',
  },
  
  // Button
  buttonContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.xl,
    minHeight: 56,
  },
  verifyButtonDisabled: {
    backgroundColor: WellnessTheme.colors.textLight,
  },
  verifyButtonText: {
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
  
  // Alternative Options
  alternativeOptions: {
    gap: WellnessTheme.spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.xl,
    borderRadius: WellnessTheme.borderRadius.md,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    minHeight: 48,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: WellnessTheme.colors.primary,
    marginLeft: WellnessTheme.spacing.sm,
  },
  optionButtonTextDisabled: {
    color: WellnessTheme.colors.textLight,
  },
});