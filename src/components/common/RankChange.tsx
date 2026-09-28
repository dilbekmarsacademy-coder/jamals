import { useT } from '@/i18n'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RankChange({ change, className }: { change: number; className?: string }) {
  const { t } = useT()
  if (change === 0)
    return <span className={cn('inline-flex text-[13px] text-subtle', className)} aria-label={t('rank.same')}>—</span>
  const up = change > 0
  return (
    <span
      className={cn('inline-flex items-center gap-0.5 text-[13px] font-medium tabular-nums', up ? 'text-mint-500' : 'text-danger-500', className)}
      aria-label={up ? t('rank.up', { n: change }) : t('rank.down', { n: -change })}
    >
      {up ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
      {Math.abs(change)}
    </span>
  )
}
