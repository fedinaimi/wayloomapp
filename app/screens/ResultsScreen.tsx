import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WellnessTheme } from '../utils/wellnessTheme';

interface ResultsScreenProps {
  navigation: any;
  route: any;
}

export default function ResultsScreen({ navigation, route }: ResultsScreenProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  const [showAccordion, setShowAccordion] = useState(false);

  // Mock test data - would come from route params in real app
  const testData = {
    testName: 'Tapping Speed',
    date: 'Today',
    time: '10:14 AM',
    status: 'reassuring', // 'reassuring', 'watch', 'concern'
    score: 5.3,
    percentile: 62,
    summary: 'Your tapping speed is typical for your age group.',
    metrics: [
      { label: 'Speed', value: '5.3 taps/sec', trend: '+12%', trendDirection: 'up' },
      { label: 'Variability', value: '0.08 SD', trend: '-5%', trendDirection: 'down' },
      { label: 'Fatigue', value: 'Low', trend: 'Stable', trendDirection: 'stable' },
      { label: 'Accuracy', value: '94%', trend: '+3%', trendDirection: 'up' },
    ],
    comparison: '+12% faster',
    qualityIssue: null, // 'noise', 'accuracy', null
    trendData: [4.8, 4.9, 5.1, 4.7, 5.0, 5.2, 5.1, 5.3], // Last 8 sessions
  };

  const statusConfig = {
    reassuring: {
      icon: 'checkmark-circle',
      label: 'Reassuring',
      color: WellnessTheme.colors.success,
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    watch: {
      icon: 'warning',
      label: 'Watch',
      color: WellnessTheme.colors.warning,
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    concern: {
      icon: 'alert-circle',
      label: 'See Clinician',
      color: WellnessTheme.colors.error,
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
  };

  const currentStatus = statusConfig[testData.status as keyof typeof statusConfig];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
        <Ionicons name="notifications" size={24} color={WellnessTheme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderStatusCard = () => (
    <View style={[styles.statusCard, { backgroundColor: currentStatus.bgColor }]}>
      <View style={styles.statusHeader}>
        <Ionicons 
          name={currentStatus.icon as any} 
          size={32} 
          color={currentStatus.color}
          style={styles.statusIcon}
        />
        <Text style={[styles.statusLabel, { color: currentStatus.color }]}>
          {currentStatus.label}
        </Text>
      </View>
      
      <Text style={styles.statusSummary}>{testData.summary}</Text>
      
      <View style={styles.statusBadges}>
        <View style={[styles.badge, styles.percentileBadge]}>
          <Text style={styles.badgeText}>{testData.percentile}th percentile</Text>
        </View>
        <View style={[styles.badge, styles.scoreBadge]}>
          <Text style={styles.badgeText}>Avg {testData.score} taps/sec</Text>
        </View>
      </View>
    </View>
  );

  const renderMetricsRow = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Key Metrics</Text>
      <View style={styles.metricsGrid}>
        {testData.metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <View style={styles.metricTrend}>
              <Ionicons 
                name={
                  metric.trendDirection === 'up' ? 'trending-up' :
                  metric.trendDirection === 'down' ? 'trending-down' : 'remove'
                }
                size={16}
                color={
                  metric.trendDirection === 'up' ? WellnessTheme.colors.success :
                  metric.trendDirection === 'down' ? WellnessTheme.colors.error :
                  WellnessTheme.colors.textSecondary
                }
              />
              <Text style={[
                styles.metricTrendText,
                {
                  color: metric.trendDirection === 'up' ? WellnessTheme.colors.success :
                         metric.trendDirection === 'down' ? WellnessTheme.colors.error :
                         WellnessTheme.colors.textSecondary
                }
              ]}>
                {metric.trend}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTrendChart = () => (
    <View style={styles.trendContainer}>
      <Text style={styles.sectionTitle}>Trend & Comparison</Text>
      <View style={styles.chartCard}>
        <View style={styles.chartArea}>
          {/* Simple visual representation of trend */}
          <View style={styles.chartLine}>
            {testData.trendData.map((value, index) => (
              <View
                key={index}
                style={[
                  styles.chartPoint,
                  {
                    height: (value / Math.max(...testData.trendData)) * 40,
                    backgroundColor: index === testData.trendData.length - 1 
                      ? WellnessTheme.colors.primary 
                      : WellnessTheme.colors.textLight,
                  }
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.comparisonChip}>
          <Text style={styles.comparisonText}>vs last time: {testData.comparison}</Text>
        </View>
      </View>
    </View>
  );

  const renderQualityCheck = () => {
    if (!testData.qualityIssue) return null;
    
    return (
      <View style={styles.qualityBanner}>
        <Ionicons name="warning-outline" size={20} color={WellnessTheme.colors.warning} />
        <Text style={styles.qualityText}>Background noise detected</Text>
        <TouchableOpacity>
          <Text style={styles.qualityLink}>How to improve measurement</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMeaningAccordion = () => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader}
        onPress={() => setShowAccordion(!showAccordion)}
      >
        <Text style={styles.accordionTitle}>What this means</Text>
        <Ionicons 
          name={showAccordion ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={WellnessTheme.colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {showAccordion && (
        <View style={styles.accordionContent}>
          <Text style={styles.meaningBullet}>
            • Your tapping speed shows normal motor function for your age group
          </Text>
          <Text style={styles.meaningBullet}>
            • Consistent performance suggests stable fine motor control
          </Text>
          <Text style={styles.meaningBullet}>
            • Results may vary with sleep, medications, or fatigue levels
          </Text>
          <Text style={styles.disclaimer}>
            Note: Results are not medical advice and should be discussed with your healthcare provider.
          </Text>
        </View>
      )}
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Continue → Next test</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Retake now (2 min)</Text>
      </TouchableOpacity>
      
      <View style={styles.ghostButtonsRow}>
        <TouchableOpacity style={styles.ghostButton}>
          <Text style={styles.ghostButtonText}>Share with caregiver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton}>
          <Text style={styles.ghostButtonText}>Download PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotes = () => (
    <View style={styles.notesContainer}>
      <Text style={styles.notesLabel}>Notes (optional)</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Add a note about today (sleep, meds, mood)..."
        placeholderTextColor={WellnessTheme.colors.textLight}
        value={note}
        onChangeText={setNote}
        multiline
        textAlignVertical="top"
      />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        If you're worried about changes, contact your clinician.
      </Text>
    </View>
  );

  // Calculate navigation height for bottom padding
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const navigationHeight = isSmallScreen ? 64 : isMediumScreen ? 68 : 72;
  const navigationBottomMargin = isSmallScreen ? 8 : 10;
  const totalNavigationSpace = navigationHeight + navigationBottomMargin + insets.bottom + 20;

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: totalNavigationSpace }]}
      >
        {renderStatusCard()}
        {renderMetricsRow()}
        {renderTrendChart()}
        {renderQualityCheck()}
        {renderMeaningAccordion()}
        {renderActions()}
        {renderNotes()}
        {renderFooter()}
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
    padding: WellnessTheme.spacing.lg,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
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
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: WellnessTheme.colors.accent,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: WellnessTheme.spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: WellnessTheme.colors.textSecondary,
    marginTop: 2,
  },
  
  // Status Card
  statusCard: {
    borderRadius: WellnessTheme.borderRadius.xl,
    padding: WellnessTheme.spacing.xl,
    marginBottom: WellnessTheme.spacing.xl,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
  },
  statusIcon: {
    marginRight: WellnessTheme.spacing.md,
  },
  statusLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusSummary: {
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: WellnessTheme.spacing.lg,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.sm,
  },
  badge: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: 20,
  },
  percentileBadge: {
    backgroundColor: WellnessTheme.colors.primary,
  },
  scoreBadge: {
    backgroundColor: WellnessTheme.colors.textSecondary,
  },
  
  // Metrics
  metricsContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  metricLabel: {
    fontSize: 12,
    color: WellnessTheme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Trend Chart
  trendContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  chartCard: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  chartArea: {
    height: 60,
    marginBottom: WellnessTheme.spacing.md,
  },
  chartLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: WellnessTheme.spacing.sm,
  },
  chartPoint: {
    width: 6,
    borderRadius: 3,
    minHeight: 4,
  },
  comparisonChip: {
    alignSelf: 'flex-start',
    backgroundColor: WellnessTheme.colors.primaryLight,
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: 16,
  },
  comparisonText: {
    fontSize: 12,
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
  },
  
  // Quality Check
  qualityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
    gap: WellnessTheme.spacing.sm,
  },
  qualityText: {
    flex: 1,
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
  },
  qualityLink: {
    fontSize: 14,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
  },
  
  // Accordion
  accordionContainer: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginBottom: WellnessTheme.spacing.xl,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: WellnessTheme.spacing.lg,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  accordionContent: {
    padding: WellnessTheme.spacing.lg,
    paddingTop: 0,
  },
  meaningBullet: {
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: WellnessTheme.spacing.sm,
  },
  disclaimer: {
    fontSize: 12,
    color: WellnessTheme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: WellnessTheme.spacing.sm,
  },
  
  // Actions
  actionsContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: WellnessTheme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    paddingVertical: WellnessTheme.spacing.lg,
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: WellnessTheme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButtonsRow: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.md,
  },
  ghostButton: {
    flex: 1,
    paddingVertical: WellnessTheme.spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: WellnessTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Notes
  notesContainer: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  notesInput: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    fontSize: 14,
    color: WellnessTheme.colors.textPrimary,
    minHeight: 80,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: WellnessTheme.colors.textLight,
    textAlign: 'center',
  },
});