// src/lib/types/index.ts

export interface Language {
  name: string;
  slug: string;
  paradigms: string[];
  typing: string;
  best_for: string[];
  frameworks: { name: string; use: string }[];
  glossary: { term: string; definition: string }[];
  exercises: string[];
}

export type ExerciseType = 'multiple_choice' | 'fill_blank';

export interface Exercise {
  id: string;
  language: string;
  topic: string;
  type: ExerciseType;
  question: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string;
}

export interface Attempt {
  id: number;
  exercise_id: string;
  answer: string;
  is_correct: boolean;
  attempted_at: string;
}

export interface Note {
  id: number;
  ref_type: 'exercise' | 'language';
  ref_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressStat {
  language: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface RecentError {
  exercise_id: string;
  question: string;
  topic: string;
  language: string;
  attempted_at: string;
}

export interface ProgressData {
  stats: ProgressStat[];
  recentErrors: RecentError[];
}
