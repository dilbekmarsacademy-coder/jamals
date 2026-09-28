import { useAppStore } from '@/store/useAppStore'
import { formatDateLong, getDayPart } from '@/lib/date'
import { useT } from '@/i18n'
import { usePendingHomework } from '@/hooks/usePendingHomework'
import { Countdown } from './Countdown'

export function DashboardHeader({ weekDelta }: { weekDelta: number | null }) {
  const { t } = useT()
  const user = useAppStore((s) => s.user)
  const xp = useAppStore((s) => s.xp)
  const { overdue, dueSoon } = usePendingHomework()
  const firstName = user.name.split(' ')[0]

  const summary: string[] = []
  if (overdue) summary.push(t('dash.overdue', { n: overdue }))
  if (dueSoon) summary.push(t('dash.dueSoon', { n: dueSoon }))
  if (xp === 0) summary.push(t('dash.firstStep'))
  if (weekDelta !== null) summary.push(weekDelta >= 0 ? t('dash.weekUp', { n: weekDelta }) : t('dash.weekDown', { n: -weekDelta }))

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm text-muted">{formatDateLong(new Date())}</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-[28px]">
          {t(`greet.${getDayPart()}`)}, {firstName}
        </h1>
        {summary.length > 0 && (
          <p className="mt-1.5 text-sm text-muted">
            {summary.join(' · ').replace(/^./, (c) => c.toUpperCase())}
          </p>
        )}
      </div>
      <Countdown target={user.testDate} targetScore={user.targetScore} currentScore={user.currentScore} />
    </div>
  )
}
