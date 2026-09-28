import type { Difficulty } from '@/types'
import { DIFFICULTY_META } from '@/lib/homework'
import { cn } from '@/lib/utils'

export function DifficultyBars({ level, showLabel = true }: { level: Difficulty; showLabel?: boolean }) {
  const meta = DIFFICULTY_META[level]
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-muted" title={`Qiyinlik: ${meta.label}`}>
      <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'w-1 rounded-full',
              i === 1 ? 'h-1.5' : i === 2 ? 'h-2.5' : 'h-3.5',
              i <= meta.bars ? 'bg-muted' : 'bg-ring-track',
            )}
          />
        ))}
      </span>
      {showLabel && meta.label}
    </span>
  )
}
