'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { THEME_COOKIE } from '@/i18n/config'
import { useT } from '@/i18n'
import { Button } from '@/components/ui/button'

export type Theme = 'dark' | 'light'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ initialTheme, children }: { initialTheme: Theme; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      const html = document.documentElement
      html.classList.remove(prev)
      html.classList.add(next)
      document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
      return next
    })
  }, [])
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { t } = useT()
  return (
    <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
