import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme)
  const toggle = useAppStore((s) => s.toggleTheme)
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? <Sun className="!size-5" /> : <Moon className="!size-5" />}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
