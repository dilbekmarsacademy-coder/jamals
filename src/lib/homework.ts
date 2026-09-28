import type { HomeworkProgress, HomeworkStatus, Subject, Difficulty } from '@/types'

export const getHomeworkStatus = (p: HomeworkProgress | undefined, now = new Date()): HomeworkStatus => {
  if (!p) return 'not_started'
  if (p.status === 'done') return 'done'
  if (new Date(p.dueDate) < now) return 'overdue'
  return p.status
}

export const STATUS_META: Record<HomeworkStatus, { dot: string; text: string; ring: string; bg: string }> = {
  not_started: { dot: 'bg-subtle', text: 'text-muted', ring: 'ring-border', bg: 'bg-surface-sunken' },
  in_progress: { dot: 'bg-primary', text: 'text-primary-text', ring: 'ring-primary/25', bg: 'bg-primary-soft' },
  overdue: { dot: 'bg-danger-500', text: 'text-danger-500', ring: 'ring-danger-500/30', bg: 'bg-danger-500/10' },
  done: { dot: 'bg-mint-500', text: 'text-mint-500', ring: 'ring-mint-500/25', bg: 'bg-mint-500/10' },
}

export const SUBJECT_META: Record<Subject, { className: string; icon: 'Calculator' | 'BookOpen' | 'PenLine' }> = {
  math: { className: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20', icon: 'Calculator' },
  reading: { className: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-amber-500/20', icon: 'BookOpen' },
  writing: { className: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20', icon: 'PenLine' },
}

export const DIFFICULTY_META: Record<Difficulty, { bars: number }> = {
  easy: { bars: 1 },
  medium: { bars: 2 },
  hard: { bars: 3 },
}
