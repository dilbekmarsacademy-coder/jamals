'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { addDays, startOfWeek, toKey } from '@/lib/date'
import { dayStatus, type DayStatus } from '@/lib/attendance'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const DOT_STYLE: Record<DayStatus, string> = {
  attended: 'bg-emerald shadow-[0_0_12px_rgb(16_185_129/0.5)]',
  late: 'bg-gold shadow-[0_0_12px_rgb(245_158_11/0.45)]',
  missed: 'bg-crimson/80',
  bonus: 'bg-violet shadow-[0_0_12px_rgb(139_92_246/0.5)]',
  upcoming: 'border-2 border-dashed border-cyan/60 bg-transparent',
  rest: 'bg-surface-3/70',
}

export const STATUS_KEY = {
  attended: 'att.attended',
  late: 'att.late',
  missed: 'att.missed',
  bonus: 'att.bonus',
  upcoming: 'att.upcoming',
  rest: 'att.rest',
} as const

export function WeekAttendance({ now }: { now: Date }) {
  const { t, locale } = useT()
  const sessions = useApex((s) => s.sessions)
  const activity = useApex((s) => s.activity)
  const seededAt = useApex((s) => s.seededAt)
  const start = startOfWeek(now)
  const todayKey = toKey(now)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(start, i)
    const key = toKey(d)
    return { key, d, status: dayStatus(key, sessions, activity, seededAt, now), xp: activity[key] ?? 0 }
  })
  const present = days.filter((d) => d.status === 'attended' || d.status === 'late' || d.status === 'bonus').length

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dash.week')}</CardTitle>
        <span className="text-xs font-semibold tnum text-muted">{t('dash.weekActive', { count: present })}</span>
      </CardHeader>
      <CardBody className="pt-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map(({ key, d, status, xp }) => (
            <Tooltip key={key} content={`${d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'short' })} · ${t(STATUS_KEY[status])}${xp ? ` · ${xp} XP` : ''}`}>
              <div className="flex flex-col items-center gap-2" tabIndex={0}>
                <span className={cn('text-[11px] font-semibold uppercase', key === todayKey ? 'text-cyan-fg' : 'text-subtle')}>
                  {d.toLocaleDateString(locale, { weekday: 'narrow' })}
                </span>
                <span className={cn('size-7 rounded-full sm:size-8', DOT_STYLE[status], key === todayKey && 'ring-2 ring-cyan ring-offset-2 ring-offset-surface')} />
              </div>
            </Tooltip>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-muted">
          {(['attended', 'late', 'missed', 'bonus'] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={cn('size-2.5 rounded-full', DOT_STYLE[s])} />
              {t(STATUS_KEY[s])}
            </span>
          ))}
        </div>
        <Link href="/attendance" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-fg hover:underline">
          {t('dash.fullAttendance')} <ArrowRight className="size-3.5" />
        </Link>
      </CardBody>
    </Card>
  )
}
