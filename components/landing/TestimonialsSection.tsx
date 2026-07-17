'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    quote: 'Mannat Events turned our dream of a palace wedding into an experience we will cherish for eternity. Every detail was beyond perfection.',
    name: 'Priya & Arjun Kapoor',
    event: 'Udaipur Lake Palace · December 2024',
    stars: 5,
  },
  {
    quote: 'From the mehendi decor to the grand baraat procession — everything was orchestrated with such finesse. Truly world-class hospitality.',
    name: 'Sneha & Rahul Sharma',
    event: 'Jaipur Heritage Fort · November 2024',
    stars: 5,
  },
  {
    quote: 'Our guests are still talking about the feast and the floral mandap. Mannat Events elevated our wedding into a destination legend.',
    name: 'Aisha & Dev Mehta',
    event: 'Goa Beachfront Villa · January 2025',
    stars: 5,
  },
]

export function TestimonialsSection() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#0A0807' }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
      </div>

      {/* Decorative quote mark */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20rem', lineHeight: 1, color: 'rgba(201,168,76,0.03)', fontWeight: 300 }}>
        "
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <p className="text-caption mb-5" style={{ color: '#C9A84C' }}>Testimonials</p>
          <h2 className="text-headline">Stories of <span className="gold-text italic">Forever</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: 8 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: '1000px' }}
            >
              <div
                className="rounded-2xl p-8 h-full group hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(201,168,76,0.04) 100%)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1.5 mb-7">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} style={{ color: '#C9A84C', fontSize: '14px' }}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="mb-8 leading-relaxed"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(250,243,232,0.85)', lineHeight: 1.65 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#FAF3E8' }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Inter, sans-serif' }}>{t.event}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
