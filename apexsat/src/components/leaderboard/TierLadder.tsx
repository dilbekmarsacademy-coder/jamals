'use client'

import { Lock } from 'lucide-react'
import { TIERS, type Tier } from '@/types'
import { TIER_META, MY_TIER } from '@/data/league'
import { useT } from '@/i18n'
import { TierIcon } from '@/components/common/TierBadge'
import { cn } from '@/lib/utils'

export function TierLadder({ selected, onSelect }: { selected: Tier; onSelect: (t: Tier) => void }) {
  const { tr, t } = useT()
  const myIndex = TIERS.indexOf(MY_TIER)
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin" role="tablist" aria-label={t('league.tiers')}>
      {TIERS.map((tier, i) => {
        const locked = i > myIndex
        const active = tier === selected
        return (
          <div key={tier} className="flex items-center gap-1">
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(tier)}
              className={cn(
                'flex min-w-24 flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 transition',
                active ? 'border-cyan/50 bg-cyan/10' : 'border-line bg-surface-2/30 hover:bg-surface-2/70',
                locked && 'opacity-60',
              )}
            >
              <span className="relative">
                <TierIcon tier={tier} className="size-10 rounded-xl [&_svg]:size-5" />
                {locked && <Lock className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-surface p-0.5 text-muted" />}
              </span>
              <span className="text-xs font-bold" style={{ color: active ? TIER_META[tier].color : undefined }}>
                {tr(TIER_META[tier].name)}
              </span>
              {tier === MY_TIER && <span className="rounded-full bg-cyan px-1.5 text-[10px] font-bold text-[#04121a]">{t('league.you')}</span>}
            </button>
            {i < TIERS.length - 1 && <span className="text-subtle">›</span>}
          </div>
        )
      })}
    </div>
  )
}
