'use client'

import { Strikethrough, Undo2 } from 'lucide-react'
import type { Question } from '@/types'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

const LETTERS = ['A', 'B', 'C', 'D']

export function ChoiceList({
  q,
  selected,
  eliminated,
  eliminator,
  onSelect,
  onEliminate,
}: {
  q: Question
  selected: number | undefined
  eliminated: number[]
  eliminator: boolean
  onSelect: (i: number) => void
  onEliminate: (i: number) => void
}) {
  const { t } = useT()
  return (
    <div role="radiogroup" aria-label={t('test.choices')} className="space-y-2.5">
      {q.choices.map((c, i) => {
        const isSel = selected === i
        const isOut = eliminated.includes(i)
        return (
          <div key={i} className="flex items-stretch gap-2">
            <button
              type="button"
              role="radio"
              aria-checked={isSel}
              onClick={() => onSelect(i)}
              className={cn(
                'group flex flex-1 items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left text-[15px] transition',
                isSel ? 'border-cyan bg-cyan/10 text-fg-strong shadow-[0_0_0_4px_rgb(6_182_212/0.12)]' : 'border-line bg-surface-2/30 text-fg hover:border-line-strong hover:bg-surface-2/60',
                isOut && !isSel && 'opacity-50',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold',
                  isSel ? 'border-cyan bg-cyan text-[#04121a]' : 'border-line-strong text-muted group-hover:border-cyan/60',
                )}
              >
                {LETTERS[i]}
              </span>
              <span className={cn('pt-0.5 leading-snug', isOut && 'line-through decoration-crimson decoration-2')}>{c}</span>
            </button>
            {eliminator && (
              <button
                type="button"
                onClick={() => onEliminate(i)}
                aria-label={isOut ? t('test.restore', { letter: LETTERS[i] }) : t('test.eliminate', { letter: LETTERS[i] })}
                className={cn('grid w-11 shrink-0 place-items-center rounded-xl border text-xs font-bold transition', isOut ? 'border-crimson/40 bg-crimson/10 text-crimson-fg' : 'border-line text-muted hover:text-crimson-fg')}
              >
                {isOut ? <Undo2 className="size-4" /> : <span className="line-through decoration-2">{LETTERS[i]}</span>}
              </button>
            )}
          </div>
        )
      })}
      {eliminator && (
        <p className="flex items-center gap-1.5 text-[11px] text-subtle">
          <Strikethrough className="size-3" />
          {t('test.eliminatorHint')}
        </p>
      )}
    </div>
  )
}
