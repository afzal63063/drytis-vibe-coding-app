import { useState } from 'react';
import { AlertTriangle, BadgeCheck, RotateCcw, Settings2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, CardHeader, Field, TextInput } from '../ui';
import { TIERS, TIER_ORDER } from '../../utils/billing';
import { BUG_FLAGS } from '../../types';

export function SettingsPanel() {
  const { state, updateSettings, resetAll } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings2 size={18} className="text-brand-300" />
          Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Engineer profile, billing contract, and workspace controls.</p>
      </div>

      <Card>
        <CardHeader icon={BadgeCheck} title="Engineer profile" subtitle="Shown in the workspace header and billing ledger." />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Engineer name">
            <TextInput value={state.settings.engineerName} onChange={(e) => updateSettings({ engineerName: e.target.value })} />
          </Field>
          <Field label="Role label">
            <TextInput value={state.settings.roleLabel} onChange={(e) => updateSettings({ roleLabel: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader icon={Star} title="Client satisfaction target" subtitle="Used on the metrics dashboard." />
        <div className="p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">CSAT rating</span>
            <span className="mono text-amber-300 font-semibold">{state.settings.csat.toFixed(1)} / 5.0</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={state.settings.csat}
            onChange={(e) => updateSettings({ csat: Number(e.target.value) })}
            className="w-full accent-[#8B7CF6]"
          />
        </div>
      </Card>

      <Card>
        <CardHeader icon={RotateCcw} title="Tier upgrade cycle" subtitle={`Hours billed toward ${TIERS[state.tier].label} → next tier.`} />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <Field label="Hours per tier cycle" hint="Progress bar target on the analytics dashboard.">
            <TextInput
              type="number"
              min={1}
              value={state.settings.nextTierHours}
              onChange={(e) => updateSettings({ nextTierHours: Math.max(1, Number(e.target.value) || 0) })}
            />
          </Field>
          <div className="rounded-lg bg-panel-2 border border-edge p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">Billable contract</p>
            <div className="space-y-1.5">
              {TIER_ORDER.map((id) => {
                const t = TIERS[id];
                return (
                  <div key={id} className="flex justify-between text-xs">
                    <span className="text-slate-400">{t.label} · {t.name}</span>
                    <span className={`mono font-semibold ${state.tier === id ? t.accent : 'text-slate-500'}`}>${t.rate.toFixed(2)}/hr</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader icon={AlertTriangle} title="Integrity flag catalogue" subtitle="Tagged on submitted bug tickets." />
        <div className="p-4 space-y-2">
          {BUG_FLAGS.map((f) => (
            <div key={f.key} className="flex items-center gap-2 text-xs text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${f.warning ? 'bg-amber-400' : 'bg-brand-400'}`} />
              {f.label}
              <span className="text-slate-600">({f.key})</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-rose-500/20">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-rose-300 flex items-center gap-2">
              <AlertTriangle size={15} /> Danger zone
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Restore seeded demo data. All local tasks, timer history, and tickets are wiped.</p>
          </div>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sure?</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
              >
                Erase &amp; reseed
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="danger" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
              Reset workspace
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}