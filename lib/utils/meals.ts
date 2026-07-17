import { DayPlan, MealSummary } from '@/lib/types'

/**
 * Calculates aggregated meal counts from a DayPlan array.
 * Sums the guest counts for each meal option.
 * Used on the admin booking detail page.
 */
export function calculateMealSummary(plans: DayPlan[]): MealSummary {
  const summary: MealSummary = {
    vegLunch: 0,
    nonVegLunch: 0,
    vegDinner: 0,
    nonVegDinner: 0,
    totalLunch: 0,
    totalDinner: 0,
  }

  for (const plan of plans ?? []) {
    const lunchType = plan.lunch?.type
    const lunchGuests = plan.lunch?.guest_count ?? 0
    if (lunchType === 'veg')     summary.vegLunch += lunchGuests
    if (lunchType === 'non-veg') summary.nonVegLunch += lunchGuests

    const dinnerType = plan.dinner?.type
    const dinnerGuests = plan.dinner?.guest_count ?? 0
    if (dinnerType === 'veg')     summary.vegDinner += dinnerGuests
    if (dinnerType === 'non-veg') summary.nonVegDinner += dinnerGuests
  }

  summary.totalLunch  = summary.vegLunch + summary.nonVegLunch
  summary.totalDinner = summary.vegDinner + summary.nonVegDinner

  return summary
}
