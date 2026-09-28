import { useT } from '@/i18n'
import { Flame, Zap } from 'lucide-react'
import { useAppStore, useStreak } from '@/store/useAppStore'
import { AnimatedNumber } from './AnimatedNumber'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const chip = 'flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-sm font-semibold tabular-nums'

export function StreakChip() {
  const { t } = useT()
  const { current, activeToday } = useStreak()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={chip} tabIndex={0} aria-label={t('chip.streakAria', { n: current })}>
          <Flame className={cn('size-4', current > 0 ? 'text-ember-500' : 'text-subtle')} />
          {current}
          <span className="hidden text-xs font-normal text-muted sm:inline">{t('unit.daysWord')}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {current === 0 ? t('chip.streak.none') : activeToday ? t('chip.streak.today', { n: current }) : t('chip.streak.risk', { n: current })}
      </TooltipContent>
    </Tooltip>
  )
}

export function XpChip() {
  const { t } = useT()
  const xp = useAppStore((s) => s.xp)
  return (
    <div className={chip} aria-label={t('chip.xpAria', { n: xp })}>
      <Zap className="size-4 text-flare-500" />
      <AnimatedNumber value={xp} />
      <span className="hidden text-xs font-normal text-muted sm:inline">XP</span>
    </div>
  )
}
