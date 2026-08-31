import { GitBranch, Plus, Trash2 } from 'lucide-react'
import { useSurvey } from '../../context/SurveyContext'
import { EditorSection } from '../common/EditorSection'
import { Select } from '../common/inputs'

const OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'is not equal to' },
  { value: 'contains', label: 'contains' },
] as const

export function LogicEditor() {
  const { survey, addLogicRule, removeLogicRule, updateLogicRule } = useSurvey()
  const { questions, conditionalLogic } = survey

  return (
    <EditorSection
      icon={<GitBranch size={16} className="text-brand-500" />}
      title="Conditional Logic"
      action={
        <button
          type="button"
          onClick={addLogicRule}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600"
        >
          <Plus size={14} />
          Add Condition
        </button>
      }
    >
      {conditionalLogic.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">
          No conditions yet. Add a condition to redirect based on a selected
          option.
        </p>
      ) : (
        <div className="space-y-3">
          {conditionalLogic.map((rule) => {
            const optionValues = questions
              .find((q) => q.id === rule.questionId)
              ?.options.map((o) => o.text) ?? []

            return (
              <div
                key={rule.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Redirection Rule
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLogicRule(rule.id)}
                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove condition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Select
                    label="When response"
                    value={rule.questionId}
                    onChange={(e) =>
                      updateLogicRule(rule.id, { questionId: e.target.value })
                    }
                  >
                    <option value="">Select a question</option>
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title || 'Untitled question'}
                      </option>
                    ))}
                  </Select>

                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Operator"
                      value={rule.operator}
                      onChange={(e) =>
                        updateLogicRule(rule.id, {
                          operator: e.target.value as typeof rule.operator,
                        })
                      }
                    >
                      {OPERATORS.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Answer value"
                      value={rule.value}
                      onChange={(e) =>
                        updateLogicRule(rule.id, { value: e.target.value })
                      }
                    >
                      <option value="">Select option</option>
                      {optionValues.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <Select
                    label="Redirect to"
                    value={rule.redirectQuestionId ?? ''}
                    onChange={(e) =>
                      updateLogicRule(rule.id, {
                        redirectQuestionId: e.target.value || null,
                      })
                    }
                  >
                    <option value="">Thank You page</option>
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        Question: {q.title || 'Untitled'}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </EditorSection>
  )
}
