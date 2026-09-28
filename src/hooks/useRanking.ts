import { useEffect, useMemo } from 'react'
import type { LeaderboardPeriod } from '@/types'
import { api } from '@/services/api'
import { useQuery } from './useQuery'
import { useAppStore, useStreak } from '@/store/useAppStore'
import { rankLeaderboard } from '@/lib/leaderboard'
import { xpSince } from '@/lib/activity'

export function useRanking(period: LeaderboardPeriod) {
  const { data, loading } = useQuery('leaderboard', api.getLeaderboard)
  const user = useAppStore((s) => s.user)
  const xp = useAppStore((s) => s.xp)
  const xpLog = useAppStore((s) => s.xpLog)
  const seededAt = useAppStore((s) => s.seededAt)
  const recordRank = useAppStore((s) => s.recordRank)
  const { current } = useStreak()

  const rows = useMemo(
    () => (data ? rankLeaderboard(data, { user, xp, earnedSinceSeed: xpSince(xpLog, seededAt), streak: current }, period) : []),
    [data, user, xp, xpLog, seededAt, current, period],
  )
  const me = rows.find((r) => r.isMe)

  useEffect(() => {
    if (me && period === 'all') recordRank(me.rank)
  }, [me, period, recordRank])

  return { rows, me, loading }
}
