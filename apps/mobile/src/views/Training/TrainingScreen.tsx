import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { demoQuestions, demoTopics } from '../../data/demoData';
import type { Question } from '../../domain/codequest';

import { styles } from './TrainingScreen.styles';

type TrainingScreenProps = {
  onExit: () => void;
};

type AnswerRecord = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
};

export function TrainingScreen({ onExit }: TrainingScreenProps) {
  const questions = demoQuestions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentTopic = useMemo(
    () => demoTopics.find((topic) => topic.id === currentQuestion.topicId),
    [currentQuestion.topicId],
  );

  const score = answerRecords.filter((answer) => answer.isCorrect).length;
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
      setIsFinished(true);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  }

  function handleRestart() {
    setCurrentQuestionIndex(0);
    setSelectedAnswerId(null);
    setAnswerRecords([]);
    setIsFinished(false);
  }

  if (isFinished) {
    return (
      <TrainingResult
        score={score}
        totalQuestions={questions.length}
        onExit={onExit}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.secondaryButton} onPress={onExit}>
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
          <Text style={styles.topicLabel}>{currentTopic?.label ?? 'Theme'}</Text>
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
          <Text style={styles.difficultyText}>Difficulte: {difficultyLabel(currentQuestion)}</Text>
        </View>

        <View style={styles.answerList}>
          {currentQuestion.answers.map((answer) => {
            const isSelected = answer.id === selectedAnswerId;

            return (
              <Pressable
                key={answer.id}
                style={[styles.answerButton, isSelected && styles.answerButtonSelected]}
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
          style={[styles.primaryButton, !selectedAnswerId && styles.primaryButtonDisabled]}
          onPress={handleValidateAnswer}
          disabled={!selectedAnswerId}
        >
          <Text style={styles.primaryButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Terminer la serie' : 'Valider'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function TrainingResult({
  score,
  totalQuestions,
  onExit,
  onRestart,
}: {
  score: number;
  totalQuestions: number;
  onExit: () => void;
  onRestart: () => void;
}) {
  const successRate = Math.round((score / totalQuestions) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.resultContainer}>
        <Text style={styles.resultEyebrow}>Serie terminee</Text>
        <Text style={styles.resultTitle}>
          {score}/{totalQuestions}
        </Text>
        <Text style={styles.resultSubtitle}>
          Taux de reussite: {successRate}%. Les corrections detaillees arriveront dans l'ecran
          resultat.
        </Text>
        <Pressable style={styles.primaryButton} onPress={onRestart}>
          <Text style={styles.primaryButtonText}>Recommencer</Text>
        </Pressable>
        <Pressable style={styles.secondaryButtonWide} onPress={onExit}>
          <Text style={styles.secondaryButtonText}>Retour au tableau de bord</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function difficultyLabel(question: Question) {
  if (question.difficulty === 'easy') {
    return 'facile';
  }

  if (question.difficulty === 'medium') {
    return 'moyenne';
  }

  return 'difficile';
}
