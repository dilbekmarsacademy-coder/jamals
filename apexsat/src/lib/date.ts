import type { DateKey } from '@/types'
import { pad2 } from './utils'

export const DAY_MS = 86_400_000

/** Local-calendar key, e.g. "2026-10-02" */
export const toKey = (d: Date): DateKey => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

export function fromKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addDays(d: Date, days: number) {
  const out = new Date(d)
  out.setDate(out.getDate() + days)
  return out
}

export const addDaysKey = (key: DateKey, days: number) => toKey(addDays(fromKey(key), days))

/** Whole calendar days from a to b (b − a) */
export const diffDays = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS)

/** Monday-based weekday index: Mon = 0 … Sun = 6 */
export const weekdayMon = (d: Date) => (d.getDay() + 6) % 7

export const startOfWeek = (d: Date) => addDays(startOfDay(d), -weekdayMon(d))

/** Next Monday 00:00 — the weekly league reset */
export const nextWeekReset = (now: Date) => addDays(startOfWeek(now), 7)

/** First Saturday of the month at least `minDays` ahead, 08:00 local (typical SAT morning) */
export function upcomingTestDate(now: Date, minDays = 45): Date {
  const earliest = addDays(startOfDay(now), minDays)
  let d = new Date(earliest.getFullYear(), earliest.getMonth(), 1, 8)
  for (;;) {
    const sat = new Date(d)
    sat.setDate(1 + ((6 - sat.getDay() + 7) % 7))
    if (sat >= earliest) return sat
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1, 8)
  }
}

export function countdownParts(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime())
  const s = Math.floor(ms / 1000)
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60, done: ms === 0 }
}
