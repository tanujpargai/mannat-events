'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Card3D } from '@/components/ui/Card3D'

export function GallerySection() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      style={{ background: '#0A0807' }}
    >
      {/* Corner glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 100% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-caption mb-5" style={{ color: '#C9A84C' }}>Gallery</p>
          <h2 className="text-headline">
            A Glimpse of
            <br />
            <span className="gold-text-animate italic font-light">Pure Elegance</span>
          </h2>
        </motion.div>

        {/* Asymmetric 3D gallery grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Left panel: Traditional Floral Mandap */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-7"
          >
            <Card3D intensity={8}>
              <div
                className="relative rounded-3xl overflow-hidden group cursor-pointer"
                style={{
                  border: '1px solid rgba(201,168,76,0.18)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                  aspectRatio: '4/3',
                }}
              >
                <img
                  src="/traditional.jpg"
                  alt="Floral mandap at a royal heritage estate"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-[#0A0807]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 z-10">
                  <p className="text-caption mb-2" style={{ color: '#C9A84C' }}>The Ceremony</p>
                  <p className="font-serif text-2xl font-light text-white">Lakeside Floral Mandap</p>
                </div>
                {/* Gold shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-gold" />
              </div>
            </Card3D>
          </motion.div>

          {/* Right Top panel: Modern Reception Gastronomy */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-5"
          >
            <Card3D intensity={8}>
              <div
                className="relative rounded-3xl overflow-hidden group cursor-pointer"
                style={{
                  border: '1px solid rgba(201,168,76,0.15)',
                  boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
                  aspectRatio: '16/10',
                }}
              >
                <img
                  src="/modern.jpg"
                  alt="Modern elegant reception feast setting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0807]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <p className="text-caption mb-1.5" style={{ color: '#C9A84C' }}>The Banquet</p>
                  <p className="font-serif text-xl font-light text-white">Modern Gold Reception</p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-gold" />
              </div>
            </Card3D>
          </motion.div>

          {/* Right Bottom panel: Heritage Palace Estates */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-5"
          >
            <Card3D intensity={8}>
              <div
                className="relative rounded-3xl overflow-hidden group cursor-pointer"
                style={{
                  border: '1px solid rgba(201,168,76,0.15)',
                  boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
                  aspectRatio: '16/10',
                }}
              >
                <img
                  src="/royal.jpg"
                  alt="Royal palace heritage venue destination"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0807]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <p className="text-caption mb-1.5" style={{ color: '#C9A84C' }}>The Estate</p>
                  <p className="font-serif text-xl font-light text-white">Heritage Royal Court</p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-gold" />
              </div>
            </Card3D>
          </motion.div>

          {/* New Bottom Left panel: Floral details (adding another for balance) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-7"
          >
            <Card3D intensity={8}>
              <div
                className="relative rounded-3xl overflow-hidden group cursor-pointer"
                style={{
                  border: '1px solid rgba(201,168,76,0.18)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                  aspectRatio: '16/10',
                }}
              >
                <img
                  src="/floral.jpg"
                  alt="Floral entryway decoration detail jasmine rose"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0807]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 z-10">
                  <p className="text-caption mb-2" style={{ color: '#C9A84C' }}>The Accents</p>
                  <p className="font-serif text-2xl font-light text-white">Signature Jasmin Entryways</p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-gold" />
              </div>
            </Card3D>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
