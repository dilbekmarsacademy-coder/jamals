import type { DateKey } from '@/types'

export const toDateKey = (d: Date): DateKey => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const fromDateKey = (k: DateKey) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (d: Date, n: number) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** Whole calendar days from a to b (b − a) */
export const diffDays = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000)

export const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]
export const WEEKDAYS_SHORT_UZ = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
export const WEEKDAYS_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']

export const formatDate = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return `${date.getDate()}-${MONTHS_UZ[date.getMonth()].toLowerCase()}`
}

export const formatDateLong = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return `${WEEKDAYS_UZ[date.getDay()]}, ${date.getDate()}-${MONTHS_UZ[date.getMonth()].toLowerCase()} ${date.getFullYear()}`
}

/** "bugun", "ertaga", "2 kun qoldi", "3 kun o'tdi" */
export const relativeDue = (due: string, now = new Date()) => {
  const d = diffDays(now, new Date(due))
  if (d === 0) return 'Bugun'
  if (d === 1) return 'Ertaga'
  if (d === -1) return 'Kecha'
  if (d > 1) return `${d} kun qoldi`
  return `${-d} kun o‘tdi`
}

export const timeAgo = (iso: string, now = new Date()) => {
  const s = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'hozirgina'
  if (s < 3600) return `${Math.floor(s / 60)} daq oldin`
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`
  return `${Math.floor(s / 86400)} kun oldin`
}

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night'
export const getDayPart = (d = new Date()): DayPart => {
  const h = d.getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 23) return 'evening'
  return 'night'
}
