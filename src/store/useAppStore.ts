import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AppNotification, AttendanceRecord, LeaderboardPeriod, RewardEvent, UserProfile, XpSource } from '@/types'
import { createSeed, type SeedState } from '@/data/seed'
import { seedNotifications } from '@/data/notifications'
import { homework } from '@/data/homework'
import { lessons } from '@/data/lessons'
import { evaluateBadges } from '@/lib/badges'
import { buildAttendance } from '@/lib/attendance'
import { getLevelInfo } from '@/lib/levels'
import { computeStreak } from '@/lib/streak'
import { diffDays, toDateKey } from '@/lib/date'
import { uid } from '@/lib/utils'

type Theme = 'dark' | 'light'

interface PersistedState extends SeedState {
  /** Session flag: the account stays in this browser after logout, only the session ends */
  loggedIn: boolean
  theme: Theme
  unlockedBadges: Record<string, string>
  flags: { earlyBird?: boolean; nightOwl?: boolean }
}

interface AppState extends PersistedState {
  /** Transient reward animations (not persisted) */
  rewards: RewardEvent[]

  completeOnboarding: (patch: Partial<UserProfile>) => void
  login: () => void
  logout: () => void
  /** Wipes the local account so a different person can start from zero */
  startNewAccount: () => void
  updateUser: (patch: Partial<UserProfile>) => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void

  setLessonWatched: (lessonId: string, fraction: number) => void
  completeLesson: (lessonId: string) => void

  startHomework: (id: string) => void
  answerQuestion: (id: string, questionId: string, choice: number) => void
  submitHomework: (id: string) => { score: number; xp: number }

  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  refreshNotifications: () => void
  dismissReward: (id: string) => void
  recordRank: (rank: number) => void
  setRankSnapshot: (period: LeaderboardPeriod, rank: number) => void
  resetProgress: () => void
}

/** A brand-new account: everything starts from zero */
const initialPersisted = (): PersistedState => ({
  ...createSeed(),
  loggedIn: false,
  theme: 'dark',
  flags: {},
  unlockedBadges: {},
})

const notify = (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & { id?: string }): AppNotification => ({
  id: n.id ?? uid(),
  createdAt: new Date().toISOString(),
  read: false,
  ...n,
})

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      /** Adds XP, emits reward + level-up events */
      const awardXp = (amount: number, source: XpSource) => {
        const { xp, xpLog } = get()
        const before = getLevelInfo(xp).level
        const after = getLevelInfo(xp + amount).level
        const rewards: RewardEvent[] = [{ id: uid(), type: 'xp', amount, source }]
        const notes: AppNotification[] = []
        if (after > before) {
          rewards.push({ id: uid(), type: 'level', level: after })
          notes.push(notify({ kind: 'level', params: { level: after, tier: getLevelInfo(xp + amount).tier }, href: '/profile' }))
        }
        set((s) => ({
          xp: s.xp + amount,
          xpLog: [...xpLog, { id: uid(), amount, source, at: new Date().toISOString() }],
          rewards: [...s.rewards, ...rewards],
          notifications: [...notes, ...s.notifications],
        }))
      }

      /** Marks today as active; emits a streak event the first time each day */
      const markActiveToday = () => {
        const today = toDateKey(new Date())
        const { activeDays, attendance } = get()
        if (activeDays.includes(today)) return
        const nextDays = [...activeDays, today]
        const streak = computeStreak(nextDays).current

        let nextAttendance: AttendanceRecord[] = attendance
        if (!attendance.some((r) => r.date === today)) {
          const next = lessons.find((l) => !get().lessonProgress[l.id]?.completed) ?? lessons[0]
          nextAttendance = [...attendance, { date: today, status: 'present', lessonId: next.id }]
        }
        set((s) => ({
          activeDays: nextDays,
          attendance: nextAttendance,
          bestStreak: Math.max(s.bestStreak, streak),
          rewards: [...s.rewards, { id: uid(), type: 'streak', days: streak }],
          notifications: s.notifications.filter((n) => !n.id.startsWith('streak-risk')),
        }))
      }

      /** Re-evaluates badge rules and emits unlock events for new ones */
      const checkBadges = () => {
        const s = get()
        const streak = computeStreak(s.activeDays).current
        const earned = evaluateBadges({ ...s, streak, attendance: buildAttendance(s.attendance, s.user.joinedAt) })
        const fresh = earned.filter((id) => !s.unlockedBadges[id])
        if (!fresh.length) return
        const now = new Date().toISOString()
        set((st) => ({
          unlockedBadges: { ...st.unlockedBadges, ...Object.fromEntries(fresh.map((id) => [id, now])) },
          rewards: [...st.rewards, ...fresh.map((badgeId) => ({ id: uid(), type: 'badge' as const, badgeId }))],
          notifications: [
            ...fresh.map((badgeId) => notify({ kind: 'badge', params: { badgeId }, href: '/leaderboard' })),
            ...st.notifications,
          ],
        }))
      }

      return {
        ...initialPersisted(),
        rewards: [],

        // Onboarding starts a fresh account "now" (deadlines, attendance and join date count from this moment)
        completeOnboarding: (patch) =>
          set((s) => {
            const fresh = initialPersisted()
            return { ...fresh, theme: s.theme, onboarded: true, loggedIn: true, rewards: [], user: { ...fresh.user, ...patch } }
          }),
        login: () => set({ loggedIn: true }),
        logout: () => set({ loggedIn: false, rewards: [] }),
        startNewAccount: () => set((s) => ({ ...initialPersisted(), theme: s.theme, rewards: [] })),
        updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

        setLessonWatched: (lessonId, fraction) =>
          set((s) => {
            const prev = s.lessonProgress[lessonId] ?? { watched: 0, completed: false }
            if (fraction <= prev.watched) return s
            return { lessonProgress: { ...s.lessonProgress, [lessonId]: { ...prev, watched: Math.min(1, fraction) } } }
          }),

        completeLesson: (lessonId) => {
          const lesson = lessons.find((l) => l.id === lessonId)
          if (!lesson || get().lessonProgress[lessonId]?.completed) return
          const hour = new Date().getHours()
          set((s) => ({
            lessonProgress: {
              ...s.lessonProgress,
              [lessonId]: { watched: 1, completed: true, completedAt: new Date().toISOString() },
            },
            flags: {
              earlyBird: s.flags.earlyBird || (hour >= 5 && hour < 9),
              nightOwl: s.flags.nightOwl || hour >= 22 || hour < 4,
            },
          }))
          awardXp(lesson.xpReward, { type: 'lesson', id: lesson.id })
          markActiveToday()
          checkBadges()
        },

        startHomework: (id) =>
          set((s) => {
            const p = s.homeworkProgress[id]
            if (!p || p.status !== 'not_started') return s
            return { homeworkProgress: { ...s.homeworkProgress, [id]: { ...p, status: 'in_progress' } } }
          }),

        answerQuestion: (id, questionId, choice) =>
          set((s) => {
            const p = s.homeworkProgress[id]
            if (!p || p.status === 'done') return s
            return {
              homeworkProgress: {
                ...s.homeworkProgress,
                [id]: { ...p, status: 'in_progress', answers: { ...p.answers, [questionId]: choice } },
              },
            }
          }),

        submitHomework: (id) => {
          const hw = homework.find((h) => h.id === id)
          const p = get().homeworkProgress[id]
          if (!hw || !p || p.status === 'done') return { score: p?.score ?? 0, xp: 0 }
          const correct = hw.questions.filter((q) => p.answers[q.id] === q.answerIndex).length
          const score = correct / hw.questions.length
          const late = new Date() > new Date(p.dueDate)
          // Full reward for 100%, partial otherwise; late submissions get 50%
          const xp = Math.round(hw.xpReward * (0.4 + 0.6 * score) * (late ? 0.5 : 1))
          set((s) => ({
            homeworkProgress: {
              ...s.homeworkProgress,
              [id]: { ...p, status: 'done', score, completedAt: new Date().toISOString() },
            },
            notifications: s.notifications.filter((n) => n.id !== `deadline-${id}`),
          }))
          awardXp(xp, { type: 'homework', id: hw.id })
          markActiveToday()
          checkBadges()
          return { score, xp }
        },

        markNotificationRead: (id) =>
          set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
        markAllNotificationsRead: () =>
          set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

        /** Derives time-based alerts: approaching deadlines and streak at risk */
        refreshNotifications: () => {
          const s = get()
          const now = new Date()
          const existing = new Set(s.notifications.map((n) => n.id))
          const add: AppNotification[] = []

          for (const hw of homework) {
            const p = s.homeworkProgress[hw.id]
            if (!p || p.status === 'done') continue
            const d = diffDays(now, new Date(p.dueDate))
            const nid = `deadline-${hw.id}`
            if (d >= 0 && d <= 1 && !existing.has(nid)) {
              add.push(notify({ id: nid, kind: 'deadline', params: { hwId: hw.id, days: d }, href: `/homework?open=${hw.id}` }))
            }
          }

          const { current, activeToday } = computeStreak(s.activeDays, now)
          const riskId = `streak-risk-${toDateKey(now)}`
          if (current > 0 && !activeToday && !existing.has(riskId)) {
            add.push(notify({ id: riskId, kind: 'streak', params: { n: current }, href: '/lessons' }))
          }
          if (add.length) set({ notifications: [...add, ...s.notifications] })
        },

        dismissReward: (id) => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),
        recordRank: (rank) => set((s) => (s.bestRank === null || rank < s.bestRank ? { bestRank: rank } : s)),
        setRankSnapshot: (period, rank) =>
          set((s) => ({ rankSnapshots: { ...s.rankSnapshots, [period]: { rank, at: new Date().toISOString() } } })),

        resetProgress: () => {
          const theme = get().theme
          const fresh = initialPersisted()
          set({ ...fresh, theme, onboarded: true, loggedIn: true, rewards: [], user: { ...get().user, joinedAt: fresh.seededAt } })
        },
      }
    },
    {
      name: 'jamals-store',
      version: 3,
      // v2 → v3: text-based notifications/XP reasons became language-neutral, and sessions were added
      migrate: (persisted, version) => {
        const s = persisted as Record<string, unknown>
        if (version < 3) {
          const now = new Date().toISOString()
          s.notifications = seedNotifications.map((n) => ({ ...n, read: true, createdAt: now }))
          s.xpLog = ((s.xpLog as { id: string; amount: number; at: string }[]) ?? []).map((e) => ({
            id: e.id, amount: e.amount, at: e.at, source: { type: 'lesson', id: 'legacy' },
          }))
          s.loggedIn = !!s.onboarded
        }
        return s as unknown as AppState
      },
      storage: createJSONStorage(() => localStorage),
      partialize: ({ rewards: _r, ...rest }) =>
        Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function')) as unknown as PersistedState,
    },
  ),
)

/* ---------- Derived selectors ---------- */

export const useStreak = () => {
  const activeDays = useAppStore((s) => s.activeDays)
  return computeStreak(activeDays)
}

export const useLevel = () => getLevelInfo(useAppStore((s) => s.xp))
