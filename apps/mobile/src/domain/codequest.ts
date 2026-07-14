export type DriverProfile = {
  id: string;
  firstName: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  streakDays: number;
  totalLearningMinutes: number;
  globalSuccessRate: number;
  examGoalDate: string;
  weeklyStudyGoalMinutes: number;
};

export type ReadinessSnapshot = {
  score: number;
  examProgress: number;
  estimatedTrainingDays: number;
};

export type Topic = {
  id: string;
  label: string;
  description: string;
  masteryScore: number;
};

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type AnswerOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  topicId: string;
  prompt: string;
  answers: AnswerOption[];
  correctAnswerIds: string[];
  explanation: string;
  difficulty: QuestionDifficulty;
};

export type DailyMissionTask = {
  id: string;
  label: string;
  completed: boolean;
};

export type DailyMission = {
  id: string;
  date: string;
  durationMinutes: number;
  targetProgress: number;
  tasks: DailyMissionTask[];
};

export type MistakeStatus = 'not_understood' | 'to_review' | 'mastered';

export type CorrectionStatusByQuestionId = Record<string, MistakeStatus>;

export type Mistake = {
  id: string;
  questionId: string;
  topicId: string;
  status: MistakeStatus;
  lastAnsweredAt: string;
  nextReviewAt: string;
  selectedAnswerIds: string[];
};
