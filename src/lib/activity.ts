import type { XpEvent } from '@/types'
import { addDays, toDateKey, WEEKDAYS_SHORT_UZ } from './date'

export interface DayActivity {
  key: string
  label: string
  xp: number
  isToday: boolean
}

const sumByDay = (log: XpEvent[]) => {
  const m = new Map<string, number>()
  for (const e of log) {
    const k = toDateKey(new Date(e.at))
    m.set(k, (m.get(k) ?? 0) + e.amount)
  }
  return m
}

/** Last 7 days (oldest → today) + totals for this and the previous 7-day window */
export function getWeeklyActivity(log: XpEvent[], now = new Date()) {
  const byDay = sumByDay(log)
  const days: DayActivity[] = []
  for (let i = 6; i >= 0; i--) {
    const d = addDays(now, -i)
    const k = toDateKey(d)
    days.push({ key: k, label: WEEKDAYS_SHORT_UZ[(d.getDay() + 6) % 7], xp: byDay.get(k) ?? 0, isToday: i === 0 })
  }
  let prevTotal = 0
  for (let i = 7; i < 14; i++) prevTotal += byDay.get(toDateKey(addDays(now, -i))) ?? 0
  const total = days.reduce((s, d) => s + d.xp, 0)
  const activeCount = days.filter((d) => d.xp > 0).length
  const best = Math.max(...[...byDay.values()], 0)
  return { days, total, prevTotal, activeCount, bestDay: best }
}

export const xpSince = (log: XpEvent[], iso: string) =>
  log.filter((e) => e.at > iso).reduce((s, e) => s + e.amount, 0)

/** XP earned within the last `days` days (including today) */
export const xpInLastDays = (log: XpEvent[], days: number, now = new Date()) => {
  const from = addDays(now, -(days - 1))
  from.setHours(0, 0, 0, 0)
  return log.filter((e) => new Date(e.at) >= from).reduce((s, e) => s + e.amount, 0)
}
