import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const ICON_TONES = {
  cyan: 'text-cyan-fg bg-cyan/12',
  violet: 'text-violet-fg bg-violet/12',
  gold: 'text-gold-fg bg-gold/12',
  orange: 'text-orange-fg bg-orange/12',
  emerald: 'text-emerald-fg bg-emerald/12',
  crimson: 'text-crimson-fg bg-crimson/12',
} as const

export type Tone = keyof typeof ICON_TONES

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'cyan',
  className,
  children,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: Tone
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('glass rounded-2xl p-4', className)}>
      <div className="flex items-center gap-2.5">
        <span className={cn('grid size-8 place-items-center rounded-lg', ICON_TONES[tone])}>
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      </div>
      <div className="mt-3 font-display text-2xl font-extrabold tnum text-fg-strong">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
      {children}
    </div>
  )
}
