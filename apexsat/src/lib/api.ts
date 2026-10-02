import { lessons, getLesson } from '@/data/lessons'
import { homework, getHomework } from '@/data/homework'
import { leagueRoster } from '@/data/league'
import { badges } from '@/data/badges'
import type { Tier } from '@/types'

/**
 * Data-access layer for catalog content. Everything resolves from local mock
 * data today; swapping these bodies for `fetch()` calls is the only change
 * needed to move to a real backend — the TanStack Query hooks stay the same.
 * Per-student progress lives in the Zustand store (src/store/useApex.ts).
 */
export const api = {
  lessons: async () => lessons,
  lesson: async (id: string) => getLesson(id) ?? null,
  homework: async () => homework,
  homeworkItem: async (id: string) => getHomework(id) ?? null,
  league: async (tier: Tier) => leagueRoster(tier),
  badges: async () => badges,
}

export const queryKeys = {
  lessons: ['lessons'] as const,
  lesson: (id: string) => ['lessons', id] as const,
  homework: ['homework'] as const,
  homeworkItem: (id: string) => ['homework', id] as const,
  league: (tier: Tier) => ['league', tier] as const,
  badges: ['badges'] as const,
}
