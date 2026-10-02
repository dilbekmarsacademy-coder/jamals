import type { MistakeEntry } from '@/types'
import { addDays } from './date'

/** Leitner intervals in days for boxes 1..4 */
export const BOX_INTERVALS = [0, 1, 3, 7]
export const MAX_BOX = 4

export const isDue = (m: MistakeEntry, now: Date) => !m.mastered && new Date(m.dueAt) <= now

/** Moves a mistake through the Leitner boxes after a retry */
export function reviewMistake(m: MistakeEntry, correct: boolean, chosen: number, now: Date): MistakeEntry {
  if (!correct) {
    return { ...m, box: 1, chosen, dueAt: now.toISOString(), timesWrong: m.timesWrong + 1, lastWrongAt: now.toISOString() }
  }
  if (m.box >= MAX_BOX) return { ...m, mastered: true }
  const box = m.box + 1
  return { ...m, box, dueAt: addDays(now, BOX_INTERVALS[box - 1]).toISOString() }
}
