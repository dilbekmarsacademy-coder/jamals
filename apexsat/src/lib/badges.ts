import type { SeedState } from '@/data/seed'
import { badges } from '@/data/badges'
import { computeStreak } from './streak'

export type BadgeProgress = Record<string, { value: number; goal: number; unlocked: boolean; unlockedAt?: string }>

type BadgeInputs = Pick<SeedState, 'activity' | 'freezeDays' | 'attempts' | 'lessons' | 'notes' | 'badges' | 'flags'>

/** Pure progress calculation for every badge (used for tooltips and for unlock detection) */
export function badgeProgress(s: BadgeInputs, now: Date): BadgeProgress {
  const { streak } = computeStreak(s.activity, s.freezeDays, now)
  const activeDays = Object.values(s.activity).filter((xp) => xp > 0).length
  const perfectSets = Object.values(s.attempts).filter((a) => a.submittedAt && (a.score ?? 0) >= 0.9).length
  const lessonsDone = Object.values(s.lessons).filter((l) => l.completed).length
  const notes = Object.values(s.notes).reduce((n, list) => n + list.length, 0)

  const values: Record<string, number> = {
    night_owl: s.flags.nightOwl ? 1 : 0,
    sniper: s.flags.sniper ? 1 : 0,
    century_club: activeDays,
    streak_guardian: s.freezeDays.length > 0 ? 1 : 0,
    first_light: Math.min(1, lessonsDone),
    on_fire: streak,
    unstoppable: streak,
    perfectionist: perfectSets,
    marathoner: lessonsDone,
    mistake_slayer: s.flags.mastered,
    note_taker: notes,
    diamond_mind: 1,
  }

  const out: BadgeProgress = {}
  for (const b of badges) {
    const unlockedAt = s.badges[b.id]
    out[b.id] = { value: Math.min(values[b.id] ?? 0, b.goal), goal: b.goal, unlocked: Boolean(unlockedAt), unlockedAt }
  }
  return out
}

/** Badge ids whose goal is reached but which aren't unlocked yet */
export const newlyEarned = (p: BadgeProgress) => Object.entries(p).filter(([, v]) => !v.unlocked && v.value >= v.goal).map(([id]) => id)
