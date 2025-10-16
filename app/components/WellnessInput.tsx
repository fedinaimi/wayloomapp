import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { WellnessTheme } from '../utils/wellnessTheme';

interface WellnessInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
}

export default function WellnessInput({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  ...textInputProps
}: WellnessInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : null]}
          placeholderTextColor={WellnessTheme.colors.textSecondary}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WellnessTheme.colors.cardBackground,
    borderRadius: WellnessTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: WellnessTheme.colors.border,
    minHeight: 56,
    paddingHorizontal: WellnessTheme.spacing.md,
  },
  inputError: {
    borderColor: WellnessTheme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: WellnessTheme.colors.textPrimary,
    paddingVertical: WellnessTheme.spacing.md,
  },
  inputWithLeftIcon: {
    marginLeft: WellnessTheme.spacing.sm,
  },
  leftIcon: {
    marginRight: WellnessTheme.spacing.sm,
  },
  rightIcon: {
    marginLeft: WellnessTheme.spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: WellnessTheme.colors.error,
    marginTop: WellnessTheme.spacing.xs,
  },
});