import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { usePendingHomework } from '@/hooks/usePendingHomework'
import { useAppStore } from '@/store/useAppStore'
import { homework } from '@/data/homework'
import { getHomeworkStatus, STATUS_META } from '@/lib/homework'
import { relativeDue } from '@/lib/date'
import { cn } from '@/lib/utils'

export function HomeworkWidget() {
  const { pending, overdue, dueSoon, inProgress } = usePendingHomework()
  const progress = useAppStore((s) => s.homeworkProgress)
  const now = new Date()

  const upcoming = homework
    .map((h) => ({ h, p: progress[h.id], status: getHomeworkStatus(progress[h.id], now) }))
    .filter((x) => x.status !== 'done')
    .sort((a, b) => a.p.dueDate.localeCompare(b.p.dueDate))
    .slice(0, 4)

  const stats = [
    { label: 'Muddati o‘tgan', value: overdue, tone: overdue ? 'text-danger-500' : '' },
    { label: 'Muddati yaqin', value: dueSoon, tone: dueSoon ? 'text-flare-500' : '' },
    { label: 'Jarayonda', value: inProgress, tone: '' },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle><ClipboardList /> Uy vazifalari</CardTitle>
        <span className="text-[13px] text-muted">{pending} ta kutmoqda</span>
      </CardHeader>
      <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
        {stats.map((s) => (
          <div key={s.label} className="px-3 py-2.5">
            <dd className={cn('text-xl font-semibold tabular-nums', s.tone)}>{s.value}</dd>
            <dt className="text-xs text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
      <ul className="mt-3 flex flex-col">
        {upcoming.map(({ h, p, status }) => (
          <li key={h.id}>
            <Link to={`/homework?open=${h.id}`} className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-sunken">
              <span className={cn('size-2 shrink-0 rounded-full', STATUS_META[status].dot)} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm">{h.title}</span>
              <span className={cn('shrink-0 text-[13px]', status === 'overdue' ? 'font-medium text-danger-500' : 'text-muted')}>
                {relativeDue(p.dueDate, now)}
              </span>
            </Link>
          </li>
        ))}
        {upcoming.length === 0 && <li className="py-4 text-center text-sm text-muted">Barcha vazifalar bajarilgan</li>}
      </ul>
      <Link to="/homework" className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-primary-text hover:underline">
        Barcha vazifalar <ArrowRight className="size-4" />
      </Link>
    </Card>
  )
}
