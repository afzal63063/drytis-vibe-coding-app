import { useMemo, useState } from 'react';
import { Bug, Check, Copy, FileCode2, Play, RefreshCw, ShieldCheck, Sparkles, TestTube2 } from 'lucide-react';
import {
  MODELS,
  PROMPT_TEMPLATES,
  buildAiOutput,
  type PromptTemplate,
} from '../../data/promptTemplates';
import { useTypewriter } from '../../hooks/useTypewriter';
import { Button, Card, Field, Select, TextArea } from '../ui';
import { useApp } from '../../context/AppContext';

const TEMPLATE_ICON = {
  bug: Bug,
  test: TestTube2,
  shield: ShieldCheck,
} as const;

const ACCENT_CHIP: Record<PromptTemplate['accent'], string> = {
  bug: 'bg-rose-500/10 text-rose-300 ring-rose-500/30',
  test: 'bg-sky-500/10 text-sky-300 ring-sky-500/30',
  shield: 'bg-mint-500/10 text-mint ring-mint-500/30',
};

export function PromptStudio() {
  const { state } = useApp();
  const [template, setTemplate] = useState(PROMPT_TEMPLATES[0]);
  const [system, setSystem] = useState(PROMPT_TEMPLATES[0].system);
  const [payload, setPayload] = useState(PROMPT_TEMPLATES[0].payload);
  const [model, setModel] = useState(MODELS[0].id);
  const [temperature, setTemperature] = useState(0.4);
  const [runNonce, setRunNonce] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const output = useMemo(
    () => (runNonce === 0 ? '' : buildAiOutput(template.id, system, payload, model)),
    [runNonce, template.id, system, payload, model],
  );

  const { display, done } = useTypewriter(output, 6, 10, runNonce);

  const run = () => {
    setIsRunning(true);
    window.setTimeout(() => {
      setRunNonce((n) => n + 1);
      window.setTimeout(() => setIsRunning(false), 80);
    }, 650);
  };

  const selectTemplate = (t: PromptTemplate) => {
    setTemplate(t);
    setSystem(t.system);
    setPayload(t.payload);
    setRunNonce(0);
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output || display);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const Icon = TEMPLATE_ICON[template.accent];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-brand-300" />
            AI Prompt Engineering Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structure production prompts, then preview the simulated Drytis AI response in real time.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-panel-2 border border-edge px-2.5 py-1.5">
            <FileCode2 size={13} className="text-brand-300" />
            eng.sessions · {state.settings.engineerName} · {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium px-1">Prompt templates</p>
          {PROMPT_TEMPLATES.map((t) => {
            const TIcon = TEMPLATE_ICON[t.accent];
            const active = template.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  active
                    ? 'border-brand-400/50 bg-brand-500/[0.06] shadow-glow'
                    : 'border-edge bg-panel hover:border-edge hover:bg-panel-2'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg ring-1 ring-inset ${ACCENT_CHIP[t.accent]}`}>
                    <TIcon size={14} />
                  </span>
                  <p className="text-[13px] font-semibold text-slate-100 leading-tight">{t.title}</p>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{t.subtitle}</p>
              </button>
            );
          })}

          <Card className="p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded-md bg-panel-2 text-slate-400 ring-1 ring-edge">
                <TestTube2 size={13} />
              </span>
              <p className="text-xs font-semibold text-slate-200">Runtime config</p>
            </div>
            <div className="space-y-3">
              <Field label="Model">
                <Select value={model} onChange={(e) => setModel(e.target.value)}>
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} · {m.vendor}
                    </option>
                  ))}
                </Select>
              </Field>
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Temperature</span>
                  <span className="mono text-brand-300">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-[#8B7CF6]"
                />
              </div>
            </div>
          </Card>

          <Button variant="primary" size="lg" className="w-full" icon={isRunning ? RefreshCw : Play} onClick={run} disabled={isRunning}>
            {isRunning ? 'Compiling prompt…' : 'Run prompt'}
          </Button>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card>
              <div className="px-4 pt-4 pb-3 border-b border-edge/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/20">
                    <Sparkles size={14} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100">System Instructions</h3>
                </div>
                <span className="text-[10px] text-slate-600 mono">system</span>
              </div>
              <div className="p-3">
                <TextArea
                  rows={9}
                  value={system}
                  onChange={(e) => setSystem(e.target.value)}
                  placeholder="Describe role, constraints, output format…"
                  className="bg-base-2 border-edge/80 focus:bg-panel"
                />
              </div>
            </Card>

            <Card>
              <div className="px-4 pt-4 pb-3 border-b border-edge/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20">
                    <FileCode2 size={14} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-100">Code / Error Payload</h3>
                </div>
                <span className="text-[10px] text-slate-600 mono">context</span>
              </div>
              <div className="p-3">
                <TextArea
                  rows={9}
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Paste stack trace, failing test, endpoint snippet…"
                  className="bg-base-2 border-edge/80 focus:bg-panel"
                />
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-edge/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 relative pl-9">
                <span className="absolute left-2 flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-mint-500/70" />
                </span>
                <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Icon size={15} className="text-brand-300" />
                  Drytis AI Response
                </span>
                {isRunning && <RefreshCw size={13} className="text-brand-300 animate-spin" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 mono hidden sm:inline">
                  {output ? `${Math.round((output.length / 4) / 100) / 10}k tokens` : '—'}
                </span>
                <Button size="sm" variant="outline" icon={copied ? Check : Copy} onClick={copyOutput} disabled={!output}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            <div className="p-4 bg-base-2/70 min-h-[220px] max-h-[460px] overflow-y-auto">
              {runNonce === 0 ? (
                <p className="text-xs text-slate-600 leading-relaxed">
                  No output yet. Configure the {template.title} template, then press{' '}
                  <span className="text-brand-300 font-medium">Run prompt</span> to simulate the AI working session.
                </p>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-300">
                  {display}
                  {!done && <span className="inline-block w-2 h-4 bg-brand-300 animate-pulse-soft align-text-bottom ml-0.5" />}
                </pre>
              )}
              {done && output && (
                <p className="mt-3 text-[10px] text-mint-600 flex items-center gap-1.5">
                  <Check size={11} /> Response complete · session logged to prompt history
                </p>
              )}
              {output === '' && runNonce > 0 && <p className="text-xs text-slate-600">Empty response — check inputs.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}