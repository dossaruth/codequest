export type DashboardTopic = {
  id: string;
  label: string;
  score: number;
};

export type DailyMissionTask = {
  id: string;
  label: string;
  completed: boolean;
};

export type DashboardData = {
  user: {
    firstName: string;
    level: number;
    rank: string;
    xp: number;
    nextLevelXp: number;
    streakDays: number;
  };
  readiness: {
    score: number;
    examProgress: number;
    estimatedTrainingDays: number;
  };
  strengths: DashboardTopic[];
  weaknesses: DashboardTopic[];
  dailyMission: {
    durationMinutes: number;
    targetProgress: number;
    tasks: DailyMissionTask[];
  };
};

export const dashboardData: DashboardData = {
  user: {
    firstName: 'Dona',
    level: 14,
    rank: 'Conducteur confirme',
    xp: 7850,
    nextLevelXp: 9000,
    streakDays: 7,
  },
  readiness: {
    score: 89,
    examProgress: 82,
    estimatedTrainingDays: 8,
  },
  strengths: [
    { id: 'signs', label: 'Signalisation', score: 91 },
    { id: 'safety', label: 'Securite', score: 86 },
  ],
  weaknesses: [
    { id: 'priority', label: 'Priorites', score: 64 },
    { id: 'distance', label: 'Distances', score: 58 },
  ],
  dailyMission: {
    durationMinutes: 15,
    targetProgress: 75,
    tasks: [
      { id: 'priority-questions', label: '10 questions priorites', completed: true },
      { id: 'signs-questions', label: '10 questions signalisation', completed: false },
      { id: 'mistakes-review', label: 'Corriger 5 anciennes erreurs', completed: false },
    ],
  },
};
