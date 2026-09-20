import type { LucideIcon } from 'lucide-react';
import { BarChart3, Bug, ListTodo, Settings, Sparkles, Timer as TimerIcon, X, Zap } from 'lucide-react';
import type { ViewId } from '../../types';
import { useApp } from '../../context/AppContext';
import { TIERS } from '../../utils/billing';

export const NAV_ITEMS: Array<{ id: ViewId; label: string; icon: LucideIcon; hint: string }> = [
  { id: 'tasks', label: 'Task Queue', icon: ListTodo, hint: 'Kanban workflow (Module A)' },
  { id: 'timer', label: 'Timer & Billing', icon: TimerIcon, hint: 'Live session tracker (Module B)' },
  { id: 'prompts', label: 'AI Prompt Studio', icon: Sparkles, hint: 'Vibe coding studio (Module C)' },
  { id: 'bugs', label: 'Bug Reports', icon: Bug, hint: 'Escalation portal (Module D)' },
  { id: 'performance', label: 'Performance Analytics', icon: BarChart3, hint: 'Metrics & tiers (Module E)' },
  { id: 'settings', label: 'Settings', icon: Settings, hint: 'Engineer profile' },
];

export function Sidebar({
  view,
  onNavigate,
  onClose,
}: {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
  onClose?: () => void;
}) {
  const { state } = useApp();
  const tier = TIERS[state.tier];

  return (
    <aside className="w-[248px] shrink-0 h-full bg-base-2 border-r border-edge/70 flex flex-col">
      <div className="px-4 h-16 flex items-center justify-between border-b border-edge/50">
        <button onClick={() => onNavigate('tasks')} className="flex items-center gap-2.5 group">
          <span className="p-1.5 rounded-lg bg-brand-500/15 ring-1 ring-brand-500/30 text-brand-300">
            <Zap size={17} className="group-hover:scale-110 transition-transform" />
          </span>
          <div className="leading-none">
            <p className="text-sm font-bold text-slate-100 tracking-tight">
              Drytis<span className="text-brand-400">OS</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Engineering Workflow</p>
          </div>
        </button>
        {onClose && (
          <button aria-label="Close menu" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white lg:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                active
                  ? 'bg-brand-500/12 text-white ring-1 ring-brand-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                  : 'text-slate-400 hover:bg-panel-2 hover:text-slate-200'
              }`}
            >
              <item.icon size={16} className={active ? 'text-brand-300' : 'text-slate-500'} />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-edge/50">
        <div className="rounded-xl bg-gradient-to-br from-panel-2 to-panel border border-edge p-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${tier.dot} animate-pulse-soft`} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate">{state.settings.engineerName}</p>
              <p className="text-[10px] text-slate-500">
                {tier.label} · {state.settings.roleLabel}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Billable rate</span>
            <span className="mono text-brand-300 font-semibold">${tier.rate.toFixed(2)}/hr</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Liveness</span>
            <span className="text-mint-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}