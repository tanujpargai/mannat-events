'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bed, Users, UtensilsCrossed, Calendar, Leaf, Flame, Sparkles, X, Info } from 'lucide-react'
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
  
  // 2.2 Guest Details
  const [guestCount, setGuestCount] = useState<number>(plan.guest_count ?? 50)
  
  // 2.3 Food Preference
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(plan.food_preference ?? 'veg')
  
  // 2.4 Menu Selection Popup state
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false)
  
  // 2.5 Lunch Function & 2.6 Dinner Function
  const [lunchFunction, setLunchFunction] = useState<string>(plan.lunch_function ?? 'Welcome Lunch')
  const [dinnerFunction, setDinnerFunction] = useState<string>(plan.dinner_function ?? 'Welcome Dinner')

  function handleSubmit() {
    onNext({
      day,
      rooms,
      guest_count: guestCount,
      food_preference: foodPreference,
      lunch_function: lunchFunction,
      dinner_function: dinnerFunction,
      lunch:  { type: foodPreference === 'non-veg' ? 'non-veg' : 'veg', menu_item_ids: [], menu_item_names: [lunchFunction], guest_count: guestCount },
      dinner: { type: foodPreference === 'non-veg' ? 'non-veg' : 'veg', menu_item_ids: [], menu_item_names: [dinnerFunction], guest_count: guestCount },
    })
  }

  const foodPrefOptions: { value: FoodPreference; label: string; icon: React.ReactNode }[] = [
    { value: 'veg',     label: 'Veg',     icon: <Leaf size={14} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Veg', icon: <Flame size={14} className="text-red-500" /> },
    { value: 'mixed',   label: 'Mixed',   icon: <Sparkles size={14} className="text-[#C5A85C]" /> },
  ]

  const activeMenu = MOCK_MENU[foodPreference] || MOCK_MENU.veg

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
        Specify your rooms, guests, food preferences and event functions for Day {day}.
      </p>

      <div className="space-y-6">

        {/* ── 2.1 Room Requirement & 2.2 Guest Details (Clean Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 2.1 Room Requirement */}
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
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
              placeholder="e.g. 25"
            />
          </div>

          {/* 2.2 Guest Details */}
          <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
              <Users size={15} className="text-[#C5A85C]" />
              2.2 Total Guest Count
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={guestCount}
              onChange={e => setGuestCount(Math.max(1, Number(e.target.value) || 1))}
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
              placeholder="e.g. 200"
            />
          </div>

        </div>

        {/* ── 2.3 Food Preference & 2.4 Menu Selection ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0EDE9] pb-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2 mb-2">
                <UtensilsCrossed size={15} className="text-[#C5A85C]" />
                2.3 Food Preference
              </label>
              <div className="flex gap-2">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFoodPreference(opt.value)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200',
                      foodPreference === opt.value
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

            {/* 2.4 View Menu Button */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">2.4 Menu Selection</p>
              <Button
                type="button"
                variant="gold"
                onClick={() => setIsMenuPopupOpen(true)}
                className="flex items-center gap-2 shadow-xs"
              >
                <UtensilsCrossed size={14} /> View Menu
              </Button>
            </div>
          </div>

          {/* Menu Customization Note */}
          <div className="rounded-xl border border-[#E8D9A8] bg-[#FDFAF3] px-4 py-3 flex items-start gap-3">
            <Info size={16} className="text-[#C5A85C] shrink-0 mt-0.5" />
            <p className="text-xs text-[#907030] leading-relaxed">
              <strong>Note:</strong> Please feel free to amend or alter the menus as per your requirements. Don&apos;t worry about High Tea—it can always be added later.
            </p>
          </div>
        </div>

        {/* ── 2.5 Lunch Function & 2.6 Dinner Function ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 2.5 Lunch Function */}
          <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
              <Calendar size={15} className="text-[#C5A85C]" />
              2.5 Lunch Function
            </label>
            <select
              value={lunchFunction}
              onChange={e => setLunchFunction(e.target.value)}
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
            >
              {LUNCH_FUNCTIONS.map(fn => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
          </div>

          {/* 2.6 Dinner Function */}
          <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
              <Calendar size={15} className="text-[#C5A85C]" />
              2.6 Dinner Function
            </label>
            <select
              value={dinnerFunction}
              onChange={e => setDinnerFunction(e.target.value)}
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
            >
              {DINNER_FUNCTIONS.map(fn => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* ── Popup Menu Modal ── */}
      <AnimatePresence>
        {isMenuPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D8] flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-[#C5A85C]" />
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">
                    Mannat Events Menu — <span className="capitalize text-[#C5A85C]">{foodPreference}</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuPopupOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E2D8] text-[#737373] hover:text-[#1A1A1A] hover:border-[#C5A85C] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Customization Note inside Popup */}
                <div className="rounded-xl border border-[#E8D9A8] bg-[#FDFAF3] px-4 py-3 flex items-start gap-3 text-xs text-[#907030]">
                  <Info size={16} className="shrink-0 text-[#C5A85C] mt-0.5" />
                  <p>
                    Please feel free to amend or alter the menus as per your requirements. Don&apos;t worry about High Tea—it can always be added later.
                  </p>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeMenu.map(cat => (
                    <div key={cat.category} className="rounded-2xl border border-[#E8E2D8] bg-[#FDFCFA] p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A] border-b border-[#F0EDE9] pb-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.category}</span>
                      </div>
                      <ul className="space-y-1 text-xs text-[#737373]">
                        {cat.items.map(item => (
                          <li key={item} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#F0EDE9] bg-[#FDFCFA] flex justify-end">
                <Button size="md" variant="gold" onClick={() => setIsMenuPopupOpen(false)}>
                  Close &amp; Continue
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleSubmit}>
          {day < totalDays ? `Next: Day ${day + 1}` : 'Next Step: Decoration'}
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">
            {day < totalDays ? `Day ${day + 1} →` : 'Decoration →'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
