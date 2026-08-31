import type { FontFamily, FontStyle, FontWeight, TextAlign, TextStyling } from '../../types'
import { ColorInput, RangeInput, SegmentControl } from '../common/styleControls'
import { Select, Field } from '../common/inputs'

interface TextStyleControlsProps {
  label: string
  value: TextStyling
  onChange: (value: TextStyling) => void
}

const FONTS: FontFamily[] = [
  'Inter',
  'Roboto',
  'Poppins',
  'Georgia',
  'Tahoma',
  'Courier New',
]

const WEIGHTS: FontWeight[] = [300, 400, 500, 600, 700, 800]

export function TextStyleControls({
  label,
  value,
  onChange,
}: TextStyleControlsProps) {
  const set = <K extends keyof TextStyling>(key: K, v: TextStyling[K]) =>
    onChange({ ...value, [key]: v })

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <ColorInput
        label="Text color"
        value={value.color}
        onChange={(c) => set('color', c)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Font"
          value={value.fontFamily}
          onChange={(e) => set('fontFamily', e.target.value as FontFamily)}
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>

        <Select
          label="Weight"
          value={String(value.fontWeight)}
          onChange={(e) =>
            set('fontWeight', Number(e.target.value) as FontWeight)
          }
        >
          {WEIGHTS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <RangeInput
          label="Size"
          value={value.fontSize}
          onChange={(v) => set('fontSize', v)}
          min={10}
          max={48}
        />
        <Select
          label="Style"
          value={value.fontStyle}
          onChange={(e) => set('fontStyle', e.target.value as FontStyle)}
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
        </Select>
      </div>

      <SegmentControl<TextAlign>
        label="Alignment"
        value={value.textAlign}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        onChange={(v) => set('textAlign', v)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Margin top"
          value={value.marginTop}
          type="number"
          onChange={(e) => set('marginTop', Number(e.target.value))}
        />
        <Field
          label="Margin bottom"
          value={value.marginBottom}
          type="number"
          onChange={(e) => set('marginBottom', Number(e.target.value))}
        />
        <Field
          label="Margin left"
          value={value.marginLeft}
          type="number"
          onChange={(e) => set('marginLeft', Number(e.target.value))}
        />
        <Field
          label="Margin right"
          value={value.marginRight}
          type="number"
          onChange={(e) => set('marginRight', Number(e.target.value))}
        />
      </div>
    </div>
  )
}
