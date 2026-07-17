'use client'

import { motion } from 'framer-motion'
import { BookingFormData } from '@/lib/types'
import { Card3D } from '@/components/ui/Card3D'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  data: Partial<BookingFormData>
  onNext: (style: string) => void
  onPrev: () => void
}

const STYLES = [
  {
    id:          'traditional',
    emoji:       '🐘',
    title:       'Traditional Baraat',
    description: 'Classic procession with dhol, shehnai, and a beautifully decorated horse leading the groom.',
    gradient:    'from-amber-50 to-orange-50',
    border:      'border-amber-200',
    selectedBorder: 'border-amber-400',
    iconBg:      'bg-amber-100',
  },
  {
    id:          'stylish',
    emoji:       '✨',
    title:       'Stylish Baraat',
    description: 'Modern flair with LED lights, vintage cars, and a choreographed entry that wows every guest.',
    gradient:    'from-violet-50 to-purple-50',
    border:      'border-violet-200',
    selectedBorder: 'border-violet-400',
    iconBg:      'bg-violet-100',
  },
  {
    id:          'dj-on-wheels',
    emoji:       '🎧',
    title:       'DJ on Wheels',
    description: 'High-energy mobile DJ setup with thundering bass, laser lights, and non-stop celebration.',
    gradient:    'from-blue-50 to-cyan-50',
    border:      'border-blue-200',
    selectedBorder: 'border-blue-400',
    iconBg:      'bg-blue-100',
  },
]

export function StepBaraatStyle({ data, onNext, onPrev }: Props) {
  const selected = data.baraat_style ?? ''

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <h2 className="text-headline mb-3">Baraat Style</h2>
      <p className="text-body text-[#737373] mb-10">
        Choose the vibe for the wedding procession.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STYLES.map((style, i) => {
          const isSelected = selected === style.id

          return (
            <Card3D key={style.id} intensity={10}>
              <motion.button
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 280, damping: 28 }}
                type="button"
                onClick={() => onNext(style.id)}
                className={cn(
                  'relative w-full text-left rounded-3xl border-2 p-7 cursor-pointer',
                  'transition-all duration-300 overflow-hidden',
                  'focus-visible:outline-none',
                  `bg-gradient-to-br ${style.gradient}`,
                  isSelected
                    ? cn(style.selectedBorder, 'ring-gold-glow shadow-3d-selected')
                    : cn(style.border, 'shadow-3d hover:shadow-3d-hover')
                )}
              >
                {/* Shimmer on selected */}
                {isSelected && <div className="absolute inset-0 shimmer-gold rounded-3xl" />}

                {/* Gold tick */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-[#C5A85C] flex items-center justify-center shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Emoji icon */}
                <div className={cn(
                  'relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-4xl',
                  'shadow-sm border border-white/60',
                  style.iconBg
                )}>
                  {style.emoji}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-serif font-medium text-[#1A1A1A] mb-2">
                    {style.title}
                  </h3>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </motion.button>
            </Card3D>
          )
        })}
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-start mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto">
          <Button variant="secondary" size="lg" onClick={onPrev} className="w-full">Previous</Button>
        </div>
      </div>
    </motion.div>
  )
}
