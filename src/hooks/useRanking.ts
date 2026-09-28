import { useEffect, useMemo } from 'react'
import type { LeaderboardPeriod } from '@/types'
import { api } from '@/services/api'
import { useQuery } from './useQuery'
import { useAppStore, useStreak } from '@/store/useAppStore'
import { rankLeaderboard } from '@/lib/leaderboard'
import { xpInLastDays } from '@/lib/activity'

/** How long a rank snapshot stays the "previous" position for ↑↓ */
const SNAPSHOT_DAYS: Record<LeaderboardPeriod, number> = { weekly: 7, monthly: 30, all: 7 }

export function useRanking(period: LeaderboardPeriod) {
  const { data, loading } = useQuery('leaderboard', api.getLeaderboard)
  const user = useAppStore((s) => s.user)
  const xp = useAppStore((s) => s.xp)
  const xpLog = useAppStore((s) => s.xpLog)
  const snapshot = useAppStore((s) => s.rankSnapshots[period])
  const recordRank = useAppStore((s) => s.recordRank)
  const setRankSnapshot = useAppStore((s) => s.setRankSnapshot)
  const { current } = useStreak()

  const periodXp = period === 'all' ? xp : xpInLastDays(xpLog, period === 'weekly' ? 7 : 30)

  const rows = useMemo(
    () => (data ? rankLeaderboard(data, { user, xp: periodXp, streak: current, prevRank: snapshot?.rank }, period) : []),
    [data, user, periodXp, current, snapshot?.rank, period],
  )
  const me = rows.find((r) => r.isMe)

  useEffect(() => {
    if (!me) return
    if (period === 'all') recordRank(me.rank)
    const stale = !snapshot || Date.now() - new Date(snapshot.at).getTime() > SNAPSHOT_DAYS[period] * 86_400_000
    if (stale) setRankSnapshot(period, me.rank)
  }, [me, period, snapshot, recordRank, setRankSnapshot])

  return { rows, me, loading }
}
