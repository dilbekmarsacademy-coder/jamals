'use client'

import { useT } from '@/i18n'
import { useNow } from '@/hooks/useNow'
import { countdownParts } from '@/lib/date'
import { pad2, cn } from '@/lib/utils'

/** Live D : H : M : S countdown with tabular digits */
export function Countdown({ target, className, size = 'md' }: { target: Date; className?: string; size?: 'sm' | 'md' }) {
  const { t } = useT()
  const now = useNow(1000)
  const p = countdownParts(target, now)
  const parts = [
    [p.days, t('time.d')],
    [p.hours, t('time.h')],
    [p.mins, t('time.m')],
    [p.secs, t('time.s')],
  ] as const
  return (
    <div className={cn('flex items-start gap-1.5', className)} role="timer" aria-label={t('countdown.aria', { days: p.days, hours: p.hours, mins: p.mins })}>
      {parts.map(([v, label], i) => (
        <div key={label} className="flex items-start gap-1.5">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'rounded-lg border border-line bg-surface-2/80 text-center font-display font-extrabold tnum text-fg-strong',
                size === 'md' ? 'min-w-11 px-1.5 py-1 text-xl' : 'min-w-8 px-1 py-0.5 text-sm',
              )}
            >
              {i === 0 ? v : pad2(v)}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-subtle">{label}</span>
          </div>
          {i < 3 && <span className={cn('font-bold text-subtle', size === 'md' ? 'pt-1.5 text-lg' : 'pt-0.5 text-sm')}>:</span>}
        </div>
      ))}
    </div>
  )
}
