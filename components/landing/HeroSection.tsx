'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Props {
  isLoggedIn: boolean
}

function FloatingCard({
  src,
  alt,
  title,
  subtitle,
  depth,
  mouseX,
  mouseY,
  customStyle,
}: {
  src: string
  alt: string
  title: string
  subtitle: string
  depth: number // higher = more movement
  mouseX: any
  mouseY: any
  customStyle?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  // Transform values for 3D card tilt based on mouse position
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 25, stiffness: 200 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 25, stiffness: 200 })
  
  // Parallax translation based on depth
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth * 25, depth * 25]), { damping: 25, stiffness: 200 })
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-depth * 25, depth * 25]), { damping: 25, stiffness: 200 })

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        ...customStyle,
      }}
      className="absolute rounded-2xl overflow-hidden cursor-pointer"
    >
      <div className="relative w-full h-full group">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Soft elegant vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        
        {/* Hover shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-gold" />
        
        {/* Content with 3D translation */}
        <div
          style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
          className="absolute bottom-5 left-5 right-5 z-10"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-1">
            {subtitle}
          </p>
          <h4 className="font-serif text-lg font-normal text-white">
            {title}
          </h4>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection({ isLoggedIn }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Mouse position hooks for dynamic interactive 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)
    
    function handleMouseMove(e: MouseEvent) {
      if (!ref.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      // Normalize to range [-0.5, 0.5]
      mouseX.set(clientX / innerWidth - 0.5)
      mouseY.set(clientY / innerHeight - 0.5)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0"
      style={{
        background: 'linear-gradient(180deg, #0A0807 0%, #120F0B 50%, #0A0807 100%)',
      }}
    >
      {/* 3D background stars & floating gold dust */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full top-[15%] left-[10%] opacity-40 animate-pulse-gold"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full bottom-[10%] right-[10%] opacity-40 animate-pulse-gold"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Premium Typography & CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-[1px] w-8 block" style={{ background: '#C9A84C' }} />
            <span className="text-caption tracking-[0.3em] font-semibold" style={{ color: '#C9A84C' }}>
              Royal Destination Weddings
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-4xl md:text-6xl font-light leading-[1.1] mb-6 text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Where Royal Heritage
            <br />
            Meets <span className="gold-text-animate italic">Forever.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-lg"
            style={{ color: 'rgba(250,243,232,0.6)' }}
          >
            Orchestrating breathtaking destination weddings in Rajasthan's finest heritage palaces,
            Goa's sun-draped shores, and Kerala's tranquil backwaters. Designed for pure elegance.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href={isLoggedIn ? '/booking' : '/signup'} className="w-full sm:w-auto">
              <button
                className="group relative w-full sm:w-auto overflow-hidden rounded-full px-10 py-4.5 font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #9A7B2E 0%, #C9A84C 50%, #E8C97A 100%)',
                  color: '#0A0807',
                  boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
                }}
              >
                <span className="relative z-10">Start Planning ✦</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)' }}
                />
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto rounded-full px-9 py-4.5 font-semibold text-xs tracking-widest uppercase transition-all duration-300 border hover:bg-white/5"
                style={{
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: 'rgba(250,243,232,0.85)',
                }}
              >
                View Reservation
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D Parallax Photo Collage (No AI, Real classy photos) */}
        <div className="lg:col-span-6 relative h-[450px] md:h-[600px] w-full flex items-center justify-center [perspective:1500px]">
          {/* Card 1: Royal Palace (Deepest Layer) */}
          <FloatingCard
            src="/royal.jpg"
            alt="Royal palace heritage wedding venue"
            title="Heritage Palace Estates"
            subtitle="The Venues"
            depth={0.4}
            mouseX={mouseX}
            mouseY={mouseY}
            customStyle={{
              width: '280px',
              height: '380px',
              left: '5%',
              top: '10%',
              border: '1px solid rgba(201,168,76,0.2)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
              zIndex: 10,
            }}
          />

          {/* Card 2: Traditional Mandap (Middle Layer) */}
          <FloatingCard
            src="/traditional.jpg"
            alt="Traditional Indian wedding ceremony decoration"
            title="Sanskrit Rituals & Mandaps"
            subtitle="The Ceremonies"
            depth={0.8}
            mouseX={mouseX}
            mouseY={mouseY}
            customStyle={{
              width: '260px',
              height: '320px',
              right: '8%',
              top: '20%',
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 40px 90px rgba(0,0,0,0.8)',
              zIndex: 20,
            }}
          />

          {/* Card 3: Elegant Florals (Forefront Layer) */}
          <FloatingCard
            src="/floral.jpg"
            alt="Classy floral wedding entry"
            title="Jasmine & Marigold Décor"
            subtitle="The Accents"
            depth={1.2}
            mouseX={mouseX}
            mouseY={mouseY}
            customStyle={{
              width: '240px',
              height: '240px',
              left: '25%',
              bottom: '5%',
              border: '1px solid rgba(201,168,76,0.3)',
              boxShadow: '0 50px 100px rgba(0,0,0,0.9)',
              zIndex: 30,
            }}
          />

          {/* Connecting 3D golden thread lines */}
          <motion.div
            style={{
              translateX: useTransform(mouseX, [-0.5, 0.5], [-20, 20]),
              translateY: useTransform(mouseY, [-0.5, 0.5], [-20, 20]),
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* SVG containing golden lines connecting the cards for a constellation / network vibe */}
            <svg className="w-full h-full opacity-35" viewBox="0 0 500 500" fill="none">
              <path d="M120 180 L380 250 L200 400 Z" stroke="#C9A84C" strokeWidth="0.8" strokeDasharray="4 4" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
