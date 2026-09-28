import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RankChange({ change, className }: { change: number; className?: string }) {
  if (change === 0)
    return <span className={cn('inline-flex text-[13px] text-subtle', className)} aria-label="O‘zgarishsiz">—</span>
  const up = change > 0
  return (
    <span
      className={cn('inline-flex items-center gap-0.5 text-[13px] font-medium tabular-nums', up ? 'text-mint-500' : 'text-danger-500', className)}
      aria-label={up ? `${change} pog‘ona yuqoriga` : `${-change} pog‘ona pastga`}
    >
      {up ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
      {Math.abs(change)}
    </span>
  )
}
