'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useT } from '@/i18n'
import { Dialog, DialogTitle, DialogTrigger, SheetContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/Logo'
import { NavList } from './NavList'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { t } = useT()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label={t('nav.open')}>
          <Menu />
        </Button>
      </DialogTrigger>
      <SheetContent aria-describedby={undefined}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo />
          <DialogTitle className="sr-only">{t('nav.label')}</DialogTitle>
        </div>
        <nav className="flex-1 overflow-y-auto p-4" aria-label={t('nav.label')}>
          <NavList onNavigate={() => setOpen(false)} layoutId="nav-active-mobile" />
        </nav>
        <p className="border-t border-line px-5 py-4 text-xs text-muted">{t('brand.slogan')}</p>
      </SheetContent>
    </Dialog>
  )
}
