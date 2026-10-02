import { cn } from '@/lib/utils'

/** Initials avatar with a per-user hue */
export function Avatar({ name, hue, className, ring }: { name: string; hue: number; className?: string; ring?: boolean }) {
  const initials = name
    .replace(/[^\p{L}\p{N}\s._]/gu, '')
    .split(/[\s._]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
  return (
    <span
      aria-hidden
      className={cn('grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white', ring && 'ring-2 ring-cyan ring-offset-2 ring-offset-bg', className)}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 50) % 360} 70% 35%))` }}
    >
      {initials || '?'}
    </span>
  )
}
