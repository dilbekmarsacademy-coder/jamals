'use client'

import { useMemo } from 'react'
import { useApex } from '@/store/useApex'
import { homework } from '@/data/homework'
import { myLeagueRivals, MY_TIER, LEAGUE_SIZE } from '@/data/league'
import { levelFromXp, levelTitle } from '@/lib/levels'
import { computeStreak } from '@/lib/streak'
import { addDays, DAY_MS, startOfWeek, toKey } from '@/lib/date'
import { homeworkStatus, dueDate } from '@/lib/homework'
import { badgeProgress } from '@/lib/badges'
import { isDue } from '@/lib/srs'
import type { LeaguePlayer } from '@/types'

export function useLevel() {
  const xp = useApex((s) => s.xp)
  return useMemo(() => {
    const info = levelFromXp(xp)
    return { ...info, xp, title: levelTitle(info.level) }
  }, [xp])
}

export function useStreak(now: Date) {
  const activity = useApex((s) => s.activity)
  const freezeDays = useApex((s) => s.freezeDays)
  const freezes = useApex((s) => s.freezes)
  const dayKey = toKey(now)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const info = useMemo(() => computeStreak(activity, freezeDays, now), [activity, freezeDays, dayKey])
  return { ...info, freezes }
}

/** XP earned since Monday 00:00 */
export function useWeekXp(now: Date) {
  const activity = useApex((s) => s.activity)
  const dayKey = toKey(now)
  return useMemo(() => {
    const start = startOfWeek(now)
    let sum = 0
    for (let i = 0; i < 7; i++) sum += activity[toKey(addDays(start, i))] ?? 0
    return sum
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, dayKey])
}

/**
 * The user's weekly Diamond league. Rival totals are their full-week pace
 * scaled by how much of the week has elapsed, so the race is fair on Monday
 * morning and on Sunday night alike.
 */
export function useLeague(now: Date) {
  const weekXp = useWeekXp(now)
  const name = useApex((s) => s.profile.name)
  const hue = useApex((s) => s.profile.avatarHue)
  const activity = useApex((s) => s.activity)
  const freezeDays = useApex((s) => s.freezeDays)
  const hourKey = Math.floor(now.getTime() / 3_600_000)
  return useMemo(() => {
    const elapsed = Math.min(1, (now.getTime() - startOfWeek(now).getTime()) / (7 * DAY_MS))
    const pace = Math.max(0.04, elapsed)
    const rivals: LeaguePlayer[] = myLeagueRivals.slice(0, LEAGUE_SIZE - 1).map((r) => ({ ...r, weekXp: Math.round((r.weekXp * pace) / 5) * 5 }))
    const me: LeaguePlayer = {
      id: 'me',
      username: name,
      avatarHue: hue,
      streak: computeStreak(activity, freezeDays, now).streak,
      weekXp,
      isMe: true,
    }
    const standings = [...rivals, me].sort((a, b) => b.weekXp - a.weekXp || (a.isMe ? -1 : b.isMe ? 1 : 0))
    const rank = standings.findIndex((p) => p.isMe) + 1
    return { tier: MY_TIER, standings, rank, me }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekXp, name, hue, activity, freezeDays, hourKey])
}

export function useHomeworkList(now: Date) {
  const attempts = useApex((s) => s.attempts)
  const seededAt = useApex((s) => s.seededAt)
  const minuteKey = Math.floor(now.getTime() / 60_000)
  return useMemo(
    () =>
      homework.map((hw) => ({
        hw,
        attempt: attempts[hw.id],
        status: homeworkStatus(hw, attempts[hw.id], seededAt, now),
        due: dueDate(hw, seededAt),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attempts, seededAt, minuteKey],
  )
}

export function useBadgeProgress(now: Date) {
  const activity = useApex((s) => s.activity)
  const freezeDays = useApex((s) => s.freezeDays)
  const attempts = useApex((s) => s.attempts)
  const lessons = useApex((s) => s.lessons)
  const notes = useApex((s) => s.notes)
  const badges = useApex((s) => s.badges)
  const flags = useApex((s) => s.flags)
  const dayKey = toKey(now)
  return useMemo(
    () => badgeProgress({ activity, freezeDays, attempts, lessons, notes, badges, flags }, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activity, freezeDays, attempts, lessons, notes, badges, flags, dayKey],
  )
}

export function useDueMistakes(now: Date) {
  const mistakes = useApex((s) => s.mistakes)
  const minuteKey = Math.floor(now.getTime() / 60_000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => Object.values(mistakes).filter((m) => isDue(m, now)), [mistakes, minuteKey])
}
