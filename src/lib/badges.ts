import type { AttendanceRecord, HomeworkProgress, LessonProgress } from '@/types'
import { lessons } from '@/data/lessons'
import { attendanceRate } from './streak'

export interface BadgeContext {
  xp: number
  streak: number
  lessonProgress: Record<string, LessonProgress>
  homeworkProgress: Record<string, HomeworkProgress>
  attendance: AttendanceRecord[]
  flags: { earlyBird?: boolean; nightOwl?: boolean }
}

const done = (lp: Record<string, LessonProgress>, ids: string[]) => ids.every((id) => lp[id]?.completed)

/** Pure rule table — easy to move server-side later */
export const badgeRules: Record<string, (c: BadgeContext) => boolean> = {
  'first-orbit': (c) => Object.values(c.lessonProgress).some((l) => l.completed),
  'lesson-5': (c) => Object.values(c.lessonProgress).filter((l) => l.completed).length >= 5,
  'lesson-all': (c) => done(c.lessonProgress, lessons.map((l) => l.id)),
  'hw-3': (c) => Object.values(c.homeworkProgress).filter((h) => h.status === 'done').length >= 3,
  'hw-10': (c) => Object.values(c.homeworkProgress).filter((h) => h.status === 'done').length >= 10,
  perfect: (c) => Object.values(c.homeworkProgress).some((h) => h.status === 'done' && h.score === 1),
  'streak-3': (c) => c.streak >= 3,
  'streak-7': (c) => c.streak >= 7,
  'streak-30': (c) => c.streak >= 30,
  'xp-1000': (c) => c.xp >= 1000,
  'xp-5000': (c) => c.xp >= 5000,
  'math-master': (c) => done(c.lessonProgress, lessons.filter((l) => l.subject === 'math').map((l) => l.id)),
  wordsmith: (c) => done(c.lessonProgress, lessons.filter((l) => l.subject !== 'math').map((l) => l.id)),
  'attendance-90': (c) => attendanceRate(c.attendance) >= 0.9,
  'early-bird': (c) => !!c.flags.earlyBird,
  'night-owl': (c) => !!c.flags.nightOwl,
}

export const evaluateBadges = (ctx: BadgeContext) =>
  Object.entries(badgeRules)
    .filter(([, rule]) => rule(ctx))
    .map(([id]) => id)
