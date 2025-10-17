import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CaregiverGreetingSection from '../../components/CaregiverGreetingSection';
import CaregiverHeader from '../../components/CaregiverHeader';
import { WellnessTheme } from '../../utils/wellnessTheme';

// Mock reminders data
const mockReminders = [
  {
    id: 'rem_1',
    patient: 'Sam Wilson',
    title: 'Take morning medication',
    description: 'Donepezil 5mg',
    time: '08:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    channel: 'push',
    backup: true,
    active: true,
    category: 'medication'
  },
  {
    id: 'rem_2',
    patient: 'Sam Wilson',
    title: 'Memory exercises',
    description: 'Daily cognitive training',
    time: '14:00',
    days: ['Mon', 'Wed', 'Fri'],
    channel: 'sms',
    backup: false,
    active: true,
    category: 'exercise'
  },
  {
    id: 'rem_3',
    patient: 'Mary Johnson',
    title: 'Blood pressure check',
    description: 'Record morning BP reading',
    time: '09:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    channel: 'push',
    backup: true,
    active: false,
    category: 'health'
  }
];

export default function CaregiverRemindersScreen() {
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  
  // Responsive design calculations
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const isLargeScreen = screenWidth >= 414;
  
  // Navigation height calculation for bottom padding
  const navigationHeight = isSmallScreen ? 64 : isMediumScreen ? 68 : 72;
  const navigationBottomMargin = isSmallScreen ? 8 : 10;
  const totalNavigationSpace = navigationHeight + navigationBottomMargin + insets.bottom + 20;

  const [reminders, setReminders] = useState(mockReminders);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    patient: '',
    title: '',
    description: '',
    time: '09:00',
    days: [] as string[],
    channel: 'push',
    backup: false,
    category: 'general'
  });

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
  };

  const handleDeleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setReminders(prev => prev.filter(r => r.id !== id))
        }
      ]
    );
  };

  const handleCreateReminder = () => {
    // Validate form
    if (!newReminder.title.trim() || !newReminder.patient) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    const reminder = {
      id: `rem_${Date.now()}`,
      ...newReminder,
      active: true
    };
    
    setReminders(prev => [...prev, reminder]);
    setShowCreateModal(false);
    setNewReminder({
      patient: '',
      title: '',
      description: '',
      time: '09:00',
      days: [],
      channel: 'push',
      backup: false,
      category: 'general'
    });
    
    Alert.alert('Success', 'Reminder created successfully!');
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return 'medical';
      case 'exercise': return 'fitness';
      case 'health': return 'heart';
      default: return 'notifications';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return WellnessTheme.colors.primary;
      case 'exercise': return WellnessTheme.colors.secondary;
      case 'health': return WellnessTheme.colors.error;
      default: return WellnessTheme.colors.accent;
    }
  };

  const activeReminders = reminders.filter(r => r.active);
  const inactiveReminders = reminders.filter(r => !r.active);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      <CaregiverHeader 
        caregiverName="Alex"
        notificationCount={activeReminders.length}
        onNotificationPress={() => Alert.alert('Notifications', 'View all notifications')}
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: totalNavigationSpace }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Greeting Section */}
        <CaregiverGreetingSection 
          title="Reminders"
          subtitle="Manage patient medication and care reminders"
        />
        
        {/* Add Reminder Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.addReminderButton} 
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={24} color={WellnessTheme.colors.white} />
            <Text style={styles.addReminderText}>Create New Reminder</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Stats */}
        <View style={[
          styles.statsContainer,
          isSmallScreen && styles.statsContainerSmall
        ]}>
          <View style={[
            styles.statCard,
            isSmallScreen && styles.statCardSmall
          ]}>
            <Text style={[
              styles.statValue,
              isSmallScreen && styles.statValueSmall
            ]}>{activeReminders.length}</Text>
            <Text style={[
              styles.statLabel,
              isSmallScreen && styles.statLabelSmall
            ]}>Active</Text>
          </View>
          <View style={[
            styles.statCard,
            isSmallScreen && styles.statCardSmall
          ]}>
            <Text style={[
              styles.statValue,
              isSmallScreen && styles.statValueSmall
            ]}>{reminders.length}</Text>
            <Text style={[
              styles.statLabel,
              isSmallScreen && styles.statLabelSmall
            ]}>Total</Text>
          </View>
          <View style={[
            styles.statCard,
            isSmallScreen && styles.statCardSmall
          ]}>
            <Text style={[
              styles.statValue,
              isSmallScreen && styles.statValueSmall
            ]}>87%</Text>
            <Text style={[
              styles.statLabel,
              isSmallScreen && styles.statLabelSmall
            ]}>Success Rate</Text>
          </View>
        </View>

        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Reminders</Text>
            
            {activeReminders.map((reminder) => (
              <View key={reminder.id} style={[
                styles.reminderCard,
                isSmallScreen && styles.reminderCardSmall
              ]}>
                <View style={styles.reminderHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(reminder.category) + '20' }]}>
                    <Ionicons 
                      name={getCategoryIcon(reminder.category) as any} 
                      size={20} 
                      color={getCategoryColor(reminder.category)} 
                    />
                  </View>
                  
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderDescription}>{reminder.description}</Text>
                    <Text style={styles.reminderPatient}>For: {reminder.patient}</Text>
                  </View>

                  <Switch
                    value={reminder.active}
                    onValueChange={() => toggleReminder(reminder.id)}
                    trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                    thumbColor={reminder.active ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
                  />
                </View>

                <View style={[
                  styles.reminderDetails,
                  isSmallScreen && styles.reminderDetailsSmall
                ]}>
                  <View style={styles.reminderTime}>
                    <Ionicons name="time-outline" size={16} color={WellnessTheme.colors.textSecondary} />
                    <Text style={styles.reminderTimeText}>{reminder.time}</Text>
                  </View>
                  
                  <View style={[
                    styles.reminderDays,
                    isSmallScreen && styles.reminderDaysSmall
                  ]}>
                    {reminder.days.map((day) => (
                      <View key={day} style={styles.dayChip}>
                        <Text style={styles.dayText}>{day}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.reminderChannel}>
                    <Ionicons 
                      name={reminder.channel === 'push' ? 'notifications-outline' : 'chatbubble-outline'} 
                      size={16} 
                      color={WellnessTheme.colors.textSecondary} 
                    />
                    <Text style={styles.channelText}>
                      {reminder.channel === 'push' ? 'Push' : 'SMS'}
                      {reminder.backup && ' + Backup'}
                    </Text>
                  </View>
                </View>

                <View style={styles.reminderActions}>
                  <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="pencil-outline" size={16} color={WellnessTheme.colors.primary} />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReminder(reminder.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color={WellnessTheme.colors.error} />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Inactive Reminders */}
        {inactiveReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inactive Reminders</Text>
            
            {inactiveReminders.map((reminder) => (
              <View key={reminder.id} style={[
                styles.reminderCard, 
                styles.inactiveCard,
                isSmallScreen && styles.reminderCardSmall
              ]}>
                <View style={styles.reminderHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: WellnessTheme.colors.textLight + '20' }]}>
                    <Ionicons 
                      name={getCategoryIcon(reminder.category) as any} 
                      size={20} 
                      color={WellnessTheme.colors.textLight} 
                    />
                  </View>
                  
                  <View style={styles.reminderContent}>
                    <Text style={[styles.reminderTitle, styles.inactiveText]}>{reminder.title}</Text>
                    <Text style={[styles.reminderDescription, styles.inactiveText]}>{reminder.description}</Text>
                    <Text style={[styles.reminderPatient, styles.inactiveText]}>For: {reminder.patient}</Text>
                  </View>

                  <Switch
                    value={reminder.active}
                    onValueChange={() => toggleReminder(reminder.id)}
                    trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                    thumbColor={reminder.active ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[
              styles.quickActionCard,
              isSmallScreen && styles.quickActionCardSmall
            ]}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="time-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Quiet Hours</Text>
              <Text style={styles.quickActionSubtitle}>11 PM - 7 AM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[
              styles.quickActionCard,
              isSmallScreen && styles.quickActionCardSmall
            ]}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="settings-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Settings</Text>
              <Text style={styles.quickActionSubtitle}>Notification preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[
              styles.quickActionCard,
              isSmallScreen && styles.quickActionCardSmall
            ]}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="analytics-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Analytics</Text>
              <Text style={styles.quickActionSubtitle}>Reminder effectiveness</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[
              styles.quickActionCard,
              isSmallScreen && styles.quickActionCardSmall
            ]}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="copy-outline" size={24} color={WellnessTheme.colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Templates</Text>
              <Text style={styles.quickActionSubtitle}>Common reminders</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Reminder Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Reminder</Text>
            <TouchableOpacity onPress={handleCreateReminder}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Patient *</Text>
              <View style={styles.patientSelector}>
                <TouchableOpacity 
                  style={[
                    styles.patientOption,
                    newReminder.patient === 'Sam Wilson' && styles.patientOptionSelected
                  ]}
                  onPress={() => setNewReminder(prev => ({ ...prev, patient: 'Sam Wilson' }))}
                >
                  <Text style={[
                    styles.patientOptionText,
                    newReminder.patient === 'Sam Wilson' && styles.patientOptionTextSelected
                  ]}>Sam Wilson</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.patientOption,
                    newReminder.patient === 'Mary Johnson' && styles.patientOptionSelected
                  ]}
                  onPress={() => setNewReminder(prev => ({ ...prev, patient: 'Mary Johnson' }))}
                >
                  <Text style={[
                    styles.patientOptionText,
                    newReminder.patient === 'Mary Johnson' && styles.patientOptionTextSelected
                  ]}>Mary Johnson</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Title *</Text>
              <TextInput
                style={styles.textInput}
                value={newReminder.title}
                onChangeText={(text) => setNewReminder(prev => ({ ...prev, title: text }))}
                placeholder="e.g., Take morning medication"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={styles.textInput}
                value={newReminder.description}
                onChangeText={(text) => setNewReminder(prev => ({ ...prev, description: text }))}
                placeholder="Additional details..."
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Time</Text>
              <TextInput
                style={styles.textInput}
                value={newReminder.time}
                onChangeText={(text) => setNewReminder(prev => ({ ...prev, time: text }))}
                placeholder="HH:MM"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Repeat Days</Text>
              <View style={styles.daysSelector}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayOption,
                      newReminder.days.includes(day) && styles.dayOptionSelected
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[
                      styles.dayOptionText,
                      newReminder.days.includes(day) && styles.dayOptionTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Notification Method</Text>
              <View style={styles.channelSelector}>
                <TouchableOpacity 
                  style={[
                    styles.channelOption,
                    newReminder.channel === 'push' && styles.channelOptionSelected
                  ]}
                  onPress={() => setNewReminder(prev => ({ ...prev, channel: 'push' }))}
                >
                  <Ionicons name="notifications-outline" size={20} color={
                    newReminder.channel === 'push' ? WellnessTheme.colors.white : WellnessTheme.colors.primary
                  } />
                  <Text style={[
                    styles.channelOptionText,
                    newReminder.channel === 'push' && styles.channelOptionTextSelected
                  ]}>Push Notification</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.channelOption,
                    newReminder.channel === 'sms' && styles.channelOptionSelected
                  ]}
                  onPress={() => setNewReminder(prev => ({ ...prev, channel: 'sms' }))}
                >
                  <Ionicons name="chatbubble-outline" size={20} color={
                    newReminder.channel === 'sms' ? WellnessTheme.colors.white : WellnessTheme.colors.primary
                  } />
                  <Text style={[
                    styles.channelOptionText,
                    newReminder.channel === 'sms' && styles.channelOptionTextSelected
                  ]}>SMS</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.switchRow}>
                <Text style={styles.formLabel}>Backup Reminder</Text>
                <Switch
                  value={newReminder.backup}
                  onValueChange={(value) => setNewReminder(prev => ({ ...prev, backup: value }))}
                  trackColor={{ false: WellnessTheme.colors.border, true: WellnessTheme.colors.primary + '50' }}
                  thumbColor={newReminder.backup ? WellnessTheme.colors.primary : WellnessTheme.colors.textLight}
                />
              </View>
              <Text style={styles.formHelperText}>
                Send a backup reminder 15 minutes later if not acknowledged
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  addReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.md,
  },
  addReminderText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.white,
    marginLeft: WellnessTheme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.md,
    minWidth: 80,
    ...WellnessTheme.shadows.sm,
  },
  statValue: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
  },
  // Responsive styles for small screens
  statsContainerSmall: {
    paddingHorizontal: WellnessTheme.spacing.md,
  },
  statCardSmall: {
    padding: WellnessTheme.spacing.sm,
    minWidth: 70,
  },
  statValueSmall: {
    fontSize: WellnessTheme.fontSize.lg,
  },
  statLabelSmall: {
    fontSize: 10,
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
  reminderCard: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.md,
    ...WellnessTheme.shadows.sm,
  },
  reminderCardSmall: {
    padding: WellnessTheme.spacing.md,
    borderRadius: WellnessTheme.borderRadius.md,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: WellnessTheme.spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: 4,
  },
  reminderPatient: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
  },
  inactiveText: {
    color: WellnessTheme.colors.textLight,
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
    paddingTop: WellnessTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: WellnessTheme.colors.border,
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.sm,
  },
  reminderDetailsSmall: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: WellnessTheme.spacing.xs,
  },
  reminderTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTimeText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginLeft: 4,
  },
  reminderDays: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  reminderDaysSmall: {
    maxWidth: '100%',
  },
  dayChip: {
    backgroundColor: WellnessTheme.colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dayText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
  },
  reminderChannel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    marginLeft: 4,
  },
  reminderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: WellnessTheme.spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    backgroundColor: WellnessTheme.colors.background,
    borderRadius: WellnessTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.primary,
  },
  editButtonText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    backgroundColor: WellnessTheme.colors.error + '10',
    borderRadius: WellnessTheme.borderRadius.md,
  },
  deleteButtonText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.error,
    fontWeight: '500',
    marginLeft: 4,
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
  quickActionCardSmall: {
    width: '100%',
    padding: WellnessTheme.spacing.md,
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
  bottomPadding: {
    height: 100,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  modalContainerSmall: {
    paddingHorizontal: WellnessTheme.spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  modalTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  cancelText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
  saveText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  formSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  formLabel: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  textInput: {
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.md,
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  patientSelector: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.sm,
  },
  patientOption: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    alignItems: 'center',
  },
  patientOptionSelected: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  patientOptionText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  patientOptionTextSelected: {
    color: WellnessTheme.colors.white,
  },
  daysSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.white,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOptionSelected: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  dayOptionText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  dayOptionTextSelected: {
    color: WellnessTheme.colors.white,
  },
  channelSelector: {
    gap: WellnessTheme.spacing.sm,
  },
  channelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.md,
    padding: WellnessTheme.spacing.md,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  channelOptionSelected: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  channelOptionText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
    marginLeft: WellnessTheme.spacing.sm,
  },
  channelOptionTextSelected: {
    color: WellnessTheme.colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xs,
  },
  formHelperText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 18,
  },
});