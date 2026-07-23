'use client'

import { useReducer, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

import {
  BookingFormData,
  DayPlan,
  FunctionAssignment,
  MenuItem,
  DecorationTheme,
  WeddingFunction,
} from '@/lib/types'
import {
  calculateDuration,
  generateDefaultDayPlans,
} from '@/lib/utils/booking'

import { StepDates }             from './steps/StepDates'
import { StepDayPlan }            from './steps/StepDayPlan'
import { StepDecorationPackage }  from './steps/StepDecorationPackage'
import { StepDecorationTheme }   from './steps/StepDecorationTheme'
import { StepReview }            from './steps/StepReview'
import { StepMobileVerification } from './steps/StepMobileVerification'
import { StepHotelComparison }    from './steps/StepHotelComparison'
import { StepFinalEnquiry }       from './steps/StepFinalEnquiry'

import { DynamicProgressBar }    from './DynamicProgressBar'
import { LiveBookingSummary }    from './LiveBookingSummary'

// -------------------------------------------------------
// Step type system
// -------------------------------------------------------
type StepKind =
  | { kind: 'dates' }
  | { kind: 'day-plan' }
  | { kind: 'decoration-package' }
  | { kind: 'decoration-theme' }
  | { kind: 'review' }
  | { kind: 'mobile-verification' }
  | { kind: 'hotel-comparison' }
  | { kind: 'final-enquiry' }

function buildStepList(duration: number): StepKind[] {
  return [
    { kind: 'dates' },
    { kind: 'day-plan' },
    { kind: 'decoration-package' },
    { kind: 'decoration-theme' },
    { kind: 'review' },
    { kind: 'mobile-verification' },
    { kind: 'hotel-comparison' },
    { kind: 'final-enquiry' },
  ]
}

function stepLabel(step: StepKind): string {
  switch (step.kind) {
    case 'dates':              return 'Stay Details'
    case 'day-plan':           return 'Day-wise Planning'
    case 'decoration-package': return 'Decoration Package'
    case 'decoration-theme':   return 'Decoration Theme'
    case 'review':             return 'Click to See Prices'
    case 'mobile-verification': return 'Mobile Verification'
    case 'hotel-comparison':    return 'Hotel Comparison'
    case 'final-enquiry':       return 'Final Enquiry'
  }
}

// -------------------------------------------------------
// Wizard state
// -------------------------------------------------------
interface WizardState {
  stepIndex: number
  steps:     StepKind[]
  data:      Partial<BookingFormData>
}

type WizardAction =
  | { type: 'SET_DATES';         checkIn: string; checkOut: string }
  | { type: 'SET_DAY_PLAN';      day: number; plan: DayPlan }
  | { type: 'SET_ALL_DAY_PLANS'; plans: DayPlan[] }
  | { type: 'SET_FUNCTIONS';     assignments: FunctionAssignment[] }
  | { type: 'SET_DECORATION';    id: string; title: string }
  | { type: 'SET_DECORATION_PACKAGE'; package: string }
  | { type: 'SET_HOTEL';         hotelId: string }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'RESTORE';           state: WizardState }

function updateDayPlan(
  plans: DayPlan[],
  day: number,
  updater: (plan: DayPlan) => DayPlan
): DayPlan[] {
  return plans.map((p) => (p.day === day ? updater(p) : p))
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_DATES': {
      const duration = calculateDuration(action.checkIn, action.checkOut)
      const steps    = buildStepList(duration)
      const oldPlans = state.data.day_plans || []
      const defaultPlans = generateDefaultDayPlans(duration)
      
      const dayPlans = defaultPlans.map(defaultPlan => {
        const existing = oldPlans.find(p => p.day === defaultPlan.day)
        return existing ? existing : defaultPlan
      })

      return {
        ...state,
        steps,
        data: {
          ...state.data,
          check_in:  action.checkIn,
          check_out: action.checkOut,
          day_plans: dayPlans,
        },
      }
    }

    case 'SET_DAY_PLAN':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, () => action.plan),
        },
      }

    case 'SET_ALL_DAY_PLANS':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: action.plans,
        },
      }

    case 'SET_FUNCTIONS':
      return { ...state, data: { ...state.data, functions: action.assignments } }

    case 'SET_DECORATION':
      return {
        ...state,
        data: {
          ...state.data,
          decoration_theme_id:    action.id,
          decoration_theme_title: action.title,
        },
      }

    case 'SET_DECORATION_PACKAGE':
      return {
        ...state,
        data: {
          ...state.data,
          decorationPackage: action.package,
        },
      }

    case 'SET_HOTEL':
      return {
        ...state,
        data: {
          ...state.data,
          selected_hotel: action.hotelId,
        },
      }

    case 'NEXT':
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, state.steps.length - 1),
      }

    case 'PREV':
      return {
        ...state,
        stepIndex: Math.max(0, state.stepIndex - 1),
      }

    case 'RESTORE':
      return action.state

    default:
      return state
  }
}

const STORAGE_KEY = 'mannat-booking-v9'

function loadSavedState(): Partial<WizardState> | null {
  if (typeof window === 'undefined') return null
  // Clear out all old versioned keys so stale data can't bleed through
  ;['mannat-booking-v1', 'mannat-booking-v2', 'mannat-booking-v3', 'mannat-booking-v4', 'mannat-booking-v5', 'mannat-booking-v6', 'mannat-booking-v7', 'mannat-booking-v8'].forEach((k) => {
    try { localStorage.removeItem(k) } catch { /* ignore */ }
  })
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<WizardState>
    // Validate day_plans shape — if any plan is missing lunch/dinner, discard the cache
    const dayPlans = parsed.data?.day_plans
    if (dayPlans && Array.isArray(dayPlans)) {
      for (const plan of dayPlans) {
        if (!plan.lunch || !plan.dinner) {
          localStorage.removeItem(STORAGE_KEY)
          return null
        }
      }
    }
    return parsed
  } catch {
    return null
  }
}

const DEFAULT_WIZARD_STATE: WizardState = {
  stepIndex: 0,
  steps:     [{ kind: 'dates' }] as StepKind[],
  data:      {},
}

// -------------------------------------------------------
// Component
// -------------------------------------------------------
export function BookingWizard() {
  const router = useRouter()

  // Remote data (fetched once)
  const [menus,     setMenus]     = useReducer(
    (_: { veg: MenuItem[]; 'non-veg': MenuItem[] }, v: { veg: MenuItem[]; 'non-veg': MenuItem[] }) => v,
    { veg: [], 'non-veg': [] }
  )
  const [themes,    setThemes]    = useReducer((_: DecorationTheme[], v: DecorationTheme[]) => v, [])
  const [functions, setFunctions] = useReducer((_: WeddingFunction[], v: WeddingFunction[]) => v, [])
  const [isSubmitting, setSubmitting] = useReducer((_: boolean, v: boolean) => v, false)
  const [submitError,  setSubmitError] = useReducer((_: string, v: string) => v, '')

  // Wizard state — always start with default for SSR hydration safety
  const [state, dispatch] = useReducer(wizardReducer, DEFAULT_WIZARD_STATE)

  // Restore saved form data from localStorage AFTER client hydration (avoids SSR mismatch).
  // Always reset stepIndex to 0 so the wizard always starts from Step 1 (Stay Details),
  // regardless of which step the user was on when they last left the page.
  useEffect(() => {
    const saved = loadSavedState()
    if (saved?.data && saved.steps) {
      dispatch({
        type: 'RESTORE',
        state: {
          ...saved as WizardState,
          stepIndex: 0, // always start from Step 1
        },
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount only

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* storage full */ }
  }, [state])

  // Fetch remote data once on mount — then update step list based on what's available
  useEffect(() => {
    async function loadData() {
      try {
        const [menusRes, themesRes, functionsRes] = await Promise.all([
          fetch('/api/menus'),
          fetch('/api/decoration-themes'),
          fetch('/api/wedding-functions'),
        ])

        if (menusRes.ok) {
          const m = await menusRes.json()
          if (m && typeof m === 'object' && !Array.isArray(m)) {
            const vegItems    = Array.isArray(m.veg)        ? m.veg        : []
            const nonVegItems = Array.isArray(m['non-veg']) ? m['non-veg'] : []
            setMenus({ veg: vegItems, 'non-veg': nonVegItems })
          }
        }

        if (themesRes.ok) {
          const t = await themesRes.json()
          const arr = Array.isArray(t) ? t : []
          setThemes(arr)
        }

        if (functionsRes.ok) {
          const f = await functionsRes.json()
          const arr = Array.isArray(f) ? f : []
          setFunctions(arr)
        }

      } catch (err) {
        console.error('[BookingWizard] Failed to load reference data:', err)
      }
    }

    loadData()
  }, [])


  // Submit handler
  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(state.data),
      })

      if (!res.ok) {
        const err = await res.json()
        setSubmitError(err.error ?? 'Submission failed. Please try again.')
        return
      }

      const { booking_id } = await res.json()
      localStorage.removeItem(STORAGE_KEY)
      router.push(`/booking/confirmation?id=${booking_id}`)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }, [state.data, router])

  // ---- Current step ----
  const { stepIndex, steps, data } = state
  const currentStep = steps[stepIndex]

  // ---- Helpers ----
  function next() { dispatch({ type: 'NEXT' }) }
  function prev() { dispatch({ type: 'PREV' }) }

  function getDayPlan(day: number) {
    return data.day_plans?.find((p) => p.day === day)
  }

  // ---- Render step ----
  function renderStep(step: StepKind) {
    switch (step.kind) {
      case 'dates':
        return (
          <StepDates
            data={data}
            onNext={(vals) => {
              dispatch({ type: 'SET_DATES', checkIn: vals.check_in, checkOut: vals.check_out })
              next()
            }}
          />
        )

      case 'day-plan': {
        return (
          <StepDayPlan
            data={data}
            onUpdate={(plans) => dispatch({ type: 'SET_ALL_DAY_PLANS', plans })}
            onNext={() => {
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'decoration-package':
        return (
          <StepDecorationPackage
            data={data}
            onNext={(pkg) => {
              dispatch({ type: 'SET_DECORATION_PACKAGE', package: pkg })
              next()
            }}
            onPrev={prev}
          />
        )

      case 'decoration-theme':
        return (
          <StepDecorationTheme
            data={data}
            themes={themes}
            onNext={(id, title) => {
              dispatch({ type: 'SET_DECORATION', id, title })
              next()
            }}
            onPrev={prev}
          />
        )

      case 'review':
        return (
          <StepReview
            data={data as BookingFormData}
            onNext={next}
            onPrev={prev}
          />
        )

      case 'mobile-verification':
        return (
          <>
            {submitError && (
              <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                {submitError}
              </div>
            )}
            <StepMobileVerification
              data={data as BookingFormData}
              onPrev={prev}
              onSubmit={next}
              isSubmitting={isSubmitting}
            />
          </>
        )
        
      case 'hotel-comparison':
        return (
          <StepHotelComparison
            data={data as BookingFormData}
            onNext={(hotelId) => {
              dispatch({ type: 'SET_HOTEL', hotelId })
              next()
            }}
            onPrev={prev}
            isSubmitting={false}
          />
        )

      case 'final-enquiry':
        return (
          <StepFinalEnquiry
            data={data as BookingFormData}
            onPrev={prev}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )
    }
  }

  return (
    <div
      className="wizard-light min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 10% 20%, #FAF8F5 0%, #F5EDD6 100%)',
      }}
    >
      {/* Immersive background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft gold glow */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full top-[10%] left-[5%] opacity-30 animate-pulse-gold"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 75%)' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bottom-[10%] right-[5%] opacity-30 animate-pulse-gold"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 75%)' }}
        />

        {/* Floating rotating mandala */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 animate-spin-slow opacity-[0.03]">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#C9A84C" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="36" stroke="#C9A84C" strokeWidth="0.5"/>
            {[0,45,90,135,180,225,270,315].map(a => (
              <line key={a} x1="50" y1="2" x2="50" y2="98" stroke="#C9A84C" strokeWidth="0.3"
                style={{ transformOrigin: '50px 50px', transform: `rotate(${a}deg)` }} />
            ))}
            <polygon points="50,10 55,45 90,50 55,55 50,90 45,55 10,50 45,45" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>

        <div className="absolute -top-20 -right-20 w-72 h-72 animate-spin-slow opacity-[0.02]" style={{ animationDirection: 'reverse' }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#C9A84C" strokeWidth="0.5"/>
            <polygon points="50,10 55,45 90,50 55,55 50,90 45,55 10,50 45,45" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>
      </div>

      {/* 3D Progress Bar */}
      <DynamicProgressBar
        currentIndex={stepIndex}
        totalSteps={steps.length}
        currentLabel={stepLabel(currentStep)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        <div className="flex gap-10 items-start">
          {/* Main form area */}
          <main className="flex-1 min-w-0">
            <div className="max-w-3xl">
              <AnimatePresence mode="wait">
                <div key={currentStep.kind}>
                  {renderStep(currentStep)}
                </div>
              </AnimatePresence>
            </div>
          </main>

          {/* Live summary sidebar (desktop only) */}
          <aside className="hidden xl:block w-80 shrink-0 sticky top-28">
            <LiveBookingSummary data={data} />
          </aside>
        </div>
      </div>
    </div>
  )
}