import { Plus, Trash2 } from 'lucide-react'
import type { Question } from '../../types'
import { useSurvey } from '../../context/SurveyContext'
import { Field } from '../common/inputs'

interface OptionEditorProps {
  question: Question
}

export function OptionEditor({ question }: OptionEditorProps) {
  const { addOption, removeOption, updateOption } = useSurvey()

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Options ({question.options.length})
      </p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500">
              {index + 1}
            </span>
            <Field
              aria-label={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) =>
                updateOption(question.id, option.id, e.target.value)
              }
              placeholder={`Option ${index + 1}`}
              className="py-2"
            />
            <button
              type="button"
              onClick={() => removeOption(question.id, option.id)}
              disabled={question.options.length <= 2}
              className="shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              aria-label="Delete option"
              title={
                question.options.length <= 2
                  ? 'A question needs at least 2 options'
                  : 'Delete option'
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addOption(question.id)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand-300 px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50"
      >
        <Plus size={14} />
        Add option
      </button>
    </div>
  )
}
