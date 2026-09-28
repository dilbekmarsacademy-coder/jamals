import type { AttendanceRecord, DateKey } from '@/types'
import { addDays, toDateKey } from './date'

/**
 * Consecutive active days ending today — or ending yesterday if today
 * has no activity yet (the streak is still "alive" until midnight).
 */
export function computeStreak(activeDays: DateKey[], today = new Date()): { current: number; activeToday: boolean } {
  const set = new Set(activeDays)
  const activeToday = set.has(toDateKey(today))
  let cursor = activeToday ? today : addDays(today, -1)
  let current = 0
  while (set.has(toDateKey(cursor))) {
    current++
    cursor = addDays(cursor, -1)
  }
  return { current, activeToday }
}

export function longestStreak(activeDays: DateKey[]): number {
  const sorted = [...new Set(activeDays)].sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const k of sorted) {
    if (prev && toDateKey(addDays(new Date(prev + 'T00:00:00'), 1)) === k) run++
    else run = 1
    best = Math.max(best, run)
    prev = k
  }
  return best
}

/** Attendance streak counts consecutive *class* days attended (Sundays don't break it) */
export function attendanceStreak(records: AttendanceRecord[]): number {
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
  let n = 0
  for (const r of sorted) {
    if (r.status === 'present') n++
    else break
  }
  return n
}

export const attendanceRate = (records: AttendanceRecord[]) =>
  records.length ? records.filter((r) => r.status === 'present').length / records.length : 0
