import { cn } from '@/lib/utils'

/** Jamals brand mark (raster logo, served from /public in 64/192 px for crisp 1x/3x rendering) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-64.png"
      srcSet="/logo-64.png 1x, /logo-192.png 3x"
      alt=""
      width={32}
      height={32}
      className={cn('size-8 shrink-0 rounded-lg', className)}
      decoding="async"
    />
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">Jamals</div>
          <div className="text-xs text-muted">SAT tayyorlov</div>
        </div>
      )}
    </div>
  )
}
