import type { DateKey } from '@/types'
import { getLang, t, type Lang } from '@/i18n'

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

const MONTHS: Record<Lang, string[]> = {
  uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}
/** Russian needs the genitive case after a day number: "28 сентября" */
const MONTHS_RU_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WEEKDAYS: Record<Lang, string[]> = {
  uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}
/** Monday-first short names for calendar headers */
const WEEKDAYS_SHORT: Record<Lang, string[]> = {
  uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
}

const asDate = (d: Date | string) => (typeof d === 'string' ? new Date(d) : d)

/** Month name, e.g. "Sentabr" / "Сентябрь" / "September" */
export const monthName = (month: number, lang: Lang = getLang()) => MONTHS[lang][month]
export const weekdaysShort = (lang: Lang = getLang()) => WEEKDAYS_SHORT[lang]

/** "28-sentabr" · "28 сентября" · "September 28" */
export const formatDate = (d: Date | string, lang: Lang = getLang()) => {
  const date = asDate(d)
  const day = date.getDate()
  const m = date.getMonth()
  if (lang === 'ru') return `${day} ${MONTHS_RU_GEN[m]}`
  if (lang === 'en') return `${MONTHS.en[m]} ${day}`
  return `${day}-${MONTHS.uz[m].toLowerCase()}`
}

/** "Dushanba, 28-sentabr 2026" · "Понедельник, 28 сентября 2026" · "Monday, September 28, 2026" */
export const formatDateLong = (d: Date | string, lang: Lang = getLang()) => {
  const date = asDate(d)
  const wd = WEEKDAYS[lang][date.getDay()]
  if (lang === 'en') return `${wd}, ${formatDate(date, lang)}, ${date.getFullYear()}`
  return `${wd}, ${formatDate(date, lang)} ${date.getFullYear()}`
}

/** "Bugun" / "Ertaga" / "2 kun qoldi" / "3 kun o‘tdi" (localized) */
export const relativeDue = (due: string, now = new Date()) => {
  const d = diffDays(now, new Date(due))
  if (d === 0) return t('date.today')
  if (d === 1) return t('date.tomorrow')
  if (d === -1) return t('date.yesterday')
  if (d > 1) return t('date.daysLeft', { n: d })
  return t('date.daysAgo', { n: -d })
}

export const timeAgo = (iso: string, now = new Date()) => {
  const s = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000)
  if (s < 60) return t('time.justNow')
  if (s < 3600) return t('time.minAgo', { n: Math.floor(s / 60) })
  if (s < 86400) return t('time.hoursAgo', { n: Math.floor(s / 3600) })
  return t('time.daysAgo', { n: Math.floor(s / 86400) })
}

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night'
export const getDayPart = (d = new Date()): DayPart => {
  const h = d.getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 23) return 'evening'
  return 'night'
}
