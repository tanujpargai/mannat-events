import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview',    icon: '◈' },
  { href: '/booking',   label: 'Plan Wedding', icon: '❋' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const initials = (profile?.full_name ?? user.email ?? '?')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0807' }}>

      {/* ── SIDEBAR (desktop) ───────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-40"
        style={{
          background: 'linear-gradient(180deg, #120F0B 0%, #0A0807 100%)',
          borderRight: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        {/* Brand */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:rotate-3"
              style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
            >
              M
            </div>
            <div>
              <p className="font-semibold text-xs tracking-[0.2em] uppercase" style={{ color: '#FAF3E8' }}>
                Mannat Events
              </p>
              <p className="text-xs" style={{ color: 'rgba(201,168,76,0.5)' }}>Wedding Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{ color: 'rgba(250,243,232,0.6)' }}
            >
              <span className="text-base transition-colors duration-200" style={{ color: 'rgba(201,168,76,0.6)' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mt-4"
              style={{ color: 'rgba(201,168,76,0.7)', borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '16px', marginTop: '16px' }}
            >
              <span>⚙</span>
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User card at bottom */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#FAF3E8' }}>
                {profile?.full_name ?? 'Guest'}
              </p>
              <p className="text-xs truncate" style={{ color: 'rgba(250,243,232,0.35)' }}>
                {user.email}
              </p>
            </div>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full text-left text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200"
              style={{ color: 'rgba(250,243,232,0.4)', border: '1px solid rgba(201,168,76,0.1)' }}
            >
              Sign Out →
            </button>
          </form>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ─────────────────────────── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16"
        style={{ background: 'rgba(10,8,7,0.95)', borderBottom: '1px solid rgba(201,168,76,0.1)', backdropFilter: 'blur(20px)' }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}>
            M
          </div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#FAF3E8' }}>
            Mannat Events
          </span>
        </Link>
        <form action={handleLogout}>
          <Button type="submit" variant="ghost" size="sm">Sign Out</Button>
        </form>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────── */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {children}
        </div>
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ──────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: 'rgba(10,8,7,0.97)', borderTop: '1px solid rgba(201,168,76,0.1)', backdropFilter: 'blur(20px)' }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={{ color: 'rgba(250,243,232,0.5)' }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}