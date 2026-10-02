'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarClock, Clock, ListChecks, Sparkles, TriangleAlert, ArrowRight } from 'lucide-react'
import type { Attempt, Homework, HomeworkStatus } from '@/types'
import { useT } from '@/i18n'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/common/StatusPill'
import { DomainTag } from '@/components/common/DomainTag'
import { ProgressBar } from '@/components/common/ProgressBar'
import { answeredCount, homeworkXp, LATE_PENALTY } from '@/lib/homework'
import { diffDays } from '@/lib/date'
import { cn } from '@/lib/utils'

const CARD: Record<HomeworkStatus, string> = {
  NOT_STARTED: 'border-line',
  IN_PROGRESS: 'border-gold/40 before:bg-gold',
  OVERDUE: 'border-crimson animate-pulse-ring before:bg-crimson',
  COMPLETED: 'border-emerald/45 before:bg-emerald',
}

export function useDueLabel() {
  const { locale, t } = useT()
  return (due: Date, now: Date) => {
    const days = diffDays(now, due)
    if (days === 0) return t('hw.dueToday')
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day')
  }
}

export function HomeworkCard({ hw, attempt, status, due, now }: { hw: Homework; attempt?: Attempt; status: HomeworkStatus; due: Date; now: Date }) {
  const { t, tr } = useT()
  const dueLabel = useDueLabel()
  const answered = answeredCount(attempt)
  const total = hw.questions.length
  const take = `/homework/${hw.id}/take`

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={cn(
        'glass relative overflow-hidden rounded-2xl border p-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[""]',
        CARD[status],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <DomainTag domain={hw.domain} />
        <StatusPill status={status} />
      </div>
      <Link href={`/homework/${hw.id}`} className="mt-2.5 block">
        <h3 className="text-[15px] font-bold leading-snug text-fg-strong hover:text-cyan-fg">{tr(hw.title)}</h3>
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <ListChecks className="size-3.5" />
          {t('hw.questions', { count: total })}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {t('mission.mins', { count: hw.estMin })}
        </span>
        <span className={cn('inline-flex items-center gap-1', status === 'OVERDUE' && 'font-semibold text-crimson-fg')}>
          <CalendarClock className="size-3.5" />
          {status === 'COMPLETED' ? t('hw.submitted') : dueLabel(due, now)}
        </span>
      </div>

      {status === 'IN_PROGRESS' && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-semibold text-gold-fg">{t('hw.progress', { done: answered, total })}</span>
            <span className="tnum text-muted">{Math.round((answered / total) * 100)}%</span>
          </div>
          <ProgressBar value={answered / total} tone="gold" height="h-1.5" />
        </div>
      )}

      {status === 'OVERDUE' && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-crimson/10 px-2.5 py-1.5 text-xs font-semibold text-crimson-fg">
          <TriangleAlert className="size-3.5 shrink-0" />
          {t('hw.penalty', { pct: LATE_PENALTY * 100 })}
          {answered > 0 && <span className="ml-auto tnum font-medium">{answered}/{total}</span>}
        </div>
      )}

      {status === 'COMPLETED' && attempt && (
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-emerald/10 px-2.5 py-1.5 text-xs font-semibold">
          <span className="text-emerald-fg">{t('hw.scoreLine', { pct: Math.round((attempt.score ?? 0) * 100) })}</span>
          <span className="inline-flex items-center gap-1 text-gold-fg">
            <Sparkles className="size-3.5" />
            {t('hw.xpEarned', { xp: attempt.xpEarned ?? 0 })}
          </span>
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-between gap-2">
        {status === 'COMPLETED' ? (
          <span />
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-fg">
            <Sparkles className="size-3.5" />
            {t('hw.upTo', { xp: status === 'OVERDUE' ? homeworkXp(hw, 1, true) : hw.xp })}
          </span>
        )}
        {status === 'COMPLETED' ? (
          <Button asChild size="sm" variant="secondary">
            <Link href={`/homework/${hw.id}`}>
              {t('hw.review')} <ArrowRight />
            </Link>
          </Button>
        ) : status === 'NOT_STARTED' ? (
          <Button asChild size="sm" variant="secondary">
            <Link href={take}>{t('hw.begin')}</Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant={status === 'OVERDUE' ? 'danger' : 'primary'}>
            <Link href={take}>{answered > 0 ? t('hw.resume') : t('hw.startNow')}</Link>
          </Button>
        )}
      </div>
    </motion.article>
  )
}
