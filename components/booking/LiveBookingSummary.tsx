import { BookingFormData } from '@/lib/types'
import { calculateDuration, getBaraatLabel } from '@/lib/utils/booking'

interface LiveBookingSummaryProps {
  data: Partial<BookingFormData>
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="py-3.5 border-b border-[#EEEAE4] last:border-0">
      <p className="text-[11px] font-semibold text-[#A08D62] uppercase tracking-[0.14em] mb-1">
        {label}
      </p>
      <p className="text-[14px] font-medium leading-relaxed text-[#1A1A1A] break-words">
        {value}
      </p>
    </div>
  )
}

export function LiveBookingSummary({ data }: LiveBookingSummaryProps) {
  const duration =
    data.check_in && data.check_out
      ? calculateDuration(data.check_in, data.check_out)
      : 0

  const hasData = Object.keys(data).some((k) => {
    const v = (data as Record<string, unknown>)[k]
    if (Array.isArray(v)) return v.length > 0
    return v !== undefined && v !== null && v !== ''
  })

  const assignedFunctions = data.functions?.filter((f) => f.day > 0) ?? []

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-3d">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE]">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#C5A85C] font-bold mb-1">
          Your Booking
        </p>
        <h3 className="text-lg font-serif font-medium text-[#1A1A1A]">
          Live Summary
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[#737373]">
          Updates automatically as you progress.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-2 max-h-[calc(100vh-220px)] overflow-y-auto">
        {!hasData && (
          <p className="py-8 text-sm leading-relaxed text-[#8A8A8A] text-center">
            Your selections will appear here as you plan your event.
          </p>
        )}

        <SummaryRow label="Check-in"  value={data.check_in} />
        <SummaryRow label="Check-out" value={data.check_out} />

        {duration > 0 && (
          <SummaryRow
            label="Duration"
            value={`${duration} ${duration === 1 ? 'night' : 'nights'}`}
          />
        )}

        {/* Day plans summary */}
        {data.day_plans && data.day_plans.length > 0 && (
          <div className="py-3.5 border-b border-[#EEEAE4]">
            <p className="text-[11px] font-semibold text-[#A08D62] uppercase tracking-[0.14em] mb-2">
              Daily Plan
            </p>
            <div className="space-y-2">
              {data.day_plans.map((plan) => (
                <div key={plan.day} className="text-[13px] text-[#1A1A1A]">
                  <span className="font-semibold">Day {plan.day}</span>
                  {' · '}{plan.rooms ?? 0} rm
                  {plan.lunch?.type && <>{' · '}<span className="capitalize">{plan.lunch.type}</span> lunch</>}
                  {plan.dinner?.type && <>{' · '}<span className="capitalize">{plan.dinner.type}</span> dinner</>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Functions */}
        {assignedFunctions.length > 0 && (
          <div className="py-3.5 border-b border-[#EEEAE4]">
            <p className="text-[11px] font-semibold text-[#A08D62] uppercase tracking-[0.14em] mb-2">
              Functions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {assignedFunctions.map((fn) => (
                <span
                  key={fn.function_id}
                  className="px-2 py-0.5 rounded-full bg-[#F5EDD6] text-[11px] font-medium text-[#A08040]"
                >
                  {fn.function_name} · D{fn.day}
                </span>
              ))}
            </div>
          </div>
        )}

        <SummaryRow label="Decoration" value={data.decoration_theme_title} />
        <SummaryRow label="Baraat"     value={data.baraat_style ? getBaraatLabel(data.baraat_style) : undefined} />
      </div>
    </div>
  )
}