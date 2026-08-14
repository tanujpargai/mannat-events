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
  
  // 2.2 Guest Details
  const [guestCount, setGuestCount] = useState<number>(plan.guest_count ?? 50)
  
  // Separate Food Preferences for Lunch & Dinner
  const [lunchFoodPref, setLunchFoodPref] = useState<FoodPreference>(plan.food_preference ?? 'veg')
  const [dinnerFoodPref, setDinnerFoodPref] = useState<FoodPreference>(plan.food_preference ?? 'veg')
  
  // Separate Menu Selections for Lunch & Dinner
  const [lunchMenuPackage, setLunchMenuPackage] = useState<string>(plan.lunch.menu_item_names?.[0] ?? MENU_PACKAGES[0].name)
  const [dinnerMenuPackage, setDinnerMenuPackage] = useState<string>(plan.dinner.menu_item_names?.[0] ?? MENU_PACKAGES[1].name)
  
  // View Menu Popup State
  const [popupConfig, setPopupConfig] = useState<{ type: 'lunch' | 'dinner'; pref: FoodPreference; pkg: string } | null>(null)
  
  // Lunch Function & Dinner Function
  const [lunchFunction, setLunchFunction] = useState<string>(plan.lunch_function ?? 'Welcome Lunch')
  const [dinnerFunction, setDinnerFunction] = useState<string>(plan.dinner_function ?? 'Welcome Dinner')

  function handleSubmit() {
    onNext({
      day,
      rooms,
      guest_count: guestCount,
      food_preference: lunchFoodPref,
      lunch_function: lunchFunction,
      dinner_function: dinnerFunction,
      lunch:  { type: lunchFoodPref === 'non-veg' ? 'non-veg' : 'veg', menu_item_ids: [], menu_item_names: [lunchMenuPackage], guest_count: guestCount },
      dinner: { type: dinnerFoodPref === 'non-veg' ? 'non-veg' : 'veg', menu_item_ids: [], menu_item_names: [dinnerMenuPackage], guest_count: guestCount },
    })
  }

  const foodPrefOptions: { value: FoodPreference; label: string; icon: React.ReactNode }[] = [
    { value: 'veg',     label: 'Veg',     icon: <Leaf size={13} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Veg', icon: <Flame size={13} className="text-red-500" /> },
    { value: 'mixed',   label: 'Mixed',   icon: <Sparkles size={13} className="text-[#C5A85C]" /> },
  ]

  const activePopupItems = popupConfig ? (MOCK_MENU[popupConfig.pref] || MOCK_MENU.veg) : MOCK_MENU.veg

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
        Specify your rooms, guests, and separate food &amp; menu configurations for Lunch and Dinner.
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

        {/* ── 2.3 LUNCH CONFIGURATION (Function + Food Pref + Menu Package + View Menu) ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
            <Leaf size={16} className="text-green-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">2.3 Lunch Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Lunch Function */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Calendar size={13} className="text-[#C5A85C]" /> Lunch Function
              </label>
              <select
                value={lunchFunction}
                onChange={e => setLunchFunction(e.target.value)}
                className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white cursor-pointer shadow-xs"
              >
                {LUNCH_FUNCTIONS.map(fn => (
                  <option key={fn} value={fn}>{fn}</option>
                ))}
              </select>
            </div>

            {/* Lunch Food Preference */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Lunch Food Preference
              </label>
              <div className="flex gap-2">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLunchFoodPref(opt.value)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200',
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

          {/* Lunch Menu Category & View Menu Button */}
          <div className="pt-2 border-t border-[#F0EDE9]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-2">
              Lunch Menu Category &amp; Details
            </label>
            <div className="flex items-center gap-2">
              <select
                value={lunchMenuPackage}
                onChange={e => setLunchMenuPackage(e.target.value)}
                className="flex-1 border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white cursor-pointer shadow-xs"
              >
                {MENU_PACKAGES.map(pkg => (
                  <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                ))}
              </select>

              <Button
                type="button"
                variant="gold"
                size="md"
                onClick={() => setPopupConfig({ type: 'lunch', pref: lunchFoodPref, pkg: lunchMenuPackage })}
                className="flex items-center gap-1.5 shrink-0 shadow-xs text-xs"
              >
                <UtensilsCrossed size={13} /> View Lunch Menu
              </Button>
            </div>
          </div>
        </div>

        {/* ── 2.4 DINNER CONFIGURATION (Function + Food Pref + Menu Package + View Menu) ── */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0EDE9] pb-3">
            <Flame size={16} className="text-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">2.4 Dinner Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dinner Function */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <Calendar size={13} className="text-[#C5A85C]" /> Dinner Function
              </label>
              <select
                value={dinnerFunction}
                onChange={e => setDinnerFunction(e.target.value)}
                className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white cursor-pointer shadow-xs"
              >
                {DINNER_FUNCTIONS.map(fn => (
                  <option key={fn} value={fn}>{fn}</option>
                ))}
              </select>
            </div>

            {/* Dinner Food Preference */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] flex items-center gap-1.5 mb-2">
                <UtensilsCrossed size={13} className="text-[#C5A85C]" /> Dinner Food Preference
              </label>
              <div className="flex gap-2">
                {foodPrefOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDinnerFoodPref(opt.value)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200',
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

          {/* Dinner Menu Category & View Menu Button */}
          <div className="pt-2 border-t border-[#F0EDE9]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-2">
              Dinner Menu Category &amp; Details
            </label>
            <div className="flex items-center gap-2">
              <select
                value={dinnerMenuPackage}
                onChange={e => setDinnerMenuPackage(e.target.value)}
                className="flex-1 border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white cursor-pointer shadow-xs"
              >
                {MENU_PACKAGES.map(pkg => (
                  <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                ))}
              </select>

              <Button
                type="button"
                variant="gold"
                size="md"
                onClick={() => setPopupConfig({ type: 'dinner', pref: dinnerFoodPref, pkg: dinnerMenuPackage })}
                className="flex items-center gap-1.5 shrink-0 shadow-xs text-xs"
              >
                <UtensilsCrossed size={13} /> View Dinner Menu
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Popup Menu Modal ── */}
      <AnimatePresence>
        {popupConfig !== null && (
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
                    {popupConfig.pkg} — <span className="capitalize text-[#C5A85C]">{popupConfig.type} ({popupConfig.pref})</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPopupConfig(null)}
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
                  {activePopupItems.map(cat => (
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
                <Button size="md" variant="gold" onClick={() => setPopupConfig(null)}>
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
