'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bed, Users, UtensilsCrossed, Calendar, Leaf, Flame, X, Info } from 'lucide-react'
import { DayPlan, FoodPreference, MenuItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  day: number
  totalDays: number
  plan: DayPlan
  vegMenuItems: MenuItem[]
  nonVegMenuItems: MenuItem[]
  onNext: (plan: DayPlan) => void
  onPrev: () => void
}

const LUNCH_FUNCTIONS = [
  'Welcome Lunch',
  'Mehendi',
  'Haldi',
  'Cocktail',
  'Jaimala / Wedding Ceremony',
  'Phere',
  'Reception',
  'Other',
]

const DINNER_FUNCTIONS = [
  'Welcome Dinner',
  'Mehendi',
  'Haldi',
  'Cocktail',
  'Jaimala / Wedding Ceremony',
  'Phere',
  'Reception',
  'Other',
]

const MENU_PACKAGES = [
  { id: 'silver',   name: 'Silver Banquet Menu' },
  { id: 'gold',     name: 'Gold Royal Feast Menu' },
  { id: 'diamond',  name: 'Diamond Grand Buffet Menu' },
  { id: 'imperial', name: 'Imperial Taj Special Menu' },
]

const MOCK_MENU = {
  veg: [
    { category: 'Starters', emoji: '🥗', items: ['Paneer Tikka', 'Veg Spring Rolls', 'Dahi Puri Chaat', 'Corn Palak Tikki', 'Hara Bhara Kebab'] },
    { category: 'Main Course', emoji: '🍛', items: ['Paneer Butter Masala', 'Dal Makhani', 'Shahi Paneer', 'Aloo Gobi', 'Veg Biryani'] },
    { category: 'Breads & Rice', emoji: '🍚', items: ['Butter Naan', 'Tandoori Roti', 'Laccha Paratha', 'Jeera Rice', 'Pulao'] },
    { category: 'Desserts', emoji: '🍮', items: ['Gulab Jamun', 'Rasgulla', 'Kheer', 'Gajar Halwa', 'Moong Dal Halwa'] },
  ],
  'non-veg': [
    { category: 'Starters', emoji: '🍗', items: ['Chicken Tikka', 'Seekh Kebab', 'Fish Amritsari', 'Tandoori Prawns'] },
    { category: 'Main Course', emoji: '🍖', items: ['Butter Chicken', 'Mutton Rogan Josh', 'Chicken Biryani', 'Fish Curry'] },
    { category: 'Breads & Rice', emoji: '🍚', items: ['Butter Naan', 'Tandoori Roti', 'Mutton Biryani Rice', 'Jeera Rice'] },
    { category: 'Desserts', emoji: '🍮', items: ['Gulab Jamun', 'Kheer', 'Rasgulla', 'Ice Cream'] },
  ],
  mixed: [
    { category: 'Starters', emoji: '🥗🍗', items: ['Paneer Tikka', 'Chicken Tikka', 'Dahi Puri', 'Seekh Kebab'] },
    { category: 'Main Course', emoji: '🍛🍖', items: ['Butter Chicken', 'Paneer Butter Masala', 'Dal Makhani', 'Chicken Biryani'] },
    { category: 'Breads & Rice', emoji: '🍚', items: ['Butter Naan', 'Tandoori Roti', 'Biryani Rice', 'Jeera Rice'] },
    { category: 'Desserts', emoji: '🍮', items: ['Gulab Jamun', 'Gajar Halwa', 'Rasgulla', 'Kheer'] },
  ],
}

export function StepDayPlan({
  day, totalDays, plan, onNext, onPrev,
}: Props) {
  // 2.1 Room Requirement
  const [rooms, setRooms] = useState<number>(plan.rooms ?? 1)
  
  // Separate Guest Counts for Lunch & Dinner
  const [lunchGuestCount, setLunchGuestCount] = useState<number>(plan.lunch.guest_count ?? 50)
  const [dinnerGuestCount, setDinnerGuestCount] = useState<number>(plan.dinner.guest_count ?? 50)
  
  // Separate Food Preferences for Lunch & Dinner — null means not yet chosen (mandatory)
  const [lunchFoodPref, setLunchFoodPref] = useState<FoodPreference | null>(plan.lunch.type ?? null)
  const [dinnerFoodPref, setDinnerFoodPref] = useState<FoodPreference | null>(plan.dinner.type ?? null)

  // Validation error for mandatory meal selection
  const [validationError, setValidationError] = useState('')

  function handleSubmit() {
    if (!lunchFoodPref || !dinnerFoodPref) {
      setValidationError('Please select Lunch and Dinner preferences for every day.')
      return
    }
    setValidationError('')
    onNext({
      ...plan,
      day,
      rooms,
      guest_count: Math.max(lunchGuestCount, dinnerGuestCount),
      food_preference: lunchFoodPref,
      lunch:  { ...plan.lunch, type: lunchFoodPref, guest_count: lunchGuestCount },
      dinner: { ...plan.dinner, type: dinnerFoodPref, guest_count: dinnerGuestCount },
    })
  }

  const foodPrefOptions: { value: FoodPreference; label: string; icon: React.ReactNode }[] = [
    { value: 'veg',     label: 'Vegetarian',     icon: <Leaf size={13} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Vegetarian', icon: <Flame size={13} className="text-red-500" /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day} of {totalDays}
        </span>
        <span className="text-xs text-[#A8A8A8]">🌅 Breakfast included</span>
      </div>

      <h2 className="text-headline mb-1">Day {day} Planning</h2>
      <p className="text-body text-[#737373] mb-8">
        Specify your room requirements, plus guest counts and food preferences for Lunch and Dinner.
      </p>

      <div className="space-y-6">

        {/* ── 2.1 Room Requirement ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Bed size={15} className="text-[#C5A85C]" />
            2.1 Number of Rooms Required
          </label>
          <input
            type="number"
            min={1}
            max={999}
            value={rooms}
            onChange={e => setRooms(Math.max(1, Number(e.target.value) || 1))}
            className="w-full max-w-xs border border-[#E8E2D8] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
            placeholder="e.g. 25"
          />
        </div>

        {/* ── 2.2 LUNCH CONFIGURATION ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
            <Leaf size={16} className="text-green-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">2.2 Lunch Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lunch Guest Count */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Users size={13} className="text-[#C5A85C]" /> Lunch Guest Count
              </label>
              <input
                type="number"
                min={1}
                max={9999}
                value={lunchGuestCount}
                onChange={e => setLunchGuestCount(Math.max(1, Number(e.target.value) || 1))}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
                placeholder="e.g. 150"
              />
            </div>

            {/* Lunch Food Preference */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Lunch Food Preference
              </label>
              <div className="flex gap-1.5">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLunchFoodPref(opt.value)}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex-1 justify-center',
                      lunchFoodPref === opt.value
                        ? 'bg-[#C5A85C] border-[#C5A85C] text-white shadow-sm'
                        : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2.3 DINNER CONFIGURATION ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
            <Flame size={16} className="text-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">2.3 Dinner Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dinner Guest Count */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Users size={13} className="text-[#C5A85C]" /> Dinner Guest Count
              </label>
              <input
                type="number"
                min={1}
                max={9999}
                value={dinnerGuestCount}
                onChange={e => setDinnerGuestCount(Math.max(1, Number(e.target.value) || 1))}
                className="w-full border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
                placeholder="e.g. 250"
              />
            </div>

            {/* Dinner Food Preference */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Dinner Food Preference
              </label>
              <div className="flex gap-1.5">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDinnerFoodPref(opt.value)}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex-1 justify-center',
                      dinnerFoodPref === opt.value
                        ? 'bg-[#C5A85C] border-[#C5A85C] text-white shadow-sm'
                        : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Validation error */}
      {validationError && (
        <p className="mt-6 text-sm font-semibold text-red-600 flex items-center gap-1.5">
          ⚠️ {validationError}
        </p>
      )}

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-6 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleSubmit}>
          {day < totalDays ? `Next: Day ${day + 1}` : 'Next Step: Menu Packages'}
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        {validationError && (
          <p className="text-xs font-semibold text-red-600 text-center pb-2">⚠️ {validationError}</p>
        )}
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">
            {day < totalDays ? `Day ${day + 1} →` : 'Menu Packages →'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
