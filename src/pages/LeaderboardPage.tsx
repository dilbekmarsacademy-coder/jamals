import { useT } from '@/i18n'
import { useState } from 'react'
import { Award, Flame, Medal, Trophy } from 'lucide-react'
import type { LeaderboardPeriod, RankedEntry } from '@/types'
import { PageHeader } from '@/components/common/PageHeader'
import { Avatar } from '@/components/common/Avatar'
import { RankChange } from '@/components/common/RankChange'
import { BadgeTile } from '@/components/common/BadgeTile'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRanking } from '@/hooks/useRanking'
import { useQuery } from '@/hooks/useQuery'
import { api } from '@/services/api'
import { useAppStore, useStreak } from '@/store/useAppStore'
import { longestStreak } from '@/lib/streak'
import { cn, formatNumber } from '@/lib/utils'

const TOP_N = 10
const PERIODS: LeaderboardPeriod[] = ['weekly', 'monthly', 'all']

export default function LeaderboardPage() {
  const { t } = useT()
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly')
  const { rows, me, loading } = useRanking(period)

  const meOutsideTop = me && me.rank > TOP_N

  return (
    <>
      <PageHeader
        title={t('nav.leaderboard')}
        subtitle={t('lb.subtitle')}
        action={
          <Tabs value={period} onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}>
            <TabsList>
              {PERIODS.map((p) => (
                <TabsTrigger key={p} value={p}>{t(`lb.${p}`)}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <div className="flex min-w-0 flex-col gap-5">
          {loading ? (
            <Card>
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="mt-3 h-11 w-full first:mt-0" />)}
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-[2.5rem_1fr_auto_auto] items-center gap-3 border-b border-border px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted sm:grid-cols-[2.5rem_1fr_4rem_3.5rem_5.5rem]">
                <span>#</span>
                <span>{t('lb.student')}</span>
                <span className="hidden text-right sm:block">{t('lb.streak')}</span>
                <span className="text-right">{t('lb.change')}</span>
                <span className="text-right">XP</span>
              </div>
              <ol>
                {rows.slice(0, TOP_N).map((r) => (
                  <Row key={r.id} entry={r} />
                ))}
              </ol>
              {meOutsideTop && me && (
                <div className="sticky bottom-16 z-10 lg:bottom-0">
                  {me.rank > TOP_N + 1 && (
                    <div className="border-t border-border bg-surface-sunken px-4 py-1 text-center text-xs text-subtle">{t('lb.gap', { from: TOP_N + 1, to: me.rank - 1 })}</div>
                  )}
                  <Row entry={me} pinned />
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <PersonalRecords currentRank={me?.rank} />
          <BadgeGallery />
        </div>
      </div>
    </>
  )
}

function Row({ entry, pinned }: { entry: RankedEntry; pinned?: boolean }) {
  const { t, tr } = useT()
  const medal = entry.rank <= 3 ? ['text-flare-500', 'text-muted', 'text-ember-500'][entry.rank - 1] : ''
  return (
    <li
      className={cn(
        'grid list-none grid-cols-[2.5rem_1fr_auto_auto] items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 sm:grid-cols-[2.5rem_1fr_4rem_3.5rem_5.5rem]',
        entry.isMe ? 'bg-primary-soft' : 'hover:bg-surface-sunken/60',
        pinned && 'bg-surface-raised',
      )}
      aria-current={entry.isMe ? 'true' : undefined}
    >
      <span className={cn('flex items-center gap-1 text-sm font-semibold tabular-nums', medal || 'text-muted')}>
        {entry.rank <= 3 && <Medal className="size-3.5" aria-hidden />}
        {entry.rank}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={entry.name} seed={entry.avatarSeed} className="size-8 rounded-md text-xs" />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            {entry.name}
            {entry.isMe && <span className="ml-1.5 rounded bg-primary px-1.5 py-px text-[11px] font-semibold text-white">{t('you')}</span>}
          </div>
          <div className="truncate text-xs text-muted">{entry.isMe || !entry.school ? t('lb.yourResult') : tr(entry.school)}</div>
        </div>
      </div>
      <span className="hidden items-center justify-end gap-1 text-[13px] tabular-nums text-muted sm:flex" title={t('dash.streak')}>
        <Flame className={cn('size-3.5', entry.streak ? 'text-ember-500' : 'text-subtle')} /> {entry.streak}
      </span>
      <RankChange change={entry.change} className="justify-end" />
      <span className="text-right text-sm font-semibold tabular-nums">{formatNumber(entry.xp)}</span>
    </li>
  )
}

function PersonalRecords({ currentRank }: { currentRank?: number }) {
  const { t } = useT()
  const bestRank = useAppStore((s) => s.bestRank)
  const best = [bestRank, currentRank].filter((x): x is number => typeof x === 'number').reduce((m, x) => Math.min(m, x), Infinity)
  const bestStreakStored = useAppStore((s) => s.bestStreak)
  const activeDays = useAppStore((s) => s.activeDays)
  const { current, activeToday } = useStreak()
  const bestStreak = Math.max(bestStreakStored, longestStreak(activeDays))

  return (
    <Card>
      <CardHeader>
        <CardTitle><Medal /> {t('lb.records')}</CardTitle>
      </CardHeader>
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border p-3">
        <span className="grid size-10 place-items-center rounded-lg bg-ember-500/10 text-ember-500">
          <Flame className="size-5" />
        </span>
        <div>
          <div className="text-xl font-semibold tabular-nums">{current} <span className="text-sm font-normal text-muted">{t('lb.streakDays')}</span></div>
          <div className="text-[13px] text-muted">{activeToday ? t('lb.todayCounted') : current ? t('lb.keepStreak') : t('lb.startStreak')}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={<Trophy className="size-4 text-muted" />} label={t('lb.bestRank')} value={Number.isFinite(best) ? t('dash.place', { n: best }) : '—'} sub={currentRank ? t('lb.nowRank', { n: currentRank }) : undefined} />
        <Stat icon={<Flame className="size-4 text-ember-500" />} label={t('lb.longest')} value={Math.max(bestStreak, current) ? t('unit.days', { n: Math.max(bestStreak, current) }) : '—'} sub={current >= bestStreak && current > 0 ? t('lb.currentRecord') : undefined} />
      </div>
    </Card>
  )
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted">{icon} {label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  )
}

function BadgeGallery() {
  const { t } = useT()
  const { data: badges, loading } = useQuery('badges', api.getBadges)
  const unlocked = useAppStore((s) => s.unlockedBadges)
  const count = badges?.filter((b) => unlocked[b.id]).length ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle><Award /> {t('lb.badges')}</CardTitle>
        <span className="text-xs font-semibold text-muted">{count} / {badges?.length ?? 0}</span>
      </CardHeader>
      {loading || !badges ? (
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          {[...badges]
            .sort((a, b) => Number(!!unlocked[b.id]) - Number(!!unlocked[a.id]))
            .map((b) => (
              <BadgeTile key={b.id} badge={b} unlockedAt={unlocked[b.id]} />
            ))}
        </div>
      )}
    </Card>
  )
}
