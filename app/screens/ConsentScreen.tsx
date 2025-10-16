import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WellnessTheme } from '../utils/wellnessTheme';
import WellnessButton from '../components/WellnessButton';
import { RootStackParamList } from '../types/navigation';

type ConsentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Consent'>;

type Props = {
  navigation: ConsentScreenNavigationProp;
};

export default function ConsentScreen({ navigation }: Props) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedMedical, setAcceptedMedical] = useState(false);

  const allAccepted = acceptedTerms && acceptedPrivacy && acceptedMedical;

  const handleContinue = () => {
    if (allAccepted) {
      // Navigate to main app - for now go to Home
      navigation.navigate('MainTabs');
    }
  };

  const ConsentCheckbox = ({ 
    checked, 
    onPress, 
    title, 
    description 
  }: { 
    checked: boolean; 
    onPress: () => void; 
    title: string; 
    description: string; 
  }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.checkboxContent}>
        <Text style={styles.checkboxTitle}>{title}</Text>
        <Text style={styles.checkboxDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/wayloomlogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Consent & Privacy</Text>
        <Text style={styles.subtitle}>
          Please review and accept the following terms to continue using our medical services
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.consentSection}>
          <Text style={styles.sectionTitle}>Required Consents</Text>
          
          <ConsentCheckbox
            checked={acceptedTerms}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            title="Terms of Service"
            description="I agree to the terms and conditions for using this medical platform and services."
          />

          <ConsentCheckbox
            checked={acceptedPrivacy}
            onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
            title="Privacy Policy"
            description="I understand how my personal and medical data will be collected, used, and protected."
          />

          <ConsentCheckbox
            checked={acceptedMedical}
            onPress={() => setAcceptedMedical(!acceptedMedical)}
            title="Medical Information Consent"
            description="I consent to sharing medical information with healthcare providers on this platform for treatment purposes."
          />
        </View>

        <View style={styles.placeholderSection}>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>📄 Detailed Terms</Text>
            <Text style={styles.placeholderText}>
              Complete terms of service, privacy policy, and medical consent forms will be displayed here.
            </Text>
            <Text style={styles.placeholderNote}>
              Note: This content will be completed later as specified.
            </Text>
          </View>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>🔒 Data Protection</Text>
            <Text style={styles.placeholderText}>
              Information about HIPAA compliance, data encryption, and patient privacy rights.
            </Text>
          </View>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>⚕️ Medical Disclaimer</Text>
            <Text style={styles.placeholderText}>
              Important medical disclaimers and limitations of the telemedicine services.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            By continuing, you acknowledge that you have read and understood all terms and consent to the processing of your data as described.
          </Text>
        </View>

        <WellnessButton
          title="Accept & Continue"
          onPress={handleContinue}
          disabled={!allAccepted}
          containerStyle={styles.continueButton}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: WellnessTheme.spacing.xl,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingBottom: WellnessTheme.spacing.lg,
  },
  logoContainer: {
    marginBottom: WellnessTheme.spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  subtitle: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  consentSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    backgroundColor: WellnessTheme.colors.white,
    padding: WellnessTheme.spacing.md,
    borderRadius: WellnessTheme.borderRadius.md,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: WellnessTheme.colors.border,
    borderRadius: 4,
    marginRight: WellnessTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  checkmark: {
    color: WellnessTheme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  checkboxDescription: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 18,
  },
  placeholderSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  placeholderCard: {
    backgroundColor: WellnessTheme.colors.white,
    padding: WellnessTheme.spacing.lg,
    borderRadius: WellnessTheme.borderRadius.md,
    marginBottom: WellnessTheme.spacing.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.divider,
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  placeholderText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: WellnessTheme.spacing.sm,
  },
  placeholderNote: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textLight,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingBottom: WellnessTheme.spacing.xl,
  },
  footerNote: {
    backgroundColor: WellnessTheme.colors.primaryLight,
    padding: WellnessTheme.spacing.md,
    borderRadius: WellnessTheme.borderRadius.md,
    marginBottom: WellnessTheme.spacing.lg,
  },
  footerNoteText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  continueButton: {
    marginBottom: WellnessTheme.spacing.md,
  },
  backText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});