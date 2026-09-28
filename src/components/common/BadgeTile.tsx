import { Lock } from 'lucide-react'
import type { BadgeDefinition, BadgeTier } from '@/types'
import { BadgeIcon } from './BadgeIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date'

const TIER: Record<BadgeTier, { label: string; className: string }> = {
  bronze: { label: 'Bronza', className: 'text-ember-500 bg-ember-500/10 ring-ember-500/25' },
  silver: { label: 'Kumush', className: 'text-muted bg-surface-sunken ring-border-strong' },
  gold: { label: 'Oltin', className: 'text-flare-500 bg-flare-500/10 ring-flare-500/30' },
  cosmic: { label: 'Maxsus', className: 'text-primary-text bg-primary-soft ring-primary/30' },
}

export function BadgeTile({ badge, unlockedAt }: { badge: BadgeDefinition; unlockedAt?: string }) {
  const unlocked = !!unlockedAt
  const tier = TIER[badge.tier]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full cursor-default flex-col items-center gap-2 rounded-lg p-2 text-center transition-colors hover:bg-surface-sunken',
          )}
          aria-label={`${badge.name}: ${unlocked ? badge.description : `qulflangan. ${badge.hint}`}`}
        >
          <span
            className={cn(
              'relative grid size-12 place-items-center rounded-lg ring-1 ring-inset',
              unlocked ? tier.className : 'bg-surface-sunken text-subtle/60 ring-border',
            )}
          >
            <BadgeIcon name={badge.icon} className="size-5" />
            {!unlocked && (
              <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-surface ring-1 ring-border">
                <Lock className="size-3 text-subtle" />
              </span>
            )}
          </span>
          <span className={cn('line-clamp-2 text-xs leading-tight', unlocked ? 'font-medium text-foreground' : 'text-subtle')}>{badge.name}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">{badge.name}</span>
          <span className="text-xs text-muted">{tier.label}</span>
        </div>
        <p className="mt-1 text-muted">{unlocked ? badge.description : `Qanday olinadi: ${badge.hint}`}</p>
        {unlockedAt && <p className="mt-1 text-xs text-subtle">Olingan sana: {formatDate(unlockedAt)}</p>}
      </TooltipContent>
    </Tooltip>
  )
}
