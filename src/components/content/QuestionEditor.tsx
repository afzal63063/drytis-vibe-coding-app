import { MessageSquare, Trash2 } from 'lucide-react'
import type { Question } from '../../types'
import { useSurvey } from '../../context/SurveyContext'
import { Field, TextArea } from '../common/inputs'
import { Toggle } from '../common/controls'
import { OptionEditor } from './OptionEditor'

interface QuestionEditorProps {
  question: Question
  index: number
}

export function QuestionEditor({ question, index }: QuestionEditorProps) {
  const { updateQuestion, updateAdditionalComments, removeQuestion } = useSurvey()

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] text-white">
            {index + 1}
          </span>
          Question {index + 1}
        </span>
        <button
          type="button"
          onClick={() => removeQuestion(question.id)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="Delete question"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="space-y-4 p-4">
        <Field
          label="Question Title"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          placeholder="Enter your question"
        />
        <TextArea
          label="Question Description"
          value={question.description}
          onChange={(e) =>
            updateQuestion(question.id, { description: e.target.value })
          }
          rows={2}
          placeholder="Add an optional description"
        />

        <OptionEditor question={question} />

        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Additional Comments
            </span>
          </div>
          <Toggle
            checked={question.hasAdditionalComments}
            onChange={(enabled) =>
              updateAdditionalComments(question.id, enabled)
            }
          />
        </div>
      </div>
    </div>
  )
}
