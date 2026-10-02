'use client'

import Link from 'next/link'
import { useHydrated } from '@/store/useApex'
import { useNow } from '@/hooks/useNow'
import { LogoMark } from '@/components/brand/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { MobileNav } from './MobileNav'
import { LangSwitcher } from './LangSwitcher'
import { ThemeToggle } from './Theme'
import { StreakChip } from './StreakChip'
import { LevelChip } from './LevelChip'
import { UserMenu } from './UserMenu'

function Stats() {
  const now = useNow(60_000)
  return (
    <>
      <StreakChip now={now} />
      <LevelChip className="hidden sm:flex" />
    </>
  )
}

export function TopBar() {
  const hydrated = useHydrated()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 sm:px-6">
        <MobileNav />
        <Link href="/dashboard" className="lg:hidden" aria-label="ApexSAT">
          <LogoMark className="size-8" />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {hydrated ? (
            <Stats />
          ) : (
            <>
              <Skeleton className="h-9 w-24" />
              <Skeleton className="hidden h-9 w-48 sm:block" />
            </>
          )}
          <LangSwitcher />
          <ThemeToggle />
          {hydrated ? <UserMenu /> : <Skeleton className="size-9 rounded-full" />}
        </div>
      </div>
    </header>
  )
}
