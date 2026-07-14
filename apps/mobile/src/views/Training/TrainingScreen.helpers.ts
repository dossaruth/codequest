import type { Question, QuestionDifficulty, Topic } from '../../domain/codequest';

export type TrainingAnswerRecord = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
};

export type TrainingTopicResult = {
  id: string;
  label: string;
  correctAnswers: number;
  totalAnswers: number;
  successRate: number;
};

export type TrainingResultSummary = {
  score: number;
  successRate: number;
  xpGained: number;
  missedAnswers: TrainingAnswerRecord[];
  strengths: TrainingTopicResult[];
  weaknesses: TrainingTopicResult[];
};

const XP_PER_CORRECT_ANSWER = 12;
const PERFECT_SERIES_BONUS_XP = 20;
const TOPIC_STRENGTH_THRESHOLD = 80;

export function calculateTrainingResult(
  questions: Question[],
  topics: Topic[],
  answerRecords: TrainingAnswerRecord[],
): TrainingResultSummary {
  const score = answerRecords.filter((answer) => answer.isCorrect).length;
  const successRate = Math.round((score / questions.length) * 100);
  const xpGained = score * XP_PER_CORRECT_ANSWER + (score === questions.length ? PERFECT_SERIES_BONUS_XP : 0);
  const missedAnswers = answerRecords.filter((answer) => !answer.isCorrect);
  const topicResults = buildTopicResults(questions, topics, answerRecords);

  return {
    score,
    successRate,
    xpGained,
    missedAnswers,
    strengths: topicResults.filter((topic) => topic.successRate >= TOPIC_STRENGTH_THRESHOLD),
    weaknesses: topicResults.filter((topic) => topic.successRate < TOPIC_STRENGTH_THRESHOLD),
  };
}

export function getDifficultyLabel(difficulty: QuestionDifficulty) {
  if (difficulty === 'easy') {
    return 'Facile';
  }

  if (difficulty === 'medium') {
    return 'Moyenne';
  }

  return 'Difficile';
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}min ${seconds.toString().padStart(2, '0')}s`;
}

function buildTopicResults(
  questions: Question[],
  topics: Topic[],
  answerRecords: TrainingAnswerRecord[],
): TrainingTopicResult[] {
  const results = answerRecords.reduce<Record<string, TrainingTopicResult>>((accumulator, answer) => {
    const question = questions.find((item) => item.id === answer.questionId);

    if (!question) {
      return accumulator;
    }

    const topic = topics.find((item) => item.id === question.topicId);
    const topicLabel = topic?.label ?? 'Thème';
    const current = accumulator[question.topicId] ?? {
      id: question.topicId,
      label: topicLabel,
      correctAnswers: 0,
      totalAnswers: 0,
      successRate: 0,
    };

    const nextCorrectAnswers = current.correctAnswers + (answer.isCorrect ? 1 : 0);
    const nextTotalAnswers = current.totalAnswers + 1;

    accumulator[question.topicId] = {
      ...current,
      correctAnswers: nextCorrectAnswers,
      totalAnswers: nextTotalAnswers,
      successRate: Math.round((nextCorrectAnswers / nextTotalAnswers) * 100),
    };

    return accumulator;
  }, {});

  return Object.values(results);
}
