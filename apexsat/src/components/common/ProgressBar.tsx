'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const TONES = {
  brand: 'bg-[linear-gradient(90deg,var(--cyan-bright),var(--violet))]',
  cyan: 'bg-cyan',
  violet: 'bg-violet',
  gold: 'bg-gold',
  orange: 'bg-orange',
  emerald: 'bg-emerald',
  crimson: 'bg-crimson',
} as const

export function ProgressBar({
  value,
  tone = 'brand',
  className,
  height = 'h-2',
  label,
}: {
  /** 0..1 */
  value: number
  tone?: keyof typeof TONES
  className?: string
  height?: string
  label?: string
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={cn('w-full overflow-hidden rounded-full bg-surface-3/70', height, className)}
    >
      <motion.div
        className={cn('h-full rounded-full', TONES[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      />
    </div>
  )
}
