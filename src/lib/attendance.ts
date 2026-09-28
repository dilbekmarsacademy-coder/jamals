import type { AttendanceRecord, DateKey } from '@/types'
import { lessons } from '@/data/lessons'
import { isClassDay } from '@/data/attendance'
import { addDays, startOfDay, toDateKey } from './date'

/**
 * Full attendance history derived from real activity:
 *  - a class day with activity → present
 *  - a past class day after sign-up with no activity → absent
 *  - today counts only once the user has studied (it's not over yet)
 */
export function buildAttendance(present: AttendanceRecord[], joinedAt: string, now = new Date()): AttendanceRecord[] {
  const byDate = new Map(present.map((r) => [r.date, r]))
  const out: AttendanceRecord[] = []
  const today = startOfDay(now)
  let cursor = startOfDay(new Date(joinedAt))
  let classIdx = 0
  while (cursor <= today) {
    const key: DateKey = toDateKey(cursor)
    const isToday = cursor.getTime() === today.getTime()
    const joinDay = key === toDateKey(new Date(joinedAt))
    if (isClassDay(cursor)) {
      const rec = byDate.get(key)
      if (rec) out.push(rec)
      else if (!isToday && !joinDay) out.push({ date: key, status: 'absent', lessonId: lessons[classIdx % lessons.length].id })
      classIdx++
    } else if (byDate.has(key)) {
      out.push(byDate.get(key)!) // studying on a free day still counts
    }
    cursor = addDays(cursor, 1)
  }
  return out
}
