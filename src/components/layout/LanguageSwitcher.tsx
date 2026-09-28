import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, Globe } from 'lucide-react'
import { LANGS, useLangStore, useT } from '@/i18n'
import { cn } from '@/lib/utils'

/** Compact language menu (UZ / RU / EN) — used in the header and on the sign-in screen */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, lang } = useT()
  const setLang = useLangStore((s) => s.setLang)
  const current = LANGS.find((l) => l.code === lang)!
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          'flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground data-[state=open]:bg-surface-sunken',
          className,
        )}
        aria-label={`${t('lang.choose')}: ${current.label}`}
      >
        <Globe className="size-4" />
        {current.short}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className="surface-raised z-50 min-w-40 rounded-lg p-1 data-[state=open]:animate-[fadeIn_.12s_ease-out]">
          <DropdownMenu.Label className="px-2 py-1.5 text-xs text-subtle">{t('lang.label')}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
            {LANGS.map((l) => (
              <DropdownMenu.RadioItem
                key={l.code}
                value={l.code}
                lang={l.code}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-surface-sunken"
              >
                <span className="w-6 text-xs font-semibold text-subtle">{l.short}</span>
                <span className="flex-1">{l.label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="size-4 text-primary-text" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
