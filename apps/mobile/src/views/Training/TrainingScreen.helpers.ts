import type { MistakeStatus, Question, QuestionDifficulty, Topic } from '../../domain/codequest';

export type TrainingAnswerRecord = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
};

export type TrainingTopicResult = {
  id: string;
  label: string;
  correctAnswers: number;
  mistakeCount: number;
  totalAnswers: number;
  successRate: number;
};

export type ResultFeedback = {
  title: string;
  message: string;
};

export type TrainingCorrectionItem = {
  id: string;
  correctAnswerLabels: string[];
  explanation: string;
  question: Question;
  selectedAnswerLabel: string;
  topicLabel: string;
};

export type CorrectionStatusByQuestionId = Record<string, MistakeStatus>;

export type MistakeStatusOption = {
  description: string;
  nextReviewHint: string;
  status: MistakeStatus;
  title: string;
};

export type TrainingResultSummary = {
  score: number;
  successRate: number;
  xpGained: number;
  missedAnswers: TrainingAnswerRecord[];
  feedback: ResultFeedback;
  analysis: string;
  strengths: TrainingTopicResult[];
  weaknesses: TrainingTopicResult[];
};

const XP_PER_CORRECT_ANSWER = 12;
const PERFECT_SERIES_BONUS_XP = 20;
const TOPIC_STRENGTH_THRESHOLD = 80;
export const DEFAULT_CORRECTION_STATUS: MistakeStatus = 'to_review';

export const MISTAKE_STATUS_OPTIONS: MistakeStatusOption[] = [
  {
    description: 'La notion doit être reprise calmement avant une nouvelle série.',
    nextReviewHint: 'À revoir demain',
    status: 'not_understood',
    title: 'Non comprise',
  },
  {
    description: "La notion est identifiée, mais elle mérite encore de l'entraînement.",
    nextReviewHint: 'À revoir dans 3 jours',
    status: 'to_review',
    title: 'À revoir',
  },
  {
    description: 'La correction est comprise et peut être espacée.',
    nextReviewHint: 'À revoir dans 1 semaine',
    status: 'mastered',
    title: 'Maîtrisée',
  },
];

export function calculateTrainingResult(
  questions: Question[],
  topics: Topic[],
  answerRecords: TrainingAnswerRecord[],
): TrainingResultSummary {
  const score = answerRecords.filter((answer) => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const successRate = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  const xpGained =
    score * XP_PER_CORRECT_ANSWER + (totalQuestions > 0 && score === totalQuestions ? PERFECT_SERIES_BONUS_XP : 0);
  const missedAnswers = answerRecords.filter((answer) => !answer.isCorrect);
  const topicResults = buildTopicResults(questions, topics, answerRecords);
  const strengths = topicResults.filter((topic) => topic.successRate >= TOPIC_STRENGTH_THRESHOLD);
  const weaknesses = topicResults.filter((topic) => topic.successRate < TOPIC_STRENGTH_THRESHOLD);

  return {
    score,
    successRate,
    xpGained,
    missedAnswers,
    feedback: getResultFeedback(successRate),
    analysis: getResultAnalysis({ successRate, topicResults }),
    strengths,
    weaknesses,
  };
}

export function buildCorrectionItems(
  questions: Question[],
  topics: Topic[],
  answerRecords: TrainingAnswerRecord[],
): TrainingCorrectionItem[] {
  return answerRecords
    .filter((answer) => !answer.isCorrect)
    .map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId);

      if (!question) {
        return null;
      }

      const topic = topics.find((item) => item.id === question.topicId);

      return {
        id: answer.questionId,
        correctAnswerLabels: getCorrectAnswerLabels(question),
        explanation: question.explanation,
        question,
        selectedAnswerLabel: getAnswerLabel(question, answer.selectedAnswerId),
        topicLabel: topic?.label ?? 'Thème',
      };
    })
    .filter((item): item is TrainingCorrectionItem => item !== null);
}

export function buildInitialCorrectionStatuses(
  answerRecords: TrainingAnswerRecord[],
): CorrectionStatusByQuestionId {
  return answerRecords.reduce<CorrectionStatusByQuestionId>((statuses, answer) => {
    if (!answer.isCorrect) {
      statuses[answer.questionId] = DEFAULT_CORRECTION_STATUS;
    }

    return statuses;
  }, {});
}

export function getMistakeStatusOption(status: MistakeStatus) {
  return (
    MISTAKE_STATUS_OPTIONS.find((option) => option.status === status) ??
    MISTAKE_STATUS_OPTIONS.find((option) => option.status === DEFAULT_CORRECTION_STATUS) ??
    MISTAKE_STATUS_OPTIONS[0]
  );
}

export function getResultFeedback(successRate: number): ResultFeedback {
  if (successRate === 100) {
    return {
      title: 'Excellent !',
      message: 'Tu maîtrises parfaitement cette série.',
    };
  }

  if (successRate >= 80) {
    return {
      title: 'Très bon résultat !',
      message: 'Encore un petit effort pour atteindre la maîtrise complète.',
    };
  }

  if (successRate >= 50) {
    return {
      title: 'Tu progresses !',
      message: 'Regarde tes erreurs pour consolider tes acquis.',
    };
  }

  return {
    title: 'Ne lâche rien !',
    message: 'Chaque erreur est une occasion d’apprendre.',
  };
}

export function getResultAnalysis({
  successRate,
  topicResults,
}: {
  successRate: number;
  topicResults: TrainingTopicResult[];
}) {
  const weakestTopic = getWeakestTopic(topicResults);
  const weakestTopicSentence =
    topicResults.length > 1 && weakestTopic
      ? ` Le thème ${weakestTopic.label} est celui qui nécessite le plus de travail.`
      : '';

  if (successRate === 100) {
    return `Excellent résultat. Ce thème semble bien maîtrisé.${weakestTopicSentence}`;
  }

  if (successRate >= 80) {
    return `Très bon niveau sur cette série. Revois tes dernières erreurs pour atteindre une maîtrise complète.${weakestTopicSentence}`;
  }

  if (successRate >= 50) {
    return `Tu progresses, mais certaines notions restent fragiles. Une révision ciblée t’aidera à les consolider.${weakestTopicSentence}`;
  }

  return `Cette série montre que ce thème doit encore être renforcé. Consulte tes corrections avant de commencer une nouvelle série.${weakestTopicSentence}`;
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
    return `${seconds} s`;
  }

  return `${minutes} min ${seconds.toString().padStart(2, '0')} s`;
}

function getWeakestTopic(topicResults: TrainingTopicResult[]) {
  if (topicResults.length === 0) {
    return null;
  }

  return topicResults.reduce((weakestTopic, topic) => {
    if (topic.successRate < weakestTopic.successRate) {
      return topic;
    }

    if (topic.successRate === weakestTopic.successRate && topic.mistakeCount > weakestTopic.mistakeCount) {
      return topic;
    }

    return weakestTopic;
  });
}

function getAnswerLabel(question: Question, answerId: string) {
  return question.answers.find((answer) => answer.id === answerId)?.label ?? 'Réponse sélectionnée non disponible';
}

function getCorrectAnswerLabels(question: Question) {
  return question.correctAnswerIds.map((answerId) => getAnswerLabel(question, answerId));
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
      mistakeCount: 0,
      totalAnswers: 0,
      successRate: 0,
    };

    const nextCorrectAnswers = current.correctAnswers + (answer.isCorrect ? 1 : 0);
    const nextMistakeCount = current.mistakeCount + (answer.isCorrect ? 0 : 1);
    const nextTotalAnswers = current.totalAnswers + 1;

    accumulator[question.topicId] = {
      ...current,
      correctAnswers: nextCorrectAnswers,
      mistakeCount: nextMistakeCount,
      totalAnswers: nextTotalAnswers,
      successRate: Math.round((nextCorrectAnswers / nextTotalAnswers) * 100),
    };

    return accumulator;
  }, {});

  return Object.values(results);
}
