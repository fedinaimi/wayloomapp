import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WellnessTheme } from '../utils/wellnessTheme';

interface WellnessButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
}

export default function WellnessButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  containerStyle,
}: WellnessButtonProps) {
  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? WellnessTheme.colors.primary : WellnessTheme.colors.white} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[
            styles.text,
            variant === 'secondary' && styles.textSecondary,
            variant === 'outline' && styles.textOutline,
            disabled && styles.textDisabled
          ]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={disabled ? ['#E5E7EB', '#E5E7EB'] : WellnessTheme.colors.gradients.purple as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, disabled && styles.buttonDisabled]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'outline' && styles.buttonOutline,
        disabled && styles.buttonDisabled,
        containerStyle
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: WellnessTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
  },
  buttonSecondary: {
    backgroundColor: WellnessTheme.colors.secondary,
    borderColor: WellnessTheme.colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: WellnessTheme.colors.primary,
    borderWidth: 2,
  },
  buttonDisabled: {
    backgroundColor: WellnessTheme.colors.border,
    borderColor: WellnessTheme.colors.border,
  },
  gradient: {
    minHeight: 56,
    paddingHorizontal: WellnessTheme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.white,
    textAlign: 'center',
  },
  textSecondary: {
    color: WellnessTheme.colors.white,
  },
  textOutline: {
    color: WellnessTheme.colors.primary,
  },
  textDisabled: {
    color: WellnessTheme.colors.textSecondary,
  },
  leftIcon: {
    marginRight: WellnessTheme.spacing.sm,
  },
  rightIcon: {
    marginLeft: WellnessTheme.spacing.sm,
  },
});