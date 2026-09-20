import { Award, BarChart3, Clock3, TrendingUp, Trophy, Users, Wallet, CheckCircle2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, ProgressBar, StatCard, Badge } from '../ui';
import { TIERS, TIER_ORDER, tierRate, formatMoney } from '../../utils/billing';
import { formatDuration, formatHours, formatMinutes, lastNDays, weekdayShort } from '../../utils/time';
import { TASK_STATUS_META } from '../../utils/meta';

/**
 * Module E — Performance Analytics.
 * Summary cards for hours/completions/CSAT/resolution plus an animated
 * progress bar tracking advancement toward the next Drytis tier.
 */
export function PerformanceAnalytics() {
  const { state } = useApp();
  const tier = TIERS[state.tier];
  const tierIdx = TIER_ORDER.indexOf(state.tier);
  const nextTier = tierIdx < TIER_ORDER.length - 1 ? TIERS[TIER_ORDER[tierIdx + 1]] : null;

  const totalSecs = state.timeEntries.reduce((a, e) => a + e.seconds, 0);
  const totalHours = totalSecs / 3600;
  const doneCount = state.tasks.filter((t) => t.status === 'done').length;
  const csat = state.settings.csat;
  const avgSecs = state.timeEntries.length ? totalSecs / state.timeEntries.length : 0;

  const targetHours = state.settings.nextTierHours;
  const progress = Math.min(100, (totalHours / targetHours) * 100);
  const hoursNeeded = Math.max(0, targetHours - totalHours);

  const weekKeys = lastNDays(7);
  const weekMax = Math.max(
    1,
    ...weekKeys.map((k) => state.timeEntries.filter((e) => e.date === k).reduce((a, e) => a + e.seconds, 0)),
  );

  const byCategory = Object.entries(
    state.tasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...byCategory.map(([, n]) => n));

  const byTier = TIER_ORDER.map((id) => ({
    id,
    label: TIERS[id].label,
    rate: tierRate(id),
    seconds: state.timeEntries.filter((e) => e.tier === id).reduce((a, e) => a + e.seconds, 0),
  }));
  const maxTierSecs = Math.max(1, ...byTier.map((t) => t.seconds));

  const byClient = Object.entries(
    state.timeEntries.reduce<Record<string, number>>((acc, e) => {
      acc[e.clientName] = (acc[e.clientName] ?? 0) + e.seconds;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-300" />
            Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Engineer productivity, satisfaction, and tier advancement.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel-2 border border-edge px-2.5 py-1.5 text-xs text-slate-400">
            <Award size={13} className="text-brand-300" />
            {tier.label} · {tier.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Clock3} label="Hours logged" value={totalHours.toFixed(1)} sub={`● ${formatHours(totalSecs)} billed`} tone="brand" />
        <StatCard icon={CheckCircle2} label="Tasks completed" value={doneCount} sub={`${state.tasks.length} total in queue`} tone="mint" />
        <StatCard icon={Star} label="Client satisfaction" value={`${csat.toFixed(1)} / 5.0`} sub="▲ 0.2 vs last sprint" tone="amber" />
        <StatCard icon={TrendingUp} label="Avg resolution" value={formatDuration(avgSecs)} sub="per billed session" tone="sky" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader
            icon={Trophy}
            title="Tier progression"
            subtitle={`${targetHours}h cycle target · upgrade at ${progress.toFixed(0)}%`}
            actions={
              nextTier && (
                <Badge className={nextTier.accent}>
                  <span className={`w-1.5 h-1.5 rounded-full ${nextTier.dot}`} />
                  Next: {nextTier.label}
                </Badge>
              )
            }
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {tier.label} · {tier.name}
                </p>
                <p className="text-[11px] text-slate-500">${tier.rate.toFixed(2)}/hr billable rate</p>
              </div>
              <div className="text-right">
                <p className="mono text-sm text-brand-300 font-semibold">
                  {totalHours.toFixed(1)} / {targetHours} hrs
                </p>
                <p className="text-[11px] text-slate-500">
                  {nextTier ? `${hoursNeeded.toFixed(1)} hrs to ${nextTier.label}` : 'Top tier reached'}
                </p>
              </div>
            </div>
            <ProgressBar value={progress} size="lg" barClass="bg-gradient-to-r from-brand-600 via-brand-400 to-mint-500" />
            {nextTier && (
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-panel-2 border border-edge py-2">
                  <p className="text-[10px] uppercase text-slate-600 font-medium">Current rate</p>
                  <p className="mono text-sm text-slate-200 font-semibold">${tier.rate.toFixed(2)}/hr</p>
                </div>
                <div className="rounded-lg bg-panel-2 border border-edge py-2">
                  <p className="text-[10px] uppercase text-slate-600 font-medium">Next rate</p>
                  <p className="mono text-sm text-mint-600 font-semibold">${nextTier.rate.toFixed(2)}/hr</p>
                </div>
                <div className="rounded-lg bg-panel-2 border border-brand-500/25 py-2">
                  <p className="text-[10px] uppercase text-slate-600 font-medium">Uplift</p>
                  <p className="mono text-sm text-brand-300 font-semibold">+${(nextTier.rate - tier.rate).toFixed(2)}/hr</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader icon={Wallet} title="Billed revenue" subtitle="Accrued per tier rate at log time" />
          <div className="p-4 space-y-2.5">
            {byTier.map((t) => (
              <div key={t.id}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">
                    {t.label} <span className="text-slate-600">@ ${t.rate.toFixed(2)}/hr</span>
                  </span>
                  <span className="mono text-slate-200 font-medium">
                    {t.seconds ? formatMoney((t.seconds / 3600) * t.rate) : '$0.00'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-panel-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${t.id === 'tier1' ? 'bg-sky-400' : t.id === 'tier2' ? 'bg-brand-400' : 'bg-mint-500'}`}
                    style={{ width: `${(t.seconds / maxTierSecs) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 mt-1 border-t border-edge/60 flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Gross billed</span>
              <span className="mono text-mint-600 font-bold">
                {formatMoney(state.timeEntries.reduce((a, e) => a + (e.seconds / 3600) * tierRate(e.tier), 0))}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader icon={TrendingUp} title="Billed hours · last 7 days" subtitle="Re-billed at current tier" />
          <div className="p-4">
            <div className="flex items-end gap-2 h-28">
              {weekKeys.map((k) => {
                const secs = state.timeEntries.filter((e) => e.date === k).reduce((a, e) => a + e.seconds, 0);
                const h = Math.max(4, (secs / weekMax) * 100);
                const isToday = k === new Date().toLocaleDateString('en-CA');
                return (
                  <div key={k} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                    <div className="relative w-full bg-panel-2 rounded-md" style={{ height: 104 }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-md ${isToday ? 'bg-brand-400' : 'bg-panel-3'}`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className={`text-[10px] ${isToday ? 'text-brand-300 font-semibold' : 'text-slate-600'}`}>&nbsp;</span>
                    <span className={`text-[10px] -mt-3 ${isToday ? 'text-brand-300 font-semibold' : 'text-slate-600'}`}>
                      {weekdayShort(k)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader icon={Users} title="Top clients by billed time" subtitle="7-day ledger" />
          <div className="p-4 space-y-2.5">
            {byClient.map(([client, secs], i) => (
              <div key={client} className="flex items-center gap-2.5">
                <span className="mono text-[11px] text-slate-600 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 truncate">{client}</span>
                    <span className="mono text-slate-500">{formatMinutes(secs / 60)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-panel-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                      style={{ width: `${(secs / byClient[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader icon={Award} title="Backlog by category" subtitle="Engine distribution" />
          <div className="p-4 space-y-2.5">
            {byCategory.map(([cat, n]) => (
              <div key={cat} className="flex items-center gap-2.5">
                <span className="text-[11px] text-slate-400 w-28 truncate shrink-0">{cat}</span>
                <div className="flex-1 h-1.5 rounded-full bg-panel-2 overflow-hidden">
                  <div className="h-full rounded-full bg-mint-500/70" style={{ width: `${(n / maxCat) * 100}%` }} />
                </div>
                <span className="mono text-[11px] text-mint-600 w-4 text-right">{n}</span>
              </div>
            ))}
            <div className="pt-2 mt-1 border-t border-edge/60">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Workflow state</span>
                <span className="mono text-slate-300">
                  {TASK_STATUS_META.todo.label} {state.tasks.filter((t) => t.status === 'todo').length} ·{' '}
                  {TASK_STATUS_META.inProgress.label} {state.tasks.filter((t) => t.status === 'inProgress').length} ·{' '}
                  {TASK_STATUS_META.review.label} {state.tasks.filter((t) => t.status === 'review').length} ·{' '}
                  {TASK_STATUS_META.done.label} {doneCount}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}