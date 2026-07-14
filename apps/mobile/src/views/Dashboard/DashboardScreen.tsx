import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { dashboardData } from '../../data/dashboard';
import type { DashboardTopic } from '../../data/dashboard';
import type { LocalProgressState } from '../../storage/progressStorage';

import { styles } from './DashboardScreen.styles';

const formatXp = new Intl.NumberFormat('fr-FR');

type DashboardScreenProps = {
  onStartTraining: () => void;
  progress: LocalProgressState;
};

export function DashboardScreen({ onStartTraining, progress }: DashboardScreenProps) {
  const xpProgress = Math.round((progress.user.xp / progress.user.nextLevelXp) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CodeQuest</Text>
            <Text style={styles.title}>Bonjour {progress.user.firstName}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakValue}>{progress.user.streakDays}j</Text>
            <Text style={styles.streakLabel}>série</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Niveau {progress.user.level}</Text>
          <Text style={styles.heroTitle}>{progress.user.rank}</Text>
          <Text style={styles.heroSubtitle}>
            {formatXp.format(progress.user.xp)} XP sur {formatXp.format(progress.user.nextLevelXp)} pour le prochain
            niveau
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.progressCaption}>{xpProgress}% du niveau complété</Text>
        </View>

        <View style={styles.statsGrid}>
          <MetricCard
            label="Maîtrise globale"
            value={`${progress.readiness.examProgress}%`}
            helper="Préparation actuelle"
          />
          <MetricCard
            label="CodeQuest Score"
            value={`${progress.readiness.score}/100`}
            helper="Indice de préparation"
          />
          <MetricCard
            label="Objectif estimé"
            value={`≈ ${progress.readiness.estimatedTrainingDays} jours`}
            helper="Estimation basée sur votre progression."
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mission du jour</Text>
            <Text style={styles.sectionMeta}>{dashboardData.dailyMission.durationMinutes} min</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Objectif : atteindre {dashboardData.dailyMission.targetProgress}% de maîtrise globale.
          </Text>
          <View style={styles.taskList}>
            {dashboardData.dailyMission.tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]} />
                <Text style={[styles.taskText, task.completed && styles.taskTextDone]}>
                  {task.label}
                </Text>
              </View>
            ))}
          </View>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={onStartTraining}
          >
            <Text style={styles.primaryButtonText}>Commencer l'entraînement</Text>
          </Pressable>
        </View>

        <View style={styles.topicsRow}>
          <TopicPanel title="Points forts" tone="success" topics={dashboardData.strengths} />
          <TopicPanel title="À travailler" tone="warning" topics={dashboardData.weaknesses} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHelper}>{helper}</Text>
    </View>
  );
}

function TopicPanel({
  title,
  tone,
  topics,
}: {
  title: string;
  tone: 'success' | 'warning';
  topics: DashboardTopic[];
}) {
  return (
    <View style={styles.topicPanel}>
      <Text style={styles.topicTitle}>{title}</Text>
      {topics.map((topic) => (
        <View key={topic.id} style={styles.topicItem}>
          <View
            style={[styles.topicDot, tone === 'success' ? styles.successDot : styles.warningDot]}
          />
          <View style={styles.topicContent}>
            <Text style={styles.topicLabel}>{topic.label}</Text>
            <View style={styles.topicTrack}>
              <View style={[styles.topicFill, { width: `${topic.score}%` }]} />
            </View>
          </View>
          <Text style={styles.topicScore}>{topic.score}%</Text>
        </View>
      ))}
    </View>
  );
}
