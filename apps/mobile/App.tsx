import { useEffect, useState } from 'react';

import { DashboardScreen } from './src/views/Dashboard';
import { TrainingScreen } from './src/views/Training';
import {
  createInitialProgressState,
  loadLocalProgress,
  saveLocalProgress,
  type LocalProgressState,
} from './src/storage/progressStorage';

type CurrentView = 'dashboard' | 'training';

export default function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const [progress, setProgress] = useState<LocalProgressState>(() => createInitialProgressState());

  useEffect(() => {
    let isMounted = true;

    loadLocalProgress().then((storedProgress) => {
      if (isMounted) {
        setProgress(storedProgress);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleProgressChange(nextProgress: LocalProgressState) {
    setProgress(nextProgress);
    void saveLocalProgress(nextProgress);
  }

  if (currentView === 'training') {
    return (
      <TrainingScreen
        onExit={() => setCurrentView('dashboard')}
        onProgressChange={handleProgressChange}
        progress={progress}
      />
    );
  }

  return <DashboardScreen onStartTraining={() => setCurrentView('training')} progress={progress} />;
}
