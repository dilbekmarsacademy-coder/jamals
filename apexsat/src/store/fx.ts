'use client'

import { create } from 'zustand'
import { uid } from '@/lib/utils'
import type { MessageKey } from '@/i18n'
import type { Params } from '@/i18n/format'

/**
 * Ephemeral reward effects (never persisted): floating "+XP" labels,
 * toasts, and full-screen celebrations for badges and level-ups.
 */

export type Celebration = { id: string; kind: 'badge'; badgeId: string } | { id: string; kind: 'level'; level: number }

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export interface Toast {
  id: string
  tone: 'xp' | 'streak' | 'info' | 'warn'
  /** Message keys are translated at render time, so toasts follow the language switch */
  title: MessageKey
  body?: MessageKey
  params?: Params
}

interface FxState {
  floats: { id: string; amount: number }[]
  toasts: Toast[]
  celebrations: Celebration[]
  /** Increments whenever the streak grows, so the flame can animate */
  streakPulse: number
  floatXp: (amount: number) => void
  toast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  celebrate: (c: DistributiveOmit<Celebration, 'id'>) => void
  closeCelebration: () => void
  bumpStreak: () => void
}

export const useFx = create<FxState>()((set, get) => ({
  floats: [],
  toasts: [],
  celebrations: [],
  streakPulse: 0,
  floatXp: (amount) => {
    const id = uid()
    set((s) => ({ floats: [...s.floats, { id, amount }] }))
    setTimeout(() => set((s) => ({ floats: s.floats.filter((f) => f.id !== id) })), 1600)
  },
  toast: (t) => {
    const id = uid()
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }))
    setTimeout(() => get().dismissToast(id), 4200)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  celebrate: (c) => set((s) => ({ celebrations: [...s.celebrations, { ...c, id: uid() }] })),
  closeCelebration: () => set((s) => ({ celebrations: s.celebrations.slice(1) })),
  bumpStreak: () => set((s) => ({ streakPulse: s.streakPulse + 1 })),
}))
