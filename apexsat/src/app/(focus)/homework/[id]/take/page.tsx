'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calculator, Flag, Strikethrough, Timer, TriangleAlert, X, Send } from 'lucide-react'
import type { Homework } from '@/types'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useHomeworkQuery } from '@/hooks/queries'
import { dueDate, LATE_PENALTY } from '@/lib/homework'
import { pop } from '@/lib/confetti'
import { formatClock, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { LogoMark } from '@/components/brand/Logo'
import { DomainTag } from '@/components/common/DomainTag'
import { NotFoundCard } from '@/components/common/NotFoundCard'
import { Passage } from '@/components/test/Passage'
import { ChoiceList } from '@/components/test/ChoiceList'
import { NavigatorButton, NavigatorGrid } from '@/components/test/Navigator'
import { CalculatorPanel } from '@/components/test/Calculator'
import { ResultsView } from '@/components/test/ResultsView'

const EMPTY: never[] = []

function TestRunner({ hw }: { hw: Homework }) {
  const { t, tr } = useT()
  const attempt = useApex((s) => s.attempts[hw.id])
  const seededAt = useApex((s) => s.seededAt)
  const { answer, toggleFlag, toggleEliminate, setAnnotations, addTime, submitHomework } = useApex.getState()

  const answers = attempt?.answers ?? {}
  const flagged = attempt?.flagged ?? EMPTY
  const firstOpen = hw.questions.findIndex((q) => answers[q.id] === undefined)
  const [index, setIndex] = useState(firstOpen === -1 ? 0 : firstOpen)
  const [navOpen, setNavOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const [eliminator, setEliminator] = useState(false)
  const [elapsed, setElapsed] = useState(() => Object.values(attempt?.time ?? {}).reduce((a, b) => a + b, 0))

  const q = hw.questions[index]
  const isMath = hw.section === 'math'
  const late = new Date() > dueDate(hw, seededAt)
  const unanswered = hw.questions.filter((x) => answers[x.id] === undefined).length

  // Per-question timer, flushed to the store when switching questions
  const pending = useRef(0)
  const flush = useCallback(
    (qid: string) => {
      if (pending.current > 0) addTime(hw.id, qid, pending.current)
      pending.current = 0
    },
    [addTime, hw.id],
  )
  useEffect(() => {
    const id = setInterval(() => {
      pending.current += 1
      setElapsed((e) => e + 1)
    }, 1000)
    return () => {
      clearInterval(id)
      flush(q.id)
    }
  }, [q.id, flush])

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(hw.questions.length - 1, i))), [hw.questions.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || reviewOpen || navOpen) return
      const k = e.key.toLowerCase()
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 }
      if (k in map && !e.metaKey && !e.ctrlKey) answer(hw.id, q.id, map[k])
      else if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
      else if (k === 'f' && !e.metaKey && !e.ctrlKey) toggleFlag(hw.id, q.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer, toggleFlag, go, hw.id, q.id, index, reviewOpen, navOpen])

  const submit = () => {
    flush(q.id)
    const res = submitHomework(hw.id)
    setReviewOpen(false)
    if (res && res.score >= 0.9) pop(0.5, 0.35)
    window.scrollTo({ top: 0 })
  }

  const isFlagged = flagged.includes(q.id)
  const lines = q.prompt.split('\n')
  const stem = lines.length > 1 ? lines.slice(0, -1) : []
  const ask = lines[lines.length - 1]

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:px-5">
          <Button asChild variant="ghost" size="icon-sm" aria-label={t('test.exit')}>
            <Link href={`/homework/${hw.id}`}>
              <X />
            </Link>
          </Button>
          <LogoMark className="hidden size-7 sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-fg-strong">{tr(hw.title)}</p>
            <p className="text-[11px] text-muted">{t(isMath ? 'section.math' : 'section.rw')}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface-2/60 px-2.5 text-sm font-bold tnum" aria-label={t('test.elapsed')}>
              <Timer className="size-4 text-cyan-fg" />
              {formatClock(elapsed)}
            </span>
            <Button variant={eliminator ? 'secondary' : 'ghost'} size="sm" onClick={() => setEliminator((v) => !v)} aria-pressed={eliminator} title={t('test.eliminator')}>
              <Strikethrough />
              <span className="hidden md:inline">{t('test.eliminator')}</span>
            </Button>
            {isMath && (
              <Button variant={calcOpen ? 'secondary' : 'ghost'} size="sm" onClick={() => setCalcOpen((v) => !v)} aria-pressed={calcOpen}>
                <Calculator />
                <span className="hidden md:inline">{t('calc.title')}</span>
              </Button>
            )}
          </div>
        </div>
        {late && (
          <p className="flex items-center justify-center gap-1.5 bg-crimson/12 py-1 text-xs font-semibold text-crimson-fg">
            <TriangleAlert className="size-3.5" />
            {t('hw.penalty', { pct: LATE_PENALTY * 100 })}
          </p>
        )}
      </header>

      {/* Body */}
      <main className={cn('mx-auto w-full max-w-7xl flex-1 px-3 py-5 sm:px-5', q.passage ? 'grid gap-5 lg:grid-cols-2' : 'max-w-3xl')}>
        {q.passage && (
          <section className="glass self-start rounded-2xl p-5 sm:p-6 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-10rem)] lg:overflow-y-auto scrollbar-thin" aria-label={t('test.passage')}>
            <Passage text={q.passage} annotations={attempt?.annotations[q.id] ?? EMPTY} onChange={(list) => setAnnotations(hw.id, q.id, list)} />
          </section>
        )}
        <AnimatePresence mode="wait">
          <motion.section key={q.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="glass self-start rounded-2xl p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-fg-strong px-2 text-sm font-extrabold tnum text-bg">{index + 1}</span>
              <DomainTag domain={q.domain} />
              <button
                type="button"
                onClick={() => toggleFlag(hw.id, q.id)}
                aria-pressed={isFlagged}
                className={cn(
                  'ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition',
                  isFlagged ? 'border-crimson/50 bg-crimson/10 text-crimson-fg' : 'border-line text-muted hover:text-fg-strong',
                )}
              >
                <Flag className={cn('size-3.5', isFlagged && 'fill-current')} />
                {isFlagged ? t('test.flagged') : t('test.flag')}
              </button>
            </div>
            {stem.length > 0 && (
              <div className="mb-3 space-y-1 rounded-xl bg-surface-2/50 px-4 py-3 font-serif text-[17px] text-fg-strong">
                {stem.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            )}
            <p className="mb-5 text-[16px] font-medium leading-relaxed text-fg-strong">{ask}</p>
            <ChoiceList
              q={q}
              selected={answers[q.id]}
              eliminated={attempt?.eliminated[q.id] ?? EMPTY}
              eliminator={eliminator}
              onSelect={(i) => answer(hw.id, q.id, i)}
              onEliminate={(i) => toggleEliminate(hw.id, q.id, i)}
            />
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-30 border-t border-line bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-5">
          <p className="hidden text-xs text-subtle md:block">{t('test.keys')}</p>
          <NavigatorButton questions={hw.questions} answers={answers} flagged={flagged} current={index} onJump={go} open={navOpen} onOpenChange={setNavOpen} />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => go(index - 1)} disabled={index === 0}>
              <ArrowLeft />
              <span className="hidden sm:inline">{t('common.back')}</span>
            </Button>
            {index < hw.questions.length - 1 ? (
              <Button onClick={() => go(index + 1)}>
                <span className="hidden sm:inline">{t('common.next')}</span>
                <ArrowRight />
              </Button>
            ) : (
              <Button variant="violet" onClick={() => setReviewOpen(true)}>
                <Send />
                {t('test.reviewSubmit')}
              </Button>
            )}
          </div>
        </div>
      </footer>

      <CalculatorPanel open={calcOpen} onClose={() => setCalcOpen(false)} />

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-xl" closeLabel={t('common.close')}>
          <DialogTitle>{t('test.reviewTitle')}</DialogTitle>
          <DialogDescription className="mt-1">
            {unanswered > 0 ? t('test.unanswered', { count: unanswered }) : t('test.allAnswered')}
            {flagged.length > 0 && ` ${t('test.flaggedCount', { count: flagged.length })}`}
          </DialogDescription>
          <div className="mt-5">
            <NavigatorGrid
              questions={hw.questions}
              answers={answers}
              flagged={flagged}
              current={index}
              onJump={(i) => {
                go(i)
                setReviewOpen(false)
              }}
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setReviewOpen(false)}>
              {t('test.keepWorking')}
            </Button>
            <Button onClick={submit}>
              <Send />
              {t('test.submit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Finished({ hw }: { hw: Homework }) {
  const { t, tr } = useT()
  const attempt = useApex((s) => s.attempts[hw.id])!
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <LogoMark className="size-7" />
          <p className="truncate text-sm font-bold">{tr(hw.title)}</p>
          <Button asChild size="sm" variant="secondary" className="ml-auto">
            <Link href="/homework">{t('test.backToHomework')}</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-5 text-2xl font-extrabold">{t('results.title')}</h1>
        <ResultsView hw={hw} attempt={attempt} />
      </main>
    </div>
  )
}

export default function TakePage() {
  const { id } = useParams<{ id: string }>()
  const { data: hw, isPending } = useHomeworkQuery(id)
  const submitted = useApex((s) => Boolean(s.attempts[id]?.submittedAt))
  if (isPending) return <Skeleton className="m-6 h-96" />
  if (!hw) return <NotFoundCard />
  return submitted ? <Finished hw={hw} /> : <TestRunner hw={hw} />
}
