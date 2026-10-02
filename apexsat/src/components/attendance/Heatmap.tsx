'use client'

import { useMemo, useState } from 'react'
import type { DateKey, SessionLog } from '@/types'
import { useT } from '@/i18n'
import { addDays, fromKey, startOfWeek, toKey, weekdayMon } from '@/lib/date'
import { dayStatus } from '@/lib/attendance'
import { Tooltip } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { STATUS_KEY, DOT_STYLE } from '@/components/dashboard/WeekAttendance'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** 0 XP = dark · <50 faint · 50+ light cyan · 100+ cyan · 200+ neon cyan→violet */
export function heatStyle(xp: number): React.CSSProperties {
  if (xp <= 0) return { background: 'var(--heat-0)' }
  if (xp < 50) return { background: 'color-mix(in oklab, var(--cyan) 28%, var(--heat-0))' }
  if (xp < 100) return { background: 'color-mix(in oklab, var(--cyan) 50%, var(--heat-0))' }
  if (xp < 200) return { background: 'color-mix(in oklab, var(--cyan) 80%, var(--heat-0))' }
  return { background: 'linear-gradient(135deg, var(--cyan-bright), var(--violet))', boxShadow: '0 0 8px rgb(0 242 254 / 0.45)' }
}

const LEVELS = [0, 30, 70, 150, 250]

interface Props {
  activity: Record<DateKey, number>
  sessions: Record<DateKey, SessionLog>
  seededAt: DateKey
  now: Date
}

function YearView({ activity, now }: Props) {
  const { locale, t } = useT()
  const end = addDays(startOfWeek(now), 6)
  const start = addDays(startOfWeek(now), -52 * 7)
  const startKey = toKey(start)
  const weeks = useMemo(() => {
    const first = fromKey(startKey)
    const out: Date[][] = []
    for (let w = 0; w < 53; w++) out.push(Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)))
    return out
  }, [startKey])
  const todayKey = toKey(now)
  const dayLabels = [0, 2, 4].map((i) => addDays(startOfWeek(now), i).toLocaleDateString(locale, { weekday: 'short' }))

  return (
    <div className="overflow-x-auto pb-2 scrollbar-thin">
      <div className="inline-flex min-w-full gap-2">
        <div className="mt-5 grid grid-rows-7 gap-[3px] text-[10px] text-subtle">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="h-3 leading-3">
              {i % 2 === 0 ? dayLabels[i / 2] : ''}
            </span>
          ))}
        </div>
        <div>
          <div className="mb-1.5 flex h-3.5 gap-[3px] text-[10px] text-subtle">
            {weeks.map((w, i) => {
              const first = w[0]
              // Label each month at its first full week; skip the clipped leading month
              const show = i > 0 && first.getMonth() !== weeks[i - 1][0].getMonth()
              return (
                <span key={i} className="w-3 overflow-visible whitespace-nowrap">
                  {show ? first.toLocaleDateString(locale, { month: 'short' }) : ''}
                </span>
              )
            })}
          </div>
          <div className="flex gap-[3px]" role="grid" aria-label={t('att.heatmap')}>
            {weeks.map((w, i) => (
              <div key={i} className="grid grid-rows-7 gap-[3px]" role="row">
                {w.map((d) => {
                  const key = toKey(d)
                  const xp = activity[key] ?? 0
                  const future = d > end || key > todayKey
                  return (
                    <Tooltip key={key} content={`${d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${xp} XP`}>
                      <span
                        role="gridcell"
                        aria-label={`${key}: ${xp} XP`}
                        className={cn('size-3 rounded-[3px]', future && 'opacity-0', key === todayKey && 'ring-1 ring-fg-strong')}
                        style={future ? undefined : heatStyle(xp)}
                      />
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthView({ activity, sessions, seededAt, now }: Props) {
  const { locale, t } = useT()
  const [offset, setOffset] = useState(0)
  const month = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const gridStart = startOfWeek(month)
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const todayKey = toKey(now)
  const weekdays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(now), i).toLocaleDateString(locale, { weekday: 'short' }))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setOffset((o) => o - 1)} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-fg-strong" aria-label={t('att.prevMonth')}>
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-bold capitalize">{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</p>
        <button type="button" onClick={() => setOffset((o) => Math.min(0, o + 1))} disabled={offset >= 0} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-fg-strong disabled:opacity-30" aria-label={t('att.nextMonth')}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase text-subtle">
        {weekdays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const key = toKey(d)
          const inMonth = d.getMonth() === month.getMonth()
          const xp = activity[key] ?? 0
          const status = dayStatus(key, sessions, activity, seededAt, now)
          return (
            <Tooltip key={key} content={`${d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })} · ${t(STATUS_KEY[status])} · ${xp} XP`}>
              <div
                tabIndex={inMonth ? 0 : -1}
                className={cn('relative flex aspect-square flex-col items-start justify-between rounded-lg p-1.5 text-left sm:p-2', !inMonth && 'opacity-25', key === todayKey && 'ring-2 ring-cyan')}
                style={key > todayKey ? { background: 'var(--heat-0)' } : heatStyle(xp)}
              >
                <span className={cn('text-xs font-bold tnum', xp >= 100 ? 'text-[#04121a]' : 'text-fg')}>{d.getDate()}</span>
                {status !== 'rest' && <span className={cn('size-2 rounded-full sm:size-2.5', DOT_STYLE[status])} />}
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

export function Heatmap(props: Props) {
  const { t } = useT()
  const [view, setView] = useState<'year' | 'month'>('year')
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold">{t('att.consistency')}</h2>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="year">{t('att.year')}</TabsTrigger>
            <TabsTrigger value="month">{t('att.month')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {view === 'year' ? <YearView {...props} /> : <MonthView {...props} />}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-subtle">
        <span>{t('att.less')}</span>
        {LEVELS.map((l) => (
          <span key={l} className="size-3 rounded-[3px]" style={heatStyle(l)} />
        ))}
        <span>{t('att.more')}</span>
      </div>
    </div>
  )
}

/** Days since the first logged session, oldest first, with their derived status */
export function classHistory(sessions: Record<DateKey, SessionLog>, activity: Record<DateKey, number>, seededAt: DateKey, now: Date) {
  const keys = Object.keys(sessions).sort()
  if (!keys.length) return []
  const out: { key: DateKey; status: ReturnType<typeof dayStatus> }[] = []
  for (let d = fromKey(keys[0]); toKey(d) <= toKey(now); d = addDays(d, 1)) {
    const key = toKey(d)
    out.push({ key, status: dayStatus(key, sessions, activity, seededAt, now) })
  }
  return out
}

export const isWeekend = (d: Date) => weekdayMon(d) >= 5
