import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  headerMeta: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonWide: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    height: '100%',
  },
  questionCard: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 20,
  },
  topicLabel: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 31,
  },
  difficultyText: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
  },
  answerList: {
    gap: 10,
  },
  answerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  answerButtonSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  answerText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  answerTextSelected: {
    color: '#1D4ED8',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  resultContainer: {
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 24,
  },
  resultEyebrow: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  resultTitle: {
    color: '#111827',
    fontSize: 56,
    fontWeight: '900',
    textAlign: 'center',
  },
  resultSubtitle: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 8,
    textAlign: 'center',
  },
});
