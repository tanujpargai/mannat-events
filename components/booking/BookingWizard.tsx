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
import { StepDayRooms }          from './steps/StepDayRooms'
import { StepDayMealType }       from './steps/StepDayMealType'
import { StepDayMenuSelect }     from './steps/StepDayMenuSelect'
import { StepDayGuestCount }     from './steps/StepDayGuestCount'
import { StepWeddingFunctions }  from './steps/StepWeddingFunctions'
import { StepDecorationTheme }   from './steps/StepDecorationTheme'
import { StepBaraatStyle }       from './steps/StepBaraatStyle'
import { StepReview }            from './steps/StepReview'

import { DynamicProgressBar }    from './DynamicProgressBar'
import { LiveBookingSummary }    from './LiveBookingSummary'

// -------------------------------------------------------
// Step type system
// -------------------------------------------------------
type StepKind =
  | { kind: 'dates' }
  | { kind: 'day-rooms';          day: number }
  | { kind: 'day-lunch-type';     day: number }
  | { kind: 'day-lunch-menu';     day: number }
  | { kind: 'day-lunch-guests';   day: number }
  | { kind: 'day-dinner-type';    day: number }
  | { kind: 'day-dinner-menu';    day: number }
  | { kind: 'day-dinner-guests';  day: number }
  | { kind: 'functions' }
  | { kind: 'decoration' }
  | { kind: 'baraat' }
  | { kind: 'review' }

function buildStepList(duration: number): StepKind[] {
  const steps: StepKind[] = [{ kind: 'dates' }]
  for (let day = 1; day <= duration; day++) {
    steps.push({ kind: 'day-rooms',         day })
    steps.push({ kind: 'day-lunch-type',    day })
    steps.push({ kind: 'day-lunch-menu',    day })
    steps.push({ kind: 'day-lunch-guests',  day })
    steps.push({ kind: 'day-dinner-type',   day })
    steps.push({ kind: 'day-dinner-menu',   day })
    steps.push({ kind: 'day-dinner-guests', day })
  }
  steps.push({ kind: 'functions' })
  steps.push({ kind: 'decoration' })
  steps.push({ kind: 'baraat' })
  steps.push({ kind: 'review' })
  return steps
}

function stepLabel(step: StepKind): string {
  switch (step.kind) {
    case 'dates':              return 'Stay Dates'
    case 'day-rooms':          return `Day ${step.day} · Rooms`
    case 'day-lunch-type':     return `Day ${step.day} · Lunch`
    case 'day-lunch-menu':     return `Day ${step.day} · Lunch Menu`
    case 'day-lunch-guests':   return `Day ${step.day} · Lunch Guests`
    case 'day-dinner-type':    return `Day ${step.day} · Dinner`
    case 'day-dinner-menu':    return `Day ${step.day} · Dinner Menu`
    case 'day-dinner-guests':  return `Day ${step.day} · Dinner Guests`
    case 'functions':          return 'Functions'
    case 'decoration':         return 'Decoration'
    case 'baraat':             return 'Baraat'
    case 'review':             return 'Review'
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
  | { type: 'SET_DAY_ROOMS';     day: number; rooms: number }
  | { type: 'SET_LUNCH_TYPE';    day: number; mealType: 'veg' | 'non-veg' }
  | { type: 'SET_LUNCH_MENU';    day: number; ids: string[]; names: string[] }
  | { type: 'SET_LUNCH_GUESTS';  day: number; count: number }
  | { type: 'SET_DINNER_TYPE';   day: number; mealType: 'veg' | 'non-veg' }
  | { type: 'SET_DINNER_MENU';   day: number; ids: string[]; names: string[] }
  | { type: 'SET_DINNER_GUESTS'; day: number; count: number }
  | { type: 'SET_FUNCTIONS';     assignments: FunctionAssignment[] }
  | { type: 'SET_DECORATION';    id: string; title: string }
  | { type: 'SET_BARAAT';        style: string }
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
      const dayPlans = generateDefaultDayPlans(duration)
      return {
        ...state,
        steps,
        stepIndex: 1,
        data: {
          ...state.data,
          check_in:  action.checkIn,
          check_out: action.checkOut,
          day_plans: dayPlans,
        },
      }
    }

    case 'SET_DAY_ROOMS':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            rooms: action.rooms,
          })),
        },
      }

    case 'SET_LUNCH_TYPE':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            lunch: { ...p.lunch, type: action.mealType, menu_item_ids: [], menu_item_names: [] },
          })),
        },
      }

    case 'SET_LUNCH_MENU':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            lunch: { ...p.lunch, menu_item_ids: action.ids, menu_item_names: action.names },
          })),
        },
      }

    case 'SET_LUNCH_GUESTS':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            lunch: { ...p.lunch, guest_count: action.count },
          })),
        },
      }

    case 'SET_DINNER_TYPE':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            dinner: { ...p.dinner, type: action.mealType, menu_item_ids: [], menu_item_names: [] },
          })),
        },
      }

    case 'SET_DINNER_MENU':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            dinner: { ...p.dinner, menu_item_ids: action.ids, menu_item_names: action.names },
          })),
        },
      }

    case 'SET_DINNER_GUESTS':
      return {
        ...state,
        data: {
          ...state.data,
          day_plans: updateDayPlan(state.data.day_plans!, action.day, (p) => ({
            ...p,
            dinner: { ...p.dinner, guest_count: action.count },
          })),
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

    case 'SET_BARAAT':
      return { ...state, data: { ...state.data, baraat_style: action.style } }

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

const STORAGE_KEY = 'mannat-booking-v4'

function loadSavedState(): Partial<WizardState> | null {
  if (typeof window === 'undefined') return null
  // Clear out all old versioned keys so stale data can't bleed through
  ;['mannat-booking-v1', 'mannat-booking-v2', 'mannat-booking-v3'].forEach((k) => {
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

  // Restore from localStorage AFTER client hydration (avoids SSR mismatch)
  useEffect(() => {
    const saved = loadSavedState()
    if (saved?.data && saved.steps && typeof saved.stepIndex === 'number') {
      dispatch({ type: 'RESTORE', state: saved as WizardState })
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
            }}
          />
        )

      case 'day-rooms':
        return (
          <StepDayRooms
            day={step.day}
            data={data}
            onNext={(rooms) => {
              dispatch({ type: 'SET_DAY_ROOMS', day: step.day, rooms })
              next()
            }}
            onPrev={prev}
          />
        )

      case 'day-lunch-type': {
        const plan = getDayPlan(step.day)
        return (
          <StepDayMealType
            day={step.day}
            meal="lunch"
            currentType={plan?.lunch.type}
            onNext={(mealType) => {
              dispatch({ type: 'SET_LUNCH_TYPE', day: step.day, mealType })
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'day-lunch-menu': {
        const plan     = getDayPlan(step.day)
        const mealType = plan?.lunch.type ?? 'veg'
        return (
          <StepDayMenuSelect
            day={step.day}
            meal="lunch"
            mealType={mealType}
            menuItems={menus[mealType] ?? []}
            selectedIds={plan?.lunch.menu_item_ids ?? []}
            onNext={(ids, names) => {
              dispatch({ type: 'SET_LUNCH_MENU', day: step.day, ids, names })
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'day-lunch-guests': {
        const plan = getDayPlan(step.day)
        return (
          <StepDayGuestCount
            day={step.day}
            meal="lunch"
            currentCount={plan?.lunch.guest_count}
            onNext={(count) => {
              dispatch({ type: 'SET_LUNCH_GUESTS', day: step.day, count })
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'day-dinner-type': {
        const plan = getDayPlan(step.day)
        return (
          <StepDayMealType
            day={step.day}
            meal="dinner"
            currentType={plan?.dinner.type}
            onNext={(mealType) => {
              dispatch({ type: 'SET_DINNER_TYPE', day: step.day, mealType })
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'day-dinner-menu': {
        const plan     = getDayPlan(step.day)
        const mealType = plan?.dinner.type ?? 'non-veg'
        return (
          <StepDayMenuSelect
            day={step.day}
            meal="dinner"
            mealType={mealType}
            menuItems={menus[mealType] ?? []}
            selectedIds={plan?.dinner.menu_item_ids ?? []}
            onNext={(ids, names) => {
              dispatch({ type: 'SET_DINNER_MENU', day: step.day, ids, names })
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'day-dinner-guests': {
        const plan = getDayPlan(step.day)
        return (
          <StepDayGuestCount
            day={step.day}
            meal="dinner"
            currentCount={plan?.dinner.guest_count}
            onNext={(count) => {
              dispatch({ type: 'SET_DINNER_GUESTS', day: step.day, count })
              next()
            }}
            onPrev={prev}
          />
        )
      }

      case 'functions':
        return (
          <StepWeddingFunctions
            duration={calculateDuration(data.check_in ?? '', data.check_out ?? '')}
            functions={functions}
            assignments={data.functions ?? []}
            onNext={(assignments) => {
              dispatch({ type: 'SET_FUNCTIONS', assignments })
              next()
            }}
            onPrev={prev}
          />
        )

      case 'decoration':
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

      case 'baraat':
        return (
          <StepBaraatStyle
            data={data}
            onNext={(style) => {
              dispatch({ type: 'SET_BARAAT', style })
              next()
            }}
            onPrev={prev}
          />
        )

      case 'review':
        return (
          <>
            {submitError && (
              <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
                {submitError}
              </div>
            )}
            <StepReview
              data={data as BookingFormData}
              onSubmit={handleSubmit}
              onPrev={prev}
              isSubmitting={isSubmitting}
            />
          </>
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
                <div key={`${currentStep.kind}-${'day' in currentStep ? currentStep.day : ''}`}>
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