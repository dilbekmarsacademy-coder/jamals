'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, CalendarClock, Clock, ListChecks, Sparkles, TriangleAlert, PlayCircle, BookOpen } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useNow } from '@/hooks/useNow'
import { useHomeworkQuery } from '@/hooks/queries'
import { dueDate, homeworkStatus, answeredCount, LATE_PENALTY } from '@/lib/homework'
import { getLesson } from '@/data/lessons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusPill } from '@/components/common/StatusPill'
import { DomainTag } from '@/components/common/DomainTag'
import { ProgressBar } from '@/components/common/ProgressBar'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { ResultsView } from '@/components/test/ResultsView'
import { useDueLabel } from '@/components/homework/HomeworkCard'

export default function HomeworkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, tr, locale } = useT()
  const now = useNow(30_000)
  const { data: hw, isPending } = useHomeworkQuery(id)
  const attempt = useApex((s) => s.attempts[id])
  const seededAt = useApex((s) => s.seededAt)
  const dueLabel = useDueLabel()

  if (isPending) return <Skeleton className="h-80" />
  if (!hw) return <NotFoundCard />

  const status = homeworkStatus(hw, attempt, seededAt, now)
  const due = dueDate(hw, seededAt)
  const answered = answeredCount(attempt)
  const lesson = hw.lessonId ? getLesson(hw.lessonId) : undefined

  return (
    <div className="space-y-5">
      <Link href="/homework" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg-strong">
        <ArrowLeft className="size-4" /> {t('hw.back')}
      </Link>

      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={status} />
          <DomainTag domain={hw.domain} />
        </div>
        <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{tr(hw.title)}</h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="size-4" />
            {t('hw.questions', { count: hw.questions.length })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            {t('mission.mins', { count: hw.estMin })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-4" />
            {due.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })} · {dueLabel(due, now)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-gold-fg">
            <Sparkles className="size-4" />
            {t('hw.upTo', { xp: hw.xp })}
          </span>
        </div>

        {status === 'OVERDUE' && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-crimson/10 px-3 py-2 text-sm font-semibold text-crimson-fg">
            <TriangleAlert className="size-4" />
            {t('hw.penaltyLong', { pct: LATE_PENALTY * 100 })}
          </p>
        )}

        {status !== 'COMPLETED' && (
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            {answered > 0 && (
              <div className="sm:w-64">
                <p className="mb-1 text-xs font-semibold text-gold-fg">{t('hw.progress', { done: answered, total: hw.questions.length })}</p>
                <ProgressBar value={answered / hw.questions.length} tone="gold" />
              </div>
            )}
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              {lesson && (
                <Button asChild variant="secondary">
                  <Link href={`/lessons/${lesson.id}`}>
                    <BookOpen /> {t('hw.rewatch')}
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" variant={status === 'OVERDUE' ? 'danger' : 'primary'}>
                <Link href={`/homework/${hw.id}/take`}>
                  <PlayCircle />
                  {answered > 0 ? t('hw.resume') : t('hw.begin')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {status === 'COMPLETED' && attempt && <ResultsView hw={hw} attempt={attempt} />}
    </div>
  )
}
