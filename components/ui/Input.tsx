import React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
  rightElement?: React.ReactNode
  /** 'light' (default) — for booking wizard & light backgrounds
   *  'dark'            — for auth forms on dark glass panels */
  variant?: 'light' | 'dark'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, hint, rightElement, className, variant = 'light', onFocus, onBlur, ...props }, ref) => {
    const isLight = variant === 'light'

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full transition-all duration-200 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              rightElement && 'pr-11',
              // ── Light variant (booking wizard, original style) ──
              isLight && [
                'rounded-[10px] px-4 py-3 text-sm text-[#1A1A1A]',
                'bg-white border placeholder:text-[#A8A8A8]',
                'focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-0 focus:border-transparent',
                error
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-[#E8E5E0] hover:border-[#D4CFC9]',
                'disabled:bg-[#F5F3F0] disabled:text-[#A8A8A8]',
              ],
              // ── Dark variant (auth forms on dark glass) ──
              !isLight && [
                'rounded-xl px-4 py-3.5 text-sm',
                error
                  ? 'border-red-500/50'
                  : 'border-[rgba(201,168,76,0.18)]',
              ],
              className
            )}
            // Dark variant uses inline styles for glass look (can't do rgba in Tailwind without config)
            style={!isLight ? {
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(201,168,76,0.18)'}`,
              color: '#FAF3E8',
              caretColor: '#C9A84C',
            } : undefined}
            onFocus={(e) => {
              if (!isLight) {
                e.currentTarget.style.border = error
                  ? '1px solid rgba(239,68,68,0.8)'
                  : '1px solid rgba(201,168,76,0.55)'
                e.currentTarget.style.boxShadow = error
                  ? '0 0 0 3px rgba(239,68,68,0.1)'
                  : '0 0 0 3px rgba(201,168,76,0.1)'
              }
              onFocus?.(e)
            }}
            onBlur={(e) => {
              if (!isLight) {
                e.currentTarget.style.border = `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(201,168,76,0.18)'}`
                e.currentTarget.style.boxShadow = 'none'
              }
              onBlur?.(e)
            }}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {hint && !error && (
          <p
            className="mt-1.5 text-xs"
            style={{ color: isLight ? '#A8A8A8' : 'rgba(250,243,232,0.35)' }}
          >
            {hint}
          </p>
        )}
        {error && (
          <p
            className="mt-1.5 text-xs font-medium"
            style={{ color: isLight ? '#dc2626' : 'rgba(239,68,68,0.9)' }}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
