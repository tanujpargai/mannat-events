'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// ── Mock menu categories with items ──
const MOCK_MENU: Record<'veg' | 'non-veg', { category: string; emoji: string; items: string[] }[]> = {
  veg: [
    {
      category: 'Starters',
      emoji: '🥗',
      items: [
        'Paneer Tikka',
        'Veg Spring Rolls',
        'Dahi Puri Chaat',
        'Stuffed Mushrooms',
        'Corn Palak Tikki',
        'Hara Bhara Kebab',
      ],
    },
    {
      category: 'Main Course',
      emoji: '🍛',
      items: [
        'Paneer Butter Masala',
        'Dal Makhani',
        'Shahi Paneer',
        'Palak Paneer',
        'Aloo Gobi',
        'Mix Veg Sabzi',
        'Veg Biryani',
        'Chole Masala',
      ],
    },
    {
      category: 'Breads & Rice',
      emoji: '🍚',
      items: [
        'Butter Naan',
        'Tandoori Roti',
        'Laccha Paratha',
        'Puri',
        'Steamed Rice',
        'Jeera Rice',
        'Pulao',
      ],
    },
    {
      category: 'Desserts',
      emoji: '🍮',
      items: [
        'Gulab Jamun',
        'Rasgulla',
        'Kheer',
        'Gajar Halwa',
        'Moong Dal Halwa',
        'Ice Cream',
        'Jalebi',
        'Barfi',
      ],
    },
  ],
  'non-veg': [
    {
      category: 'Starters',
      emoji: '🍗',
      items: [
        'Chicken Tikka',
        'Seekh Kebab',
        'Fish Amritsari',
        'Mutton Shammi Kebab',
        'Tandoori Prawns',
        'Chicken Malai Kebab',
      ],
    },
    {
      category: 'Main Course',
      emoji: '🍖',
      items: [
        'Butter Chicken',
        'Mutton Rogan Josh',
        'Chicken Biryani',
        'Fish Curry',
        'Egg Masala',
        'Chicken Korma',
        'Mutton Keema Matar',
      ],
    },
    {
      category: 'Breads & Rice',
      emoji: '🍚',
      items: [
        'Butter Naan',
        'Tandoori Roti',
        'Laccha Paratha',
        'Mutton Biryani Rice',
        'Pulao',
        'Steamed Rice',
      ],
    },
    {
      category: 'Desserts',
      emoji: '🍮',
      items: [
        'Gulab Jamun',
        'Rasgulla',
        'Kheer',
        'Ice Cream',
        'Halwa',
        'Barfi',
      ],
    },
  ],
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

// ── Menu Category Dropdown accordion ──
function MenuCategoryDropdown({
  mealType,
  selectedItems,
  onChange,
}: {
  mealType: 'veg' | 'non-veg'
  selectedItems: Set<string>
  onChange: (next: Set<string>) => void
}) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const categories = MOCK_MENU[mealType]

  function toggleItem(item: string) {
    const next = new Set(selectedItems)
    next.has(item) ? next.delete(item) : next.add(item)
    onChange(next)
  }

  function toggleCategory(cat: { category: string; items: string[] }) {
    const allSelected = cat.items.every(i => selectedItems.has(i))
    const next = new Set(selectedItems)
    if (allSelected) {
      cat.items.forEach(i => next.delete(i))
    } else {
      cat.items.forEach(i => next.add(i))
    }
    onChange(next)
  }

  const totalSelected = selectedItems.size

  return (
    <div className="space-y-2">
      {/* Selected summary badge */}
      {totalSelected > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[...selectedItems].slice(0, 5).map(item => (
            <span
              key={item}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#C5A85C] text-white"
            >
              {item}
              <button
                type="button"
                onClick={() => toggleItem(item)}
                className="ml-0.5 hover:opacity-70 transition-opacity"
              >
                ×
              </button>
            </span>
          ))}
          {totalSelected > 5 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F5EDD6] border border-[#E8D9A8] text-[#A08040]">
              +{totalSelected - 5} more
            </span>
          )}
        </div>
      )}

      {/* Category dropdowns */}
      {categories.map(cat => {
        const isOpen = openCategory === cat.category
        const selectedCount = cat.items.filter(i => selectedItems.has(i)).length
        const allSelected = selectedCount === cat.items.length

        return (
          <div
            key={cat.category}
            className="rounded-xl border border-[#E8E2D8] overflow-hidden"
          >
            {/* Category header — clickable to expand */}
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : cat.category)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#FDFCFA] hover:bg-[#F5F0E8] transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">{cat.category}</span>
                {selectedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A85C] text-white">
                    {selectedCount}/{cat.items.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Select all toggle */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleCategory(cat) }}
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border transition-all',
                    allSelected
                      ? 'bg-[#C5A85C] border-[#C5A85C] text-white'
                      : 'border-[#E8E2D8] text-[#A8A8A8] hover:border-[#C5A85C] hover:text-[#C5A85C]'
                  )}
                >
                  {allSelected ? '✓ All' : 'All'}
                </button>
                <ChevronDown
                  size={16}
                  className={cn('text-[#A8A8A8] transition-transform duration-300', isOpen && 'rotate-180')}
                />
              </div>
            </button>

            {/* Item list */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 bg-white border-t border-[#F0EDE9] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map(item => {
                      const isSel = selectedItems.has(item)
                      return (
                        <label
                          key={item}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150',
                            isSel
                              ? 'bg-[#FDF8EE] border-[#C5A85C]'
                              : 'bg-[#FAFAFA] border-[#F0EDE9] hover:border-[#C5A85C]/50'
                          )}
                        >
                          {/* Custom checkbox */}
                          <div className={cn(
                            'w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all',
                            isSel ? 'bg-[#C5A85C] border-[#C5A85C]' : 'border-[#D8D3CB]'
                          )}>
                            {isSel && <Check size={9} strokeWidth={3} className="text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSel}
                            onChange={() => toggleItem(item)}
                          />
                          <span className="text-sm text-[#1A1A1A] font-medium">{item}</span>
                        </label>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
  const [rooms,         setRooms]        = useState(plan.rooms ?? 1)
  const [lunchType,     setLunchType]    = useState<'veg' | 'non-veg'>(plan.lunch.type)
  const [lunchItems,    setLunchItems]   = useState<Set<string>>(new Set(plan.lunch.menu_item_names ?? []))
  const [lunchGuests,   setLunchGuests]  = useState(plan.lunch.guest_count ?? 50)
  const [dinnerType,    setDinnerType]   = useState<'veg' | 'non-veg'>(plan.dinner.type)
  const [dinnerItems,   setDinnerItems]  = useState<Set<string>>(new Set(plan.dinner.menu_item_names ?? []))
  const [dinnerGuests,  setDinnerGuests] = useState(plan.dinner.guest_count ?? 50)

  function handleLunchTypeChange(type: 'veg' | 'non-veg') {
    setLunchType(type)
    setLunchItems(new Set())
  }
  function handleDinnerTypeChange(type: 'veg' | 'non-veg') {
    setDinnerType(type)
    setDinnerItems(new Set())
  }

  function handleSubmit() {
    const lunchNames  = [...lunchItems]
    const dinnerNames = [...dinnerItems]
    onNext({
      day,
      rooms,
      lunch:  { type: lunchType,  menu_item_ids: [],  menu_item_names: lunchNames,  guest_count: lunchGuests },
      dinner: { type: dinnerType, menu_item_ids: [],  menu_item_names: dinnerNames, guest_count: dinnerGuests },
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
              <p className="text-xs font-semibold text-[#737373] mb-3 uppercase tracking-wider">
                Dishes
                {lunchItems.size > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-[#C5A85C] text-white normal-case tracking-normal">
                    {lunchItems.size} selected
                  </span>
                )}
              </p>
              <MenuCategoryDropdown
                mealType={lunchType}
                selectedItems={lunchItems}
                onChange={setLunchItems}
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
              <p className="text-xs font-semibold text-[#737373] mb-3 uppercase tracking-wider">
                Dishes
                {dinnerItems.size > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-[#C5A85C] text-white normal-case tracking-normal">
                    {dinnerItems.size} selected
                  </span>
                )}
              </p>
              <MenuCategoryDropdown
                mealType={dinnerType}
                selectedItems={dinnerItems}
                onChange={setDinnerItems}
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
