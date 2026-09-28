import { CalendarDays, CirclePlay, ClipboardList, House, Trophy, User, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  short: string
  icon: LucideIcon
  mobile: boolean
}

export const NAV: NavItem[] = [
  { to: '/', label: 'Bosh sahifa', short: 'Asosiy', icon: House, mobile: true },
  { to: '/lessons', label: 'Darslar', short: 'Darslar', icon: CirclePlay, mobile: true },
  { to: '/homework', label: 'Uy vazifalari', short: 'Vazifalar', icon: ClipboardList, mobile: true },
  { to: '/leaderboard', label: 'Reyting', short: 'Reyting', icon: Trophy, mobile: true },
  { to: '/attendance', label: 'Davomat', short: 'Davomat', icon: CalendarDays, mobile: true },
  { to: '/profile', label: 'Profil', short: 'Profil', icon: User, mobile: false },
]
