'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Flame } from 'lucide-react'
import type { LeaguePlayer, Tier } from '@/types'
import { useT } from '@/i18n'
import { DEMOTE, PROMOTE } from '@/data/league'
import { Avatar } from '@/components/common/Avatar'
import { TierBadge } from '@/components/common/TierBadge'
import { cn } from '@/lib/utils'

function Row({ p, rank, total, tier, rowRef }: { p: LeaguePlayer; rank: number; total: number; tier: Tier; rowRef?: React.Ref<HTMLLIElement> }) {
  const { t, n } = useT()
  const promo = rank <= PROMOTE && tier !== 'master'
  const demo = rank > total - DEMOTE && tier !== 'bronze'
  return (
    <li
      ref={rowRef}
      className={cn(
        'grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-xl px-3 py-2.5 sm:grid-cols-[2.5rem_1fr_5rem_8rem_6rem]',
        p.isMe ? 'bg-cyan/10 ring-1 ring-cyan/40' : 'hover:bg-surface-2/50',
      )}
    >
      <span className="flex items-center gap-0.5">
        <span className={cn('w-6 text-right text-sm font-extrabold tnum', promo ? 'text-emerald-fg' : demo ? 'text-crimson-fg' : 'text-muted')}>{rank}</span>
        {promo && <ChevronUp className="size-4 text-emerald-fg" aria-label={t('league.promotion')} />}
        {demo && <ChevronDown className="size-4 text-crimson-fg" aria-label={t('league.demotion')} />}
      </span>
      <span className="flex min-w-0 items-center gap-3">
        <Avatar name={p.username} hue={p.avatarHue} className="size-8 text-[10px]" ring={p.isMe} />
        <span className="min-w-0">
          <span className={cn('block truncate text-sm', p.isMe ? 'font-extrabold text-fg-strong' : 'font-semibold text-fg')}>
            {p.username}
            {p.isMe && <span className="ml-1.5 rounded bg-cyan px-1 py-px text-[10px] font-bold text-[#04121a]">{t('league.you')}</span>}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted sm:hidden">
            <Flame className="size-3 text-orange" /> {p.streak}
          </span>
        </span>
      </span>
      <span className="hidden items-center gap-1 text-sm font-semibold tnum text-orange-fg sm:flex">
        <Flame className="size-4" />
        {p.streak}
      </span>
      <span className="hidden sm:block">
        <TierBadge tier={tier} />
      </span>
      <span className="text-right text-sm font-extrabold tnum text-fg-strong">
        {n(p.weekXp)} <span className="text-xs font-semibold text-muted">XP</span>
      </span>
    </li>
  )
}

function ZoneDivider({ tone, label }: { tone: 'up' | 'down'; label: string }) {
  return (
    <li className={cn('flex items-center gap-3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider', tone === 'up' ? 'text-emerald-fg' : 'text-crimson-fg')}>
      <span className={cn('h-px flex-1', tone === 'up' ? 'bg-emerald/40' : 'bg-crimson/40')} />
      {tone === 'up' ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      {label}
      <span className={cn('h-px flex-1', tone === 'up' ? 'bg-emerald/40' : 'bg-crimson/40')} />
    </li>
  )
}

/** Weekly standings with promotion/demotion zones; "you" is pinned when scrolled away */
export function Standings({ players, tier }: { players: LeaguePlayer[]; tier: Tier }) {
  const { t } = useT()
  const meRef = useRef<HTMLLIElement>(null)
  const [meVisible, setMeVisible] = useState(true)
  const meIndex = players.findIndex((p) => p.isMe)

  useEffect(() => {
    const el = meRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setMeVisible(entry.isIntersecting), { rootMargin: '-64px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [players])

  const total = players.length
  return (
    <div className="relative">
      <div className="mb-2 hidden grid-cols-[2.5rem_1fr_5rem_8rem_6rem] gap-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-subtle sm:grid">
        <span>#</span>
        <span>{t('league.student')}</span>
        <span>{t('league.streak')}</span>
        <span>{t('league.tier')}</span>
        <span className="text-right">{t('league.weekXp')}</span>
      </div>
      <ol className="space-y-1">
        {players.map((p, i) => (
          <Fragment key={p.id}>
            <Row p={p} rank={i + 1} total={total} tier={tier} rowRef={p.isMe ? meRef : undefined} />
            {i === PROMOTE - 1 && tier !== 'master' && <ZoneDivider tone="up" label={t('league.promotionZone')} />}
            {i === total - DEMOTE - 1 && tier !== 'bronze' && <ZoneDivider tone="down" label={t('league.demotionZone')} />}
          </Fragment>
        ))}
      </ol>
      <AnimatePresence>
        {meIndex >= 0 && !meVisible && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="sticky bottom-3 z-10 mt-2">
            <ol className="glass rounded-2xl bg-surface/95 p-1 shadow-2xl">
              <Row p={players[meIndex]} rank={meIndex + 1} total={total} tier={tier} />
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

}
