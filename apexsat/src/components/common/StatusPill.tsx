'use client'

import { Check, CircleDashed, Clock, AlertTriangle, Sparkles, X, Timer } from 'lucide-react'
import type { HomeworkStatus, SessionStatus } from '@/types'
import { useT, type MessageKey } from '@/i18n'
import { cn } from '@/lib/utils'

type PillKind = HomeworkStatus | SessionStatus | 'upcoming' | 'rest'

const STYLES: Record<PillKind, { cls: string; icon: typeof Check; key: MessageKey }> = {
  NOT_STARTED: { cls: 'bg-surface-3/70 text-muted border-line', icon: CircleDashed, key: 'status.notStarted' },
  IN_PROGRESS: { cls: 'bg-gold/12 text-gold-fg border-gold/30', icon: Clock, key: 'status.inProgress' },
  OVERDUE: { cls: 'bg-crimson/12 text-crimson-fg border-crimson/35', icon: AlertTriangle, key: 'status.overdue' },
  COMPLETED: { cls: 'bg-emerald/12 text-emerald-fg border-emerald/30', icon: Check, key: 'status.completed' },
  attended: { cls: 'bg-emerald/12 text-emerald-fg border-emerald/30', icon: Check, key: 'att.attended' },
  late: { cls: 'bg-gold/12 text-gold-fg border-gold/30', icon: Timer, key: 'att.late' },
  missed: { cls: 'bg-crimson/12 text-crimson-fg border-crimson/35', icon: X, key: 'att.missed' },
  bonus: { cls: 'bg-violet/14 text-violet-fg border-violet/35', icon: Sparkles, key: 'att.bonus' },
  upcoming: { cls: 'bg-cyan/10 text-cyan-fg border-cyan/30', icon: Clock, key: 'att.upcoming' },
  rest: { cls: 'bg-surface-3/50 text-subtle border-line', icon: CircleDashed, key: 'att.rest' },
}

export function StatusPill({ status, className, compact }: { status: PillKind; className?: string; compact?: boolean }) {
  const { t } = useT()
  const s = STYLES[status]
  const Icon = s.icon
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold', s.cls, className)}>
      <Icon className="size-3" aria-hidden />
      {!compact && t(s.key)}
    </span>
  )
}
