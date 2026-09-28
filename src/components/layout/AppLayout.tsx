import { useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { RewardLayer } from './RewardLayer'
import { PageTransition } from '@/components/common/PageTransition'
import { useAppStore } from '@/store/useAppStore'

export function AppLayout() {
  const location = useLocation()
  const refreshNotifications = useAppStore((s) => s.refreshNotifications)

  useEffect(() => {
    refreshNotifications()
    const t = setInterval(refreshNotifications, 60_000)
    return () => clearInterval(t)
  }, [refreshNotifications])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <FrozenOutlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
      <RewardLayer />
    </div>
  )
}

/** Keeps the outgoing page rendered during its exit animation */
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}
