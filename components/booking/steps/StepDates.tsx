'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  StepDatesSchema,
  StepDatesValues,
} from '@/lib/validators/booking'
import {
  calculateDuration,
  formatDate,
} from '@/lib/utils/booking'
import { BookingFormData } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Card3D } from '@/components/ui/Card3D'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { motion } from 'framer-motion'

interface StepDatesProps {
  data: Partial<BookingFormData>
  onNext: (data: StepDatesValues) => void
}

function DateDisplayCard({
  label,
  value,
  placeholder,
  onClick,
  error,
}: {
  label: string
  value: string
  placeholder: string
  onClick: () => void
  error?: string
}) {
  // Parse date for elegant rendering
  let dayStr = ''
  let monthYearStr = ''
  
  if (value) {
    const dateObj = new Date(value)
    if (!isNaN(dateObj.getTime())) {
      dayStr = dateObj.toLocaleDateString('en-US', { day: '2-digit' })
      monthYearStr = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex-1 rounded-2xl border-2 p-6 cursor-pointer text-left transition-all duration-300 bg-white shadow-3d hover:shadow-3d-hover min-h-[140px] flex flex-col justify-between',
        error ? 'border-red-400 bg-red-50/10' : 'border-[#E8E2D8] hover:border-[#C9A84C]'
      )}
    >
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8A8] uppercase mb-2">
          {label}
        </p>
        
        {value ? (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-serif font-bold text-[#1A1A1A]">
              {dayStr}
            </span>
            <span className="text-sm font-medium text-[#737373] uppercase tracking-wider">
              {monthYearStr}
            </span>
          </div>
        ) : (
          <span className="text-lg font-serif italic font-light text-[#A8A8A8]">
            {placeholder}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0EDE9]">
        <span className="text-xs font-semibold text-[#C5A85C] tracking-wide">
          {value ? 'Modify Date' : 'Choose Date'}
        </span>
        <CalendarDays size={16} className="text-[#C5A85C] opacity-75" />
      </div>
    </div>
  )
}

export function StepDates({ data, onNext }: StepDatesProps) {
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepDatesValues>({
    resolver: zodResolver(StepDatesSchema),
    defaultValues: {
      check_in: data.check_in ?? '',
      check_out: data.check_out ?? '',
    },
  })

  const checkIn = watch('check_in')
  const checkOut = watch('check_out')
  const duration = calculateDuration(checkIn, checkOut)

  const checkInInputRef = useRef<HTMLInputElement | null>(null)
  const checkOutInputRef = useRef<HTMLInputElement | null>(null)

  const { ref: checkInRef, ...checkInReg } = register('check_in')
  const { ref: checkOutRef, ...checkOutReg } = register('check_out')

  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setValue('check_out', '')
    }
  }, [checkIn, checkOut, setValue])

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="pb-24 md:pb-0">
      <h2 className="text-headline mb-3">When is the celebration?</h2>
      <p className="text-body text-[#737373] mb-10">
        Select your stay duration. Every night adds a new customizable daily planning timeline.
      </p>

      {/* Hidden native inputs for date picking */}
      <input
        type="date"
        id="check_in"
        min={today}
        ref={(e) => {
          checkInRef(e)
          checkInInputRef.current = e
        }}
        className="sr-only"
        {...checkInReg}
      />
      <input
        type="date"
        id="check_out"
        min={checkIn || today}
        ref={(e) => {
          checkOutRef(e)
          checkOutInputRef.current = e
        }}
        className="sr-only"
        {...checkOutReg}
      />

      <Card3D intensity={5} className="max-w-2xl mx-auto">
        <div className="rounded-3xl border border-[#E8E2D8] bg-white/70 backdrop-blur-md p-6 md:p-8 shadow-3d space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 relative">
            {/* Check-In Card */}
            <DateDisplayCard
              label="Check-In"
              value={checkIn}
              placeholder="Select check-in"
              error={errors.check_in?.message}
              onClick={() => checkInInputRef.current?.showPicker()}
            />

            {/* Connecting Arrow/Visual indicator */}
            <div className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-10 bg-[#F5EDD6] border border-[#E8D9A8] w-10 h-10 rounded-full flex items-center justify-center text-[#C5A85C] shadow-md my-2 sm:my-0">
              <ArrowRight size={16} strokeWidth={2.5} className="rotate-90 sm:rotate-0" />
            </div>

            {/* Check-Out Card */}
            <DateDisplayCard
              label="Check-Out"
              value={checkOut}
              placeholder="Select check-out"
              error={errors.check_out?.message}
              onClick={() => checkOutInputRef.current?.showPicker()}
            />
          </div>

          {/* Validation errors */}
          {(errors.check_in?.message || errors.check_out?.message) && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {errors.check_in?.message || errors.check_out?.message}
            </div>
          )}

          {/* Stay Summary */}
          {duration > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-[#E8D9A8] bg-gradient-to-r from-[#FAF6EE] to-[#F5EDD6] px-6 py-5 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#C5A85C] shrink-0 shadow-sm border border-[#E8D9A8]">
                <CalendarDays size={20} strokeWidth={2} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">
                  {duration} {duration === 1 ? 'Night' : 'Nights'} Celebration
                </p>
                <p className="mt-0.5 text-xs text-[#737373] tracking-wide">
                  Timeline generated: {formatDate(checkIn)} to {formatDate(checkOut)}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </Card3D>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-end mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button type="submit" size="lg">
          Next Step
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <Button type="submit" size="lg" className="w-full">
          Next Step
        </Button>
      </div>
    </form>
  )
}