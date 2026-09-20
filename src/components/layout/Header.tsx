import { Menu, Pause, Timer as TimerIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNow } from '../../hooks/useNow';
import { TIERS } from '../../utils/billing';
import { formatDuration } from '../../utils/time';
import { NAV_ITEMS } from './Sidebar';
import type { ViewId } from '../../types';

export function Header({ view, onOpenMenu }: { view: ViewId; onOpenMenu: () => void }) {
  const { state, sessionSeconds } = useApp();
  const now = useNow(state.timer.running, 1000);
  const elapsed = state.timer.running ? sessionSeconds(now) : 0;
  const activeTask = state.tasks.find((t) => t.id === state.timer.taskId) ?? null;
  const tier = TIERS[state.tier];
  const title = NAV_ITEMS.find((n) => n.id === view)?.label ?? 'Task Queue';

  return (
    <header className="h-16 shrink-0 bg-base-2/85 backdrop-blur border-b border-edge/70 flex items-center justify-between gap-4 px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-panel-2 hover:text-white border border-edge/60"
        >
          <Menu size={17} />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">Drytis Engineering Workspace · {state.settings.roleLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {state.timer.running && activeTask && (
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-brand-500/10 border border-brand-500/25 px-2.5 py-1.5 min-w-0">
            <TimerIcon size={13} className="text-brand-300 shrink-0 animate-pulse-soft" />
            <span className="text-[11px] text-slate-300 truncate max-w-[150px]">{activeTask.title}</span>
            <span className="mono text-brand-300 text-xs whitespace-nowrap">{formatDuration(elapsed)}</span>
            <Pause size={11} className="text-brand-300" />
          </div>
        )}

        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-500/10 border border-mint-500/25 px-2.5 py-1 text-[11px] font-medium text-mint-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mint-400" />
          </span>
          <span className="hidden sm:inline">Active in Workspace</span>
        </span>

        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold bg-gradient-to-r ${tier.gradient} border-brand-500/20 ${tier.accent}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
          {tier.label}
          <span className="text-slate-500 font-normal hidden sm:inline">${tier.rate.toFixed(2)}/hr</span>
        </span>
      </div>
    </header>
  );
}