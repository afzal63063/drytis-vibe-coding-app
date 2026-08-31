import { Check, X } from 'lucide-react'

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
  description?: string
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {label && (
          <span className="block text-sm font-medium text-gray-700">{label}</span>
        )}
        {description && (
          <span className="block text-xs text-gray-400">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'toggle'}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function Chip({
  children,
  onRemove,
}: {
  children: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="text-brand-400 hover:text-brand-700"
        aria-label="remove"
      >
        <X size={12} />
      </button>
    </span>
  )
}

export function StatusBadge({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        on ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-emerald-500' : 'bg-gray-400'}`}
      />
      {on ? 'Live' : 'Off'}
    </span>
  )
}

export function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        checked ? 'bg-brand-500' : 'bg-white text-transparent'
      }`}
    >
      <Check size={12} className="text-white" />
    </span>
  )
}
