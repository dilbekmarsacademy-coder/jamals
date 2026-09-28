import type { L10n } from '@/i18n/lang'

export type { L10n }

/** ISO date string without time, e.g. "2026-09-28" */
export type DateKey = string

export type Subject = 'math' | 'reading' | 'writing'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface UserProfile {
  id: string
  name: string
  avatarSeed: string
  targetScore: number
  currentScore: number
  /** ISO datetime of the SAT sitting */
  testDate: string
  focus: Subject
  joinedAt: string
}

export interface LessonMaterial {
  id: string
  title: L10n
  type: 'pdf' | 'link' | 'worksheet'
  url: string
  size?: string
}

export interface Lesson {
  id: string
  order: number
  title: L10n
  subject: Subject
  /** SAT domain name — kept in English on purpose (official College Board terms) */
  topic: string
  description: L10n
  youtubeId: string
  /** Approximate duration in minutes (the real value is read from the player) */
  durationMin: number
  xpReward: number
  materials: LessonMaterial[]
  /** Homework that continues this lesson ("Watch → Read → Do") */
  homeworkId: string
  channel: string
}

export interface Question {
  id: string
  prompt: string
  choices: string[]
  answerIndex: number
  explanation: L10n
}

/** Stored status — "overdue" is derived from dueDate, never stored */
export type HomeworkStoredStatus = 'not_started' | 'in_progress' | 'done'
export type HomeworkStatus = HomeworkStoredStatus | 'overdue'

export interface Homework {
  id: string
  title: L10n
  subject: Subject
  lessonId?: string
  /** Offset in days from the seed date; resolved into dueDate when seeding */
  dueInDays: number
  difficulty: Difficulty
  estimatedMin: number
  xpReward: number
  description: L10n
  questions: Question[]
}

export interface HomeworkProgress {
  status: HomeworkStoredStatus
  dueDate: string
  answers: Record<string, number>
  score?: number
  completedAt?: string
}

export interface LessonProgress {
  /** 0..1 fraction of the video actually watched */
  watched: number
  completed: boolean
  completedAt?: string
}

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all'

export interface LeaderboardEntry {
  id: string
  name: string
  avatarSeed: string
  xp: Record<LeaderboardPeriod, number>
  /** Rank in the previous period — used to compute ↑↓ */
  prevRank: Record<LeaderboardPeriod, number>
  streak: number
  school: L10n
}

export interface RankedEntry {
  id: string
  name: string
  avatarSeed: string
  xp: number
  rank: number
  change: number
  streak: number
  isMe: boolean
  /** undefined for the current user */
  school?: L10n
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'cosmic'

export interface BadgeDefinition {
  id: string
  name: L10n
  description: L10n
  icon: string
  tier: BadgeTier
  /** Human hint shown on locked badges */
  hint: L10n
}

export type AttendanceStatus = 'present' | 'absent'

export interface AttendanceRecord {
  date: DateKey
  status: AttendanceStatus
  lessonId: string
}

export type NotificationKind = 'badge' | 'deadline' | 'streak' | 'level' | 'info'

/**
 * Stored language-neutral: the text is rendered from `kind` + `params`
 * in the viewer's current language (see lib/notifications.ts).
 */
export interface AppNotification {
  id: string
  kind: NotificationKind
  params?: Record<string, string | number>
  createdAt: string
  read: boolean
  href?: string
}

export type XpSource = { type: 'lesson' | 'homework'; id: string }

export interface XpEvent {
  id: string
  amount: number
  source: XpSource
  at: string
}

export type RewardEvent =
  | { id: string; type: 'xp'; amount: number; source: XpSource }
  | { id: string; type: 'badge'; badgeId: string }
  | { id: string; type: 'level'; level: number }
  | { id: string; type: 'streak'; days: number }

export interface LevelInfo {
  level: number
  /** Index of the level title (see i18n keys level.0 … level.7) */
  tier: number
  xpIntoLevel: number
  xpForLevel: number
  progress: number
  totalXp: number
}
