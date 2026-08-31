import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface SectionProps {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

export function EditorSection({
  title,
  icon,
  action,
  children,
  defaultOpen = true,
}: SectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-panel overflow-hidden">
      <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          {icon}
          <span>{title}</span>
        </div>
        {action}
      </header>
      {defaultOpen && <div className="p-4 space-y-4">{children}</div>}
    </section>
  )
}

interface CollapseProps {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export function Collapsible({ title, open, onToggle, children }: CollapseProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  )
}
