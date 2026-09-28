import type { L10n, LeaderboardEntry, LeaderboardPeriod, RankedEntry, UserProfile } from '@/types'

interface Me {
  user: UserProfile
  /** XP earned in this period (all-time = total XP) */
  xp: number
  streak: number
  /** Rank at the last snapshot, if any — drives the ↑↓ indicator */
  prevRank?: number
}

export function rankLeaderboard(entries: LeaderboardEntry[], me: Me, period: LeaderboardPeriod): RankedEntry[] {
  const rows = [
    ...entries.map((e) => ({
      id: e.id, name: e.name, avatarSeed: e.avatarSeed, school: e.school,
      xp: e.xp[period], prev: e.prevRank[period] as number | undefined, streak: e.streak, isMe: false,
    })),
    {
      id: me.user.id, name: me.user.name, avatarSeed: me.user.avatarSeed, school: undefined as L10n | undefined,
      xp: me.xp, prev: me.prevRank, streak: me.streak, isMe: true,
    },
  ]
    // Ties: other students keep their place ahead of a newcomer with equal XP
    .sort((a, b) => b.xp - a.xp || Number(a.isMe) - Number(b.isMe))

  return rows.map((r, i) => ({
    id: r.id, name: r.name, avatarSeed: r.avatarSeed, school: r.school,
    xp: r.xp, rank: i + 1, change: r.prev ? r.prev - (i + 1) : 0, streak: r.streak, isMe: r.isMe,
  }))
}
