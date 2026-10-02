'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Check, Clock, Sparkles, TriangleAlert, X, ArrowRight } from 'lucide-react'
import type { Attempt, Difficulty, Homework } from '@/types'
import { useT, type MessageKey } from '@/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { CipherSays } from '@/components/brand/Cipher'
import { DomainTag, DOMAIN_HEX, DOMAIN_KEY } from '@/components/common/DomainTag'
import { formatClock, cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D']
const DIFF_KEY: Record<Difficulty, MessageKey> = { easy: 'diff.easy', medium: 'diff.medium', hard: 'diff.hard' }

export function ResultsView({ hw, attempt }: { hw: Homework; attempt: Attempt }) {
  const { t } = useT()
  const qs = hw.questions
  const correct = qs.filter((q) => attempt.answers[q.id] === q.answer)
  const score = attempt.score ?? correct.length / qs.length
  const pct = Math.round(score * 100)
  const totalTime = Object.values(attempt.time).reduce((a, b) => a + b, 0)

  const byDomain = [...new Set(qs.map((q) => q.domain))].map((d) => {
    const items = qs.filter((q) => q.domain === d)
    return { d, total: items.length, ok: items.filter((q) => attempt.answers[q.id] === q.answer).length }
  })
  const byDiff = (['easy', 'medium', 'hard'] as Difficulty[])
    .map((d) => {
      const items = qs.filter((q) => q.difficulty === d)
      return { d, total: items.length, ok: items.filter((q) => attempt.answers[q.id] === q.answer).length }
    })
    .filter((r) => r.total > 0)

  const mood = pct >= 90 ? 'cheer' : pct >= 70 ? 'happy' : pct >= 50 ? 'thinking' : 'sad'
  const message: MessageKey = pct === 100 ? 'results.perfect' : pct >= 90 ? 'results.great' : pct >= 70 ? 'results.good' : 'results.keepGoing'
  const wrong = qs.length - correct.length

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass relative overflow-hidden rounded-2xl p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cyan/10 blur-2xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="grid size-28 place-items-center rounded-full border-4 border-cyan/30 bg-surface-2">
              <div className="text-center">
                <p className={cn('font-display text-4xl font-extrabold tnum', pct >= 70 ? 'text-emerald-fg' : pct >= 50 ? 'text-gold-fg' : 'text-crimson-fg')}>{pct}%</p>
                <p className="text-xs tnum text-muted">
                  {correct.length}/{qs.length}
                </p>
              </div>
            </motion.div>
            <div className="space-y-2">
              <p className="inline-flex items-center gap-1.5 rounded-xl bg-gold/15 px-3 py-1.5 font-display text-xl font-extrabold text-gold-fg">
                <Sparkles className="size-5" />+{attempt.xpEarned ?? 0} XP
              </p>
              {attempt.late && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-crimson-fg">
                  <TriangleAlert className="size-3.5" />
                  {t('results.latePenalty')}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Clock className="size-3.5" />
                {t('results.time', { total: formatClock(totalTime), avg: formatClock(totalTime / qs.length) })}
              </p>
            </div>
          </div>
          <CipherSays mood={mood} size="sm" className="relative mt-5">
            {t(message)}
          </CipherSays>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-bold">{t('results.breakdown')}</h2>
          <div className="mt-3 space-y-3">
            {byDomain.map(({ d, total, ok }) => (
              <div key={d}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold text-fg">{t(DOMAIN_KEY[d])}</span>
                  <span className="tnum text-muted">
                    {ok}/{total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3/70">
                  <div className="h-full rounded-full" style={{ width: `${(ok / total) * 100}%`, background: DOMAIN_HEX[d] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {byDiff.map(({ d, total, ok }) => (
              <div key={d} className="rounded-xl border border-line bg-surface-2/40 p-2.5 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{t(DIFF_KEY[d])}</p>
                <p className="mt-0.5 font-display text-lg font-extrabold tnum text-fg-strong">
                  {ok}/{total}
                </p>
              </div>
            ))}
          </div>
          {wrong > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-violet/10 px-3 py-2.5">
              <Brain className="size-5 shrink-0 text-violet-fg" />
              <p className="flex-1 text-sm">{t('results.toBank', { count: wrong })}</p>
              <Button asChild size="sm" variant="violet">
                <Link href="/mistakes/retry">
                  {t('mistakes.retry')} <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold">{t('results.review')}</h2>
        <Accordion type="multiple" defaultValue={qs.filter((q) => attempt.answers[q.id] !== q.answer).slice(0, 1).map((q) => q.id)} className="space-y-2">
          {qs.map((q, i) => {
            const chosen = attempt.answers[q.id]
            const ok = chosen === q.answer
            return (
              <AccordionItem key={q.id} value={q.id} className={cn(ok ? 'border-line' : 'border-crimson/35')}>
                <AccordionTrigger>
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    <span className={cn('grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold', ok ? 'bg-emerald/15 text-emerald-fg' : 'bg-crimson/15 text-crimson-fg')}>
                      {ok ? <Check className="size-4" /> : <X className="size-4" />}
                    </span>
                    <span className="shrink-0 text-xs font-bold tnum text-muted">#{i + 1}</span>
                    <span className="truncate font-medium">{q.prompt.split('\n').pop()}</span>
                    <DomainTag domain={q.domain} className="ml-auto hidden shrink-0 sm:inline-flex" />
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <QuestionReview q={q} chosen={chosen} />
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}

export function QuestionReview({ q, chosen }: { q: Homework['questions'][number]; chosen: number | undefined }) {
  const { t, tr } = useT()
  return (
    <div className="space-y-3 pt-1">
      {q.passage && <p className="whitespace-pre-line rounded-lg bg-surface/70 p-3 font-serif text-[15px] leading-relaxed text-fg">{q.passage}</p>}
      <p className="whitespace-pre-line text-sm font-semibold text-fg-strong">{q.prompt}</p>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {q.choices.map((c, idx) => (
          <li
            key={idx}
            className={cn(
              'flex items-start gap-2 rounded-lg border px-2.5 py-2 text-sm',
              idx === q.answer ? 'border-emerald/50 bg-emerald/10 text-fg-strong' : idx === chosen ? 'border-crimson/50 bg-crimson/10 text-fg' : 'border-line text-muted',
            )}
          >
            <span className="font-bold">{LETTERS[idx]}</span>
            <span className="flex-1">{c}</span>
            {idx === q.answer && <span className="text-[11px] font-bold text-emerald-fg">{t('results.correct')}</span>}
            {idx === chosen && idx !== q.answer && <span className="text-[11px] font-bold text-crimson-fg">{t('results.yours')}</span>}
          </li>
        ))}
      </ul>
      {chosen === undefined && <p className="text-xs font-semibold text-gold-fg">{t('results.skipped')}</p>}
      <div className="rounded-lg border-l-2 border-cyan bg-cyan/5 px-3 py-2 text-sm text-fg">
        <span className="font-bold text-cyan-fg">{t('results.explanation')}: </span>
        {tr(q.explanation)}
      </div>
    </div>
  )
}
