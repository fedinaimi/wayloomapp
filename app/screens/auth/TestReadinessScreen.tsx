import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WellnessTheme } from '../../utils/wellnessTheme';

interface TestReadinessScreenProps {
  navigation: any;
  route: {
    params: {
      patientData: any;
    };
  };
}

export default function TestReadinessScreen({
  navigation,
  route,
}: TestReadinessScreenProps) {
  const insets = useSafeAreaInsets();
  const { patientData } = route.params;
  const [isStarting, setIsStarting] = useState(false);

  const age = new Date().getFullYear() - patientData.birthYear;

  const getHealthSummary = () => {
    const issues = [];
    if (patientData.visionProblems && patientData.visionProblems !== 'none') {
      issues.push(`Vision: ${patientData.visionProblems}`);
    }
    if (patientData.hearingProblems && patientData.hearingProblems !== 'none') {
      issues.push(`Hearing: ${patientData.hearingProblems}`);
    }
    if (patientData.mobilityProblems && patientData.mobilityProblems !== 'none') {
      issues.push(`Mobility: ${patientData.mobilityProblems}`);
    }
    if (patientData.chronicDiseases && patientData.chronicDiseases.length > 0) {
      issues.push(`Chronic: ${patientData.chronicDiseases.join(', ')}`);
    }
    return issues.length > 0 ? issues : ['No significant health issues reported'];
  };

  const handleStartTest = async () => {
    setIsStarting(true);
    try {
      // Simulate API call to save profile and prepare test
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to cognitive test
      navigation.navigate('CognitiveTest', {
        patientData,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start test. Please try again.');
      setIsStarting(false);
    }
  };

  const handleReviewProfile = () => {
    // Allow user to go back and edit profile
    navigation.goBack();
  };

  const handleSkipTest = () => {
    Alert.alert(
      'Skip Test',
      'Are you sure you want to skip the cognitive test?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            // Navigate to main dashboard
            navigation.navigate('MainTabs', { patientData });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={WellnessTheme.colors.success} />
          </View>
          <Text style={styles.title}>Profile Complete!</Text>
          <Text style={styles.subtitle}>
            Your demographic information has been saved successfully
          </Text>
        </View>

        {/* Profile Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Your Profile Summary</Text>

          {/* Personal Info */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={20} color={WellnessTheme.colors.primary} />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Name:</Text>
                <Text style={styles.summaryValue}>
                  {patientData.firstName} {patientData.lastName}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Age:</Text>
                <Text style={styles.summaryValue}>{age} years old</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gender:</Text>
                <Text style={styles.summaryValue}>
                  {patientData.gender.charAt(0).toUpperCase() + patientData.gender.slice(1)}
                </Text>
              </View>
              {patientData.address && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Location:</Text>
                  <Text style={styles.summaryValue}>{patientData.address.city}, {patientData.address.country}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Health Info */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="heart" size={20} color={WellnessTheme.colors.primary} />
              <Text style={styles.cardTitle}>Health Information</Text>
            </View>
            <View style={styles.cardContent}>
              {getHealthSummary().map((issue, index) => (
                <View key={index} style={styles.summaryRow}>
                  <Ionicons name="checkmark-circle" size={16} color={WellnessTheme.colors.success} />
                  <Text style={styles.summaryValue}>{issue}</Text>
                </View>
              ))}
              {patientData.currentMedications && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Medications:</Text>
                  <Text style={styles.summaryValue}>{patientData.currentMedications}</Text>
                </View>
              )}
              {patientData.allergies && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Allergies:</Text>
                  <Text style={styles.summaryValue}>{patientData.allergies}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Education & Lifestyle */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="book" size={20} color={WellnessTheme.colors.primary} />
              <Text style={styles.cardTitle}>Education & Lifestyle</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Education:</Text>
                <Text style={styles.summaryValue}>
                  {patientData.educationLevel.charAt(0).toUpperCase() + patientData.educationLevel.slice(1)}
                </Text>
              </View>
              {patientData.occupation && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Occupation:</Text>
                  <Text style={styles.summaryValue}>{patientData.occupation}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Living:</Text>
                <Text style={styles.summaryValue}>
                  {patientData.livingArrangement.charAt(0).toUpperCase() + patientData.livingArrangement.slice(1)}
                </Text>
              </View>
              {patientData.languagesSpoken && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Languages:</Text>
                  <Text style={styles.summaryValue}>{patientData.languagesSpoken}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Location Data */}
          {patientData.location && (
            <View style={styles.summaryCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="location" size={20} color={WellnessTheme.colors.primary} />
                <Text style={styles.cardTitle}>Location Data</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Latitude:</Text>
                  <Text style={styles.summaryValue}>
                    {patientData.location.latitude.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Longitude:</Text>
                  <Text style={styles.summaryValue}>
                    {patientData.location.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Emergency Contact */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="call" size={20} color={WellnessTheme.colors.primary} />
              <Text style={styles.cardTitle}>Emergency Contact</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Name:</Text>
                <Text style={styles.summaryValue}>{patientData.emergencyContactName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phone:</Text>
                <Text style={styles.summaryValue}>{patientData.emergencyContactPhone}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Relationship:</Text>
                <Text style={styles.summaryValue}>{patientData.emergencyContactRelationship}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cognitive Test Info */}
        <View style={styles.testInfoSection}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color={WellnessTheme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Ready for Cognitive Test?</Text>
              <Text style={styles.infoText}>
                The cognitive screening test takes about 8-10 minutes. It will assess your memory,
                attention, orientation, and other cognitive abilities.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              isStarting && styles.startButtonDisabled,
            ]}
            onPress={handleStartTest}
            disabled={isStarting}
          >
            <Ionicons name="play-circle" size={20} color="white" />
            <Text style={styles.startButtonText}>
              {isStarting ? 'Starting Test...' : 'Start Cognitive Test'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReviewProfile}
            disabled={isStarting}
          >
            <Ionicons name="pencil" size={20} color={WellnessTheme.colors.primary} />
            <Text style={styles.secondaryButtonText}>Review Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkipTest}
            disabled={isStarting}
          >
            <Ionicons name="arrow-forward" size={20} color={WellnessTheme.colors.textSecondary} />
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomInfoText}>
            All your information is encrypted and secure. You can update your profile anytime.
          </Text>
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
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.lg,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xxxl,
  },
  successIcon: {
    marginBottom: WellnessTheme.spacing.lg,
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
    textAlign: 'center',
    lineHeight: 24,
  },

  // Summary Section
  summarySection: {
    marginBottom: WellnessTheme.spacing.xxxl,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: '#F8FAFB',
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginLeft: WellnessTheme.spacing.md,
  },
  cardContent: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    gap: WellnessTheme.spacing.md,
  },

  // Summary Row
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: WellnessTheme.colors.textSecondary,
    flex: 0.4,
  },
  summaryValue: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
    flex: 0.6,
    textAlign: 'right',
  },

  // Test Info
  testInfoSection: {
    marginBottom: WellnessTheme.spacing.xxxl,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.primary,
    padding: WellnessTheme.spacing.lg,
    gap: WellnessTheme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.primary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },

  // Button Container
  buttonContainer: {
    gap: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.lg,
  },

  // Start Button
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.xl,
    minHeight: 56,
    gap: WellnessTheme.spacing.md,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Secondary Button
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    paddingVertical: WellnessTheme.spacing.lg,
    paddingHorizontal: WellnessTheme.spacing.xl,
    minHeight: 56,
    gap: WellnessTheme.spacing.md,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },

  // Bottom Info
  bottomInfo: {
    backgroundColor: '#F8FAFB',
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.lg,
  },
  bottomInfoText: {
    fontSize: 13,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
