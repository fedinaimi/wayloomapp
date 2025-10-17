import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaregiverGreetingSection from '../../components/CaregiverGreetingSection';
import CaregiverHeader from '../../components/CaregiverHeader';
import { WellnessTheme } from '../../utils/wellnessTheme';

// Mock data for patients
const mockPatients = [
  {
    id: 'pt_1',
    name: 'Sam Wilson',
    age: 74,
    status: 'active',
    lastActivity: '2 hours ago',
    avatarInitials: 'SW',
    condition: 'Memory Support',
    emergencyContact: '+1 (555) 123-4567'
  },
  {
    id: 'pt_2',
    name: 'Mary Johnson',
    age: 68,
    status: 'active',
    lastActivity: '1 day ago',
    avatarInitials: 'MJ',
    condition: 'Diabetes Management',
    emergencyContact: '+1 (555) 987-6543'
  }
];

export default function CaregiverPatientsScreen() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const handleAddPatient = () => {
    Alert.alert(
      'Add Patient',
      'Choose how to connect with a patient',
      [
        { text: 'Send SMS Invite', onPress: () => console.log('SMS invite') },
        { text: 'Scan QR Code', onPress: () => console.log('QR scan') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePatientAction = (patientId: string, action: string) => {
    Alert.alert('Action', `${action} for patient ${patientId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return WellnessTheme.colors.success;
      case 'inactive': return WellnessTheme.colors.textSecondary;
      case 'alert': return WellnessTheme.colors.warning;
      default: return WellnessTheme.colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      <CaregiverHeader 
        caregiverName="Alex"
        notificationCount={2}
        onNotificationPress={() => Alert.alert('Notifications', 'View all notifications')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <CaregiverGreetingSection 
          title="Your Patients"
          subtitle="Manage and monitor patient care"
        />
        
        {/* Add Patient Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.addPatientButton} onPress={handleAddPatient}>
            <Ionicons name="add" size={24} color={WellnessTheme.colors.white} />
            <Text style={styles.addPatientText}>Add New Patient</Text>
          </TouchableOpacity>
        </View>
        
        {/* Patient List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Patients ({mockPatients.length})</Text>
          
          {mockPatients.map((patient) => (
            <TouchableOpacity 
              key={patient.id} 
              style={styles.patientCard}
              onPress={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
            >
              <View style={styles.patientHeader}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.avatarText}>{patient.avatarInitials}</Text>
                </View>
                
                <View style={styles.patientInfo}>
                  <View style={styles.patientNameRow}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(patient.status) }]} />
                  </View>
                  <Text style={styles.patientAge}>Age {patient.age} · {patient.condition}</Text>
                  <Text style={styles.lastActivity}>Last activity: {patient.lastActivity}</Text>
                </View>

                <TouchableOpacity style={styles.expandButton}>
                  <Ionicons 
                    name={selectedPatient === patient.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={WellnessTheme.colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>

              {selectedPatient === patient.id && (
                <View style={styles.patientDetails}>
                  <View style={styles.patientActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handlePatientAction(patient.id, 'View Overview')}
                    >
                      <Ionicons name="person-outline" size={18} color={WellnessTheme.colors.primary} />
                      <Text style={styles.actionText}>Overview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handlePatientAction(patient.id, 'View Reports')}
                    >
                      <Ionicons name="document-text-outline" size={18} color={WellnessTheme.colors.primary} />
                      <Text style={styles.actionText}>Reports</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handlePatientAction(patient.id, 'Add Note')}
                    >
                      <Ionicons name="create-outline" size={18} color={WellnessTheme.colors.primary} />
                      <Text style={styles.actionText}>Notes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handlePatientAction(patient.id, 'Care Plan')}
                    >
                      <Ionicons name="clipboard-outline" size={18} color={WellnessTheme.colors.primary} />
                      <Text style={styles.actionText}>Care Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handlePatientAction(patient.id, 'Share Access')}
                    >
                      <Ionicons name="share-outline" size={18} color={WellnessTheme.colors.primary} />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.emergencyButton]}
                      onPress={() => Alert.alert('Emergency Contact', patient.emergencyContact)}
                    >
                      <Ionicons name="call" size={18} color={WellnessTheme.colors.error} />
                      <Text style={[styles.actionText, styles.emergencyText]}>Emergency</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.patientStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>87%</Text>
                      <Text style={styles.statLabel}>Medication Adherence</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>15</Text>
                      <Text style={styles.statLabel}>Tests This Month</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>3</Text>
                      <Text style={styles.statLabel}>Alerts This Week</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleAddPatient}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="person-add-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Add Patient</Text>
              <Text style={styles.quickActionSubtitle}>Send invite or scan QR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="qr-code-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Share My QR</Text>
              <Text style={styles.quickActionSubtitle}>Let patients connect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="settings-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Manage Access</Text>
              <Text style={styles.quickActionSubtitle}>Review permissions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="document-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Export Data</Text>
              <Text style={styles.quickActionSubtitle}>Download reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information Card */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle" size={24} color={WellnessTheme.colors.info} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Patient Privacy</Text>
              <Text style={styles.infoText}>
                You can only see information that patients have explicitly shared with you. 
                Access can be modified or revoked at any time by the patient.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  addPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.md,
  },
  addPatientText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.white,
    marginLeft: WellnessTheme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: WellnessTheme.spacing.xl,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.md,
  },
  patientCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: WellnessTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  avatarText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientName: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginRight: WellnessTheme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  patientAge: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: 2,
  },
  lastActivity: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textLight,
  },
  expandButton: {
    padding: WellnessTheme.spacing.xs,
  },
  patientDetails: {
    marginTop: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: WellnessTheme.colors.border,
  },
  patientActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: WellnessTheme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.background,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
    marginBottom: WellnessTheme.spacing.sm,
    width: '48%',
  },
  emergencyButton: {
    backgroundColor: WellnessTheme.colors.error + '10',
  },
  actionText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
    marginLeft: WellnessTheme.spacing.xs,
  },
  emergencyText: {
    color: WellnessTheme.colors.error,
  },
  patientStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: WellnessTheme.colors.background,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.sm,
  },
  quickActionTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: WellnessTheme.colors.info + '10',
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: WellnessTheme.spacing.md,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  infoText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});