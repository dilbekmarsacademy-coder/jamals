import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Flame, TrendingUp, X, Zap } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { badges } from '@/data/badges'
import { BadgeIcon } from '@/components/common/BadgeIcon'
import { subtleCelebration } from '@/lib/celebrate'
import { getLevelInfo, xpAtLevel } from '@/lib/levels'
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
      <button onClick={onDone} className="-m-1 cursor-pointer rounded-md p-1 text-subtle hover:bg-surface-sunken hover:text-foreground" aria-label="Yopish">
        <X className="size-4" />
      </button>
    </motion.div>
  )
}

function describe(r: RewardEvent) {
  switch (r.type) {
    case 'xp':
      return { eyebrow: 'XP qo‘shildi', title: `+${r.amount} XP`, body: r.reason, icon: <Zap className="size-4" />, iconClass: 'bg-flare-500/15 text-flare-500' }
    case 'streak':
      return { eyebrow: 'Kunlik seriya', title: `${r.days} kun ketma-ket`, body: 'Bugungi mashg‘ulot hisobga olindi', icon: <Flame className="size-4" />, iconClass: 'bg-ember-500/15 text-ember-500' }
    case 'badge': {
      const b = badges.find((x) => x.id === r.badgeId)
      return {
        eyebrow: 'Yangi yutuq',
        title: b?.name ?? 'Yutuq',
        body: b?.description,
        icon: b ? <BadgeIcon name={b.icon} className="size-4" /> : <Award className="size-4" />,
        iconClass: 'bg-primary-soft text-primary-text',
      }
    }
    case 'level':
      return {
        eyebrow: 'Daraja oshdi',
        title: `${r.level}-daraja · ${getLevelInfo(xpAtLevel(r.level)).title}`,
        body: 'Profilda daraja tarixini ko‘rishingiz mumkin',
        icon: <TrendingUp className="size-4" />,
        iconClass: 'bg-primary-soft text-primary-text',
      }
  }
}
