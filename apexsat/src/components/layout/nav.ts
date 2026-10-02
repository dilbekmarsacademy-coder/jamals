import { LayoutDashboard, BookOpen, ClipboardList, Trophy, CalendarDays, Brain, type LucideIcon } from 'lucide-react'
import type { MessageKey } from '@/i18n'

export interface NavItem {
  href: string
  key: MessageKey
  icon: LucideIcon
}

export const NAV: NavItem[] = [
  { href: '/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/lessons', key: 'nav.lessons', icon: BookOpen },
  { href: '/homework', key: 'nav.homework', icon: ClipboardList },
  { href: '/leaderboard', key: 'nav.leaderboard', icon: Trophy },
  { href: '/attendance', key: 'nav.attendance', icon: CalendarDays },
  { href: '/mistakes', key: 'nav.mistakes', icon: Brain },
]
