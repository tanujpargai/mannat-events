import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateBookingId, calculateDuration } from '@/lib/utils/booking'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    
    if (!body.check_in || !body.check_out) {
      return NextResponse.json({ error: 'Check-in and Check-out dates are required.' }, { status: 400 })
    }

    const duration = calculateDuration(body.check_in, body.check_out)
    if (duration <= 0) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 })
    }

    const serviceClient = createServiceClient()

    const booking_id = generateBookingId()

    const { data: booking, error: insertError } = await serviceClient
      .from('bookings')
      .insert({
        booking_id,
        user_id: user?.id ?? null,
        customer_email: user?.email ?? null,
        check_in: body.check_in,
        check_out: body.check_out,
        duration,
        phone: body.phone ?? null,
        baraat_style: body.baraat_style ?? null,
        decoration_theme_id: body.decoration_theme_id ?? null,
        day_plans: body.day_plans ?? [],
        functions: body.functions ?? [],
        is_flagged: false,
        status: 'pending',
        notes: body.selected_hotel ? `Hotel: ${body.selected_hotel.name} (${body.selected_hotel.price_display}), Decor: ${body.decoration_package}` : null,
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
    console.error('[POST /api/bookings] Unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}