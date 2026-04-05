import React from 'react'

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  multiline?: boolean
  rows?: number
}
export function Input({
  label,
  error,
  multiline = false,
  rows = 4,
  className = '',
  ...props
}: InputProps) {
  const baseStyles =
    'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
  const errorStyles = error ? 'border-red-500' : 'border-slate-300'
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className={`${baseStyles} ${errorStyles} ${className}`}
          rows={rows}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input;