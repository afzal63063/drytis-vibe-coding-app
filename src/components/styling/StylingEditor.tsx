import { useSurvey } from '../../context/SurveyContext'
import type { Styling } from '../../types'
import { ColorInput, RangeInput, SegmentControl } from '../common/styleControls'
import { Select, Field } from '../common/inputs'
import { Toggle } from '../common/controls'
import { Collapsible } from '../common/EditorSection'
import { useCollapsibleGroups } from '../../hooks/useCollapsibleGroups'
import { TextStyleControls } from './TextStyleControls'

export function StylingEditor() {
  const { survey, updateStyling } = useSurvey()
  const { styling } = survey

  const setStyle = <K extends keyof typeof styling>(key: K, value: (typeof styling)[K]) =>
    updateStyling({ [key]: value })

  type ObjectKeys = {
    [K in keyof Styling]: Styling[K] extends object ? K : never
  }[keyof Styling]

  const setNested = <K extends ObjectKeys>(key: K, patch: Partial<Styling[K]>) =>
    setStyle(key, { ...styling[key], ...patch })

  const [openSection, setOpenSection] = useCollapsibleGroups()

  return (
    <div className="space-y-4">
      <Collapsible
        title="General"
        open={openSection.general}
        onToggle={() => setOpenSection('general')}
      >
        <ColorInput
          label="Background color"
          value={styling.backgroundColor}
          onChange={(c) => setStyle('backgroundColor', c)}
        />

        <div className="grid grid-cols-4 gap-2">
          <Field
            label="TL"
            type="number"
            value={styling.cornerRadiusTopLeft}
            onChange={(e) =>
              setStyle('cornerRadiusTopLeft', Number(e.target.value))
            }
          />
          <Field
            label="TR"
            type="number"
            value={styling.cornerRadiusTopRight}
            onChange={(e) =>
              setStyle('cornerRadiusTopRight', Number(e.target.value))
            }
          />
          <Field
            label="BL"
            type="number"
            value={styling.cornerRadiusBottomLeft}
            onChange={(e) =>
              setStyle('cornerRadiusBottomLeft', Number(e.target.value))
            }
          />
          <Field
            label="BR"
            type="number"
            value={styling.cornerRadiusBottomRight}
            onChange={(e) =>
              setStyle('cornerRadiusBottomRight', Number(e.target.value))
            }
          />
        </div>

        <RangeInput
          label="Delay (ms)"
          value={styling.delay}
          onChange={(v) => setStyle('delay', v)}
          min={0}
          max={2000}
          step={100}
          suffix="ms"
        />

        <ColorInput
          label="Backdrop color"
          value={styling.backdropColor}
          onChange={(c) => setStyle('backdropColor', c)}
        />
        <RangeInput
          label="Backdrop opacity"
          value={styling.backdropOpacity}
          onChange={(v) => setStyle('backdropOpacity', v)}
          min={0}
          max={100}
          suffix="%"
        />
      </Collapsible>

      <Collapsible
        title="Question Title"
        open={openSection.questionTitle}
        onToggle={() => setOpenSection('questionTitle')}
      >
        <TextStyleControls
          label="Question title"
          value={styling.questionTitle}
          onChange={(v) => setNested('questionTitle', { ...v })}
        />
      </Collapsible>

      <Collapsible
        title="Subtitle"
        open={openSection.subtitle}
        onToggle={() => setOpenSection('subtitle')}
      >
        <TextStyleControls
          label="Subtitle"
          value={styling.subtitle}
          onChange={(v) => setNested('subtitle', { ...v })}
        />
      </Collapsible>

      <Collapsible
        title="Option List"
        open={openSection.options}
        onToggle={() => setOpenSection('options')}
      >
        <SegmentControl<'list' | 'grid'>
          label="Layout"
          value={styling.optionLayout}
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          onChange={(v) => setStyle('optionLayout', v)}
        />

        <RangeInput
          label="Option font size"
          value={styling.optionFontSize}
          onChange={(v) => setStyle('optionFontSize', v)}
          min={10}
          max={28}
        />
        <RangeInput
          label="Option height"
          value={styling.optionHeight}
          onChange={(v) => setStyle('optionHeight', v)}
          min={36}
          max={96}
        />
        <RangeInput
          label="Option spacing"
          value={styling.optionSpacing}
          onChange={(v) => setStyle('optionSpacing', v)}
          min={0}
          max={64}
        />
        <RangeInput
          label="Bullet spacing"
          value={styling.bulletSpacing}
          onChange={(v) => setStyle('bulletSpacing', v)}
          min={0}
          max={40}
        />
        <RangeInput
          label="Corner radius"
          value={styling.optionCornerRadius}
          onChange={(v) => setStyle('optionCornerRadius', v)}
          min={0}
          max={32}
        />

        <SegmentControl<'radio' | 'checkbox'>
          label="Control style"
          value={styling.controlStyle}
          options={[
            { value: 'radio', label: 'Radio' },
            { value: 'checkbox', label: 'Checkbox' },
          ]}
          onChange={(v) => setStyle('controlStyle', v)}
        />
        <ColorInput
          label="Control color"
          value={styling.controlColor}
          onChange={(c) => setStyle('controlColor', c)}
        />
      </Collapsible>

      <Collapsible
        title="Filled Option Layout"
        open={openSection.filled}
        onToggle={() => setOpenSection('filled')}
      >
        <ColorInput
          label="Option background (filled)"
          value={styling.optionBgFill}
          onChange={(c) => setStyle('optionBgFill', c)}
        />
      </Collapsible>

      <Collapsible
        title="Selected Option"
        open={openSection.selected}
        onToggle={() => setOpenSection('selected')}
      >
        <ColorInput
          label="Fill"
          value={styling.selectedOption.fill}
          onChange={(c) => setNested('selectedOption', { fill: c })}
        />
        <ColorInput
          label="Text color"
          value={styling.selectedOption.textColor}
          onChange={(c) => setNested('selectedOption', { textColor: c })}
        />
        <ColorInput
          label="Border color"
          value={styling.selectedOption.borderColor}
          onChange={(c) => setNested('selectedOption', { borderColor: c })}
        />
        <RangeInput
          label="Border width"
          value={styling.selectedOption.borderWidth}
          onChange={(v) => setNested('selectedOption', { borderWidth: v })}
          max={6}
        />
      </Collapsible>

      <Collapsible
        title="Unselected Option"
        open={openSection.unselected}
        onToggle={() => setOpenSection('unselected')}
      >
        <ColorInput
          label="Fill"
          value={styling.unselectedOption.fill}
          onChange={(c) => setNested('unselectedOption', { fill: c })}
        />
        <ColorInput
          label="Text color"
          value={styling.unselectedOption.textColor}
          onChange={(c) => setNested('unselectedOption', { textColor: c })}
        />
        <ColorInput
          label="Border color"
          value={styling.unselectedOption.borderColor}
          onChange={(c) => setNested('unselectedOption', { borderColor: c })}
        />
        <RangeInput
          label="Border width"
          value={styling.unselectedOption.borderWidth}
          onChange={(v) => setNested('unselectedOption', { borderWidth: v })}
          max={6}
        />
      </Collapsible>

      <Collapsible
        title="Additional Comment"
        open={openSection.comment}
        onToggle={() => setOpenSection('comment')}
      >
        <Toggle
          checked={styling.additionalComment.enabled}
          onChange={(enabled) => setNested('additionalComment', { enabled })}
          label="Show additional comment"
        />
        <Field
          label="Placeholder"
          value={styling.additionalComment.placeholder}
          onChange={(e) =>
            setNested('additionalComment', { placeholder: e.target.value })
          }
        />
        <ColorInput
          label="Background"
          value={styling.additionalComment.bgColor}
          onChange={(c) => setNested('additionalComment', { bgColor: c })}
        />
        <ColorInput
          label="Text color"
          value={styling.additionalComment.textColor}
          onChange={(c) => setNested('additionalComment', { textColor: c })}
        />
        <ColorInput
          label="Border"
          value={styling.additionalComment.borderColor}
          onChange={(c) => setNested('additionalComment', { borderColor: c })}
        />
        <RangeInput
          label="Text size"
          value={styling.additionalComment.textSize}
          onChange={(v) => setNested('additionalComment', { textSize: v })}
          min={10}
          max={24}
        />
        <RangeInput
          label="Padding"
          value={styling.additionalComment.padding}
          onChange={(v) => setNested('additionalComment', { padding: v })}
          max={32}
        />
        <RangeInput
          label="Radius"
          value={styling.additionalComment.borderRadius}
          onChange={(v) => setNested('additionalComment', { borderRadius: v })}
          max={32}
        />
      </Collapsible>

      <Collapsible
        title="CTA Button"
        open={openSection.cta}
        onToggle={() => setOpenSection('cta')}
      >
        <Field
          label="Button text"
          value={styling.cta.text}
          onChange={(e) => setNested('cta', { text: e.target.value })}
        />
        <ColorInput
          label="Background"
          value={styling.cta.bgColor}
          onChange={(c) => setNested('cta', { bgColor: c })}
        />
        <ColorInput
          label="Text color"
          value={styling.cta.textColor}
          onChange={(c) => setNested('cta', { textColor: c })}
        />
        <RangeInput
          label="Font size"
          value={styling.cta.fontSize}
          onChange={(v) => setNested('cta', { fontSize: v })}
          min={10}
          max={28}
        />
        <Select
          label="Font weight"
          value={String(styling.cta.fontWeight)}
          onChange={(e) =>
            setNested('cta', { fontWeight: Number(e.target.value) as never })
          }
        >
          {[400, 500, 600, 700, 800].map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </Select>
        <RangeInput
          label="Padding"
          value={styling.cta.padding}
          onChange={(v) => setNested('cta', { padding: v })}
          max={40}
        />
        <RangeInput
          label="Radius"
          value={styling.cta.borderRadius}
          onChange={(v) => setNested('cta', { borderRadius: v })}
          max={32}
        />
        <RangeInput
          label="Margin top"
          value={styling.cta.marginTop}
          onChange={(v) => setNested('cta', { marginTop: v })}
          max={80}
        />
      </Collapsible>

      <Collapsible
        title="Cross Button"
        open={openSection.cross}
        onToggle={() => setOpenSection('cross')}
      >
        <Toggle
          checked={styling.cross.visible}
          onChange={(visible) => setNested('cross', { visible })}
          label="Show close button"
        />
        <ColorInput
          label="Icon color"
          value={styling.cross.color}
          onChange={(c) => setNested('cross', { color: c })}
        />
        <RangeInput
          label="Icon size"
          value={styling.cross.size}
          onChange={(v) => setNested('cross', { size: v })}
          min={12}
          max={40}
        />
        <ColorInput
          label="Background"
          value={styling.cross.backgroundColor}
          onChange={(c) => setNested('cross', { backgroundColor: c })}
        />
      </Collapsible>

      <Collapsible
        title="Thank You Page"
        open={openSection.thankYou}
        onToggle={() => setOpenSection('thankYou')}
      >
        <ColorInput
          label="Background"
          value={styling.thankYou.backgroundColor}
          onChange={(c) => setNested('thankYou', { backgroundColor: c })}
        />
        <RangeInput
          label="Padding"
          value={styling.thankYou.padding}
          onChange={(v) => setNested('thankYou', { padding: v })}
          max={48}
        />
        <RangeInput
          label="Radius"
          value={styling.thankYou.borderRadius}
          onChange={(v) => setNested('thankYou', { borderRadius: v })}
          max={48}
        />

        <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Image
        </p>
        <RangeInput
          label="Height"
          value={styling.thankYouImage.height}
          onChange={(v) => setNested('thankYouImage', { height: v })}
          min={40}
          max={320}
        />
        <RangeInput
          label="Radius"
          value={styling.thankYouImage.borderRadius}
          onChange={(v) => setNested('thankYouImage', { borderRadius: v })}
          max={32}
        />
        <RangeInput
          label="Bottom margin"
          value={styling.thankYouImage.marginBottom}
          onChange={(v) => setNested('thankYouImage', { marginBottom: v })}
          max={48}
        />

        <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Title &amp; Description
        </p>
        <TextStyleControls
          label="Thank you title"
          value={styling.thankYouTitle}
          onChange={(v) => setNested('thankYouTitle', { ...v })}
        />
        <TextStyleControls
          label="Thank you description"
          value={styling.thankYouDescription}
          onChange={(v) => setNested('thankYouDescription', { ...v })}
        />

        <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Button
        </p>
        <ColorInput
          label="Background"
          value={styling.thankYouButton.bgColor}
          onChange={(c) => setNested('thankYouButton', { bgColor: c })}
        />
        <ColorInput
          label="Text color"
          value={styling.thankYouButton.textColor}
          onChange={(c) => setNested('thankYouButton', { textColor: c })}
        />
        <RangeInput
          label="Font size"
          value={styling.thankYouButton.fontSize}
          onChange={(v) => setNested('thankYouButton', { fontSize: v })}
          min={10}
          max={28}
        />
        <RangeInput
          label="Padding"
          value={styling.thankYouButton.padding}
          onChange={(v) => setNested('thankYouButton', { padding: v })}
          max={40}
        />
        <RangeInput
          label="Radius"
          value={styling.thankYouButton.borderRadius}
          onChange={(v) => setNested('thankYouButton', { borderRadius: v })}
          max={32}
        />
      </Collapsible>
    </div>
  )
}
