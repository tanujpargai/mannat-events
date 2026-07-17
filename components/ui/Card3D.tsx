'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface Card3DProps {
  children: React.ReactNode
  className?: string
  /** Tilt intensity in degrees (default 10) */
  intensity?: number
  /** Disable tilt on mobile (default true) */
  mobileFlat?: boolean
}

/**
 * A 3D-tilt card that responds to mouse position with spring physics.
 * Wrap any selection card with this for the immersive depth effect.
 */
export function Card3D({
  children,
  className,
  intensity = 10,
  mobileFlat = true,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const spring = { damping: 20, stiffness: 280 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), spring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), spring)
  const scale   = useSpring(1, { damping: 20, stiffness: 300 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width  - 0.5)
    y.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  function handleMouseEnter() {
    scale.set(1.015)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle:  'preserve-3d',
        transformOrigin: 'center center',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(mobileFlat ? 'md:[perspective:1200px]' : '[perspective:1200px]', className)}
    >
      {children}
    </motion.div>
  )
}
