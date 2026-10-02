'use client'

import type { ReactNode } from 'react'
import { useHydrated } from '@/store/useApex'
import { Skeleton } from '@/components/ui/skeleton'

/** Distraction-free shell for tests and retry sessions (no sidebar) */
export function FocusShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated()
  if (!hydrated)
    return (
      <div className="flex min-h-dvh flex-col">
        <Skeleton className="h-14 rounded-none" />
        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 p-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  return <>{children}</>
}
