// -------------------------------------------------------
// Core Application Types — Mannat Events Phase 2
// -------------------------------------------------------

// -------------------------------------------------------
// Lookup / Reference Types (fetched from DB)
// -------------------------------------------------------

export interface MenuItem {
  id: string
  type: 'veg' | 'non-veg'
  name: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DecorationTheme {
  id: string
  title: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface WeddingFunction {
  id: string
  name: string
  is_active: boolean
  sort_order: number
}

// -------------------------------------------------------
// Day Planning Types
// -------------------------------------------------------

export type MealType = 'veg' | 'non-veg'

export interface MealSelection {
  type: MealType
  /** IDs of selected menu items */
  menu_item_ids: string[]
  /** Names kept for review/display without re-fetching */
  menu_item_names: string[]
  guest_count: number
}

export interface DayPlan {
  day: number
  rooms: number
  lunch: MealSelection
  dinner: MealSelection
}

// -------------------------------------------------------
// Function Assignment
// -------------------------------------------------------

export interface FunctionAssignment {
  function_id: string
  function_name: string
  /** Which day of the stay this function falls on (1-based) */
  day: number
}

// -------------------------------------------------------
// Booking Status
// -------------------------------------------------------

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// -------------------------------------------------------
// Booking — Database Record
// -------------------------------------------------------

export interface Booking {
  id: string
  booking_id: string
  user_id: string
  customer_email: string | null
  check_in: string
  check_out: string
  duration: number
  phone: string | null
  baraat_style: string | null
  decoration_theme_id: string | null
  day_plans: DayPlan[]
  functions: FunctionAssignment[]
  is_flagged: boolean
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// -------------------------------------------------------
// Wizard Form State (built up step-by-step)
// -------------------------------------------------------

export interface BookingFormData {
  check_in: string
  check_out: string
  /** One DayPlan per night of stay */
  day_plans: DayPlan[]
  /** Wedding functions assigned to days */
  functions: FunctionAssignment[]
  /** UUID of the selected decoration theme */
  decoration_theme_id: string
  /** Title kept for display without re-fetching */
  decoration_theme_title: string
  /** e.g. 'traditional' | 'stylish' | 'dj-on-wheels' */
  baraat_style: string
  /** Optional phone — OTP will be added later */
  phone?: string
}

// -------------------------------------------------------
// API Responses
// -------------------------------------------------------

export interface ApiError {
  error: string
  code?: string
}

export interface CreateBookingResponse {
  booking_id: string
}

// -------------------------------------------------------
// Admin: Blocked Phone
// -------------------------------------------------------

export interface BlockedPhone {
  id: string
  phone: string
  reason: string | null
  blocked_at: string
  blocked_by: string | null
}
