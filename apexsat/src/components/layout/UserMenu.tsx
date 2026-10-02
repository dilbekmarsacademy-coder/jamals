'use client'

import { useState } from 'react'
import * as DM from '@radix-ui/react-dropdown-menu'
import { RotateCcw, Settings } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useFx } from '@/store/fx'
import { useLevel } from '@/hooks/useDerived'
import { Avatar } from '@/components/common/Avatar'
import { SettingsDialog } from './SettingsDialog'

export function UserMenu() {
  const { t, tr } = useT()
  const profile = useApex((s) => s.profile)
  const resetDemo = useApex((s) => s.resetDemo)
  const toast = useFx((s) => s.toast)
  const lvl = useLevel()
  const [settings, setSettings] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <>
      <DM.Root onOpenChange={(o) => !o && setConfirmReset(false)}>
        <DM.Trigger className="rounded-full" aria-label={t('user.menu')}>
          <Avatar name={profile.name} hue={profile.avatarHue} className="size-9" />
        </DM.Trigger>
        <DM.Portal>
          <DM.Content align="end" sideOffset={8} className="z-50 w-60 rounded-xl border border-line bg-surface p-1.5 shadow-2xl">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar name={profile.name} hue={profile.avatarHue} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-fg-strong">{profile.name}</p>
                <p className="truncate text-xs text-muted">
                  {t('level.short', { level: lvl.level })} · {tr(lvl.title)}
                </p>
              </div>
            </div>
            <DM.Separator className="my-1 h-px bg-line" />
            <DM.Item
              onSelect={() => setSettings(true)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface-2"
            >
              <Settings className="size-4 text-muted" /> {t('settings.title')}
            </DM.Item>
            <DM.Item
              onSelect={(e) => {
                if (!confirmReset) {
                  e.preventDefault()
                  setConfirmReset(true)
                  return
                }
                resetDemo()
                toast({ tone: 'info', title: 'user.resetDone' })
              }}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface-2"
            >
              <RotateCcw className="size-4 text-muted" />
              {confirmReset ? <span className="font-semibold text-crimson-fg">{t('user.resetConfirm')}</span> : t('user.reset')}
            </DM.Item>
          </DM.Content>
        </DM.Portal>
      </DM.Root>
      <SettingsDialog open={settings} onOpenChange={setSettings} />
    </>
  )
}
