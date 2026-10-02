import type { DateKey } from '@/types'
import { addDays, toKey } from './date'

/**
 * Consecutive active days ending today — or yesterday, so the streak isn't
 * shown as broken before the student has had a chance to study today.
 * Days covered by a streak freeze keep the chain alive.
 */
export function computeStreak(activity: Record<DateKey, number>, freezeDays: DateKey[], now: Date) {
  const frozen = new Set(freezeDays)
  const todayKey = toKey(now)
  const activeToday = (activity[todayKey] ?? 0) > 0
  let day = activeToday ? now : addDays(now, -1)
  let count = 0
  for (;;) {
    const key = toKey(day)
    if ((activity[key] ?? 0) > 0 || frozen.has(key)) {
      count++
      day = addDays(day, -1)
    } else break
  }
  return { streak: count, activeToday, atRisk: !activeToday && count > 0 }
}
