'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '@/i18n'
import { useFx } from '@/store/fx'
import { useLevel } from '@/hooks/useDerived'
import { ProgressBar } from '@/components/common/ProgressBar'
import { cn } from '@/lib/utils'

/** Floating "+XP" labels that rise from the level chip */
export function XPFloatAnimation() {
  const floats = useFx((s) => s.floats)
  return (
    <div className="pointer-events-none absolute inset-x-0 top-full flex justify-center" aria-live="polite">
      <AnimatePresence>
        {floats.map((f, i) => (
          <motion.span
            key={f.id}
            initial={{ opacity: 0, y: 14, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: [14, -4, -18, -34], scale: [0.7, 1.15, 1, 1] }}
            transition={{ duration: 1.5, times: [0, 0.2, 0.7, 1] }}
            className="absolute whitespace-nowrap rounded-full bg-gold px-2.5 py-0.5 text-sm font-extrabold text-[#1a1203] shadow-[0_0_20px_rgb(245_158_11/0.6)]"
            style={{ marginLeft: i * 12 }}
          >
            +{f.amount} XP
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function LevelChip({ className }: { className?: string }) {
  const { t, tr, n } = useT()
  const lvl = useLevel()
  return (
    <div className={cn('relative flex h-9 items-center gap-2.5 rounded-xl border border-line bg-surface/70 pl-1 pr-3', className)}>
      <span className="grid size-7 place-items-center rounded-lg bg-brand-gradient text-xs font-extrabold tnum text-white">{lvl.level}</span>
      <div className="w-28 sm:w-36">
        <div className="flex items-baseline justify-between gap-2 text-[11px] leading-none">
          <span className="truncate font-semibold text-fg-strong">{tr(lvl.title)}</span>
          <span className="tnum text-muted">
            {n(lvl.into)}/{n(lvl.need)}
          </span>
        </div>
        <ProgressBar value={lvl.progress} height="h-1.5" className="mt-1.5" label={t('level.progress')} />
      </div>
      <XPFloatAnimation />
    </div>
  )
}
