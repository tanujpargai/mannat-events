'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface Props {
  currentIndex: number
  totalSteps: number
  currentLabel: string
}

export function DynamicProgressBar({ currentIndex, totalSteps, currentLabel }: Props) {
  const progress = totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0
  const stepNum  = currentIndex + 1

  return (
    <div className="sticky top-0 z-40 glass-panel border-b border-[#E8D9A8]/60 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4">

          {/* Step counter */}
          <div className="shrink-0">
            <span className="text-xs font-bold text-[#C5A85C] tabular-nums">
              {String(stepNum).padStart(2, '0')}
            </span>
            <span className="text-xs text-[#D4CFC9] mx-1">/</span>
            <span className="text-xs text-[#A8A8A8] tabular-nums">
              {String(totalSteps).padStart(2, '0')}
            </span>
          </div>

          {/* Track */}
          <div className="flex-1 relative">
            {/* Background track */}
            <div className="h-2 rounded-full progress-track overflow-hidden">
              {/* Fill */}
              <motion.div
                className="h-full rounded-full progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            </div>

            {/* Glowing dot */}
            {progress > 0 && progress < 100 && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full progress-dot"
                animate={{ left: `${progress}%` }}
                style={{ marginLeft: '-8px' }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            )}
          </div>

          {/* Current step label */}
          <div className="shrink-0 hidden sm:block">
            <motion.span
              key={currentLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-[#737373] max-w-[140px] truncate block text-right"
            >
              {currentLabel}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  )
}
