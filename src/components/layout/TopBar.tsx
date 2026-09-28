import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { StreakChip, XpChip } from '@/components/common/StatChips'
import { Avatar } from '@/components/common/Avatar'
import { NotificationsBell } from './NotificationsPanel'
import { ThemeToggle } from './ThemeToggle'
import { useAppStore } from '@/store/useAppStore'

export function TopBar() {
  const user = useAppStore((s) => s.user)
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:h-16 sm:px-6 lg:px-8">
      <Link to="/" className="lg:hidden" aria-label="Bosh sahifa">
        <Logo compact className="sm:hidden" />
        <Logo className="hidden sm:flex" />
      </Link>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5 sm:gap-2">
        <StreakChip />
        <XpChip />
        <NotificationsBell />
        <ThemeToggle />
        <Link to="/profile" aria-label="Profil" className="ml-0.5 rounded-lg">
          <Avatar name={user.name} seed={user.avatarSeed} className="size-9 rounded-lg text-xs" />
        </Link>
      </div>
    </header>
  )
}
