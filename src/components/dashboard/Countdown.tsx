import { CalendarClock } from 'lucide-react'
import { useNow } from '@/hooks/useNow'
import { formatDate } from '@/lib/date'

/** Exam countdown (days/hours/minutes) — refreshes quietly every 30 s, no ticking seconds */
export function Countdown({ target, targetScore, currentScore }: { target: string; targetScore: number; currentScore: number }) {
  const now = useNow(30_000)
  const ms = Math.max(0, new Date(target).getTime() - now.getTime())
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms / 3_600_000) % 24)
  const minutes = Math.floor((ms / 60_000) % 60)

  return (
    <div className="surface flex items-center gap-4 rounded-xl px-4 py-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-text">
        <CalendarClock className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">SAT imtihoni · {formatDate(target)}</p>
        {ms === 0 ? (
          <p className="font-semibold">Imtihon kuni</p>
        ) : (
          <p className="text-lg font-semibold tabular-nums" aria-live="off">
            {days} <span className="text-sm font-normal text-muted">kun</span> {hours} <span className="text-sm font-normal text-muted">soat</span>{' '}
            {minutes} <span className="text-sm font-normal text-muted">daq</span>
          </p>
        )}
      </div>
      <div className="ml-2 hidden border-l border-border pl-4 sm:block">
        <p className="text-xs text-muted">Maqsad</p>
        <p className="text-lg font-semibold tabular-nums">
          {targetScore} <span className="text-sm font-normal text-muted">/ hozir {currentScore}</span>
        </p>
      </div>
    </div>
  )
}
