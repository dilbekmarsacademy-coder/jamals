'use client'

import { Gem, Crown, Shield } from 'lucide-react'
import type { Tier } from '@/types'
import { TIER_META } from '@/data/league'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

export function TierIcon({ tier, className }: { tier: Tier; className?: string }) {
  const color = TIER_META[tier].color
  const Icon = tier === 'master' ? Crown : tier === 'diamond' ? Gem : Shield
  return (
    <span className={cn('grid size-7 place-items-center rounded-lg', className)} style={{ background: `${color}22`, color }}>
      <Icon className="size-4" strokeWidth={2.2} />
    </span>
  )
}

export function TierBadge({ tier, className, withLabel = true }: { tier: Tier; className?: string; withLabel?: boolean }) {
  const { tr, t } = useT()
  const meta = TIER_META[tier]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', className)} style={{ color: meta.color }}>
      <TierIcon tier={tier} className="size-5 rounded-md [&_svg]:size-3" />
      {withLabel && t('league.name', { tier: tr(meta.name) })}
    </span>
  )
}
