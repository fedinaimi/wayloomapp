import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { WellnessTheme } from '../utils/wellnessTheme';

interface WellnessCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  description?: string;
  icon?: string;
  iconSize?: number;
  cardType?: 'meditation' | 'activity' | 'mood' | 'journal' | 'wellness';
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
  showProgress?: boolean;
  progressValue?: number;
}

const WellnessCard: React.FC<WellnessCardProps> = ({
  title,
  subtitle,
  value,
  description,
  icon,
  iconSize = 24,
  cardType = 'wellness',
  onPress,
  style,
  children,
  showProgress = false,
  progressValue = 0,
}) => {
  const cardStyle = WellnessTheme.cardStyles[cardType];
  const gradientColors = cardStyle.gradientColors;

  const CardContent = () => (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={icon as any} 
                size={iconSize} 
                color={WellnessTheme.colors.textPrimary} 
              />
            </View>
          )}
          
          <View style={styles.textContainer}>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
            <Text style={styles.title}>{title}</Text>
            {value && (
              <Text style={styles.value}>{value}</Text>
            )}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
          
          {showProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressValue}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{progressValue}%</Text>
            </View>
          )}
          
          {children}
        </View>
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: WellnessTheme.borderRadius.xl,
    overflow: 'hidden',
    ...WellnessTheme.shadows.md,
  },
  gradient: {
    flex: 1,
    padding: WellnessTheme.spacing.lg,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    marginBottom: WellnessTheme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  title: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  value: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  description: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textSecondary,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: WellnessTheme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: WellnessTheme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: WellnessTheme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: WellnessTheme.colors.white,
    borderRadius: WellnessTheme.borderRadius.sm,
  },
  progressText: {
    fontSize: WellnessTheme.fontSize.sm,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
  },
});

export default WellnessCard;