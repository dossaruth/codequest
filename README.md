# CodeQuest

CodeQuest est une application mobile intelligente pour apprendre, s'evaluer et progresser au code de la route avec missions quotidiennes, gamification et coach IA.

## Vision

Les applications classiques suivent surtout le nombre de questions faites. CodeQuest veut aller plus loin: comprendre ce que l'utilisateur maitrise, ce qu'il oublie, et quoi travailler ensuite.

L'objectif est de transformer la preparation au code de la route en parcours visible, personnalise et motivant:

- apprentissage adapte au niveau;
- progression mesurable;
- entrainement par themes et faiblesses;
- revision intelligente des erreurs;
- missions quotidiennes;
- XP, niveaux, badges et succes;
- coach IA capable d'expliquer, guider et planifier.

## Produit

CodeQuest accompagne chaque utilisateur avec un profil evolutif:

- niveau global;
- points d'experience;
- rang conducteur;
- historique de progression;
- serie de jours d'entrainement;
- temps d'apprentissage;
- taux de reussite global;
- objectif personnel, comme une date d'examen ou un rythme d'etude.

## Fonctionnalites Cibles

- Tableau de bord personnalise
- Missions quotidiennes
- Mode rapide
- Mode classique
- Mode cible par theme
- Mode faiblesse
- Simulation d'examen reel
- Revision espacee des erreurs
- Badges, succes et challenges
- CodeQuest Score pour estimer la preparation a l'examen
- Coach IA pour expliquer les erreurs et proposer un programme

## Stack Technique Visee

### Mobile

- React Native
- Expo
- TypeScript
- Zustand
- TanStack Query

### Backend Principal

- Java 21
- Spring Boot
- Spring Security
- JPA / Hibernate
- PostgreSQL
- Flyway
- Redis

### Service IA

- Python
- FastAPI
- LLM API
- Vector database

### Infrastructure

- Docker
- GitHub Actions
- Azure
- Monitoring

## Architecture Cible

```text
Mobile React Native
        |
        v
Spring Boot API principale
        |
        v
PostgreSQL / Redis
        |
        v
FastAPI service IA
        |
        v
LLM / Vector DB
```

## Structure Du Projet

```text
codequest/
  apps/
    mobile/
  services/
    api/
    ai/
  docs/
  infra/
```

## Roadmap

Voir [docs/ROADMAP.md](docs/ROADMAP.md).

## Statut

Projet en phase de cadrage et de fondation technique.
