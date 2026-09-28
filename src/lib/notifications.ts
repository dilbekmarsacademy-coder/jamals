import type { AppNotification } from '@/types'
import { t, tr } from '@/i18n'
import { badges } from '@/data/badges'
import { homework } from '@/data/homework'
import { levelTitle } from './levels'

/** Renders a stored (language-neutral) notification in the current language */
export function renderNotification(n: AppNotification): { title: string; body: string } {
  const p = n.params ?? {}
  switch (n.kind) {
    case 'level':
      return { title: t('notif.level.title', { level: p.level }), body: t('notif.level.body', { title: levelTitle(Number(p.tier)) }) }
    case 'badge': {
      const b = badges.find((x) => x.id === p.badgeId)
      return { title: t('notif.badge.title', { name: b ? tr(b.name) : String(p.badgeId) }), body: b ? tr(b.description) : '' }
    }
    case 'deadline': {
      const hw = homework.find((h) => h.id === p.hwId)
      return { title: t(p.days === 0 ? 'notif.deadline.today' : 'notif.deadline.tomorrow'), body: hw ? tr(hw.title) : '' }
    }
    case 'streak':
      return { title: t('notif.streak.title', { n: p.n }), body: t('notif.streak.body') }
    default:
      return { title: t('notif.welcome.title'), body: t('notif.welcome.body') }
  }
}
