'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, X, Sparkles, Trophy } from 'lucide-react'
import { DOMAINS, type Domain } from '@/types'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { getQuestion } from '@/data/homework'
import { BOX_INTERVALS, isDue, MAX_BOX } from '@/lib/srs'
import { pop } from '@/lib/confetti'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LogoMark } from '@/components/brand/Logo'
import { CipherSays } from '@/components/brand/Cipher'
import { DomainTag } from '@/components/common/DomainTag'
import { ProgressBar } from '@/components/common/ProgressBar'
import { ChoiceList } from '@/components/test/ChoiceList'
import { cn } from '@/lib/utils'

function RetrySession() {
  const { t, tr } = useT()
  const params = useSearchParams()
  const domainParam = params.get('domain')
  const domain = DOMAINS.includes(domainParam as Domain) ? (domainParam as Domain) : null
  const retry = useApex((s) => s.retryMistake)

  // Freeze the queue at session start so answering doesn't reshuffle it
  const [queue] = useState(() => {
    const now = new Date()
    const all = Object.values(useApex.getState().mistakes).filter((m) => !m.mastered && (!domain || getQuestion(m.questionId)?.domain === domain))
    const dueNow = all.filter((m) => isDue(m, now))
    return (dueNow.length ? dueNow : all).map((m) => m.questionId).slice(0, 10)
  })
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<number | undefined>()
  const [checked, setChecked] = useState<null | boolean>(null)
  const [results, setResults] = useState<boolean[]>([])
  const mistakes = useApex((s) => s.mistakes)

  const qid = queue[index]
  const q = qid ? getQuestion(qid) : undefined
  const entry = qid ? mistakes[qid] : undefined
  const done = index >= queue.length

  const check = () => {
    if (choice === undefined || !qid) return
    const ok = retry(qid, choice)
    setChecked(ok)
    setResults((r) => [...r, ok])
    if (ok) pop(0.5, 0.6)
  }
  const next = () => {
    setIndex((i) => i + 1)
    setChoice(undefined)
    setChecked(null)
  }

  const correctCount = results.filter(Boolean).length
  const header = (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
        <Button asChild variant="ghost" size="icon-sm" aria-label={t('test.exit')}>
          <Link href="/mistakes">
            <X />
          </Link>
        </Button>
        <LogoMark className="size-7" />
        <p className="text-sm font-bold">{t('retry.title')}</p>
        {domain && <DomainTag domain={domain} />}
        {!done && queue.length > 0 && (
          <div className="ml-auto flex w-40 items-center gap-2">
            <ProgressBar value={index / queue.length} tone="violet" height="h-1.5" />
            <span className="text-xs font-semibold tnum text-muted">
              {index + 1}/{queue.length}
            </span>
          </div>
        )}
      </div>
    </header>
  )

  if (queue.length === 0 || done) {
    return (
      <div className="min-h-dvh">
        {header}
        <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
          {queue.length === 0 ? (
            <CipherSays mood="happy">{t('retry.nothing')}</CipherSays>
          ) : (
            <>
              <Trophy className="size-12 text-gold-fg" />
              <h1 className="mt-4 text-3xl font-extrabold">{t('retry.doneTitle')}</h1>
              <p className="mt-2 text-muted">{t('retry.doneBody', { correct: correctCount, total: results.length })}</p>
              <CipherSays mood={correctCount === results.length ? 'cheer' : 'happy'} className="mt-6">
                {correctCount === results.length ? t('retry.cipherPerfect') : t('retry.cipherDone')}
              </CipherSays>
            </>
          )}
          <Button asChild className="mt-8">
            <Link href="/mistakes">{t('retry.back')}</Link>
          </Button>
        </main>
      </div>
    )
  }

  if (!q || !entry) return null
  const nextBox = Math.min(MAX_BOX, entry.box)

  return (
    <div className="min-h-dvh">
      {header}
      <main className={cn('mx-auto grid max-w-6xl gap-5 px-4 py-6', q.passage && 'lg:grid-cols-2')}>
        {q.passage && <section className="glass whitespace-pre-line rounded-2xl p-5 font-serif text-[17px] leading-[1.8] text-fg-strong">{q.passage}</section>}
        <AnimatePresence mode="wait">
          <motion.section key={qid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={cn('glass rounded-2xl p-5 sm:p-6', !q.passage && 'mx-auto w-full max-w-3xl')}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <DomainTag domain={q.domain} />
              <span className="rounded-md bg-violet/12 px-1.5 py-0.5 text-[11px] font-semibold text-violet-fg">{t('mistakes.boxN', { n: entry.box })}</span>
              <span className="text-[11px] text-subtle">{t('retry.wrongBefore', { count: entry.timesWrong })}</span>
            </div>
            {q.prompt.split('\n').map((line, i, all) => (
              <p key={i} className={cn(i < all.length - 1 ? 'font-serif text-[17px] text-fg-strong' : 'mb-5 mt-2 font-medium text-fg-strong')}>
                {line}
              </p>
            ))}
            <div className={cn(checked !== null && 'pointer-events-none')}>
              <ChoiceList q={q} selected={choice} eliminated={[]} eliminator={false} onSelect={setChoice} onEliminate={() => {}} />
            </div>

            <AnimatePresence>
              {checked !== null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                  <div className={cn('mt-5 rounded-xl border p-4', checked ? 'border-emerald/40 bg-emerald/10' : 'border-crimson/40 bg-crimson/10')}>
                    <p className={cn('flex items-center gap-2 font-bold', checked ? 'text-emerald-fg' : 'text-crimson-fg')}>
                      {checked ? <Check className="size-5" /> : <X className="size-5" />}
                      {checked ? t('retry.correct') : t('retry.incorrect', { letter: 'ABCD'[q.answer] })}
                      {checked && (
                        <span className="ml-auto inline-flex items-center gap-1 text-sm text-gold-fg">
                          <Sparkles className="size-4" />+{entry.mastered ? 25 : 10} XP
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-sm text-fg">{tr(q.explanation)}</p>
                    <p className="mt-2 text-xs font-semibold text-muted">
                      {entry.mastered ? t('retry.mastered') : checked ? t('retry.moved', { box: nextBox, days: BOX_INTERVALS[nextBox - 1], count: BOX_INTERVALS[nextBox - 1] }) : t('retry.reset')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex justify-end">
              {checked === null ? (
                <Button onClick={check} disabled={choice === undefined} size="lg">
                  {t('retry.check')}
                </Button>
              ) : (
                <Button onClick={next} size="lg">
                  {index + 1 < queue.length ? t('common.next') : t('retry.finish')}
                  <ArrowRight />
                </Button>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function RetryPage() {
  return (
    <Suspense fallback={<Skeleton className="m-6 h-96" />}>
      <RetrySession />
    </Suspense>
  )
}
