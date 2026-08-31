import { BookOpen } from 'lucide-react'
import { useSurvey } from '../../context/SurveyContext'
import { EditorSection } from '../common/EditorSection'
import { Field, TextArea } from '../common/inputs'

export function IntroductionEditor() {
  const { survey, updateIntroduction } = useSurvey()

  return (
    <EditorSection
      icon={<BookOpen size={16} className="text-brand-500" />}
      title="Introduction"
    >
      <Field
        label="Introduction Title"
        value={survey.introduction.title}
        onChange={(e) => updateIntroduction('title', e.target.value)}
        placeholder="Enter an introduction title"
      />
      <TextArea
        label="Introduction Description"
        value={survey.introduction.description}
        onChange={(e) => updateIntroduction('description', e.target.value)}
        placeholder="Write a short introduction for your survey"
      />
    </EditorSection>
  )
}
