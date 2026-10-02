import type { L10n } from '@/types'

/** XP needed to go from `level` to `level + 1` */
export const xpForLevel = (level: number) => 250 + (level - 1) * 50

export function levelFromXp(totalXp: number) {
  let level = 1
  let rest = totalXp
  while (rest >= xpForLevel(level)) {
    rest -= xpForLevel(level)
    level++
  }
  const need = xpForLevel(level)
  return { level, into: rest, need, progress: rest / need }
}

/** Cumulative XP at the start of `level` */
export function xpAtLevel(level: number) {
  let total = 0
  for (let l = 1; l < level; l++) total += xpForLevel(l)
  return total
}

const TITLES: { from: number; title: L10n }[] = [
  { from: 1, title: { en: 'Rookie Scholar', uz: 'Yangi o‘quvchi', ru: 'Новичок' } },
  { from: 4, title: { en: 'Pattern Seeker', uz: 'Qonuniyat izlovchi', ru: 'Искатель закономерностей' } },
  { from: 8, title: { en: 'Equation Tamer', uz: 'Tenglama ustasi', ru: 'Укротитель уравнений' } },
  { from: 12, title: { en: 'Verbal Strategist', uz: 'Verbal strateg', ru: 'Вербальный стратег' } },
  { from: 17, title: { en: 'Score Architect', uz: 'Ball me’mori', ru: 'Архитектор баллов' } },
  { from: 23, title: { en: 'Apex Contender', uz: 'Apex da’vogari', ru: 'Претендент на вершину' } },
  { from: 30, title: { en: 'Apex Legend', uz: 'Apex afsonasi', ru: 'Легенда Apex' } },
]

export function levelTitle(level: number): L10n {
  let t = TITLES[0].title
  for (const row of TITLES) if (level >= row.from) t = row.title
  return t
}
