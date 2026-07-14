import {
  demoDailyMission,
  demoReadiness,
  demoTopics,
  demoUserProfile,
} from './demoData';

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

const toDashboardTopic = ({ id, label, masteryScore }: (typeof demoTopics)[number]): DashboardTopic => ({
  id,
  label,
  score: masteryScore,
});

export const dashboardData: DashboardData = {
  user: {
    firstName: demoUserProfile.firstName,
    level: demoUserProfile.level,
    rank: demoUserProfile.rank,
    xp: demoUserProfile.xp,
    nextLevelXp: demoUserProfile.nextLevelXp,
    streakDays: demoUserProfile.streakDays,
  },
  readiness: {
    score: demoReadiness.score,
    examProgress: demoReadiness.examProgress,
    estimatedTrainingDays: demoReadiness.estimatedTrainingDays,
  },
  strengths: demoTopics.filter((topic) => topic.masteryScore >= 80).map(toDashboardTopic),
  weaknesses: demoTopics.filter((topic) => topic.masteryScore < 70).map(toDashboardTopic),
  dailyMission: {
    durationMinutes: demoDailyMission.durationMinutes,
    targetProgress: demoDailyMission.targetProgress,
    tasks: demoDailyMission.tasks,
  },
};
