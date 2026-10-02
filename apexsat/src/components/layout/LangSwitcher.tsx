'use client'

import * as DM from '@radix-ui/react-dropdown-menu'
import { Check, Languages } from 'lucide-react'
import { LANGS, useT } from '@/i18n'
import { cn } from '@/lib/utils'

export function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useT()
  const current = LANGS.find((l) => l.code === lang)!
  return (
    <DM.Root>
      <DM.Trigger
        className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-muted transition hover:bg-surface-2 hover:text-fg-strong', className)}
        aria-label={t('lang.label')}
      >
        <Languages className="size-4" />
        {current.short}
      </DM.Trigger>
      <DM.Portal>
        <DM.Content align="end" sideOffset={6} className="z-50 min-w-40 rounded-xl border border-line bg-surface p-1 shadow-2xl">
          {LANGS.map((l) => (
            <DM.Item
              key={l.code}
              onSelect={() => setLang(l.code)}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface-2"
            >
              <span>{l.label}</span>
              {l.code === lang && <Check className="size-4 text-cyan-fg" />}
            </DM.Item>
          ))}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  )
}
