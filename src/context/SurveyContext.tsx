import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type {
  ConditionalLogic,
  Question,
  Styling,
  Survey,
  ThankYouPage,
} from '../types'
import { createDefaultSurvey, uid } from '../data/defaultSurvey'

interface SurveyContextValue {
  survey: Survey
  updateIntroduction: (field: 'title' | 'description', value: string) => void
  addQuestion: () => void
  removeQuestion: (id: string) => void
  updateQuestion: (id: string, patch: Partial<Question>) => void
  addOption: (questionId: string) => void
  removeOption: (questionId: string, optionId: string) => void
  updateOption: (questionId: string, optionId: string, text: string) => void
  updateAdditionalComments: (questionId: string, enabled: boolean) => void
  addLogicRule: () => void
  removeLogicRule: (id: string) => void
  updateLogicRule: (id: string, patch: Partial<ConditionalLogic>) => void
  updateThankYou: (patch: Partial<ThankYouPage>) => void
  updateStyling: (patch: Partial<Styling>) => void
  updateNestedStyling: <K extends keyof Styling>(key: K, value: Styling[K]) => void
  resetSurvey: () => void
}

const SurveyContext = createContext<SurveyContextValue | null>(null)

type SurveyAction =
  | { type: 'UPDATE_INTRODUCTION'; field: 'title' | 'description'; value: string }
  | { type: 'ADD_QUESTION'; question: Question }
  | { type: 'REMOVE_QUESTION'; id: string }
  | { type: 'UPDATE_QUESTION'; id: string; patch: Partial<Question> }
  | { type: 'ADD_OPTION'; questionId: string }
  | { type: 'REMOVE_OPTION'; questionId: string; optionId: string }
  | { type: 'UPDATE_OPTION'; questionId: string; optionId: string; text: string }
  | { type: 'UPDATE_ADDITIONAL_COMMENTS'; questionId: string; enabled: boolean }
  | { type: 'ADD_LOGIC_RULE'; rule: ConditionalLogic }
  | { type: 'REMOVE_LOGIC_RULE'; id: string }
  | { type: 'UPDATE_LOGIC_RULE'; id: string; patch: Partial<ConditionalLogic> }
  | { type: 'UPDATE_THANK_YOU'; patch: Partial<ThankYouPage> }
  | { type: 'UPDATE_STYLING'; patch: Partial<Styling> }
  | { type: 'RESET' }

function surveyReducer(state: Survey, action: SurveyAction): Survey {
  switch (action.type) {
    case 'UPDATE_INTRODUCTION':
      return {
        ...state,
        introduction: { ...state.introduction, [action.field]: action.value },
      }

    case 'ADD_QUESTION':
      return { ...state, questions: [...state.questions, action.question] }

    case 'REMOVE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.id),
      }

    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.id ? { ...q, ...action.patch } : q,
        ),
      }

    case 'ADD_OPTION':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.id !== action.questionId) return q
          const newOption = { id: uid(), text: `Option ${q.options.length + 1}` }
          return { ...q, options: [...q.options, newOption] }
        }),
      }

    case 'REMOVE_OPTION':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.id !== action.questionId) return q
          return {
            ...q,
            options: q.options.filter((o) => o.id !== action.optionId),
          }
        }),
      }

    case 'UPDATE_OPTION':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.id !== action.questionId) return q
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === action.optionId ? { ...o, text: action.text } : o,
            ),
          }
        }),
      }

    case 'UPDATE_ADDITIONAL_COMMENTS':
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.questionId
            ? { ...q, hasAdditionalComments: action.enabled }
            : q,
        ),
      }

    case 'ADD_LOGIC_RULE':
      return {
        ...state,
        conditionalLogic: [...state.conditionalLogic, action.rule],
      }

    case 'REMOVE_LOGIC_RULE':
      return {
        ...state,
        conditionalLogic: state.conditionalLogic.filter((r) => r.id !== action.id),
      }

    case 'UPDATE_LOGIC_RULE':
      return {
        ...state,
        conditionalLogic: state.conditionalLogic.map((r) =>
          r.id === action.id ? { ...r, ...action.patch } : r,
        ),
      }

    case 'UPDATE_THANK_YOU':
      return { ...state, thankYou: { ...state.thankYou, ...action.patch } }

    case 'UPDATE_STYLING':
      return { ...state, styling: { ...state.styling, ...action.patch } }

    case 'RESET':
      return createDefaultSurvey()

    default:
      return state
  }
}

interface SurveyProviderProps {
  children: ReactNode
}

export function SurveyProvider({ children }: SurveyProviderProps) {
  const [survey, dispatch] = useReducer(surveyReducer, undefined, createDefaultSurvey)

  const value = useMemo<SurveyContextValue>(
    () => ({
      survey,
      updateIntroduction: (field, value) =>
        dispatch({ type: 'UPDATE_INTRODUCTION', field, value }),
      addQuestion: () => {
        const newQuestion: Question = {
          id: uid(),
          title: 'Untitled question',
          description: '',
          options: [
            { id: uid(), text: 'Option 1' },
            { id: uid(), text: 'Option 2' },
          ],
          hasAdditionalComments: false,
        }
        dispatch({ type: 'ADD_QUESTION', question: newQuestion })
      },
      removeQuestion: (id) => dispatch({ type: 'REMOVE_QUESTION', id }),
      updateQuestion: (id, patch) => dispatch({ type: 'UPDATE_QUESTION', id, patch }),
      addOption: (questionId) => dispatch({ type: 'ADD_OPTION', questionId }),
      removeOption: (questionId, optionId) =>
        dispatch({ type: 'REMOVE_OPTION', questionId, optionId }),
      updateOption: (questionId, optionId, text) =>
        dispatch({ type: 'UPDATE_OPTION', questionId, optionId, text }),
      updateAdditionalComments: (questionId, enabled) =>
        dispatch({ type: 'UPDATE_ADDITIONAL_COMMENTS', questionId, enabled }),
      addLogicRule: () => {
        const rule: ConditionalLogic = {
          id: uid(),
          questionId: '',
          operator: 'equals',
          value: '',
          redirectQuestionId: null,
        }
        dispatch({ type: 'ADD_LOGIC_RULE', rule })
      },
      removeLogicRule: (id) => dispatch({ type: 'REMOVE_LOGIC_RULE', id }),
      updateLogicRule: (id, patch) =>
        dispatch({ type: 'UPDATE_LOGIC_RULE', id, patch }),
      updateThankYou: (patch) => dispatch({ type: 'UPDATE_THANK_YOU', patch }),
      updateStyling: (patch) => dispatch({ type: 'UPDATE_STYLING', patch }),
      updateNestedStyling: (key, value) =>
        dispatch({ type: 'UPDATE_STYLING', patch: { [key]: value } as Partial<Styling> }),
      resetSurvey: () => dispatch({ type: 'RESET' }),
    }),
    [survey],
  )

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
}

export function useSurvey(): SurveyContextValue {
  const ctx = useContext(SurveyContext)
  if (!ctx) {
    throw new Error('useSurvey must be used within a SurveyProvider')
  }
  return ctx
}
