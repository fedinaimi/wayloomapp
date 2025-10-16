import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WellnessTheme } from '../utils/wellnessTheme';
import WellnessCard from '../components/WellnessCard';

export default function WellnessHomeScreen() {
  const { width: screenWidth } = Dimensions.get('window');
  const [userName] = useState('Amina');
  const [riskStatus] = useState<'stable' | 'watch' | 'consult'>('stable');
  
  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Risk indicator colors and messages
  const riskIndicator = {
    stable: {
      color: '#34D399', // Green
      icon: '🟢',
      message: 'Your memory and attention look steady this week.',
      bgColor: 'rgba(52, 211, 153, 0.1)'
    },
    watch: {
      color: '#F59E0B', // Yellow
      icon: '🟡',
      message: 'Some changes noticed. Let\'s keep monitoring together.',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    consult: {
      color: '#EF4444', // Red
      icon: '🔴',
      message: 'Please consult with your healthcare provider.',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  };

  const currentRisk = riskIndicator[riskStatus];

  // Mock cognitive data
  const cognitiveData = [
    { domain: 'Memory', score: 85, trend: 'stable' },
    { domain: 'Attention', score: 78, trend: 'improving' },
    { domain: 'Visuospatial', score: 92, trend: 'stable' },
    { domain: 'Reaction Speed', score: 73, trend: 'declining' }
  ];

  const renderGreetingSection = () => (
    <View style={styles.greetingSection}>
      <Text style={styles.greeting}>
        {getGreeting()}, {userName} 🌞
      </Text>
      <Text style={styles.subGreeting}>
        Your daily wellness companion
      </Text>
    </View>
  );

  const renderRiskIndicatorCard = () => (
    <View style={[styles.riskCard, { backgroundColor: currentRisk.bgColor }]}>
      <View style={styles.riskHeader}>
        <View style={styles.riskBadge}>
          <Text style={styles.riskIcon}>{currentRisk.icon}</Text>
          <Text style={[styles.riskStatus, { color: currentRisk.color }]}>
            {riskStatus === 'stable' ? 'Stable' : riskStatus === 'watch' ? 'Monitor' : 'Consult'}
          </Text>
        </View>
        <TouchableOpacity style={styles.testButton}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Quick Test</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.riskMessage}>{currentRisk.message}</Text>
      
      <View style={styles.testInfo}>
        <Text style={styles.testInfoText}>Last test: 3 days ago</Text>
        <Text style={styles.testInfoText}>Next scheduled: Tomorrow</Text>
      </View>
    </View>
  );

  const renderCognitiveProgress = () => (
    <WellnessCard
      title="Cognitive Progress"
      subtitle="7-day trend"
      cardType="meditation"
      style={styles.progressCard}
    >
      <View style={styles.progressChart}>
        {/* Simplified progress visualization */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Overall Score: 82/100</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '82%' }]} />
          </View>
          <Text style={styles.chartSubtitle}>
            Slight improvement in attention speed since last test
          </Text>
        </View>
      </View>
    </WellnessCard>
  );

  const renderPerformanceBreakdown = () => (
    <WellnessCard
      title="Performance Breakdown"
      subtitle="By cognitive domain"
      cardType="activity"
      style={styles.performanceCard}
    >
      <View style={styles.domainList}>
        {cognitiveData.map((domain, index) => (
          <View key={index} style={styles.domainItem}>
            <View style={styles.domainInfo}>
              <Text style={styles.domainName}>{domain.domain}</Text>
              <Text style={[
                styles.domainTrend,
                {
                  color: domain.trend === 'improving' ? '#34D399' :
                         domain.trend === 'declining' ? '#EF4444' : '#6B7280'
                }
              ]}>
                {domain.trend === 'improving' ? '↗️' : 
                 domain.trend === 'declining' ? '↘️' : '→'}
                {domain.score}%
              </Text>
            </View>
            <View style={styles.domainProgress}>
              <View 
                style={[
                  styles.domainProgressFill, 
                  { 
                    width: `${domain.score}%`,
                    backgroundColor: domain.trend === 'improving' ? '#34D399' :
                                   domain.trend === 'declining' ? '#EF4444' : '#6B7280'
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </WellnessCard>
  );
      const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Call Caregiver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="medical" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Safety Check</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EDF2F7']}
        style={styles.background}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderGreetingSection()}
          {renderRiskIndicatorCard()}
          
          <View style={styles.analyticsSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            {renderCognitiveProgress()}
            {renderPerformanceBreakdown()}
          </View>
          
          {renderQuickActions()}
          
          {/* Bottom spacing for floating navigation */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for floating navigation
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: WellnessTheme.colors.textSecondary,
  },
  riskCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  riskStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  riskMessage: {
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 16,
    lineHeight: 22,
  },
  testInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testInfoText: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
  },
  analyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 16,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressChart: {
    marginTop: 12,
  },
  chartContainer: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    fontStyle: 'italic',
  },
  performanceCard: {
    marginBottom: 16,
  },
  domainList: {
    marginTop: 12,
  },
  domainItem: {
    marginBottom: 16,
  },
  domainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  domainName: {
    fontSize: 16,
    fontWeight: '500',
    color: WellnessTheme.colors.textPrimary,
  },
  domainTrend: {
    fontSize: 14,
    fontWeight: '600',
  },
  domainProgress: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
  },
  domainProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={WellnessTheme.colors.white} />
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={WellnessTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.headerTitle}>Your Activities</Text>
      
      {/* Weekly Calendar */}
      <View style={styles.calendar}>
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.date}
            style={[
              styles.calendarDay,
              selectedDate === day.date && styles.selectedDay
            ]}
            onPress={() => setSelectedDate(day.date)}
          >
            <Text style={[
              styles.dayText,
              selectedDate === day.date && styles.selectedDayText
            ]}>
              {day.day}
            </Text>
            <Text style={[
              styles.dateText,
              selectedDate === day.date && styles.selectedDateText
            ]}>
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderActivityCards = () => (
    <View style={styles.activitiesGrid}>
      <View style={styles.activityRow}>
        <WellnessCard
          title="Sleeping Time"
          value="8h 34m"
          icon="sleep"
          cardType="mood"
          style={styles.activityCard}
        />
        <WellnessCard
          title="Mood Level"
          value="8/10"
          icon="emoticon-happy"
          cardType="activity"
          style={styles.activityCard}
        />
        <WellnessCard
          title="Active Time"
          value="2h"
          icon="run"
          cardType="journal"
          style={styles.activityCard}
        />
      </View>
    </View>
  );

  const renderPhysicalState = () => (
    <WellnessCard
      title="Physical state"
      cardType="wellness"
      style={styles.physicalStateCard}
    >
      <View style={styles.physicalStateContent}>
        <View style={styles.goalsList}>
          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <Ionicons name="target" size={16} color={WellnessTheme.colors.primary} />
            </View>
            <View>
              <Text style={styles.goalTitle}>Sleep Goal</Text>
              <Text style={styles.goalValue}>8h Target</Text>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <Ionicons name="bulb" size={16} color={WellnessTheme.colors.warning} />
            </View>
            <View>
              <Text style={styles.goalTitle}>Last Night</Text>
              <Text style={styles.goalValue}>7.5h Achieved</Text>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <Ionicons name="warning" size={16} color={WellnessTheme.colors.error} />
            </View>
            <View>
              <Text style={styles.goalTitle}>Deficit</Text>
              <Text style={styles.goalValue}>1.5 Missing</Text>
            </View>
          </View>
        </View>
        
        {/* Progress Circle */}
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercentage}>78%</Text>
        </View>
      </View>
    </WellnessCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#EEF2FF']}
        style={styles.background}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderActivityCards()}
          {renderPhysicalState()}
          
          {/* Bottom spacing for floating nav */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...WellnessTheme.shadows.sm,
  },
  headerTitle: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: WellnessTheme.spacing.xl,
  },
  calendarDay: {
    alignItems: 'center',
    padding: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
    minWidth: 40,
  },
  selectedDay: {
    backgroundColor: WellnessTheme.colors.textPrimary,
  },
  dayText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: 4,
  },
  selectedDayText: {
    color: WellnessTheme.colors.white,
  },
  dateText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  selectedDateText: {
    color: WellnessTheme.colors.white,
  },
  activitiesGrid: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityCard: {
    flex: 1,
    marginHorizontal: WellnessTheme.spacing.xs,
    height: 120,
  },
  physicalStateCard: {
    marginHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
  },
  physicalStateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: WellnessTheme.spacing.md,
  },
  goalsList: {
    flex: 1,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  goalIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: WellnessTheme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.sm,
  },
  goalTitle: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  goalValue: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WellnessTheme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: WellnessTheme.spacing.lg,
    ...WellnessTheme.shadows.sm,
  },
  progressPercentage: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
  },
  bottomSpacing: {
    height: 100, // Space for floating navigation
  },
});