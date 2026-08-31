import {
  LayoutTemplate,
  Palette,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { SectionId } from '../types'
import { useSurvey } from '../context/SurveyContext'

interface SidebarProps {
  activeSection: SectionId
  onSectionChange: (section: SectionId) => void
}

interface NavItemDef {
  id: SectionId
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'content', label: 'Content', icon: LayoutTemplate },
  { id: 'styling', label: 'Styling', icon: Palette },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { resetSurvey } = useSurvey()

  return (
    <aside className="flex w-16 flex-col items-center border-r border-gray-200 bg-white py-4 md:w-64 md:items-start md:px-4">
      <div className="mb-8 flex w-full items-center justify-center gap-2 px-2 md:justify-start">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
          <ShieldCheck size={20} />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-bold leading-tight text-gray-900">
            Survey Studio
          </p>
          <p className="text-[11px] text-gray-400">Campaign Builder</p>
        </div>
      </div>

      <nav className="flex w-full flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors md:px-3 ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto w-full">
        <button
          type="button"
          onClick={resetSurvey}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 md:justify-start md:px-3"
        >
          <RotateCcw size={18} className="shrink-0" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </aside>
  )
}
