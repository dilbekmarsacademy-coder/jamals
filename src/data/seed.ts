import type {
  AppNotification, AttendanceRecord, DateKey, HomeworkProgress, LeaderboardPeriod, LessonProgress, UserProfile, XpEvent,
} from '@/types'
import { addDays } from '@/lib/date'
import { homework } from './homework'
import { createDefaultUser } from './user'
import { seedNotifications } from './notifications'

export interface SeedState {
  seededAt: string
  onboarded: boolean
  user: UserProfile
  xp: number
  xpLog: XpEvent[]
  activeDays: DateKey[]
  lessonProgress: Record<string, LessonProgress>
  homeworkProgress: Record<string, HomeworkProgress>
  /** Only days the user actually studied; absences are derived (see lib/attendance.ts) */
  attendance: AttendanceRecord[]
  notifications: AppNotification[]
  /** null until the user has been ranked at least once */
  bestRank: number | null
  bestStreak: number
  /** Rank snapshot per period, used to show ↑↓ movement since the snapshot */
  rankSnapshots: Partial<Record<LeaderboardPeriod, { rank: number; at: string }>>
}

/**
 * A brand-new account: zero XP, no history, no badges.
 * Homework deadlines are scheduled forward from the moment the account is created.
 */
export function createSeed(now = new Date()): SeedState {
  const homeworkProgress: Record<string, HomeworkProgress> = {}
  for (const hw of homework) {
    const due = addDays(now, hw.dueInDays)
    due.setHours(23, 59, 0, 0)
    homeworkProgress[hw.id] = { status: 'not_started', dueDate: due.toISOString(), answers: {} }
  }

  return {
    seededAt: now.toISOString(),
    onboarded: false,
    user: createDefaultUser(now),
    xp: 0,
    xpLog: [],
    activeDays: [],
    lessonProgress: {},
    homeworkProgress,
    attendance: [],
    notifications: seedNotifications.map((n) => ({ ...n, createdAt: now.toISOString() })),
    bestRank: null,
    bestStreak: 0,
    rankSnapshots: {},
  }
}
