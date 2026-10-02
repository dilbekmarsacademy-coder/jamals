'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { Lesson } from '@/types'
import { useT } from '@/i18n'
import { getHomework } from '@/data/homework'
import { pop } from '@/lib/confetti'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Cipher } from '@/components/brand/Cipher'

export function CompletionModal({ lesson, xp, open, onOpenChange, nextLessonId }: { lesson: Lesson; xp: number; open: boolean; onOpenChange: (o: boolean) => void; nextLessonId?: string }) {
  const { t, tr } = useT()
  const hw = getHomework(lesson.homeworkId)
  useEffect(() => {
    if (open) pop(0.5, 0.45)
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center" closeLabel={t('common.close')}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(245_158_11/0.22),transparent)]" />
        <div className="relative flex flex-col items-center">
          <Cipher mood="cheer" className="size-20" />
          <DialogTitle className="mt-3 text-2xl">{t('complete.title')}</DialogTitle>
          <DialogDescription className="mt-1">{tr(lesson.title)}</DialogDescription>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gold/15 px-4 py-2 font-display text-2xl font-extrabold text-gold-fg"
          >
            <Sparkles className="size-5" />
            {xp > 0 ? `+${xp} XP` : t('complete.already')}
          </motion.div>
          {hw && <p className="mt-4 text-sm text-muted">{t('complete.bridge', { count: hw.questions.length, xp: hw.xp })}</p>}
          <div className="mt-5 flex w-full flex-col gap-2">
            {hw && (
              <Button asChild size="lg">
                <Link href={`/homework/${hw.id}`}>
                  {t('complete.toHomework')}
                  <ArrowRight />
                </Link>
              </Button>
            )}
            {nextLessonId && (
              <Button asChild variant="ghost">
                <Link href={`/lessons/${nextLessonId}`}>{t('complete.nextLesson')}</Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
