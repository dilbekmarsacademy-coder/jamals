import type {
  AppNotification, AttendanceRecord, DateKey, HomeworkProgress, LessonProgress, UserProfile, XpEvent,
} from '@/types'
import { addDays, toDateKey } from '@/lib/date'
import { homework, homeworkSeedStatus } from './homework'
import { generateAttendance } from './attendance'
import { defaultUser } from './user'
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
  attendance: AttendanceRecord[]
  notifications: AppNotification[]
  bestRank: number
  bestStreak: number
}

/** XP earned per day over the last 13 days (index 0 = yesterday). 0 = inactive day. */
const PAST_XP = [70, 45, 80, 60, 55, 70, 0, 90, 40, 0, 85, 60, 35]

/**
 * Builds the demo account relative to `now`, so dates (deadlines, streak, calendar)
 * always look fresh no matter when the app is opened.
 */
export function createSeed(now = new Date()): SeedState {
  const xpLog: XpEvent[] = []
  const activeDays: DateKey[] = []
  PAST_XP.forEach((amount, i) => {
    if (!amount) return
    const day = addDays(now, -(i + 1))
    day.setHours(17, 30, 0, 0)
    xpLog.push({ id: `seed-${i}`, amount, reason: 'Mashg‘ulot', at: day.toISOString() })
    activeDays.push(toDateKey(day))
  })

  const homeworkProgress: Record<string, HomeworkProgress> = {}
  for (const hw of homework) {
    const due = addDays(now, hw.dueInDays)
    due.setHours(23, 59, 0, 0)
    const status = homeworkSeedStatus[hw.id] ?? 'not_started'
    const answers: Record<string, number> = {}
    if (status === 'done') hw.questions.forEach((q) => (answers[q.id] = q.answerIndex))
    if (status === 'in_progress') answers[hw.questions[0].id] = hw.questions[0].answerIndex
    homeworkProgress[hw.id] = {
      status,
      dueDate: due.toISOString(),
      answers,
      ...(status === 'done' ? { score: 1, completedAt: addDays(now, hw.dueInDays - 1).toISOString() } : {}),
    }
  }

  const lessonProgress: Record<string, LessonProgress> = {
    'l-01': { watched: 1, completed: true, completedAt: addDays(now, -9).toISOString() },
    'l-02': { watched: 1, completed: true, completedAt: addDays(now, -5).toISOString() },
    'l-07': { watched: 1, completed: true, completedAt: addDays(now, -3).toISOString() },
    'l-03': { watched: 0.42, completed: false },
  }

  return {
    seededAt: now.toISOString(),
    onboarded: false,
    user: { ...defaultUser },
    xp: 5400,
    xpLog,
    activeDays,
    lessonProgress,
    homeworkProgress,
    attendance: generateAttendance(now),
    notifications: seedNotifications.map((n) => ({ ...n, createdAt: now.toISOString() })),
    bestRank: 13,
    bestStreak: 12,
  }
}
