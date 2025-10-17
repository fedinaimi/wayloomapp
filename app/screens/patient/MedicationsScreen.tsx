import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { WellnessTheme } from '../../utils/wellnessTheme';

export default function MedicationsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Medications</Text>
        <Text style={styles.subtitle}>Manage your medication schedule</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Medications</Text>
        
        <View style={styles.medicationCard}>
          <Text style={styles.medicationName}>Aspirin</Text>
          <Text style={styles.medicationDose}>100mg - Morning</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Taken</Text>
          </View>
        </View>

        <View style={styles.medicationCard}>
          <Text style={styles.medicationName}>Metformin</Text>
          <Text style={styles.medicationDose}>500mg - Evening</Text>
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
        </View>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>
          📋 Medication management features will be implemented here
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
    marginBottom: WellnessTheme.spacing.xl,
  },
  title: {
    fontSize: WellnessTheme.fontSize.xxxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  subtitle: {
    fontSize: WellnessTheme.fontSize.lg,
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
  medicationCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...WellnessTheme.shadows.sm,
  },
  medicationName: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  medicationDose: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: WellnessTheme.colors.secondary,
    paddingHorizontal: WellnessTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: WellnessTheme.borderRadius.sm,
  },
  pendingBadge: {
    backgroundColor: WellnessTheme.colors.warning,
  },
  statusText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.white,
    fontWeight: '600',
  },
  placeholderSection: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
  },
});