import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { demoQuestions, demoTopics } from '../../data/demoData';
import type { Question } from '../../domain/codequest';

import {
  calculateTrainingResult,
  formatDuration,
  getDifficultyLabel,
  type TrainingAnswerRecord,
  type TrainingTopicResult,
} from './TrainingScreen.helpers';
import { styles } from './TrainingScreen.styles';

type TrainingScreenProps = {
  onExit: () => void;
};

export function TrainingScreen({ onExit }: TrainingScreenProps) {
  const [reviewQuestionIds, setReviewQuestionIds] = useState<string[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerRecords, setAnswerRecords] = useState<TrainingAnswerRecord[]>([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [completedDurationSeconds, setCompletedDurationSeconds] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const questions = useMemo(() => {
    if (!reviewQuestionIds) {
      return demoQuestions;
    }

    return demoQuestions.filter((question) => reviewQuestionIds.includes(question.id));
  }, [reviewQuestionIds]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentTopic = useMemo(
    () => demoTopics.find((topic) => topic.id === currentQuestion.topicId),
    [currentQuestion.topicId],
  );

  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  function handleValidateAnswer() {
    if (!selectedAnswerId) {
      return;
    }

    const isCorrect = currentQuestion.correctAnswerIds.includes(selectedAnswerId);
    const nextAnswerRecords = [
      ...answerRecords,
      {
        questionId: currentQuestion.id,
        selectedAnswerId,
        isCorrect,
      },
    ];

    setAnswerRecords(nextAnswerRecords);
    setSelectedAnswerId(null);

    if (currentQuestionIndex === questions.length - 1) {
      setCompletedDurationSeconds(Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
      setIsFinished(true);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  }

  function resetTraining(nextReviewQuestionIds: string[] | null) {
    setReviewQuestionIds(nextReviewQuestionIds);
    setCurrentQuestionIndex(0);
    setSelectedAnswerId(null);
    setAnswerRecords([]);
    setStartedAt(Date.now());
    setCompletedDurationSeconds(null);
    setIsFinished(false);
  }

  function handleReviewMistakes() {
    const missedQuestionIds = answerRecords
      .filter((answer) => !answer.isCorrect)
      .map((answer) => answer.questionId);

    if (missedQuestionIds.length === 0) {
      return;
    }

    resetTraining(missedQuestionIds);
  }

  if (isFinished) {
    return (
      <TrainingResult
        answerRecords={answerRecords}
        durationSeconds={completedDurationSeconds ?? 0}
        onExit={onExit}
        onNewSeries={() => resetTraining(null)}
        onReviewMistakes={handleReviewMistakes}
        questions={questions}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={onExit}
          >
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </Pressable>
          <Text style={styles.headerMeta}>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.topicLabel}>{currentTopic?.label ?? 'Thème'}</Text>
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              Difficulté : {getDifficultyLabel(currentQuestion.difficulty)}
            </Text>
          </View>
        </View>

        <View style={styles.answerList}>
          {currentQuestion.answers.map((answer) => {
            const isSelected = answer.id === selectedAnswerId;

            return (
              <Pressable
                key={answer.id}
                style={({ pressed }) => [
                  styles.answerButton,
                  pressed && styles.answerButtonPressed,
                  isSelected && styles.answerButtonSelected,
                ]}
                onPress={() => setSelectedAnswerId(answer.id)}
              >
                <Text style={[styles.answerText, isSelected && styles.answerTextSelected]}>
                  {answer.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !selectedAnswerId && styles.primaryButtonDisabled,
            pressed && selectedAnswerId && styles.primaryButtonPressed,
          ]}
          onPress={handleValidateAnswer}
          disabled={!selectedAnswerId}
        >
          <Text style={styles.primaryButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Terminer la série' : 'Valider'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function TrainingResult({
  answerRecords,
  durationSeconds,
  onExit,
  onNewSeries,
  onReviewMistakes,
  questions,
}: {
  answerRecords: TrainingAnswerRecord[];
  durationSeconds: number;
  onExit: () => void;
  onNewSeries: () => void;
  onReviewMistakes: () => void;
  questions: Question[];
}) {
  const totalQuestions = questions.length;
  const { score, successRate, xpGained, missedAnswers, strengths, weaknesses } =
    calculateTrainingResult(questions, demoTopics, answerRecords);
  const canReviewMistakes = missedAnswers.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.resultContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultEyebrow}>Série terminée</Text>
        <Text style={styles.resultTitle}>
          {score}/{totalQuestions}
        </Text>
        <Text style={styles.resultSubtitle}>
          Vous avez terminé cette série avec {successRate}% de réussite.
        </Text>

        <View style={styles.resultStatsGrid}>
          <ResultStat label="XP gagnés" value={`+${xpGained}`} helper="Selon vos bonnes réponses" />
          <ResultStat label="Progression" value={`${successRate}%`} helper="réussite sur cette série" />
          <ResultStat label="Temps réalisé" value={formatDuration(durationSeconds)} helper="durée totale" />
        </View>

        <ResultTopicSection
          emptyText="Aucun point fort net sur cette série."
          title="Points forts"
          topics={strengths}
        />
        <ResultTopicSection
          emptyText="Aucun thème prioritaire à revoir."
          title="À travailler"
          topics={weaknesses}
        />

        <View style={styles.resultActions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              !canReviewMistakes && styles.primaryButtonDisabled,
              pressed && canReviewMistakes && styles.primaryButtonPressed,
            ]}
            onPress={onReviewMistakes}
            disabled={!canReviewMistakes}
          >
            <Text style={styles.primaryButtonText}>Revoir mes erreurs</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButtonWide, pressed && styles.secondaryButtonPressed]}
            onPress={onNewSeries}
          >
            <Text style={styles.secondaryButtonText}>Nouvelle série</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButtonWide, pressed && styles.secondaryButtonPressed]}
            onPress={onExit}
          >
            <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultStat({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <View style={styles.resultStatCard}>
      <Text style={styles.resultStatLabel}>{label}</Text>
      <Text style={styles.resultStatValue}>{value}</Text>
      <Text style={styles.resultStatHelper}>{helper}</Text>
    </View>
  );
}

function ResultTopicSection({
  emptyText,
  title,
  topics,
}: {
  emptyText: string;
  title: string;
  topics: TrainingTopicResult[];
}) {
  return (
    <View style={styles.resultSection}>
      <Text style={styles.resultSectionTitle}>{title}</Text>
      {topics.length === 0 ? (
        <Text style={styles.resultSectionEmpty}>{emptyText}</Text>
      ) : (
        topics.map((topic) => (
          <View key={topic.id} style={styles.resultTopicItem}>
            <View style={styles.resultTopicTextGroup}>
              <Text style={styles.resultTopicLabel}>{topic.label}</Text>
              <Text style={styles.resultTopicMeta}>
                {topic.correctAnswers}/{topic.totalAnswers} bonnes réponses
              </Text>
            </View>
            <Text style={styles.resultTopicScore}>{topic.successRate}%</Text>
          </View>
        ))
      )}
    </View>
  );
}
