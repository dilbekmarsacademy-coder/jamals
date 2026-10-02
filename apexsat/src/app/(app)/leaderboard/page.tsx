'use client'

import { useState } from 'react'
import { Timer, Trophy, Medal } from 'lucide-react'
import type { Tier } from '@/types'
import { useT } from '@/i18n'
import { useNow } from '@/hooks/useNow'
import { useBadgeProgress, useLeague } from '@/hooks/useDerived'
import { useLeagueRoster } from '@/hooks/queries'
import { badges } from '@/data/badges'
import { MY_TIER, PROMOTE, TIER_META } from '@/data/league'
import { nextWeekReset } from '@/lib/date'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { Countdown } from '@/components/common/Countdown'
import { BadgeChip } from '@/components/common/BadgeChip'
import { Avatar } from '@/components/common/Avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Standings } from '@/components/leaderboard/Standings'
import { TierLadder } from '@/components/leaderboard/TierLadder'
import { CipherSays } from '@/components/brand/Cipher'
import { cn } from '@/lib/utils'

function Podium({ top }: { top: { username: string; avatarHue: number; weekXp: number; isMe?: boolean }[] }) {
  const { n, t } = useT()
  const order = [1, 0, 2]
  const heights = ['h-24', 'h-32', 'h-20']
  const colors = ['#f59e0b', '#a8b4c7', '#c2773a'] // by rank: gold, silver, bronze
  return (
    <div className="flex items-end justify-center gap-3 pt-2">
      {order.map((i, col) => {
        const p = top[i]
        if (!p) return null
        return (
          <div key={i} className="flex w-24 flex-col items-center gap-2 sm:w-28">
            <Avatar name={p.username} hue={p.avatarHue} className="size-11 text-sm" ring={p.isMe} />
            <p className="w-full truncate text-center text-xs font-bold text-fg-strong">{p.isMe ? t('league.you') : p.username}</p>
            <p className="text-[11px] font-semibold tnum text-muted">{n(p.weekXp)} XP</p>
            <div className={cn('flex w-full items-start justify-center rounded-t-xl border border-b-0 border-line pt-2', heights[col])} style={{ background: `linear-gradient(${colors[i]}33, transparent)` }}>
              <Medal className="size-6" style={{ color: colors[i] }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function LeaderboardPage() {
  const { t, tr } = useT()
  const now = useNow(60_000)
  const [tier, setTier] = useState<Tier>(MY_TIER)
  const mine = useLeague(now)
  const other = useLeagueRoster(tier, tier !== MY_TIER)
  const progress = useBadgeProgress(now)
  const players = tier === MY_TIER ? mine.standings : other.data
  const unlocked = Object.values(progress).filter((p) => p.unlocked).length

  return (
    <div className="space-y-6">
      <PageHeader title={t('league.title')} subtitle={t('league.subtitle')} />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px] [&>*]:min-w-0">
        <Card>
          <CardBody className="space-y-5">
            <TierLadder selected={tier} onSelect={setTier} />
            {players ? (
              <>
                <Podium top={players.slice(0, 3)} />
                <Standings players={players} tier={tier} />
              </>
            ) : (
              <Skeleton className="h-96" />
            )}
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="size-4 text-violet-fg" />
                {t('league.reset')}
              </CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              <Countdown target={nextWeekReset(now)} />
              <p className="mt-3 text-xs text-muted">{t('league.resetHint', { n: PROMOTE })}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-cyan/12">
                  <Trophy className="size-5 text-cyan-fg" />
                </span>
                <div>
                  <p className="text-xs text-muted">{t('league.yourRank', { tier: tr(TIER_META[MY_TIER].name) })}</p>
                  <p className="font-display text-2xl font-extrabold tnum">#{mine.rank}</p>
                </div>
              </div>
              <CipherSays mood={mine.rank <= PROMOTE ? 'cheer' : 'thinking'} size="sm">
                {mine.rank <= PROMOTE ? t('league.cipherUp') : t('league.cipherPush', { n: mine.rank - PROMOTE, count: mine.rank - PROMOTE })}
              </CipherSays>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('badges.title')}</CardTitle>
          <span className="text-xs font-semibold tnum text-muted">{t('badges.count', { done: unlocked, total: badges.length })}</span>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-6">
            {[...badges]
              .sort((a, b) => Number(progress[b.id].unlocked) - Number(progress[a.id].unlocked))
              .map((b) => (
                <BadgeChip key={b.id} badge={b} {...progress[b.id]} />
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
