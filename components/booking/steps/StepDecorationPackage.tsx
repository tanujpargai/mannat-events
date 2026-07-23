'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'
import { AlertCircle } from 'lucide-react'

interface Props {
  data: Partial<BookingFormData>
  onNext: (pkg: string) => void
  onPrev: () => void
}

const PACKAGES = [
  { id: 'Silver', title: 'Silver', description: 'Essential and elegant decoration.' },
  { id: 'Gold', title: 'Gold', description: 'Premium decoration with enhanced elements.' },
  { id: 'Platinum', title: 'Platinum', description: 'Luxurious and comprehensive decoration.' },
  { id: 'Luxury', title: 'Luxury', description: 'Ultimate bespoke decoration experience.' },
]

function PackageCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: typeof PACKAGES[0]
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative w-full text-left rounded-2xl overflow-hidden cursor-pointer p-6 transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]',
        isSelected
          ? 'bg-[#FDFAF3] border-2 border-[#C5A85C] shadow-[0_8px_30px_rgb(201,168,76,0.15)] ring-1 ring-inset ring-[#C5A85C]'
          : 'bg-white border-2 border-[#E8E2D8] hover:border-[#C5A85C] hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className={cn(
            'text-lg font-bold mb-1 transition-colors',
            isSelected ? 'text-[#1A1A1A]' : 'text-[#4A4A4A] group-hover:text-[#1A1A1A]'
          )}>
            {pkg.title}
          </h3>
          <p className="text-sm text-[#737373] leading-relaxed">
            {pkg.description}
          </p>
        </div>
        
        {/* Selected tick indicator */}
        <div className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
          isSelected 
            ? 'bg-[#C5A85C] shadow-md scale-100 opacity-100' 
            : 'bg-[#F0EDE9] scale-90 opacity-0 group-hover:opacity-100'
        )}>
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

export function StepDecorationPackage({ data, onNext, onPrev }: Props) {
  const [selectedPackage, setSelectedPackage] = useState(data.decorationPackage ?? '')
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!selectedPackage) {
      setError('Please select a decoration package to proceed.')
      return
    }
    setError('')
    onNext(selectedPackage)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 3
        </span>
      </div>

      <h2 className="text-headline mb-3">Decoration Package</h2>
      <p className="text-body text-[#737373] mb-8">
        Select a base decoration package for your events.
      </p>

      {error && (
        <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {PACKAGES.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 28 }}
          >
            <PackageCard
              pkg={pkg}
              isSelected={selectedPackage === pkg.id}
              onSelect={() => {
                setSelectedPackage(pkg.id)
                setError('') // Clear error on select
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] px-6 py-5">
        <p className="text-sm text-[#A08040] font-medium leading-relaxed italic">
          Disclaimer: You are currently selecting the standard decoration package. Decoration themes, colour palettes, floral arrangements, stage designs, lighting, and other décor customizations can be finalized later according to your preferences. At this stage, you are only selecting the base decoration package.
        </p>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" onClick={handleNext}>
          Next Step
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" onClick={handleNext} className="flex-1">
            Next Step
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
