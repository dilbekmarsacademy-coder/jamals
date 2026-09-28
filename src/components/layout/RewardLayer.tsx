import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Flame, TrendingUp, X, Zap } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { badges } from '@/data/badges'
import { BadgeIcon } from '@/components/common/BadgeIcon'
import { subtleCelebration } from '@/lib/celebrate'
import { getLevelInfo, levelTitle, xpAtLevel } from '@/lib/levels'
import { lessons } from '@/data/lessons'
import { homework } from '@/data/homework'
import { t, tr, useT } from '@/i18n'
import type { RewardEvent } from '@/types'
import { cn } from '@/lib/utils'

const DURATION: Record<RewardEvent['type'], number> = { xp: 3000, streak: 3500, badge: 6000, level: 6000 }

/**
 * Non-blocking feedback for XP, streak, badge and level-up events.
 * Toasts stack in the bottom-right corner (above the mobile nav) and never cover the work area.
 */
export function RewardLayer() {
  const rewards = useAppStore((s) => s.rewards)
  const dismiss = useAppStore((s) => s.dismissReward)
  const visible = rewards.slice(0, 4)

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-20 z-[80] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 lg:bottom-6"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {visible.map((r) => (
          <RewardToast key={r.id} reward={r} onDone={() => dismiss(r.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function RewardToast({ reward, onDone }: { reward: RewardEvent; onDone: () => void }) {
  useEffect(() => {
    if (reward.type === 'badge' || reward.type === 'level') subtleCelebration()
    const t = setTimeout(onDone, DURATION[reward.type])
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useT() // re-render on language change
  const content = describe(reward)
  const big = reward.type === 'badge' || reward.type === 'level'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('surface-raised pointer-events-auto flex w-full items-start gap-3 rounded-xl p-3.5 sm:w-80', big && 'ring-1 ring-primary/30')}
    >
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', content.iconClass)}>{content.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">{content.eyebrow}</p>
        <p className="text-sm font-semibold">{content.title}</p>
        {content.body && <p className="mt-0.5 truncate text-[13px] text-muted">{content.body}</p>}
      </div>
      <button onClick={onDone} className="-m-1 cursor-pointer rounded-md p-1 text-subtle hover:bg-surface-sunken hover:text-foreground" aria-label={t('action.close')}>
        <X className="size-4" />
      </button>
    </motion.div>
  )
}

function describe(r: RewardEvent) {
  switch (r.type) {
    case 'xp': {
      const title =
        r.source.type === 'lesson'
          ? lessons.find((l) => l.id === r.source.id)?.title
          : homework.find((h) => h.id === r.source.id)?.title
      return {
        eyebrow: t('reward.xp.eyebrow'),
        title: `+${r.amount} XP`,
        body: title ? t(r.source.type === 'lesson' ? 'reward.lesson' : 'reward.homework', { title: tr(title) }) : undefined,
        icon: <Zap className="size-4" />,
        iconClass: 'bg-flare-500/15 text-flare-500',
      }
    }
    case 'streak':
      return {
        eyebrow: t('reward.streak.eyebrow'),
        title: t('reward.streak.title', { n: r.days }),
        body: t('reward.streak.body'),
        icon: <Flame className="size-4" />,
        iconClass: 'bg-ember-500/15 text-ember-500',
      }
    case 'badge': {
      const b = badges.find((x) => x.id === r.badgeId)
      return {
        eyebrow: t('reward.badge.eyebrow'),
        title: b ? tr(b.name) : r.badgeId,
        body: b ? tr(b.description) : undefined,
        icon: b ? <BadgeIcon name={b.icon} className="size-4" /> : <Award className="size-4" />,
        iconClass: 'bg-primary-soft text-primary-text',
      }
    }
    case 'level':
      return {
        eyebrow: t('reward.level.eyebrow'),
        title: `${t('level.n', { n: r.level })} · ${levelTitle(getLevelInfo(xpAtLevel(r.level)).tier)}`,
        body: t('reward.level.body'),
        icon: <TrendingUp className="size-4" />,
        iconClass: 'bg-primary-soft text-primary-text',
      }
  }
}
