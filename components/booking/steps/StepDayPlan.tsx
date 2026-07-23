'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bed, Users, Utensils, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DayPlan, BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

interface Props {
  data: Partial<BookingFormData>
  onUpdate: (plans: DayPlan[]) => void
  onNext: () => void
  onPrev: () => void
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

// ── Simple Number Input ──
function SimpleNumberInput({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  placeholder: string 
}) {
  const displayValue = value > 0 ? value : ''
  const error = value < 1

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={displayValue}
        onChange={e => {
          const raw = e.target.value.replace(/\D/g, '')
          onChange(raw ? parseInt(raw, 10) : 0)
        }}
        className={cn(
          "w-full bg-[#FDFCFA]",
          error && "border-red-300 focus-visible:ring-red-400 bg-red-50/30"
        )}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium ml-1">Required (minimum 1).</span>
      )}
    </div>
  )
}

// ── Section card wrapper ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E8E2D8] bg-white overflow-hidden mb-6">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#F0EDE9] bg-[#FDFCFA]">
        <span className="text-sm font-bold tracking-widest uppercase text-[#C5A85C]">{title}</span>
      </div>
      <div className="px-5 py-4 space-y-6">{children}</div>
    </div>
  )
}

// ── Simple Modal Component ──
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4 md:p-0"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-[#F0EDE9] bg-[#FDFCFA] px-6 py-4">
                <h3 className="text-lg font-bold text-[#1A1A1A]">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-[#A8A8A8] transition-colors hover:bg-[#F5EDD6] hover:text-[#1A1A1A]"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function StepDayPlan({ data, onUpdate, onNext, onPrev }: Props) {
  const [plans, setPlans] = useState<DayPlan[]>(data.day_plans || [])
  const [isMenuModalOpen, setMenuModalOpen] = useState(false)

  const handleNext = () => {
    onUpdate(plans)
    onNext()
  }

  const updatePlan = (day: number, updates: Partial<DayPlan>) => {
    setPlans(prev => prev.map(p => p.day === day ? { ...p, ...updates } : p))
  }

  const foodOptions = [
    { value: 'Veg', label: 'Vegetarian' },
    { value: 'Non-Veg', label: 'Non-Vegetarian' },
    { value: 'Mixed', label: 'Mixed' },
  ]

  const functionOptions = [
    { value: 'mehendi', label: 'Mehendi' },
    { value: 'haldi', label: 'Haldi' },
    { value: 'cocktail', label: 'Cocktail' },
    { value: 'jaimala', label: 'Jaimala / Wedding Ceremony' },
    { value: 'phere', label: 'Phere' },
    { value: 'reception', label: 'Reception' },
    { value: 'other', label: 'Other' },
  ]

  const lunchFunctionOptions = [
    { value: 'welcome_lunch', label: 'Welcome Lunch' },
    ...functionOptions
  ]

  const dinnerFunctionOptions = [
    { value: 'welcome_dinner', label: 'Welcome Dinner' },
    ...functionOptions
  ]

  if (plans.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="pb-28 md:pb-0"
      >
         <div className="mb-6 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
            Step 2
          </span>
        </div>
        <h2 className="text-headline mb-1">Day-wise Planning</h2>
        <p className="text-body text-[#737373] mb-8">
          Please select valid check-in and check-out dates to plan your days.
        </p>
        
        <div className="rounded-2xl border border-dashed border-[#E8E2D8] bg-[#FDFCFA] p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">Invalid or Missing Dates</h3>
          <p className="text-xs text-[#737373] max-w-sm">
            Please go back to Step 1 and select valid dates to see day-wise planning.
          </p>
        </div>

        <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
          <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        </div>
        <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 2
        </span>
      </div>

      <h2 className="text-headline mb-1">Day-wise Planning</h2>
      <p className="text-body text-[#737373] mb-8">
        Plan the rooms, guests, food preferences, and functions for each day.
      </p>
      
      <div className="space-y-8">
        <AnimatePresence>
          {plans.map((plan) => (
            <motion.div
              key={plan.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Section title={`Day ${plan.day}`}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* 1. Number of Rooms */}
                  <div>
                    <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Bed size={14} className="text-[#C5A85C]" /> Number of Rooms
                    </p>
                    <SimpleNumberInput 
                      value={plan.rooms} 
                      onChange={(v) => updatePlan(plan.day, { rooms: v })}
                      placeholder="Enter number of rooms"
                    />
                  </div>

                  {/* 2. Total Guest Count */}
                  <div>
                    <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={14} className="text-[#C5A85C]" /> Total Guest Count
                    </p>
                    <SimpleNumberInput 
                      value={plan.guests ?? plan.lunch?.guest_count ?? 50} 
                      onChange={(v) => updatePlan(plan.day, { guests: v })}
                      placeholder="Enter total guest count"
                    />
                  </div>
                  
                  {/* 3. Food Preference */}
                  <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-end">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Utensils size={14} className="text-[#C5A85C]" /> Food Preference
                      </p>
                      <TogglePill 
                        options={foodOptions} 
                        value={plan.foodPreference ?? 'Veg'} 
                        onChange={(v) => updatePlan(plan.day, { foodPreference: v as any })}
                      />
                    </div>
                    <div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setMenuModalOpen(true)}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Eye size={14} /> View Menu
                      </Button>
                    </div>
                  </div>

                  {/* 4. Lunch Function */}
                  <div>
                    <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">
                      Lunch Function
                    </p>
                    <Select
                      options={lunchFunctionOptions}
                      value={plan.lunchFunction ?? ''}
                      onChange={(e) => updatePlan(plan.day, { lunchFunction: e.target.value })}
                      placeholder="Select a function..."
                    />
                  </div>

                  {/* 5. Dinner Function */}
                  <div>
                    <p className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wider">
                      Dinner Function
                    </p>
                    <Select
                      options={dinnerFunctionOptions}
                      value={plan.dinnerFunction ?? ''}
                      onChange={(e) => updatePlan(plan.day, { dinnerFunction: e.target.value })}
                      placeholder="Select a function..."
                    />
                  </div>
                </div>
              </Section>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal 
        isOpen={isMenuModalOpen} 
        onClose={() => setMenuModalOpen(false)} 
        title="Sample Menu Preview"
      >
        <div className="rounded-xl border border-[#E8D9A8] bg-[#FDFAF3] px-4 py-3 mb-6">
          <p className="text-sm text-[#A08040] font-medium leading-relaxed">
            Please feel free to amend or alter the menus as per your requirements. Don't worry about High Tea—it can always be added later.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-bold text-[#1A1A1A] mb-3 pb-2 border-b border-[#F0EDE9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> Lunch Menu
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#737373]">
              <li>• Welcome Drink</li>
              <li>• 2 Premium Starters</li>
              <li>• 1 Paneer Preparation</li>
              <li>• 1 Seasonal Vegetable</li>
              <li>• Dal Makhani</li>
              <li>• Assorted Breads</li>
              <li>• Rice / Pulao</li>
              <li>• 2 Desserts</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-[#1A1A1A] mb-3 pb-2 border-b border-[#F0EDE9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> Dinner Menu
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#737373]">
              <li>• 2 Welcome Drinks</li>
              <li>• 3 Premium Starters</li>
              <li>• 1 Paneer Preparation</li>
              <li>• 1 Kofta / Speciality</li>
              <li>• Dal Makhani</li>
              <li>• Assorted Breads</li>
              <li>• Special Rice / Biryani</li>
              <li>• 3 Desserts</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleNext}>
          Next Step
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleNext} className="flex-1">
            Next Step
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
