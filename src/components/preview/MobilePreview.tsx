import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { Question, Survey, TextAlign } from '../../types'
import { hexToRgb } from '../../utils/color'

interface MobilePreviewProps {
  survey: Survey
}

interface PreviewTextStyle {
  color: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontStyle: string
  textAlign: TextAlign
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
}

const FONT_SIZES: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Roboto: "'Roboto', sans-serif",
  Poppins: "'Poppins', sans-serif",
  Georgia: 'Georgia, serif',
  Tahoma: 'Tahoma, sans-serif',
  'Courier New': "'Courier New', monospace",
}

export function MobilePreview({ survey }: MobilePreviewProps) {
  const { styling, thankYou } = survey
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedByQuestion, setSelectedByQuestion] = useState<
    Record<string, string[]>
  >({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [showThankYou, setShowThankYou] = useState(false)

  const total = survey.questions.length
  const currentQ: Question | undefined = survey.questions[currentQuestion]

  const reset = () => {
    setCurrentQuestion(0)
    setSelectedByQuestion({})
    setComments({})
    setShowThankYou(false)
  }

  const toggleOption = (q: Question, optionText: string) => {
    const isCheckbox = styling.controlStyle === 'checkbox'
    const current = selectedByQuestion[q.id] ?? []
    if (isCheckbox) {
      const has = current.includes(optionText)
      setSelectedByQuestion({
        ...selectedByQuestion,
        [q.id]: has
          ? current.filter((o) => o !== optionText)
          : [...current, optionText],
      })
    } else {
      setSelectedByQuestion({ ...selectedByQuestion, [q.id]: [optionText] })
    }
  }

  const overlay = useMemo(
    () =>
      `rgba(${hexToRgb(styling.backdropColor)}, ${styling.backdropOpacity / 100})`,
    [styling.backdropColor, styling.backdropOpacity],
  )

  const cornerRadius = `${styling.cornerRadiusTopLeft}px ${styling.cornerRadiusTopRight}px ${styling.cornerRadiusBottomRight}px ${styling.cornerRadiusBottomLeft}px`

  const textStyle = (t: PreviewTextStyle): React.CSSProperties => ({
    color: t.color,
    fontFamily: FONT_SIZES[t.fontFamily] ?? t.fontFamily,
    fontSize: t.fontSize,
    fontWeight: t.fontWeight,
    fontStyle: t.fontStyle,
    textAlign: t.textAlign,
    marginTop: t.marginTop,
    marginBottom: t.marginBottom,
    marginLeft: t.marginLeft,
    marginRight: t.marginRight,
  })

  const baseFont = (): string =>
    FONT_SIZES[styling.questionTitle.fontFamily] ?? styling.questionTitle.fontFamily

  const selectedForQ = (qId: string) => selectedByQuestion[qId] ?? []

  const canAdvance =
    currentQ !== undefined &&
    (selectedByQuestion[currentQ.id]?.length > 0 || !currentQ)

  const handleNext = () => {
    if (currentQuestion < total - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowThankYou(true)
    }
  }

  const isLast = currentQuestion === total - 1

  const renderOptions = (q: Question) => {
    const selected = selectedForQ(q.id)
    const isCheckbox = styling.controlStyle === 'checkbox'
    const containerClass =
      styling.optionLayout === 'grid'
        ? 'grid grid-cols-2'
        : 'flex flex-col'
    const containerGap =
      styling.optionLayout === 'grid' ? undefined : styling.optionSpacing

    return (
      <div className={containerClass} style={{ gap: containerGap }}>
        {q.options.map((o) => {
          const isSelected = selected.includes(o.text)
          const s = isSelected
            ? styling.selectedOption
            : styling.unselectedOption
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggleOption(q, o.text)}
              className="flex items-center text-left transition-colors"
              style={{
                minHeight: styling.optionHeight,
                backgroundColor: s.fill,
                borderColor: s.borderColor,
                borderWidth: s.borderWidth,
                borderStyle: 'solid',
                borderRadius: styling.optionCornerRadius,
                gap: styling.bulletSpacing,
                padding: '0 14px',
              }}
            >
              {isCheckbox ? (
                <span
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `2px solid ${isSelected ? s.borderColor : styling.controlColor}`,
                    backgroundColor: isSelected ? s.borderColor : 'transparent',
                  }}
                >
                  {isSelected && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              ) : (
                <span
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? s.borderColor : styling.controlColor}`,
                    backgroundColor: 'transparent',
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: s.borderColor,
                      }}
                    />
                  )}
                </span>
              )}
              <span
                style={{
                  color: s.textColor,
                  fontSize: styling.optionFontSize,
                  fontWeight: 500,
                  fontFamily: baseFont(),
                }}
              >
                {o.text}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  const renderThanks = () => {
    const disabledRedir = !thankYou.redirectUrl
    return (
      <div
        className="flex flex-1 flex-col overflow-y-auto"
        style={{
          backgroundColor: styling.thankYou.backgroundColor,
          padding: styling.thankYou.padding,
          borderRadius: styling.thankYou.borderRadius,
        }}
      >
        {thankYou.media && thankYou.mediaType === 'lottie' ? (
          <div
            className="flex w-full flex-col items-center justify-center gap-2 border border-dashed border-brand-300 text-center"
            style={{
              height: styling.thankYouImage.height,
              borderRadius: styling.thankYouImage.borderRadius,
              marginBottom: styling.thankYouImage.marginBottom,
              backgroundColor: '#f5f3ff',
              color: '#6C5CE7',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3.5v4l3 3m5.5 6l-3-3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M7 14l3-3 2 2 3-3 2 2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-medium">Lottie animation</span>
          </div>
        ) : thankYou.media && (
          <img
            src={thankYou.media}
            alt="Thank you"
            className="w-full object-cover"
            style={{
              height: styling.thankYouImage.height,
              borderRadius: styling.thankYouImage.borderRadius,
              marginBottom: styling.thankYouImage.marginBottom,
            }}
          />
        )}
        <div className="flex flex-col items-center text-center">
          <h2 style={textStyle(styling.thankYouTitle)}>{thankYou.title}</h2>
          <p style={textStyle(styling.thankYouDescription)}>
            {thankYou.description}
          </p>
          <button
            type="button"
            onClick={() => {
              if (!disabledRedir) window.open(thankYou.redirectUrl, '_blank')
              else reset()
            }}
            className="w-full text-center"
            style={{
              backgroundColor: styling.thankYouButton.bgColor,
              color: styling.thankYouButton.textColor,
              fontSize: styling.thankYouButton.fontSize,
              padding: styling.thankYouButton.padding,
              borderRadius: styling.thankYouButton.borderRadius,
              fontWeight: 700,
              fontFamily: baseFont(),
            }}
          >
            {thankYou.ctaText || 'Submit another response'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full items-center justify-center py-6">
      <div className="w-[360px] max-w-full">
        <div
          className="mx-auto flex flex-col overflow-hidden bg-gray-900 shadow-phone"
          style={{ borderRadius: 44, padding: 10 }}
        >
          <div
            className="relative flex h-[620px] flex-col overflow-hidden"
            style={{ borderRadius: 34 }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: styling.backdropColor }}
            />
            <div
              className="absolute inset-0 transition-colors duration-300"
              style={{ backgroundColor: overlay }}
            />

            <div className="relative z-10 flex h-full justify-center p-3">
              <div
                className="flex w-full flex-col overflow-hidden bg-white"
                style={{
                  backgroundColor: styling.backgroundColor,
                  borderRadius: cornerRadius,
                  transition: styling.delay
                    ? `all ${styling.delay}ms ease`
                    : undefined,
                }}
              >
                {styling.cross.visible && (
                  <button
                    type="button"
                    onClick={reset}
                    className="absolute right-3 top-3 z-20 flex items-center justify-center"
                    style={{
                      width: styling.cross.size + 12,
                      height: styling.cross.size + 12,
                      borderRadius: '50%',
                      backgroundColor: styling.cross.backgroundColor,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}
                    aria-label="Close survey"
                  >
                    <X size={styling.cross.size} color={styling.cross.color} />
                  </button>
                )}

                {!showThankYou &&
                  (total === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                      <p
                        className="font-medium"
                        style={{ color: styling.subtitle.color }}
                      >
                        Add questions to preview your survey.
                      </p>
                    </div>
                  ) : currentQ ? (
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-gray-400">
                        <span>
                          Question {currentQuestion + 1} of {total}
                        </span>
                      </div>

                      <h2
                        style={textStyle(styling.questionTitle)}
                      >
                        {currentQ.title}
                      </h2>
                      {currentQ.description && (
                        <p style={textStyle(styling.subtitle)}>
                          {currentQ.description}
                        </p>
                      )}

                      <div className="mt-3">{renderOptions(currentQ)}</div>

                      {styling.additionalComment.enabled && (
                        <textarea
                          placeholder={styling.additionalComment.placeholder}
                          value={comments[currentQ.id] ?? ''}
                          onChange={(e) =>
                            setComments({
                              ...comments,
                              [currentQ.id]: e.target.value,
                            })
                          }
                          className="mt-4 w-full resize-none outline-none transition-colors"
                          style={{
                            backgroundColor:
                              styling.additionalComment.bgColor,
                            color: styling.additionalComment.textColor,
                            borderColor:
                              styling.additionalComment.borderColor,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            fontSize: styling.additionalComment.textSize,
                            padding: styling.additionalComment.padding,
                            borderRadius:
                              styling.additionalComment.borderRadius,
                            fontFamily: baseFont(),
                          }}
                          rows={3}
                        />
                      )}

                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!canAdvance}
                          className="w-full text-center transition-opacity disabled:opacity-40"
                          style={{
                            backgroundColor: styling.cta.bgColor,
                            color: styling.cta.textColor,
                            fontSize: styling.cta.fontSize,
                            fontWeight: styling.cta.fontWeight,
                            padding: styling.cta.padding,
                            borderRadius: styling.cta.borderRadius,
                            fontFamily: baseFont(),
                          }}
                        >
                          {isLast ? 'Submit' : 'Next'}
                        </button>
                      </div>
                    </div>
                  ) : null)}

                {showThankYou && thankYou.enabled && renderThanks()}
                {showThankYou && !thankYou.enabled && (
                  <div className="flex flex-1 items-center justify-center p-8 text-center">
                    <p style={{ color: styling.subtitle.color }}>
                      Survey complete. Thank you for your time!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 w-[140px] rounded-full bg-white/95 py-2 text-center shadow-panel">
          <p className="text-[11px] font-semibold text-gray-700">Live Preview</p>
          <p className="text-[10px] text-gray-400">Updates instantly</p>
        </div>
      </div>
    </div>
  )
}
