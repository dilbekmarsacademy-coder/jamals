'use client'

import Link from 'next/link'
import { CheckCircle2, Clock, PlayCircle, Sparkles } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useLessons } from '@/hooks/queries'
import { PageHeader } from '@/components/common/PageHeader'
import { ProgressBar } from '@/components/common/ProgressBar'
import { DomainTag, DOMAIN_HEX } from '@/components/common/DomainTag'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function LessonsPage() {
  const { t, tr } = useT()
  const { data: lessons } = useLessons()
  const progress = useApex((s) => s.lessons)
  if (!lessons) return <Skeleton className="h-96" />

  const done = lessons.filter((l) => progress[l.id]?.completed).length

  return (
    <div>
      <PageHeader title={t('lessons.title')} subtitle={t('lessons.subtitle')} />
      <div className="glass mb-6 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <p className="text-sm font-semibold text-fg-strong">{t('lessons.course', { done, total: lessons.length })}</p>
        <ProgressBar value={done / lessons.length} className="sm:max-w-md" />
      </div>
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((l) => {
          const p = progress[l.id]
          const state = p?.completed ? 'done' : p && p.watched > 0 ? 'progress' : 'new'
          return (
            <li key={l.id}>
              <Link
                href={`/lessons/${l.id}`}
                className={cn('glass group relative flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:border-cyan/40', state === 'done' && 'border-emerald/30')}
              >
                <div className="relative aspect-video overflow-hidden bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${l.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_40%,rgb(9_13_22/0.9))]" />
                  <span className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#04121a]" style={{ background: DOMAIN_HEX[l.domain] }}>
                    {t('mission.module', { n: l.module })}
                  </span>
                  <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
                    <PlayCircle className="size-14 text-white drop-shadow-lg" />
                  </span>
                  {state === 'done' && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald px-2 py-0.5 text-[11px] font-bold text-white">
                      <CheckCircle2 className="size-3.5" /> {t('status.completed')}
                    </span>
                  )}
                  {state !== 'new' && <ProgressBar value={p?.completed ? 1 : p?.watched ?? 0} height="h-1" tone={state === 'done' ? 'emerald' : 'cyan'} className="absolute inset-x-0 bottom-0 rounded-none bg-black/40" />}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <DomainTag domain={l.domain} className="w-fit" />
                  <h2 className="mt-2 text-base font-bold leading-snug">{tr(l.title)}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{tr(l.summary)}</p>
                  <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {t('mission.mins', { count: l.durationMin })}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-gold-fg">
                      <Sparkles className="size-3.5" />+{l.xp} XP
                    </span>
                    <span className="ml-auto font-semibold text-cyan-fg">{state === 'done' ? t('lessons.rewatch') : state === 'progress' ? t('mission.resume') : t('mission.start')}</span>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
