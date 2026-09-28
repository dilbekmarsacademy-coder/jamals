import { useId } from 'react'
import { cn } from '@/lib/utils'

/** Kvazar mark: a four-point star crossing a tilted orbit, on a brand tile */
export function LogoMark({ className }: { className?: string }) {
  const gid = `kv-logo-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8 shrink-0', className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6D5BFF" />
          <stop offset=".6" stopColor="#9B5CFF" />
          <stop offset="1" stopColor="#FF7A5C" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gid})`} />
      <ellipse cx="16" cy="16" rx="11.5" ry="4.2" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.4" transform="rotate(-25 16 16)" />
      <path d="M16 6.5l2.2 7.3 7.3 2.2-7.3 2.2L16 25.5l-2.2-7.3L6.5 16l7.3-2.2z" fill="#fff" />
    </svg>
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">Kvazar</div>
          <div className="text-xs text-muted">SAT tayyorlov</div>
        </div>
      )}
    </div>
  )
}
