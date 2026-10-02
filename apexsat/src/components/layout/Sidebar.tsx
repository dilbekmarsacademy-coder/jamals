'use client'

import Link from 'next/link'
import { useT } from '@/i18n'
import { Logo } from '@/components/brand/Logo'
import { Cipher } from '@/components/brand/Cipher'
import { NavList } from './NavList'

export function Sidebar() {
  const { t } = useT()
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-bg-elev/80 px-4 py-5 backdrop-blur lg:flex">
      <Link href="/dashboard" className="mb-8 px-2" aria-label="ApexSAT">
        <Logo />
      </Link>
      <nav aria-label={t('nav.label')}>
        <NavList />
      </nav>
      <div className="mt-auto rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_0%_0%,rgb(6_182_212/0.14),transparent_60%),radial-gradient(120%_120%_at_100%_100%,rgb(139_92_246/0.16),transparent_60%)] p-4">
        <Cipher mood="idle" className="size-12" />
        <p className="mt-2 font-display text-sm font-bold text-fg-strong">{t('brand.slogan')}</p>
        <p className="mt-1 text-xs text-muted">{t('sidebar.tip')}</p>
      </div>
    </aside>
  )
}
