import type { Survey } from '../types'

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const createDefaultSurvey = (): Survey => ({
  introduction: {
    title: 'Welcome to our Survey',
    description:
      'We would love to hear your feedback. It only takes a couple of minutes. Thank you for participating!',
  },
  questions: [
    {
      id: uid(),
      title: 'How satisfied are you with our product?',
      description: 'Please rate your overall experience with us.',
      options: [
        { id: uid(), text: 'Very satisfied' },
        { id: uid(), text: 'Satisfied' },
        { id: uid(), text: 'Neutral' },
        { id: uid(), text: 'Dissatisfied' },
      ],
      hasAdditionalComments: false,
    },
    {
      id: uid(),
      title: 'How likely are you to recommend us to a friend?',
      description: 'Scale from 0 (not likely) to 10 (extremely likely).',
      options: [
        { id: uid(), text: '0 - Not likely' },
        { id: uid(), text: '5 - Somewhat likely' },
        { id: uid(), text: '10 - Extremely likely' },
      ],
      hasAdditionalComments: false,
    },
  ],
  conditionalLogic: [
    {
      id: uid(),
      questionId: '',
      operator: 'equals',
      value: '',
      redirectQuestionId: null,
    },
  ],
  thankYou: {
    enabled: true,
    media: null,
    mediaType: null,
    title: 'Thank you for your feedback!',
    description:
      'Your response has been recorded. We truly appreciate your time and input.',
    ctaText: 'Submit another response',
    redirectUrl: 'https://example.com',
  },
  styling: {
    backgroundColor: '#FFFFFF',
    backdropColor: '#000000',
    backdropOpacity: 60,
    cornerRadiusTopLeft: 24,
    cornerRadiusTopRight: 24,
    cornerRadiusBottomLeft: 24,
    cornerRadiusBottomRight: 24,
    delay: 0,

    questionTitle: {
      color: '#111827',
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 700,
      fontStyle: 'normal',
      textAlign: 'left',
      marginTop: 0,
      marginBottom: 8,
      marginLeft: 0,
      marginRight: 0,
    },
    subtitle: {
      color: '#6B7280',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      fontStyle: 'normal',
      textAlign: 'left',
      marginTop: 0,
      marginBottom: 20,
      marginLeft: 0,
      marginRight: 0,
    },

    optionLayout: 'list',
    optionFontSize: 15,
    optionSpacing: 12,
    optionHeight: 52,
    bulletSpacing: 12,
    optionCornerRadius: 10,

    controlStyle: 'radio',
    controlColor: '#6C5CE7',
    optionBgFill: '#FFFFFF',
    optionBgEmpty: '#FFFFFF',

    selectedOption: {
      fill: '#F1EDFF',
      textColor: '#6C5CE7',
      borderColor: '#6C5CE7',
      borderWidth: 2,
    },
    unselectedOption: {
      fill: '#FFFFFF',
      textColor: '#374151',
      borderColor: '#E5E7EB',
      borderWidth: 1,
    },

    additionalComment: {
      enabled: false,
      placeholder: 'Add any additional comments...',
      bgColor: '#FFFFFF',
      textColor: '#111827',
      borderColor: '#E5E7EB',
      textSize: 14,
      padding: 14,
      borderRadius: 10,
    },

    cta: {
      text: 'Submit',
      bgColor: '#6C5CE7',
      textColor: '#FFFFFF',
      fontSize: 16,
      fontWeight: 700,
      padding: 16,
      borderRadius: 12,
      marginTop: 24,
    },

    cross: {
      visible: true,
      color: '#6B7280',
      size: 22,
      backgroundColor: '#FFFFFF',
    },

    thankYou: {
      backgroundColor: '#FFFFFF',
      padding: 28,
      borderRadius: 20,
    },
    thankYouImage: {
      height: 160,
      borderRadius: 16,
      marginBottom: 20,
    },
    thankYouTitle: {
      color: '#111827',
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 800,
      fontStyle: 'normal',
      textAlign: 'center',
      marginTop: 0,
      marginBottom: 12,
      marginLeft: 0,
      marginRight: 0,
    },
    thankYouDescription: {
      color: '#6B7280',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      fontStyle: 'normal',
      textAlign: 'center',
      marginTop: 0,
      marginBottom: 24,
      marginLeft: 0,
      marginRight: 0,
    },
    thankYouButton: {
      bgColor: '#6C5CE7',
      textColor: '#FFFFFF',
      fontSize: 16,
      borderRadius: 12,
      padding: 16,
    },
  },
})
