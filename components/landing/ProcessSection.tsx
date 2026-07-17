'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    num: '01',
    title: 'Create Your Account',
    desc: 'Sign up in seconds and unlock your personal event planning portal.',
    icon: '✦',
  },
  {
    num: '02',
    title: 'Choose Your Dates',
    desc: 'Pick your check-in and check-out dates. The system builds your full day-by-day plan automatically.',
    icon: '◈',
  },
  {
    num: '03',
    title: 'Plan Every Detail',
    desc: 'Select rooms, curate menus for every meal, assign wedding functions, choose décor themes and baraat style.',
    icon: '❋',
  },
  {
    num: '04',
    title: 'Submit & Relax',
    desc: 'Our team reviews your plan and sends a personalised quotation within 24 hours. You celebrate; we handle the rest.',
    icon: '✧',
  },
]

export function ProcessSection() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#120F0B' }}
    >
      {/* Vertical gold line decoration */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 20%, rgba(201,168,76,0.15) 80%, transparent)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <p className="text-caption mb-5" style={{ color: '#C9A84C' }}>Your Journey</p>
          <h2 className="text-headline">Planning Made <span className="gold-text italic">Effortless</span></h2>
        </motion.div>

        {/* Steps — alternating left/right */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-center gap-8 md:gap-16 py-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                  <p className="text-caption mb-3" style={{ color: 'rgba(201,168,76,0.5)' }}>Step {step.num}</p>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-4" style={{ color: '#FAF3E8' }}>
                    {step.title}
                  </h3>
                  <p className="text-body leading-relaxed max-w-sm ml-auto" style={{ color: 'rgba(250,243,232,0.5)', ...(isLeft ? {} : { marginLeft: 0, marginRight: 'auto' }) }}>
                    {step.desc}
                  </p>
                </div>

                {/* Center node */}
                <div className="relative flex-shrink-0 z-10">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)',
                      border: '1px solid rgba(201,168,76,0.35)',
                      boxShadow: '0 0 40px rgba(201,168,76,0.12)',
                    }}
                  >
                    <span className="text-xl" style={{ color: '#C9A84C' }}>{step.icon}</span>
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-1/2 top-full w-px h-20 -translate-x-1/2"
                      style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.3), rgba(201,168,76,0.05))' }}
                    />
                  )}
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
