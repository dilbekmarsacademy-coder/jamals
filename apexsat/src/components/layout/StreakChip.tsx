'use client'

import { Flame, Snowflake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '@/i18n'
import { useFx } from '@/store/fx'
import { useStreak } from '@/hooks/useDerived'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function StreakChip({ now, className }: { now: Date; className?: string }) {
  const { t } = useT()
  const { streak, activeToday, freezes } = useStreak(now)
  const pulse = useFx((s) => s.streakPulse)
  return (
    <Tooltip content={activeToday ? t('streak.safe') : t('streak.atRisk')}>
      <div className={cn('flex h-9 items-center gap-2.5 rounded-xl border border-line bg-surface/70 px-2.5', className)}>
        <span className="flex items-center gap-1">
          <motion.span key={pulse} initial={{ scale: pulse ? 1.6 : 1, rotate: pulse ? -12 : 0 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
            <Flame className={cn('size-[18px]', activeToday ? 'fill-orange/40 text-orange' : 'text-orange/60')} />
          </motion.span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={streak} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="text-sm font-extrabold tnum text-orange-fg">
              {streak}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="h-4 w-px bg-line" />
        <span className="flex items-center gap-1 text-sm font-bold tnum text-cyan-fg" aria-label={t('streak.freezes', { count: freezes })}>
          <Snowflake className="size-4" />
          {freezes}
        </span>
      </div>
    </Tooltip>
  )
}
