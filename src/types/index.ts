export type TaskStatus = 'todo' | 'inProgress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export const TASK_CATEGORIES = [
  'API Bug',
  'React UI',
  'Prompt Optimization',
  'Database',
  'DevOps',
  'Security',
  'Testing',
  'Documentation',
] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  estimatedMinutes: number;
  assignee: string;
  clientName: string;
  status: TaskStatus;
  subtasks: Subtask[];
  createdAt: number;
  updatedAt: number;
}

export type Severity = 'P1' | 'P2' | 'P3' | 'P4';
export type BugStatus = 'open' | 'investigating' | 'escalated' | 'resolved';

export interface BugReport {
  id: string;
  title: string;
  stackTrace: string;
  severity: Severity;
  flags: string[];
  status: BugStatus;
  reporter: string;
  clientName: string;
  createdAt: number;
  resolutionNote?: string;
}

export const BUG_FLAGS = [
  { key: 'tabSwitch', label: 'Tab-switch detected', warning: true },
  { key: 'integrity', label: 'Integrity flags raised', warning: true },
  { key: 'aiAssisted', label: 'Vibe-coded (AI assisted)', warning: false },
] as const;
export type BugFlagKey = (typeof BUG_FLAGS)[number]['key'];

export interface TimeEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  clientName: string;
  seconds: number;
  date: string; // yyyy-mm-dd (local)
  tier: TierId;
}

export type TierId = 'tier1' | 'tier2' | 'tier3';

export interface TimerState {
  taskId: string | null;
  running: boolean;
  startedAt: number; // epoch ms of last resume
  accumulated: number; // seconds accrued (excluding current run)
}

export interface Settings {
  engineerName: string;
  roleLabel: string;
  csat: number;
  nextTierHours: number;
}

export type ViewId = 'tasks' | 'timer' | 'prompts' | 'bugs' | 'performance' | 'settings';