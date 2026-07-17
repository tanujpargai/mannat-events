'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { DecorationTheme, BookingFormData } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  data: Partial<BookingFormData>
  themes: DecorationTheme[]
  onNext: (id: string, title: string) => void
  onPrev: () => void
}

/** Full-bleed 3D parallax theme card with mouse-driven image shift */
function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: DecorationTheme
  isSelected: boolean
  onSelect: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [imgStyle, setImgStyle] = useState({ transform: 'scale(1.06) translate(0px, 0px)' })
  const [cardStyle, setCardStyle] = useState({})

  function handleMouseMove(e: React.MouseEvent) {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width  - 0.5
    const y    = (e.clientY - rect.top)  / rect.height - 0.5

    // Image parallax
    setImgStyle({
      transform: `scale(1.1) translate(${x * -12}px, ${y * -12}px)`,
    })
    // Card 3D tilt
    setCardStyle({
      transform: `perspective(1200px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.05s linear',
    })
  }

  function handleMouseLeave() {
    setImgStyle({ transform: 'scale(1.06) translate(0px, 0px)' })
    setCardStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...cardStyle, transformStyle: 'preserve-3d' }}
      className={cn(
        'group relative w-full text-left rounded-3xl overflow-hidden cursor-pointer',
        'focus-visible:outline-none',
        isSelected
          ? 'ring-gold-glow shadow-3d-selected'
          : 'shadow-3d hover:shadow-3d-hover'
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#F0EDE8]">
        {theme.image_url ? (
          <img
            src={theme.image_url}
            alt={theme.title}
            style={{ ...imgStyle, transition: 'transform 0.1s linear' }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F5EDD6] to-[#F0E6C8]">
            <ImageOff size={28} className="text-[#C5A85C] opacity-50" strokeWidth={1.4} />
            <span className="text-xs text-[#A08040] font-medium">Image coming soon</span>
          </div>
        )}

        {/* Selected overlay */}
        {isSelected && (
          <>
            <div className="absolute inset-0 bg-[#C5A85C]/10" />
            <div className="absolute inset-0 shimmer-gold" />
            {/* Gold border inset */}
            <div className="absolute inset-0 ring-2 ring-inset ring-[#C5A85C]" />
          </>
        )}

        {/* Gold tick */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#C5A85C] flex items-center justify-center shadow-md">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className={cn(
        'px-6 py-5 border-x-2 border-b-2 rounded-b-3xl transition-colors duration-300',
        isSelected ? 'bg-[#FDFAF3] border-[#C5A85C]' : 'bg-white border-[#E8E2D8]'
      )}>
        <h3 className="text-lg font-serif font-medium text-[#1A1A1A] mb-1">
          {theme.title}
        </h3>
        {theme.description && (
          <p className="text-sm text-[#737373] leading-relaxed line-clamp-2">
            {theme.description}
          </p>
        )}
      </div>
    </button>
  )
}

export function StepDecorationTheme({ data, themes, onNext, onPrev }: Props) {
  const selected = data.decoration_theme_id ?? ''

  function handleSkip() {
    onNext('', '')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <h2 className="text-headline mb-3">Decoration Theme</h2>
      <p className="text-body text-[#737373] mb-10">
        Select the visual style that will define your entire celebration.
      </p>

      {themes.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-[#E8E2D8] bg-white p-6 shadow-3d">
          <p className="text-sm text-[#737373] mb-6">No decoration themes are available yet. You can continue or skip this step.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 28 }}
            >
              <ThemeCard
                theme={theme}
                isSelected={selected === theme.id}
                onSelect={() => onNext(theme.id, theme.title)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        {themes.length === 0 && (
          <Button size="lg" onClick={handleSkip}>Next Step</Button>
        )}
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          {themes.length === 0 && (
            <Button size="lg" onClick={handleSkip} className="flex-1">Next Step</Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}