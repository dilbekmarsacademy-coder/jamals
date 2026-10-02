'use client'

import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Annotation, Attempt, MistakeEntry, Note, SessionLog } from '@/types'
import { DOMAIN_SECTION } from '@/types'
import { createSeed, CLASS_DAYS, type SeedState } from '@/data/seed'
import { getHomework, getQuestion } from '@/data/homework'
import { getLesson } from '@/data/lessons'
import { toKey, weekdayMon } from '@/lib/date'
import { levelFromXp } from '@/lib/levels'
import { computeStreak } from '@/lib/streak'
import { badgeProgress, newlyEarned } from '@/lib/badges'
import { dueDate, homeworkXp } from '@/lib/homework'
import { reviewMistake } from '@/lib/srs'
import { nudgePrediction } from '@/lib/score'
import { uid } from '@/lib/utils'
import { useFx } from './fx'

export interface SubmitResult {
  score: number
  correct: number
  total: number
  xp: number
  late: boolean
}

interface Actions {
  /** Adds XP for today, updates streak/attendance and fires reward effects */
  addXp: (amount: number) => void
  saveLessonProgress: (lessonId: string, watched: number, position: number) => void
  /** Returns XP awarded (0 if the lesson was already complete) */
  completeLesson: (lessonId: string) => number
  addNote: (lessonId: string, t: number, text: string) => void
  deleteNote: (lessonId: string, noteId: string) => void

  answer: (hwId: string, qid: string, choice: number) => void
  toggleFlag: (hwId: string, qid: string) => void
  toggleEliminate: (hwId: string, qid: string, choice: number) => void
  setAnnotations: (hwId: string, qid: string, list: Annotation[]) => void
  addTime: (hwId: string, qid: string, seconds: number) => void
  submitHomework: (hwId: string) => SubmitResult | null
  resetAttempt: (hwId: string) => void

  /** Retry a Mistake Bank question; returns whether it was correct */
  retryMistake: (qid: string, choice: number) => boolean

  updateProfile: (p: Partial<SeedState['profile']>) => void
  resetDemo: () => void
  /** Unlocks any badge whose goal has been met */
  checkBadges: () => void
}

export type ApexState = SeedState & Actions

const blankAttempt = (): Attempt => ({ answers: {}, flagged: [], eliminated: {}, annotations: {}, time: {} })

export const useApex = create<ApexState>()(
  persist(
    (set, get) => {
      const patchAttempt = (hwId: string, fn: (a: Attempt) => Attempt) =>
        set((s) => {
          const prev = s.attempts[hwId] ?? { ...blankAttempt(), startedAt: new Date().toISOString() }
          if (prev.submittedAt) return s
          return { attempts: { ...s.attempts, [hwId]: fn(prev) } }
        })

      return {
        ...createSeed(new Date()),

        addXp: (amount) => {
          if (amount <= 0) return
          const now = new Date()
          const key = toKey(now)
          const before = get()
          const prevLevel = levelFromXp(before.xp).level
          const prevStreak = computeStreak(before.activity, before.freezeDays, now).streak

          // Studying on a class day counts as attending it
          let sessions = before.sessions
          if (CLASS_DAYS.includes(weekdayMon(now)) && !sessions[key]) {
            const log: SessionLog = {
              date: key,
              status: 'attended',
              topic: { en: 'Live class', uz: 'Jonli dars', ru: 'Живое занятие' },
              minutes: 90,
              checkIn: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
            }
            sessions = { ...sessions, [key]: log }
          }

          set({ xp: before.xp + amount, activity: { ...before.activity, [key]: (before.activity[key] ?? 0) + amount }, sessions })

          const after = get()
          const fx = useFx.getState()
          fx.floatXp(amount)
          const nextStreak = computeStreak(after.activity, after.freezeDays, now).streak
          if (nextStreak > prevStreak) {
            fx.bumpStreak()
            fx.toast({ tone: 'streak', title: 'toast.streakUp', params: { count: nextStreak } })
          }
          const level = levelFromXp(after.xp).level
          if (level > prevLevel) fx.celebrate({ kind: 'level', level })
          get().checkBadges()
        },

        saveLessonProgress: (lessonId, watched, position) =>
          set((s) => {
            const prev = s.lessons[lessonId] ?? { watched: 0, position: 0, completed: false }
            return { lessons: { ...s.lessons, [lessonId]: { ...prev, watched: Math.max(prev.watched, watched), position } } }
          }),

        completeLesson: (lessonId) => {
          const lesson = getLesson(lessonId)
          const prev = get().lessons[lessonId]
          if (!lesson || prev?.completed) return 0
          set((s) => ({
            lessons: { ...s.lessons, [lessonId]: { watched: 1, position: 0, completed: true, completedAt: new Date().toISOString() } },
          }))
          get().addXp(lesson.xp)
          return lesson.xp
        },

        addNote: (lessonId, t, text) => {
          const note: Note = { id: uid(), t: Math.floor(t), text: text.trim(), createdAt: new Date().toISOString() }
          set((s) => ({ notes: { ...s.notes, [lessonId]: [...(s.notes[lessonId] ?? []), note].sort((a, b) => a.t - b.t) } }))
          get().checkBadges()
        },

        deleteNote: (lessonId, noteId) =>
          set((s) => ({ notes: { ...s.notes, [lessonId]: (s.notes[lessonId] ?? []).filter((n) => n.id !== noteId) } })),

        answer: (hwId, qid, choice) =>
          patchAttempt(hwId, (a) => ({
            ...a,
            answers: { ...a.answers, [qid]: choice },
            // Choosing an answer un-eliminates it
            eliminated: { ...a.eliminated, [qid]: (a.eliminated[qid] ?? []).filter((c) => c !== choice) },
          })),

        toggleFlag: (hwId, qid) =>
          patchAttempt(hwId, (a) => ({ ...a, flagged: a.flagged.includes(qid) ? a.flagged.filter((f) => f !== qid) : [...a.flagged, qid] })),

        toggleEliminate: (hwId, qid, choice) =>
          patchAttempt(hwId, (a) => {
            const list = a.eliminated[qid] ?? []
            const eliminated = list.includes(choice) ? list.filter((c) => c !== choice) : [...list, choice]
            const answers = { ...a.answers }
            if (answers[qid] === choice && !list.includes(choice)) delete answers[qid]
            return { ...a, answers, eliminated: { ...a.eliminated, [qid]: eliminated } }
          }),

        setAnnotations: (hwId, qid, list) => patchAttempt(hwId, (a) => ({ ...a, annotations: { ...a.annotations, [qid]: list } })),

        addTime: (hwId, qid, seconds) => patchAttempt(hwId, (a) => ({ ...a, time: { ...a.time, [qid]: (a.time[qid] ?? 0) + seconds } })),

        submitHomework: (hwId) => {
          const hw = getHomework(hwId)
          const s = get()
          const attempt = s.attempts[hwId] ?? blankAttempt()
          if (!hw || attempt.submittedAt) return null
          const now = new Date()
          const correct = hw.questions.filter((q) => attempt.answers[q.id] === q.answer).length
          const score = correct / hw.questions.length
          const late = now > dueDate(hw, s.seededAt)
          const xp = homeworkXp(hw, score, late)

          const mistakes: Record<string, MistakeEntry> = { ...s.mistakes }
          const domainStats = structuredClone(s.domainStats)
          for (const q of hw.questions) {
            const chosen = attempt.answers[q.id]
            const ok = chosen === q.answer
            domainStats[q.domain].attempted++
            if (ok) domainStats[q.domain].correct++
            else {
              const prev = mistakes[q.id]
              mistakes[q.id] = {
                questionId: q.id,
                source: hwId,
                chosen: chosen ?? -1,
                box: 1,
                dueAt: now.toISOString(),
                timesWrong: (prev?.timesWrong ?? 0) + 1,
                lastWrongAt: now.toISOString(),
                mastered: false,
              }
            }
          }

          const section = DOMAIN_SECTION[hw.domain]
          const predicted = { ...s.predicted, [section]: nudgePrediction(s.predicted[section], score, hw.difficulty) }
          const total = predicted.math + predicted.rw
          const todayKey = toKey(now)
          const history = s.scoreHistory.filter((h) => h.date !== todayKey)
          history.push({ date: todayKey, total })

          const hour = now.getHours()
          const flags = {
            ...s.flags,
            nightOwl: s.flags.nightOwl || hour >= 23 || hour < 4,
            sniper: s.flags.sniper || (hw.section === 'math' && hw.difficulty === 'hard' && score === 1),
          }

          set({
            attempts: { ...s.attempts, [hwId]: { ...attempt, submittedAt: now.toISOString(), score, xpEarned: xp, late } },
            mistakes,
            domainStats,
            predicted,
            scoreHistory: history.slice(-12),
            flags,
          })
          get().addXp(xp)
          get().checkBadges()
          return { score, correct, total: hw.questions.length, xp, late }
        },

        resetAttempt: (hwId) =>
          set((s) => {
            const next = { ...s.attempts }
            delete next[hwId]
            return { attempts: next }
          }),

        retryMistake: (qid, choice) => {
          const s = get()
          const entry = s.mistakes[qid]
          const q = getQuestion(qid)
          if (!entry || !q) return false
          const correct = choice === q.answer
          const updated = reviewMistake(entry, correct, choice, new Date())
          const masteredNow = updated.mastered && !entry.mastered
          set({
            mistakes: { ...s.mistakes, [qid]: updated },
            flags: masteredNow ? { ...s.flags, mastered: s.flags.mastered + 1 } : s.flags,
            domainStats: {
              ...s.domainStats,
              [q.domain]: { attempted: s.domainStats[q.domain].attempted + 1, correct: s.domainStats[q.domain].correct + (correct ? 1 : 0) },
            },
          })
          if (correct) get().addXp(masteredNow ? 25 : 10)
          return correct
        },

        updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

        resetDemo: () => set({ ...createSeed(new Date()) }),

        checkBadges: () => {
          const s = get()
          const ids = newlyEarned(badgeProgress(s, new Date()))
          if (ids.length === 0) return
          const stamp = new Date().toISOString()
          set({ badges: { ...s.badges, ...Object.fromEntries(ids.map((id) => [id, stamp])) } })
          for (const badgeId of ids) useFx.getState().celebrate({ kind: 'badge', badgeId })
        },
      }
    },
    {
      name: 'apexsat-v1',
      version: 1,
      // Rehydrated manually after mount so server and client render the same first frame
      skipHydration: true,
      partialize: (s) => {
        // Persist data only — actions are recreated by the store
        const data: Partial<ApexState> = { ...s }
        for (const k of Object.keys(data) as (keyof ApexState)[]) if (typeof data[k] === 'function') delete data[k]
        return data
      },
    },
  ),
)

const subscribeHydration = (cb: () => void) => {
  const unsubs = [useApex.persist.onHydrate(cb), useApex.persist.onFinishHydration(cb)]
  return () => unsubs.forEach((u) => u())
}

/** True once persisted progress has been loaded from localStorage */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribeHydration,
    () => useApex.persist.hasHydrated(),
    () => false,
  )
