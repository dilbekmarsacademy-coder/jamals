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
  title: string
  type: 'pdf' | 'link' | 'worksheet'
  url: string
  size?: string
}

export interface Lesson {
  id: string
  order: number
  title: string
  subject: Subject
  topic: string
  description: string
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
  explanation: string
}

/** Stored status — "overdue" is derived from dueDate, never stored */
export type HomeworkStoredStatus = 'not_started' | 'in_progress' | 'done'
export type HomeworkStatus = HomeworkStoredStatus | 'overdue'

export interface Homework {
  id: string
  title: string
  subject: Subject
  lessonId?: string
  /** Offset in days from the seed date; resolved into dueDate when seeding */
  dueInDays: number
  difficulty: Difficulty
  estimatedMin: number
  xpReward: number
  description: string
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
  school: string
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
  school: string
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'cosmic'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  tier: BadgeTier
  /** Human hint shown on locked badges */
  hint: string
}

export type AttendanceStatus = 'present' | 'absent'

export interface AttendanceRecord {
  date: DateKey
  status: AttendanceStatus
  lessonId: string
}

export type NotificationKind = 'badge' | 'deadline' | 'streak' | 'level' | 'info'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}

export interface XpEvent {
  id: string
  amount: number
  reason: string
  at: string
}

export type RewardEvent =
  | { id: string; type: 'xp'; amount: number; reason: string }
  | { id: string; type: 'badge'; badgeId: string }
  | { id: string; type: 'level'; level: number }
  | { id: string; type: 'streak'; days: number }

export interface LevelInfo {
  level: number
  title: string
  xpIntoLevel: number
  xpForLevel: number
  progress: number
  totalXp: number
}
