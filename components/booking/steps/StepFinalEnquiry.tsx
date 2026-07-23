'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookingFormData } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { CheckCircle2, CalendarDays, Users, Palette, Hotel, Phone, Loader2 } from 'lucide-react'

interface Props {
  data: BookingFormData
  onPrev: () => void
  onSubmit: () => void
  isSubmitting: boolean
  submitError?: string
}

// Map hotel IDs to display names
const HOTEL_NAMES: Record<string, string> = {
  'hotel-1': 'The Oberoi Amarvilas',
  'hotel-2': 'ITC Mughal, Agra',
  'hotel-3': 'Taj Hotel & Convention Centre',
  'hotel-4': 'Radisson Blu Agra Taj East Gate',
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[rgba(201,168,76,0.1)] last:border-0">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'rgba(201,168,76,0.08)', color: '#C9A84C' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(201,168,76,0.6)' }}>
          {label}
        </p>
        <p className="text-sm font-medium leading-snug" style={{ color: '#1A1A1A' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

export function StepFinalEnquiry({ data, onPrev, onSubmit, isSubmitting, submitError }: Props) {
  const nights = data.day_plans?.length ?? 0
  const peakGuests = data.day_plans && data.day_plans.length > 0
    ? Math.max(...data.day_plans.map(p => Math.max(p.lunch?.guest_count ?? 0, p.dinner?.guest_count ?? 0)))
    : 0

  const hotelName = data.selected_hotel ? (HOTEL_NAMES[data.selected_hotel] ?? data.selected_hotel) : '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: '#C9A84C' }}
        >
          Step 7 of 7
        </p>
        <h2
          className="text-4xl font-light leading-tight mb-3"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A1A' }}
        >
          Final Enquiry
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#737373' }}>
          Please review your complete booking details below. Once you submit, our team will contact you within 24 hours with a personalised quotation.
        </p>
      </div>

      {/* Summary card */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          border: '1px solid rgba(201,168,76,0.15)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,243,232,0.6) 100%)',
          boxShadow: '0 8px 40px rgba(201,168,76,0.06)',
        }}
      >
        {/* Card header */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)',
            borderBottom: '1px solid rgba(201,168,76,0.1)',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
          >
            <CheckCircle2 size={15} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#9A7B2E' }}>
            Booking Summary
          </p>
        </div>

        {/* Rows */}
        <div className="px-6">
          <SummaryRow
            icon={<CalendarDays size={16} />}
            label="Check-in / Check-out"
            value={`${formatDate(data.check_in)} → ${formatDate(data.check_out)} (${nights} ${nights === 1 ? 'night' : 'nights'})`}
          />
          <SummaryRow
            icon={<Users size={16} />}
            label="Peak Guest Count"
            value={peakGuests > 0 ? `${peakGuests} guests` : 'Not specified'}
          />
          <SummaryRow
            icon={<Palette size={16} />}
            label="Decoration Package"
            value={data.decorationPackage ?? '—'}
          />
          {data.decoration_theme_title && (
            <SummaryRow
              icon={<Palette size={16} />}
              label="Decoration Theme"
              value={data.decoration_theme_title}
            />
          )}
          <SummaryRow
            icon={<Hotel size={16} />}
            label="Selected Hotel"
            value={hotelName}
          />
          {data.phone && (
            <SummaryRow
              icon={<Phone size={16} />}
              label="Contact Number"
              value={data.phone}
            />
          )}
        </div>
      </div>

      {/* Note */}
      <div
        className="rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{
          background: 'rgba(201,168,76,0.04)',
          border: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <span className="text-lg mt-0.5">✦</span>
        <p className="text-sm leading-relaxed" style={{ color: '#737373' }}>
          Your enquiry is non-binding. Our wedding planning team will review your requirements and reach out with a detailed, personalised quotation within <strong style={{ color: '#1A1A1A' }}>24 hours</strong>.
        </p>
      </div>

      {/* Error */}
      {submitError && (
        <div className="px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
          {submitError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 rounded-full py-4 text-sm font-semibold tracking-wider transition-all duration-300 disabled:opacity-50"
          style={{
            border: '1px solid rgba(201,168,76,0.2)',
            color: '#737373',
            background: 'transparent',
          }}
        >
          ← Back
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 rounded-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)',
            color: '#0A0807',
            boxShadow: '0 8px 30px rgba(201,168,76,0.3)',
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting Enquiry…
            </>
          ) : (
            <>
              Submit Enquiry ✦
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
