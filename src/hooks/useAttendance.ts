import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { buildAttendance } from '@/lib/attendance'
import { toDateKey } from '@/lib/date'

/** Attendance history (present + derived absences) since the user joined */
export function useAttendance() {
  const present = useAppStore((s) => s.attendance)
  const joinedAt = useAppStore((s) => s.user.joinedAt)
  const dayKey = toDateKey(new Date())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildAttendance(present, joinedAt), [present, joinedAt, dayKey])
}
