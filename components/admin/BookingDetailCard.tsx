'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Booking,
  BookingStatus,
  BOOKING_STATUS_LABELS,
} from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { MealSummary } from '@/components/admin/MealSummary'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface BookingDetailCardProps {
  booking: Booking
}

const STATUS_OPTIONS = (
  Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]
).map((key) => ({
  value: key,
  label: BOOKING_STATUS_LABELS[key],
}))

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value?: string | number | null
  mono?: boolean
}) {
  return (
    <div className="flex justify-between items-start gap-6 py-4 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A8A8] shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={cn(
          'text-sm font-semibold text-[#1A1A1A] text-right break-all',
          mono && 'font-mono text-xs text-[#737373]'
        )}
      >
        {value ?? '—'}
      </span>
    </div>
  )
}

export function BookingDetailCard({ booking }: BookingDetailCardProps) {
  const router = useRouter()
  const [status, setStatus] = useState<BookingStatus>(booking.status)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function handleStatusUpdate() {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', booking.id)

      if (error) {
        setSaveError(error.message)
        return
      }

      setSaveSuccess(true)
      router.refresh()
    } catch {
      setSaveError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const dayPlans  = booking.day_plans ?? []
  const functions = booking.functions ?? []

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#A8A8A8] uppercase tracking-wider">
              Reference ID
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-semibold text-[#1A1A1A] mt-1">
              {booking.booking_id}
            </h2>
            <p className="text-xs text-[#737373] mt-1">
              Created on {new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold text-[#A8A8A8] uppercase tracking-wider mb-1.5">
              Status
            </p>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </Card>

      {/* Customer Information */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Customer Details</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="User ID" value={booking.user_id} mono />
          <DetailRow label="Email Address" value={booking.customer_email} />
          <DetailRow label="Phone Number" value={booking.phone} />
        </div>
      </Card>

      {/* Stay Details */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Stay Details</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="Check-in" value={formatDate(booking.check_in)} />
          <DetailRow label="Check-out" value={formatDate(booking.check_out)} />
          <DetailRow
            label="Duration"
            value={`${booking.duration} ${booking.duration === 1 ? 'night' : 'nights'}`}
          />
        </div>
      </Card>

      {/* Event Style */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Event Style</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="Decoration Theme ID" value={booking.decoration_theme_id} mono />
        </div>
      </Card>

      {/* Wedding Functions */}
      {functions.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
            <p className="text-caption text-[#C9A84C]">Wedding Functions</p>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {functions.map((fn) => (
              <span
                key={fn.function_id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-medium text-[#1A1A1A]"
              >
                {fn.function_name}
                <span className="text-[#A08040]">→ Day {fn.day}</span>
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Daily Meal Plan */}
      {dayPlans.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
            <p className="text-caption text-[#C9A84C]">Daily Meal Plan & Rooms</p>
          </div>
          <div className="overflow-x-auto">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Rooms</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {dayPlans.map((plan) => (
                  <tr key={plan.day}>
                    <td className="font-medium">Day {plan.day}</td>
                    <td>{plan.rooms ?? 1}</td>
                    <td className="text-[#A8A8A8] italic">Included</td>
                    <td>
                      <span className="block text-sm font-semibold capitalize">
                        {plan.lunch?.type === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
                      </span>
                      <span className="block text-xs text-[#737373]">
                        {plan.lunch?.guest_count ?? 0} guests
                      </span>
                      {(plan.lunch?.menu_item_names?.length ?? 0) > 0 && (
                        <span className="block text-xs text-[#A8A8A8] max-w-[150px] truncate" title={plan.lunch.menu_item_names.join(', ')}>
                          {plan.lunch.menu_item_names.join(', ')}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="block text-sm font-semibold capitalize">
                        {plan.dinner?.type === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
                      </span>
                      <span className="block text-xs text-[#737373]">
                        {plan.dinner?.guest_count ?? 0} guests
                      </span>
                      {(plan.dinner?.menu_item_names?.length ?? 0) > 0 && (
                        <span className="block text-xs text-[#A8A8A8] max-w-[150px] truncate" title={plan.dinner.menu_item_names.join(', ')}>
                          {plan.dinner.menu_item_names.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {dayPlans.length > 0 && <MealSummary meals={dayPlans} />}

      {/* Status Update */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Update Status</p>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="booking-status">New status</Label>
              <Select
                id="booking-status"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(e) => {
                  setSaveSuccess(false)
                  setStatus(e.target.value as BookingStatus)
                }}
              />
            </div>
            <Button
              onClick={handleStatusUpdate}
              loading={isSaving}
              disabled={status === booking.status}
            >
              Save
            </Button>
          </div>
          {saveError && <p className="mt-3 text-xs text-red-600">{saveError}</p>}
          {saveSuccess && <p className="mt-3 text-xs text-[#065F46]">Status updated successfully.</p>}
        </div>
      </Card>
    </div>
  )
}