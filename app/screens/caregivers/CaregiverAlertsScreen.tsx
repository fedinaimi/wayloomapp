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

// Mock alerts data
const mockAlerts = [
  {
    id: 'al_1',
    type: 'action_needed',
    category: 'medication',
    title: 'Missed Morning Medication',
    description: 'Sam Wilson missed Donepezil at 8:30 AM',
    time: '2 hours ago',
    patient: 'Sam Wilson',
    severity: 'high',
    resolved: false
  },
  {
    id: 'al_2',
    type: 'action_needed',
    category: 'test',
    title: 'Memory Test Overdue',
    description: 'Weekly cognitive assessment not completed',
    time: '1 day ago',
    patient: 'Sam Wilson',
    severity: 'medium',
    resolved: false
  },
  {
    id: 'al_3',
    type: 'fyi',
    category: 'report',
    title: 'New Doctor Report Available',
    description: 'Dr. Smith uploaded consultation notes',
    time: '3 hours ago',
    patient: 'Mary Johnson',
    severity: 'low',
    resolved: false
  },
  {
    id: 'al_4',
    type: 'action_needed',
    category: 'emergency',
    title: 'Emergency Contact Triggered',
    description: 'Patient activated emergency protocol',
    time: '5 hours ago',
    patient: 'Sam Wilson',
    severity: 'critical',
    resolved: true
  },
  {
    id: 'al_5',
    type: 'fyi',
    category: 'activity',
    title: 'Exercise Goal Achieved',
    description: 'Mary completed 30-minute walk',
    time: '6 hours ago',
    patient: 'Mary Johnson',
    severity: 'low',
    resolved: false
  }
];

export default function CaregiverAlertsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'action_needed' | 'fyi'>('all');
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    Alert.alert('Alert Resolved', 'Alert has been marked as resolved.');
  };

  const handleSnoozeAlert = (alertId: string) => {
    Alert.alert('Alert Snoozed', 'Alert will remind you again in 1 hour.');
  };

  const handleRemindNow = (alertId: string) => {
    Alert.alert('Reminder Sent', 'Patient has been notified.');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return WellnessTheme.colors.error;
      case 'high': return WellnessTheme.colors.warning;
      case 'medium': return WellnessTheme.colors.accent;
      case 'low': return WellnessTheme.colors.info;
      default: return WellnessTheme.colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return 'medical';
      case 'test': return 'clipboard';
      case 'report': return 'document-text';
      case 'emergency': return 'warning';
      case 'activity': return 'fitness';
      default: return 'information-circle';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    return alert.type === selectedFilter;
  });

  const activeAlerts = filteredAlerts.filter(alert => !alert.resolved);
  const resolvedAlerts = filteredAlerts.filter(alert => alert.resolved);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      <CaregiverHeader 
        caregiverName="Alex"
        notificationCount={activeAlerts.length}
        onNotificationPress={() => Alert.alert('Notifications', 'View all notifications')}
      />

      {/* Greeting Section */}
      <CaregiverGreetingSection 
        title="Alerts"
        subtitle="Monitor patient notifications and urgent items"
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All', count: filteredAlerts.length },
          { key: 'action_needed', label: 'Action Needed', count: filteredAlerts.filter(a => a.type === 'action_needed').length },
          { key: 'fyi', label: 'FYI', count: filteredAlerts.filter(a => a.type === 'fyi').length }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.filterTextActive
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Alerts</Text>
            
            {activeAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(alert.severity) }]} />
                  <View style={styles.alertIcon}>
                    <Ionicons 
                      name={getCategoryIcon(alert.category) as any} 
                      size={20} 
                      color={getSeverityColor(alert.severity)} 
                    />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                    <View style={styles.alertMeta}>
                      <Text style={styles.alertPatient}>{alert.patient}</Text>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                    </View>
                  </View>
                </View>

                {alert.type === 'action_needed' && (
                  <View style={styles.alertActions}>
                    <TouchableOpacity 
                      style={styles.primaryAction}
                      onPress={() => handleResolveAlert(alert.id)}
                    >
                      <Text style={styles.primaryActionText}>Resolve</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.secondaryAction}
                      onPress={() => handleSnoozeAlert(alert.id)}
                    >
                      <Text style={styles.secondaryActionText}>Snooze</Text>
                    </TouchableOpacity>
                    
                    {alert.category === 'medication' && (
                      <TouchableOpacity 
                        style={styles.secondaryAction}
                        onPress={() => handleRemindNow(alert.id)}
                      >
                        <Text style={styles.secondaryActionText}>Remind Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {alert.type === 'fyi' && (
                  <View style={styles.alertActions}>
                    <TouchableOpacity 
                      style={styles.secondaryAction}
                      onPress={() => handleResolveAlert(alert.id)}
                    >
                      <Text style={styles.secondaryActionText}>Mark as Read</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="refresh-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Refresh Alerts</Text>
              <Text style={styles.quickActionSubtitle}>Check for new notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="settings-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Alert Settings</Text>
              <Text style={styles.quickActionSubtitle}>Customize notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="time-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Quiet Hours</Text>
              <Text style={styles.quickActionSubtitle}>Manage do not disturb</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="analytics-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Alert History</Text>
              <Text style={styles.quickActionSubtitle}>View past alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Resolved</Text>
            
            {resolvedAlerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={[styles.alertCard, styles.resolvedAlertCard]}>
                <View style={styles.alertHeader}>
                  <View style={styles.resolvedIcon}>
                    <Ionicons name="checkmark-circle" size={20} color={WellnessTheme.colors.success} />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertTitle, styles.resolvedAlertTitle]}>{alert.title}</Text>
                    <Text style={[styles.alertDescription, styles.resolvedAlertDescription]}>
                      {alert.description}
                    </Text>
                    <View style={styles.alertMeta}>
                      <Text style={styles.alertPatient}>{alert.patient}</Text>
                      <Text style={styles.alertTime}>Resolved {alert.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            
            {resolvedAlerts.length > 3 && (
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View All Resolved Alerts</Text>
                <Ionicons name="chevron-forward" size={16} color={WellnessTheme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Empty State */}
        {activeAlerts.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
              <Ionicons name="checkmark-circle-outline" size={64} color={WellnessTheme.colors.success} />
            </View>
            <Text style={styles.emptyStateTitle}>All Clear!</Text>
            <Text style={styles.emptyStateDescription}>
              No active alerts at the moment. We'll notify you here when attention is needed.
            </Text>
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  title: {
    fontSize: WellnessTheme.fontSize.xxxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
  },
  alertsCount: {
    backgroundColor: WellnessTheme.colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    color: WellnessTheme.colors.white,
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: WellnessTheme.colors.white,
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingBottom: WellnessTheme.spacing.md,
  },
  filterTab: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    marginRight: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.lg,
    backgroundColor: WellnessTheme.colors.background,
  },
  filterTabActive: {
    backgroundColor: WellnessTheme.colors.primary,
  },
  filterText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: WellnessTheme.colors.white,
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
  alertCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  resolvedAlertCard: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: WellnessTheme.spacing.md,
  },
  severityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: WellnessTheme.spacing.md,
    minHeight: 60,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  resolvedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.success + '20',
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
    marginBottom: WellnessTheme.spacing.xs,
  },
  resolvedAlertTitle: {
    color: WellnessTheme.colors.textSecondary,
  },
  alertDescription: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.sm,
    lineHeight: 18,
  },
  resolvedAlertDescription: {
    color: WellnessTheme.colors.textLight,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertPatient: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
  },
  alertTime: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textLight,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.sm,
  },
  primaryAction: {
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
  secondaryAction: {
    backgroundColor: WellnessTheme.colors.background,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  secondaryActionText: {
    color: WellnessTheme.colors.textPrimary,
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '500',
  },
  quickActionsGrid: {
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
    fontSize: WellnessTheme.fontSize.sm,
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
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    ...WellnessTheme.shadows.sm,
  },
  viewMoreText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
    marginRight: WellnessTheme.spacing.xs,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.xxxl,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  emptyStateIcon: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 100,
  },
});