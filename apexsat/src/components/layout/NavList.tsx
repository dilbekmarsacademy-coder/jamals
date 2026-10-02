'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useT } from '@/i18n'
import { useHydrated } from '@/store/useApex'
import { useDueMistakes, useHomeworkList } from '@/hooks/useDerived'
import { useNow } from '@/hooks/useNow'
import { cn } from '@/lib/utils'
import { NAV } from './nav'

function useNavCounts() {
  const now = useNow(60_000)
  const list = useHomeworkList(now)
  const due = useDueMistakes(now)
  return {
    '/homework': list.filter((h) => h.status === 'OVERDUE').length,
    '/mistakes': due.length,
  } as Record<string, number>
}

function NavLinks({ counts, onNavigate, layoutId }: { counts: Record<string, number>; onNavigate?: () => void; layoutId: string }) {
  const pathname = usePathname()
  const { t } = useT()
  return (
    <ul className="space-y-1">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        const count = counts[item.href] ?? 0
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                active ? 'text-fg-strong' : 'text-muted hover:bg-surface-2/70 hover:text-fg-strong',
              )}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-xl border border-cyan/30 bg-[linear-gradient(90deg,rgb(6_182_212/0.16),rgb(139_92_246/0.08))]"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <Icon className={cn('relative size-[18px]', active && 'text-cyan-fg')} />
              <span className="relative flex-1">{t(item.key)}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'relative min-w-5 rounded-full px-1.5 text-center text-[11px] font-bold tnum leading-5',
                    item.href === '/homework' ? 'bg-crimson/15 text-crimson-fg' : 'bg-violet/15 text-violet-fg',
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function HydratedNav(props: { onNavigate?: () => void; layoutId: string }) {
  const counts = useNavCounts()
  return <NavLinks counts={counts} {...props} />
}

export function NavList({ onNavigate, layoutId = 'nav-active' }: { onNavigate?: () => void; layoutId?: string }) {
  const hydrated = useHydrated()
  return hydrated ? <HydratedNav onNavigate={onNavigate} layoutId={layoutId} /> : <NavLinks counts={{}} onNavigate={onNavigate} layoutId={layoutId} />
}
