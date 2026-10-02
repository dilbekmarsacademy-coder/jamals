'use client'

import * as Popover from '@radix-ui/react-dialog'
import { Flag, LayoutGrid, X } from 'lucide-react'
import type { Question } from '@/types'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

export function NavigatorGrid({
  questions,
  answers,
  flagged,
  current,
  onJump,
}: {
  questions: Question[]
  answers: Record<string, number>
  flagged: string[]
  current: number
  onJump: (i: number) => void
}) {
  const { t } = useT()
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {questions.map((q, i) => {
          const answered = answers[q.id] !== undefined
          const isFlagged = flagged.includes(q.id)
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJump(i)}
              aria-label={t('test.goTo', { n: i + 1 })}
              aria-current={i === current ? 'step' : undefined}
              className={cn(
                'relative grid h-10 place-items-center rounded-lg border text-sm font-bold tnum transition',
                answered ? 'border-cyan/40 bg-cyan/15 text-cyan-fg' : 'border-dashed border-line-strong text-muted hover:border-cyan/50',
                i === current && 'ring-2 ring-cyan ring-offset-2 ring-offset-surface',
              )}
            >
              {i + 1}
              {isFlagged && <Flag className="absolute -right-1 -top-1 size-3.5 fill-crimson text-crimson" />}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded border border-cyan/40 bg-cyan/15" />
          {t('test.legendAnswered')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded border border-dashed border-line-strong" />
          {t('test.legendUnanswered')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Flag className="size-3 fill-crimson text-crimson" />
          {t('test.legendFlagged')}
        </span>
      </div>
    </div>
  )
}

/** Bottom-sheet navigator opened from the "Question 3 of 20" button */
export function NavigatorButton(props: Parameters<typeof NavigatorGrid>[0] & { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useT()
  const { open, onOpenChange, ...grid } = props
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3.5 text-sm font-bold text-fg-strong hover:bg-surface-3">
        <LayoutGrid className="size-4 text-cyan-fg" />
        {t('test.qOf', { n: grid.current + 1, total: grid.questions.length })}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
        <Popover.Content className="glass fixed bottom-20 left-1/2 z-50 w-[min(36rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl bg-surface p-5 shadow-2xl outline-none">
          <div className="mb-4 flex items-center justify-between">
            <Popover.Title className="text-base font-bold">{t('test.navigator')}</Popover.Title>
            <Popover.Close className="rounded-md p-1 text-muted hover:text-fg-strong" aria-label={t('common.close')}>
              <X className="size-4" />
            </Popover.Close>
          </div>
          <Popover.Description className="sr-only">{t('test.navigatorHint')}</Popover.Description>
          <NavigatorGrid
            {...grid}
            onJump={(i) => {
              grid.onJump(i)
              onOpenChange(false)
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
