'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UtensilsCrossed, X, Info } from 'lucide-react'
import { DayPlan } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  day: number
  plan: DayPlan
  onNext: (data: { lunchMenuPackage: string; dinnerMenuPackage: string }) => void
  onPrev: () => void
}

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
}

export function StepMenuPackage({ day, plan, onNext, onPrev }: Props) {
  const [lunchMenuPackage, setLunchMenuPackage] = useState<string>(plan.lunch.menu_item_names?.[0] ?? MENU_PACKAGES[0].name)
  const [dinnerMenuPackage, setDinnerMenuPackage] = useState<string>(plan.dinner.menu_item_names?.[0] ?? MENU_PACKAGES[1].name)
  const [popupMenuType, setPopupMenuType] = useState<'lunch' | 'dinner' | null>(null)

  const activePref = popupMenuType === 'lunch' ? plan.lunch.type : plan.dinner.type
  const activeMenu = MOCK_MENU[activePref as 'veg' | 'non-veg'] || MOCK_MENU.veg

  function handleSubmit() {
    onNext({ lunchMenuPackage, dinnerMenuPackage })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 3: Menu Package Selection
        </span>
      </div>

      <h2 className="text-headline mb-1">Cuisine Menu Packages</h2>
      <p className="text-body text-[#737373] mb-8">
        Select the dining package tier for Day {day}&apos;s Lunch and Dinner.
      </p>

      <div className="space-y-6">
        {/* Lunch Menu Card */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-1">
            Lunch Menu Package
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
              onClick={() => setPopupMenuType('lunch')}
              className="flex items-center gap-1.5 shrink-0 shadow-xs text-xs"
            >
              <UtensilsCrossed size={13} /> View Menu
            </Button>
          </div>
        </div>

        {/* Dinner Menu Card */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-1">
            Dinner Menu Package
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
              onClick={() => setPopupMenuType('dinner')}
              className="flex items-center gap-1.5 shrink-0 shadow-xs text-xs"
            >
              <UtensilsCrossed size={13} /> View Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Popup Menu Modal */}
      <AnimatePresence>
        {popupMenuType !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D8] flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-[#C5A85C]" />
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">
                    {popupMenuType === 'lunch' ? lunchMenuPackage : dinnerMenuPackage} — <span className="capitalize text-[#C5A85C]">{popupMenuType === 'lunch' ? 'Lunch' : 'Dinner'} Menu</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPopupMenuType(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E2D8] text-[#737373] hover:text-[#1A1A1A] hover:border-[#C5A85C] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="rounded-xl border border-[#E8D9A8] bg-[#FDFAF3] px-4 py-3 flex items-start gap-3 text-xs text-[#907030]">
                  <Info size={16} className="shrink-0 text-[#C5A85C] mt-0.5" />
                  <p>
                    Please feel free to amend or alter the menus as per your requirements. Don&apos;t worry about High Tea—it can always be added later.
                  </p>
                </div>

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

              <div className="px-6 py-4 border-t border-[#F0EDE9] bg-[#FDFCFA] flex justify-end">
                <Button size="md" variant="gold" onClick={() => setPopupMenuType(null)}>
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
        <Button size="lg" onClick={handleSubmit}>Next Step: Functions</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">Functions →</Button>
        </div>
      </div>
    </motion.div>
  )
}
