import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CaregiverGreetingSection from '../../components/CaregiverGreetingSection';
import CaregiverHeader from '../../components/CaregiverHeader';
import { WellnessTheme } from '../../utils/wellnessTheme';

// Mock data following the specification
const mockData = {
  caregiver: { id: 'cg_1', name: 'Alex' },
  active_patient_id: 'pt_1',
  patients: [
    { id: 'pt_1', name: 'Sam', age: 74 }
  ],
  doctor_recommendations: [
    {
      id: 'rec_9',
      author: 'Dr. Smith',
      updated_at: '2025-10-17T09:00:00Z',
      items: [
        { id: 'ri_1', text: 'Short walk after lunch', status: 'ongoing' },
        { id: 'ri_2', text: 'Record sleep quality nightly', status: 'new' },
        { id: 'ri_3', text: 'Monitor blood pressure daily', status: 'ongoing' }
      ]
    }
  ],
  med_schedule_today: [
    { id: 'med_1', name: 'Donepezil', dose: '5 mg', slot: 'Morning', window: '08:00-09:00', status: 'due' },
    { id: 'med_2', name: 'Memantine', dose: '10 mg', slot: 'Evening', window: '20:00-21:00', status: 'upcoming' },
    { id: 'med_3', name: 'Vitamin D', dose: '1000 IU', slot: 'Morning', window: '08:00-09:00', status: 'taken' }
  ],
  suggested_steps: [
    { id: 'step_1', text: 'Remind Sam to take Donepezil', action: 'send_reminder' },
    { id: 'step_2', text: 'Review Dr. Smith\'s note', action: 'open_recommendations' },
    { id: 'step_3', text: 'Schedule next memory test', action: 'schedule_test' }
  ],
  alerts: [
    { id: 'al_1', type: 'missed_test', title: 'Missed memory test', time: '08:30' },
    { id: 'al_2', type: 'new_report', title: 'New report available', time: '09:15' }
  ],
  recent_activity: [
    { id: 'e1', type: 'med_taken', text: 'Donepezil taken', at: '07:55' },
    { id: 'e2', type: 'note', text: 'Slept well', at: '07:20' },
    { id: 'e3', type: 'reminder_sent', text: 'Morning reminder sent', at: '07:00' }
  ]
};

export default function CaregiverHomeScreen() {
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Morning');
  const [readAloudMode, setReadAloudMode] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return WellnessTheme.colors.primary;
      case 'ongoing': return WellnessTheme.colors.accent;
      case 'completed': return WellnessTheme.colors.success;
      case 'due': return WellnessTheme.colors.error;
      case 'taken': return WellnessTheme.colors.success;
      case 'late': return WellnessTheme.colors.error;
      default: return WellnessTheme.colors.textSecondary;
    }
  };

  const handleMarkRecommendationDone = (itemId: string) => {
    Alert.alert('Marked as Done', 'Recommendation marked as completed.');
  };

  const handleMedicationAction = (medId: string, action: 'taken' | 'snooze' | 'skip') => {
    switch (action) {
      case 'taken':
        Alert.alert('Marked as Taken', 'Medication marked as taken.');
        break;
      case 'snooze':
        Alert.alert('Snoozed', 'Reminder snoozed for 15 minutes.');
        break;
      case 'skip':
        Alert.alert('Skipped', 'Medication marked as skipped.');
        break;
    }
  };

  const handleStartGuidance = (stepId: string) => {
    Alert.alert('Starting Guidance', 'Opening guided flow for this step.');
  };

  const timeSlots = ['Morning', 'Noon', 'Evening', 'Bedtime'];
  const filteredMeds = mockData.med_schedule_today.filter(med => med.slot === selectedTimeSlot);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      <CaregiverHeader 
        caregiverName={mockData.caregiver.name}
        notificationCount={mockData.alerts.length}
        onNotificationPress={() => Alert.alert('Notifications', 'View all notifications')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <CaregiverGreetingSection 
          title={`Good ${getGreeting()}, ${mockData.caregiver.name} 👩‍⚕️`}
          subtitle={`Caring for ${mockData.patients[0].name} with compassion`}
        />
        
        {/* Doctor Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor's Recommendations</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardSubtitle}>
                From {mockData.doctor_recommendations[0].author} · Updated 2 hours ago
              </Text>
            </View>
            {mockData.doctor_recommendations[0].items.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.recommendationItem}>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationText}>• {item.text}</Text>
                  <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleMarkRecommendationDone(item.id)}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color={WellnessTheme.colors.success} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all recommendations</Text>
              <Ionicons name="chevron-forward" size={16} color={WellnessTheme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Medications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          
          {/* Time Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeChipsContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeChip,
                  selectedTimeSlot === slot && styles.timeChipActive
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text style={[
                  styles.timeChipText,
                  selectedTimeSlot === slot && styles.timeChipTextActive
                ]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Medication List */}
          <View style={styles.card}>
            {filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <View key={med.id} style={styles.medItem}>
                  <View style={styles.medIcon}>
                    <Ionicons name="medical" size={20} color={WellnessTheme.colors.primary} />
                  </View>
                  <View style={styles.medContent}>
                    <Text style={styles.medName}>{med.name} ({med.dose})</Text>
                    <Text style={styles.medTime}>Take between {med.window}</Text>
                    <View style={[styles.statusTag, { backgroundColor: getStatusColor(med.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(med.status) }]}>
                        {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  {med.status === 'due' && (
                    <View style={styles.medActions}>
                      <TouchableOpacity 
                        style={styles.primaryActionButton}
                        onPress={() => handleMedicationAction(med.id, 'taken')}
                      >
                        <Text style={styles.primaryActionText}>Mark Taken</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No medications scheduled for {selectedTimeSlot.toLowerCase()}.</Text>
            )}
          </View>
        </View>

        {/* Caregiver Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to do next</Text>
          <View style={styles.card}>
            {mockData.suggested_steps.slice(0, 3).map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
                <TouchableOpacity 
                  style={styles.startGuidanceButton}
                  onPress={() => handleStartGuidance(step.id)}
                >
                  <Ionicons name="play-circle" size={20} color={WellnessTheme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Start guidance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alerts</Text>
          <View style={styles.card}>
            {mockData.alerts.length > 0 ? (
              mockData.alerts.slice(0, 2).map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <View style={styles.alertIcon}>
                    <Ionicons name="warning" size={20} color={WellnessTheme.colors.warning} />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertTime}>At {alert.time}</Text>
                  </View>
                  <View style={styles.alertActions}>
                    <TouchableOpacity style={styles.alertActionButton}>
                      <Text style={styles.alertActionText}>Resolve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No alerts. You'll see missed tests or new reports here.</Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              { icon: 'create-outline', label: 'Add observation' },
              { icon: 'notifications-outline', label: 'Nudge patient' },
              { icon: 'alarm-outline', label: 'Create reminder' },
              { icon: 'share-outline', label: 'Share report' }
            ].map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionButton}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={24} color={WellnessTheme.colors.primary} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            {mockData.recent_activity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.text}</Text>
                  <Text style={styles.activityTime}>{activity.at}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom padding for tab navigation */}
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
  card: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    ...WellnessTheme.shadows.sm,
  },
  cardHeader: {
    marginBottom: WellnessTheme.spacing.md,
  },
  cardSubtitle: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: WellnessTheme.spacing.md,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  statusTag: {
    paddingHorizontal: WellnessTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: WellnessTheme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: WellnessTheme.fontSize.xs,
    fontWeight: '600',
  },
  actionButton: {
    padding: WellnessTheme.spacing.xs,
    marginLeft: WellnessTheme.spacing.sm,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: WellnessTheme.spacing.sm,
    marginTop: WellnessTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: WellnessTheme.colors.border,
  },
  seeAllText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
    marginRight: WellnessTheme.spacing.xs,
  },
  timeChipsContainer: {
    marginBottom: WellnessTheme.spacing.md,
  },
  timeChip: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.sm,
    marginRight: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.xl,
    backgroundColor: WellnessTheme.colors.white,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  timeChipActive: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  timeChipText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  timeChipTextActive: {
    color: WellnessTheme.colors.white,
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  medIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  medContent: {
    flex: 1,
  },
  medName: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  medTime: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  medActions: {
    marginLeft: WellnessTheme.spacing.sm,
  },
  primaryActionButton: {
    backgroundColor: WellnessTheme.colors.primary,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
  },
  primaryActionText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WellnessTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  stepNumberText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
  },
  startGuidanceButton: {
    padding: WellnessTheme.spacing.xs,
    marginLeft: WellnessTheme.spacing.sm,
  },
  ctaButton: {
    backgroundColor: WellnessTheme.colors.primary,
    paddingVertical: WellnessTheme.spacing.md,
    borderRadius: WellnessTheme.borderRadius.md,
    alignItems: 'center',
    marginTop: WellnessTheme.spacing.sm,
  },
  ctaButtonText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  alertActions: {
    marginLeft: WellnessTheme.spacing.sm,
  },
  alertActionButton: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.primary,
  },
  alertActionText: {
    color: WellnessTheme.colors.primary,
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
    minHeight: 90,
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
  quickActionLabel: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: WellnessTheme.spacing.sm,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WellnessTheme.colors.primary,
    marginTop: 6,
    marginRight: WellnessTheme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
  },
  emptyText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: WellnessTheme.spacing.lg,
  },
  bottomPadding: {
    height: 100, // Space for tab navigation
  },
});