export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8).toUpperCase()
  );
}

export function formatDuration(totalSeconds: number): string {
  return durationFormat(totalSeconds);
}

/** "8h 24m 05s" or "46m 05s" style elapsed display. */
export function durationFormat(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  if (h > 0) return `${h}h ${mm}m ${ss}s`;
  if (m > 0) return `${mm}m ${ss}s`;
  return `${String(sec).padStart(2, '0')}s`;
}

/** "3.42 hrs" for billing math. */
export function formatHours(totalSeconds: number): string {
  return `${(Math.max(0, totalSeconds) / 3600).toFixed(2)} hrs`;
}

export function formatMinutes(totalMinutes: number): string {
  const m = Math.round(totalMinutes);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest > 0 ? `${h}h ${rest}m` : `${h}h`;
}

export function localDateKey(input: number | Date = Date.now()): string {
  const d = input instanceof Date ? input : new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function humanDate(input: number | string): string {
  const d = typeof input === 'string' ? new Date(input + 'T00:00:00') : new Date(input);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function weekdayShort(input: number | string): string {
  const d = typeof input === 'string' ? new Date(input + 'T00:00:00') : new Date(input);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

/** Last n days as local date keys, oldest first. */
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(localDateKey(d));
  }
  return out;
}