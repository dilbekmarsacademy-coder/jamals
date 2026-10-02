import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const uid = () => Math.random().toString(36).slice(2, 10)

/** 75 → "01:15", 3725 → "1:02:05" */
export function formatClock(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
