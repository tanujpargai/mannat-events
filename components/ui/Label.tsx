import React from 'react'
import { cn } from '@/lib/utils/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  /** 'light' (default) — dark text for light backgrounds (booking wizard)
   *  'dark'            — muted cream text for dark glass panels (auth) */
  variant?: 'light' | 'dark'
}

export function Label({ required, children, className, variant = 'light', ...props }: LabelProps) {
  return (
    <label
      className={cn('block text-xs font-semibold tracking-wide mb-2 uppercase', className)}
      style={{
        color: variant === 'dark'
          ? 'rgba(250,243,232,0.55)'
          : '#737373',
        letterSpacing: '0.1em',
      }}
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-0.5"
          style={{ color: variant === 'dark' ? '#C9A84C' : '#C9A84C' }}
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  )
}
