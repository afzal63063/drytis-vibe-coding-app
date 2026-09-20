import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { avatarColor, initials } from '../utils/meta';

const btnBase =
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 disabled:opacity-45 disabled:pointer-events-none select-none';

const btnVariants: Record<string, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400 shadow-glow active:scale-[0.98]',
  secondary: 'bg-panel-2 text-slate-200 border border-edge hover:border-brand-400/40 hover:text-white active:scale-[0.98]',
  ghost: 'text-slate-400 hover:bg-panel-2 hover:text-slate-100 active:scale-[0.98]',
  danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 active:scale-[0.98]',
  mint: 'bg-mint-500 text-base-2 font-semibold hover:bg-mint-400 active:scale-[0.98] shadow-glow-mint',
  outline: 'border border-edge text-slate-300 hover:border-brand-400/40 hover:text-white active:scale-[0.98]',
};

const btnSizes: Record<string, string> = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-3.5 py-2',
  lg: 'text-sm px-5 py-2.5',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof btnVariants;
  size?: keyof typeof btnSizes;
  icon?: LucideIcon;
}

export function Button({ variant = 'secondary', size = 'md', icon: Icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
      {children}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  tone?: 'default' | 'danger' | 'brand';
}

export function IconButton({ icon: Icon, label, tone = 'default', className = '', ...rest }: IconButtonProps) {
  const toneCls =
    tone === 'danger'
      ? 'text-rose-300 hover:bg-rose-500/15 hover:text-rose-200'
      : tone === 'brand'
        ? 'text-brand-300 hover:bg-brand-500/15 hover:text-brand-200'
        : 'text-slate-400 hover:bg-panel-2 hover:text-slate-100';
  return (
    <button
      aria-label={label}
      title={label}
      className={`p-1.5 rounded-md transition-colors ${toneCls} ${className}`}
      {...rest}
    >
      <Icon size={15} />
    </button>
  );
}

export function Badge({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`card-surface shadow-panel ${className}`}>{children}</div>;
}

export interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  icon?: LucideIcon;
}

export function CardHeader({ title, subtitle, actions, icon: Icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-edge/70">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/20">
            <Icon size={15} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function ProgressBar({
  value,
  className = '',
  barClass = 'bg-brand-400',
  size = 'md',
}: {
  value: number;
  className?: string;
  barClass?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const height = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2.5' : 'h-1.5';
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${height} rounded-full bg-panel-2 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${barClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-2xl',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-base/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${width} card-surface shadow-float border-edge/80 animate-scale-in max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-edge/70">
          <div>
            <h2 className="text-base font-semibold text-slate-100">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} tone="default" />
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
        {footer && <div className="px-5 py-3.5 border-t border-edge/70 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

const inputBase =
  'w-full rounded-lg bg-panel-2 border border-edge px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 transition-shadow';

export function Field({ label, hint, children, className = '' }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-slate-400 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-600 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} font-mono text-[12.5px] leading-relaxed resize-y ${props.className ?? ''}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputBase} appearance-none pr-8 bg-no-repeat bg-[right_0.6rem_center] bg-[length:14px] ${props.className ?? ''}`} />
  );
}

export function Toggle({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 select-none"
    >
      <span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${checked ? 'bg-brand-500' : 'bg-panel-2 border border-edge'}`}>
        <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </span>
      <span className="text-xs text-slate-300">{label}</span>
    </button>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'brand',
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'brand' | 'mint' | 'sky' | 'amber' | 'rose';
}) {
  const tones: Record<string, { chip: string; text: string }> = {
    brand: { chip: 'bg-brand-500/10 text-brand-300 ring-brand-500/20', text: 'text-brand-300' },
    mint: { chip: 'bg-mint-500/10 text-mint ring-mint-500/20', text: 'text-mint' },
    sky: { chip: 'bg-sky-500/10 text-sky-300 ring-sky-500/20', text: 'text-sky-300' },
    amber: { chip: 'bg-amber-500/10 text-amber-300 ring-amber-500/20', text: 'text-amber-300' },
    rose: { chip: 'bg-rose-500/10 text-rose-300 ring-rose-500/20', text: 'text-rose-300' },
  };
  const t = tones[tone];
  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className={`p-2 rounded-lg ring-1 ring-inset ${t.chip}`}>
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-semibold text-slate-100 leading-tight">{value}</p>
          {sub && <p className={`text-[11px] ${t.text} mt-0.5 truncate`}>{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

export function Avatar({ name, size = 26, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.38 }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="p-3 rounded-xl bg-panel-2 text-slate-600 ring-1 ring-edge mb-3">
        <Icon size={22} />
      </span>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      {hint && <p className="text-xs text-slate-600 mt-1 max-w-[240px]">{hint}</p>}
    </div>
  );
}