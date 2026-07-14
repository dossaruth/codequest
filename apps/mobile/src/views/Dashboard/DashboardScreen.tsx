import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { dashboardData } from '../../data/dashboard';
import type { DashboardTopic } from '../../data/dashboard';

import { styles } from './DashboardScreen.styles';

const formatXp = new Intl.NumberFormat('fr-FR');

type DashboardScreenProps = {
  onStartTraining: () => void;
};

export function DashboardScreen({ onStartTraining }: DashboardScreenProps) {
  const xpProgress = Math.round((dashboardData.user.xp / dashboardData.user.nextLevelXp) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CodeQuest</Text>
            <Text style={styles.title}>Bonjour {dashboardData.user.firstName}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakValue}>{dashboardData.user.streakDays}j</Text>
            <Text style={styles.streakLabel}>serie</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Niveau {dashboardData.user.level}</Text>
          <Text style={styles.heroTitle}>{dashboardData.user.rank}</Text>
          <Text style={styles.heroSubtitle}>
            {formatXp.format(dashboardData.user.xp)} XP sur{' '}
            {formatXp.format(dashboardData.user.nextLevelXp)} pour le prochain niveau
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.progressCaption}>{xpProgress}% du niveau complete</Text>
        </View>

        <View style={styles.statsGrid}>
          <MetricCard
            label="Progression examen"
            value={`${dashboardData.readiness.examProgress}%`}
            helper="niveau global"
          />
          <MetricCard
            label="CodeQuest Score"
            value={`${dashboardData.readiness.score}/100`}
            helper="pret bientot"
          />
          <MetricCard
            label="Objectif estime"
            value={`${dashboardData.readiness.estimatedTrainingDays} jours`}
            helper="entrainement restant"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mission du jour</Text>
            <Text style={styles.sectionMeta}>{dashboardData.dailyMission.durationMinutes} min</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Objectif: atteindre {dashboardData.dailyMission.targetProgress}% de maitrise globale.
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
          <Pressable style={styles.primaryButton} onPress={onStartTraining}>
            <Text style={styles.primaryButtonText}>Commencer l'entrainement</Text>
          </Pressable>
        </View>

        <View style={styles.topicsRow}>
          <TopicPanel title="Points forts" tone="success" topics={dashboardData.strengths} />
          <TopicPanel title="A travailler" tone="warning" topics={dashboardData.weaknesses} />
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
