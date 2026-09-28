import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/common/Avatar'
import { useAppStore, useLevel } from '@/store/useAppStore'
import { levelTitle } from '@/lib/levels'
import { useT } from '@/i18n'

const item = 'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm outline-none data-[highlighted]:bg-surface-sunken'

/** Avatar menu in the header: who is signed in, profile, and log out */
export function UserMenu() {
  const { t } = useT()
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)
  const level = useLevel()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/welcome', { replace: true })
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="ml-0.5 cursor-pointer rounded-lg" aria-label={t('account.menu')}>
        <Avatar name={user.name} seed={user.avatarSeed} className="size-9 rounded-lg text-xs" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className="surface-raised z-50 w-64 rounded-lg p-1 data-[state=open]:animate-[fadeIn_.12s_ease-out]">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Avatar name={user.name} seed={user.avatarSeed} className="size-9 rounded-lg text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted">
                {t('level.n', { n: level.level })} · {levelTitle(level.tier)}
              </p>
            </div>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item className={item} onSelect={() => navigate('/profile')}>
            <Settings className="size-4 text-muted" /> {t('account.profile')}
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item className={`${item} text-danger-500`} onSelect={signOut}>
            <LogOut className="size-4" /> {t('account.logout')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
