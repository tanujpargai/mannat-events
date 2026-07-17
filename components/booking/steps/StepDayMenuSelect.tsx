'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, UtensilsCrossed } from 'lucide-react'
import { MenuItem, MealType } from '@/lib/types'
import { Card3D } from '@/components/ui/Card3D'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  day: number
  meal: 'lunch' | 'dinner'
  mealType: MealType
  menuItems: MenuItem[]
  selectedIds: string[]
  onNext: (ids: string[], names: string[]) => void
  onPrev: () => void
}

export function StepDayMenuSelect({
  day, meal, mealType, menuItems, selectedIds, onNext, onPrev,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds))
  const [error, setError]       = useState('')

  const mealLabel = meal === 'lunch' ? 'Lunch' : 'Dinner'
  const typeLabel = mealType === 'veg' ? '🌿 Vegetarian' : '🍗 Non-Vegetarian'

  function toggle(id: string) {
    setError('')
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleNext() {
    if (selected.size === 0 && menuItems.length > 0) {
      setError('Please select at least one dish to continue.')
      return
    }
    const ids   = Array.from(selected)
    const names = ids.map((id) => menuItems.find((m) => m.id === id)?.name ?? '')
    onNext(ids, names)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      {/* Badges */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day}
        </span>
        <span className="text-[#D4CFC9]">·</span>
        <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{mealLabel}</span>
        <span className="text-[#D4CFC9]">·</span>
        <span className="text-xs font-semibold text-[#737373]">{typeLabel}</span>
      </div>

      <h2 className="text-headline mb-3">
        Choose your {mealLabel.toLowerCase()} dishes
      </h2>
      <p className="text-body text-[#737373] mb-3">
        Day {day} · {typeLabel} menu — select all that appeal to you.
      </p>
      <p className="text-xs text-[#A8A8A8] mb-8">
        {selected.size} {selected.size === 1 ? 'dish' : 'dishes'} selected
      </p>

      {menuItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-[#E8E2D8]">
          <UtensilsCrossed size={36} className="text-[#D4CFC9] mb-3" strokeWidth={1.4} />
          <p className="text-sm text-[#A8A8A8] text-center max-w-xs">
            Menu items will be available soon. You can continue — selections can be confirmed later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            const isSelected = selected.has(item.id)

            return (
              <Card3D key={item.id} intensity={6}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    'relative w-full h-full text-left rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer overflow-hidden',
                    'focus-visible:outline-none',
                    isSelected
                      ? 'border-[#C5A85C] bg-[#FDFAF3] shadow-3d-selected ring-gold-glow'
                      : 'border-[#E8E2D8] bg-white shadow-3d hover:shadow-3d-hover hover:border-[#D4CFC9]'
                  )}
                >
                  {/* Shimmer on selected */}
                  {isSelected && <div className="absolute inset-0 shimmer-gold rounded-2xl" />}

                  {/* Checkmark badge */}
                  <div className={cn(
                    'absolute top-3 right-3 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                    isSelected
                      ? 'bg-[#C5A85C] border-[#C5A85C]'
                      : 'bg-white border-[#E8E2D8]'
                  )}>
                    {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 pr-6">
                    <p className="font-semibold text-[#1A1A1A] text-sm leading-snug mb-1">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-[#737373] leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              </Card3D>
            )
          })}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleNext}>Next Step</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleNext} className="flex-1">Next Step</Button>
        </div>
      </div>
    </motion.div>
  )
}
