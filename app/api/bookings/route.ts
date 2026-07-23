import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { BookingSchema } from '@/lib/validators/booking'
import { generateBookingId, calculateDuration } from '@/lib/utils/booking'
import { ZodError } from 'zod'

/** How many rooms per day counts as suspicious */
const SUSPICIOUS_ROOMS_THRESHOLD = 50
/** How many bookings within 1 hour counts as spam */
const SPAM_BOOKING_LIMIT = 3

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate (optional)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Parse & validate body
    const body  = await request.json()
    const parsed = BookingSchema.parse(body)

    // 3. Calculate duration
    const duration = calculateDuration(parsed.check_in, parsed.check_out)
    if (duration <= 0) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 })
    }

    // 4. Validate day_plans count matches duration
    if (parsed.day_plans.length !== duration) {
      return NextResponse.json(
        { error: `Day plans must cover all ${duration} days.` },
        { status: 400 }
      )
    }

    const serviceClient = createServiceClient()

    // 5. Phone blacklist check (optional field for now)
    if (parsed.phone) {
      const { data: blocked } = await serviceClient
        .from('blocked_phones')
        .select('id')
        .eq('phone', parsed.phone)
        .maybeSingle()

      if (blocked) {
        return NextResponse.json(
          { error: 'This phone number cannot submit booking requests.' },
          { status: 403 }
        )
      }
    }

    // 6. Spam / suspicious activity detection
    let is_flagged = false

    // Check repeated submissions within last hour (only if user is logged in)
    if (user) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count: recentCount } = await serviceClient
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneHourAgo)

      if ((recentCount ?? 0) >= SPAM_BOOKING_LIMIT) {
        is_flagged = true
      }
    }

    // Check unrealistic room counts
    const hasUnrealisticRooms = parsed.day_plans.some(
      (d) => d.rooms > SUSPICIOUS_ROOMS_THRESHOLD
    )
    if (hasUnrealisticRooms) {
      is_flagged = true
    }

    // 7. Generate booking ID
    const booking_id = generateBookingId()

    // 8. Insert
    const { data: booking, error: insertError } = await serviceClient
      .from('bookings')
      .insert({
        booking_id,
        user_id:              user?.id ?? null,
        customer_email:       user?.email ?? null,
        check_in:             parsed.check_in,
        check_out:            parsed.check_out,
        duration,
        phone:                parsed.phone ?? null,
        baraat_style:         parsed.baraat_style,
        decoration_theme_id:  parsed.decoration_theme_id && parsed.decoration_theme_id !== '' ? parsed.decoration_theme_id : null,
        day_plans:            parsed.day_plans,
        functions:            parsed.functions,
        is_flagged,
        status:               'pending',
      })
      .select('booking_id')
      .single()

    if (insertError) {
      console.error('[POST /api/bookings] Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create booking. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking_id: booking.booking_id }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data.', details: err.flatten() },
        { status: 422 }
      )
    }
    console.error('[POST /api/bookings] Unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}