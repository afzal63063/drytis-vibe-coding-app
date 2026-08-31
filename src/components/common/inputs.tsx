import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

const inputClasses =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-colors'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function Field({ label, hint, className = '', ...props }: FieldProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-gray-600">
          {label}
        </span>
      )}
      <input className={`${inputClasses} ${className}`} {...props} />
      {hint && <span className="mt-1 block text-[11px] text-gray-400">{hint}</span>}
    </label>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  rows?: number
}

export function TextArea({ label, rows = 3, className = '', ...props }: TextAreaProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-gray-600">
          {label}
        </span>
      )}
      <textarea
        rows={rows}
        className={`${inputClasses} resize-none ${className}`}
        {...props}
      />
    </label>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: React.ReactNode
}

export function Select({ label, children, className = '', ...props }: SelectProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-gray-600">
          {label}
        </span>
      )}
      <select className={`${inputClasses} cursor-pointer ${className}`} {...props}>
        {children}
      </select>
    </label>
  )
}
