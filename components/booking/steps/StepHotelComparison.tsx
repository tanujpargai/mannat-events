'use client'

import { motion } from 'framer-motion'
import { BookingFormData } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Check, X, Building2, Users, Bed, Sparkles, Utensils, IndianRupee } from 'lucide-react'

interface Props {
  data: BookingFormData
  onNext: (hotelId: string) => void
  onPrev: () => void
  isSubmitting: boolean
}

const DUMMY_HOTELS = [
  {
    id: 'hotel-1',
    name: 'The Oberoi Amarvilas',
    price: '45,00,000',
    roomCategory: 'Premier Rooms',
    rooms: 100,
    capacity: '300-500',
    decoration: 'Premium Floral & Lighting',
    catering: 'Multi-Cuisine Buffet',
    amenities: ['Spa', 'Pool', 'Valet', '24/7 Butler'],
    inclusions: ['Welcome Drinks', 'Stage Setup', 'DJ Setup'],
    exclusions: ['Liquor', 'Celebrity Artists'],
    taxes: '+ 18% GST',
  },
  {
    id: 'hotel-2',
    name: 'Taj Lake Palace',
    price: '60,00,000',
    roomCategory: 'Luxury Suites',
    rooms: 80,
    capacity: '200-400',
    decoration: 'Royal Heritage Theme',
    catering: 'Authentic Rajasthani & Continental',
    amenities: ['Boat Transfer', 'Jiva Spa', 'Private Dining'],
    inclusions: ['Boat Transfers', 'Folk Performances', 'Basic Sound'],
    exclusions: ['Drone Photography', 'Imported Liquor'],
    taxes: '+ 18% GST',
  },
  {
    id: 'hotel-3',
    name: 'Rambagh Palace',
    price: '55,00,000',
    roomCategory: 'Palace Rooms',
    rooms: 120,
    capacity: '400-800',
    decoration: 'Vintage Royal',
    catering: 'International Buffet',
    amenities: ['Polo Bar', 'Indoor Pool', 'Helipad', 'Golf'],
    inclusions: ['Elephant Welcome', 'Gala Dinner Setup', 'Lighting'],
    exclusions: ['Live Band', 'Pyrotechnics'],
    taxes: '+ 18% GST',
  },
  {
    id: 'hotel-4',
    name: 'ITC Grand Chola',
    price: '35,00,000',
    roomCategory: 'Executive Club',
    rooms: 150,
    capacity: '500-1000',
    decoration: 'Modern Elegance',
    catering: 'Pan-Indian Flavours',
    amenities: ['Kaya Kalp Spa', 'Multiple Pools', 'Cigar Lounge'],
    inclusions: ['Dance Floor', 'Audio/Visual Setup', 'Event Manager'],
    exclusions: ['Floral Extravaganzas', 'Specialty Performers'],
    taxes: '+ 18% GST',
  }
]

export function StepHotelComparison({ data, onNext, onPrev, isSubmitting }: Props) {
  
  // Base values from user data, if we want to show dynamic numbers we can, 
  // but for now the prompt requested dummy data for the hotels.
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0 w-full max-w-5xl mx-auto"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 6
        </span>
      </div>

      <h2 className="text-headline mb-3">Hotel Comparison</h2>
      <p className="text-body text-[#737373] mb-10">
        Review luxury venues that match your customized wedding package.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {DUMMY_HOTELS.map((hotel, i) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="flex flex-col h-full overflow-hidden hover:shadow-3d-hover transition-shadow duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] p-6 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
                <h3 className="text-xl font-serif font-medium mb-1 relative z-10">{hotel.name}</h3>
                <div className="flex items-center justify-center gap-1 text-[#C5A85C] relative z-10">
                  <IndianRupee size={16} strokeWidth={2.5} />
                  <span className="text-2xl font-bold">{hotel.price}</span>
                </div>
                <p className="text-xs text-[#A8A8A8] mt-1 relative z-10">Starting Package {hotel.taxes}</p>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col gap-5">
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 pb-5 border-b border-[#F0EDE9]">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#F5EDD6] rounded-md text-[#A08040]">
                      <Bed size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-0.5">Rooms</p>
                      <p className="text-sm font-semibold text-[#1A1A1A] leading-tight">{hotel.rooms} <span className="text-xs font-normal text-[#737373] block">{hotel.roomCategory}</span></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#F5EDD6] rounded-md text-[#A08040]">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-0.5">Capacity</p>
                      <p className="text-sm font-semibold text-[#1A1A1A] leading-tight">{hotel.capacity} <span className="text-xs font-normal text-[#737373] block">Guests</span></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#F5EDD6] rounded-md text-[#A08040]">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-0.5">Decoration</p>
                      <p className="text-sm font-medium text-[#1A1A1A] leading-snug">{hotel.decoration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-[#F5EDD6] rounded-md text-[#A08040]">
                      <Utensils size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-0.5">Catering</p>
                      <p className="text-sm font-medium text-[#1A1A1A] leading-snug">{hotel.catering}</p>
                    </div>
                  </div>
                </div>

                {/* Lists */}
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-2">Inclusions</p>
                    <ul className="space-y-1.5">
                      {hotel.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                          <Check size={14} className="text-[#065F46] mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-2">Exclusions</p>
                    <ul className="space-y-1.5">
                      {hotel.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[#737373]">
                          <X size={14} className="text-red-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-[#A8A8A8] uppercase tracking-wider mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {hotel.amenities.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-[#FDFBF7] border border-[#F0EDE9] text-[11px] font-medium text-[#737373]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
              </div>
              
              {/* Footer */}
              <div className="p-6 bg-[#FDFCFA] border-t border-[#F0EDE9] mt-auto">
                <Button 
                  variant="gold" 
                  className="w-full"
                  onClick={() => onNext(hotel.id)}
                  disabled={isSubmitting}
                >
                  Select This Hotel
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev} disabled={isSubmitting}>
          Previous
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} disabled={isSubmitting} className="w-full">
            Previous
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
