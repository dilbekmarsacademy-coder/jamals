import type { Section } from '@/types'
import { clamp } from './utils'

/**
 * Nudges the predicted section score after a submitted set: accuracy above
 * the student's 75% baseline moves the prediction up, below moves it down.
 * Harder sets weigh more. Section scores are multiples of 10 in 200..800.
 */
export function nudgePrediction(current: number, score: number, difficulty: 'easy' | 'medium' | 'hard') {
  const weight = difficulty === 'hard' ? 60 : difficulty === 'medium' ? 40 : 25
  const delta = Math.round(((score - 0.75) * weight) / 10) * 10
  return clamp(current + delta, 200, 800)
}

export const SECTION_LABEL_KEY: Record<Section, 'section.math' | 'section.rw'> = { math: 'section.math', rw: 'section.rw' }
