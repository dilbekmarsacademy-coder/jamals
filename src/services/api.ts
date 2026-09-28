/**
 * Data access layer. Every function is async and returns plain typed data,
 * so swapping the mock JSON for real `fetch()` calls later only touches this file.
 */
import type { BadgeDefinition, Homework, LeaderboardEntry, Lesson } from '@/types'
import { lessons } from '@/data/lessons'
import { homework } from '@/data/homework'
import { leaderboard } from '@/data/leaderboard'
import { badges } from '@/data/badges'

const LATENCY = { min: 200, max: 400 }
const delay = <T,>(value: T) =>
  new Promise<T>((resolve) =>
    setTimeout(() => resolve(value), LATENCY.min + Math.random() * (LATENCY.max - LATENCY.min)),
  )

export const api = {
  getLessons: (): Promise<Lesson[]> => delay(lessons),
  getLesson: (id: string): Promise<Lesson | undefined> => delay(lessons.find((l) => l.id === id)),
  getHomework: (): Promise<Homework[]> => delay(homework),
  getLeaderboard: (): Promise<LeaderboardEntry[]> => delay(leaderboard),
  getBadges: (): Promise<BadgeDefinition[]> => delay(badges),
}
