import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { WellnessTheme } from '../../utils/wellnessTheme';

export default function CalendarScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Your wellness schedule</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        
        <View style={styles.appointmentCard}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateDay}>15</Text>
            <Text style={styles.dateMonth}>Oct</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>Morning Meditation</Text>
            <Text style={styles.appointmentType}>Mindfulness Practice</Text>
            <Text style={styles.appointmentTime}>7:00 AM - 7:30 AM</Text>
          </View>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateDay}>15</Text>
            <Text style={styles.dateMonth}>Oct</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>Yoga Class</Text>
            <Text style={styles.appointmentType}>Gentle Flow</Text>
            <Text style={styles.appointmentTime}>6:30 PM - 7:30 PM</Text>
          </View>
        </View>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>
          📅 Full calendar features coming soon
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
  appointmentCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    flexDirection: 'row',
    ...WellnessTheme.shadows.sm,
  },
  dateColumn: {
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.sm,
  },
  dateDay: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.primary,
  },
  dateMonth: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  appointmentType: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  appointmentTime: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
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