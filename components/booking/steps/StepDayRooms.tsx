'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, BedDouble } from 'lucide-react'
import { BookingFormData } from '@/lib/types'
import { Card3D } from '@/components/ui/Card3D'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  day: number
  data: Partial<BookingFormData>
  onNext: (rooms: number) => void
  onPrev: () => void
}

export function StepDayRooms({ day, data, onNext, onPrev }: Props) {
  const initial = data.day_plans?.find((d) => d.day === day)?.rooms ?? 1
  const [rooms, setRooms]     = useState(initial)
  const [direction, setDir]   = useState<'up' | 'down'>('up')
  const [animKey, setAnimKey] = useState(0)

  function adjust(delta: number) {
    setRooms((prev) => {
      const next = Math.max(1, Math.min(100, prev + delta))
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
      {/* Day badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EDD6] border border-[#E8D9A8]">
        <span className="text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day}
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-headline mb-3">
        How many rooms for Day {day}?
      </h2>
      <p className="text-body text-[#737373] mb-12">
        Breakfast is included complimentary with every room.
      </p>

      {/* 3D Stepper Card */}
      <Card3D intensity={8} className="max-w-sm mx-auto">
        <div className={cn(
          'rounded-3xl border border-[#E8E2D8] shadow-3d bg-white p-10',
          'flex flex-col items-center gap-8'
        )}>
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#F5EDD6] flex items-center justify-center">
            <BedDouble size={26} className="text-[#C5A85C]" strokeWidth={1.5} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8">
            {/* Minus */}
            <button
              onClick={() => adjust(-1)}
              disabled={rooms <= 1}
              className={cn(
                'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200',
                'active:scale-90',
                rooms <= 1
                  ? 'border-[#E8E2D8] text-[#D4CFC9] cursor-not-allowed'
                  : 'border-[#E8E2D8] text-[#1A1A1A] hover:border-[#C5A85C] hover:bg-[#FDFCFA] hover:shadow-3d cursor-pointer'
              )}
            >
              <Minus size={20} strokeWidth={2.5} />
            </button>

            {/* Number display */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={animKey}
                  initial={{ y: direction === 'up' ? 40 : -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction === 'up' ? -40 : 40, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute text-5xl font-bold text-[#1A1A1A] font-serif"
                >
                  {rooms}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Plus */}
            <button
              onClick={() => adjust(1)}
              disabled={rooms >= 100}
              className={cn(
                'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200',
                'active:scale-90',
                rooms >= 100
                  ? 'border-[#E8E2D8] text-[#D4CFC9] cursor-not-allowed'
                  : 'border-[#E8E2D8] text-[#1A1A1A] hover:border-[#C5A85C] hover:bg-[#FDFCFA] hover:shadow-3d cursor-pointer'
              )}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>

          <p className="text-xs text-[#A8A8A8] text-center">
            {rooms} {rooms === 1 ? 'room' : 'rooms'} · Breakfast included
          </p>
        </div>
      </Card3D>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={() => onNext(rooms)}>Next Step</Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={() => onNext(rooms)} className="flex-1">Next Step</Button>
        </div>
      </div>
    </motion.div>
  )
}
