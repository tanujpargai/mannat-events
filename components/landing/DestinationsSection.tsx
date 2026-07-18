'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Card3D } from '@/components/ui/Card3D'
import { MapPin, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const AGRA_VENUES = [
  {
    id: 'taj-view',
    title: 'Taj View Terraces',
    tagline: 'Vows with a Monumental Backdrop',
    image: '/venue_palace.png',
    desc: 'Exchange rings or host sunset cocktails on curated rooftops framing the Taj Mahal. Elegant glass canopies, gold accents, and direct views of the world\'s greatest monument of love.',
    season: 'Oct – Mar',
    capacity: '50 – 250 guests',
    accent: '#C5A85C',
    highlights: ['Direct Taj Mahal views', 'Sunset cocktail decks', 'Curated photography sessions'],
  },
  {
    id: 'mughal-gardens',
    title: 'Mughal Garden Estates',
    tagline: 'Imperial Fountains & Red Sandstone',
    image: '/royal.jpg',
    desc: 'Replicate royal court dynamics on sprawling lawns flanked by traditional stone arches and lit pathways. Perfect for high-energy grand baraats, qawwali nights, and luxurious multi-day receptions.',
    season: 'Nov – Feb',
    capacity: '200 – 600 guests',
    accent: '#E3A387',
    highlights: ['Fountain-lit pathways', 'Qawwali courtyard setups', 'Traditional shehnai welcomes'],
  },
  {
    id: 'riverfront',
    title: 'Yamuna Riverfront Pavilions',
    tagline: 'Serenity by the Flowing Waters',
    image: '/wedding_mandap.png',
    desc: 'A tranquil riverside mandap decorated with fresh white jasmines and brass oil lamps. Gentle breezes, soft classical sitar chords, and sacred Vedic rituals under the canopy.',
    season: 'Nov – Apr',
    capacity: '100 – 300 guests',
    accent: '#8B9E87',
    highlights: ['Waterfront jasmine mandaps', 'Sunset classical sitar play', 'Brass oil lamp illumination'],
  },
]

export function DestinationsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [activeId, setActiveId] = useState('taj-view')

  const activeVenue = AGRA_VENUES.find(v => v.id === activeId) || AGRA_VENUES[0]

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-36 px-6 overflow-hidden"
      style={{ background: '#0A0807', borderTop: '1px solid rgba(201,168,76,0.06)' }}
    >
      {/* Dynamic ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none rounded-full blur-[140px] opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${activeVenue.accent}15 0%, transparent 70%)`
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 text-left"
          >
            <p className="text-caption mb-5" style={{ color: '#C5A85C' }}>Our Agra Canvases</p>
            <h2 className="text-headline lg:text-5xl">
              Agra Signature Venues
              <br />
              <span className="gold-text-animate italic font-light">Where Imperial History Frames Your Day</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 text-sm leading-relaxed"
            style={{ color: 'rgba(250,243,232,0.5)' }}
          >
            Operating exclusively in the historic city of Agra, we coordinate and style weddings across three distinct atmospheric themes.
          </motion.p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Tabs Column */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {AGRA_VENUES.map((venue, i) => {
                const isActive = venue.id === activeId
                return (
                  <motion.button
                    key={venue.id}
                    onClick={() => setActiveId(venue.id)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={cn(
                      'w-full text-left p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden',
                      isActive
                        ? 'border-[#C5A85C] bg-[#120F0B]'
                        : 'border-transparent bg-white/[0.01] hover:bg-white/[0.03]'
                    )}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-light" style={{ color: isActive ? '#FAF3E8' : 'rgba(250,243,232,0.55)' }}>
                          {venue.title}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: isActive ? '#C5A85C' : 'rgba(250,243,232,0.3)' }}>
                          {venue.tagline}
                        </p>
                      </div>
                      <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs group-hover:border-[#C5A85C]/50 transition-colors">
                        →
                      </span>
                    </div>
                    {/* Tiny gold edge line */}
                    {isActive && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#C5A85C]" />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Quick Promo Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="rounded-2xl border border-[#C5A85C]/20 p-6 bg-gradient-to-br from-[#120F0B] to-[#0A0807] hidden lg:block"
            >
              <h4 className="font-serif text-lg font-light text-white mb-2">Have a specific Agra venue?</h4>
              <p className="text-xs mb-5" style={{ color: 'rgba(250,243,232,0.5)' }}>
                We have tie-ups with Agra\'s premium luxury hotels and exclusive private garden estates.
              </p>
              <Link href="/booking">
                <button className="flex items-center gap-2 text-xs font-semibold text-[#C5A85C] hover:text-[#FAF3E8] transition-colors group">
                  Plan Agra Stay <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Interactive Feature Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Card3D intensity={4}>
                  <div
                    className="rounded-3xl border border-white/[0.08] overflow-hidden h-full grid grid-cols-1 md:grid-cols-2 relative group"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(201,168,76,0.04) 100%)',
                      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                    }}
                  >
                    
                    {/* Showcase Photo */}
                    <div className="aspect-[4/5] md:aspect-auto w-full relative overflow-hidden bg-[#120F0B]">
                      <img
                        src={activeVenue.image}
                        alt={activeVenue.title}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 md:hidden">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-black/60 border border-white/10 text-[#C5A85C] uppercase">
                          Agra Highlight
                        </span>
                      </div>
                    </div>

                    {/* Description & Details */}
                    <div className="p-8 flex flex-col justify-between relative z-10">
                      <div>
                        <span className="hidden md:inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-white/5 border border-white/10 text-[#C5A85C] uppercase mb-6">
                          Agra Highlight
                        </span>
                        <h3 className="font-serif text-3xl text-white mb-2 font-light">
                          {activeVenue.title}
                        </h3>
                        <p className="text-xs mb-5" style={{ color: activeVenue.accent }}>
                          {activeVenue.tagline}
                        </p>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(250,243,232,0.65)' }}>
                          {activeVenue.desc}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5 mb-6">
                          <div className="flex items-center gap-2.5">
                            <Calendar size={15} style={{ color: activeVenue.accent }} />
                            <div>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider">Best Months</p>
                              <p className="text-xs font-semibold text-[#FAF3E8]">{activeVenue.season}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Users size={15} style={{ color: activeVenue.accent }} />
                            <div>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider">Capacity</p>
                              <p className="text-xs font-semibold text-[#FAF3E8]">{activeVenue.capacity}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Signature Elements</p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {activeVenue.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-xs bg-white/[0.03] border border-white/5 text-[#FAF3E8]"
                            >
                              ✦ {h}
                            </span>
                          ))}
                        </div>

                        {/* Plan Here Action */}
                        <Link href="/booking">
                          <button
                            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                            style={{
                              background: `linear-gradient(135deg, ${activeVenue.accent}bb 0%, ${activeVenue.accent}dd 100%)`,
                              color: '#0A0807',
                            }}
                          >
                            Plan here in Agra <ArrowRight size={13} className="group-hover/btn:translate-x-1.5 transition-transform" />
                          </button>
                        </Link>
                      </div>

                    </div>

                  </div>
                </Card3D>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
