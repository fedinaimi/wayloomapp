import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WellnessTheme } from '../utils/wellnessTheme';

export default function HomeScreen() {
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
      color: '#10B981',
      icon: '🟢',
      message: 'Your memory and attention look steady this week.',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      status: 'Stable'
    },
    watch: {
      color: '#F59E0B',
      icon: '🟡',
      message: 'Some changes noticed. Let\'s keep monitoring together.',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      status: 'Monitor'
    },
    consult: {
      color: '#EF4444',
      icon: '🔴',
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
          <Text style={styles.riskIcon}>{currentRisk.icon}</Text>
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

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="people" size={32} color="#F59E0B" />
          <Text style={styles.quickActionText}>Contact Caregiver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#DBEAFE' }]}>
          <Ionicons name="shield-checkmark" size={32} color="#3B82F6" />
          <Text style={styles.quickActionText}>Safety Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="calendar" size={32} color="#10B981" />
          <Text style={styles.quickActionText}>View Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#FCE7F3' }]}>
          <Ionicons name="settings" size={32} color="#EC4899" />
          <Text style={styles.quickActionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Section - Greeting & Risk Indicator */}
        {renderGreetingSection()}
        {renderRiskIndicatorCard()}
        
        {/* Middle Section - Analytics Overview */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Analytics Overview</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.analyticsScroll}
            contentContainerStyle={styles.analyticsContent}
          >
            {renderProgressTrendCard()}
            {renderPerformanceBreakdown()}
          </ScrollView>
        </View>
        
        {/* Bottom Section - Quick Actions */}
        {renderQuickActions()}
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
    paddingBottom: 100, // Account for floating navigation
  },
  
  // Greeting Section
  greetingSection: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.md,
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
  riskIcon: {
    fontSize: 24,
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
    marginRight: WellnessTheme.spacing.md,
    width: Dimensions.get('window').width * 0.8,
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
    paddingHorizontal: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: WellnessTheme.spacing.md,
  },
  quickActionCard: {
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: WellnessTheme.borderRadius.xl,
    padding: WellnessTheme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...WellnessTheme.shadows.sm,
  },
  quickActionText: {
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
    marginTop: WellnessTheme.spacing.sm,
  },
});