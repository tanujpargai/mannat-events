import { z } from 'zod'

// ---- Step 1: Dates ----

export const StepDatesSchema = z
  .object({
    check_in:  z.string().min(1, 'Check-in date is required'),
    check_out: z.string().min(1, 'Check-out date is required'),
  })
  .refine(
    (d) => {
      if (!d.check_in || !d.check_out) return true
      return new Date(d.check_out) > new Date(d.check_in)
    },
    { message: 'Check-out must be after check-in', path: ['check_out'] }
  )
  .refine(
    (d) => {
      if (!d.check_in) return true
      return new Date(d.check_in) >= new Date(new Date().toDateString())
    },
    { message: 'Check-in date cannot be in the past', path: ['check_in'] }
  )

export type StepDatesValues = z.infer<typeof StepDatesSchema>

// ---- Meal Selection ----

const MealSelectionSchema = z.object({
  type:             z.enum(['veg', 'non-veg']),
  menu_item_ids:    z.array(z.string()).default([]),
  menu_item_names:  z.array(z.string()).default([]),
  guest_count:      z.number().int().min(1, 'At least 1 guest required').max(10000),
})

// ---- Day Plan ----

const DayPlanSchema = z.object({
  day:    z.number().int().positive(),
  rooms:  z.number().int().min(1, 'At least 1 room required').max(200),
  lunch:  MealSelectionSchema,
  dinner: MealSelectionSchema,
})

// ---- Function Assignment ----

const FunctionAssignmentSchema = z.object({
  function_id:   z.string().optional().nullable(),
  function_name: z.string().min(1),
  day:           z.number().int().positive(),
})

// ---- Full Booking Schema ----

export const BookingSchema = z.object({
  check_in:  z.string().min(1),
  check_out: z.string().min(1),

  day_plans: z.array(DayPlanSchema).min(1, 'Day plans are required'),

  functions: z.array(FunctionAssignmentSchema).default([]),

  decoration_theme_id:    z.string().optional().nullable(),
  decoration_theme_title: z.string().optional().nullable(),

  baraat_style: z.enum(['traditional', 'stylish', 'dj-on-wheels'], {
    message: 'Please select a baraat style',
  }),

  phone: z.string().optional(),
})

export type BookingValues = z.infer<typeof BookingSchema>