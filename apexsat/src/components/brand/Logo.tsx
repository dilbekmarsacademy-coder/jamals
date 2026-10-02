'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

/** ApexSAT mark: a split summit with a rising spark */
export function LogoMark({ className }: { className?: string }) {
  // Unique gradient id: a duplicate id inside a hidden sidebar would blank the other marks
  const g = useId()
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9', className)} aria-hidden>
      <defs>
        <linearGradient id={g} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#06B6D4" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0B1222" stroke={`url(#${g})`} strokeWidth="1.5" />
      <path d="M9 30 L20 10 L31 30" fill="none" stroke={`url(#${g})`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 24 L20 20.5 L25.5 24" fill="none" stroke="#00F2FE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29.5" cy="9.5" r="2.3" fill="#F59E0B" />
    </svg>
  )
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {!compact && (
        <span className="font-display text-lg font-extrabold tracking-tight text-fg-strong">
          Apex<span className="text-gradient">SAT</span>
        </span>
      )}
    </span>
  )
}
