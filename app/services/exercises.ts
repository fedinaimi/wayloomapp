import {
    Achievement,
    AnalyticsSummary,
    DailyPlan,
    Exercise,
    ExerciseDomain,
    TrendData,
    UserSettings
} from '../types/exercises';

// Mock exercise library
const exerciseLibrary: Exercise[] = [
  {
    id: 'mem-001',
    title: 'Word Association',
    description: 'Connect words to improve memory pathways',
    domain: 'memory',
    difficulty: 3,
    estimatedMinutes: 5,
    tags: ['verbal', 'recall'],
    icon: 'library',
  },
  {
    id: 'foc-001',
    title: 'Attention Training',
    description: 'Focus exercises to improve concentration',
    domain: 'focus',
    difficulty: 2,
    estimatedMinutes: 8,
    tags: ['concentration', 'sustained'],
    icon: 'eye',
  },
  {
    id: 'spe-001',
    title: 'Verbal Fluency',
    description: 'Practice speaking and language skills',
    domain: 'speech',
    difficulty: 4,
    estimatedMinutes: 10,
    tags: ['language', 'verbal'],
    icon: 'chatbubbles',
  },
  {
    id: 'mot-001',
    title: 'Fine Motor Skills',
    description: 'Hand coordination and dexterity exercises',
    domain: 'motor',
    difficulty: 2,
    estimatedMinutes: 7,
    tags: ['coordination', 'dexterity'],
    icon: 'hand-left',
  },
  {
    id: 'emo-001',
    title: 'Emotion Recognition',
    description: 'Identify and understand emotional expressions',
    domain: 'emotion',
    difficulty: 3,
    estimatedMinutes: 6,
    tags: ['emotions', 'social'],
    icon: 'happy',
  },
  {
    id: 'mem-002',
    title: 'Visual Memory',
    description: 'Remember patterns and visual information',
    domain: 'memory',
    difficulty: 4,
    estimatedMinutes: 12,
    tags: ['visual', 'patterns'],
    icon: 'images',
  },
];

// Mock achievements
const achievements: Achievement[] = [
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Completed exercises for 7 consecutive days',
    icon: 'flame',
    isUnlocked: true,
  },
  {
    id: 'focus-master',
    title: 'Focus Master',
    description: 'Completed 10 focus exercises',
    icon: 'eye',
    isUnlocked: true,
  },
  {
    id: 'memory-champion',
    title: 'Memory Champion',
    description: 'Achieved high scores in memory exercises',
    icon: 'brain',
    isUnlocked: false,
  },
];

// Mock motivational quotes
export const motivationalQuotes = [
  "Every small step forward is progress worth celebrating.",
  "Your brain is like a muscle - the more you exercise it, the stronger it gets.",
  "Consistency is the key to maintaining cognitive health.",
];

// Default settings
const defaultSettings: UserSettings = {
  sessionLength: 10,
  adaptiveMode: true,
  voiceGuidance: false,
};

export const getDailyPlan = async (): Promise<DailyPlan> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        date: new Date().toISOString().split('T')[0],
        recommendedMinutes: 15,
        completedPercent: 65,
        modules: [
          {
            id: 'mod-1',
            title: 'Morning Memory Boost',
            domain: 'memory',
            estimatedMinutes: 5,
            isCompleted: true,
          },
          {
            id: 'mod-2',
            title: 'Focus Training',
            domain: 'focus',
            estimatedMinutes: 5,
            isCompleted: true,
          },
          {
            id: 'mod-3',
            title: 'Speech Practice',
            domain: 'speech',
            estimatedMinutes: 5,
            isCompleted: false,
          },
        ],
      });
    }, 500);
  });
};

export const getExerciseLibrary = async (domain?: ExerciseDomain): Promise<Exercise[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = domain 
        ? exerciseLibrary.filter(exercise => exercise.domain === domain)
        : exerciseLibrary;
      resolve(filtered);
    }, 300);
  });
};

export const getTrend = async (): Promise<TrendData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const trend: TrendData[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        trend.push({
          date: date.toISOString().split('T')[0],
          score: Math.floor(Math.random() * 40) + 60, // 60-100 range
        });
      }
      
      resolve(trend);
    }, 400);
  });
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const trend = await getTrend();
  
  // Calculate most improved area (mock)
  const domains = ['memory', 'focus', 'speech', 'motor', 'emotion'];
  const mostImproved = domains[Math.floor(Math.random() * domains.length)];
  
  // Calculate streak
  let streak = 0;
  for (let i = trend.length - 1; i >= 0; i--) {
    if (trend[i].score > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return {
    cognitiveTrend: trend,
    mostImprovedArea: mostImproved,
    consistencyStreak: streak,
  };
};

export const getAchievements = async (): Promise<Achievement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(achievements);
    }, 200);
  });
};

// In-memory storage for settings (replace with AsyncStorage when available)
let cachedSettings: UserSettings = defaultSettings;

// Settings management
export const getUserSettings = async (): Promise<UserSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(cachedSettings), 100);
  });
};

export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  return new Promise((resolve) => {
    cachedSettings = settings;
    setTimeout(resolve, 100);
  });
};

export const getDomainDisplayName = (domain: ExerciseDomain): string => {
  const names = {
    memory: 'Memory',
    focus: 'Focus',
    speech: 'Speech',
    motor: 'Motor',
    emotion: 'Emotion',
  };
  return names[domain];
};

export const getDomainColor = (domain: ExerciseDomain): string => {
  const colors = {
    memory: '#8B5CF6', // Purple
    focus: '#3B82F6', // Blue
    speech: '#10B981', // Green
    motor: '#F59E0B', // Orange
    emotion: '#EF4444', // Red
  };
  return colors[domain];
};