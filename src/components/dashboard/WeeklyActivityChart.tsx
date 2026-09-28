import { Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DayActivity } from '@/lib/activity'
import { formatDate, fromDateKey } from '@/lib/date'
import { cn } from '@/lib/utils'

interface Props {
  days: DayActivity[]
  total: number
  prevTotal: number
  activeCount: number
}

/** Single-series XP bars for the last 7 days — the title names the series, so no legend */
export function WeeklyActivityChart({ days, total, prevTotal, activeCount }: Props) {
  const max = Math.max(...days.map((d) => d.xp), 50)
  const delta = total - prevTotal

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <Activity /> Haftalik faollik
        </CardTitle>
        <span className="text-[13px] text-muted">XP / kun</span>
      </CardHeader>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums">{activeCount}</span>
        <span className="text-sm text-muted">/ 7 kun faol</span>
      </div>
      <p className="mt-0.5 text-[13px] text-muted">
        Bu hafta <span className="font-medium text-foreground">{total} XP</span>
        {prevTotal > 0 && (
          <>
            {' · '}
            <span className={delta >= 0 ? 'font-medium text-mint-500' : 'font-medium text-danger-500'}>
              {delta >= 0 ? '+' : '−'}{Math.abs(delta)} XP
            </span>{' '}
            o‘tgan haftaga nisbatan
          </>
        )}
      </p>

      <div className="mt-5 flex h-32 items-end gap-2 border-b border-card-border" role="img" aria-label="Oxirgi 7 kunlik XP">
        {days.map((d, i) => (
          <Tooltip key={d.key}>
            <TooltipTrigger asChild>
              <div className="group flex h-full flex-1 cursor-default flex-col justify-end">
                <div
                  style={{ height: d.xp ? `${Math.max(6, (d.xp / max) * 100)}%` : 3, transitionDelay: `${i * 30}ms` }}
                  className={cn(
                    'mx-auto w-full max-w-6 rounded-t-[3px] transition-[height,background-color] duration-500',
                    d.xp === 0 ? 'bg-ring-track' : d.isToday ? 'bg-primary' : 'bg-primary/55 group-hover:bg-primary/75',
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="font-semibold">{formatDate(fromDateKey(d.key))}{d.isToday && ' · bugun'}</div>
              <div className="text-muted">{d.xp ? `${d.xp} XP` : 'Faollik yo‘q'}</div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="mt-1.5 flex gap-2">
        {days.map((d) => (
          <span key={d.key} className={cn('flex-1 text-center text-xs', d.isToday ? 'font-semibold text-foreground' : 'text-muted')}>
            {d.label}
          </span>
        ))}
      </div>
    </Card>
  )
}
