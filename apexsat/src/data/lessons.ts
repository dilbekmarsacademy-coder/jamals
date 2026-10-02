import type { FormulaGroup, Lesson, Resource } from '@/types'

const CB_MATH = 'https://satsuite.collegeboard.org/sat/whats-on-the-test/math'
const CB_RW = 'https://satsuite.collegeboard.org/sat/whats-on-the-test/reading-writing'

/* ───────────────────────── Formula reference ───────────────────────── */

const linearFormulas: FormulaGroup[] = [
  {
    id: 'lines',
    title: { en: 'Lines', uz: 'To‘g‘ri chiziqlar', ru: 'Прямые' },
    items: [
      { label: { en: 'Slope', uz: 'Og‘ish', ru: 'Угловой коэффициент' }, formula: 'm = (y₂ − y₁) / (x₂ − x₁)' },
      { label: { en: 'Slope-intercept form', uz: 'Burchak koeffitsiyentli shakl', ru: 'Уравнение с угловым коэф.' }, formula: 'y = mx + b' },
      { label: { en: 'Point-slope form', uz: 'Nuqta-og‘ish shakli', ru: 'Через точку и наклон' }, formula: 'y − y₁ = m(x − x₁)' },
      { label: { en: 'Parallel / perpendicular', uz: 'Parallel / perpendikulyar', ru: 'Параллельные / перпендикулярные' }, formula: 'm₁ = m₂  ·  m₁·m₂ = −1' },
    ],
  },
  {
    id: 'systems',
    title: { en: 'Systems', uz: 'Sistemalar', ru: 'Системы' },
    items: [
      { label: { en: 'No solution', uz: 'Yechim yo‘q', ru: 'Нет решений' }, formula: 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂' },
      { label: { en: 'Infinitely many', uz: 'Cheksiz ko‘p', ru: 'Бесконечно много' }, formula: 'a₁/a₂ = b₁/b₂ = c₁/c₂' },
      { label: { en: 'Exactly one', uz: 'Bitta yechim', ru: 'Ровно одно' }, formula: 'a₁/a₂ ≠ b₁/b₂' },
    ],
  },
]

const quadraticFormulas: FormulaGroup[] = [
  {
    id: 'quadratics',
    title: { en: 'Quadratics', uz: 'Kvadrat funksiyalar', ru: 'Квадратичные функции' },
    items: [
      { label: { en: 'Quadratic formula', uz: 'Ildizlar formulasi', ru: 'Формула корней' }, formula: 'x = (−b ± √(b² − 4ac)) / 2a' },
      { label: { en: 'Discriminant', uz: 'Diskriminant', ru: 'Дискриминант' }, formula: 'D = b² − 4ac' },
      { label: { en: 'Vertex x-coordinate', uz: 'Cho‘qqi abssissasi', ru: 'Абсцисса вершины' }, formula: 'h = −b / 2a' },
      { label: { en: 'Sum / product of roots', uz: 'Ildizlar yig‘indisi / ko‘paytmasi', ru: 'Сумма / произведение корней' }, formula: 'x₁ + x₂ = −b/a  ·  x₁·x₂ = c/a' },
    ],
  },
  {
    id: 'exponential',
    title: { en: 'Exponential', uz: 'Eksponensial', ru: 'Показательные' },
    items: [
      { label: { en: 'Growth / decay', uz: 'O‘sish / kamayish', ru: 'Рост / убывание' }, formula: 'y = a(1 ± r)ᵗ' },
      { label: { en: 'Doubling', uz: 'Ikki baravarlanish', ru: 'Удвоение' }, formula: 'y = a · 2^(t/d)' },
      { label: { en: 'Exponent rules', uz: 'Daraja qoidalari', ru: 'Свойства степеней' }, formula: 'aᵐ·aⁿ = aᵐ⁺ⁿ  ·  (aᵐ)ⁿ = aᵐⁿ' },
    ],
  },
]

const transitionMap: FormulaGroup[] = [
  {
    id: 'transitions',
    title: { en: 'Transition map', uz: 'Bog‘lovchilar xaritasi', ru: 'Карта связок' },
    items: [
      { label: { en: 'Addition', uz: 'Qo‘shish', ru: 'Добавление' }, formula: 'moreover · additionally · furthermore' },
      { label: { en: 'Contrast', uz: 'Zidlik', ru: 'Противопоставление' }, formula: 'however · nevertheless · in contrast' },
      { label: { en: 'Cause → effect', uz: 'Sabab → natija', ru: 'Причина → следствие' }, formula: 'therefore · consequently · for this reason' },
      { label: { en: 'Example', uz: 'Misol', ru: 'Пример' }, formula: 'for example · for instance · specifically' },
      { label: { en: 'Sequence', uz: 'Ketma-ketlik', ru: 'Последовательность' }, formula: 'subsequently · previously · finally' },
    ],
  },
]

const contextClues: FormulaGroup[] = [
  {
    id: 'clues',
    title: { en: 'Context clues', uz: 'Kontekst belgilari', ru: 'Подсказки контекста' },
    items: [
      { label: { en: 'Contrast signal', uz: 'Zidlik belgisi', ru: 'Сигнал контраста' }, formula: 'although · but · anything but → opposite' },
      { label: { en: 'Colon / dash', uz: 'Ikki nuqta / tire', ru: 'Двоеточие / тире' }, formula: '“: …” → explains or proves the blank' },
      { label: { en: 'Method', uz: 'Usul', ru: 'Метод' }, formula: 'Predict your own word → then match' },
    ],
  },
]

/* ───────────────────────── Downloads ───────────────────────── */

const sheet = (id: string, title: Resource['title'], size: string, body: string, kind: Resource['kind'] = 'pdf'): Resource => ({
  id,
  title,
  kind,
  size,
  body,
})

const link = (id: string, title: Resource['title'], url: string): Resource => ({ id, title, kind: 'link', url })

const cbMath = link('cb', { en: 'College Board: Math domains', uz: 'College Board: Math bo‘limlari', ru: 'College Board: разделы Math' }, CB_MATH)
const cbRw = link('cb', { en: 'College Board: Reading & Writing', uz: 'College Board: Reading & Writing', ru: 'College Board: Reading & Writing' }, CB_RW)

const LINEAR_SHEET = `ApexSAT — Linear Equations Cheat Sheet

1. Undo operations in reverse order (subtract, then divide).
2. Read what the question asks: if it wants 2x + 3, don't stop at x.
3. Slope m = (y2 - y1)/(x2 - x1). Positive = rising, negative = falling.
4. y = mx + b: b is the y-intercept, i.e. the starting value in word problems.
5. Systems: add/subtract equations to eliminate a variable.
6. No solution  -> same slope, different intercept.
   Infinite      -> identical equations after scaling.
`

const QUAD_SHEET = `ApexSAT — Quadratics Formula Sheet

Standard form   y = ax^2 + bx + c
Vertex form     y = a(x - h)^2 + k   (vertex at (h, k))
Factored form   y = a(x - p)(x - q)  (x-intercepts p, q)

Discriminant D = b^2 - 4ac
  D > 0 -> 2 real solutions | D = 0 -> 1 | D < 0 -> 0
Sum of roots = -b/a, product = c/a
Vertex x = -b / 2a
`

const RW_SHEET = `ApexSAT — Words in Context Playbook

1. Cover the choices. Read the full text.
2. Underline the clue: contrast word, colon, example list.
3. Write your own word for the blank.
4. Pick the choice closest to YOUR word — not the fanciest one.
Common traps: a real meaning of the word that doesn't fit this context;
a choice that matches the topic but reverses the tone.
`

const TRANSITION_SHEET = `ApexSAT — Transitions Map

Addition:      moreover, additionally, furthermore, also
Contrast:      however, nevertheless, in contrast, yet, still
Concession:    admittedly, granted, even so
Cause/effect:  therefore, consequently, as a result, for this reason
Example:       for example, for instance, specifically
Sequence:      first, subsequently, previously, finally
Rule: name the relationship between the two sentences BEFORE reading the choices.
`

/* ───────────────────────── Lessons ───────────────────────── */

/**
 * Videos are public, embeddable SAT lessons on YouTube (copyright belongs to
 * their creators). Chapter markers are ApexSAT's own study outline; markers
 * past the video's real length are hidden by the player.
 */
export const lessons: Lesson[] = [
  {
    id: 'l-01',
    module: 1,
    title: { en: 'Linear Equations: The Foundations', uz: 'Chiziqli tenglamalar: asoslar', ru: 'Линейные уравнения: основы' },
    summary: {
      en: 'Solve one-variable linear equations quickly and without sign errors — the most common question type on the Math section.',
      uz: 'Bir o‘zgaruvchili chiziqli tenglamalarni tez va ishora xatolarisiz yechish — Math bo‘limidagi eng ko‘p uchraydigan savol turi.',
      ru: 'Быстро и без ошибок в знаках решаем линейные уравнения с одной переменной — самый частый тип вопросов в Math.',
    },
    domain: 'algebra',
    youtubeId: 'EkBUTZe_SiM',
    channel: 'Khan Academy',
    durationMin: 4,
    xp: 80,
    chapters: [
      { t: 0, title: { en: 'Warm-up', uz: 'Kirish', ru: 'Разминка' } },
      { t: 50, title: { en: 'Isolating the variable', uz: 'O‘zgaruvchini ajratish', ru: 'Выделяем переменную' } },
      { t: 140, title: { en: 'Checking your answer', uz: 'Javobni tekshirish', ru: 'Проверка ответа' } },
    ],
    resources: [sheet('r1', { en: 'Linear equations cheat sheet', uz: 'Chiziqli tenglamalar — qisqa qo‘llanma', ru: 'Шпаргалка: линейные уравнения' }, '4 KB', LINEAR_SHEET), cbMath],
    formulas: linearFormulas,
    homeworkId: 'hw-lin',
  },
  {
    id: 'l-02',
    module: 2,
    title: { en: 'Systems of Equations', uz: 'Tenglamalar sistemasi', ru: 'Системы уравнений' },
    summary: {
      en: 'Substitution vs. elimination, and the shortcut for finding a target expression without solving for every variable.',
      uz: 'O‘rniga qo‘yish va qo‘shish usullari hamda har bir o‘zgaruvchini topmasdan kerakli ifodani topish hiylasi.',
      ru: 'Подстановка против сложения и приём, как найти нужное выражение, не вычисляя каждую переменную.',
    },
    domain: 'algebra',
    youtubeId: 'ttcAQceD9jQ',
    channel: 'Gradeful SAT Test Prep',
    durationMin: 9,
    xp: 100,
    chapters: [
      { t: 0, title: { en: 'What a solution means', uz: 'Yechim nima degani', ru: 'Что такое решение' } },
      { t: 95, title: { en: 'Substitution', uz: 'O‘rniga qo‘yish', ru: 'Подстановка' } },
      { t: 230, title: { en: 'Elimination', uz: 'Qo‘shish usuli', ru: 'Метод сложения' } },
      { t: 400, title: { en: 'Target-expression shortcut', uz: 'Ifodani to‘g‘ridan-to‘g‘ri topish', ru: 'Сразу к нужному выражению' } },
    ],
    resources: [sheet('r1', { en: 'Systems: 3 methods compared', uz: 'Sistemalar: 3 usul taqqoslash', ru: 'Системы: сравнение 3 методов' }, '4 KB', LINEAR_SHEET), cbMath],
    formulas: linearFormulas,
    homeworkId: 'hw-lin',
  },
  {
    id: 'l-03',
    module: 3,
    title: { en: 'Advanced Heart of Algebra', uz: 'Algebra: murakkab daraja', ru: 'Алгебра: продвинутый уровень' },
    summary: {
      en: 'Hard linear inequalities, systems with no or infinitely many solutions, and the word-problem tricks that separate 700 from 800.',
      uz: 'Qiyin chiziqli tengsizliklar, yechimi yo‘q yoki cheksiz ko‘p sistemalar va 700 ni 800 dan ajratadigan masala hiylalari.',
      ru: 'Сложные неравенства, системы без решений или с бесконечным числом решений и приёмы в текстовых задачах, отделяющие 700 от 800.',
    },
    domain: 'algebra',
    youtubeId: 'cs3pt-AN3ps',
    channel: 'Marcus Maths',
    durationMin: 14,
    xp: 150,
    chapters: [
      { t: 0, title: { en: 'Warm-up', uz: 'Kirish', ru: 'Разминка' } },
      { t: 135, title: { en: 'Linear inequalities', uz: 'Chiziqli tengsizliklar', ru: 'Линейные неравенства' } },
      { t: 330, title: { en: 'No / infinite solutions', uz: 'Yechim yo‘q / cheksiz', ru: 'Нет решений / бесконечно много' } },
      { t: 520, title: { en: 'Word problem tricks', uz: 'Matnli masala hiylalari', ru: 'Приёмы в текстовых задачах' } },
      { t: 760, title: { en: 'Recap', uz: 'Xulosa', ru: 'Итоги' } },
    ],
    resources: [
      sheet('r1', { en: 'Inequalities cheat sheet', uz: 'Tengsizliklar — qisqa qo‘llanma', ru: 'Шпаргалка: неравенства' }, '4 KB', LINEAR_SHEET),
      sheet('r2', { en: 'Hard algebra drill (worksheet)', uz: 'Qiyin algebra mashqlari', ru: 'Сложная алгебра: рабочий лист' }, '3 KB', LINEAR_SHEET, 'sheet'),
      cbMath,
    ],
    formulas: linearFormulas,
    homeworkId: 'hw-sys',
  },
  {
    id: 'l-04',
    module: 4,
    title: { en: 'Quadratics Deep Dive', uz: 'Kvadrat tenglamalar chuqur', ru: 'Квадратные уравнения: глубже' },
    summary: {
      en: 'Discriminant, Vieta’s formulas and vertex form — the core of Advanced Math, with fast solving techniques.',
      uz: 'Diskriminant, Viyet teoremasi va cho‘qqi shakli — Advanced Math yadrosi, tez yechish usullari bilan.',
      ru: 'Дискриминант, теорема Виета и вершинная форма — ядро Advanced Math с быстрыми приёмами решения.',
    },
    domain: 'advanced_math',
    youtubeId: 'YVTD7JfwwNY',
    channel: 'Tutorllini Test Prep',
    durationMin: 18,
    xp: 150,
    chapters: [
      { t: 0, title: { en: 'Three forms of a quadratic', uz: 'Uch xil ko‘rinish', ru: 'Три формы квадратичной функции' } },
      { t: 120, title: { en: 'Factoring fast', uz: 'Tez ko‘paytuvchilarga ajratish', ru: 'Быстрое разложение' } },
      { t: 360, title: { en: 'The discriminant', uz: 'Diskriminant', ru: 'Дискриминант' } },
      { t: 600, title: { en: 'Sum & product of roots', uz: 'Ildizlar yig‘indisi va ko‘paytmasi', ru: 'Сумма и произведение корней' } },
      { t: 860, title: { en: 'Vertex form', uz: 'Cho‘qqi shakli', ru: 'Вершинная форма' } },
    ],
    resources: [sheet('r1', { en: 'Quadratics formula sheet', uz: 'Kvadrat funksiyalar formulalari', ru: 'Формулы квадратичных функций' }, '3 KB', QUAD_SHEET), cbMath],
    formulas: quadraticFormulas,
    homeworkId: 'hw-quad',
  },
  {
    id: 'l-05',
    module: 5,
    title: { en: 'Words in Context', uz: 'Words in Context', ru: 'Words in Context' },
    summary: {
      en: 'Predict the word before you look at the choices, read the clue words, and dodge the "fancy word" trap.',
      uz: 'Variantlarga qarashdan oldin so‘zni taxmin qiling, kalit so‘zlarni o‘qing va "chiroyli so‘z" tuzog‘idan qoching.',
      ru: 'Угадайте слово до просмотра вариантов, найдите слова-подсказки и обходите ловушку «красивого слова».',
    },
    domain: 'craft_structure',
    youtubeId: 'dFQaoOGYhTk',
    channel: 'Ivy League Mentors',
    durationMin: 11,
    xp: 120,
    chapters: [
      { t: 0, title: { en: 'How the question works', uz: 'Savol qanday tuzilgan', ru: 'Как устроен вопрос' } },
      { t: 90, title: { en: 'Predict before you peek', uz: 'Avval o‘zingiz taxmin qiling', ru: 'Сначала угадай сам' } },
      { t: 300, title: { en: 'Contrast & continuation clues', uz: 'Zidlik va davomiylik belgilari', ru: 'Подсказки контраста и продолжения' } },
      { t: 520, title: { en: 'Trap answers', uz: 'Tuzoq javoblar', ru: 'Ловушки' } },
    ],
    resources: [sheet('r1', { en: 'Words in Context playbook', uz: 'Words in Context qo‘llanmasi', ru: 'Words in Context: памятка' }, '2 KB', RW_SHEET), cbRw],
    formulas: contextClues,
    homeworkId: 'hw-wic',
  },
  {
    id: 'l-06',
    module: 6,
    title: { en: 'Transitions & Logic', uz: 'Bog‘lovchilar va mantiq', ru: 'Связки и логика' },
    summary: {
      en: 'However, therefore, moreover… Name the relationship between two sentences first, then choose the transition.',
      uz: 'However, therefore, moreover… Avval ikki gap orasidagi munosabatni aniqlang, keyin bog‘lovchini tanlang.',
      ru: 'However, therefore, moreover… Сначала определите связь между предложениями, затем выбирайте связку.',
    },
    domain: 'expression_ideas',
    youtubeId: 'kz_P_b3H0oA',
    channel: 'Ivy League Mentors',
    durationMin: 10,
    xp: 120,
    chapters: [
      { t: 0, title: { en: 'Why transitions matter', uz: 'Bog‘lovchilar nega muhim', ru: 'Зачем нужны связки' } },
      { t: 80, title: { en: 'Four relationship types', uz: 'To‘rt xil munosabat', ru: 'Четыре типа связи' } },
      { t: 270, title: { en: 'Contrast vs. concession', uz: 'Zidlik va yon berish', ru: 'Контраст и уступка' } },
      { t: 450, title: { en: 'Practice round', uz: 'Mashq', ru: 'Практика' } },
    ],
    resources: [sheet('r1', { en: 'Transitions map', uz: 'Bog‘lovchilar xaritasi', ru: 'Карта связок' }, '2 KB', TRANSITION_SHEET), cbRw],
    formulas: transitionMap,
    homeworkId: 'hw-trans',
  },
]

export const getLesson = (id: string) => lessons.find((l) => l.id === id)
