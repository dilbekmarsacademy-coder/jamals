import { useT } from '@/i18n'
import { Lock } from 'lucide-react'
import type { BadgeDefinition, BadgeTier } from '@/types'
import { BadgeIcon } from './BadgeIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date'

const TIER: Record<BadgeTier, { className: string }> = {
  bronze: { className: 'text-ember-500 bg-ember-500/10 ring-ember-500/25' },
  silver: { className: 'text-muted bg-surface-sunken ring-border-strong' },
  gold: { className: 'text-flare-500 bg-flare-500/10 ring-flare-500/30' },
  cosmic: { className: 'text-primary-text bg-primary-soft ring-primary/30' },
}

export function BadgeTile({ badge, unlockedAt }: { badge: BadgeDefinition; unlockedAt?: string }) {
  const { t, tr } = useT()
  const unlocked = !!unlockedAt
  const tier = TIER[badge.tier]
  const name = tr(badge.name)
  const hint = tr(badge.hint)
  const description = tr(badge.description)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full cursor-default flex-col items-center gap-2 rounded-lg p-2 text-center transition-colors hover:bg-surface-sunken',
          )}
          aria-label={`${name}: ${unlocked ? description : t('badge.locked', { hint })}`}
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
          <span className={cn('line-clamp-2 text-xs leading-tight', unlocked ? 'font-medium text-foreground' : 'text-subtle')}>{name}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">{name}</span>
          <span className="text-xs text-muted">{t(`badge.tier.${badge.tier}`)}</span>
        </div>
        <p className="mt-1 text-muted">{unlocked ? description : t('badge.howTo', { hint })}</p>
        {unlockedAt && <p className="mt-1 text-xs text-subtle">{t('badge.earnedOn', { date: formatDate(unlockedAt) })}</p>}
      </TooltipContent>
    </Tooltip>
  )
}
