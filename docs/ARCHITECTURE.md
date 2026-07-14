# Architecture

## Vue D'ensemble

CodeQuest est pense comme un monorepo pedagogique et evolutif.

```text
apps/mobile        Application mobile React Native / Expo
services/api       API principale Java / Spring Boot
services/ai        Microservice IA Python / FastAPI
infra              Docker, CI/CD, cloud et monitoring
docs               Documentation produit et technique
```

## Mobile

Le mobile est le point d'entree utilisateur.

Responsabilites:

- afficher le tableau de bord;
- lancer les modes d'entrainement;
- montrer les corrections;
- suivre la progression;
- consommer l'API principale;
- appeler indirectement le coach IA via le backend.

Technologies prevues:

- React Native;
- Expo;
- TypeScript;
- Zustand;
- TanStack Query.

## API Principale

L'API Spring Boot porte le coeur metier de CodeQuest.

Responsabilites:

- authentification;
- utilisateurs;
- profils conducteurs;
- questions;
- sessions d'entrainement;
- resultats;
- XP et niveaux;
- erreurs et revisions;
- orchestration avec le service IA.

## Base De Donnees

PostgreSQL stocke les donnees principales:

- comptes utilisateurs;
- progression;
- questions;
- resultats;
- erreurs;
- badges;
- objectifs.

Redis pourra servir pour:

- cache;
- rate limiting;
- sessions courtes;
- files legeres de traitement.

## Service IA

Le service FastAPI sera separe pour garder l'IA independante du backend principal.

Responsabilites:

- analyser les erreurs;
- generer des explications personnalisees;
- proposer des plans d'apprentissage;
- calculer des recommandations;
- connecter un LLM et une base vectorielle.

## Flux Principal

```text
1. L'utilisateur repond a une serie sur mobile.
2. Le mobile envoie les reponses a l'API Spring Boot.
3. L'API enregistre la session et met a jour la progression.
4. L'API identifie les themes faibles.
5. Si besoin, l'API demande une analyse au service IA.
6. Le mobile affiche correction, XP, progression et prochaine mission.
```
