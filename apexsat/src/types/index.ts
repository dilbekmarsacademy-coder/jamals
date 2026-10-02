import type { L10n } from '@/i18n/config'

export type { L10n }

/** Local calendar date without time, e.g. "2026-10-02" */
export type DateKey = string

export type Section = 'math' | 'rw'
export type Domain = 'algebra' | 'advanced_math' | 'craft_structure' | 'expression_ideas'
export type Difficulty = 'easy' | 'medium' | 'hard'

export const DOMAINS: Domain[] = ['algebra', 'advanced_math', 'craft_structure', 'expression_ideas']
export const DOMAIN_SECTION: Record<Domain, Section> = {
  algebra: 'math',
  advanced_math: 'math',
  craft_structure: 'rw',
  expression_ideas: 'rw',
}

/* ───────────────────────── Lessons ───────────────────────── */

export interface Chapter {
  /** Seconds from the start of the video */
  t: number
  title: L10n
}

export interface Resource {
  id: string
  title: L10n
  kind: 'pdf' | 'sheet' | 'link'
  size?: string
  /** Plain-text body for generated downloads (kind ≠ link) */
  body?: string
  url?: string
}

export interface FormulaGroup {
  id: string
  title: L10n
  items: { label: L10n; formula: string }[]
}

export interface Lesson {
  id: string
  module: number
  title: L10n
  summary: L10n
  domain: Domain
  youtubeId: string
  channel: string
  durationMin: number
  xp: number
  chapters: Chapter[]
  resources: Resource[]
  formulas: FormulaGroup[]
  homeworkId: string
}

export interface Note {
  id: string
  /** Video timestamp in seconds */
  t: number
  text: string
  createdAt: string
}

export interface LessonProgress {
  /** 0..1 — furthest point actually played */
  watched: number
  /** Last playhead position in seconds, used for "Resume" */
  position: number
  completed: boolean
  completedAt?: string
}

/* ───────────────────────── Practice ───────────────────────── */

export interface Question {
  id: string
  domain: Domain
  difficulty: Difficulty
  /** R&W questions carry a short passage shown in the left pane */
  passage?: string
  prompt: string
  choices: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explanation: L10n
}

export type HomeworkStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'OVERDUE' | 'COMPLETED'

export interface Homework {
  id: string
  title: L10n
  section: Section
  domain: Domain
  difficulty: Difficulty
  /** Due date offset from the day the demo account was seeded */
  dueInDays: number
  estMin: number
  xp: number
  lessonId?: string
  questions: Question[]
}

export type Annotation = { start: number; end: number; kind: 'hl' | 'strike' }

export interface Attempt {
  answers: Record<string, number>
  flagged: string[]
  /** Answer choices crossed out by the student, per question */
  eliminated: Record<string, number[]>
  /** Passage annotations per question */
  annotations: Record<string, Annotation[]>
  /** Seconds spent per question */
  time: Record<string, number>
  startedAt?: string
  submittedAt?: string
  /** 0..1 */
  score?: number
  xpEarned?: number
  late?: boolean
}

/* ───────────────────────── Mistake bank ───────────────────────── */

export interface MistakeEntry {
  questionId: string
  /** Where the mistake was made (homework id or "diagnostic") */
  source: string
  chosen: number
  /** Leitner box 1..4; correct in box 4 → mastered */
  box: number
  dueAt: string
  timesWrong: number
  lastWrongAt: string
  mastered: boolean
}

/* ───────────────────────── Social / attendance ───────────────────────── */

export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master'
export const TIERS: Tier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master']

export interface LeaguePlayer {
  id: string
  username: string
  avatarHue: number
  streak: number
  weekXp: number
  isMe?: boolean
}

export type SessionStatus = 'attended' | 'late' | 'missed' | 'bonus'

export interface SessionLog {
  date: DateKey
  status: SessionStatus
  /** Class topic or self-study label */
  topic: L10n
  minutes: number
  /** Check-in time "HH:MM" (absent for missed) */
  checkIn?: string
}

export interface BadgeDef {
  id: string
  name: L10n
  rule: L10n
  icon: string
  color: 'cyan' | 'violet' | 'gold' | 'orange' | 'emerald' | 'crimson'
  /** Target for progress-style badges */
  goal: number
}
