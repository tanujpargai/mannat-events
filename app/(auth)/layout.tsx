import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#0A0807' }}>

      {/* LEFT — Decorative brand panel */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A0807 0%, #1C1712 40%, #120F0B 100%)' }}
      >
        {/* Background palace image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/royal.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,8,7,0.3) 0%, rgba(10,8,7,0.6) 100%)'
        }} />

        {/* Radial gold glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
            style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
        </div>

        {/* Spinning mandala */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-8 pointer-events-none animate-spin-slow">
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="98" stroke="#C9A84C" strokeWidth="0.4"/>
            <circle cx="100" cy="100" r="78" stroke="#C9A84C" strokeWidth="0.4"/>
            <circle cx="100" cy="100" r="58" stroke="#C9A84C" strokeWidth="0.4"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
              <line key={a} x1="100" y1="2" x2="100" y2="198" stroke="#C9A84C" strokeWidth="0.25"
                style={{ transformOrigin: '100px 100px', transform: `rotate(${a}deg)` }} />
            ))}
            <polygon points="100,15 108,92 185,100 108,108 100,185 92,108 15,100 92,92"
              stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          {/* Brand */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-16 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-transform group-hover:rotate-3"
              style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}>
              M
            </div>
            <span className="font-semibold text-sm tracking-[0.22em] uppercase" style={{ color: '#FAF3E8' }}>
              Mannat Events
            </span>
          </Link>

          {/* Quote */}
          <div className="mb-10">
            <span className="h-px w-14 block mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
            <blockquote
              className="text-4xl lg:text-5xl font-light italic leading-tight mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#FAF3E8' }}
            >
              &ldquo;Where Forever
              <br />
              <span style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C, #E8C97A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Begins.
              </span>&rdquo;
            </blockquote>
            <span className="h-px w-14 block mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
          </div>

          <p className="text-sm tracking-[0.25em] uppercase" style={{ color: 'rgba(201,168,76,0.6)' }}>
            Destination Wedding Specialists
          </p>

          {/* Floating dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {['Udaipur', 'Jaipur', 'Goa', 'Kerala'].map((dest) => (
              <span key={dest} className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(201,168,76,0.7)' }}>
                {dest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative">
        {/* Mobile brand (hidden on desktop) */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}>
            M
          </div>
          <span className="font-semibold text-sm tracking-[0.22em] uppercase" style={{ color: '#FAF3E8' }}>
            Mannat Events
          </span>
        </div>

        {/* Subtle glow behind form */}
        <div className="absolute pointer-events-none w-[400px] h-[400px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

        {/* Form card */}
        <div
          className="relative z-10 w-full max-w-md rounded-3xl p-8 md:p-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 80px rgba(10,8,7,0.5)',
          }}
        >
          {children}
        </div>

        {/* Back to home */}
        <Link href="/" className="mt-8 text-xs tracking-widest uppercase transition-colors text-[rgba(201,168,76,0.5)] hover:text-[#C9A84C]">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
