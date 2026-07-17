'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { WeddingFunction, FunctionAssignment } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  duration: number
  functions: WeddingFunction[]
  assignments: FunctionAssignment[]
  onNext: (assignments: FunctionAssignment[]) => void
  onPrev: () => void
}

const FUNCTION_ICONS: Record<string, string> = {
  'Mehendi':           '🌿',
  'Haldi':             '🌼',
  'Sangeet':           '🎵',
  'Wedding Ceremony':  '💍',
  'Mandap Decoration': '🏵️',
  'Baraat':            '🐘',
  'Hath Teela':        '🙏',
}

export function StepWeddingFunctions({
  duration, functions, assignments, onNext, onPrev,
}: Props) {
  // Guard: functions may be empty while DB tables are being set up
  const safeFunctions = Array.isArray(functions) ? functions : []

  // Map: function_id → day number (0 = unassigned)
  const [map, setMap] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    assignments.forEach((a) => { m[a.function_id] = a.day })
    return m
  })


  function toggle(fn: WeddingFunction, day: number) {
    setMap((prev) => {
      const current = prev[fn.id]
      return {
        ...prev,
        [fn.id]: current === day ? 0 : day, // 0 = unassigned
      }
    })
  }

  function handleNext() {
    const result: FunctionAssignment[] = safeFunctions
      .filter((fn) => (map[fn.id] ?? 0) > 0)
      .map((fn) => ({
        function_id:   fn.id,
        function_name: fn.name,
        day:           map[fn.id],
      }))
    onNext(result)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <h2 className="text-headline mb-3">Wedding Function Planner</h2>
      <p className="text-body text-[#737373] mb-8">
        Assign each ceremony to a day of your stay. You can skip any that don&apos;t apply.
      </p>

      {safeFunctions.length === 0 && (
        <div className="py-10 text-center rounded-2xl border border-dashed border-[#E8E2D8]">
          <p className="text-sm text-[#A8A8A8]">Wedding functions will load once the database is set up. Continue to the next step.</p>
        </div>
      )}
      <div className="space-y-3">
        {safeFunctions.map((fn) => {
          const assignedDay = map[fn.id] ?? 0
          const icon        = FUNCTION_ICONS[fn.name] ?? '✨'

          return (
            <motion.div
              key={fn.id}
              layout
              className={cn(
                'rounded-2xl border-2 bg-white px-5 py-4 transition-all duration-300',
                assignedDay > 0
                  ? 'border-[#C5A85C] shadow-3d-selected'
                  : 'border-[#E8E2D8] shadow-3d'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Function name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">{fn.name}</p>
                    {assignedDay > 0 && (
                      <p className="text-xs text-[#C5A85C] font-medium mt-0.5">
                        Scheduled on Day {assignedDay}
                      </p>
                    )}
                  </div>
                </div>

                {/* Day pills */}
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: duration }, (_, i) => i + 1).map((day) => {
                    const isActive = assignedDay === day
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggle(fn, day)}
                        className={cn(
                          'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-200',
                          'active:scale-95',
                          isActive
                            ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                            : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                        )}
                      >
                        <CalendarDays size={11} />
                        Day {day}
                      </button>
                    )
                  })}

                  {/* Unassign pill */}
                  {assignedDay > 0 && (
                    <button
                      type="button"
                      onClick={() => toggle(fn, assignedDay)}
                      className="px-3 py-1.5 rounded-full border-2 border-dashed border-[#E8E2D8] text-xs text-[#A8A8A8] hover:border-red-300 hover:text-red-400 transition-all duration-200 active:scale-95"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      {(() => {
        const assigned = safeFunctions.filter((fn) => (map[fn.id] ?? 0) > 0)
        return assigned.length > 0 ? (
          <div className="mt-6 px-5 py-4 rounded-2xl bg-[#F5EDD6] border border-[#E8D9A8]">
            <p className="text-xs font-semibold text-[#A08040] uppercase tracking-wider mb-2">Assigned Functions</p>
            <div className="flex flex-wrap gap-2">
              {assigned.map((fn) => (
                <span key={fn.id} className="px-3 py-1 rounded-full bg-white border border-[#E8D9A8] text-xs font-medium text-[#1A1A1A]">
                  {FUNCTION_ICONS[fn.name] ?? '✨'} {fn.name} → Day {map[fn.id]}
                </span>
              ))}
            </div>
          </div>
        ) : null
      })()}

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
