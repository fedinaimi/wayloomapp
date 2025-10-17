import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WellnessTheme } from '../utils/wellnessTheme';

interface CaregiverGreetingSectionProps {
  title: string;
  subtitle: string;
}

const CaregiverGreetingSection: React.FC<CaregiverGreetingSectionProps> = ({
  title,
  subtitle
}) => {
  return (
    <View style={styles.greetingSection}>
      <Text style={styles.greeting}>{title}</Text>
      <Text style={styles.subGreeting}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingSection: {
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.lg,
    paddingBottom: WellnessTheme.spacing.md,
  },
  greeting: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  subGreeting: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
});

export default CaregiverGreetingSection;