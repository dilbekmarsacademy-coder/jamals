import { t, type TKey } from '@/i18n'
import type { LevelInfo } from '@/types'

const TIER_COUNT = 8

/** XP needed to go from `level` to `level + 1` — grows gently so early levels feel fast */
export const xpForLevel = (level: number) => 300 + (level - 1) * 150

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1
  let remaining = totalXp
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level++
  }
  const need = xpForLevel(level)
  return {
    level,
    tier: Math.min(TIER_COUNT - 1, Math.floor((level - 1) / 2)),
    xpIntoLevel: remaining,
    xpForLevel: need,
    progress: remaining / need,
    totalXp,
  }
}

/** Total XP at which `level` is reached */
export const xpAtLevel = (level: number) => {
  let sum = 0
  for (let l = 1; l < level; l++) sum += xpForLevel(l)
  return sum
}

/** Localized level title for a tier index */
export const levelTitle = (tier: number) => t(`level.${tier}` as TKey)
