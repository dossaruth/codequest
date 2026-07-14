import AsyncStorage from '@react-native-async-storage/async-storage';

import { demoReadiness, demoUserProfile } from '../data/demoData';
import type { CorrectionStatusByQuestionId, DriverProfile, ReadinessSnapshot } from '../domain/codequest';

const STORAGE_KEY = '@codequest/progress/v1';
const CURRENT_VERSION = 1;
const XP_STEP_PER_LEVEL = 1000;

export type LocalProgressUser = Pick<
  DriverProfile,
  'firstName' | 'id' | 'level' | 'nextLevelXp' | 'rank' | 'streakDays' | 'xp'
>;

export type LocalProgressState = {
  correctionStatuses: CorrectionStatusByQuestionId;
  lastTrainingDate: string | null;
  readiness: ReadinessSnapshot;
  updatedAt: string;
  user: LocalProgressUser;
  version: typeof CURRENT_VERSION;
};

export type CompletedTrainingProgressUpdate = {
  completedAt: string;
  correctionStatuses: CorrectionStatusByQuestionId;
  successRate: number;
  xpGained: number;
};

export function createInitialProgressState(): LocalProgressState {
  return {
    correctionStatuses: {},
    lastTrainingDate: null,
    readiness: {
      estimatedTrainingDays: demoReadiness.estimatedTrainingDays,
      examProgress: demoReadiness.examProgress,
      score: demoReadiness.score,
    },
    updatedAt: new Date().toISOString(),
    user: {
      firstName: demoUserProfile.firstName,
      id: demoUserProfile.id,
      level: demoUserProfile.level,
      nextLevelXp: demoUserProfile.nextLevelXp,
      rank: demoUserProfile.rank,
      streakDays: demoUserProfile.streakDays,
      xp: demoUserProfile.xp,
    },
    version: CURRENT_VERSION,
  };
}

export async function loadLocalProgress(): Promise<LocalProgressState> {
  const fallbackProgress = createInitialProgressState();

  try {
    const rawProgress = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawProgress) {
      return fallbackProgress;
    }

    return normalizeProgress(JSON.parse(rawProgress), fallbackProgress);
  } catch {
    return fallbackProgress;
  }
}

export async function saveLocalProgress(progress: LocalProgressState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function applyCompletedTrainingToProgress(
  progress: LocalProgressState,
  update: CompletedTrainingProgressUpdate,
): LocalProgressState {
  const userWithXp = applyXpToUser(progress.user, update.xpGained);
  const readiness = applyReadinessUpdate(progress.readiness, update.successRate);

  return {
    ...progress,
    correctionStatuses: {
      ...progress.correctionStatuses,
      ...update.correctionStatuses,
    },
    lastTrainingDate: getLocalDateKey(update.completedAt),
    readiness,
    updatedAt: update.completedAt,
    user: {
      ...userWithXp,
      streakDays: calculateNextStreak(progress.lastTrainingDate, update.completedAt, progress.user.streakDays),
    },
  };
}

function normalizeProgress(value: unknown, fallbackProgress: LocalProgressState): LocalProgressState {
  if (!isRecord(value)) {
    return fallbackProgress;
  }

  const storedUser = isRecord(value.user) ? value.user : {};
  const storedReadiness = isRecord(value.readiness) ? value.readiness : {};

  return {
    correctionStatuses: isCorrectionStatuses(value.correctionStatuses)
      ? value.correctionStatuses
      : fallbackProgress.correctionStatuses,
    lastTrainingDate: typeof value.lastTrainingDate === 'string' ? value.lastTrainingDate : null,
    readiness: {
      estimatedTrainingDays: readNumber(storedReadiness.estimatedTrainingDays, fallbackProgress.readiness.estimatedTrainingDays),
      examProgress: readNumber(storedReadiness.examProgress, fallbackProgress.readiness.examProgress),
      score: readNumber(storedReadiness.score, fallbackProgress.readiness.score),
    },
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : fallbackProgress.updatedAt,
    user: {
      firstName: readString(storedUser.firstName, fallbackProgress.user.firstName),
      id: readString(storedUser.id, fallbackProgress.user.id),
      level: readNumber(storedUser.level, fallbackProgress.user.level),
      nextLevelXp: readNumber(storedUser.nextLevelXp, fallbackProgress.user.nextLevelXp),
      rank: readString(storedUser.rank, fallbackProgress.user.rank),
      streakDays: readNumber(storedUser.streakDays, fallbackProgress.user.streakDays),
      xp: readNumber(storedUser.xp, fallbackProgress.user.xp),
    },
    version: CURRENT_VERSION,
  };
}

function applyXpToUser(user: LocalProgressUser, xpGained: number): LocalProgressUser {
  let level = user.level;
  let nextLevelXp = user.nextLevelXp;
  const xp = user.xp + xpGained;

  while (xp >= nextLevelXp) {
    level += 1;
    nextLevelXp += XP_STEP_PER_LEVEL;
  }

  return {
    ...user,
    level,
    nextLevelXp,
    rank: getRankForLevel(level),
    xp,
  };
}

function applyReadinessUpdate(readiness: ReadinessSnapshot, successRate: number): ReadinessSnapshot {
  const examProgress = clampPercentage(Math.round(readiness.examProgress * 0.85 + successRate * 0.15));
  const score = clampPercentage(Math.round(readiness.score * 0.8 + examProgress * 0.2));
  const estimatedTrainingDays = Math.max(0, Math.ceil((100 - examProgress) / 3));

  return {
    estimatedTrainingDays,
    examProgress,
    score,
  };
}

function calculateNextStreak(lastTrainingDate: string | null, completedAt: string, currentStreakDays: number) {
  const completedDate = getLocalDateKey(completedAt);

  if (!lastTrainingDate) {
    return Math.max(1, currentStreakDays);
  }

  if (lastTrainingDate === completedDate) {
    return currentStreakDays;
  }

  if (isPreviousDay(lastTrainingDate, completedDate)) {
    return currentStreakDays + 1;
  }

  return 1;
}

function getRankForLevel(level: number) {
  if (level >= 25) {
    return 'Maître du Code';
  }

  if (level >= 18) {
    return 'Expert';
  }

  if (level >= 10) {
    return 'Conducteur confirmé';
  }

  if (level >= 4) {
    return 'Apprenti';
  }

  return 'Nouveau conducteur';
}

function isPreviousDay(previousDate: string, currentDate: string) {
  const previous = new Date(`${previousDate}T00:00:00.000Z`);
  const current = new Date(`${currentDate}T00:00:00.000Z`);
  const diffInDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);

  return diffInDays === 1;
}

function getLocalDateKey(value: string) {
  return value.slice(0, 10);
}

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

function isCorrectionStatuses(value: unknown): value is CorrectionStatusByQuestionId {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(
    (status) => status === 'not_understood' || status === 'to_review' || status === 'mastered',
  );
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
