export interface Exercise {
  id: string;
  title: string;
  description: string;
  domain: ExerciseDomain;
  difficulty: number; // 1-5 stars
  estimatedMinutes: number;
  tags: string[];
  icon: string;
  isCompleted?: boolean;
}

export interface DailyPlan {
  date: string;
  recommendedMinutes: number;
  completedPercent: number;
  modules: ExerciseModule[];
}

export interface ExerciseModule {
  id: string;
  title: string;
  domain: ExerciseDomain;
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface TrendData {
  date: string;
  score: number;
}

export interface AnalyticsSummary {
  cognitiveTrend: TrendData[];
  mostImprovedArea: string;
  consistencyStreak: number;
}

export type ExerciseDomain = 'memory' | 'focus' | 'speech' | 'motor' | 'emotion';

export interface UserSettings {
  sessionLength: 5 | 10 | 15;
  adaptiveMode: boolean;
  voiceGuidance: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}