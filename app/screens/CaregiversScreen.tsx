import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { WellnessTheme } from '../utils/wellnessTheme';

export default function CaregiversScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Caregivers</Text>
        <Text style={styles.subtitle}>Your healthcare team</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Care</Text>
        
        <View style={styles.caregiverCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SJ</Text>
          </View>
          <View style={styles.caregiverInfo}>
            <Text style={styles.caregiverName}>Dr. Sarah Johnson</Text>
            <Text style={styles.caregiverSpecialty}>General Practitioner</Text>
            <Text style={styles.caregiverContact}>+1 (555) 123-4567</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialists</Text>
        
        <View style={styles.caregiverCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MC</Text>
          </View>
          <View style={styles.caregiverInfo}>
            <Text style={styles.caregiverName}>Dr. Michael Chen</Text>
            <Text style={styles.caregiverSpecialty}>Cardiologist</Text>
            <Text style={styles.caregiverContact}>+1 (555) 234-5678</Text>
          </View>
        </View>

        <View style={styles.caregiverCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>LW</Text>
          </View>
          <View style={styles.caregiverInfo}>
            <Text style={styles.caregiverName}>Dr. Lisa Williams</Text>
            <Text style={styles.caregiverSpecialty}>Neurologist</Text>
            <Text style={styles.caregiverContact}>+1 (555) 345-6789</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>Emergency Services</Text>
          <Text style={styles.emergencyNumber}>911</Text>
        </View>

        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>Poison Control</Text>
          <Text style={styles.emergencyNumber}>1-800-222-1222</Text>
        </View>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>
          👥 Caregiver management features will be implemented here
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
  caregiverCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...WellnessTheme.shadows.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: WellnessTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.lg,
  },
  avatarText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: 'bold',
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  caregiverSpecialty: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    marginBottom: 4,
  },
  caregiverContact: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  emergencyCard: {
    backgroundColor: WellnessTheme.colors.error + '10',
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: WellnessTheme.colors.error,
  },
  emergencyTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.error,
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