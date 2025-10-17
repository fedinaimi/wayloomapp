import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { WellnessTheme } from '../../utils/wellnessTheme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>JD</Text>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@email.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness Profile</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>29 years old</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Wellness Goal</Text>
          <Text style={styles.infoValue}>Mindful Living & Stress Reduction</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Experience Level</Text>
          <Text style={styles.infoValue}>Beginner</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Meditation Style</Text>
          <Text style={styles.historyText}>Mindfulness, Breathing exercises</Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Session Duration</Text>
          <Text style={styles.historyText}>10-15 minutes</Text>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Preferred Time</Text>
          <Text style={styles.historyText}>Morning (7:00 AM)</Text>
        </View>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>
          ⚙️ More profile settings coming soon
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  content: {
    padding: WellnessTheme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
    paddingVertical: WellnessTheme.spacing.lg,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  profileAvatarText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  userEmail: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
  section: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  infoCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...WellnessTheme.shadows.sm,
  },
  infoLabel: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
  infoValue: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  historyCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  historyTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  historyText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  placeholderSection: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.xl,
    alignItems: 'center',
    marginTop: WellnessTheme.spacing.xl,
  },
  placeholderText: {
    fontSize: WellnessTheme.fontSize.lg,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
  },
});