import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    Share,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    getAchievements,
    getAnalyticsSummary,
    getDailyPlan,
    getDomainColor,
    getDomainDisplayName,
    getExerciseLibrary,
    getUserSettings,
    motivationalQuotes,
    saveUserSettings
} from '../../services/exercises';
import {
    Achievement,
    AnalyticsSummary,
    DailyPlan,
    Exercise,
    ExerciseDomain,
    UserSettings
} from '../../types/exercises';
import { WellnessTheme } from '../../utils/wellnessTheme';

const { width: screenWidth } = Dimensions.get('window');

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  
  // State management
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<ExerciseDomain | 'all'>('all');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const quoteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data on mount
  useEffect(() => {
    loadData();
    startQuoteRotation();
    
    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);

  // Filter exercises when domain changes
  useEffect(() => {
    loadExercises();
  }, [selectedDomain]);

  const loadData = async () => {
    try {
      const [planData, exerciseData, analyticsData, achievementData, settingsData] = await Promise.all([
        getDailyPlan(),
        getExerciseLibrary(),
        getAnalyticsSummary(),
        getAchievements(),
        getUserSettings(),
      ]);
      
      setDailyPlan(planData);
      setExercises(exerciseData);
      setAnalytics(analyticsData);
      setAchievements(achievementData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const domain = selectedDomain === 'all' ? undefined : selectedDomain;
      const exerciseData = await getExerciseLibrary(domain);
      setExercises(exerciseData);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  };

  const startQuoteRotation = () => {
    quoteIntervalRef.current = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 6000);
  };

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveUserSettings(newSettings);
  };

  const handleShareSummary = async () => {
    if (!analytics) return;
    
    const message = `My cognitive training progress: ${analytics.consistencyStreak} day streak! Most improved area: ${analytics.mostImprovedArea}. Keep your brain healthy! 🧠`;
    
    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.profileAvatar}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.notificationButton}>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>2</Text>
        </View>
        <Ionicons name="notifications" size={24} color={WellnessTheme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < difficulty ? 'star' : 'star-outline'}
        size={14}
        color={index < difficulty ? '#F59E0B' : '#D1D5DB'}
      />
    ));
  };

  const renderProgressBar = (percent: number) => (
    <View style={styles.progressTrack} accessibilityLabel="Daily progress">
      <View style={[styles.progressFill, { width: `${percent}%` }]} />
    </View>
  );

  const renderDailyChallenge = () => {
    if (!dailyPlan) return renderSkeleton(200);
    
    return (
      <View style={styles.card} testID="daily-challenge-card">
        <Text style={styles.cardTitle}>Today's Brain Boost</Text>
        <Text style={styles.cardSubtitle}>
          Personalized {dailyPlan.recommendedMinutes}-minute session…
        </Text>
        
        {renderProgressBar(dailyPlan.completedPercent)}
        <Text style={styles.progressText}>{dailyPlan.completedPercent}% complete</Text>
        
        <View style={styles.modulesList}>
          {dailyPlan.modules.map((module, index) => (
            <View key={module.id} style={styles.moduleItem}>
              <View style={[styles.moduleIcon, { backgroundColor: getDomainColor(module.domain) + '20' }]}>
                <Ionicons 
                  name={module.isCompleted ? 'checkmark' : 'ellipse-outline'} 
                  size={16} 
                  color={getDomainColor(module.domain)} 
                />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDetails}>
                  {getDomainDisplayName(module.domain)} • {module.estimatedMinutes} min
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.primaryButton} 
          testID="start-session-btn"
          onPress={() => {
            // Navigate to exercise session
            console.log('Navigate to exercise session');
          }}
        >
          <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFilterChips = () => {
    const domains: (ExerciseDomain | 'all')[] = ['all', 'memory', 'focus', 'speech', 'motor', 'emotion'];
    
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {domains.map((domain) => (
          <TouchableOpacity
            key={domain}
            style={[
              styles.filterChip,
              selectedDomain === domain && styles.filterChipActive
            ]}
            onPress={() => setSelectedDomain(domain)}
            testID={`filter-chip-${domain}`}
          >
            <Text style={[
              styles.filterChipText,
              selectedDomain === domain && styles.filterChipTextActive
            ]}>
              {domain === 'all' ? 'All' : getDomainDisplayName(domain)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderExerciseCard = ({ item: exercise }: { item: Exercise }) => (
    <View style={styles.exerciseCard} testID={`exercise-card-${exercise.id}`}>
      <View style={styles.exerciseHeader}>
        <View style={[styles.exerciseIcon, { backgroundColor: getDomainColor(exercise.domain) + '20' }]}>
          <Ionicons name={exercise.icon as any} size={24} color={getDomainColor(exercise.domain)} />
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          <View style={styles.exerciseMeta}>
            <View style={styles.difficultyContainer}>
              {renderStars(exercise.difficulty)}
            </View>
            <Text style={styles.exerciseTime}>{exercise.estimatedMinutes} min</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.exerciseTagsContainer}>
        {exercise.tags.map((tag, index) => (
          <View key={index} style={styles.exerciseTag}>
            <Text style={styles.exerciseTagText}>{tag}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => {
          // Navigate to exercise detail
          console.log('Navigate to exercise detail:', exercise.id);
        }}
      >
        <Text style={styles.secondaryButtonText}>Try Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnalyticsSummary = () => {
    if (!analytics) return renderSkeleton(150);
    
    return (
      <View style={styles.section} testID="analytics-summary">
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCardTitle}>Cognitive Trend</Text>
            <Text style={styles.analyticsCardValue}>↗ Improving</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCardTitle}>Most Improved</Text>
            <Text style={styles.analyticsCardValue}>{getDomainDisplayName(analytics.mostImprovedArea as ExerciseDomain)}</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCardTitle}>Streak</Text>
            <Text style={styles.analyticsCardValue}>{analytics.consistencyStreak} days</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>View Detailed Report</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMotivationalZone = () => (
    <View style={styles.section} testID="motivation-zone">
      <Text style={styles.sectionTitle}>Stay Motivated</Text>
      
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>"{motivationalQuotes[currentQuoteIndex]}"</Text>
      </View>
      
      <View style={styles.achievementsContainer}>
        <Text style={styles.subsectionTitle}>Recent Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.filter(a => a.isUnlocked).map((achievement) => (
            <View key={achievement.id} style={styles.achievementBadge}>
              <Ionicons name={achievement.icon as any} size={24} color={WellnessTheme.colors.primary} />
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <TouchableOpacity style={styles.shareButton} onPress={handleShareSummary}>
        <Ionicons name="share" size={20} color={WellnessTheme.colors.primary} />
        <Text style={styles.shareButtonText}>Share Summary</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettings = () => {
    if (!settings) return renderSkeleton(200);
    
    return (
      <View style={styles.section} testID="settings-section">
        <Text style={styles.sectionTitle}>Settings & Personalization</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Session Length</Text>
          <View style={styles.segmentedControl}>
            {[5, 10, 15].map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.segmentButton,
                  settings.sessionLength === minutes && styles.segmentButtonActive
                ]}
                onPress={() => handleSettingChange('sessionLength', minutes)}
              >
                <Text style={[
                  styles.segmentText,
                  settings.sessionLength === minutes && styles.segmentTextActive
                ]}>
                  {minutes}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Adaptive Mode</Text>
          <Switch
            value={settings.adaptiveMode}
            onValueChange={(value) => handleSettingChange('adaptiveMode', value)}
            thumbColor={WellnessTheme.colors.primary}
            trackColor={{ false: '#E5E7EB', true: WellnessTheme.colors.primaryLight }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Voice Guidance</Text>
          <Switch
            value={settings.voiceGuidance}
            onValueChange={(value) => handleSettingChange('voiceGuidance', value)}
            thumbColor={WellnessTheme.colors.primary}
            trackColor={{ false: '#E5E7EB', true: WellnessTheme.colors.primaryLight }}
          />
        </View>
      </View>
    );
  };

  const renderSkeleton = (height: number) => (
    <View style={[styles.card, { height, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.skeletonText}>Loading...</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.title} testID="title">Cognitive & Daily Exercises</Text>
          {renderSkeleton(200)}
          {renderSkeleton(150)}
          {renderSkeleton(200)}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Calculate navigation height for bottom padding
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const navigationHeight = isSmallScreen ? 64 : isMediumScreen ? 68 : 72;
  const navigationBottomMargin = isSmallScreen ? 8 : 10;
  const totalNavigationSpace = navigationHeight + navigationBottomMargin + insets.bottom + 20;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with profile and notifications */}
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingBottom: totalNavigationSpace }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title} testID="title">Cognitive & Daily Exercises</Text>
        
        {/* Daily Challenge */}
        {renderDailyChallenge()}
        
        {/* Exercise Library */}
        <View style={styles.section} testID="exercise-library">
          <Text style={styles.sectionTitle}>Exercise Library</Text>
          {renderFilterChips()}
          
          <FlatList
            data={exercises}
            renderItem={renderExerciseCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: WellnessTheme.spacing.md }} />}
          />
        </View>
        
        {/* Analytics Summary */}
        {renderAnalyticsSummary()}
        
        {/* Motivational Zone */}
        {renderMotivationalZone()}
        
        {/* Settings */}
        {renderSettings()}
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
  content: {
    padding: WellnessTheme.spacing.lg,
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
  title: {
    fontSize: WellnessTheme.fontSize.xxxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xl,
  },
  
  // Card components
  card: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.xl,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.xl,
    ...WellnessTheme.shadows.md,
  },
  cardTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  
  // Progress bar
  progressTrack: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: WellnessTheme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  
  // Modules list
  modulesList: {
    gap: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.lg,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  moduleDetails: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: 'bold',
    color: WellnessTheme.colors.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    alignItems: 'center',
    marginTop: WellnessTheme.spacing.md,
  },
  secondaryButtonText: {
    fontSize: WellnessTheme.fontSize.md,
    fontWeight: '600',
    color: WellnessTheme.colors.primary,
  },
  
  // Sections
  section: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: WellnessTheme.fontSize.xl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.lg,
  },
  subsectionTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.md,
  },
  
  // Filter chips
  filterContainer: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  filterChip: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.full,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    marginRight: WellnessTheme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: WellnessTheme.colors.primary,
    borderColor: WellnessTheme.colors.primary,
  },
  filterChipText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: WellnessTheme.colors.white,
  },
  
  // Exercise cards
  exerciseCard: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    ...WellnessTheme.shadows.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    marginBottom: WellnessTheme.spacing.md,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: WellnessTheme.spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  exerciseDescription: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WellnessTheme.spacing.md,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  exerciseTime: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  exerciseTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: WellnessTheme.spacing.sm,
    marginBottom: WellnessTheme.spacing.md,
  },
  exerciseTag: {
    paddingHorizontal: WellnessTheme.spacing.sm,
    paddingVertical: WellnessTheme.spacing.xs,
    backgroundColor: WellnessTheme.colors.primaryLight,
    borderRadius: WellnessTheme.borderRadius.sm,
  },
  exerciseTagText: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.primary,
    fontWeight: '500',
  },
  
  // Analytics
  analyticsGrid: {
    flexDirection: 'row',
    gap: WellnessTheme.spacing.md,
    marginBottom: WellnessTheme.spacing.lg,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
    alignItems: 'center',
    ...WellnessTheme.shadows.sm,
  },
  analyticsCardTitle: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: WellnessTheme.spacing.xs,
  },
  analyticsCardValue: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: 'bold',
    color: WellnessTheme.colors.primary,
    textAlign: 'center',
  },
  
  // Motivational zone
  quoteCard: {
    backgroundColor: WellnessTheme.colors.primaryLight,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.lg,
    marginBottom: WellnessTheme.spacing.lg,
  },
  quoteText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  achievementsContainer: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  achievementBadge: {
    alignItems: 'center',
    marginRight: WellnessTheme.spacing.lg,
    minWidth: 80,
  },
  achievementTitle: {
    fontSize: WellnessTheme.fontSize.xs,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: WellnessTheme.spacing.xs,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: WellnessTheme.colors.primary,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: WellnessTheme.spacing.md,
  },
  shareButtonText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.primary,
    marginLeft: WellnessTheme.spacing.sm,
  },
  
  // Settings
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: WellnessTheme.colors.border,
  },
  settingLabel: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: WellnessTheme.colors.border,
    borderRadius: WellnessTheme.borderRadius.lg,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.md,
  },
  segmentButtonActive: {
    backgroundColor: WellnessTheme.colors.primary,
  },
  segmentText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
  },
  segmentTextActive: {
    color: WellnessTheme.colors.white,
    fontWeight: '600',
  },
  
  // Loading
  skeletonText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
});