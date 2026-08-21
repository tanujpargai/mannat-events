'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { DayPlan } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface Props {
  day: number
  plan: DayPlan
  onNext: (data: { lunchFunction: string; dinnerFunction: string }) => void
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

export function StepDinnerFunction({ day, plan, onNext, onPrev }: Props) {
  const [lunchFunction, setLunchFunction] = useState<string>(plan.lunch_function ?? LUNCH_FUNCTIONS[0])
  const [dinnerFunction, setDinnerFunction] = useState<string>(plan.dinner_function ?? DINNER_FUNCTIONS[0])

  function handleSubmit() {
    onNext({ lunchFunction, dinnerFunction })
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
          Step 4: Dinner &amp; Lunch Functions
        </span>
      </div>

      <h2 className="text-headline mb-1">Event Functions</h2>
      <p className="text-body text-[#737373] mb-8">
        Specify the ceremonies or functions scheduled for Day {day}&apos;s Lunch and Dinner.
      </p>

      <div className="space-y-6">
        {/* Lunch Function Card */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Calendar size={15} className="text-[#C5A85C]" />
            Lunch Function
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

        {/* Dinner Function Card */}
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#737373] flex items-center gap-2">
            <Calendar size={15} className="text-[#C5A85C]" />
            Dinner Function
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

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleSubmit}>Next Step: Decor</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">Decor →</Button>
        </div>
      </div>
    </motion.div>
  )
}
