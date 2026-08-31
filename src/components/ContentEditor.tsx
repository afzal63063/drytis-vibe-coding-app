import { useState } from 'react'
import { BookOpen, GitBranch, HeartHandshake, ListChecks, Plus } from 'lucide-react'
import type { ContentTab } from '../types'
import { useSurvey } from '../context/SurveyContext'
import { IntroductionEditor } from './content/IntroductionEditor'
import { QuestionEditor } from './content/QuestionEditor'
import { LogicEditor } from './content/LogicEditor'
import { ThankYouEditor } from './content/ThankYouEditor'

const TABS: { id: ContentTab; label: string; icon: typeof ListChecks }[] = [
  { id: 'introduction', label: 'Introduction', icon: BookOpen },
  { id: 'questions', label: 'Questions', icon: ListChecks },
  { id: 'logic', label: 'Logic', icon: GitBranch },
  { id: 'thankyou', label: 'Thank You', icon: HeartHandshake },
]

export function ContentEditor() {
  const [tab, setTab] = useState<ContentTab>('introduction')
  const { survey, addQuestion } = useSurvey()

  const renderTab = () => {
    switch (tab) {
      case 'introduction':
        return <IntroductionEditor />
      case 'questions':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {survey.questions.length} question
                {survey.questions.length !== 1 ? 's' : ''} ·{' '}
                {survey.questions.reduce((acc, q) => acc + q.options.length, 0)}{' '}
                total options
              </p>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
              >
                <Plus size={14} />
                Add Question
              </button>
            </div>
            {survey.questions.map((q, i) => (
              <QuestionEditor key={q.id} question={q} index={i} />
            ))}
            {survey.questions.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
                No questions yet. Click "Add Question" to get started.
              </div>
            )}
          </div>
        )
      case 'logic':
        return <LogicEditor />
      case 'thankyou':
        return <ThankYouEditor />
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 shadow-panel">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex min-w-max flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>
      {renderTab()}
    </div>
  )
}
