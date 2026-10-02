'use client'

import Link from 'next/link'
import { ArrowRight, ChevronUp } from 'lucide-react'
import { useT } from '@/i18n'
import { useLeague } from '@/hooks/useDerived'
import { PROMOTE } from '@/data/league'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/common/Avatar'
import { TierBadge } from '@/components/common/TierBadge'
import { cn } from '@/lib/utils'

export function MiniLeague({ now }: { now: Date }) {
  const { t, n } = useT()
  const { standings, rank, tier } = useLeague(now)
  const start = Math.max(0, Math.min(rank - 3, standings.length - 5))
  const rows = standings.slice(start, start + 5)
  const ahead = standings[rank - 2]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dash.league')}</CardTitle>
        <TierBadge tier={tier} />
      </CardHeader>
      <CardBody className="pt-3">
        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-display text-4xl font-extrabold tnum text-fg-strong">#{rank}</span>
          <span className="text-sm text-muted">{rank <= PROMOTE ? t('league.inPromotion') : ahead ? t('league.behind', { xp: n(ahead.weekXp - standings[rank - 1].weekXp + 5) }) : ''}</span>
        </div>
        <ol className="space-y-1">
          {rows.map((p, i) => {
            const r = start + i + 1
            return (
              <li key={p.id} className={cn('flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm', p.isMe && 'bg-cyan/10 ring-1 ring-cyan/30')}>
                <span className={cn('w-5 text-right text-xs font-bold tnum', r <= PROMOTE ? 'text-emerald-fg' : 'text-muted')}>{r}</span>
                {r <= PROMOTE && <ChevronUp className="-mx-1 size-3.5 text-emerald-fg" />}
                <Avatar name={p.username} hue={p.avatarHue} className="size-6 text-[9px]" />
                <span className={cn('flex-1 truncate', p.isMe ? 'font-bold text-fg-strong' : 'text-fg')}>{p.isMe ? t('league.you') : p.username}</span>
                <span className="text-xs font-semibold tnum text-muted">{n(p.weekXp)} XP</span>
              </li>
            )
          })}
        </ol>
        <Link href="/leaderboard" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-fg hover:underline">
          {t('dash.fullLeaderboard')} <ArrowRight className="size-3.5" />
        </Link>
      </CardBody>
    </Card>
  )
}
