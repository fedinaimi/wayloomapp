import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../utils/wellnessTheme';

export default function HomeScreen() {
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [userName] = useState('Amina');
  const [riskStatus] = useState<'stable' | 'watch' | 'consult'>('stable');
  const [currentAnalyticsIndex, setCurrentAnalyticsIndex] = useState(0);
  const analyticsRef = useRef<FlatList>(null);

  // Calculate navigation height based on screen size (same as SimpleFloatingDockNav)
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const navigationHeight = isSmallScreen ? 64 : isMediumScreen ? 68 : 72;
  const navigationBottomMargin = isSmallScreen ? 8 : 10;
  const totalNavigationSpace = navigationHeight + navigationBottomMargin + insets.bottom + 20; // Add 20px buffer

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
      color: '#10B981',
      icon: 'checkmark-circle',
      message: 'Your memory and attention look steady this week.',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      status: 'Stable'
    },
    watch: {
      color: '#F59E0B',
      icon: 'warning',
      message: 'Some changes noticed. Let\'s keep monitoring together.',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      status: 'Monitor'
    },
    consult: {
      color: '#EF4444',
      icon: 'alert-circle',
      message: 'Please consult with your healthcare provider.',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      status: 'Consult'
    }
  };

  const currentRisk = riskIndicator[riskStatus];

  // Mock cognitive data for analytics
  const cognitiveData = [
    { domain: 'Memory', score: 85, trend: 'stable', color: '#10B981' },
    { domain: 'Attention', score: 78, trend: 'improving', color: '#3B82F6' },
    { domain: 'Visuospatial', score: 92, trend: 'stable', color: '#8B5CF6' },
    { domain: 'Reaction Speed', score: 73, trend: 'declining', color: '#F59E0B' }
  ];

  // Mock progress data for trend chart
  const progressData = [
    { date: 'Oct 10', score: 78 },
    { date: 'Oct 12', score: 81 },
    { date: 'Oct 14', score: 82 },
    { date: 'Oct 16', score: 84 },
  ];

  // AI insights for today
  const todayInsights = [
    {
      type: 'positive',
      icon: 'checkmark-circle',
      title: 'Great Progress!',
      message: 'Your attention span has improved by 12% this week. Keep up the mental exercises!',
      color: '#10B981'
    },
    {
      type: 'tip',
      icon: 'lightbulb',
      title: 'Today\'s Tip',
      message: 'Try the "5-4-3-2-1" grounding technique: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
      color: '#F59E0B'
    },
    {
      type: 'reminder',
      icon: 'time',
      title: 'Gentle Reminder',
      message: 'Your best cognitive performance is typically in the morning. Consider scheduling important tasks before 11 AM.',
      color: '#3B82F6'
    }
  ];

  // Analytics cards data for carousel
  const analyticsCards = [
    { id: 'progress', type: 'progress' },
    { id: 'performance', type: 'performance' },
    { id: 'insights', type: 'insights' }
  ];

  // Reminders data
  const reminders = [
    {
      id: 1,
      type: 'medication',
      title: 'Donepezil 10mg',
      time: '9:00 AM',
      status: 'pending',
      color: '#3B82F6',
      icon: 'medical'
    },
    {
      id: 2,
      type: 'medication',
      title: 'Vitamin D',
      time: '12:00 PM',
      status: 'completed',
      color: '#10B981',
      icon: 'checkmark-circle'
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Physical Therapy',
      time: '3:00 PM',
      status: 'upcoming',
      color: '#8B5CF6',
      icon: 'fitness'
    },
    {
      id: 4,
      type: 'medication',
      title: 'Memantine 5mg',
      time: '8:00 PM',
      status: 'pending',
      color: '#3B82F6',
      icon: 'medical'
    }
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
        <Ionicons name="notifications" size={24} color={WellnessTheme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderRemindersSection = () => (
    <View style={styles.remindersSection}>
      <Text style={styles.sectionTitle}>Today's Reminders</Text>
      <View style={styles.remindersList}>
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderItem}>
            <View style={[styles.reminderIcon, { backgroundColor: `${reminder.color}20` }]}>
              <Ionicons name={reminder.icon as any} size={20} color={reminder.color} />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderTime}>{reminder.time}</Text>
            </View>
            <View style={styles.reminderStatus}>
              {reminder.status === 'completed' ? (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              ) : reminder.status === 'pending' ? (
                <TouchableOpacity style={styles.markCompleteButton}>
                  <Ionicons name="ellipse-outline" size={24} color={reminder.color} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.upcomingDot, { backgroundColor: reminder.color }]} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderGreetingSection = () => (
    <View style={styles.greetingSection}>
      <Text style={styles.greeting}>
        {getGreeting()}, {userName} 🌞
      </Text>
      <Text style={styles.subGreeting}>
        Your daily cognitive health companion
      </Text>
    </View>
  );

  const renderRiskIndicatorCard = () => (
    <View style={[styles.riskCard, { backgroundColor: currentRisk.bgColor }]}>
      <View style={styles.riskHeader}>
        <View style={styles.riskBadge}>
          <Ionicons 
            name={currentRisk.icon as any} 
            size={20} 
            color={currentRisk.color}
            style={styles.riskIconStyle}
          />
          <Text style={[styles.riskStatus, { color: currentRisk.color }]}>
            {currentRisk.status}
          </Text>
        </View>
        <TouchableOpacity style={[styles.testButton, { backgroundColor: currentRisk.color }]}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Start Quick Test</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.riskMessage}>{currentRisk.message}</Text>
      
      <View style={styles.testInfo}>
        <Text style={styles.testInfoText}>Last test: 3 days ago</Text>
        <Text style={styles.testInfoText}>Next scheduled: Tomorrow</Text>
      </View>
    </View>
  );

  const renderProgressTrendCard = () => (
    <View style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="trending-up" size={24} color={WellnessTheme.colors.primary} />
        <Text style={styles.cardTitle}>Cognitive Progress Trend</Text>
      </View>
      
      {/* Simple line chart representation */}
      <View style={styles.chartContainer}>
        <View style={styles.trendChart}>
          {progressData.map((point, index) => (
            <View key={index} style={styles.chartPoint}>
              <View 
                style={[
                  styles.chartDot, 
                  { 
                    bottom: `${point.score - 60}%`,
                    backgroundColor: index === progressData.length - 1 ? currentRisk.color : '#E5E7EB'
                  }
                ]} 
              />
              <Text style={styles.chartLabel}>{point.date}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.chartSummary}>
          Slight improvement in attention speed since last test
        </Text>
      </View>
    </View>
  );

  const renderPerformanceBreakdown = () => (
    <View style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="analytics" size={24} color={WellnessTheme.colors.secondary} />
        <Text style={styles.cardTitle}>Performance Breakdown</Text>
      </View>
      
      {/* Radar chart representation */}
      <View style={styles.radarContainer}>
        {cognitiveData.map((domain, index) => (
          <View key={index} style={styles.domainRow}>
            <View style={styles.domainInfo}>
              <Text style={styles.domainName}>{domain.domain}</Text>
              <View style={styles.trendIndicator}>
                <Ionicons 
                  name={
                    domain.trend === 'improving' ? 'trending-up' :
                    domain.trend === 'declining' ? 'trending-down' : 'remove'
                  }
                  size={16}
                  color={
                    domain.trend === 'improving' ? '#10B981' :
                    domain.trend === 'declining' ? '#EF4444' : '#6B7280'
                  }
                />
              </View>
            </View>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreFill, 
                    { 
                      width: `${domain.score}%`,
                      backgroundColor: domain.color
                    }
                  ]} 
                />
              </View>
              <Text style={styles.scoreText}>{domain.score}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAIInsightsCard = () => (
    <View style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="sparkles" size={24} color="#8B5CF6" />
        <Text style={styles.cardTitle}>Today's AI Insights</Text>
      </View>
      
      <ScrollView 
        style={styles.insightsScroll}
        showsVerticalScrollIndicator={false}
      >
        {todayInsights.map((insight, index) => (
          <View key={index} style={[styles.insightCard, { borderLeftColor: insight.color }]}>
            <View style={styles.insightHeader}>
              <Ionicons name={insight.icon as any} size={20} color={insight.color} />
              <Text style={[styles.insightTitle, { color: insight.color }]}>
                {insight.title}
              </Text>
            </View>
            <Text style={styles.insightMessage}>{insight.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAnalyticsCard = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'progress':
        return renderProgressTrendCard();
      case 'performance':
        return renderPerformanceBreakdown();
      case 'insights':
        return renderAIInsightsCard();
      default:
        return null;
    }
  };

  const onAnalyticsScroll = (event: any) => {
    const slideSize = screenWidth;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentAnalyticsIndex(index);
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsScrollContent}
        style={styles.quickActionsScroll}
      >
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="people" size={28} color="#F59E0B" />
          <Text style={styles.quickActionLabel}>Caregiver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#DBEAFE' }]}>
          <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
          <Text style={styles.quickActionLabel}>Safety</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="calendar" size={28} color="#10B981" />
          <Text style={styles.quickActionLabel}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#FCE7F3' }]}>
          <Ionicons name="settings" size={28} color="#EC4899" />
          <Text style={styles.quickActionLabel}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#FDE68A' }]}>
          <Ionicons name="medical" size={28} color="#D97706" />
          <Text style={styles.quickActionLabel}>Medicine</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#E0E7FF' }]}>
          <Ionicons name="call" size={28} color="#6366F1" />
          <Text style={styles.quickActionLabel}>Emergency</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: '#F3E8FF' }]}>
          <Ionicons name="heart" size={28} color="#8B5CF6" />
          <Text style={styles.quickActionLabel}>Health</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: totalNavigationSpace }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Top Section - Greeting & Risk Indicator */}
        {renderGreetingSection()}
        {renderRiskIndicatorCard()}
        
        {/* Quick Actions - Moved to front */}
        {renderQuickActions()}
        
        {/* Reminders Section */}
        {renderRemindersSection()}
        
        {/* Middle Section - Analytics Overview */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Analytics Overview</Text>
          
          <FlatList
            ref={analyticsRef}
            data={analyticsCards}
            renderItem={renderAnalyticsCard}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onScroll={onAnalyticsScroll}
            scrollEventThrottle={16}
          />
          
          <View style={styles.carouselIndicators}>
            {analyticsCards.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentAnalyticsIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Dynamic paddingBottom calculated based on navigation height and safe area
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.sm,
    paddingBottom: WellnessTheme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WellnessTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...WellnessTheme.shadows.sm,
  },
  avatarText: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
  notificationButton: {
    position: 'relative',
    padding: WellnessTheme.spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: WellnessTheme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
  
  // Greeting Section
  greetingSection: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.sm,
    paddingBottom: WellnessTheme.spacing.lg,
  },
  greeting: {
    fontSize: WellnessTheme.fontSize.xxxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  subGreeting: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Risk Indicator Card
  riskCard: {
    marginHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
    padding: WellnessTheme.spacing.lg,
    borderRadius: WellnessTheme.borderRadius.xl,
    ...WellnessTheme.shadows.md,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIconStyle: {
    marginRight: WellnessTheme.spacing.sm,
  },
  riskStatus: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.lg,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
    marginLeft: WellnessTheme.spacing.xs,
  },
  riskMessage: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.md,
    lineHeight: 22,
  },
  testInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testInfoText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Analytics Section
  analyticsSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.lg,
  },
  analyticsScroll: {
    paddingLeft: WellnessTheme.spacing.lg,
  },
  analyticsContent: {
    paddingRight: WellnessTheme.spacing.lg,
  },
  analyticsCard: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.xl,
    padding: WellnessTheme.spacing.lg,
    marginHorizontal: WellnessTheme.spacing.lg,
    width: Dimensions.get('window').width - (WellnessTheme.spacing.lg * 2),
    ...WellnessTheme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.lg,
  },
  cardTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginLeft: WellnessTheme.spacing.sm,
  },
  
  // Progress Trend Chart
  chartContainer: {
    alignItems: 'center',
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.md,
  },
  chartPoint: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  chartLabel: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    marginTop: WellnessTheme.spacing.sm,
  },
  chartSummary: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Performance Breakdown
  radarContainer: {
    gap: WellnessTheme.spacing.md,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  domainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  domainName: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  trendIndicator: {
    marginLeft: WellnessTheme.spacing.sm,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scoreBar: {
    height: 8,
    backgroundColor: WellnessTheme.colors.border,
    borderRadius: WellnessTheme.borderRadius.sm,
    flex: 1,
    marginRight: WellnessTheme.spacing.sm,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: WellnessTheme.borderRadius.sm,
  },
  scoreText: {
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    minWidth: 30,
    textAlign: 'right',
  },
  
  // Quick Actions
  quickActionsSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  quickActionsScroll: {
    marginHorizontal: 0,
  },
  quickActionsScrollContent: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    gap: WellnessTheme.spacing.md,
  },
  quickActionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: WellnessTheme.borderRadius.xl,
    padding: WellnessTheme.spacing.sm,
    ...WellnessTheme.shadows.sm,
  },
  quickActionLabel: {
    fontSize: WellnessTheme.fontSize.xs,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginTop: WellnessTheme.spacing.xs,
  },
  
  // Carousel and indicator styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.lg,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: WellnessTheme.spacing.xs,
    marginTop: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WellnessTheme.colors.border,
  },
  activeIndicator: {
    backgroundColor: WellnessTheme.colors.primary,
    width: 20,
  },
  carouselContent: {
    alignItems: 'center',
  },
  
  // AI Insights styles
  insightsScroll: {
    maxHeight: 200,
  },
  insightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.sm,
    borderLeftWidth: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xs,
  },
  insightTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    marginLeft: WellnessTheme.spacing.sm,
  },
  insightMessage: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  
  // Reminders Section styles
  remindersSection: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  remindersList: {
    gap: WellnessTheme.spacing.sm,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  reminderItem: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...WellnessTheme.shadows.sm,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  reminderTime: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  reminderStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCompleteButton: {
    padding: WellnessTheme.spacing.xs,
  },
  upcomingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});