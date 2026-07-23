import { DayPlan } from '@/lib/types'

/**
 * Calculates the number of nights between two ISO date strings.
 * Returns 0 if dates are invalid or check_out <= check_in.
 */
export function calculateDuration(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return diff > 0 ? Math.round(diff / msPerDay) : 0
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable format.
 * e.g. "2026-10-14" → "14 Oct 2026"
 */
export function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

/**
 * Generates a human-readable unique booking ID.
 * Format: MNT-YYYYMMDD-XXXX (4 random alphanumeric chars)
 */
export function generateBookingId(): string {
  const date = new Date()
  const datePart   = date.toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `MNT-${datePart}-${randomPart}`
}

/**
 * Returns ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Generates the initial default DayPlans for a given number of days.
 * All fields set to empty/zero — the wizard fills them step-by-step.
 */
export function generateDefaultDayPlans(duration: number): DayPlan[] {
  return Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    rooms: 1,
    lunch: {
      type: 'veg' as const,
      menu_item_ids: [],
      menu_item_names: [],
      guest_count: 1,
    },
    dinner: {
      type: 'veg' as const,
      menu_item_ids: [],
      menu_item_names: [],
      guest_count: 1,
    },
  }))
}

