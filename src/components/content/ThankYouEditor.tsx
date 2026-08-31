import { ChangeEvent, useRef } from 'react'
import { HeartHandshake, Image as ImageIcon, Upload, X } from 'lucide-react'
import { useSurvey } from '../../context/SurveyContext'
import { EditorSection } from '../common/EditorSection'
import { Field, Select, TextArea } from '../common/inputs'
import { Toggle } from '../common/controls'

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'application/json',
]

export function ThankYouEditor() {
  const { survey, updateThankYou } = useSurvey()
  const { thankYou } = survey
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    const isLottie =
      file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')
    updateThankYou({ media: objectUrl, mediaType: isLottie ? 'lottie' : 'image' })
  }

  const clearMedia = () => {
    if (thankYou.media) URL.revokeObjectURL(thankYou.media)
    updateThankYou({ media: null, mediaType: null })
  }

  return (
    <EditorSection
      icon={<HeartHandshake size={16} className="text-brand-500" />}
      title="Thank You Page"
      action={
        <Toggle
          checked={thankYou.enabled}
          onChange={(enabled) => updateThankYou({ enabled })}
        />
      }
    >
      {!thankYou.enabled ? (
        <p className="py-4 text-center text-sm text-gray-400">
          Thank You page is disabled. Surveys will end after the last question.
        </p>
      ) : (
        <>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">Upload Media</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
            {thankYou.media ? (
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                {thankYou.mediaType === 'lottie' ? (
                  <div className="flex h-32 w-full flex-col items-center justify-center gap-1.5 bg-brand-50 text-brand-600">
                    <span className="text-xs font-medium">
                      Lottie animation loaded
                    </span>
                    <span className="text-[11px] text-brand-400">
                      Played in the live preview
                    </span>
                  </div>
                ) : (
                  <img
                    src={thankYou.media}
                    alt="Thank you media preview"
                    className="h-32 w-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={clearMedia}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-gray-600 shadow hover:text-red-500"
                  aria-label="Remove media"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-400 transition-colors hover:border-brand-400 hover:text-brand-500"
              >
                <Upload size={22} />
                <span className="text-sm">
                  Upload media{' '}
                  <span className="font-medium">
                    (PNG / JPG / JPEG / GIF / Lottie)
                  </span>
                </span>
                <span className="text-xs">
                  Files are previewed locally in your browser
                </span>
              </button>
            )}
          </div>

          <Field
            label="Thank You Title"
            value={thankYou.title}
            onChange={(e) => updateThankYou({ title: e.target.value })}
            placeholder="Thank you for taking the survey!"
          />

          <TextArea
            label="Thank You Description"
            value={thankYou.description}
            onChange={(e) => updateThankYou({ description: e.target.value })}
            rows={3}
            placeholder="Write a warm thank you message"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="CTA Button Text"
              value={thankYou.ctaText}
              onChange={(e) => updateThankYou({ ctaText: e.target.value })}
              placeholder="Submit another response"
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">
              After CTA — redirect to
            </p>
            <Select
              label=""
              value={thankYou.redirectUrl}
              onChange={(e) => updateThankYou({ redirectUrl: e.target.value })}
            >
              <option value="https://example.com">Example (example.com)</option>
              <option value="https://google.com">Google</option>
              <option value="https://github.com">GitHub</option>
              <option value="">None / stay on page</option>
            </Select>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon size={14} className="text-brand-500" />
              Files are previewed locally. Nothing is uploaded to a server.
            </span>
          </div>
        </>
      )}
    </EditorSection>
  )
}
