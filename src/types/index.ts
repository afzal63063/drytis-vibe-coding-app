export interface Option {
  id: string
  text: string
}

export interface ConditionalLogic {
  id: string
  questionId: string
  operator: 'equals' | 'not_equals' | 'contains'
  value: string
  redirectQuestionId: string | null
}

export interface Question {
  id: string
  title: string
  description: string
  options: Option[]
  hasAdditionalComments: boolean
}

export interface ThankYouPage {
  enabled: boolean
  media: string | null
  mediaType: 'image' | 'lottie' | null
  title: string
  description: string
  ctaText: string
  redirectUrl: string
}

export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800

export type FontFamily =
  | 'Inter'
  | 'Roboto'
  | 'Poppins'
  | 'Georgia'
  | 'Tahoma'
  | 'Courier New'

export type FontStyle = 'normal' | 'italic'

export type TextAlign = 'left' | 'center' | 'right'

export type VerticalAlign = 'top' | 'middle' | 'bottom'

export interface TextStyling {
  color: string
  fontFamily: FontFamily
  fontSize: number
  fontWeight: FontWeight
  fontStyle: FontStyle
  textAlign: TextAlign
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
}

export type OptionLayout = 'list' | 'grid'

export interface Styling {
  backgroundColor: string
  backdropColor: string
  backdropOpacity: number
  cornerRadiusTopLeft: number
  cornerRadiusTopRight: number
  cornerRadiusBottomLeft: number
  cornerRadiusBottomRight: number
  delay: number

  questionTitle: TextStyling
  subtitle: TextStyling

  optionLayout: OptionLayout
  optionFontSize: number
  optionSpacing: number
  optionHeight: number
  bulletSpacing: number
  optionCornerRadius: number

  controlStyle: 'radio' | 'checkbox'

  controlColor: string
  optionBgFill: string
  optionBgEmpty: string

  selectedOption: {
    fill: string
    textColor: string
    borderColor: string
    borderWidth: number
  }
  unselectedOption: {
    fill: string
    textColor: string
    borderColor: string
    borderWidth: number
  }

  additionalComment: {
    enabled: boolean
    placeholder: string
    bgColor: string
    textColor: string
    borderColor: string
    textSize: number
    padding: number
    borderRadius: number
  }

  cta: {
    text: string
    bgColor: string
    textColor: string
    fontSize: number
    fontWeight: FontWeight
    padding: number
    borderRadius: number
    marginTop: number
  }

  cross: {
    visible: boolean
    color: string
    size: number
    backgroundColor: string
  }

  thankYou: {
    backgroundColor: string
    padding: number
    borderRadius: number
  }
  thankYouImage: {
    height: number
    borderRadius: number
    marginBottom: number
  }
  thankYouTitle: TextStyling
  thankYouDescription: TextStyling
  thankYouButton: {
    bgColor: string
    textColor: string
    fontSize: number
    borderRadius: number
    padding: number
  }
}

export interface Survey {
  introduction: {
    title: string
    description: string
  }
  questions: Question[]
  conditionalLogic: ConditionalLogic[]
  thankYou: ThankYouPage
  styling: Styling
}

export type SectionId = 'content' | 'styling'
export type ContentTab = 'introduction' | 'questions' | 'logic' | 'thankyou'
