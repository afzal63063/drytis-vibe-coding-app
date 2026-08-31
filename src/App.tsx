import { useState } from 'react'
import type { SectionId } from './types'
import { SurveyProvider, useSurvey } from './context/SurveyContext'
import { Sidebar } from './components/Sidebar'
import { ContentEditor } from './components/ContentEditor'
import { StylingEditor } from './components/styling/StylingEditor'
import { MobilePreview } from './components/preview/MobilePreview'
import { CheckCircle2, Smartphone } from 'lucide-react'

function EditorPanel() {
  const [activeSection, setActiveSection] = useState<SectionId>('content')
  const { survey } = useSurvey()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {activeSection === 'content' ? 'Content' : 'Styling'}
            </h1>
            <p className="text-xs text-gray-400">
              {activeSection === 'content'
                ? 'Build your survey questions and flow'
                : 'Customize the look and feel in real time'}
            </p>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">
              Auto-save on · no manual save needed
            </span>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="max-h-[45vh] overflow-y-auto border-b border-gray-200 p-5 lg:max-h-none lg:w-[440px] lg:flex-none lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
            {activeSection === 'content' ? (
              <ContentEditor />
            ) : (
              <StylingEditor />
            )}
          </div>

          <div
            className="relative flex flex-1 items-stretch justify-center overflow-y-auto bg-gradient-to-br from-gray-100 via-gray-50 to-brand-50"
          >
            <div className="absolute left-3 top-3 hidden items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm lg:flex">
              <Smartphone size={14} />
              Mobile Preview
            </div>
            <div className="w-full">
              <MobilePreview survey={survey} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <SurveyProvider>
      <EditorPanel />
    </SurveyProvider>
  )
}
