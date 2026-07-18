'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card3D } from '@/components/ui/Card3D'
import { Castle, Flower2, Utensils, Music, Crown, Bed } from 'lucide-react'

const offerings = [
  {
    icon: <Castle className="text-[#C5A85C]" size={24} strokeWidth={1.5} />,
    title: 'Palace & Heritage Venues',
    desc: 'Exclusive partnerships with India\'s most iconic havelis, lake palaces and royal estates across Rajasthan, Kerala and Goa.',
    accent: 'rgba(201,168,76,0.12)',
  },
  {
    icon: <Flower2 className="text-[#C5A85C]" size={24} strokeWidth={1.5} />,
    title: 'Floral & Décor Architecture',
    desc: 'From marigold-draped mandaps to jasmine-scented reception halls — every petal placed with intention.',
    accent: 'rgba(232,180,160,0.10)',
  },
  {
    icon: <Utensils className="text-[#C5A85C]" size={24} strokeWidth={1.5} />,
    title: 'Bespoke Culinary Experiences',
    desc: 'Curated menus from North Indian thalis to coastal seafood feasts, managed day-by-day for every guest.',
    accent: 'rgba(139,158,135,0.10)',
  },
  {
    icon: <Music className="text-[#C5A85C]" size={24} strokeWidth={1.5} />,
    title: 'Sangeet & Entertainment',
    desc: 'Live orchestras, folk artists, DJ setups and choreographed performances that electrify every celebration.',
    accent: 'rgba(201,168,76,0.08)',
  },
  {
    icon: <Crown className="text-[#C5A85C]" size={24} strokeWidth={1.5} />,
    title: 'Grand Baraat Procession',
    desc: 'Traditional, stylish or DJ-on-wheels — we orchestrate the groom\'s arrival as a cinematic spectacle.',
    accent: 'rgba(201,168,76,0.08)',
  },
  {
    icon: <Bed className="text-[#C5A85C]" size={24} strokeWidth={1.5} />,
    title: 'Luxury Accommodation',
    desc: 'Block-book heritage suites, garden cottages and lakeside villas, curated for every guest\'s comfort.',
    accent: 'rgba(201,168,76,0.08)',
  },
]

export function OfferingsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#120F0B' }}
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-caption mb-5" style={{ color: '#C9A84C' }}>What We Offer</p>
          <h2 className="text-headline">
            Everything Your
            <br />
            <span className="gold-text-animate italic">Dream Wedding Deserves</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offerings.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card3D intensity={6}>
                <div
                  className="rounded-2xl p-8 h-full border transition-all duration-500 cursor-default group"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${item.accent} 100%)`,
                    border: '1px solid rgba(201,168,76,0.12)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-7"
                    style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="mb-4 text-lg font-medium"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#FAF3E8', fontSize: '1.25rem' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-body leading-relaxed" style={{ color: 'rgba(250,243,232,0.5)' }}>
                    {item.desc}
                  </p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
