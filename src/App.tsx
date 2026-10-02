import { useEffect, useState } from 'react';
import { NamePrompt } from './components/modals/NamePrompt';
import { AppProvider, useAppState, useAppActions } from './context/AppContext';
import { DragProvider } from './context/DragContext';
import { Header } from './components/Header';
import { TaskBoard } from './components/TaskBoard';
import { Shelf } from './components/Shelf';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Atmosphere } from './components/Atmosphere';
import { DragGhost } from './components/DragGhost';
import { SessionModal } from './components/modals/SessionModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { BlindBoxModal } from './components/modals/BlindBoxModal';
import { CollectionModal } from './components/modals/CollectionModal';
import { SessionCompleteModal } from './components/modals/SessionCompleteModal';
import { FigureDetailModal } from './components/modals/FigureDetailModal';

const NAME_KEY = 'focus-friends-user-name';

// null = not asked yet, '' = user skipped
function loadName(): string | null {
  try {
    return localStorage.getItem(NAME_KEY);
  } catch {
    return null;
  }
}

function AppContent() {
  const [storedName, setStoredName] = useState<string | null>(loadName);
  const userName = storedName || undefined;

  const saveName = (name: string) => {
    setStoredName(name);
    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {
      // ignore storage failures; name just won't persist
    }
  };

  const { state } = useAppState();
  const { tickTimer, completeWorkPhase, completeBreakPhase } = useAppActions();

  useEffect(() => {
    if (!state.timer.running) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timer.running, tickTimer]);

  useEffect(() => {
    if (state.timer.left === 0 && state.timer.active && state.timer.running) {
      if (state.timer.phase === 'work') {
        completeWorkPhase(state.timer.mode === 'pomodoro' ? 'pomo-work' : 'timer-work');
      } else {
        completeBreakPhase();
      }
    }
  }, [state.timer.left, state.timer.active, state.timer.running, state.timer.phase, state.timer.mode, completeWorkPhase, completeBreakPhase]);

  return (
    <ParticleCanvas>
      <div
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: '#FBF7F0',
          backgroundImage: 'radial-gradient(rgba(211, 182, 240, 0.34) 1.4px, transparent 1.4px)',
          backgroundSize: '26px 26px',
        }}
      >
        <Atmosphere />
        <Header userName={userName} />
        <TaskBoard />
        <Shelf />

        <SessionModal />
        <AddTaskModal />
        <BlindBoxModal />
        <CollectionModal />
        <FigureDetailModal />
        <SessionCompleteModal />
        {storedName === null && <NamePrompt onSubmit={saveName} onSkip={() => saveName('')} />}
      </div>
    </ParticleCanvas>
  );
}

function App() {
  return (
    <AppProvider>
      <DragProvider>
        <AppContent />
        <DragGhost />
      </DragProvider>
    </AppProvider>
  );
}

export default App;
