import { useT } from '@/i18n'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CirclePlay, ClipboardList, Keyboard, Lightbulb, X } from 'lucide-react'
import { homework } from '@/data/homework'
import { lessons } from '@/data/lessons'
import { useAppStore } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubjectPill } from '@/components/common/SubjectPill'
import { ProgressRing } from '@/components/common/ProgressRing'
import { getHomeworkStatus } from '@/lib/homework'
import { relativeDue } from '@/lib/date'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D']

export default function HomeworkRunnerPage() {
  const { id = '' } = useParams()
  const hw = homework.find((h) => h.id === id)
  const progress = useAppStore((s) => s.homeworkProgress[id])
  const answer = useAppStore((s) => s.answerQuestion)
  const submit = useAppStore((s) => s.submitHomework)
  const navigate = useNavigate()
  const { t, tr } = useT()

  const firstUnanswered = hw ? Math.max(0, hw.questions.findIndex((q) => progress?.answers[q.id] === undefined)) : 0
  const [step, setStep] = useState(firstUnanswered)
  const [result, setResult] = useState<{ score: number; xp: number } | null>(null)

  const isDone = progress?.status === 'done'
  const q = hw?.questions[step]
  const total = hw?.questions.length ?? 0

  // Keyboard: A–D / 1–4 choose, ← → navigate
  useEffect(() => {
    if (!hw || !q || isDone) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      const idx = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ['1', '2', '3', '4'].indexOf(k)
      if (idx >= 0 && idx < q.choices.length) answer(hw.id, q.id, idx)
      if (e.key === 'ArrowRight' && step < total - 1) setStep(step + 1)
      if (e.key === 'ArrowLeft' && step > 0) setStep(step - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hw, q, step, total, isDone, answer])

  if (!hw || !progress || !q)
    return (
      <Card className="text-center">
        {t('hw.notFound')} <Link className="text-primary-text underline" to="/homework">{t('hw.backToList')}</Link>
      </Card>
    )

  const status = getHomeworkStatus(progress)
  const selected = progress.answers[q.id]
  const answeredCount = hw.questions.filter((x) => progress.answers[x.id] !== undefined).length
  const allAnswered = answeredCount === total
  const lesson = lessons.find((l) => l.id === hw.lessonId)
  const nextLesson = lesson ? lessons.find((l) => l.order === lesson.order + 1) : undefined

  if (isDone) {
    const score = result?.score ?? progress.score ?? 0
    const correct = hw.questions.filter((x) => progress.answers[x.id] === x.answerIndex).length
    const good = score >= 0.67
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <Link to="/homework" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" /> {t('hw.title')}
        </Link>
        <Card className="p-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <ProgressRing value={score} size={112} stroke={9} color={good ? 'var(--mint)' : 'var(--flare)'} label={t('hw.result.label')}>
              <div>
                <div className="text-2xl font-semibold tabular-nums">{Math.round(score * 100)}%</div>
                <div className="text-xs text-muted">{t('hw.correctOf', { c: correct, n: total })}</div>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{t('hw.submitted')}</p>
              <h1 className="mt-1 text-xl font-semibold">{tr(hw.title)}</h1>
              <p className="mt-1 text-sm text-muted">
                {score === 1 ? t('hw.perfect') : good ? t('hw.good') : t('hw.review')}
                {result && t('hw.xpAdded', { n: result.xp })}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
            {nextLesson && (
              <Button onClick={() => navigate(`/lessons/${nextLesson.id}`)}>
                <CirclePlay /> {t('hw.nextLesson', { title: tr(nextLesson.title) })}
              </Button>
            )}
            {!good && lesson && (
              <Button variant="secondary" onClick={() => navigate(`/lessons/${lesson.id}`)}>
                {t('hw.rewatch')}
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate('/homework')}>
              <ClipboardList /> {t('hw.other')}
            </Button>
          </div>
        </Card>

        <h2 className="mt-2 text-base font-semibold">{t('hw.analysis')}</h2>
        {hw.questions.map((x, i) => {
          const a = progress.answers[x.id]
          const ok = a === x.answerIndex
          return (
            <Card key={x.id} className="p-5">
              <div className="flex items-start gap-3">
                <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-md', ok ? 'bg-mint-500/15 text-mint-500' : 'bg-danger-500/12 text-danger-500')} aria-label={ok ? t('hw.correct') : t('hw.incorrect')}>
                  {ok ? <Check className="size-4" /> : <X className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{i + 1}. {x.prompt}</p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted">{t('hw.correctAnswer')}</span> <span className="font-medium">{LETTERS[x.answerIndex]}) {x.choices[x.answerIndex]}</span>
                    {!ok && a !== undefined && <span className="ml-2 text-danger-500">{t('hw.yourAnswer', { a: LETTERS[a] })}</span>}
                  </p>
                  <p className="mt-3 flex gap-2 rounded-lg bg-surface-sunken p-3 text-sm text-muted">
                    <Lightbulb className="mt-0.5 size-4 shrink-0" /> {tr(x.explanation)}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <Link to="/homework" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" /> {t('hw.title')}
        </Link>
        <span className={cn('text-[13px]', status === 'overdue' ? 'font-medium text-danger-500' : 'text-muted')}>
          {t('hw.dueOn', { date: relativeDue(progress.dueDate) })}
        </span>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <SubjectPill subject={hw.subject} />
          {lesson && <Link to={`/lessons/${lesson.id}`} className="text-[13px] font-medium text-primary-text hover:underline">{t('hw.rewatch')}</Link>}
        </div>
        <h1 className="mt-2 text-2xl font-semibold">{tr(hw.title)}</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {hw.questions.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setStep(i)}
              className={cn(
                'h-1.5 flex-1 cursor-pointer rounded-full transition-colors',
                i === step ? 'bg-primary' : progress.answers[x.id] !== undefined ? 'bg-primary/40' : 'bg-ring-track',
              )}
              aria-label={t('hw.goToQuestion', { n: i + 1 })}
              aria-current={i === step ? 'step' : undefined}
            />
          ))}
        </div>
        <span className="text-[13px] tabular-nums text-muted">{t('hw.answered', { a: answeredCount, n: total })}</span>
      </div>

      <Card className="p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{t('hw.question', { i: step + 1, n: total })}</p>
        <p className="mt-3 text-[17px] leading-relaxed">{q.prompt}</p>
        <div className="mt-5 flex flex-col gap-2" role="radiogroup" aria-label={t('hw.choices')}>
          {q.choices.map((c, i) => (
            <button
              key={i}
              role="radio"
              aria-checked={selected === i}
              onClick={() => answer(hw.id, q.id, i)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                selected === i ? 'border-primary bg-primary-soft' : 'border-border hover:border-border-strong hover:bg-surface-sunken',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-md border text-sm font-semibold',
                  selected === i ? 'border-primary bg-primary text-white' : 'border-border-strong text-muted',
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="text-[15px]">{c}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft /> {t('action.prev')}
        </Button>
        <span className="hidden items-center gap-1.5 text-xs text-subtle md:inline-flex">
          <Keyboard className="size-3.5" /> {t('hw.keys')}
        </span>
        {step < total - 1 ? (
          <Button disabled={selected === undefined} onClick={() => setStep((s) => s + 1)}>
            {t('action.next')} <ArrowRight />
          </Button>
        ) : (
          <Button disabled={!allAnswered} onClick={() => setResult(submit(hw.id))}>
            <Check /> {t('hw.submit')}
          </Button>
        )}
      </div>
      {step === total - 1 && !allAnswered && (
        <p className="text-center text-[13px] text-muted">{t('hw.answerAll')}</p>
      )}
    </div>
  )
}
