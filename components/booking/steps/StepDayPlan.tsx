'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bed, Leaf, Flame, Users, UtensilsCrossed } from 'lucide-react'
import { DayPlan, MenuItem } from '@/lib/types'
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

// 4 Selectable Menu Categories/Packages
const MENU_PACKAGES = [
  { id: 'silver',   name: 'Silver Banquet Menu' },
  { id: 'gold',     name: 'Gold Royal Feast Menu' },
  { id: 'diamond',  name: 'Diamond Grand Buffet Menu' },
  { id: 'imperial', name: 'Imperial Taj Special Menu' },
]

// Compact toggle pill for Veg/Non-Veg
function TogglePill({
  options, value, onChange,
}: {
  options: { value: string; label: string; icon?: React.ReactNode }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-1.5 p-1 rounded-xl bg-[#F5F0E8] border border-[#E8E2D8] w-fit">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            value === opt.value
              ? 'bg-white shadow-sm text-[#1A1A1A] border border-[#E8E2D8]'
              : 'text-[#737373] hover:text-[#1A1A1A]'
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// Section card wrapper
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E8E2D8] bg-white overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#F0EDE9] bg-[#FDFCFA]">
        <span className="text-[#C5A85C]">{icon}</span>
        <span className="text-xs font-bold tracking-widest uppercase text-[#737373]">{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

export function StepDayPlan({
  day, totalDays, plan, onNext, onPrev,
}: Props) {
  const [rooms,        setRooms]        = useState<number>(plan.rooms ?? 1)
  
  const [lunchType,    setLunchType]    = useState<'veg' | 'non-veg'>(plan.lunch.type)
  const [lunchMenu,    setLunchMenu]    = useState<string>(plan.lunch.menu_item_names?.[0] ?? MENU_PACKAGES[0].name)
  const [lunchGuests,  setLunchGuests]  = useState<number>(plan.lunch.guest_count ?? 50)
  
  const [dinnerType,   setDinnerType]   = useState<'veg' | 'non-veg'>(plan.dinner.type)
  const [dinnerMenu,   setDinnerMenu]   = useState<string>(plan.dinner.menu_item_names?.[0] ?? MENU_PACKAGES[1].name)
  const [dinnerGuests, setDinnerGuests] = useState<number>(plan.dinner.guest_count ?? 50)

  function handleSubmit() {
    onNext({
      day,
      rooms,
      lunch:  { type: lunchType,  menu_item_ids: [], menu_item_names: [lunchMenu],  guest_count: lunchGuests },
      dinner: { type: dinnerType, menu_item_ids: [], menu_item_names: [dinnerMenu], guest_count: dinnerGuests },
    })
  }

  const mealTypeOptions = [
    { value: 'veg',     label: 'Vegetarian',    icon: <Leaf  size={13} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Vegetarian', icon: <Flame size={13} className="text-red-500" /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Day {day} of {totalDays}
        </span>
        <span className="text-xs text-[#A8A8A8]">🌅 Breakfast always included</span>
      </div>

      <h2 className="text-headline mb-1">Day {day} Plan</h2>
      <p className="text-body text-[#737373] mb-8">
        Configure rooms, lunch, and dinner preferences for this day.
      </p>

      <div className="space-y-4">

        {/* ── Rooms ── */}
        <Section title="Rooms" icon={<Bed size={16} />}>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={999}
              value={rooms}
              onChange={e => setRooms(Math.max(1, Number(e.target.value) || 1))}
              className="w-28 border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
            />
            <span className="text-xs font-medium text-[#737373]">Rooms required</span>
          </div>
        </Section>

        {/* ── Lunch ── */}
        <Section title="Lunch" icon={<Leaf size={16} />}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-6 items-start">
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">Meal Type</p>
                <TogglePill options={mealTypeOptions} value={lunchType} onChange={v => setLunchType(v as 'veg' | 'non-veg')} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} /> Guest Count
                </p>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={lunchGuests}
                  onChange={e => setLunchGuests(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28 border border-[#E8E2D8] rounded-xl px-4 py-2 text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1">
                <UtensilsCrossed size={12} /> Select Lunch Menu Category
              </p>
              <select
                value={lunchMenu}
                onChange={e => setLunchMenu(e.target.value)}
                className="w-full max-w-md border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
              >
                {MENU_PACKAGES.map(pkg => (
                  <option key={pkg.id} value={pkg.name}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ── Dinner ── */}
        <Section title="Dinner" icon={<Flame size={16} />}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-6 items-start">
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">Meal Type</p>
                <TogglePill options={mealTypeOptions} value={dinnerType} onChange={v => setDinnerType(v as 'veg' | 'non-veg')} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} /> Guest Count
                </p>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={dinnerGuests}
                  onChange={e => setDinnerGuests(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28 border border-[#E8E2D8] rounded-xl px-4 py-2 text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1">
                <UtensilsCrossed size={12} /> Select Dinner Menu Category
              </p>
              <select
                value={dinnerMenu}
                onChange={e => setDinnerMenu(e.target.value)}
                className="w-full max-w-md border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C] bg-white shadow-xs cursor-pointer"
              >
                {MENU_PACKAGES.map(pkg => (
                  <option key={pkg.id} value={pkg.name}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleSubmit}>
          {day < totalDays ? `Next: Day ${day + 1}` : 'Next Step'}
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleSubmit} className="flex-1">
            {day < totalDays ? `Day ${day + 1} →` : 'Next Step'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
