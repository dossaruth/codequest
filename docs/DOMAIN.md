# Modele Domaine Initial

## User

Represent un compte utilisateur.

Champs envisages:

- id;
- email;
- displayName;
- createdAt.

## DriverProfile

Represent la progression de l'utilisateur.

Champs envisages:

- userId;
- level;
- xp;
- rank;
- streakDays;
- globalSuccessRate;
- examGoalDate;
- weeklyStudyGoalMinutes.

## Topic

Represent un theme du code de la route.

Exemples:

- signalisation;
- priorites;
- croisements;
- stationnement;
- eco-conduite;
- securite;
- mecanique.

## Question

Represent une question d'entrainement.

Champs envisages:

- id;
- topicId;
- prompt;
- answers;
- correctAnswerIds;
- explanation;
- difficulty.

## TrainingSession

Represent une session d'entrainement.

Champs envisages:

- id;
- userId;
- mode;
- startedAt;
- completedAt;
- score;
- durationSeconds.

## Mistake

Represent une erreur a revoir.

Statuts:

- not_understood;
- to_review;
- mastered.

## DailyMission

Represent le programme du jour.

Champs envisages:

- id;
- userId;
- date;
- targetMinutes;
- tasks;
- completed;
- expectedProgressGain.

## Badge

Represent une recompense.

Exemples:

- 7 jours sans abandon;
- Expert signalisation;
- Maitre des priorites;
- Premier 40/40.
