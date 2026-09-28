import type { LeaderboardEntry, LeaderboardPeriod, RankedEntry, UserProfile } from '@/types'
import { myPrevRank, mySeedPeriodXp } from '@/data/leaderboard'

interface Me {
  user: UserProfile
  xp: number
  /** XP earned after seeding — added to weekly/monthly seed values */
  earnedSinceSeed: number
  streak: number
}

export function rankLeaderboard(entries: LeaderboardEntry[], me: Me, period: LeaderboardPeriod): RankedEntry[] {
  const myXp = period === 'all' ? me.xp : mySeedPeriodXp[period] + me.earnedSinceSeed
  const rows = [
    ...entries.map((e) => ({
      id: e.id, name: e.name, avatarSeed: e.avatarSeed, school: e.school,
      xp: e.xp[period], prev: e.prevRank[period], streak: e.streak, isMe: false,
    })),
    {
      id: me.user.id, name: me.user.name, avatarSeed: me.user.avatarSeed, school: 'Siz',
      xp: myXp, prev: myPrevRank[period], streak: me.streak, isMe: true,
    },
  ].sort((a, b) => b.xp - a.xp)

  return rows.map((r, i) => ({
    id: r.id, name: r.name, avatarSeed: r.avatarSeed, school: r.school,
    xp: r.xp, rank: i + 1, change: r.prev - (i + 1), streak: r.streak, isMe: r.isMe,
  }))
}
