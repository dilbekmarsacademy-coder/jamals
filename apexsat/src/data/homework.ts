import type { Homework, Question } from '@/types'
import { buildMathSet } from './questions/math'
import { craftQuestions, diagnosticRwQuestions, expressionQuestions } from './questions/rw'

export const homework: Homework[] = [
  {
    id: 'hw-lin',
    title: { en: 'Linear Equations Sprint', uz: 'Chiziqli tenglamalar sprinti', ru: 'Спринт: линейные уравнения' },
    section: 'math',
    domain: 'algebra',
    difficulty: 'easy',
    dueInDays: -6,
    estMin: 15,
    xp: 250,
    lessonId: 'l-01',
    questions: buildMathSet('hw-lin', ['linearSolve', 'targetExpression', 'systemAdd', 'slope', 'linearModel'], 12),
  },
  {
    id: 'hw-sys',
    title: { en: 'Heart of Algebra: Systems & Inequalities', uz: 'Algebra: sistemalar va tengsizliklar', ru: 'Алгебра: системы и неравенства' },
    section: 'math',
    domain: 'algebra',
    difficulty: 'medium',
    dueInDays: 2,
    estMin: 25,
    xp: 300,
    lessonId: 'l-03',
    questions: buildMathSet('hw-sys', ['systemAdd', 'inequality', 'linearModel', 'targetExpression', 'noSolution'], 15),
  },
  {
    id: 'hw-wic',
    title: { en: 'Words in Context Drill', uz: 'Words in Context mashqi', ru: 'Тренировка: Words in Context' },
    section: 'rw',
    domain: 'craft_structure',
    difficulty: 'medium',
    dueInDays: 4,
    estMin: 12,
    xp: 200,
    lessonId: 'l-05',
    questions: craftQuestions,
  },
  {
    id: 'hw-trans',
    title: { en: 'Transitions & Rhetorical Synthesis', uz: 'Bog‘lovchilar va ritorik sintez', ru: 'Связки и риторический синтез' },
    section: 'rw',
    domain: 'expression_ideas',
    difficulty: 'medium',
    dueInDays: -1,
    estMin: 12,
    xp: 200,
    lessonId: 'l-06',
    questions: expressionQuestions,
  },
  {
    id: 'hw-quad',
    title: { en: 'Advanced Math: Quadratics Lab', uz: 'Advanced Math: kvadrat tenglamalar', ru: 'Advanced Math: квадратные уравнения' },
    section: 'math',
    domain: 'advanced_math',
    difficulty: 'medium',
    dueInDays: 6,
    estMin: 30,
    xp: 350,
    lessonId: 'l-04',
    questions: buildMathSet('hw-quad', ['vietaSum', 'vertexMin', 'evaluate', 'discriminant', 'expandCoef'], 20),
  },
  {
    id: 'hw-hard',
    title: { en: 'Hard Math Gauntlet', uz: 'Qiyin matematika sinovi', ru: 'Испытание: сложная математика' },
    section: 'math',
    domain: 'advanced_math',
    difficulty: 'hard',
    dueInDays: 7,
    estMin: 25,
    xp: 400,
    questions: buildMathSet('hw-hard', ['noSolution', 'reciprocalSquare', 'systemTrick', 'percentChain', 'expModel'], 10),
  },
  {
    id: 'hw-func',
    title: { en: 'Nonlinear Functions Review', uz: 'Nochiziqli funksiyalar takrori', ru: 'Повторение: нелинейные функции' },
    section: 'math',
    domain: 'advanced_math',
    difficulty: 'medium',
    dueInDays: -9,
    estMin: 15,
    xp: 220,
    questions: buildMathSet('hw-func', ['evaluate', 'doubling', 'vertexMin', 'expandCoef'], 10),
  },
  {
    id: 'hw-exp',
    title: { en: 'Exponential Growth Check', uz: 'Eksponensial o‘sish tekshiruvi', ru: 'Проверка: экспоненциальный рост' },
    section: 'math',
    domain: 'advanced_math',
    difficulty: 'medium',
    dueInDays: -3,
    estMin: 15,
    xp: 200,
    questions: buildMathSet('hw-exp', ['doubling', 'expModel', 'evaluate', 'discriminant'], 10),
  },
]

/** Placement diagnostic — not assignable, but its mistakes seed the Mistake Bank */
export const diagnosticQuestions: Question[] = [
  ...buildMathSet('diag-alg', ['inequality', 'linearModel', 'systemTrick'], 3),
  ...buildMathSet('diag-adv', ['discriminant', 'percentChain', 'vietaSum'], 3),
  ...diagnosticRwQuestions,
]

export const getHomework = (id: string) => homework.find((h) => h.id === id)

const registry = new Map<string, Question>()
for (const q of [...homework.flatMap((h) => h.questions), ...diagnosticQuestions]) registry.set(q.id, q)

export const getQuestion = (id: string) => registry.get(id)
