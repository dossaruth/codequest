import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { demoQuestions, demoTopics, demoUserProfile } from '../../data/demoData';
import type { DriverProfile, MistakeStatus, Question } from '../../domain/codequest';

import {
  DEFAULT_CORRECTION_STATUS,
  MISTAKE_STATUS_OPTIONS,
  buildCorrectionItems,
  buildInitialCorrectionStatuses,
  calculateTrainingResult,
  formatDuration,
  getDifficultyLabel,
  getMistakeStatusOption,
  type CorrectionStatusByQuestionId,
  type TrainingAnswerRecord,
  type TrainingCorrectionItem,
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
  const [isViewingCorrections, setIsViewingCorrections] = useState(false);
  const [correctionStatuses, setCorrectionStatuses] = useState<CorrectionStatusByQuestionId>({});

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
    setCorrectionStatuses((statuses) => {
      if (isCorrect) {
        return statuses;
      }

      return {
        ...statuses,
        [currentQuestion.id]: statuses[currentQuestion.id] ?? DEFAULT_CORRECTION_STATUS,
      };
    });
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
    setIsViewingCorrections(false);
    setCorrectionStatuses({});
  }

  function getMissedQuestionIds() {
    return answerRecords.filter((answer) => !answer.isCorrect).map((answer) => answer.questionId);
  }

  function handlePracticeMistakes() {
    const missedQuestionIds = getMissedQuestionIds();

    if (missedQuestionIds.length === 0) {
      return;
    }

    resetTraining(missedQuestionIds);
  }

  function handleViewCorrections() {
    const missedQuestionIds = getMissedQuestionIds();

    if (missedQuestionIds.length === 0) {
      return;
    }

    setCorrectionStatuses((statuses) => ({
      ...buildInitialCorrectionStatuses(answerRecords),
      ...statuses,
    }));
    setIsViewingCorrections(true);
  }

  function handleChangeCorrectionStatus(questionId: string, status: MistakeStatus) {
    setCorrectionStatuses((statuses) => ({
      ...statuses,
      [questionId]: status,
    }));
  }

  if (isFinished && isViewingCorrections) {
    return (
      <TrainingCorrections
        answerRecords={answerRecords}
        correctionStatuses={correctionStatuses}
        onChangeCorrectionStatus={handleChangeCorrectionStatus}
        onBackToResult={() => setIsViewingCorrections(false)}
        onExit={onExit}
        onNewSeries={() => resetTraining(null)}
        onPracticeMistakes={handlePracticeMistakes}
        questions={questions}
      />
    );
  }

  if (isFinished) {
    return (
      <TrainingResult
        answerRecords={answerRecords}
        durationSeconds={completedDurationSeconds ?? 0}
        onExit={onExit}
        onNewSeries={() => resetTraining(null)}
        onViewCorrections={handleViewCorrections}
        questions={questions}
        userProfile={demoUserProfile}
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
            accessibilityLabel="Retour à l'accueil"
            accessibilityRole="button"
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
                accessibilityLabel={`Réponse : ${answer.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
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
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedAnswerId }}
        >
          <Text style={styles.primaryButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Terminer la série' : 'Valider'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function TrainingCorrections({
  answerRecords,
  correctionStatuses,
  onChangeCorrectionStatus,
  onBackToResult,
  onExit,
  onNewSeries,
  onPracticeMistakes,
  questions,
}: {
  answerRecords: TrainingAnswerRecord[];
  correctionStatuses: CorrectionStatusByQuestionId;
  onChangeCorrectionStatus: (questionId: string, status: MistakeStatus) => void;
  onBackToResult: () => void;
  onExit: () => void;
  onNewSeries: () => void;
  onPracticeMistakes: () => void;
  questions: Question[];
}) {
  const correctionItems = buildCorrectionItems(questions, demoTopics, answerRecords);
  const hasCorrections = correctionItems.length > 0;
  const primaryActionLabel = hasCorrections ? "S'entraîner sur mes erreurs" : 'Continuer ma progression';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.correctionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={onBackToResult}
            accessibilityLabel="Retour au résultat"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </Pressable>
          <Text style={styles.headerMeta}>{formatCorrectionCount(correctionItems.length)}</Text>
        </View>

        <View style={styles.correctionsIntro}>
          <Text style={styles.resultEyebrow}>Corrections</Text>
          <Text style={styles.correctionsTitle}>Comprendre mes erreurs</Text>
          <Text style={styles.correctionsSubtitle}>
            Relis chaque explication avant de relancer une série ciblée.
          </Text>
        </View>

        {hasCorrections ? (
          correctionItems.map((item, index) => (
            <CorrectionCard
              key={item.id}
              correction={item}
              index={index}
              onChangeStatus={(status) => onChangeCorrectionStatus(item.id, status)}
              status={correctionStatuses[item.id] ?? DEFAULT_CORRECTION_STATUS}
            />
          ))
        ) : (
          <View style={styles.correctionCard}>
            <Text style={styles.correctionQuestion}>Aucune correction à afficher.</Text>
            <Text style={styles.correctionExplanation}>
              Cette série ne contient pas d'erreur à revoir pour le moment.
            </Text>
          </View>
        )}

        <View style={styles.resultActions}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={hasCorrections ? onPracticeMistakes : onExit}
            accessibilityLabel={primaryActionLabel}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButtonWide, pressed && styles.secondaryButtonPressed]}
            onPress={onNewSeries}
            accessibilityLabel="Lancer une nouvelle série"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Nouvelle série</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButtonWide, pressed && styles.secondaryButtonPressed]}
            onPress={onExit}
            accessibilityLabel="Retour à l'accueil"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TrainingResult({
  answerRecords,
  durationSeconds,
  onExit,
  onNewSeries,
  onViewCorrections,
  questions,
  userProfile,
}: {
  answerRecords: TrainingAnswerRecord[];
  durationSeconds: number;
  onExit: () => void;
  onNewSeries: () => void;
  onViewCorrections: () => void;
  questions: Question[];
  userProfile?: DriverProfile;
}) {
  const totalQuestions = questions.length;
  const { score, successRate, xpGained, missedAnswers, feedback, analysis, strengths, weaknesses } =
    calculateTrainingResult(questions, demoTopics, answerRecords);
  const canReviewMistakes = missedAnswers.length > 0;
  const primaryActionLabel = canReviewMistakes ? 'Voir les corrections' : 'Continuer ma progression';
  const totalXpLabel = userProfile ? `Total : ${formatXpAmount(userProfile.xp)} XP` : undefined;
  const levelProgressLabel =
    userProfile && typeof userProfile.nextLevelXp === 'number'
      ? `+${formatXpAmount(xpGained)} XP vers le niveau suivant`
      : undefined;

  function handlePrimaryResultAction() {
    if (canReviewMistakes) {
      onViewCorrections();
      return;
    }

    onExit();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.resultContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultEyebrow}>Série terminée</Text>
        <Text style={styles.resultTitle}>
          {score}/{totalQuestions}
        </Text>
        <View style={styles.resultFeedbackBlock}>
          <Text style={styles.resultFeedbackTitle}>{feedback.title}</Text>
          <Text style={styles.resultSubtitle}>{feedback.message}</Text>
        </View>

        <View style={styles.resultStatsGrid}>
          <ResultStat label="XP gagnés" value={`+${formatXpAmount(xpGained)} XP`} helper={totalXpLabel} />
          <ResultStat label="Taux de réussite" value={`${successRate}%`} helper="réussite sur cette série" />
          <ResultStat label="Temps réalisé" value={formatDuration(durationSeconds)} helper="durée totale" />
        </View>

        {userProfile ? (
          <View style={styles.resultLevelCard}>
            <Text style={styles.resultLevelTitle}>
              Niveau {userProfile.level} - {userProfile.rank}
            </Text>
            {levelProgressLabel ? <Text style={styles.resultLevelText}>{levelProgressLabel}</Text> : null}
          </View>
        ) : null}

        <View style={styles.resultAnalysisCard}>
          <Text style={styles.resultAnalysisTitle}>Analyse CodeQuest</Text>
          <Text style={styles.resultAnalysisText}>{analysis}</Text>
        </View>

        <ResultTopicSection
          emptyDescription="Consulte tes corrections pour progresser dès maintenant."
          emptyTitle="Aucun thème n'est encore validé sur cette série."
          title="Points forts"
          topics={strengths}
          variant="strength"
        />
        <ResultTopicSection
          emptyDescription="Continue avec une nouvelle série pour confirmer ta progression."
          emptyTitle="Aucun thème prioritaire à revoir sur cette série."
          title="À travailler"
          topics={weaknesses}
          variant="weakness"
        />

        <View style={styles.resultActions}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={handlePrimaryResultAction}
            accessibilityLabel={primaryActionLabel}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButtonWide, pressed && styles.secondaryButtonPressed]}
            onPress={onNewSeries}
            accessibilityLabel="Lancer une nouvelle série"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Nouvelle série</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButtonWide, pressed && styles.secondaryButtonPressed]}
            onPress={onExit}
            accessibilityLabel="Retour à l'accueil"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CorrectionCard({
  correction,
  index,
  onChangeStatus,
  status,
}: {
  correction: TrainingCorrectionItem;
  index: number;
  onChangeStatus: (status: MistakeStatus) => void;
  status: MistakeStatus;
}) {
  const statusOption = getMistakeStatusOption(status);

  return (
    <View style={styles.correctionCard}>
      <View style={styles.correctionCardHeader}>
        <Text style={styles.correctionIndex}>Erreur {index + 1}</Text>
        <Text style={styles.correctionTopic}>{correction.topicLabel}</Text>
      </View>

      <Text style={styles.correctionQuestion}>{correction.question.prompt}</Text>

      <View style={styles.correctionAnswerBlock}>
        <Text style={styles.correctionAnswerLabel}>Ta réponse</Text>
        <Text style={styles.correctionWrongAnswer}>{correction.selectedAnswerLabel}</Text>
      </View>

      <View style={styles.correctionAnswerBlock}>
        <Text style={styles.correctionAnswerLabel}>Bonne réponse</Text>
        <Text style={styles.correctionRightAnswer}>{correction.correctAnswerLabels.join(', ')}</Text>
      </View>

      <View style={styles.correctionExplanationBlock}>
        <Text style={styles.correctionAnswerLabel}>Explication</Text>
        <Text style={styles.correctionExplanation}>{correction.explanation}</Text>
      </View>

      <View style={styles.correctionStatusBlock}>
        <View style={styles.correctionStatusHeader}>
          <Text style={styles.correctionAnswerLabel}>Statut de révision</Text>
          <Text style={styles.correctionStatusValue}>{statusOption.title}</Text>
        </View>
        <Text style={styles.correctionStatusDescription}>{statusOption.description}</Text>
        <Text style={styles.correctionStatusHint}>{statusOption.nextReviewHint}</Text>

        <View style={styles.correctionStatusOptions}>
          {MISTAKE_STATUS_OPTIONS.map((option) => {
            const isSelected = option.status === status;

            return (
              <Pressable
                key={option.status}
                style={({ pressed }) => [
                  styles.correctionStatusButton,
                  isSelected && styles.correctionStatusButtonSelected,
                  pressed && styles.correctionStatusButtonPressed,
                ]}
                onPress={() => onChangeStatus(option.status)}
                accessibilityLabel={`Définir le statut : ${option.title}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.correctionStatusButtonText,
                    isSelected && styles.correctionStatusButtonTextSelected,
                  ]}
                >
                  {option.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function ResultStat({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <View style={styles.resultStatCard} accessible accessibilityLabel={`${label}. ${value}. ${helper ?? ''}`}>
      <Text style={styles.resultStatLabel}>{label}</Text>
      <Text style={styles.resultStatValue}>{value}</Text>
      {helper ? <Text style={styles.resultStatHelper}>{helper}</Text> : null}
    </View>
  );
}

function ResultTopicSection({
  emptyDescription,
  emptyTitle,
  title,
  topics,
  variant,
}: {
  emptyDescription: string;
  emptyTitle: string;
  title: string;
  topics: TrainingTopicResult[];
  variant: 'strength' | 'weakness';
}) {
  return (
    <View style={styles.resultSection}>
      <Text style={styles.resultSectionTitle}>{title}</Text>
      {topics.length === 0 ? (
        <View style={styles.resultSectionEmptyBlock}>
          <Text style={styles.resultSectionEmptyTitle}>{emptyTitle}</Text>
          <Text style={styles.resultSectionEmpty}>{emptyDescription}</Text>
        </View>
      ) : (
        topics.map((topic) => (
          <View key={topic.id} style={styles.resultTopicItem}>
            <View style={styles.resultTopicTextGroup}>
              <Text style={styles.resultTopicLabel}>{topic.label}</Text>
              <Text style={styles.resultTopicMeta}>{formatAnswerRatio(topic)}</Text>
              {variant === 'weakness' && topic.mistakeCount > 0 ? (
                <Text style={styles.resultTopicMistake}>{formatMistakeCount(topic.mistakeCount)}</Text>
              ) : null}
              {variant === 'weakness' ? (
                <Text style={styles.resultTopicAdvice}>Revois ce thème avant ta prochaine série.</Text>
              ) : null}
            </View>
            <Text style={styles.resultTopicScore}>{topic.successRate}%</Text>
          </View>
        ))
      )}
    </View>
  );
}

function formatAnswerRatio(topic: TrainingTopicResult) {
  const answerLabel = topic.totalAnswers > 1 ? 'bonnes réponses' : 'bonne réponse';

  return `${topic.correctAnswers} / ${topic.totalAnswers} ${answerLabel}`;
}

function formatMistakeCount(mistakeCount: number) {
  return mistakeCount > 1 ? `${mistakeCount} erreurs` : `${mistakeCount} erreur`;
}

function formatXpAmount(amount: number) {
  return amount.toLocaleString('fr-FR');
}

function formatCorrectionCount(count: number) {
  return count > 1 ? `${count} erreurs` : `${count} erreur`;
}
