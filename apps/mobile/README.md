# CodeQuest Mobile

Application mobile React Native / Expo pour le MVP CodeQuest.

## Stack

- React Native
- Expo
- TypeScript
- AsyncStorage

## Objectif Initial

Construire le MVP mobile avec des donnees locales:

- tableau de bord;
- mission du jour;
- entrainement;
- resultats;
- corrections;
- erreurs a revoir;
- profil conducteur.

## Prerequis

- Node.js LTS recent
- npm
- Expo Go sur mobile, si tu veux tester sur telephone

## Commandes

```powershell
npm install
npm run start
npm run android
npm run ios
npm run web
npm run typecheck
```

## Structure Actuelle

```text
src/
  data/
    dashboard.ts       Donnees preparees pour le tableau de bord
    demoData.ts        Donnees locales de demonstration
  domain/
    codequest.ts       Types metier principaux
  storage/
    progressStorage.ts Sauvegarde locale de la progression
  views/
    Dashboard/
      DashboardScreen.tsx
      DashboardScreen.styles.ts
      index.ts
    Training/
      TrainingScreen.helpers.ts
      TrainingScreen.tsx
      TrainingScreen.styles.ts
      index.ts
```

## Progression Locale

La progression utilisateur est sauvegardee localement avec AsyncStorage:

- XP, niveau, rang et serie de connexion;
- score de preparation;
- statuts automatiques des erreurs.

Pendant le developpement, supprimer les donnees de l'application ou vider le stockage du navigateur permet de repartir des donnees demo.

## Statut

Base Expo TypeScript avec tableau de bord, donnees locales de demonstration, entrainement, resultats, corrections et progression locale.
