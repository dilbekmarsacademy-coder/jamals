import { useT } from '@/i18n'
import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@/components/common/Avatar'
import { RankChange } from '@/components/common/RankChange'
import { useRanking } from '@/hooks/useRanking'
import { formatNumber, cn } from '@/lib/utils'

export function RankWidget() {
  const { t } = useT()
  const { rows, me, loading } = useRanking('weekly')

  if (loading || !me)
    return (
      <Card>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-5 h-12 w-24" />
        <Skeleton className="mt-4 h-24 w-full" />
      </Card>
    )

  const idx = rows.findIndex((r) => r.isMe)
  const around = rows.slice(Math.max(0, idx - 1), idx + 2)
  const ahead = idx > 0 ? rows[idx - 1] : null

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle><Trophy /> {t('dash.weeklyRank')}</CardTitle>
      </CardHeader>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tabular-nums">{t('dash.place', { n: me.rank })}</span>
        <RankChange change={me.change} />
      </div>
      <p className="mt-0.5 text-[13px] text-muted">
        {t('dash.amongStudents', { n: rows.length })}
        {me.change !== 0 && t(me.change > 0 ? 'dash.movedUp' : 'dash.movedDown', { n: Math.abs(me.change) })}
      </p>
      <ul className="mt-4 flex flex-col gap-1">
        {around.map((r) => (
          <li key={r.id} className={cn('flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm', r.isMe && 'bg-primary-soft font-medium')}>
            <span className="w-6 text-[13px] tabular-nums text-muted">{r.rank}</span>
            <Avatar name={r.name} seed={r.avatarSeed} className="size-7 rounded-md text-xs" />
            <span className="min-w-0 flex-1 truncate">{r.isMe ? t('you') : r.name}</span>
            <span className="text-[13px] tabular-nums text-muted">{formatNumber(r.xp)} XP</span>
          </li>
        ))}
      </ul>
      {ahead && (
        <p className="mt-3 text-[13px] text-muted">
          {t('dash.toNextPlace', { n: formatNumber(ahead.xp - me.xp + 1) })}
        </p>
      )}
      <Link to="/leaderboard" className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-primary-text hover:underline">
        {t('dash.fullRank')} <ArrowRight className="size-4" />
      </Link>
    </Card>
  )
}
