import type { Difficulty, Domain, L10n, Question } from '@/types'
import { mulberry32, pick, randInt, shuffle, hashString, type Rng } from '@/lib/random'

/**
 * Parametrised SAT-style math items. Each generator draws its numbers from a
 * seeded PRNG, so a homework set always contains the same questions, while
 * the catalog stays small and every explanation is localized from one template.
 */

const MINUS = '−'
const num = (n: number) => (n < 0 ? `${MINUS}${Math.abs(n)}` : String(n))
/** " + 5" / " − 5" for building expressions */
const signed = (n: number) => (n < 0 ? ` ${MINUS} ${Math.abs(n)}` : ` + ${n}`)
const coef = (n: number, v: string) => (n === 1 ? v : n === -1 ? `${MINUS}${v}` : `${num(n)}${v}`)
const signedTerm = (n: number, v: string) => (n < 0 ? ` ${MINUS} ${coef(-n, v)}` : ` + ${coef(n, v)}`)

function choices(rng: Rng, correct: string, distractors: string[]): Pick<Question, 'choices' | 'answer'> {
  const set = [correct]
  for (const d of distractors) if (!set.includes(d) && set.length < 4) set.push(d)
  // Pad with nearby integers if distractors collided
  const base = Number(correct.replace(MINUS, '-').replace('%', ''))
  for (let k = 2; set.length < 4; k++) {
    const v = Number.isFinite(base) ? `${num(base + k)}${correct.endsWith('%') ? '%' : ''}` : `${correct} (${k})`
    if (!set.includes(v)) set.push(v)
  }
  const shuffled = shuffle(rng, set) as Question['choices']
  return { choices: shuffled, answer: shuffled.indexOf(correct) as Question['answer'] }
}

const l = (en: string, uz: string, ru: string): L10n => ({ en, uz, ru })

interface Generated {
  prompt: string
  choices: Question['choices']
  answer: Question['answer']
  explanation: L10n
}

interface Gen {
  domain: Domain
  difficulty: Difficulty
  make: (rng: Rng) => Generated
}

const nz = (rng: Rng, min: number, max: number) => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

/* ───────────────────────── Algebra ───────────────────────── */

const linearSolve: Gen = {
  domain: 'algebra',
  difficulty: 'easy',
  make: (rng) => {
    const a = randInt(rng, 2, 9)
    const x = randInt(rng, -6, 12)
    const b = nz(rng, -15, 20)
    const c = a * x + b
    const r = c - b
    return {
      prompt: `If ${a}x${signed(b)} = ${num(c)}, what is the value of x?`,
      ...choices(rng, num(x), [num(c + b), num(r), num((c + b) % a === 0 ? (c + b) / a : x + 2)]),
      explanation: l(
        `Isolate the x-term: ${a}x = ${num(r)}. Then divide both sides by ${a}: x = ${num(x)}.`,
        `x qatnashgan hadni ajratamiz: ${a}x = ${num(r)}. Ikkala tomonni ${a} ga bo‘lamiz: x = ${num(x)}.`,
        `Оставляем слагаемое с x: ${a}x = ${num(r)}. Делим обе части на ${a}: x = ${num(x)}.`,
      ),
    }
  },
}

const targetExpression: Gen = {
  domain: 'algebra',
  difficulty: 'medium',
  make: (rng) => {
    const a = randInt(rng, 2, 8)
    const b = randInt(rng, 2, 9)
    const k = nz(rng, -5, 9)
    const c = a * k
    return {
      prompt: `If ${a}(x ${MINUS} ${b}) = ${num(c)}, what is the value of x ${MINUS} ${b}?`,
      ...choices(rng, num(k), [num(k + b), num(c - a), num(k * 2)]),
      explanation: l(
        `Divide both sides by ${a}: x ${MINUS} ${b} = ${num(k)}. The question asks for x ${MINUS} ${b}, so there's no need to solve for x.`,
        `Ikkala tomonni ${a} ga bo‘lamiz: x ${MINUS} ${b} = ${num(k)}. Savol aynan x ${MINUS} ${b} ni so‘rayapti — x ni topish shart emas.`,
        `Делим обе части на ${a}: x ${MINUS} ${b} = ${num(k)}. Спрашивают именно x ${MINUS} ${b}, поэтому находить x не нужно.`,
      ),
    }
  },
}

const systemAdd: Gen = {
  domain: 'algebra',
  difficulty: 'easy',
  make: (rng) => {
    const x = randInt(rng, 3, 15)
    const y = randInt(rng, 1, x - 1)
    const s = x + y
    const d = x - y
    return {
      prompt: `x + y = ${s}\nx ${MINUS} y = ${d}\nWhat is the value of x in the solution to the system of equations above?`,
      ...choices(rng, num(x), [num(y), num(s), num(d)]),
      explanation: l(
        `Add the two equations to eliminate y: 2x = ${s + d}, so x = ${x}.`,
        `y ni yo‘qotish uchun tenglamalarni qo‘shamiz: 2x = ${s + d}, demak x = ${x}.`,
        `Складываем уравнения, чтобы исключить y: 2x = ${s + d}, значит x = ${x}.`,
      ),
    }
  },
}

const slope: Gen = {
  domain: 'algebra',
  difficulty: 'easy',
  make: (rng) => {
    const m = nz(rng, -5, 6)
    const x1 = randInt(rng, -4, 5)
    const dx = randInt(rng, 1, 4)
    const y1 = randInt(rng, -6, 8)
    const x2 = x1 + dx
    const y2 = y1 + m * dx
    const inverse = Math.abs(m) === 1 ? num(m * 2) : `${m < 0 ? MINUS : ''}1/${Math.abs(m)}`
    return {
      prompt: `A line in the xy-plane passes through the points (${num(x1)}, ${num(y1)}) and (${num(x2)}, ${num(y2)}). What is the slope of the line?`,
      ...choices(rng, num(m), [num(-m), inverse, num(m + 1)]),
      explanation: l(
        `Slope = (y₂ ${MINUS} y₁) / (x₂ ${MINUS} x₁) = ${num(y2 - y1)} / ${dx} = ${num(m)}.`,
        `Og‘ish = (y₂ ${MINUS} y₁) / (x₂ ${MINUS} x₁) = ${num(y2 - y1)} / ${dx} = ${num(m)}.`,
        `Угловой коэффициент = (y₂ ${MINUS} y₁) / (x₂ ${MINUS} x₁) = ${num(y2 - y1)} / ${dx} = ${num(m)}.`,
      ),
    }
  },
}

const linearModel: Gen = {
  domain: 'algebra',
  difficulty: 'medium',
  make: (rng) => {
    const f = pick(rng, [25, 30, 40, 50, 60])
    const r = pick(rng, [15, 18, 20, 25, 30, 35])
    const n = randInt(rng, 3, 14)
    const total = f + r * n
    return {
      prompt: `A gym charges a one-time sign-up fee of $${f} plus $${r} per month. A member has paid a total of $${total}. For how many months has the member been paying?`,
      ...choices(rng, num(n), [num(n + 1), num(n - 1), num(Math.round(total / r))]),
      explanation: l(
        `Model the total as ${f} + ${r}n = ${total}. Subtract ${f}: ${r}n = ${total - f}, so n = ${n}.`,
        `Umumiy summa: ${f} + ${r}n = ${total}. ${f} ni ayiramiz: ${r}n = ${total - f}, demak n = ${n}.`,
        `Общая сумма: ${f} + ${r}n = ${total}. Вычитаем ${f}: ${r}n = ${total - f}, значит n = ${n}.`,
      ),
    }
  },
}

const inequality: Gen = {
  domain: 'algebra',
  difficulty: 'medium',
  make: (rng) => {
    const a = randInt(rng, 2, 7)
    const b = randInt(rng, 1, 12)
    const c = randInt(rng, 5, 40)
    const q = (c + b) / a
    const ans = Math.floor(q) + 1
    const qs = Number.isInteger(q) ? String(q) : q.toFixed(2)
    return {
      prompt: `What is the smallest integer value of x that satisfies the inequality ${a}x ${MINUS} ${b} > ${c}?`,
      ...choices(rng, num(ans), [num(Math.floor(q)), num(ans + 1), num(Math.floor((c - b) / a) + 1)]),
      explanation: l(
        `Add ${b} to both sides: ${a}x > ${c + b}. Divide by ${a}: x > ${qs}. The smallest integer strictly greater than ${qs} is ${ans}.`,
        `Ikkala tomonga ${b} qo‘shamiz: ${a}x > ${c + b}. ${a} ga bo‘lamiz: x > ${qs}. ${qs} dan qat’iy katta eng kichik butun son — ${ans}.`,
        `Прибавляем ${b}: ${a}x > ${c + b}. Делим на ${a}: x > ${qs}. Наименьшее целое, строго большее ${qs}, — это ${ans}.`,
      ),
    }
  },
}

const systemTrick: Gen = {
  domain: 'algebra',
  difficulty: 'hard',
  make: (rng) => {
    const a = randInt(rng, 2, 9)
    const b = randInt(rng, 1, 8)
    const s = 3 * a + 2 * b
    const d = a + 2 * b
    return {
      prompt: `3a + 2b = ${s}\na + 2b = ${d}\nBased on the system of equations above, what is the value of a + b?`,
      ...choices(rng, num(a + b), [num(a), num(s - d), num(b)]),
      explanation: l(
        `Subtract the second equation from the first: 2a = ${s - d}, so a = ${a}. Then 2b = ${d} ${MINUS} ${a} = ${d - a}, so b = ${b}. a + b = ${a + b}.`,
        `Birinchi tenglamadan ikkinchisini ayiramiz: 2a = ${s - d}, a = ${a}. So‘ng 2b = ${d} ${MINUS} ${a} = ${d - a}, b = ${b}. a + b = ${a + b}.`,
        `Вычитаем второе уравнение из первого: 2a = ${s - d}, a = ${a}. Тогда 2b = ${d} ${MINUS} ${a} = ${d - a}, b = ${b}. a + b = ${a + b}.`,
      ),
    }
  },
}

const noSolution: Gen = {
  domain: 'algebra',
  difficulty: 'hard',
  make: (rng) => {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 2, 7)
    const m = randInt(rng, 2, 4)
    const c = randInt(rng, 3, 20)
    const d = c * m + randInt(rng, 1, 9)
    return {
      prompt: `${a}x + ${b}y = ${c}\nkx + ${b * m}y = ${d}\nIn the system of equations above, k is a constant. For what value of k does the system have no solution?`,
      ...choices(rng, num(a * m), [num(a), num(b * m), num(a + m)]),
      explanation: l(
        `No solution means parallel lines: the coefficients must be proportional but the constants not. The y-coefficient was multiplied by ${m} (${b} → ${b * m}), so k = ${a} × ${m} = ${a * m}. Check: ${c} × ${m} = ${c * m} ≠ ${d}, so the lines are distinct.`,
        `Yechim yo‘q — to‘g‘ri chiziqlar parallel: koeffitsiyentlar proporsional, ozod hadlar esa emas. y koeffitsiyenti ${m} ga ko‘paytirilgan (${b} → ${b * m}), demak k = ${a} × ${m} = ${a * m}. Tekshiruv: ${c} × ${m} = ${c * m} ≠ ${d}.`,
        `Нет решений — прямые параллельны: коэффициенты пропорциональны, а свободные члены — нет. Коэффициент при y умножен на ${m} (${b} → ${b * m}), значит k = ${a} × ${m} = ${a * m}. Проверка: ${c} × ${m} = ${c * m} ≠ ${d}.`,
      ),
    }
  },
}

/* ───────────────────────── Advanced math ───────────────────────── */

const vietaSum: Gen = {
  domain: 'advanced_math',
  difficulty: 'medium',
  make: (rng) => {
    const p = nz(rng, -7, 9)
    let q = nz(rng, -7, 9)
    if (q === p) q = p + 2
    const b = -(p + q)
    const c = p * q
    const eq = `x²${b === 0 ? '' : signedTerm(b, 'x')}${signed(c)} = 0`
    return {
      prompt: `What is the sum of the solutions to the equation ${eq}?`,
      ...choices(rng, num(p + q), [num(-(p + q)), num(c), num(p - q)]),
      explanation: l(
        `For x² + bx + c = 0 the sum of the solutions is ${MINUS}b = ${num(p + q)}. (Factoring gives (x ${MINUS} ${num(p)})(x ${MINUS} ${num(q)}) = 0, so the solutions are ${num(p)} and ${num(q)}.)`,
        `x² + bx + c = 0 uchun yechimlar yig‘indisi ${MINUS}b = ${num(p + q)} (Viyet teoremasi). Ko‘paytuvchilarga ajratsak: yechimlar ${num(p)} va ${num(q)}.`,
        `Для x² + bx + c = 0 сумма корней равна ${MINUS}b = ${num(p + q)} (теорема Виета). Разложив на множители, получаем корни ${num(p)} и ${num(q)}.`,
      ),
    }
  },
}

const vertexMin: Gen = {
  domain: 'advanced_math',
  difficulty: 'easy',
  make: (rng) => {
    const a = randInt(rng, 1, 5)
    const h = nz(rng, -6, 7)
    const k = nz(rng, -9, 12)
    const sq = `(x${signed(-h)})²`
    return {
      prompt: `The function f is defined by f(x) = ${a === 1 ? '' : a}${sq}${signed(k)}. What is the minimum value of f(x)?`,
      ...choices(rng, num(k), [num(h), num(-k), num(a + k)]),
      explanation: l(
        `f is in vertex form a(x ${MINUS} h)² + k with a = ${a} > 0, so the parabola opens up and its minimum value is k = ${num(k)}, reached at x = ${num(h)}.`,
        `f cho‘qqi ko‘rinishida: a(x ${MINUS} h)² + k, a = ${a} > 0 — parabola yuqoriga ochiladi, eng kichik qiymat k = ${num(k)} (x = ${num(h)} da).`,
        `f записана в вершинной форме a(x ${MINUS} h)² + k, a = ${a} > 0 — ветви вверх, минимум равен k = ${num(k)} (при x = ${num(h)}).`,
      ),
    }
  },
}

const evaluate: Gen = {
  domain: 'advanced_math',
  difficulty: 'easy',
  make: (rng) => {
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 1, 15)
    const k = nz(rng, -4, 5)
    const ans = a * k * k - b
    return {
      prompt: `The function f is defined by f(x) = ${a}x² ${MINUS} ${b}. What is the value of f(${num(k)})?`,
      ...choices(rng, num(ans), [num(a * k - b), num((a * k) ** 2 - b), num(a * k * k + b)]),
      explanation: l(
        `Substitute x = ${num(k)}: f(${num(k)}) = ${a}·(${num(k)})² ${MINUS} ${b} = ${a * k * k} ${MINUS} ${b} = ${num(ans)}. Square before multiplying.`,
        `x = ${num(k)} ni qo‘yamiz: f(${num(k)}) = ${a}·(${num(k)})² ${MINUS} ${b} = ${a * k * k} ${MINUS} ${b} = ${num(ans)}. Avval kvadratga oshiring, keyin ko‘paytiring.`,
        `Подставляем x = ${num(k)}: f(${num(k)}) = ${a}·(${num(k)})² ${MINUS} ${b} = ${a * k * k} ${MINUS} ${b} = ${num(ans)}. Сначала возводим в квадрат, потом умножаем.`,
      ),
    }
  },
}

const doubling: Gen = {
  domain: 'advanced_math',
  difficulty: 'medium',
  make: (rng) => {
    const p = pick(rng, [50, 80, 120, 150, 200, 300])
    const d = pick(rng, [2, 3, 4, 5, 6])
    const m = randInt(rng, 2, 5)
    const t = d * m
    return {
      prompt: `A colony of ${p} bacteria doubles in size every ${d} hours. Assuming this growth continues, how many bacteria will there be after ${t} hours?`,
      ...choices(rng, num(p * 2 ** m), [num(p * 2 * m), num(p * 2 ** (m + 1)), num(p * t)]),
      explanation: l(
        `${t} hours is ${t} ÷ ${d} = ${m} doubling periods, so the population is ${p} · 2^${m} = ${p * 2 ** m}. Exponential growth multiplies; it doesn't add.`,
        `${t} soat — bu ${t} ÷ ${d} = ${m} ta ikki baravarlanish davri: ${p} · 2^${m} = ${p * 2 ** m}. Eksponensial o‘sish qo‘shmaydi, ko‘paytiradi.`,
        `${t} часов — это ${t} ÷ ${d} = ${m} периодов удвоения: ${p} · 2^${m} = ${p * 2 ** m}. Экспоненциальный рост умножает, а не прибавляет.`,
      ),
    }
  },
}

const discriminant: Gen = {
  domain: 'advanced_math',
  difficulty: 'medium',
  make: (rng) => {
    const kind = randInt(rng, 0, 2)
    const a = randInt(rng, 1, 4)
    let b: number
    let c: number
    if (kind === 1) {
      const r = nz(rng, -5, 5)
      b = -2 * a * r
      c = a * r * r
    } else if (kind === 2) {
      b = nz(rng, -9, 9)
      c = -randInt(rng, 1, 12)
    } else {
      b = randInt(rng, -3, 3)
      c = Math.floor((b * b) / (4 * a)) + randInt(rng, 1, 8)
    }
    const D = b * b - 4 * a * c
    const answer = D < 0 ? '0' : D === 0 ? '1' : '2'
    const fixed = ['0', '1', '2', 'Infinitely many'] as Question['choices']
    const eq = `${a === 1 ? '' : a}x²${b === 0 ? '' : signedTerm(b, 'x')}${signed(c)} = 0`
    const verdict = (lang: 'en' | 'uz' | 'ru') =>
      D < 0
        ? { en: 'negative, so there are no real solutions', uz: 'manfiy — haqiqiy yechim yo‘q', ru: 'отрицательный — действительных корней нет' }[lang]
        : D === 0
          ? { en: 'zero, so there is exactly one real solution', uz: 'nolga teng — bitta haqiqiy yechim', ru: 'равен нулю — ровно один корень' }[lang]
          : { en: 'positive, so there are two distinct real solutions', uz: 'musbat — ikkita turli haqiqiy yechim', ru: 'положительный — два различных корня' }[lang]
    return {
      prompt: `How many distinct real solutions does the equation ${eq} have?`,
      choices: fixed,
      answer: fixed.indexOf(answer) as Question['answer'],
      explanation: l(
        `The discriminant is b² ${MINUS} 4ac = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${num(D)}, which is ${verdict('en')}.`,
        `Diskriminant: b² ${MINUS} 4ac = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${num(D)} — ${verdict('uz')}.`,
        `Дискриминант: b² ${MINUS} 4ac = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${num(D)} — ${verdict('ru')}.`,
      ),
    }
  },
}

const expandCoef: Gen = {
  domain: 'advanced_math',
  difficulty: 'easy',
  make: (rng) => {
    const p = nz(rng, -6, 9)
    const q = nz(rng, -6, 9)
    return {
      prompt: `(x${signed(p)})(x${signed(q)}) = x² + kx + ${num(p * q)}\nIn the equation above, k is a constant. What is the value of k?`,
      ...choices(rng, num(p + q), [num(p * q), num(p - q), num(-(p + q))]),
      explanation: l(
        `Expanding gives x² + (${num(p)} + ${num(q)})x + ${num(p * q)}, so k = ${num(p + q)}.`,
        `Qavslarni ochsak: x² + (${num(p)} + ${num(q)})x + ${num(p * q)}, demak k = ${num(p + q)}.`,
        `Раскрываем скобки: x² + (${num(p)} + ${num(q)})x + ${num(p * q)}, значит k = ${num(p + q)}.`,
      ),
    }
  },
}

const reciprocalSquare: Gen = {
  domain: 'advanced_math',
  difficulty: 'hard',
  make: (rng) => {
    const s = randInt(rng, 3, 9)
    return {
      prompt: `If x + 1/x = ${s}, what is the value of x² + 1/x²?`,
      ...choices(rng, num(s * s - 2), [num(s * s), num(s * s + 2), num(2 * s)]),
      explanation: l(
        `Square both sides: x² + 2 + 1/x² = ${s * s}. Subtract 2: x² + 1/x² = ${s * s - 2}. The middle term 2·x·(1/x) = 2 is the trap.`,
        `Ikkala tomonni kvadratga oshiramiz: x² + 2 + 1/x² = ${s * s}. 2 ni ayiramiz: ${s * s - 2}. Tuzoq — o‘rta had 2·x·(1/x) = 2.`,
        `Возводим в квадрат: x² + 2 + 1/x² = ${s * s}. Вычитаем 2: ${s * s - 2}. Ловушка — средний член 2·x·(1/x) = 2.`,
      ),
    }
  },
}

const percentChain: Gen = {
  domain: 'advanced_math',
  difficulty: 'hard',
  make: (rng) => {
    const p = pick(rng, [10, 20, 25, 40, 50])
    const q = pick(rng, [10, 20, 25, 40])
    const final = ((100 + p) * (100 - q)) / 100
    const fmt = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`
    return {
      prompt: `The price of a jacket is increased by ${p}% and the new price is later decreased by ${q}%. The final price is what percent of the original price?`,
      ...choices(rng, fmt(final), [fmt(100 + p - q), fmt(100 - p + q), fmt(((100 + q) * (100 - p)) / 100 + 5)]),
      explanation: l(
        `Successive percent changes multiply: ${((100 + p) / 100).toFixed(2)} × ${((100 - q) / 100).toFixed(2)} = ${(final / 100).toFixed(3)}, i.e. ${fmt(final)} of the original — not ${fmt(100 + p - q)}.`,
        `Ketma-ket foiz o‘zgarishlari ko‘paytiriladi: ${((100 + p) / 100).toFixed(2)} × ${((100 - q) / 100).toFixed(2)} = ${(final / 100).toFixed(3)}, ya’ni asl narxning ${fmt(final)} i (${fmt(100 + p - q)} emas).`,
        `Последовательные проценты перемножаются: ${((100 + p) / 100).toFixed(2)} × ${((100 - q) / 100).toFixed(2)} = ${(final / 100).toFixed(3)}, то есть ${fmt(final)} от исходной цены (а не ${fmt(100 + p - q)}).`,
      ),
    }
  },
}

const expModel: Gen = {
  domain: 'advanced_math',
  difficulty: 'hard',
  make: (rng) => {
    const A = pick(rng, [2, 3, 4, 5])
    const B = pick(rng, [2, 3])
    const t = 3
    return {
      prompt: `The function f is defined by f(x) = a·bˣ, where a and b are positive constants. If f(0) = ${A} and f(1) = ${A * B}, what is the value of f(${t})?`,
      ...choices(rng, num(A * B ** t), [num(A * B * t), num((A * B) ** 2), num(A + B * t)]),
      explanation: l(
        `f(0) = a = ${A}. f(1) = a·b = ${A * B}, so b = ${B}. Then f(${t}) = ${A}·${B}³ = ${A * B ** t}.`,
        `f(0) = a = ${A}. f(1) = a·b = ${A * B}, demak b = ${B}. f(${t}) = ${A}·${B}³ = ${A * B ** t}.`,
        `f(0) = a = ${A}. f(1) = a·b = ${A * B}, значит b = ${B}. f(${t}) = ${A}·${B}³ = ${A * B ** t}.`,
      ),
    }
  },
}

export const GENERATORS = {
  linearSolve,
  targetExpression,
  systemAdd,
  slope,
  linearModel,
  inequality,
  systemTrick,
  noSolution,
  vietaSum,
  vertexMin,
  evaluate,
  doubling,
  discriminant,
  expandCoef,
  reciprocalSquare,
  percentChain,
  expModel,
} satisfies Record<string, Gen>

export type GenName = keyof typeof GENERATORS

/** Builds `count` questions cycling through the given generators, deterministically per set id */
export function buildMathSet(setId: string, gens: GenName[], count: number): Question[] {
  const rng = mulberry32(hashString(setId))
  return Array.from({ length: count }, (_, i) => {
    const gen = GENERATORS[gens[i % gens.length]]
    return { id: `${setId}-q${i + 1}`, domain: gen.domain, difficulty: gen.difficulty, ...gen.make(rng) }
  })
}
