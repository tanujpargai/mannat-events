'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Minus, Plus } from 'lucide-react'
import { Card3D } from '@/components/ui/Card3D'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  day: number
  meal: 'lunch' | 'dinner'
  currentCount?: number
  onNext: (count: number) => void
  onPrev: () => void
}

export function StepDayGuestCount({ day, meal, currentCount, onNext, onPrev }: Props) {
  const [count, setCount]     = useState(currentCount ?? 50)
  const [direction, setDir]   = useState<'up' | 'down'>('up')
  const [animKey, setAnimKey] = useState(0)
  const mealLabel             = meal === 'lunch' ? 'Lunch' : 'Dinner'

  function adjust(delta: number) {
    setCount((prev) => {
      const next = Math.max(1, Math.min(5000, prev + delta))
      if (next !== prev) {
        setDir(delta > 0 ? 'up' : 'down')
        setAnimKey((k) => k + 1)
      }
      return next
    })
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
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day}
        </span>
        <span className="text-[#D4CFC9]">·</span>
        <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{mealLabel}</span>
      </div>

      <h2 className="text-headline mb-3">
        Guest count for {mealLabel.toLowerCase()}?
      </h2>
      <p className="text-body text-[#737373] mb-12">
        This helps us plan portions and seating perfectly for Day {day}.
      </p>

      {/* 3D Stepper */}
      <Card3D intensity={8} className="max-w-sm mx-auto">
        <div className="rounded-3xl border border-[#E8E2D8] shadow-3d bg-white p-10 flex flex-col items-center gap-8">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#F5EDD6] flex items-center justify-center">
            <Users size={26} className="text-[#C5A85C]" strokeWidth={1.5} />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-2">
              <button onClick={() => adjust(-10)} className={cn(
                'w-12 h-10 rounded-xl border border-[#E8E2D8] text-xs font-semibold text-[#737373]',
                'hover:border-[#C5A85C] hover:text-[#C5A85C] transition-all active:scale-90'
              )}>−10</button>
              <button onClick={() => adjust(-1)} className={cn(
                'w-12 h-10 rounded-xl border border-[#E8E2D8] flex items-center justify-center',
                'hover:border-[#C5A85C] transition-all active:scale-90'
              )}>
                <Minus size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Number display */}
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={animKey}
                  initial={{ y: direction === 'up' ? 40 : -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction === 'up' ? -40 : 40, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute text-4xl font-bold text-[#1A1A1A] font-serif"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => adjust(10)} className={cn(
                'w-12 h-10 rounded-xl border border-[#E8E2D8] text-xs font-semibold text-[#737373]',
                'hover:border-[#C5A85C] hover:text-[#C5A85C] transition-all active:scale-90'
              )}>+10</button>
              <button onClick={() => adjust(1)} className={cn(
                'w-12 h-10 rounded-xl border border-[#E8E2D8] flex items-center justify-center',
                'hover:border-[#C5A85C] transition-all active:scale-90'
              )}>
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <p className="text-xs text-[#A8A8A8] text-center">
            {count} {count === 1 ? 'guest' : 'guests'} for {mealLabel.toLowerCase()}
          </p>
        </div>
      </Card3D>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={() => onNext(count)}>Next Step</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={() => onNext(count)} className="flex-1">Next Step</Button>
        </div>
      </div>
    </motion.div>
  )
}
