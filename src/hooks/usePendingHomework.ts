import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { getHomeworkStatus } from '@/lib/homework'
import { diffDays } from '@/lib/date'

/** Counts used in nav badges and the dashboard widget */
export function usePendingHomework() {
  const progress = useAppStore((s) => s.homeworkProgress)
  return useMemo(() => {
    const now = new Date()
    let pending = 0
    let overdue = 0
    let dueSoon = 0
    let inProgress = 0
    for (const p of Object.values(progress)) {
      const st = getHomeworkStatus(p, now)
      if (st === 'done') continue
      pending++
      if (st === 'overdue') overdue++
      else {
        if (st === 'in_progress') inProgress++
        if (diffDays(now, new Date(p.dueDate)) <= 2) dueSoon++
      }
    }
    return { pending, overdue, dueSoon, inProgress }
  }, [progress])
}
