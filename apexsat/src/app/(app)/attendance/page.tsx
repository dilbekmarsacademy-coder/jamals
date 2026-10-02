'use client'

import { useMemo, useState } from 'react'
import { CalendarCheck, Clock, Crown, Flame, Lock, Sparkles, Star, Unlock } from 'lucide-react'
import type { SessionStatus } from '@/types'
import { useT, type MessageKey } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useNow } from '@/hooks/useNow'
import { fromKey } from '@/lib/date'
import { STATUS_POINTS } from '@/lib/attendance'
import { PageHeader } from '@/components/common/PageHeader'
import { MetricCard } from '@/components/common/MetricCard'
import { StatusPill } from '@/components/common/StatusPill'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heatmap, classHistory } from '@/components/attendance/Heatmap'
import { CipherSays } from '@/components/brand/Cipher'
import { cn } from '@/lib/utils'

const PERK_THRESHOLD = 0.9
type Filter = 'all' | SessionStatus

const FILTERS: { v: Filter; key: MessageKey }[] = [
  { v: 'all', key: 'common.all' },
  { v: 'attended', key: 'att.attended' },
  { v: 'late', key: 'att.late' },
  { v: 'missed', key: 'att.missed' },
  { v: 'bonus', key: 'att.bonus' },
]

export default function AttendancePage() {
  const { t, tr, locale } = useT()
  const now = useNow(60_000)
  const sessions = useApex((s) => s.sessions)
  const activity = useApex((s) => s.activity)
  const seededAt = useApex((s) => s.seededAt)
  const [filter, setFilter] = useState<Filter>('all')

  const history = useMemo(() => classHistory(sessions, activity, seededAt, now), [sessions, activity, seededAt, now])

  const stats = useMemo(() => {
    const counts = { attended: 0, late: 0, missed: 0, bonus: 0 }
    for (const h of history) if (h.status in counts) counts[h.status as SessionStatus]++
    const scheduled = counts.attended + counts.late + counts.missed
    const rate = scheduled ? (counts.attended + counts.late) / scheduled : 1
    let streak = 0
    for (let i = history.length - 1; i >= 0; i--) {
      const s = history[i].status
      if (s === 'attended' || s === 'late') streak++
      else if (s === 'missed') break
    }
    const points = (Object.keys(counts) as SessionStatus[]).reduce((sum, k) => sum + counts[k] * STATUS_POINTS[k], 0)
    return { counts, scheduled, rate, streak, points }
  }, [history])

  const log = useMemo(
    () =>
      history
        .filter((h) => h.status !== 'rest' && h.status !== 'upcoming')
        .reverse()
        .map((h) => ({
          ...h,
          status: h.status as SessionStatus,
          session: sessions[h.key],
        }))
        .filter((h) => filter === 'all' || h.status === filter)
        .slice(0, 40),
    [history, sessions, filter],
  )

  const pct = Math.round(stats.rate * 100)
  const perk = stats.rate >= PERK_THRESHOLD

  return (
    <div className="space-y-6">
      <PageHeader title={t('att.title')} subtitle={t('att.subtitle')} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CalendarCheck} tone="emerald" label={t('att.overall')} value={`${pct}%`} hint={t('att.overallHint', { present: stats.counts.attended + stats.counts.late, total: stats.scheduled })} />
        <MetricCard icon={Flame} tone="orange" label={t('att.streak')} value={t('att.classes', { count: stats.streak })} hint={t('att.streakHint')} />
        <MetricCard icon={Star} tone="gold" label={t('att.points')} value={stats.points} hint={t('att.pointsHint')} />
        <MetricCard icon={Sparkles} tone="violet" label={t('att.bonusSessions')} value={stats.counts.bonus} hint={t('att.bonusHint')} />
      </div>

      {/* Perk progress */}
      <div className={cn('relative overflow-hidden rounded-2xl border p-5', perk ? 'border-gold/40 bg-[linear-gradient(120deg,rgb(245_158_11/0.14),rgb(139_92_246/0.1))]' : 'border-line bg-surface/70')}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', perk ? 'bg-gold/20 text-gold-fg' : 'bg-surface-3/60 text-muted')}>
            <Crown className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-bold text-fg-strong">
              {perk ? <Unlock className="size-4 text-gold-fg" /> : <Lock className="size-4 text-muted" />}
              {t('att.perkTitle')}
            </p>
            <p className="mt-0.5 text-sm text-muted">{perk ? t('att.perkUnlocked') : t('att.perkLocked', { pct: PERK_THRESHOLD * 100 })}</p>
            <div className="relative mt-3 h-2.5 rounded-full bg-surface-3/70">
              <div className={cn('h-full rounded-full', perk ? 'bg-[linear-gradient(90deg,var(--gold),var(--orange))]' : 'bg-cyan')} style={{ width: `${pct}%` }} />
              <span className="absolute -top-1 h-4.5 w-0.5 rounded bg-fg-strong" style={{ left: `${PERK_THRESHOLD * 100}%` }} />
              <span className="absolute top-4 -translate-x-1/2 text-[10px] font-bold text-muted" style={{ left: `${PERK_THRESHOLD * 100}%` }}>
                {PERK_THRESHOLD * 100}%
              </span>
            </div>
          </div>
          <p className="font-display text-3xl font-extrabold tnum text-fg-strong md:ml-4">{pct}%</p>
        </div>
      </div>

      <Card>
        <CardBody>
          <Heatmap activity={activity} sessions={sessions} seededAt={seededAt} now={now} />
        </CardBody>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px] [&>*]:min-w-0">
        <Card>
          <CardHeader className="flex-col items-start sm:flex-row sm:items-center">
            <CardTitle>{t('att.sessions')}</CardTitle>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="w-full min-w-0 sm:w-auto">
              <TabsList className="flex max-w-full overflow-x-auto scrollbar-thin">
                {FILTERS.map((f) => (
                  <TabsTrigger key={f.v} value={f.v}>
                    {t(f.key)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardBody>
            <ul className="divide-y divide-line">
              {log.map(({ key, status, session }) => {
                const d = fromKey(key)
                const points = STATUS_POINTS[status]
                return (
                  <li key={key} className="flex items-center gap-3 py-3">
                    <div className="w-12 shrink-0 text-center">
                      <p className="text-[11px] font-semibold uppercase text-subtle">{d.toLocaleDateString(locale, { weekday: 'short' })}</p>
                      <p className="font-display text-lg font-extrabold tnum text-fg-strong">{d.getDate()}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg-strong">{session ? tr(session.topic) : status === 'bonus' ? t('att.selfStudy') : t('att.liveClass')}</p>
                      <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
                        <span>{d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</span>
                        {session?.checkIn && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
                            {t('att.checkIn', { time: session.checkIn })}
                          </span>
                        )}
                        {session && session.minutes > 0 && <span>{t('mission.mins', { count: session.minutes })}</span>}
                      </p>
                    </div>
                    <StatusPill status={status} />
                    <span className={cn('w-12 text-right text-xs font-bold tnum', points ? 'text-gold-fg' : 'text-subtle')}>+{points}</span>
                  </li>
                )
              })}
              {log.length === 0 && <li className="py-8 text-center text-sm text-muted">{t('att.empty')}</li>}
            </ul>
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>{t('att.breakdown')}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {(['attended', 'late', 'missed', 'bonus'] as const).map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <StatusPill status={s} className="w-28 justify-center" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3/70">
                    <div
                      className={cn('h-full rounded-full', { attended: 'bg-emerald', late: 'bg-gold', missed: 'bg-crimson', bonus: 'bg-violet' }[s])}
                      style={{ width: `${(stats.counts[s] / Math.max(1, stats.scheduled + stats.counts.bonus)) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-bold tnum">{stats.counts[s]}</span>
                </div>
              ))}
              <p className="pt-1 text-xs text-muted">{t('att.pointsRule')}</p>
            </CardBody>
          </Card>
          <CipherSays mood={perk ? 'happy' : 'thinking'}>{perk ? t('att.cipherGood', { pct }) : t('att.cipherPush')}</CipherSays>
        </div>
      </div>
    </div>
  )
}
