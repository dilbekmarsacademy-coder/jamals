import type { DateKey, SessionLog, SessionStatus } from '@/types'
import { CLASS_DAYS } from '@/data/seed'
import { fromKey, toKey, weekdayMon } from './date'

export type DayStatus = SessionStatus | 'upcoming' | 'rest'

/**
 * Attendance status for a calendar day. Logged sessions win; days after the
 * account was seeded are derived from activity (a class day with no study
 * counts as missed, studying on a free day counts as a bonus session).
 */
export function dayStatus(key: DateKey, sessions: Record<DateKey, SessionLog>, activity: Record<DateKey, number>, seededAt: DateKey, now: Date): DayStatus {
  const todayKey = toKey(now)
  const isClass = CLASS_DAYS.includes(weekdayMon(fromKey(key)))
  if (sessions[key]) return sessions[key].status
  if (key > todayKey) return isClass ? 'upcoming' : 'rest'
  const studied = (activity[key] ?? 0) > 0
  if (key === todayKey) return isClass ? 'upcoming' : studied ? 'bonus' : 'rest'
  if (key < seededAt) return studied && !isClass ? 'bonus' : 'rest'
  if (isClass) return studied ? 'attended' : 'missed'
  return studied ? 'bonus' : 'rest'
}

/** Share of scheduled classes attended (late counts as attended) */
export function attendanceRate(sessions: Record<DateKey, SessionLog>) {
  const classes = Object.values(sessions).filter((s) => s.status !== 'bonus')
  const present = classes.filter((s) => s.status === 'attended' || s.status === 'late').length
  return { rate: classes.length ? present / classes.length : 1, present, total: classes.length }
}

/** Points per status for the discipline score */
export const STATUS_POINTS: Record<SessionStatus, number> = { attended: 10, late: 5, missed: 0, bonus: 8 }
