import type { BugStatus, Priority, Severity, TaskStatus } from '../types';

export interface ToneMeta {
  label: string;
  /** text color classes */
  text: string;
  /** badge background + ring */
  badge: string;
  dot: string;
  /** subtle row tint */
  glow: string;
}

export const PRIORITY_META: Record<Priority, ToneMeta> = {
  low: {
    label: 'Low',
    text: 'text-slate-300',
    badge: 'bg-slate-500/10 text-slate-300 ring-slate-500/30',
    dot: 'bg-slate-400',
    glow: '',
  },
  medium: {
    label: 'Medium',
    text: 'text-amber-300',
    badge: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    dot: 'bg-amber-400',
    glow: 'shadow-[0_0_18px_-4px_rgba(245,158,11,0.45)]',
  },
  high: {
    label: 'High',
    text: 'text-orange-300',
    badge: 'bg-orange-500/10 text-orange-300 ring-orange-500/30',
    dot: 'bg-orange-400',
    glow: 'shadow-[0_0_18px_-4px_rgba(249,115,22,0.5)]',
  },
  critical: {
    label: 'Critical',
    text: 'text-rose-300',
    badge: 'bg-rose-500/10 text-rose-300 ring-rose-500/40',
    dot: 'bg-rose-400',
    glow: 'shadow-[0_0_20px_-4px_rgba(244,63,94,0.55)]',
  },
};

export const SEVERITY_META: Record<Severity, ToneMeta> = {
  P1: {
    label: 'P1 · Critical',
    text: 'text-rose-300',
    badge: 'bg-rose-500/10 text-rose-300 ring-rose-500/40',
    dot: 'bg-rose-400',
    glow: 'shadow-[0_0_18px_-4px_rgba(244,63,94,0.5)]',
  },
  P2: {
    label: 'P2 · High',
    text: 'text-orange-300',
    badge: 'bg-orange-500/10 text-orange-300 ring-orange-500/30',
    dot: 'bg-orange-400',
    glow: '',
  },
  P3: {
    label: 'P3 · Medium',
    text: 'text-amber-300',
    badge: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    dot: 'bg-amber-400',
    glow: '',
  },
  P4: {
    label: 'P4 · Low',
    text: 'text-slate-300',
    badge: 'bg-slate-500/10 text-slate-300 ring-slate-500/30',
    dot: 'bg-slate-400',
    glow: '',
  },
};

export const TASK_STATUS_META: Record<TaskStatus, { label: string; chip: string; bar: string; accent: string }> = {
  todo: { label: 'Todo', chip: 'bg-slate-500/10 text-slate-300 ring-slate-500/30', bar: 'bg-slate-500', accent: 'text-slate-300' },
  inProgress: { label: 'In Progress', chip: 'bg-sky-500/10 text-sky-300 ring-sky-500/30', bar: 'bg-sky-400', accent: 'text-sky-300' },
  review: { label: 'Review', chip: 'bg-brand-500/10 text-brand-300 ring-brand-500/30', bar: 'bg-brand-400', accent: 'text-brand-300' },
  done: { label: 'Done', chip: 'bg-mint-500/10 text-mint-600 ring-mint-500/30', bar: 'bg-mint-500', accent: 'text-mint-600' },
};

export const BUG_STATUS_META: Record<BugStatus, ToneMeta> = {
  open: {
    label: 'Open',
    text: 'text-rose-300',
    badge: 'bg-rose-500/10 text-rose-300 ring-rose-500/40',
    dot: 'bg-rose-400',
    glow: '',
  },
  investigating: {
    label: 'Investigating',
    text: 'text-sky-300',
    badge: 'bg-sky-500/10 text-sky-300 ring-sky-500/30',
    dot: 'bg-sky-400',
    glow: '',
  },
  escalated: {
    label: 'Escalated',
    text: 'text-amber-300',
    badge: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    dot: 'bg-amber-400',
    glow: '',
  },
  resolved: {
    label: 'Resolved',
    text: 'text-mint-600',
    badge: 'bg-mint-500/10 text-mint-600 ring-mint-500/30',
    dot: 'bg-mint-500',
    glow: '',
  },
};

export const RUNNER_AVATARS = ['#6C5CE7', '#0EA5E9', '#F59E0B', '#10B981', '#F43F5E', '#8B5CF6'];
export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return RUNNER_AVATARS[h % RUNNER_AVATARS.length];
}
export function initials(name: string): string {
  return name
    .split(/[\s·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}