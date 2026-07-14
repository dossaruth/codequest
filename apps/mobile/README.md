# CodeQuest Mobile

Application mobile React Native / Expo pour le MVP CodeQuest.

## Stack

- React Native
- Expo
- TypeScript
- Zustand
- TanStack Query

## Objectif Initial

Construire le MVP mobile avec des donnees locales:

- tableau de bord;
- mission du jour;
- entrainement;
- resultats;
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
    dashboard.ts      Donnees preparees pour le tableau de bord
    demoData.ts       Donnees locales de demonstration
  domain/
    codequest.ts      Types metier principaux
  views/
    Dashboard/
      DashboardScreen.tsx
      DashboardScreen.styles.ts
      index.ts
    Training/
      TrainingScreen.tsx
      TrainingScreen.styles.ts
      index.ts
```

## Statut

Base Expo TypeScript initialisee avec un premier tableau de bord, des donnees locales de demonstration et un mode entrainement simple.
