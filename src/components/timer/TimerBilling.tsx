import { useEffect, useState, type ReactNode } from 'react';
import {
  CheckCircle2,
  Clock3,
  Coins,
  Pause,
  Play,
  RotateCcw,
  Timer as TimerIcon,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNow } from '../../hooks/useNow';
import { Button, Card, IconButton, Select } from '../ui';
import { formatDuration, formatHours, lastNDays, localDateKey } from '../../utils/time';
import { TIERS, TIER_ORDER, tierLabel, tierRate, formatMoney } from '../../utils/billing';
import { PRIORITY_META } from '../../utils/meta';

/**
 * Module B — Live Timer & Tier Billing Tracker.
 * Real-time stopwatch plus an accrual calculator that re-prices the session
 * instantly when switching between Drytis tiers.
 */
export function TimerBilling() {
  const { state, startTimer, pauseTimer, resumeTimer, completeTimer, discardTimer, sessionSeconds, setTier } = useApp();
  const now = useNow(state.timer.running, 1000);
  const elapsed = sessionSeconds(now);
  const selectable = state.tasks.filter((t) => t.status !== 'done');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!state.timer.taskId) setShowConfirm(false);
  }, [state.timer.taskId]);

  const running = state.timer.running;
  const started = Boolean(state.timer.taskId);
  const activeTask = state.tasks.find((t) => t.id === state.timer.taskId) ?? null;
  const activeMeta = activeTask ? PRIORITY_META[activeTask.priority] : null;

  const todayKey = localDateKey();
  const todaySeconds =
    state.timeEntries.filter((e) => e.date === todayKey).reduce((acc, e) => acc + e.seconds, 0) + elapsed;
  const rate = tierRate(state.tier);
  const sessionEarn = (elapsed / 3600) * rate;
  const todayEarn = (todaySeconds / 3600) * rate;

  const weekKeys = lastNDays(7);
  const weekSeconds = state.timeEntries
    .filter((e) => weekKeys.includes(e.date))
    .reduce((acc, e) => acc + e.seconds, 0);
  const weekEarn = (weekSeconds / 3600) * rate;
  const maxDay = Math.max(
    1,
    ...weekKeys.map((k) => state.timeEntries.filter((e) => e.date === k).reduce((a, e) => a + e.seconds, 0)),
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TimerIcon size={18} className="text-brand-300" />
          Live Timer &amp; Tier Billing
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Track billable coding time, switch tiers to re-price the session in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-edge/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/20">
                <TimerIcon size={15} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Coding Session</h3>
                <p className="text-xs text-slate-500">Play · Pause · Resume · Complete</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2 py-0.5 ring-1 ring-inset ${
                running
                  ? 'bg-mint-500/10 text-mint-600 ring-mint-500/30'
                  : started
                    ? 'bg-amber-500/10 text-amber-300 ring-amber-500/30'
                    : 'bg-slate-500/10 text-slate-400 ring-slate-500/25'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-mint-400 animate-pulse-soft' : started ? 'bg-amber-400' : 'bg-slate-500'}`} />
              {running ? 'Tracking' : started ? 'Paused' : 'Idle'}
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-1">Task selection</p>
                <Select
                  value={state.timer.taskId ?? ''}
                  onChange={(e) => startTimer(e.target.value || null)}
                  className="max-w-full"
                  aria-label="Select task to track"
                >
                  <option value="">— No active task —</option>
                  {selectable.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title.slice(0, 60)}
                    </option>
                  ))}
                </Select>
              </div>
              {activeMeta && activeTask && (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2 py-1 ring-1 ring-inset ${activeMeta.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${activeMeta.dot}`} />
                  {activeMeta.label}
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center my-5">
              <div className="text-center">
                <p className="mono text-5xl font-semibold text-white tabular-nums tracking-tight text-glow">
                  {formatDuration(elapsed)}
                </p>
                <p className="mt-2 text-xs text-slate-500 max-w-[320px] truncate mx-auto">
                  {started ? (activeTask?.title ?? 'Untracked session') : 'Pick a task to start the billing clock'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              {!started ? (
                <Button
                  variant="mint"
                  size="lg"
                  icon={Play}
                  disabled={selectable.length === 0}
                  onClick={() => startTimer(state.timer.taskId ?? selectable[0]?.id ?? null)}
                >
                  Start Session
                </Button>
              ) : running ? (
                <>
                  <Button variant="secondary" icon={Pause} onClick={pauseTimer}>
                    Pause
                  </Button>
                  <Button variant="mint" icon={CheckCircle2} onClick={() => setShowConfirm(true)}>
                    Complete
                  </Button>
                  <IconButton icon={RotateCcw} label="Discard session" tone="danger" onClick={discardTimer} />
                </>
              ) : (
                <>
                  <Button variant="mint" icon={Play} onClick={resumeTimer}>
                    Resume
                  </Button>
                  <Button variant="secondary" icon={CheckCircle2} onClick={() => setShowConfirm(true)}>
                    Complete
                  </Button>
                  <IconButton icon={RotateCcw} label="Discard session" tone="danger" onClick={discardTimer} />
                </>
              )}
            </div>

            {showConfirm && (
              <div className="mt-4 rounded-lg border border-mint-500/30 bg-mint-500/5 p-3 animate-fade-in">
                <p className="text-xs text-slate-300 mb-2.5">
                  Commit <span className="mono text-mint-600 font-semibold">{formatDuration(elapsed)}</span> to the billing
                  ledger?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="mint" icon={CheckCircle2} onClick={completeTimer}>
                    Commit &amp; clear
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </Button>
                  <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock3 size={12} /> auto-logged to ledger
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <div className="px-4 pt-4 pb-3 border-b border-edge/70 flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-mint-500/10 text-mint ring-1 ring-mint-500/20">
                <Wallet size={15} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Live Earnings</h3>
                <p className="text-xs text-slate-500">Re-calculated instantly per tier</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden border border-edge bg-edge/60 mb-4">
                {TIER_ORDER.map((id) => {
                  const t = TIERS[id];
                  const active = state.tier === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setTier(id)}
                      className={`py-2.5 px-2 text-center transition-all ${active ? t.gradient : 'bg-panel hover:bg-panel-2'}`}
                    >
                      <p className={`text-[11px] font-semibold ${active ? t.accent : 'text-slate-400'}`}>{t.label}</p>
                      <p className="mono text-[11px] text-slate-400 mt-0.5">
                        ${t.rate.toFixed(2)}
                        <span className="text-slate-600">/hr</span>
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                <EarnRow label="This session" value={sessionEarn} hours={elapsed} accent="text-white" icon={<Coins size={14} className="text-brand-300" />} />
                <EarnRow label={`Today (${todayKey.slice(5)})`} value={todayEarn} hours={todaySeconds} accent="text-mint-600" icon={<TrendingUp size={14} className="text-mint-600" />} />
                <EarnRow label="Last 7 days" value={weekEarn} hours={weekSeconds} accent="text-brand-300" icon={<TrendingUp size={14} className="text-brand-300" />} />
              </div>
            </div>
          </Card>

          <Card className="flex-1">
            <div className="px-4 pt-4 pb-3 border-b border-edge/70 flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20">
                <TrendingUp size={15} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">7-Day Billed Volume</h3>
                <p className="text-xs text-slate-500">At {tierLabel(state.tier)} rate</p>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-end gap-2 h-32">
                {weekKeys.map((k) => {
                  const secs = state.timeEntries.filter((e) => e.date === k).reduce((a, e) => a + e.seconds, 0);
                  const h = Math.max(4, (secs / maxDay) * 100);
                  const isToday = k === todayKey;
                  return (
                    <div key={k} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                      <div className="relative w-full bg-panel-2 rounded-md overflow-hidden" style={{ height: 128 }}>
                        {isToday && elapsed > 0 && <div className="absolute inset-x-0 top-0 h-0.5 bg-mint-400/80 animate-pulse-soft" />}
                        <div
                          className={`absolute bottom-0 w-full rounded-md transition-all duration-500 ${
                            isToday ? 'bg-gradient-to-t from-brand-600 to-brand-400' : 'bg-gradient-to-t from-panel-3 to-slate-700/70'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className={`text-[10px] ${isToday ? 'text-brand-300 font-semibold' : 'text-slate-600'}`}>
                        {k.slice(5).replace('-', '/')}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-panel-2 border border-edge px-3 py-2.5">
                <span className="text-xs text-slate-400">Projected week total</span>
                <span className="mono text-sm text-brand-300 font-semibold">{formatMoney(weekEarn)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EarnRow({
  label,
  value,
  hours,
  accent,
  icon,
}: {
  label: string;
  value: number;
  hours: number;
  accent: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-panel-2 border border-edge px-3 py-2.5">
      <span className="flex items-center gap-2 text-xs text-slate-400">
        {icon}
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-[11px] text-slate-600 mono">{formatHours(hours)}</span>
        <span className={`mono text-sm font-semibold ${accent}`}>{formatMoney(value)}</span>
      </span>
    </div>
  );
}