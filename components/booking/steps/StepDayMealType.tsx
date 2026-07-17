'use client'

import { motion } from 'framer-motion'
import { Leaf, Flame } from 'lucide-react'
import { MealType, BookingFormData } from '@/lib/types'
import { Card3D } from '@/components/ui/Card3D'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  day: number
  meal: 'lunch' | 'dinner'
  currentType?: MealType
  onNext: (type: MealType) => void
  onPrev: () => void
}

const OPTIONS: {
  type: MealType
  label: string
  subtitle: string
  icon: typeof Leaf
  cardClass: string
  selectedClass: string
  iconColor: string
  badgeClass: string
}[] = [
  {
    type:          'veg',
    label:         'Vegetarian',
    subtitle:      'Fresh, plant-based dishes crafted with the finest seasonal ingredients',
    icon:          Leaf,
    cardClass:     'meal-card-veg',
    selectedClass: 'meal-card-veg-selected',
    iconColor:     'text-green-600',
    badgeClass:    'bg-green-100 text-green-700',
  },
  {
    type:          'non-veg',
    label:         'Non-Vegetarian',
    subtitle:      'Rich, flavourful dishes featuring premium meats and seafood',
    icon:          Flame,
    cardClass:     'meal-card-nonveg',
    selectedClass: 'meal-card-nonveg-selected',
    iconColor:     'text-red-600',
    badgeClass:    'bg-red-100 text-red-700',
  },
]

export function StepDayMealType({ day, meal, currentType, onNext, onPrev }: Props) {
  const mealLabel = meal === 'lunch' ? 'Lunch' : 'Dinner'

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      {/* Day + Meal badge */}
      <div className="mb-6 flex items-center gap-2">
        <span className="inline-flex px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day}
        </span>
        <span className="text-[#D4CFC9]">·</span>
        <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{mealLabel}</span>
      </div>

      <h2 className="text-headline mb-3">
        {mealLabel} Preference
      </h2>
      <p className="text-body text-[#737373] mb-10">
        This choice applies to the entire {mealLabel.toLowerCase()} menu for Day {day}.
      </p>

      {/* Two large 3D cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {OPTIONS.map((opt) => {
          const isSelected = currentType === opt.type
          const Icon       = opt.icon

          return (
            <Card3D key={opt.type} intensity={8}>
              <button
                type="button"
                onClick={() => onNext(opt.type)}
                className={cn(
                  'relative w-full rounded-3xl border-2 p-8 text-left cursor-pointer transition-all duration-300 overflow-hidden',
                  'focus-visible:outline-none',
                  isSelected
                    ? cn(opt.selectedClass, 'ring-gold-glow border-transparent shadow-3d-selected')
                    : cn(opt.cardClass, 'shadow-3d hover:shadow-3d-hover')
                )}
              >
                {/* Shimmer overlay on selected */}
                {isSelected && (
                  <div className="absolute inset-0 shimmer-gold rounded-3xl" />
                )}

                {/* Icon */}
                <div className={cn(
                  'relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300',
                  isSelected ? opt.badgeClass : 'bg-white/80'
                )}>
                  <Icon size={28} className={opt.iconColor} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="relative z-10">
                  <h3 className="text-xl font-serif font-medium text-[#1A1A1A] mb-2">
                    {opt.label}
                  </h3>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    {opt.subtitle}
                  </p>
                </div>

                {/* Selected tick */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-[#C5A85C] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            </Card3D>
          )
        })}
      </div>

      <p className="mt-6 text-xs text-[#A8A8A8] text-center">
        🌅 Breakfast is always complimentary with every room booking.
      </p>

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
