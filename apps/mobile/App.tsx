import { useState } from 'react';

import { DashboardScreen } from './src/views/Dashboard';
import { TrainingScreen } from './src/views/Training';

type CurrentView = 'dashboard' | 'training';

export default function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');

  if (currentView === 'training') {
    return <TrainingScreen onExit={() => setCurrentView('dashboard')} />;
  }

  return <DashboardScreen onStartTraining={() => setCurrentView('training')} />;
}
