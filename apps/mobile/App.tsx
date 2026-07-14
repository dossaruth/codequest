import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DashboardTopic, dashboardData } from './src/data/dashboard';

const formatXp = new Intl.NumberFormat('fr-FR');

export default function App() {
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
          <View style={[styles.topicDot, tone === 'success' ? styles.successDot : styles.warningDot]} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  container: {
    gap: 18,
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    minWidth: 58,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  streakValue: {
    color: '#92400E',
    fontSize: 18,
    fontWeight: '800',
  },
  streakLabel: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  hero: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 20,
  },
  heroLabel: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  progressTrack: {
    backgroundColor: '#374151',
    borderRadius: 999,
    height: 10,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#22C55E',
    borderRadius: 999,
    height: '100%',
  },
  progressCaption: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '31%',
    flexGrow: 1,
    minWidth: 104,
    padding: 14,
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  metricHelper: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionDescription: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  taskList: {
    gap: 10,
    marginTop: 14,
  },
  taskItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  taskCheck: {
    borderColor: '#CBD5E1',
    borderRadius: 5,
    borderWidth: 2,
    height: 20,
    width: 20,
  },
  taskCheckDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  taskText: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  taskTextDone: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicPanel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 240,
    padding: 16,
  },
  topicTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  topicItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  topicDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  successDot: {
    backgroundColor: '#16A34A',
  },
  warningDot: {
    backgroundColor: '#F59E0B',
  },
  topicContent: {
    flex: 1,
  },
  topicLabel: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  topicTrack: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    height: 6,
    overflow: 'hidden',
  },
  topicFill: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    height: '100%',
  },
  topicScore: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
