'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bed, Leaf, Flame, Users, Check, ChevronDown } from 'lucide-react'
import { DayPlan, MenuItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  day: number
  totalDays: number
  plan: DayPlan
  vegMenuItems:    MenuItem[]
  nonVegMenuItems: MenuItem[]
  onNext: (plan: DayPlan) => void
  onPrev: () => void
}

// ── Category grouping (same logic as StepDayMenuSelect) ──
const STOP_WORDS = new Set([
  'stuffed','spiced','slow','fresh','fried','roasted','tandoor','tandoori',
  'grilled','baked','creamy','royal','shahi','aromatic','plump','tender',
  'cooked','minced','velvety','fragrant','saffron','layered','coastal',
  'braised','kashmiri','whole',
])
function getCategory(name: string): string {
  for (const word of name.split(/\s+/)) {
    const lower = word.toLowerCase().replace(/[^a-z]/g, '')
    if (lower.length > 2 && !STOP_WORDS.has(lower))
      return word.charAt(0).toUpperCase() + word.slice(1)
  }
  return name.split(/\s+/)[0]
}
function groupByCategory(items: MenuItem[]) {
  const map = new Map<string, MenuItem[]>()
  for (const item of items) {
    const cat = getCategory(item.name)
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(item)
  }
  return [...map.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => a.category.localeCompare(b.category))
}

// ── Compact toggle pill ──
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

// ── Category chip grid ──
function CategoryChips({
  items, selected, onChange,
}: {
  items: MenuItem[]
  selected: Set<string>
  onChange: (next: Set<string>) => void
}) {
  const groups = groupByCategory(items)
  if (groups.length === 0) {
    return (
      <p className="text-xs text-[#A8A8A8] italic">
        No menu items available yet — you can confirm your selection later.
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {groups.map(({ category, items: gItems }) => {
        const isSel = selected.has(category)
        return (
          <button
            key={category}
            type="button"
            onClick={() => {
              const next = new Set(selected)
              isSel ? next.delete(category) : next.add(category)
              onChange(next)
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
              isSel
                ? 'bg-[#C5A85C] border-[#C5A85C] text-white shadow-sm'
                : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C] hover:text-[#1A1A1A]'
            )}
          >
            {isSel && <Check size={11} strokeWidth={2.5} />}
            {category}
            {gItems.length > 1 && (
              <span className={cn('text-[10px]', isSel ? 'text-white/70' : 'text-[#A8A8A8]')}>
                ×{gItems.length}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Section card wrapper ──
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

// ── Guest count compact input ──
function GuestInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const presets = [10, 25, 50, 100, 250, 500]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-8 h-8 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C] transition-all text-lg leading-none"
        >−</button>
        <input
          type="number"
          min={1}
          max={9999}
          value={value}
          onChange={e => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 text-center border border-[#E8E2D8] rounded-xl px-2 py-1.5 text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C]"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C] transition-all text-lg leading-none"
        >+</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
              value === p
                ? 'bg-[#C5A85C] border-[#C5A85C] text-white'
                : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
            )}
          >{p}</button>
        ))}
      </div>
    </div>
  )
}

// ── Main component ──
export function StepDayPlan({
  day, totalDays, plan, vegMenuItems, nonVegMenuItems, onNext, onPrev,
}: Props) {
  // Derive initial selected categories from stored ids
  function idsToCategories(items: MenuItem[], ids: string[]): Set<string> {
    const all = groupByCategory(items)
    return new Set(
      all.filter(g => g.items.some(i => ids.includes(i.id))).map(g => g.category)
    )
  }

  const [rooms,         setRooms]        = useState(plan.rooms ?? 1)
  const [lunchType,     setLunchType]    = useState<'veg' | 'non-veg'>(plan.lunch.type)
  const [lunchCats,     setLunchCats]    = useState<Set<string>>(() =>
    idsToCategories(plan.lunch.type === 'veg' ? vegMenuItems : nonVegMenuItems, plan.lunch.menu_item_ids))
  const [lunchGuests,   setLunchGuests]  = useState(plan.lunch.guest_count ?? 50)
  const [dinnerType,    setDinnerType]   = useState<'veg' | 'non-veg'>(plan.dinner.type)
  const [dinnerCats,    setDinnerCats]   = useState<Set<string>>(() =>
    idsToCategories(plan.dinner.type === 'veg' ? vegMenuItems : nonVegMenuItems, plan.dinner.menu_item_ids))
  const [dinnerGuests,  setDinnerGuests] = useState(plan.dinner.guest_count ?? 50)

  // When meal type changes, reset category selection
  function handleLunchTypeChange(type: 'veg' | 'non-veg') {
    setLunchType(type)
    setLunchCats(new Set())
  }
  function handleDinnerTypeChange(type: 'veg' | 'non-veg') {
    setDinnerType(type)
    setDinnerCats(new Set())
  }

  function catToIds(items: MenuItem[], cats: Set<string>): { ids: string[]; names: string[] } {
    const groups = groupByCategory(items)
    const ids: string[] = []
    const names: string[] = []
    for (const { category, items: gItems } of groups) {
      if (cats.has(category)) {
        for (const item of gItems) { ids.push(item.id); names.push(item.name) }
      }
    }
    return { ids, names }
  }

  function handleSubmit() {
    const lunchItems = lunchType === 'veg' ? vegMenuItems : nonVegMenuItems
    const dinnerItems = dinnerType === 'veg' ? vegMenuItems : nonVegMenuItems
    const lunch  = catToIds(lunchItems, lunchCats)
    const dinner = catToIds(dinnerItems, dinnerCats)

    onNext({
      day,
      rooms,
      lunch:  { type: lunchType,  menu_item_ids: lunch.ids,  menu_item_names: lunch.names,  guest_count: lunchGuests },
      dinner: { type: dinnerType, menu_item_ids: dinner.ids, menu_item_names: dinner.names, guest_count: dinnerGuests },
    })
  }

  const mealTypeOptions = [
    { value: 'veg',     label: 'Vegetarian',     icon: <Leaf  size={13} className="text-green-600" /> },
    { value: 'non-veg', label: 'Non-Vegetarian',  icon: <Flame size={13} className="text-red-500" /> },
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
        Configure rooms, lunch, and dinner for this day.
      </p>

      <div className="space-y-4">

        {/* ── Rooms ── */}
        <Section title="Rooms" icon={<Bed size={16} />}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-8 h-8 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C] transition-all text-lg leading-none"
              >−</button>
              <input
                type="number" min={1} value={rooms}
                onChange={e => setRooms(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 text-center border border-[#E8E2D8] rounded-xl px-2 py-1.5 text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C5A85C]"
              />
              <button
                type="button"
                onClick={() => setRooms(rooms + 1)}
                className="w-8 h-8 rounded-lg border border-[#E8E2D8] bg-white flex items-center justify-center text-[#737373] hover:border-[#C5A85C] hover:text-[#C5A85C] transition-all text-lg leading-none"
              >+</button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 5, 10, 25, 50].map(p => (
                <button key={p} type="button" onClick={() => setRooms(p)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
                    rooms === p
                      ? 'bg-[#C5A85C] border-[#C5A85C] text-white'
                      : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
                  )}
                >{p}</button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Lunch ── */}
        <Section title="Lunch" icon={<Leaf size={16} />}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-6 items-start">
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">Meal Type</p>
                <TogglePill options={mealTypeOptions} value={lunchType} onChange={v => handleLunchTypeChange(v as 'veg' | 'non-veg')} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} /> Guest Count
                </p>
                <GuestInput value={lunchGuests} onChange={setLunchGuests} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">Dishes</p>
              <CategoryChips
                items={lunchType === 'veg' ? vegMenuItems : nonVegMenuItems}
                selected={lunchCats}
                onChange={setLunchCats}
              />
            </div>
          </div>
        </Section>

        {/* ── Dinner ── */}
        <Section title="Dinner" icon={<Flame size={16} />}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-6 items-start">
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">Meal Type</p>
                <TogglePill options={mealTypeOptions} value={dinnerType} onChange={v => handleDinnerTypeChange(v as 'veg' | 'non-veg')} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Users size={12} /> Guest Count
                </p>
                <GuestInput value={dinnerGuests} onChange={setDinnerGuests} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">Dishes</p>
              <CategoryChips
                items={dinnerType === 'veg' ? vegMenuItems : nonVegMenuItems}
                selected={dinnerCats}
                onChange={setDinnerCats}
              />
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
