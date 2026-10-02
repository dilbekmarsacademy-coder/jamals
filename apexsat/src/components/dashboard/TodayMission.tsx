'use client'

import Link from 'next/link'
import { Clock, Play, Sparkles, ListChecks, Target } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { lessons } from '@/data/lessons'
import { getHomework } from '@/data/homework'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/common/ProgressBar'
import { DomainTag } from '@/components/common/DomainTag'

/** The single most important thing to do today */
export function TodayMission() {
  const { t, tr } = useT()
  const progress = useApex((s) => s.lessons)
  const attempts = useApex((s) => s.attempts)

  const lesson = lessons.find((l) => progress[l.id] && !progress[l.id].completed) ?? lessons.find((l) => !progress[l.id]?.completed)
  if (!lesson) {
    return (
      <section className="glass flex flex-col justify-center rounded-3xl p-6">
        <h2 className="text-xl font-extrabold">{t('mission.allDone')}</h2>
        <p className="mt-1 text-sm text-muted">{t('mission.allDoneBody')}</p>
        <Button asChild className="mt-4 w-fit">
          <Link href="/homework">{t('mission.toHomework')}</Link>
        </Button>
      </section>
    )
  }

  const p = progress[lesson.id]
  const started = Boolean(p && p.watched > 0)
  const hw = getHomework(lesson.homeworkId)
  const hwDone = Boolean(attempts[lesson.homeworkId]?.submittedAt)
  const minsLeft = Math.max(1, Math.round(lesson.durationMin * (1 - (p?.watched ?? 0)))) + (hw && !hwDone ? hw.estMin : 0)
  const xp = lesson.xp + (hw && !hwDone ? hw.xp : 0)

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan/25 bg-[linear-gradient(135deg,rgb(6_182_212/0.16),rgb(139_92_246/0.14)_60%,rgb(19_27_46/0.4))] p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full border-[18px] border-cyan/10" />
      <div className="pointer-events-none absolute -right-2 top-14 size-24 rounded-full border-[10px] border-violet/15" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-fg">
            <Target className="size-3.5" />
            {t('mission.kicker')}
          </span>
          <DomainTag domain={lesson.domain} />
        </div>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-[28px]">
          {t('mission.module', { n: lesson.module })}: {tr(lesson.title)}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{tr(lesson.summary)}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5 text-fg">
            <Clock className="size-4 text-cyan-fg" />
            {t('mission.mins', { count: minsLeft })}
          </span>
          <span className="inline-flex items-center gap-1.5 text-gold-fg">
            <Sparkles className="size-4" />+{xp} XP
          </span>
          {hw && <span className="text-xs font-medium text-muted">{t('mission.includes', { count: hw.questions.length })}</span>}
        </div>

        {started && (
          <div className="mt-4 max-w-md">
            <div className="mb-1.5 flex justify-between text-xs text-muted">
              <span>{t('mission.watched')}</span>
              <span className="tnum">{Math.round((p?.watched ?? 0) * 100)}%</span>
            </div>
            <ProgressBar value={p?.watched ?? 0} />
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="lg">
            <Link href={`/lessons/${lesson.id}`}>
              <Play className="fill-current" />
              {started ? t('mission.resume') : t('mission.start')}
            </Link>
          </Button>
          {hw && !hwDone && (
            <Button asChild size="lg" variant="secondary">
              <Link href={`/homework/${hw.id}/take`}>
                <ListChecks />
                {t('mission.quiz')}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
