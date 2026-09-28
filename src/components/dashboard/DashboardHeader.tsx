import { useAppStore } from '@/store/useAppStore'
import { formatDateLong, getDayPart, type DayPart } from '@/lib/date'
import { usePendingHomework } from '@/hooks/usePendingHomework'
import { Countdown } from './Countdown'

const GREETING: Record<DayPart, string> = {
  morning: 'Xayrli tong',
  afternoon: 'Xayrli kun',
  evening: 'Xayrli kech',
  night: 'Xayrli tun',
}

export function DashboardHeader({ weekDelta }: { weekDelta: number | null }) {
  const user = useAppStore((s) => s.user)
  const { overdue, dueSoon } = usePendingHomework()
  const firstName = user.name.split(' ')[0]

  const summary: string[] = []
  if (overdue) summary.push(`${overdue} ta vazifa muddati o‘tgan`)
  if (dueSoon) summary.push(`${dueSoon} ta vazifa muddati yaqin`)
  if (weekDelta !== null) summary.push(weekDelta >= 0 ? `bu hafta o‘tgan haftadan ${weekDelta}% ko‘p XP` : `bu hafta o‘tgan haftadan ${-weekDelta}% kam XP`)

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm text-muted">{formatDateLong(new Date())}</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-[28px]">
          {GREETING[getDayPart()]}, {firstName}
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
