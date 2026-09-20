import { useState, type FormEvent } from 'react';
import { Bug, ChevronDown, Flag, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { BUG_FLAGS, type BugReport, type BugStatus, type Severity } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge, Button, Card, EmptyState, Field, Select, TextArea, TextInput, IconButton } from '../ui';
import { BUG_STATUS_META, SEVERITY_META } from '../../utils/meta';
import { timeAgo } from '../../utils/time';

const SEVERITIES: Severity[] = ['P1', 'P2', 'P3', 'P4'];
const STATUS_FILTERS: Array<{ id: BugStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'investigating', label: 'Investigating' },
  { id: 'escalated', label: 'Escalated' },
  { id: 'resolved', label: 'Resolved' },
];

export function BugPortal() {
  const { state, addBug, setBugStatus, deleteBug, updateBug } = useApp();

  const [title, setTitle] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [severity, setSeverity] = useState<Severity>('P2');
  const [clientName, setClientName] = useState('');
  const [flags, setFlags] = useState<string[]>([]);
  const [filter, setFilter] = useState<BugStatus | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});

  const toggleFlag = (key: string) =>
    setFlags((f) => (f.includes(key) ? f.filter((x) => x !== key) : [...f, key]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !stackTrace.trim()) return;
    addBug({ title, stackTrace, severity, flags, clientName });
    setTitle('');
    setStackTrace('');
    setClientName('');
    setFlags([]);
    setSeverity('P2');
  };

  const visible = filter === 'all' ? state.bugs : state.bugs.filter((b) => b.status === filter);
  const openCount = state.bugs.filter((b) => b.status === 'open').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bug size={18} className="text-brand-300" />
            Bug Reporting &amp; Escalation Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="text-rose-300 font-medium">{openCount} open</span> ·{' '}
            {state.bugs.filter((b) => b.status === 'escalated').length} escalated · logs feed the integrity review queue.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-amber-300">
            <Flag size={13} />
            {state.bugs.filter((b) => b.flags.includes('tabSwitch') || b.flags.includes('integrity')).length} integrity flags
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-4 items-start">
        <Card>
          <div className="px-4 pt-4 pb-3 border-b border-edge/70 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20">
              <Plus size={14} />
            </span>
            <h3 className="text-sm font-semibold text-slate-100">Submit Technical Bug</h3>
          </div>
          <form onSubmit={submit} className="p-4 space-y-3.5">
            <Field label="Bug title">
              <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Webhook worker deadlocks on retry storm" />
            </Field>
            <Field label="Stack trace / logs" hint="Raw output helps the Drytis AI attach a repro plan.">
              <TextArea rows={5} value={stackTrace} onChange={(e) => setStackTrace(e.target.value)} placeholder="Paste error stack, API response, or console logs…" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Severity">
                <div className="grid grid-cols-4 gap-1 rounded-lg bg-panel-2 border border-edge p-1">
                  {SEVERITIES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={`py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        severity === s ? SEVERITY_META[s].badge : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Client / project">
                <TextInput value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Acme SaaS" />
              </Field>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-400 mb-1.5">Tab-switch / integrity flags</span>
              <div className="space-y-1.5">
                {BUG_FLAGS.map((f) => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={flags.includes(f.key)}
                      onChange={() => toggleFlag(f.key)}
                      className="accent-[#8B7CF6]"
                    />
                    <span className={`text-xs ${f.warning ? 'text-amber-300' : 'text-slate-400'}`}>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit" variant="danger" icon={Bug} className="w-full" disabled={!title.trim() || !stackTrace.trim()}>
              Log &amp; dispatch bug
            </Button>
            <p className="text-[10px] text-slate-600 text-center">
              Ticket opens as <span className="text-rose-300">Open</span> and pings the escalation queue.
            </p>
          </form>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f.id ? 'bg-brand-500/15 text-white ring-1 ring-brand-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-panel-2'
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-slate-600">{visible.length} tickets</span>
          </div>

          {visible.length === 0 ? (
            <Card>
              <EmptyState icon={ShieldAlert} title="Queue is clear" hint="No tickets match this filter." />
            </Card>
          ) : (
            visible.map((b) => (
              <BugRow
                key={b.id}
                bug={b}
                expanded={expanded === b.id}
                onToggle={() => setExpanded((x) => (x === b.id ? null : b.id))}
                onStatus={(s) => setBugStatus(b.id, s)}
                onDelete={() => {
                  if (window.confirm(`Delete ticket "${b.title}"?`)) deleteBug(b.id);
                }}
                note={note[b.id] ?? ''}
                onNote={(v) => setNote((n) => ({ ...n, [b.id]: v }))}
                onSaveNote={() => note[b.id]?.trim() && updateBug(b.id, { resolutionNote: note[b.id].trim() })}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BugRow({
  bug,
  expanded,
  onToggle,
  onStatus,
  onDelete,
  note,
  onNote,
  onSaveNote,
}: {
  bug: BugReport;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (s: BugStatus) => void;
  onDelete: () => void;
  note: string;
  onNote: (v: string) => void;
  onSaveNote: () => void;
}) {
  const sev = SEVERITY_META[bug.severity];
  const status = BUG_STATUS_META[bug.status];

  return (
    <Card className="animate-fade-in">
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <Badge className={`${sev.badge} shrink-0 mt-0.5`}>{sev.label}</Badge>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-[13px] font-medium ${bug.status === 'resolved' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                {bug.title}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
              <span>{bug.reporter}</span>
              <span className="mono text-slate-600">{bug.clientName}</span>
              <span>{timeAgo(bug.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <IconButton icon={Trash2} label="Delete ticket" tone="danger" onClick={onDelete} />
            <button className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-panel-2" onClick={onToggle} aria-label="Expand">
              <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {bug.flags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {bug.flags.map((f) => {
              const meta = BUG_FLAGS.find((x) => x.key === f);
              if (!meta) return null;
              return (
                <Badge key={f} className={meta.warning ? 'bg-amber-500/10 text-amber-300 ring-amber-500/30' : 'bg-brand-500/10 text-brand-300 ring-brand-500/30'}>
                  <Flag size={10} /> {meta.label}
                </Badge>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-edge/60">
          <span className="text-[11px] text-slate-500 shrink-0">Status</span>
          <Select value={bug.status} onChange={(e) => onStatus(e.target.value as BugStatus)} className="py-1.5 text-xs max-w-[190px]">
            {(Object.keys(BUG_STATUS_META) as BugStatus[]).map((s) => (
              <option key={s} value={s}>
                {BUG_STATUS_META[s].label}
              </option>
            ))}
          </Select>
          <Badge className={`${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </Badge>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 animate-fade-in">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1.5">Stack trace</p>
              <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed bg-base-2 border border-edge rounded-lg p-3 text-slate-400 max-h-52 overflow-y-auto">
                {bug.stackTrace}
              </pre>
            </div>
            {bug.resolutionNote && (
              <div className="rounded-lg bg-mint-500/5 border border-mint-500/25 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-mint-600 font-semibold mb-1">Resolution note</p>
                <p className="text-xs text-slate-300">{bug.resolutionNote}</p>
              </div>
            )}
            <div className="flex gap-2">
              <TextInput
                value={note}
                onChange={(e) => onNote(e.target.value)}
                placeholder="Add resolution note…"
                className="text-xs"
                disabled={bug.status === 'resolved'}
              />
              <Button size="sm" variant="secondary" onClick={onSaveNote} disabled={!note.trim()}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}