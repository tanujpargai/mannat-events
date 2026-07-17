import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { LandingNavbar }      from '@/components/landing/LandingNavbar'
import { HeroSection }        from '@/components/landing/HeroSection'
import { MarqueeStrip }       from '@/components/landing/MarqueeStrip'
import { OfferingsSection }   from '@/components/landing/OfferingsSection'
import { GallerySection }     from '@/components/landing/GallerySection'
import { ProcessSection }     from '@/components/landing/ProcessSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CTASection }         from '@/components/landing/CTASection'
import { LandingFooter }      from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Mannat Events — Destination Wedding Specialists',
  description:
    'Plan your dream Indian destination wedding with Mannat Events. Palaces, lakeside mandaps, curated cuisine and unforgettable ceremonies across Rajasthan, Goa, Kerala and beyond.',
  openGraph: {
    title: 'Mannat Events — Where Forever Begins',
    description: 'India\'s premier destination wedding specialists.',
    images: ['/wedding_mandap.png'],
  },
}

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <div className="relative" style={{ background: '#0A0807' }}>
      <LandingNavbar isLoggedIn={isLoggedIn} />

      <main>
        <HeroSection isLoggedIn={isLoggedIn} />
        <MarqueeStrip />
        <section id="offerings">
          <OfferingsSection />
        </section>
        <section id="gallery">
          <GallerySection />
        </section>
        <section id="process">
          <ProcessSection />
        </section>
        <TestimonialsSection />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>

      <LandingFooter />
    </div>
  )
}