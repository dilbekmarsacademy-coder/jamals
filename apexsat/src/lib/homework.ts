import type { Attempt, Homework, HomeworkStatus } from '@/types'
import { addDays, fromKey } from './date'

/** Due at 23:59 local on the due day */
export function dueDate(hw: Homework, seededAt: string) {
  const d = addDays(fromKey(seededAt), hw.dueInDays)
  d.setHours(23, 59, 0, 0)
  return d
}

export function homeworkStatus(hw: Homework, attempt: Attempt | undefined, seededAt: string, now: Date): HomeworkStatus {
  if (attempt?.submittedAt) return 'COMPLETED'
  if (now > dueDate(hw, seededAt)) return 'OVERDUE'
  if (attempt && Object.keys(attempt.answers).length > 0) return 'IN_PROGRESS'
  return 'NOT_STARTED'
}

export const LATE_PENALTY = 0.2

/** XP for a submitted set: base share scales with accuracy; late work loses 20% */
export function homeworkXp(hw: Homework, score: number, late: boolean) {
  const raw = hw.xp * (0.4 + 0.6 * score)
  return Math.round(raw * (late ? 1 - LATE_PENALTY : 1))
}

export const answeredCount = (attempt: Attempt | undefined) => (attempt ? Object.keys(attempt.answers).length : 0)
