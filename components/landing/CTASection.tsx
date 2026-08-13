'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

interface Props { isLoggedIn: boolean }

export function CTASection({ isLoggedIn }: Props) {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40 px-6 overflow-hidden text-center"
      style={{
        background: 'linear-gradient(180deg, #120F0B 0%, #1C1712 50%, #120F0B 100%)',
      }}
    >
      {/* Full-bleed background image tint */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'url(/royal.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #120F0B 0%, rgba(18,15,11,0.6) 50%, #120F0B 100%)' }} />
      </div>

      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 65%)' }} />
      </div>

      {/* Spinning mandala */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none animate-spin-slow">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="98" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="80" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="60" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="40" stroke="#C9A84C" strokeWidth="0.5"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <line key={a} x1="100" y1="2" x2="100" y2="198" stroke="#C9A84C" strokeWidth="0.3"
              style={{ transformOrigin: '100px 100px', transform: `rotate(${a}deg)` }} />
          ))}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <p className="text-caption mb-8" style={{ color: '#C9A84C', letterSpacing: '0.3em' }}>Begin Your Forever</p>

        <h2 className="text-display mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
          Your Perfect Wedding
          <br />
          <span className="gold-text-animate italic font-light">Awaits You.</span>
        </h2>

        <p className="text-body-lg mx-auto max-w-xl mb-14" style={{ color: 'rgba(250,243,232,0.6)' }}>
          Join hundreds of couples who trusted Mannat Events to craft their dream destination wedding.
          Every detail, every moment — perfected.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/booking">
            <button
              className="group relative overflow-hidden rounded-full px-12 py-5 font-semibold text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #9A7B2E 0%, #C9A84C 50%, #E8C97A 100%)',
                color: '#0A0807',
                boxShadow: '0 8px 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.1)',
                fontSize: '0.75rem',
              }}
            >
              Start Planning Now
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
