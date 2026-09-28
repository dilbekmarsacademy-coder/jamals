import { CalendarDays, CirclePlay, ClipboardList, House, Trophy, User, type LucideIcon } from 'lucide-react'
import type { TKey } from '@/i18n'

export interface NavItem {
  to: string
  label: TKey
  short: TKey
  icon: LucideIcon
  mobile: boolean
}

export const NAV: NavItem[] = [
  { to: '/', label: 'nav.home', short: 'nav.home.short', icon: House, mobile: true },
  { to: '/lessons', label: 'nav.lessons', short: 'nav.lessons', icon: CirclePlay, mobile: true },
  { to: '/homework', label: 'nav.homework', short: 'nav.homework.short', icon: ClipboardList, mobile: true },
  { to: '/leaderboard', label: 'nav.leaderboard', short: 'nav.leaderboard', icon: Trophy, mobile: true },
  { to: '/attendance', label: 'nav.attendance', short: 'nav.attendance', icon: CalendarDays, mobile: true },
  { to: '/profile', label: 'nav.profile', short: 'nav.profile', icon: User, mobile: false },
]
