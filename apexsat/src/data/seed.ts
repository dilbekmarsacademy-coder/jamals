import type { Attempt, DateKey, Domain, L10n, LessonProgress, MistakeEntry, Note, SessionLog } from '@/types'
import { addDays, toKey, upcomingTestDate, weekdayMon } from '@/lib/date'
import { mulberry32, randInt } from '@/lib/random'
import { xpAtLevel } from '@/lib/levels'
import { getHomework, diagnosticQuestions } from './homework'

/** Weekday indexes (Mon = 0) with a scheduled live class */
export const CLASS_DAYS = [0, 2, 4]
export const CLASS_TIME = '18:00'

const CLASS_TOPICS: L10n[] = [
  { en: 'Algebra workshop', uz: 'Algebra ustaxonasi', ru: 'Практикум по алгебре' },
  { en: 'Reading strategies', uz: 'O‘qish strategiyalari', ru: 'Стратегии чтения' },
  { en: 'Advanced Math clinic', uz: 'Advanced Math klinikasi', ru: 'Клиника Advanced Math' },
  { en: 'Grammar & transitions', uz: 'Grammatika va bog‘lovchilar', ru: 'Грамматика и связки' },
  { en: 'Timed mini-test', uz: 'Vaqtli mini-test', ru: 'Мини-тест на время' },
  { en: 'Mistake review', uz: 'Xatolar tahlili', ru: 'Разбор ошибок' },
]
const SELF_STUDY: L10n = { en: 'Self-study session', uz: 'Mustaqil mashg‘ulot', ru: 'Самостоятельное занятие' }

export interface SeedState {
  seededAt: DateKey
  profile: { name: string; targetScore: number; testDate: string; avatarHue: number }
  xp: number
  activity: Record<DateKey, number>
  freezeDays: DateKey[]
  freezes: number
  sessions: Record<DateKey, SessionLog>
  lessons: Record<string, LessonProgress>
  notes: Record<string, Note[]>
  attempts: Record<string, Attempt>
  mistakes: Record<string, MistakeEntry>
  badges: Record<string, string>
  domainStats: Record<Domain, { attempted: number; correct: number }>
  predicted: { math: number; rw: number }
  scoreHistory: { date: DateKey; total: number }[]
  flags: { nightOwl: boolean; sniper: boolean; mastered: number }
}

const emptyAttempt = (): Attempt => ({ answers: {}, flagged: [], eliminated: {}, annotations: {}, time: {} })

/** Answers every question correctly except the given (1-based) numbers */
function seededAnswers(hwId: string, count: number, wrong: number[]) {
  const hw = getHomework(hwId)!
  const answers: Record<string, number> = {}
  const time: Record<string, number> = {}
  hw.questions.slice(0, count).forEach((q, i) => {
    answers[q.id] = wrong.includes(i + 1) ? (q.answer + 1) % 4 : q.answer
    time[q.id] = 40 + ((i * 37) % 70)
  })
  return { answers, time }
}

/**
 * Builds the demo account relative to `now`: a Level 14 student on a 14-day
 * streak, ~4 months into prep, with homework in every state.
 */
export function createSeed(now: Date): SeedState {
  const rng = mulberry32(20261002)
  const today = toKey(now)
  const joinedDaysAgo = 128

  /* Activity heatmap + attendance */
  const activity: Record<DateKey, number> = {}
  const sessions: Record<DateKey, SessionLog> = {}
  const freezeDay = toKey(addDays(now, -9))
  let topic = 0
  for (let ago = joinedDaysAgo; ago >= 1; ago--) {
    const d = addDays(now, -ago)
    const key = toKey(d)
    const wd = weekdayMon(d)
    const isClass = CLASS_DAYS.includes(wd)
    const inStreak = ago <= 14
    let xp = 0

    if (isClass) {
      const roll = rng()
      // Recent two weeks are spotless; earlier weeks have the odd late/missed class
      const status: SessionLog['status'] = inStreak ? (roll < 0.12 ? 'late' : 'attended') : roll < 0.025 ? 'missed' : roll < 0.12 ? 'late' : 'attended'
      sessions[key] = {
        date: key,
        status,
        topic: CLASS_TOPICS[topic++ % CLASS_TOPICS.length],
        minutes: status === 'missed' ? 0 : status === 'late' ? randInt(rng, 55, 75) : 90,
        checkIn: status === 'missed' ? undefined : status === 'late' ? `18:${String(randInt(rng, 11, 28)).padStart(2, '0')}` : `17:${randInt(rng, 48, 59)}`,
      }
      if (status !== 'missed') xp = inStreak ? randInt(rng, 220, 340) : randInt(rng, 90, 240)
    } else if (rng() < (inStreak ? 1 : 0.45)) {
      xp = inStreak ? randInt(rng, 160, 300) : randInt(rng, 30, wd >= 5 ? 320 : 180)
      if (wd >= 5 && xp >= 120) {
        sessions[key] = { date: key, status: 'bonus', topic: SELF_STUDY, minutes: Math.round(xp / 3), checkIn: `${randInt(rng, 10, 16)}:${String(randInt(rng, 0, 59)).padStart(2, '0')}` }
      }
    }
    if (inStreak && xp === 0) xp = randInt(rng, 60, 160)
    if (ago === 15) xp = 0 // the day the previous streak broke
    if (key === freezeDay) xp = 0 // covered by a streak freeze
    if (xp > 0) activity[key] = xp
  }
  // Keep the class on the frozen day consistent with zero activity
  if (sessions[freezeDay]) sessions[freezeDay] = { ...sessions[freezeDay], status: 'missed', minutes: 0, checkIn: undefined }
  // The previous streak broke on day −15 — no class activity that day either
  const brokeKey = toKey(addDays(now, -15))
  if (sessions[brokeKey]) sessions[brokeKey] = { ...sessions[brokeKey], status: 'missed', minutes: 0, checkIn: undefined }

  /* Homework attempts */
  const iso = (daysAgo: number, h = 19) => {
    const d = addDays(now, -daysAgo)
    d.setHours(h, 20, 0, 0)
    return d.toISOString()
  }
  const lin = seededAnswers('hw-lin', 12, [5])
  const func = seededAnswers('hw-func', 10, [2, 7])
  const sys = seededAnswers('hw-sys', 7, [4])
  const trans = seededAnswers('hw-trans', 3, [2])
  const attempts: Record<string, Attempt> = {
    'hw-lin': { ...emptyAttempt(), ...lin, startedAt: iso(8), submittedAt: iso(8, 20), score: 11 / 12, xpEarned: 238 },
    'hw-func': { ...emptyAttempt(), ...func, startedAt: iso(11), submittedAt: iso(11, 21), score: 0.8, xpEarned: 194 },
    'hw-sys': { ...emptyAttempt(), ...sys, flagged: ['hw-sys-q6'], startedAt: iso(1) },
    'hw-trans': { ...emptyAttempt(), ...trans, startedAt: iso(3) },
  }

  /* Mistake bank: wrong answers from finished sets + the placement diagnostic */
  const mistakes: Record<string, MistakeEntry> = {}
  const addMistake = (questionId: string, source: string, chosen: number, box: number, dueIn: number, wrongAgo: number, times = 1) => {
    mistakes[questionId] = {
      questionId,
      source,
      chosen,
      box,
      dueAt: addDays(now, dueIn).toISOString(),
      timesWrong: times,
      lastWrongAt: iso(wrongAgo),
      mastered: false,
    }
  }
  for (const [hwId, att] of [['hw-lin', attempts['hw-lin']], ['hw-func', attempts['hw-func']]] as const) {
    const hw = getHomework(hwId)!
    for (const q of hw.questions) if (att.answers[q.id] !== undefined && att.answers[q.id] !== q.answer) addMistake(q.id, hwId, att.answers[q.id], 1, 0, 8)
  }
  const diagPlan: [number, number, number][] = [
    // [box, dueInDays, timesWrong]
    [1, 0, 2], [2, 0, 1], [3, 2, 1], [1, 0, 1], [2, 1, 1], [1, 0, 3], [2, 0, 1], [3, 4, 1], [1, 0, 2], [2, 3, 1],
  ]
  diagnosticQuestions.forEach((q, i) => {
    const [box, due, times] = diagPlan[i % diagPlan.length]
    addMistake(q.id, 'diagnostic', (q.answer + 1 + (i % 3)) % 4, box, due, 30 - i, times)
  })

  const testDate = upcomingTestDate(now)

  const history: { date: DateKey; total: number }[] = []
  const totals = [1280, 1300, 1310, 1340, 1350, 1380, 1400, 1420]
  totals.forEach((total, i) => history.push({ date: toKey(addDays(now, -7 * (totals.length - 1 - i))), total }))

  return {
    seededAt: today,
    profile: { name: 'Kamron', targetScore: 1500, testDate: testDate.toISOString(), avatarHue: 188 },
    xp: xpAtLevel(14) + 420,
    activity,
    freezeDays: [freezeDay],
    freezes: 2,
    sessions,
    lessons: {
      'l-01': { watched: 1, position: 0, completed: true, completedAt: iso(9) },
      'l-02': { watched: 1, position: 0, completed: true, completedAt: iso(5) },
      'l-03': { watched: 0.35, position: 290, completed: false },
    },
    notes: {
      'l-03': [
        { id: 'n1', t: 140, text: 'Flip the inequality sign when multiplying or dividing by a negative!', createdAt: iso(1) },
        { id: 'n2', t: 345, text: 'No solution ⇔ same slope, different intercept.', createdAt: iso(1) },
      ],
    },
    attempts,
    mistakes,
    badges: {
      first_light: iso(9),
      on_fire: iso(7),
      streak_guardian: iso(9),
      diamond_mind: iso(20),
    },
    domainStats: {
      algebra: { attempted: 64, correct: 53 },
      advanced_math: { attempted: 48, correct: 34 },
      craft_structure: { attempted: 40, correct: 31 },
      expression_ideas: { attempted: 36, correct: 25 },
    },
    predicted: { math: 720, rw: 700 },
    scoreHistory: history,
    flags: { nightOwl: false, sniper: false, mastered: 1 },
  }
}
