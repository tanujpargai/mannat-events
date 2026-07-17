'use client'

export function MarqueeStrip() {
  const items = [
    'Palace Ceremonies',
    'Lakeside Mandaps',
    'Heritage Haveli Venues',
    'Curated Cuisine',
    'Grand Baraat',
    'Floral Architecture',
    'Mehendi Evenings',
    'Sangeet Nights',
    'Destination Suites',
    'Bespoke Decoration',
  ]
  const doubled = [...items, ...items]

  return (
    <div
      className="relative py-5 overflow-hidden border-y"
      style={{ borderColor: 'rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.04)' }}
    >
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8">
            <span
              className="text-sm font-medium tracking-[0.2em] uppercase"
              style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'Inter, sans-serif' }}
            >
              {item}
            </span>
            <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: '10px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
