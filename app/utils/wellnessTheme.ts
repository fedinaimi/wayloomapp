export const WellnessTheme = {
  colors: {
    // Primary wellness colors
    primary: '#8B5CF6', // Purple
    secondary: '#06B6D4', // Cyan
    accent: '#F59E0B', // Amber
    
    // Pastel gradients
    gradients: {
      purple: ['#DDD6FE', '#C4B5FD', '#A78BFA'],
      blue: ['#DBEAFE', '#93C5FD', '#60A5FA'],
      pink: ['#FCE7F3', '#F9A8D4', '#F472B6'],
      green: ['#D1FAE5', '#86EFAC', '#4ADE80'],
      yellow: ['#FEF3C7', '#FDE68A', '#FBBF24'],
      orange: ['#FED7AA', '#FDBA74', '#FB923C'],
    },
    
    // Base colors
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    border: '#E5E7EB',
    divider: '#E5E7EB',
    white: '#FFFFFF',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    primaryLight: '#DDD6FE',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Card styles similar to the wellness app
  cardStyles: {
    meditation: {
      backgroundColor: '#DDD6FE',
      gradientColors: ['#DDD6FE', '#C4B5FD'],
    },
    activity: {
      backgroundColor: '#DBEAFE', 
      gradientColors: ['#DBEAFE', '#93C5FD'],
    },
    mood: {
      backgroundColor: '#FCE7F3',
      gradientColors: ['#FCE7F3', '#F9A8D4'],
    },
    journal: {
      backgroundColor: '#FEF3C7',
      gradientColors: ['#FEF3C7', '#FDE68A'],
    },
    wellness: {
      backgroundColor: '#D1FAE5',
      gradientColors: ['#D1FAE5', '#86EFAC'],
    },
  },
};