import type { UserProfile } from '@/types'
import { addDays } from '@/lib/date'

/** Blank profile — filled in during onboarding */
export function createDefaultUser(now = new Date()): UserProfile {
  // Default exam date: ~8 weeks ahead, on a Saturday (user picks the real date in onboarding)
  const exam = addDays(now, 56)
  exam.setDate(exam.getDate() + ((6 - exam.getDay() + 7) % 7))
  exam.setHours(8, 0, 0, 0)
  return {
    id: 'me',
    name: '',
    avatarSeed: 'me',
    targetScore: 1400,
    currentScore: 1100,
    testDate: exam.toISOString(),
    focus: 'math',
    joinedAt: now.toISOString(),
  }
}
