import { Link, NavLink } from 'react-router-dom'
import { NAV } from './nav'
import { Logo } from '@/components/brand/Logo'
import { Avatar } from '@/components/common/Avatar'
import { useAppStore, useLevel } from '@/store/useAppStore'
import { usePendingHomework } from '@/hooks/usePendingHomework'
import { cn, formatNumber } from '@/lib/utils'

export function Sidebar() {
  const { pending, overdue } = usePendingHomework()
  const level = useLevel()
  const user = useAppStore((s) => s.user)

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5 lg:flex">
      <Link to="/" className="px-2.5" aria-label="Bosh sahifa">
        <Logo />
      </Link>

      <nav className="mt-7 flex flex-col gap-0.5" aria-label="Asosiy navigatsiya">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-soft text-primary-text' : 'text-muted hover:bg-surface-sunken hover:text-foreground',
              )
            }
          >
            <item.icon className="size-[18px]" />
            <span className="flex-1">{item.label}</span>
            {item.to === '/homework' && pending > 0 && (
              <span
                className={cn(
                  'min-w-5 rounded-md px-1.5 text-center text-xs font-semibold leading-5',
                  overdue ? 'bg-danger-500/12 text-danger-500' : 'bg-surface-sunken text-muted',
                )}
                title={overdue ? `${overdue} ta vazifa muddati o‘tgan` : `${pending} ta vazifa kutmoqda`}
              >
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Account + level progress */}
      <Link to="/profile" className="mt-auto rounded-lg border border-border p-3 transition-colors hover:bg-surface-sunken">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} seed={user.avatarSeed} className="size-9 rounded-lg text-xs" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="text-xs text-muted">{level.level}-daraja · {level.title}</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ring-track" role="progressbar" aria-valuenow={Math.round(level.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Daraja progressi">
          <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${level.progress * 100}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>{formatNumber(level.xpIntoLevel)} / {formatNumber(level.xpForLevel)} XP</span>
          <span>{Math.round(level.progress * 100)}%</span>
        </div>
      </Link>
    </aside>
  )
}
