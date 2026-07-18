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

// Derive a short category label from a dish name.
// Rules (in order):
//   1. Extract the FIRST meaningful word that isn't a generic cooking verb/adjective.
//   2. If no keyword matches, use the first word of the name.
const STOP_WORDS = new Set([
  'stuffed', 'spiced', 'slow', 'fresh', 'fried', 'roasted', 'tandoor', 'tandoori',
  'grilled', 'baked', 'creamy', 'royal', 'shahi', 'aromatic', 'plump', 'tender',
  'cooked', 'minced', 'velvety', 'fragrant', 'saffron', 'layered', 'coastal',
  'braised', 'kashmiri', 'whole', 'spiced',
])

function getCategory(name: string): string {
  const words = name.split(/\s+/)
  // Return the first word that isn't a stop-word, title-cased
  for (const word of words) {
    const lower = word.toLowerCase().replace(/[^a-z]/g, '')
    if (lower.length > 2 && !STOP_WORDS.has(lower)) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
  }
  return words[0]
}

interface CategoryGroup {
  category: string
  items: MenuItem[]
}

function groupByCategory(items: MenuItem[]): CategoryGroup[] {
  const map = new Map<string, MenuItem[]>()
  for (const item of items) {
    const cat = getCategory(item.name)
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(item)
  }
  // Sort categories alphabetically
  const groups: CategoryGroup[] = []
  for (const [category, catItems] of map.entries()) {
    groups.push({ category, items: catItems })
  }
  groups.sort((a, b) => a.category.localeCompare(b.category))
  return groups
}

export function StepDayMenuSelect({
  day, meal, mealType, menuItems, selectedIds, onNext, onPrev,
}: Props) {
  // Track SELECTED CATEGORIES (not individual dish ids)
  const groups = groupByCategory(menuItems)

  // Pre-select categories from existing selectedIds
  const initialSelected = new Set<string>(
    groups
      .filter(g => g.items.some(i => selectedIds.includes(i.id)))
      .map(g => g.category)
  )

  const [selectedCats, setSelectedCats] = useState<Set<string>>(initialSelected)
  const [error, setError] = useState('')

  const mealLabel = meal === 'lunch' ? 'Lunch' : 'Dinner'
  const typeLabel  = mealType === 'veg' ? '🌿 Vegetarian' : '🍗 Non-Vegetarian'

  function toggleCat(cat: string) {
    setError('')
    setSelectedCats((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function handleNext() {
    if (selectedCats.size === 0 && menuItems.length > 0) {
      setError('Please select at least one category to continue.')
      return
    }
    // Expand selected categories back to all their item ids/names
    const ids: string[] = []
    const names: string[] = []
    for (const group of groups) {
      if (selectedCats.has(group.category)) {
        for (const item of group.items) {
          ids.push(item.id)
          names.push(item.name)
        }
      }
    }
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
        Choose your {mealLabel.toLowerCase()} preferences
      </h2>
      <p className="text-body text-[#737373] mb-3">
        Day {day} · {typeLabel} menu — pick the styles you enjoy.
      </p>
      <p className="text-xs text-[#A8A8A8] mb-8">
        {selectedCats.size} {selectedCats.size === 1 ? 'category' : 'categories'} selected
      </p>

      {menuItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-[#E8E2D8]">
          <UtensilsCrossed size={36} className="text-[#D4CFC9] mb-3" strokeWidth={1.4} />
          <p className="text-sm text-[#A8A8A8] text-center max-w-xs">
            Menu items will be available soon. You can continue — selections can be confirmed later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map(({ category, items }) => {
            const isSelected = selectedCats.has(category)

            return (
              <Card3D key={category} intensity={6}>
                <button
                  type="button"
                  onClick={() => toggleCat(category)}
                  className={cn(
                    'relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer overflow-hidden',
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
                      {category}
                    </p>
                    <p className="text-xs text-[#A8A8A8]">
                      {items.length === 1
                        ? items[0].name
                        : `${items.length} varieties`}
                    </p>
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
