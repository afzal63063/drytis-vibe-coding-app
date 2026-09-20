import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { CANDIDATE_NAME, CANDIDATE_ROLE, seedBugs, seedTasks, seedTimeEntries } from '../data/mockData';
import { uid } from '../utils/time';
import type {
  BugReport,
  BugStatus,
  Settings,
  Task,
  TaskCategory,
  TaskStatus,
  TierId,
  TimeEntry,
  TimerState,
} from '../types';

const STORAGE_KEY = 'drytis-workflow-v2';

export interface AppState {
  tasks: Task[];
  timeEntries: TimeEntry[];
  bugs: BugReport[];
  timer: TimerState;
  tier: TierId;
  settings: Settings;
}

export interface NewTaskInput {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Task['priority'];
  estimatedMinutes: number;
  assignee: string;
  clientName: string;
  subtaskTitles: string[];
}

export interface NewBugInput {
  title: string;
  stackTrace: string;
  severity: BugReport['severity'];
  flags: string[];
  clientName: string;
}

interface AppContextValue {
  state: AppState;
  activeTask: Task | null;
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  startTimer: (taskId: string | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  completeTimer: () => void;
  discardTimer: () => void;
  /** Elapsed seconds of the active session at epoch `now`. */
  sessionSeconds: (now: number) => number;
  setTier: (tier: TierId) => void;
  addBug: (input: NewBugInput) => void;
  setBugStatus: (id: string, status: BugStatus) => void;
  updateBug: (id: string, patch: Partial<BugReport>) => void;
  deleteBug: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
}

const defaultSettings: Settings = {
  engineerName: CANDIDATE_NAME,
  roleLabel: CANDIDATE_ROLE,
  csat: 4.9,
  nextTierHours: 40,
};

function makeInitialState(): AppState {
  return {
    tasks: seedTasks(),
    timeEntries: seedTimeEntries(),
    bugs: seedBugs(),
    timer: { taskId: null, running: false, startedAt: 0, accumulated: 0 },
    tier: 'tier2',
    settings: defaultSettings,
  };
}

function normalize(raw: unknown): AppState {
  const base = makeInitialState();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<AppState>;

  const tasks = Array.isArray(r.tasks)
    ? (r.tasks as Task[]).map((t) => ({
        ...(base.tasks[0] ?? ({} as Task)),
        ...t,
        subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
      }))
    : base.tasks;

  const timeEntries: TimeEntry[] = Array.isArray(r.timeEntries) ? (r.timeEntries as TimeEntry[]) : base.timeEntries;

  const bugs: BugReport[] = Array.isArray(r.bugs)
    ? (r.bugs as BugReport[]).map((b) => ({
        id: typeof b.id === 'string' ? b.id : uid(),
        title: typeof b.title === 'string' ? b.title : 'Untitled ticket',
        stackTrace: typeof b.stackTrace === 'string' ? b.stackTrace : '',
        severity: b.severity === 'P1' || b.severity === 'P2' || b.severity === 'P3' || b.severity === 'P4' ? b.severity : 'P3',
        status:
          b.status === 'open' || b.status === 'investigating' || b.status === 'escalated' || b.status === 'resolved'
            ? b.status
            : 'open',
        flags: Array.isArray(b.flags) ? b.flags : [],
        reporter: typeof b.reporter === 'string' ? b.reporter : 'Unknown',
        clientName: typeof b.clientName === 'string' ? b.clientName : 'Unassigned',
        createdAt: typeof b.createdAt === 'number' ? b.createdAt : Date.now(),
        resolutionNote: typeof b.resolutionNote === 'string' ? b.resolutionNote : undefined,
      }))
    : base.bugs;

  const timer: TimerState =
    r.timer && typeof r.timer === 'object'
      ? {
          taskId: 'taskId' in r.timer && typeof r.timer.taskId === 'string' ? r.timer.taskId : null,
          running: Boolean((r.timer as TimerState).running),
          startedAt: Number((r.timer as TimerState).startedAt) || 0,
          accumulated: Number((r.timer as TimerState).accumulated) || 0,
        }
      : base.timer;

  const tier: TierId = r.tier === 'tier1' || r.tier === 'tier2' || r.tier === 'tier3' ? r.tier : base.tier;

  const settings: Settings = r.settings && typeof r.settings === 'object' ? { ...defaultSettings, ...r.settings } : base.settings;

  return { tasks, timeEntries, bugs, timer, tier, settings };
}

/** Build a TimeEntry from the current timer and commit leftovers. Returns null if nothing to commit. */
function commitSession(s: AppState, now: number): { state: AppState; entry: TimeEntry | null } {
  if (!s.timer.taskId) return { state: s, entry: null };
  const task = s.tasks.find((t) => t.id === s.timer.taskId);
  const elapsed =
    s.timer.accumulated + (s.timer.running ? Math.max(0, Math.floor((now - s.timer.startedAt) / 1000)) : 0);
  const idle: TimerState = { taskId: null, running: false, startedAt: 0, accumulated: 0 };
  if (elapsed <= 0) return { state: { ...s, timer: idle }, entry: null };

  const entry: TimeEntry = {
    id: uid(),
    taskId: task?.id ?? s.timer.taskId,
    taskTitle: task?.title ?? 'Untracked session',
    clientName: task?.clientName ?? 'Unassigned',
    seconds: elapsed,
    date: new Date().toLocaleDateString('en-CA'),
    tier: s.tier,
  };
  return { state: { ...s, timer: idle, timeEntries: [...s.timeEntries, entry] }, entry };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = usePersistentState<AppState>(STORAGE_KEY, makeInitialState);
  const state = useMemo(() => normalize(raw), [raw]);

  const commit = useCallback(
    (updater: (prev: AppState) => AppState) => setRaw((prev) => updater(normalize(prev))),
    [setRaw],
  );

  const activeTask = useMemo(
    () => (state.timer.taskId ? state.tasks.find((t) => t.id === state.timer.taskId) ?? null : null),
    [state.timer.taskId, state.tasks],
  );

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const now = Date.now();
      const task: Task = {
        id: uid(),
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        category: input.category,
        priority: input.priority,
        estimatedMinutes: input.estimatedMinutes,
        assignee: input.assignee.trim() || 'Unassigned',
        clientName: input.clientName.trim() || 'Unassigned',
        status: 'todo',
        subtasks: input.subtaskTitles.filter((t) => t.trim()).map((t) => ({ id: uid(), title: t.trim(), done: false })),
        createdAt: now,
        updatedAt: now,
      };
      commit((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    },
    [commit],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      commit((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...patch, subtasks: patch.subtasks ?? t.subtasks, updatedAt: Date.now() } : t)),
      }));
    },
    [commit],
  );

  const deleteTask = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
        timer:
          prev.timer.taskId === id
            ? { taskId: null, running: false, startedAt: 0, accumulated: 0 }
            : prev.timer,
      }));
    },
    [commit],
  );

  const moveTask = useCallback(
    (id: string, status: TaskStatus) => {
      commit((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status, updatedAt: Date.now() } : t)),
      }));
    },
    [commit],
  );

  const addSubtask = useCallback(
    (taskId: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      commit((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: uid(), title: trimmed, done: false }] } : t,
        ),
      }));
    },
    [commit],
  );

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      commit((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)) }
            : t,
        ),
      }));
    },
    [commit],
  );

  const removeSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      commit((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) } : t,
        ),
      }));
    },
    [commit],
  );

  /** Starting a timer commits any in-flight session first (drytis hand-off behavior). */
  const startTimer = useCallback(
    (taskId: string | null) => {
      setRaw((prev) => {
        const cur = normalize(prev);
        if (cur.timer.taskId === taskId) {
          if (cur.timer.running) return cur;
          return { ...cur, timer: { ...cur.timer, running: true, startedAt: Date.now() } };
        }
        const { state: committed } = commitSession(cur, Date.now());
        if (!taskId) return committed;
        return {
          ...committed,
          timer: { taskId, running: true, startedAt: Date.now(), accumulated: 0 },
        };
      });
    },
    [setRaw],
  );

  const pauseTimer = useCallback(() => {
    setRaw((prev) => {
      const cur = normalize(prev);
      if (!cur.timer.running) return cur;
      const now = Date.now();
      const additional = now - cur.timer.startedAt;
      return {
        ...cur,
        timer: {
          ...cur.timer,
          running: false,
          accumulated: cur.timer.accumulated + Math.max(0, Math.floor(additional / 1000)),
          startedAt: 0,
        },
      };
    });
  }, [setRaw]);

  const resumeTimer = useCallback(() => {
    setRaw((prev) => {
      const cur = normalize(prev);
      if (!cur.timer.taskId || cur.timer.running) return cur;
      return { ...cur, timer: { ...cur.timer, running: true, startedAt: Date.now() } };
    });
  }, [setRaw]);

  const completeTimer = useCallback(() => {
    setRaw((prev) => commitSession(normalize(prev), Date.now()).state);
  }, [setRaw]);

  const discardTimer = useCallback(() => {
    setRaw((prev) => ({
      ...normalize(prev),
      timer: { taskId: null, running: false, startedAt: 0, accumulated: 0 },
    }));
  }, [setRaw]);

  const sessionSeconds = useCallback(
    (n: number) => {
      const t = state.timer;
      if (!t.taskId) return 0;
      return t.accumulated + (t.running ? Math.max(0, Math.floor((n - t.startedAt) / 1000)) : 0);
    },
    [state.timer],
  );

  const setTier = useCallback(
    (tier: TierId) => commit((prev) => ({ ...prev, tier })),
    [commit],
  );

  const addBug = useCallback(
    (input: NewBugInput) => {
      const bug: BugReport = {
        id: uid(),
        title: input.title.trim(),
        stackTrace: input.stackTrace.trim(),
        severity: input.severity,
        flags: input.flags,
        status: 'open',
        reporter: state.settings.engineerName,
        clientName: input.clientName.trim() || 'Unassigned',
        createdAt: Date.now(),
      };
      commit((prev) => ({ ...prev, bugs: [bug, ...prev.bugs] }));
    },
    [commit, state.settings.engineerName],
  );

  const setBugStatus = useCallback(
    (id: string, status: BugStatus) => {
      commit((prev) => ({
        ...prev,
        bugs: prev.bugs.map((b) => (b.id === id ? { ...b, status } : b)),
      }));
    },
    [commit],
  );

  const updateBug = useCallback(
    (id: string, patch: Partial<BugReport>) => {
      commit((prev) => ({
        ...prev,
        bugs: prev.bugs.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      }));
    },
    [commit],
  );

  const deleteBug = useCallback(
    (id: string) => commit((prev) => ({ ...prev, bugs: prev.bugs.filter((b) => b.id !== id) })),
    [commit],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => commit((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
    [commit],
  );

  const resetAll = useCallback(() => setRaw(makeInitialState()), [setRaw]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      activeTask,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addSubtask,
      toggleSubtask,
      removeSubtask,
      startTimer,
      pauseTimer,
      resumeTimer,
      completeTimer,
      discardTimer,
      sessionSeconds,
      setTier,
      addBug,
      setBugStatus,
      updateBug,
      deleteBug,
      updateSettings,
      resetAll,
    }),
    [
      state,
      activeTask,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addSubtask,
      toggleSubtask,
      removeSubtask,
      startTimer,
      pauseTimer,
      resumeTimer,
      completeTimer,
      discardTimer,
      sessionSeconds,
      setTier,
      addBug,
      setBugStatus,
      updateBug,
      deleteBug,
      updateSettings,
      resetAll,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}