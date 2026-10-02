'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CipherMood = 'idle' | 'happy' | 'thinking' | 'sad' | 'cheer'

/**
 * Cipher the Cyber-Owl — ApexSAT's mascot. Pure SVG so it stays crisp at any
 * size and themes via CSS variables. Moods change the eyes, brows and extras.
 */
export function Cipher({ mood = 'idle', className, title }: { mood?: CipherMood; className?: string; title?: string }) {
  const happy = mood === 'happy' || mood === 'cheer'
  const uid = useId()
  const bodyId = `${uid}-body`
  const eyeId = `${uid}-eye`
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={cn('size-16 overflow-visible', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      animate={mood === 'cheer' ? { y: [0, -4, 0] } : { y: [0, -1.5, 0] }}
      transition={{ duration: mood === 'cheer' ? 0.6 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#25325A" />
          <stop offset="1" stopColor="#141C33" />
        </linearGradient>
        <radialGradient id={eyeId} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#0E1A30" />
          <stop offset="1" stopColor="#060B16" />
        </radialGradient>
      </defs>

      {/* glow */}
      <ellipse cx="32" cy="58" rx="16" ry="3" fill="#06B6D4" opacity="0.18" />

      {/* ear tufts */}
      <path d="M13 17 L10 5 L22 13 Z" fill="#8B5CF6" />
      <path d="M51 17 L54 5 L42 13 Z" fill="#8B5CF6" />

      {/* body */}
      <path
        d="M32 9 C46 9 54 18 54 32 C54 46 46 56 32 56 C18 56 10 46 10 32 C10 18 18 9 32 9 Z"
        fill={`url(#${bodyId})`}
        stroke="#06B6D4"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />

      {/* wings */}
      <path d="M11 33 C6 38 7 46 13 50 C13 44 14 38 16 34 Z" fill="#1E2A4A" stroke="#06B6D4" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M53 33 C58 38 57 46 51 50 C51 44 50 38 48 34 Z" fill="#1E2A4A" stroke="#06B6D4" strokeOpacity="0.35" strokeWidth="1" />
      {mood === 'cheer' && (
        <>
          <path d="M8 30 L2 22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <path d="M56 30 L62 22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="16" r="1.6" fill="#00F2FE" />
          <circle cx="60" cy="16" r="1.6" fill="#00F2FE" />
        </>
      )}

      {/* circuit belly */}
      <path d="M26 44 h4 v4 M38 44 h-4 v6 M32 41 v9" stroke="#8B5CF6" strokeOpacity="0.8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="44" r="1.1" fill="#A78BFA" />
      <circle cx="38" cy="44" r="1.1" fill="#A78BFA" />

      {/* eyes */}
      {[22, 42].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="27" r="9.5" fill={`url(#${eyeId})`} stroke="#22D3EE" strokeWidth="1.6" />
          {happy ? (
            <path d={`M${cx - 5} 29 Q${cx} 22 ${cx + 5} 29`} stroke="#00F2FE" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          ) : mood === 'sad' ? (
            <>
              <circle cx={cx} cy="29" r="3.6" fill="#00F2FE" />
              <path d={`M${cx - 7} ${cx < 32 ? 18 : 21} L${cx + 7} ${cx < 32 ? 21 : 18}`} stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
            </>
          ) : (
            <motion.g
              style={{ originX: `${cx}px`, originY: '27px' }}
              animate={{ scaleY: [1, 1, 0.1, 1] }}
              transition={{ duration: 4, times: [0, 0.92, 0.95, 1], repeat: Infinity }}
            >
              <circle cx={mood === 'thinking' ? cx + 2.5 : cx} cy={mood === 'thinking' ? 24.5 : 27} r="4" fill="#00F2FE" />
              <circle cx={(mood === 'thinking' ? cx + 2.5 : cx) + 1.4} cy={(mood === 'thinking' ? 24.5 : 27) - 1.4} r="1.2" fill="#ffffff" />
            </motion.g>
          )}
        </g>
      ))}

      {/* beak */}
      <path d="M32 33 L35 36.5 L32 40 L29 36.5 Z" fill="#F59E0B" />

      {/* feet */}
      <path d="M26 56 v3 M29 56 v3 M35 56 v3 M38 56 v3" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />

      {mood === 'thinking' && (
        <g fill="#A78BFA">
          <circle cx="55" cy="8" r="1.4" />
          <circle cx="59" cy="4" r="2" />
        </g>
      )}
    </motion.svg>
  )
}

/** Cipher with a speech bubble — used for contextual coaching */
export function CipherSays({ mood, children, className, size = 'md' }: { mood?: CipherMood; children: React.ReactNode; className?: string; size?: 'sm' | 'md' }) {
  return (
    <div className={cn('flex items-end gap-3', className)}>
      <Cipher mood={mood} className={size === 'sm' ? 'size-11 shrink-0' : 'size-16 shrink-0'} />
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative mb-2 rounded-2xl rounded-bl-sm border border-line bg-surface-2 px-3.5 py-2.5 text-sm leading-snug text-fg"
      >
        {children}
      </motion.div>
    </div>
  )
}
