import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TaskQueue } from './components/tasks/TaskQueue';
import { TimerBilling } from './components/timer/TimerBilling';
import { PromptStudio } from './components/prompts/PromptStudio';
import { BugPortal } from './components/bugs/BugPortal';
import { PerformanceAnalytics } from './components/perf/PerformanceAnalytics';
import { SettingsPanel } from './components/settings/SettingsPanel';
import type { ViewId } from './types';

function Shell() {
  const [view, setView] = useState<ViewId>('tasks');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex h-full">
        <Sidebar view={view} onNavigate={setView} />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-base/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 animate-fade-in">
            <Sidebar view={view} onNavigate={setView} onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header view={view} onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="grid-bg min-h-full">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 py-5">
              {view === 'tasks' && <TaskQueue />}
              {view === 'timer' && <TimerBilling />}
              {view === 'prompts' && <PromptStudio />}
              {view === 'bugs' && <BugPortal />}
              {view === 'performance' && <PerformanceAnalytics />}
              {view === 'settings' && <SettingsPanel />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}