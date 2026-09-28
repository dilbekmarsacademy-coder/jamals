import { cn } from '@/lib/utils'

/** Muted, readable tones — distinct enough to tell people apart, calm enough for a work tool */
const TONES = ['#5B6CC7', '#3F8F86', '#9A6A3A', '#7A5AA8', '#B0566A', '#4D7FA8', '#6B7A3D', '#8A5B7E']

const hash = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)

export function Avatar({ name, seed, className }: { name: string; seed: string; className?: string }) {
  const bg = TONES[Math.abs(hash(seed)) % TONES.length]
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      className={cn('grid size-10 shrink-0 place-items-center rounded-lg text-sm font-semibold text-white', className)}
      style={{ backgroundColor: bg }}
      aria-hidden
    >
      {initials}
    </div>
  )
}
