import type {
  DailyMission,
  DriverProfile,
  Mistake,
  Question,
  ReadinessSnapshot,
  Topic,
} from '../domain/codequest';

export const demoUserProfile: DriverProfile = {
  id: 'user-dona',
  firstName: 'Dona',
  level: 14,
  xp: 7850,
  nextLevelXp: 9000,
  rank: 'Conducteur confirme',
  streakDays: 7,
  totalLearningMinutes: 1260,
  globalSuccessRate: 82,
  examGoalDate: '2026-08-15',
  weeklyStudyGoalMinutes: 120,
};

export const demoReadiness: ReadinessSnapshot = {
  score: 89,
  examProgress: 82,
  estimatedTrainingDays: 8,
};

export const demoTopics: Topic[] = [
  {
    id: 'signs',
    label: 'Signalisation',
    description: 'Panneaux, marquages au sol et indications temporaires.',
    masteryScore: 91,
  },
  {
    id: 'safety',
    label: 'Securite',
    description: 'Distances, vigilance, vitesse et comportement responsable.',
    masteryScore: 86,
  },
  {
    id: 'eco-driving',
    label: 'Eco-conduite',
    description: 'Conduite economique, anticipation et impact environnemental.',
    masteryScore: 78,
  },
  {
    id: 'parking',
    label: 'Stationnement',
    description: 'Arret, stationnement, zones interdites et manoeuvres.',
    masteryScore: 72,
  },
  {
    id: 'priority',
    label: 'Priorites',
    description: 'Priorite a droite, intersections et ronds-points.',
    masteryScore: 64,
  },
  {
    id: 'crossing',
    label: 'Croisements',
    description: 'Croisements difficiles, depassements et routes etroites.',
    masteryScore: 61,
  },
  {
    id: 'distance',
    label: 'Distances',
    description: 'Distance de securite, freinage et temps de reaction.',
    masteryScore: 58,
  },
];

export const demoQuestions: Question[] = [
  {
    id: 'question-priority-001',
    topicId: 'priority',
    prompt: 'A une intersection sans panneau, quel vehicule passe en premier ?',
    answers: [
      { id: 'a', label: 'Le vehicule qui vient de gauche' },
      { id: 'b', label: 'Le vehicule qui vient de droite' },
      { id: 'c', label: 'Le vehicule le plus rapide' },
    ],
    correctAnswerIds: ['b'],
    explanation: 'Sans signalisation particuliere, la priorite a droite s applique.',
    difficulty: 'easy',
  },
  {
    id: 'question-signs-001',
    topicId: 'signs',
    prompt: 'Un panneau rond a bord rouge indique generalement quoi ?',
    answers: [
      { id: 'a', label: 'Une obligation' },
      { id: 'b', label: 'Une interdiction' },
      { id: 'c', label: 'Une indication touristique' },
    ],
    correctAnswerIds: ['b'],
    explanation: 'Les panneaux ronds a bord rouge signalent souvent une interdiction.',
    difficulty: 'easy',
  },
  {
    id: 'question-distance-001',
    topicId: 'distance',
    prompt: 'Pourquoi augmenter la distance de securite par temps de pluie ?',
    answers: [
      { id: 'a', label: 'Parce que la distance de freinage augmente' },
      { id: 'b', label: 'Parce que le moteur chauffe plus vite' },
      { id: 'c', label: 'Parce que les panneaux sont moins nombreux' },
    ],
    correctAnswerIds: ['a'],
    explanation: 'Sur route mouillee, l adherence baisse et la distance de freinage augmente.',
    difficulty: 'medium',
  },
  {
    id: 'question-parking-001',
    topicId: 'parking',
    prompt: 'Peut-on stationner devant une sortie de garage ?',
    answers: [
      { id: 'a', label: 'Oui, si les feux de detresse sont allumes' },
      { id: 'b', label: 'Oui, seulement quelques minutes' },
      { id: 'c', label: 'Non, c est genant et interdit' },
    ],
    correctAnswerIds: ['c'],
    explanation: 'Stationner devant une sortie de garage gene les autres usagers.',
    difficulty: 'easy',
  },
  {
    id: 'question-safety-001',
    topicId: 'safety',
    prompt: 'Que faire en cas de fatigue au volant ?',
    answers: [
      { id: 'a', label: 'Augmenter le volume de la musique' },
      { id: 'b', label: 'S arreter dans un lieu sur et se reposer' },
      { id: 'c', label: 'Rouler plus vite pour arriver plus tot' },
    ],
    correctAnswerIds: ['b'],
    explanation: 'La fatigue reduit l attention. La bonne reaction est de s arreter.',
    difficulty: 'medium',
  },
];

export const demoDailyMission: DailyMission = {
  id: 'mission-2026-07-14',
  date: '2026-07-14',
  durationMinutes: 15,
  targetProgress: 75,
  tasks: [
    { id: 'priority-questions', label: '10 questions priorites', completed: true },
    { id: 'signs-questions', label: '10 questions signalisation', completed: false },
    { id: 'mistakes-review', label: 'Corriger 5 anciennes erreurs', completed: false },
  ],
};

export const demoMistakes: Mistake[] = [
  {
    id: 'mistake-001',
    questionId: 'question-priority-001',
    topicId: 'priority',
    status: 'to_review',
    lastAnsweredAt: '2026-07-13T18:20:00.000Z',
    nextReviewAt: '2026-07-15T08:00:00.000Z',
    selectedAnswerIds: ['a'],
  },
  {
    id: 'mistake-002',
    questionId: 'question-distance-001',
    topicId: 'distance',
    status: 'not_understood',
    lastAnsweredAt: '2026-07-12T19:10:00.000Z',
    nextReviewAt: '2026-07-14T08:00:00.000Z',
    selectedAnswerIds: ['b'],
  },
  {
    id: 'mistake-003',
    questionId: 'question-parking-001',
    topicId: 'parking',
    status: 'mastered',
    lastAnsweredAt: '2026-07-10T17:45:00.000Z',
    nextReviewAt: '2026-07-21T08:00:00.000Z',
    selectedAnswerIds: ['c'],
  },
];
