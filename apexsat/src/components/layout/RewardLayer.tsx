'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Info, Sparkles, TriangleAlert, X } from 'lucide-react'
import { useT } from '@/i18n'
import { useFx, type Toast } from '@/store/fx'
import { getBadge } from '@/data/badges'
import { levelTitle } from '@/lib/levels'
import { celebrate } from '@/lib/confetti'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BadgeMedal } from '@/components/common/BadgeChip'
import { Cipher } from '@/components/brand/Cipher'
import { cn } from '@/lib/utils'

const TOAST_ICON: Record<Toast['tone'], typeof Info> = { xp: Sparkles, streak: Flame, info: Info, warn: TriangleAlert }
const TOAST_TONE: Record<Toast['tone'], string> = {
  xp: 'text-gold-fg bg-gold/12',
  streak: 'text-orange-fg bg-orange/12',
  info: 'text-cyan-fg bg-cyan/12',
  warn: 'text-crimson-fg bg-crimson/12',
}

function Toasts() {
  const { t } = useT()
  const toasts = useFx((s) => s.toasts)
  const dismiss = useFx((s) => s.dismissToast)
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = TOAST_ICON[toast.tone]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              className="glass pointer-events-auto flex items-start gap-3 rounded-2xl bg-surface p-3 shadow-2xl"
            >
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', TOAST_TONE[toast.tone])}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-fg-strong">{t(toast.title, toast.params)}</p>
                {toast.body && <p className="mt-0.5 text-xs text-muted">{t(toast.body, toast.params)}</p>}
              </div>
              <button onClick={() => dismiss(toast.id)} className="rounded-md p-1 text-muted hover:text-fg-strong" aria-label={t('common.close')}>
                <X className="size-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function CelebrationModal() {
  const { t, tr } = useT()
  const current = useFx((s) => s.celebrations[0])
  const close = useFx((s) => s.closeCelebration)

  useEffect(() => {
    if (current) celebrate()
  }, [current])

  const badge = current?.kind === 'badge' ? getBadge(current.badgeId) : undefined

  return (
    <Dialog open={Boolean(current)} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-sm overflow-hidden text-center" closeLabel={t('common.close')}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(6_182_212/0.25),transparent)]" />
        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={current.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }} className="relative flex flex-col items-center">
              {badge ? (
                <motion.div initial={{ rotate: -20 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 8 }}>
                  <BadgeMedal badge={badge} unlocked size="lg" />
                </motion.div>
              ) : (
                <div className="relative grid size-24 place-items-center rounded-3xl bg-brand-gradient font-display text-4xl font-extrabold text-white shadow-[0_0_40px_rgb(139_92_246/0.5)]">
                  {current.kind === 'level' && current.level}
                </div>
              )}
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-fg">{badge ? t('celebrate.badgeKicker') : t('celebrate.levelKicker')}</p>
              <DialogTitle className="mt-1 text-2xl">{badge ? tr(badge.name) : current.kind === 'level' ? tr(levelTitle(current.level)) : ''}</DialogTitle>
              <DialogDescription className="mt-2">
                {badge ? tr(badge.rule) : current.kind === 'level' ? t('celebrate.levelBody', { level: current.level }) : ''}
              </DialogDescription>
              <div className="mt-5 flex items-end gap-2">
                <Cipher mood="cheer" className="size-14" />
                <p className="mb-2 rounded-2xl rounded-bl-sm border border-line bg-surface-2 px-3 py-2 text-left text-sm">{t('celebrate.cipher')}</p>
              </div>
              <Button className="mt-6 w-full" onClick={close}>
                {t('celebrate.cta')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export function RewardLayer() {
  return (
    <>
      <Toasts />
      <CelebrationModal />
    </>
  )
}
