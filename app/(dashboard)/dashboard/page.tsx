import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils/booking'
import { Booking } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Dashboard — Mannat Events',
  description: 'Manage your destination wedding bookings.',
}

function StatCard({ label, value, icon, accent }: {
  label: string; value: string | number; icon: string; accent?: string
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(201,168,76,0.04) 100%)',
        border: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.7)', letterSpacing: '0.1em' }}>
          {label}
        </span>
      </div>
      <p
        className="text-4xl font-light"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: accent ?? '#FAF3E8' }}
      >
        {value}
      </p>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.trim().split(' ')[0] || user?.email?.split('@')[0] || 'Guest'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const total     = bookings?.length ?? 0
  const pending   = bookings?.filter((b) => b.status === 'pending').length   ?? 0
  const confirmed = bookings?.filter((b) => b.status === 'confirmed').length ?? 0

  return (
    <div className="space-y-10 pb-20 lg:pb-10">

      {/* Welcome hero */}
      <div
        className="relative rounded-3xl overflow-hidden px-8 py-10"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        {/* BG mandap tint */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/royal.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(10,8,7,0.3), rgba(10,8,7,0.7))' }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-caption mb-3" style={{ color: '#C9A84C' }}>{greeting}</p>
            <h1
              className="text-4xl md:text-5xl font-light mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#FAF3E8' }}
            >
              {firstName}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(250,243,232,0.5)' }}>
              {total === 0
                ? 'Ready to begin planning your dream wedding?'
                : `You have ${total} booking${total > 1 ? 's' : ''} on record.`}
            </p>
          </div>

          <Link href="/booking">
            <button
              className="shrink-0 rounded-full px-8 py-3.5 font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)',
                color: '#0A0807',
                boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
              }}
            >
              Plan My Wedding ✦
            </button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={total}     icon="📋" />
        <StatCard label="Pending" value={pending}   icon="⏳" accent="#C9A84C" />
        <StatCard label="Confirmed" value={confirmed} icon="✓"  accent="#8B9E87" />
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-2xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#FAF3E8' }}
          >
            Recent Bookings
          </h2>
          <Link href="/booking">
            <button className="text-xs font-medium tracking-widest uppercase transition-colors"
              style={{ color: 'rgba(201,168,76,0.6)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,168,76,0.6)')}
            >
              + New Booking
            </button>
          </Link>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(255,255,255,0.03)' }}
        >
          {!bookings || bookings.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl mb-4">🏰</p>
              <p className="font-serif text-xl font-light mb-2" style={{ color: '#FAF3E8' }}>No bookings yet</p>
              <p className="text-sm mb-8" style={{ color: 'rgba(250,243,232,0.4)' }}>
                Begin planning your destination wedding
              </p>
              <Link href="/booking">
                <button
                  className="rounded-full px-8 py-3 text-sm font-semibold tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
                >
                  Start Planning
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th style={{ color: 'rgba(201,168,76,0.6)', background: 'transparent', borderColor: 'rgba(201,168,76,0.1)' }}>Booking ID</th>
                    <th style={{ color: 'rgba(201,168,76,0.6)', background: 'transparent' }}>Check-in</th>
                    <th style={{ color: 'rgba(201,168,76,0.6)', background: 'transparent' }}>Check-out</th>
                    <th style={{ color: 'rgba(201,168,76,0.6)', background: 'transparent' }}>Guests</th>
                    <th style={{ color: 'rgba(201,168,76,0.6)', background: 'transparent' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(bookings as Booking[]).map((booking) => (
                    <tr key={booking.id} style={{ borderColor: 'rgba(201,168,76,0.06)' }}>
                      <td>
                        <span
                          className="rounded-lg px-3 py-1.5 font-mono text-xs"
                          style={{ background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.8)', border: '1px solid rgba(201,168,76,0.12)' }}
                        >
                          {booking.booking_id}
                        </span>
                      </td>
                      <td className="font-medium text-sm" style={{ color: '#FAF3E8' }}>{formatDate(booking.check_in)}</td>
                      <td className="font-medium text-sm" style={{ color: '#FAF3E8' }}>{formatDate(booking.check_out)}</td>
                      <td className="text-sm" style={{ color: 'rgba(250,243,232,0.6)' }}>{booking.guests}</td>
                      <td><StatusBadge status={booking.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}