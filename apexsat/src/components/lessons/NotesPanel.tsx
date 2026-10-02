'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Plus, Trash2, NotebookPen } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { Button } from '@/components/ui/button'
import { formatClock, cn } from '@/lib/utils'
import type { Player } from './VideoPlayer'

const schema = z.object({ text: z.string().trim().min(1, 'notes.empty').max(500, 'notes.tooLong') })
type Values = z.infer<typeof schema>

const EMPTY: never[] = []

export function NotesPanel({ lessonId, player }: { lessonId: string; player: Player }) {
  const { t } = useT()
  const notes = useApex((s) => s.notes[lessonId] ?? EMPTY)
  const addNote = useApex((s) => s.addNote)
  const deleteNote = useApex((s) => s.deleteNote)
  // Timestamp is captured when you start writing, so it matches what you were watching
  const [stamp, setStamp] = useState<number | null>(null)
  const { register, handleSubmit, reset, formState, control } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { text: '' } })
  const text = useWatch({ control, name: 'text' })

  const onSubmit = (v: Values) => {
    addNote(lessonId, stamp ?? player.position, v.text)
    reset({ text: '' })
    setStamp(null)
  }

  const activeId = [...notes].reverse().find((n) => player.position >= n.t - 1)?.id

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="relative rounded-xl border border-line bg-surface-2/50 focus-within:border-cyan focus-within:ring-2 focus-within:ring-cyan/20">
          <textarea
            rows={3}
            placeholder={t('notes.placeholder')}
            className="block w-full resize-none bg-transparent px-3 pb-9 pt-2.5 text-sm text-fg-strong outline-none placeholder:text-subtle"
            {...register('text', {
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (stamp === null && e.target.value) setStamp(player.position)
              },
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void handleSubmit(onSubmit)()
            }}
          />
          <button
            type="button"
            onClick={() => setStamp(player.position)}
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-gold/15 px-1.5 py-0.5 font-mono text-[11px] font-bold tnum text-gold-fg hover:bg-gold/25"
            title={t('notes.restamp')}
          >
            <Clock className="size-3" />
            {formatClock(stamp ?? player.position)}
          </button>
          <span className="absolute bottom-2 right-2 text-[11px] tnum text-subtle">{text?.length ?? 0}/500</span>
        </div>
        {formState.errors.text && <p className="text-xs text-crimson-fg">{t(formState.errors.text.message as 'notes.empty')}</p>}
        <Button type="submit" size="sm" className="w-full">
          <Plus />
          {t('notes.add')}
        </Button>
      </form>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
        {notes.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
            <NotebookPen className="size-6 text-subtle" />
            {t('notes.emptyList')}
          </div>
        )}
        <AnimatePresence initial={false}>
          {notes.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn('group flex gap-2.5 rounded-xl border p-2.5 transition', n.id === activeId ? 'border-cyan/40 bg-cyan/5' : 'border-line bg-surface-2/30')}
            >
              <button
                type="button"
                onClick={() => {
                  player.seek(n.t)
                  player.play()
                }}
                className="h-fit shrink-0 rounded-md bg-gold/15 px-1.5 py-0.5 font-mono text-[11px] font-bold tnum text-gold-fg transition hover:bg-gold hover:text-[#1a1203]"
                aria-label={t('notes.jump', { time: formatClock(n.t) })}
              >
                {formatClock(n.t)}
              </button>
              <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm text-fg">{n.text}</p>
              <button
                type="button"
                onClick={() => deleteNote(lessonId, n.id)}
                className="h-fit rounded-md p-1 text-subtle opacity-0 transition hover:text-crimson-fg focus:opacity-100 group-hover:opacity-100"
                aria-label={t('notes.delete')}
              >
                <Trash2 className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
