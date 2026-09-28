import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, CalendarX, ChevronLeft, ChevronRight, CirclePlay, Coffee, Flame } from 'lucide-react'
import type { AttendanceRecord } from '@/types'
import { PageHeader } from '@/components/common/PageHeader'
import { ProgressRing } from '@/components/common/ProgressRing'
import { SubjectPill } from '@/components/common/SubjectPill'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useAttendance } from '@/hooks/useAttendance'
import { lessons } from '@/data/lessons'
import { isClassDay } from '@/data/attendance'
import { attendanceRate, attendanceStreak } from '@/lib/streak'
import { formatDateLong, fromDateKey, monthName, toDateKey, weekdaysShort } from '@/lib/date'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

export default function AttendancePage() {
  const { t } = useT()
  const records = useAttendance()
  const today = new Date()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)
  const [dir, setDir] = useState(0)

  const byDate = useMemo(() => new Map(records.map((r) => [r.date, r])), [records])
  const rate = attendanceRate(records)
  const streak = attendanceStreak(records)

  const monthRecords = records.filter((r) => {
    const d = fromDateKey(r.date)
    return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear()
  })
  const monthPresent = monthRecords.filter((r) => r.status === 'present').length
  const monthAbsent = monthRecords.length - monthPresent

  const earliest = records.length ? fromDateKey([...records].sort((a, b) => a.date.localeCompare(b.date))[0].date) : today
  const canPrev = cursor > new Date(earliest.getFullYear(), earliest.getMonth(), 1)
  const canNext = cursor < new Date(today.getFullYear(), today.getMonth(), 1)
  const shift = (n: number) => {
    setDir(n)
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1))
  }

  // Build a Monday-first grid
  const cells = useMemo(() => {
    const first = new Date(cursor)
    const offset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    const out: (Date | null)[] = Array.from({ length: offset }, () => null)
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    return out
  }, [cursor])

  const selectedRecord = selected ? byDate.get(selected) : undefined

  return (
    <>
      <PageHeader title={t('nav.attendance')} subtitle={t('att.subtitle')} />

      <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col items-center text-center">
            <ProgressRing value={rate} size={160} stroke={12} color="var(--mint)" label={t('att.overallAria')}>
              <div>
                <div className="text-4xl font-semibold tabular-nums">
                  {records.length ? <>{Math.round(rate * 100)}<span className="text-xl">%</span></> : '—'}
                </div>
                <div className="text-xs text-muted">{t('att.overall')}</div>
              </div>
            </ProgressRing>
            {records.length ? (
              <>
                <p className="mt-4 text-sm text-muted">
                  {t('att.summary', { a: records.filter((r) => r.status === 'present').length, n: records.length })}
                </p>
                {rate < 0.9 && <p className="mt-1 text-[13px] text-muted">{t('att.badgeHint')}</p>}
              </>
            ) : (
              <p className="mt-4 text-sm text-muted">
                {t('att.empty')}
              </p>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-5 xl:grid-cols-1">
            <Card className="flex items-center gap-4 p-4 sm:p-5">
              <div className="grid size-10 place-items-center rounded-lg bg-ember-500/10">
                <Flame className="size-5 text-ember-500" />
              </div>
              <div>
                <div className="text-xl font-semibold tabular-nums">{streak} <span className="text-sm font-normal text-muted">{t('unit.daysWord')}</span></div>
                <div className="text-[13px] text-muted">{t('att.streak')}</div>
              </div>
            </Card>
            <Card className="p-4 sm:p-5">
              <div className="text-[13px] text-muted">{t('att.month', { month: monthName(cursor.getMonth()) })}</div>
              <div className="mt-2 flex gap-4">
                <div><div className="text-xl font-semibold tabular-nums">{monthPresent}</div><div className="text-xs text-muted">{t('att.present')}</div></div>
                <div><div className="text-xl font-semibold tabular-nums">{monthAbsent}</div><div className="text-xs text-muted">{t('att.absent')}</div></div>
              </div>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {monthName(cursor.getMonth())} {cursor.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" disabled={!canPrev} onClick={() => shift(-1)} aria-label={t('picker.prevMonth')}><ChevronLeft /></Button>
              <Button variant="ghost" size="icon" disabled={!canNext} onClick={() => shift(1)} aria-label={t('picker.nextMonth')}><ChevronRight /></Button>
            </div>
          </CardHeader>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekdaysShort().map((d) => (
              <div key={d} className="pb-1 text-center text-xs font-medium text-muted">{d}</div>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cursor.toISOString()}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-7 gap-1.5 sm:gap-2"
            >
              {cells.map((d, i) => {
                if (!d) return <div key={`e${i}`} />
                const key = toDateKey(d)
                const rec = byDate.get(key)
                const isToday = key === toDateKey(today)
                const future = d > today && !isToday
                const classDay = isClassDay(d)
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={cn(
                      'relative flex h-11 cursor-pointer flex-col items-center justify-center gap-1 rounded-md text-sm tabular-nums transition-colors sm:h-14',
                      rec?.status === 'present' && 'bg-mint-500/12 text-foreground hover:bg-mint-500/20',
                      rec?.status === 'absent' && 'bg-danger-500/10 text-foreground hover:bg-danger-500/18',
                      !rec && 'text-muted hover:bg-surface-sunken',
                      future && 'text-subtle',
                      isToday && 'font-semibold ring-2 ring-inset ring-primary',
                    )}
                    aria-label={`${formatDateLong(d)}: ${rec ? (rec.status === 'present' ? t('att.aria.present') : t('att.aria.absent')) : classDay ? t('att.aria.none') : t('att.aria.off')}`}
                  >
                    {d.getDate()}
                    {rec && <span className={cn('size-1.5 rounded-full', rec.status === 'present' ? 'bg-mint-500' : 'bg-danger-500')} aria-hidden />}
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-muted">
            <Legend className="bg-mint-500" label={t('att.legend.present')} />
            <Legend className="bg-danger-500" label={t('att.legend.absent')} />
            <Legend className="bg-surface-sunken ring-1 ring-border" label={t('att.legend.none')} />
            <Legend className="ring-2 ring-inset ring-primary" label={t('att.legend.today')} />
          </div>
        </Card>
      </div>

      <DayDialog date={selected} record={selectedRecord} onClose={() => setSelected(null)} />
    </>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('size-2.5 rounded-full', className)} /> {label}
    </span>
  )
}

function DayDialog({ date, record, onClose }: { date: string | null; record?: AttendanceRecord; onClose: () => void }) {
  const { t, tr } = useT()
  if (!date) return null
  const d = fromDateKey(date)
  const lesson = record ? lessons.find((l) => l.id === record.lessonId) : undefined
  const isToday = date === toDateKey(new Date())
  const future = d > new Date() && !isToday

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <div className="flex items-center gap-3 pr-8">
          <span
            className={cn(
              'grid size-10 place-items-center rounded-lg',
              record?.status === 'present' ? 'bg-mint-500/12 text-mint-500' : record ? 'bg-danger-500/10 text-danger-500' : 'bg-surface-sunken text-muted',
            )}
          >
            {record?.status === 'present' ? <CalendarCheck /> : record ? <CalendarX /> : <Coffee />}
          </span>
          <div>
            <DialogTitle className="text-lg">{formatDateLong(d)}</DialogTitle>
            <DialogDescription>
              {record?.status === 'present'
                ? t('att.day.present')
                : record
                  ? t('att.day.absent')
                  : !isClassDay(d)
                    ? t('att.day.off')
                    : future
                      ? t('att.day.future')
                      : t('att.day.todayPending')}
            </DialogDescription>
          </div>
        </div>

        {lesson && (
          <div className="mt-5 overflow-hidden rounded-lg border border-border">
            <img src={`https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`} alt="" className="aspect-video w-full object-cover" />
            <div className="p-4">
              <SubjectPill subject={lesson.subject} />
              <h3 className="mt-2 font-semibold">{tr(lesson.title)}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{tr(lesson.description)}</p>
              <Button asChild size="sm" className="mt-3" variant={record?.status === 'absent' ? 'default' : 'secondary'}>
                <Link to={`/lessons/${lesson.id}`} onClick={onClose}>
                  <CirclePlay /> {record?.status === 'absent' ? t('att.watchMissed') : t('att.rewatch')}
                </Link>
              </Button>
            </div>
          </div>
        )}
        {!record && isToday && isClassDay(d) && (
          <Button asChild className="mt-5 w-full">
            <Link to="/lessons" onClick={onClose}><CirclePlay /> {t('att.startToday')}</Link>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
