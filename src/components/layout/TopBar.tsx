import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { StreakChip, XpChip } from '@/components/common/StatChips'
import { NotificationsBell } from './NotificationsPanel'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { UserMenu } from './UserMenu'
import { useT } from '@/i18n'

export function TopBar() {
  const { t } = useT()
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:h-16 sm:px-6 lg:px-8">
      <Link to="/" className="lg:hidden" aria-label={t('nav.homeAria')}>
        <Logo compact className="sm:hidden" />
        <Logo className="hidden sm:flex" />
      </Link>
      <div className="flex-1" />
      <div className="flex items-center gap-1 sm:gap-2">
        <StreakChip />
        <XpChip />
        <NotificationsBell />
        <LanguageSwitcher className="hidden sm:flex" />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
