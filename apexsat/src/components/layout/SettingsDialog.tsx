'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useFx } from '@/store/fx'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toKey } from '@/lib/date'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().trim().min(2, 'form.nameMin').max(24, 'form.nameMax'),
  targetScore: z.coerce
    .number<number>()
    .int()
    .min(400, 'form.targetRange')
    .max(1600, 'form.targetRange')
    .refine((v) => v % 10 === 0, 'form.targetStep'),
  testDate: z.string().refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= toKey(new Date()), 'form.dateFuture'),
})

type Values = z.infer<typeof schema>

const inputCls =
  'h-10 w-full rounded-xl border border-line bg-surface-2/60 px-3 text-sm text-fg-strong outline-none transition placeholder:text-subtle focus:border-cyan focus:ring-2 focus:ring-cyan/25'

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useT()
  const profile = useApex((s) => s.profile)
  const updateProfile = useApex((s) => s.updateProfile)
  const toast = useFx((s) => s.toast)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: { name: profile.name, targetScore: profile.targetScore, testDate: toKey(new Date(profile.testDate)) },
  })
  const { register, handleSubmit, formState } = form
  const err = (k: keyof Values) => formState.errors[k]?.message

  const onSubmit = (v: Values) => {
    const [y, m, d] = v.testDate.split('-').map(Number)
    updateProfile({ name: v.name, targetScore: v.targetScore, testDate: new Date(y, m - 1, d, 8).toISOString() })
    toast({ tone: 'info', title: 'settings.saved' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('common.close')}>
        <DialogTitle>{t('settings.title')}</DialogTitle>
        <DialogDescription className="mt-1">{t('settings.subtitle')}</DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
          {(
            [
              ['name', 'settings.name', 'text'],
              ['targetScore', 'settings.target', 'number'],
              ['testDate', 'settings.testDate', 'date'],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">{t(label)}</span>
              <input
                type={type}
                step={type === 'number' ? 10 : undefined}
                min={type === 'date' ? toKey(new Date()) : undefined}
                className={cn(inputCls, err(key) && 'border-crimson')}
                aria-invalid={Boolean(err(key))}
                {...register(key)}
              />
              {err(key) && <span className="mt-1 block text-xs text-crimson-fg">{t(err(key) as Parameters<typeof t>[0])}</span>}
            </label>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
