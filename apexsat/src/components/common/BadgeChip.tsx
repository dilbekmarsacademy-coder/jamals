'use client'

import { Moon, Crosshair, CalendarCheck, Shield, Play, Flame, Zap, Target, GraduationCap, Swords, NotebookPen, Gem, Lock, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { BadgeDef } from '@/types'
import { useT } from '@/i18n'
import { Tooltip } from '@/components/ui/tooltip'
import { ProgressBar } from './ProgressBar'
import { cn } from '@/lib/utils'

export const BADGE_ICONS: Record<string, LucideIcon> = {
  moon: Moon,
  crosshair: Crosshair,
  'calendar-check': CalendarCheck,
  shield: Shield,
  play: Play,
  flame: Flame,
  zap: Zap,
  target: Target,
  'graduation-cap': GraduationCap,
  swords: Swords,
  'notebook-pen': NotebookPen,
  gem: Gem,
}

export const BADGE_COLORS: Record<BadgeDef['color'], { ring: string; fill: string; text: string; glow: string }> = {
  cyan: { ring: 'from-cyan-bright to-cyan', fill: 'bg-cyan/15', text: 'text-cyan-fg', glow: 'shadow-[0_0_24px_-4px_rgb(6_182_212/0.6)]' },
  violet: { ring: 'from-violet-fg to-violet-deep', fill: 'bg-violet/15', text: 'text-violet-fg', glow: 'shadow-[0_0_24px_-4px_rgb(139_92_246/0.6)]' },
  gold: { ring: 'from-gold-fg to-gold', fill: 'bg-gold/15', text: 'text-gold-fg', glow: 'shadow-[0_0_24px_-4px_rgb(245_158_11/0.55)]' },
  orange: { ring: 'from-orange-fg to-orange', fill: 'bg-orange/15', text: 'text-orange-fg', glow: 'shadow-[0_0_24px_-4px_rgb(249_115_22/0.55)]' },
  emerald: { ring: 'from-emerald-fg to-emerald', fill: 'bg-emerald/15', text: 'text-emerald-fg', glow: 'shadow-[0_0_24px_-4px_rgb(16_185_129/0.55)]' },
  crimson: { ring: 'from-crimson-fg to-crimson', fill: 'bg-crimson/15', text: 'text-crimson-fg', glow: 'shadow-[0_0_24px_-4px_rgb(239_68_68/0.55)]' },
}

/** Hexagon-clipped medallion */
export function BadgeMedal({ badge, unlocked, size = 'md' }: { badge: BadgeDef; unlocked: boolean; size?: 'md' | 'lg' }) {
  const Icon = BADGE_ICONS[badge.icon] ?? Target
  const c = BADGE_COLORS[badge.color]
  const dim = size === 'lg' ? 'size-24' : 'size-16'
  return (
    <div className={cn('relative grid place-items-center', dim)}>
      <div
        className={cn('absolute inset-0 bg-gradient-to-br', unlocked ? c.ring : 'from-surface-3 to-surface-2')}
        style={{ clipPath: 'polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
      />
      <div
        className={cn('absolute inset-[3px] grid place-items-center bg-surface', unlocked && c.fill)}
        style={{ clipPath: 'polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
      >
        <Icon className={cn(size === 'lg' ? 'size-10' : 'size-7', unlocked ? c.text : 'text-subtle')} strokeWidth={1.8} />
      </div>
      {!unlocked && (
        <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border border-line bg-surface-2">
          <Lock className="size-3 text-muted" />
        </span>
      )}
    </div>
  )
}

export function BadgeChip({ badge, value, goal, unlocked, unlockedAt }: { badge: BadgeDef; value: number; goal: number; unlocked: boolean; unlockedAt?: string }) {
  const { tr, t, locale } = useT()
  const tip = (
    <div className="space-y-1.5">
      <p className="font-semibold text-fg-strong">{tr(badge.name)}</p>
      <p>{tr(badge.rule)}</p>
      {unlocked ? (
        <p className="text-emerald-fg">{t('badge.unlockedOn', { date: new Date(unlockedAt!).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) })}</p>
      ) : (
        <>
          <ProgressBar value={value / goal} height="h-1.5" tone="cyan" />
          <p className="tnum text-muted">{t('badge.progress', { value, goal })}</p>
        </>
      )}
    </div>
  )
  return (
    <Tooltip content={tip}>
      <motion.button
        type="button"
        whileHover={{ y: -3 }}
        className={cn(
          'group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center transition hover:border-line hover:bg-surface-2/50',
          !unlocked && 'opacity-80',
        )}
        aria-label={`${tr(badge.name)} — ${unlocked ? t('badge.unlocked') : t('badge.progress', { value, goal })}`}
      >
        <BadgeMedal badge={badge} unlocked={unlocked} />
        <span className={cn('text-xs font-semibold', unlocked ? 'text-fg-strong' : 'text-muted')}>{tr(badge.name)}</span>
        {!unlocked && goal > 1 && <span className="text-[11px] tnum text-subtle">{value}/{goal}</span>}
      </motion.button>
    </Tooltip>
  )
}
