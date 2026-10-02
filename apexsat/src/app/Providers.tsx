'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nProvider, type Lang } from '@/i18n'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider, type Theme } from '@/components/layout/Theme'
import { RewardLayer } from '@/components/layout/RewardLayer'
import { useApex } from '@/store/useApex'

export function Providers({ lang, theme, children }: { lang: Lang; theme: Theme; children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, refetchOnWindowFocus: false } } }))

  useEffect(() => {
    void useApex.persist.rehydrate()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLang={lang}>
        <ThemeProvider initialTheme={theme}>
          <MotionConfig reducedMotion="user">
            <TooltipProvider delayDuration={120}>
              {children}
              <RewardLayer />
            </TooltipProvider>
          </MotionConfig>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
