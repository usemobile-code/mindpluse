export type StressTier = 'ZEN' | 'BALANCED' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type Language = 'en' | 'hi';

export type MoodType =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'sad'
  | 'overwhelmed'
  | 'grateful'
  | 'energetic'
  | 'tired';

export interface DailyMoodRecord {
  id: string;
  userId: string;
  createdAt: number; // timestamp ms
  date?: string; // YYYY-MM-DD
  mood: MoodType;
  emoji: string;
  label: string;
  note?: string;
  stressModifier: number; // e.g. -65 to +95 pts
  syncedToCloud: boolean;
}

export interface MoodCalibrationInfo {
  mood: MoodType;
  emoji: string;
  label: string;
  stressModifier: number;
  rawScore: number;
  refinedScore: number;
}

export interface StressTierInfo {
  tier: StressTier;
  label: string;
  emoji: string;
  minScore: number;
  maxScore: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  gradient: string;
  description: string;
  statusQuote: string;
}

export interface Question {
  id: string;
  category: 'sleep' | 'cognitive' | 'emotional' | 'somatic' | 'control';
  categoryLabel: string;
  text: string;
  subtext?: string;
  options: {
    label: string;
    points: number; // 0 to 4
    hint?: string;
  }[];
}

export interface CategoryScore {
  category: string;
  label: string;
  score: number; // 100 to 1000
  percentage: number;
  severity: 'low' | 'moderate' | 'high';
}

export interface WellnessRecommendation {
  summary: string;
  stressTier: string;
  keyTriggers: string[];
  immediateGrounding: {
    title: string;
    duration: string;
    steps: string[];
  };
  dailyMicroHabits: {
    title: string;
    timeOfDay: string;
    description: string;
    benefit: string;
  }[];
  cognitiveReframes: {
    stressThought: string;
    empoweringReframe: string;
  }[];
  restorativePlan: {
    sleepAdvice: string;
    nervousSystemReset: string;
    boundaryTip: string;
  };
  affirmation: string;
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  createdAt: number; // timestamp ms
  score: number; // 100 - 1000 (final refined score)
  baseScore?: number; // raw score before mood adjustment
  appliedMoodModifier?: number; // e.g. -65 or +75
  appliedMood?: DailyMoodRecord; // mood check-in used during evaluation
  dailyMoodId?: string;
  moodCalibration?: MoodCalibrationInfo;
  tier: StressTier;
  emoji: string;
  categoryScores: Record<string, number>;
  answers: Record<string, number>; // questionId -> optionIndex
  userNotes?: string;
  recommendations: WellnessRecommendation;
  syncedToCloud: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface JournalSession {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  associatedScore?: number;
  syncedToCloud: boolean;
}

export interface OfflineSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingAssessmentsCount: number;
  pendingJournalsCount: number;
  pendingMoodsCount?: number;
  lastSyncedAt: number | null;
}
