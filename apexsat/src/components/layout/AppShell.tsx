'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useHydrated } from '@/store/useApex'
import { Skeleton } from '@/components/ui/skeleton'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40 md:col-span-2" />
        <Skeleton className="h-40" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  )
}

/**
 * Sidebar + top bar chrome. Page content renders once persisted progress is
 * loaded from localStorage, so personal numbers never flash seed values.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  const pathname = usePathname()
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:py-8">
          {hydrated ? (
            <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
              {children}
            </motion.div>
          ) : (
            <PageSkeleton />
          )}
        </main>
      </div>
    </div>
  )
}
