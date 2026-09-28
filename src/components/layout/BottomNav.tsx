import { NavLink } from 'react-router-dom'
import { NAV } from './nav'
import { usePendingHomework } from '@/hooks/usePendingHomework'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { overdue, pending } = usePendingHomework()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Asosiy navigatsiya"
    >
      <div className="mx-auto flex max-w-lg">
        {NAV.filter((n) => n.mobile).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn('flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium', isActive ? 'text-primary-text' : 'text-muted')
            }
          >
            <span className="relative">
              <item.icon className="size-5" />
              {item.to === '/homework' && pending > 0 && (
                <span className={cn('absolute -right-1.5 -top-1 size-2 rounded-full ring-2 ring-surface', overdue ? 'bg-danger-500' : 'bg-primary')} />
              )}
            </span>
            {item.short}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
