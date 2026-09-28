import type { AttendanceRecord } from '@/types'
import { addDays, toDateKey } from '@/lib/date'
import { lessons } from './lessons'

/** Classes run Monday–Saturday. Sunday is a free day (neutral in the calendar). */
export const isClassDay = (d: Date) => d.getDay() !== 0

/** Deterministic PRNG so the mock history looks the same on every reset */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generates ~3 months of history ending yesterday. The last 6 class days
 * are always "present" so the demo account starts with a live streak.
 */
export function generateAttendance(today = new Date(), days = 95): AttendanceRecord[] {
  const rand = mulberry32(20261205)
  const records: AttendanceRecord[] = []
  let lessonIdx = 0
  for (let i = days; i >= 1; i--) {
    const d = addDays(today, -i)
    if (!isClassDay(d)) continue
    const status = i <= 7 ? 'present' : rand() < 0.87 ? 'present' : 'absent'
    records.push({ date: toDateKey(d), status, lessonId: lessons[lessonIdx % lessons.length].id })
    lessonIdx++
  }
  return records
}
