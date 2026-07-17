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

const GUEST_PRESETS = [50, 100, 250, 500, 1000]

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

  function setPreset(val: number) {
    if (val === count) return
    setDir(val > count ? 'up' : 'down')
    setCount(val)
    setAnimKey((k) => k + 1)
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

      <h2 className="text-headline mb-3 font-light text-3xl">
        Guest count for {mealLabel.toLowerCase()}?
      </h2>
      <p className="text-body text-[#737373] mb-10">
        Estimate the number of attendees for this meal. Helps our banquet chefs plan portions perfectly.
      </p>

      {/* 3D Stepper Card */}
      <Card3D intensity={6} className="max-w-md mx-auto">
        <div className="rounded-3xl border border-[#E8E2D8] bg-white/80 backdrop-blur-md p-8 md:p-10 shadow-3d flex flex-col items-center gap-8">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#F5EDD6] flex items-center justify-center border border-[#E8D9A8] shadow-sm">
            <Users size={26} className="text-[#C5A85C]" strokeWidth={1.5} />
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => adjust(-50)}
                disabled={count <= 50}
                className={cn(
                  'w-12 h-10 rounded-xl border text-[11px] font-bold transition-all duration-150 active:scale-90',
                  count <= 50
                    ? 'border-[#E8E5E0] text-[#D4CFC9] cursor-not-allowed'
                    : 'border-[#E8D9A8] text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                )}
              >
                −50
              </button>
              <button
                type="button"
                onClick={() => adjust(-10)}
                disabled={count <= 10}
                className={cn(
                  'w-12 h-10 rounded-xl border text-[11px] font-bold transition-all duration-150 active:scale-90',
                  count <= 10
                    ? 'border-[#E8E5E0] text-[#D4CFC9] cursor-not-allowed'
                    : 'border-[#E8D9A8] text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                )}
              >
                −10
              </button>
            </div>

            {/* Huge Number Display */}
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center overflow-hidden relative shadow-inner">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={animKey}
                  initial={{ y: direction === 'up' ? 40 : -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction === 'up' ? -40 : 40, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute text-4xl font-serif font-bold text-[#1A1A1A]"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => adjust(50)}
                disabled={count >= 5000}
                className={cn(
                  'w-12 h-10 rounded-xl border text-[11px] font-bold transition-all duration-150 active:scale-90',
                  count >= 5000
                    ? 'border-[#E8E5E0] text-[#D4CFC9] cursor-not-allowed'
                    : 'border-[#E8D9A8] text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                )}
              >
                +50
              </button>
              <button
                type="button"
                onClick={() => adjust(10)}
                disabled={count >= 5000}
                className={cn(
                  'w-12 h-10 rounded-xl border text-[11px] font-bold transition-all duration-150 active:scale-90',
                  count >= 5000
                    ? 'border-[#E8E5E0] text-[#D4CFC9] cursor-not-allowed'
                    : 'border-[#E8D9A8] text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                )}
              >
                +10
              </button>
            </div>
          </div>

          {/* Presets Row */}
          <div className="w-full space-y-3">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#A8A8A8] uppercase text-center">
              Quick Guest Presets
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {GUEST_PRESETS.map((val) => {
                const isActive = count === val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPreset(val)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 border',
                      isActive
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                        : 'bg-white border-[#E8E5E0] text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                    )}
                  >
                    {val} guests
                  </button>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-[#A8A8A8] text-center border-t border-[#F0EDE9] pt-4 w-full">
            {count} {count === 1 ? 'guest' : 'guests'} planned for {mealLabel.toLowerCase()}.
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
