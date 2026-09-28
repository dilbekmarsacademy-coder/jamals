import { Flame, Zap } from 'lucide-react'
import { useAppStore, useStreak } from '@/store/useAppStore'
import { AnimatedNumber } from './AnimatedNumber'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const chip = 'flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-sm font-semibold tabular-nums'

export function StreakChip() {
  const { current, activeToday } = useStreak()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={chip} tabIndex={0} aria-label={`Kunlik seriya: ${current} kun`}>
          <Flame className={cn('size-4', current > 0 ? 'text-ember-500' : 'text-subtle')} />
          {current}
          <span className="hidden text-xs font-normal text-muted sm:inline">kun</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {current === 0
          ? 'Kunlik seriya hali boshlanmagan. Bugun bitta dars yoki vazifa bajaring.'
          : activeToday
            ? `${current} kun ketma-ket shug‘ullandingiz. Bugungi kun hisobga olindi.`
            : `${current} kunlik seriya. Uni saqlash uchun bugun bitta dars yoki vazifa bajaring.`}
      </TooltipContent>
    </Tooltip>
  )
}

export function XpChip() {
  const xp = useAppStore((s) => s.xp)
  return (
    <div className={chip} aria-label={`Jami XP: ${xp}`}>
      <Zap className="size-4 text-flare-500" />
      <AnimatedNumber value={xp} />
      <span className="hidden text-xs font-normal text-muted sm:inline">XP</span>
    </div>
  )
}
