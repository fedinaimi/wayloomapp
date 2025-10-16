import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import WellnessButton from '../components/WellnessButton';
import WellnessInput from '../components/WellnessInput';
import { RootStackParamList } from '../types/navigation';
import { WellnessTheme } from '../utils/wellnessTheme';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

export default function SignInScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to consent screen or main app
      navigation.navigate('Consent');
    } catch (error) {
      console.error('SignIn error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/wayloomlogo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your medical dashboard</Text>
        </View>

        <View style={styles.form}>
          <WellnessInput
            label="Email Address"
            value={formData.email}
            onChangeText={(value: string) => updateFormData('email', value)}
            placeholder="Enter your email"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <WellnessInput
            label="Password"
            value={formData.password}
            onChangeText={(value: string) => updateFormData('password', value)}
            placeholder="Enter your password"
            error={errors.password}
            secureTextEntry
          />

          <View style={styles.forgotPasswordContainer}>
            <Text 
              style={styles.forgotPasswordText}
              onPress={() => {}}
            >
              Forgot Password?
            </Text>
          </View>

          <WellnessButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            containerStyle={styles.signInButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <WellnessButton
            title="Create Account"
            onPress={() => navigation.navigate('Consent')}
            variant="outline"
            containerStyle={styles.phoneButton}
          />

                    <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={styles.linkText} 
                onPress={() => navigation.navigate('Consent')}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WellnessTheme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: WellnessTheme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: WellnessTheme.spacing.xxl,
    paddingBottom: WellnessTheme.spacing.xl,
  },
  logoContainer: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: WellnessTheme.fontSize.xxxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    marginBottom: WellnessTheme.spacing.sm,
  },
  subtitle: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: WellnessTheme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
  },
  signInButton: {
    marginBottom: WellnessTheme.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: WellnessTheme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: WellnessTheme.colors.border,
  },
  dividerText: {
    marginHorizontal: WellnessTheme.spacing.md,
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textLight,
  },
  phoneButton: {
    marginBottom: WellnessTheme.spacing.xl,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: WellnessTheme.spacing.xl,
  },
  footerText: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
  },
  linkText: {
    color: WellnessTheme.colors.primary,
    fontWeight: '600',
  },
});