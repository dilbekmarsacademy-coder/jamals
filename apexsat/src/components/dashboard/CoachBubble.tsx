'use client'

import { useT, type MessageKey } from '@/i18n'
import { useDueMistakes, useHomeworkList, useStreak } from '@/hooks/useDerived'
import { CipherSays, type CipherMood } from '@/components/brand/Cipher'

/** Cipher picks the most relevant nudge for right now */
export function CoachBubble({ now }: { now: Date }) {
  const { t } = useT()
  const { streak, activeToday } = useStreak(now)
  const list = useHomeworkList(now)
  const due = useDueMistakes(now)
  const overdue = list.filter((h) => h.status === 'OVERDUE').length

  let mood: CipherMood = 'happy'
  let key: MessageKey = 'coach.great'
  let params: Record<string, number> = {}
  if (!activeToday && streak > 0) {
    mood = 'thinking'
    key = 'coach.streakRisk'
    params = { count: streak }
  } else if (overdue > 0) {
    mood = 'sad'
    key = 'coach.overdue'
    params = { count: overdue }
  } else if (due.length > 0) {
    mood = 'idle'
    key = 'coach.mistakes'
    params = { count: due.length }
  }
  return (
    <CipherSays mood={mood} size="sm">
      {t(key, params)}
    </CipherSays>
  )
}
