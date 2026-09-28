import type { Lesson } from '@/types'

const CB_MATH = 'https://satsuite.collegeboard.org/sat/whats-on-the-test/math'
const CB_RW = 'https://satsuite.collegeboard.org/sat/whats-on-the-test/reading-writing'
const CB_PRACTICE = 'https://satsuite.collegeboard.org/practice/practice-tests'

/** All YouTube IDs verified via YouTube oEmbed (public, embeddable SAT lessons). */
export const lessons: Lesson[] = [
  {
    id: 'l-01',
    order: 1,
    title: 'Chiziqli tenglamalar: asoslar',
    subject: 'math',
    topic: 'Algebra · Linear equations',
    description:
      "Bir o'zgaruvchili chiziqli tenglamalarni bosqichma-bosqich yechish. SAT'dagi eng ko'p uchraydigan savol turi — tez va xatosiz yechishni o'rganamiz.",
    youtubeId: 'EkBUTZe_SiM',
    durationMin: 4,
    xpReward: 60,
    channel: 'Khan Academy',
    homeworkId: 'hw-01',
    materials: [
      { id: 'm1', title: 'Chiziqli tenglamalar — konspekt', type: 'pdf', url: '#', size: '420 KB' },
      { id: 'm2', title: '10 ta mashq savoli', type: 'worksheet', url: '#', size: '180 KB' },
      { id: 'm3', title: 'College Board: Math bo‘limi tavsifi', type: 'link', url: CB_MATH },
    ],
  },
  {
    id: 'l-02',
    order: 2,
    title: 'Tenglamalar sistemasi',
    subject: 'math',
    topic: 'Algebra · Systems of equations',
    description:
      "Ikki noma'lumli sistemalarni o'rniga qo'yish va qo'shish usuli bilan yechish, hamda to'g'ridan-to'g'ri ifodani topish hiylasi.",
    youtubeId: 'ttcAQceD9jQ',
    durationMin: 9,
    xpReward: 80,
    channel: 'Gradeful SAT Test Prep',
    homeworkId: 'hw-02',
    materials: [
      { id: 'm1', title: 'Sistemalar: 3 usul taqqoslash', type: 'pdf', url: '#', size: '610 KB' },
      { id: 'm2', title: 'Rasmiy amaliy testlar', type: 'link', url: CB_PRACTICE },
    ],
  },
  {
    id: 'l-03',
    order: 3,
    title: 'Chiziqli tengsizliklar (murakkab)',
    subject: 'math',
    topic: 'Algebra · Inequalities',
    description:
      "Qiyin darajadagi chiziqli tenglama va tengsizlik savollari tahlili. 790 ball olgan ustoz yondashuvi.",
    youtubeId: 'cs3pt-AN3ps',
    durationMin: 14,
    xpReward: 100,
    channel: 'Marcus Maths',
    homeworkId: 'hw-03',
    materials: [
      { id: 'm1', title: 'Tengsizliklar — cheat sheet', type: 'pdf', url: '#', size: '290 KB' },
      { id: 'm2', title: 'Qiyin savollar to‘plami', type: 'worksheet', url: '#', size: '350 KB' },
    ],
  },
  {
    id: 'l-04',
    order: 4,
    title: 'Kvadrat tenglamalar',
    subject: 'math',
    topic: 'Advanced Math · Quadratics',
    description:
      "Diskriminant, Vieta teoremasi, parabola uchi — Advanced Math bo'limining yuragi. Tezkor yechish usullari bilan.",
    youtubeId: 'YVTD7JfwwNY',
    durationMin: 18,
    xpReward: 110,
    channel: 'Tutorllini Test Prep',
    homeworkId: 'hw-04',
    materials: [
      { id: 'm1', title: 'Kvadrat funksiyalar formulalari', type: 'pdf', url: '#', size: '380 KB' },
      { id: 'm2', title: 'Desmos bilan ishlash qo‘llanmasi', type: 'link', url: 'https://www.desmos.com/calculator' },
    ],
  },
  {
    id: 'l-05',
    order: 5,
    title: 'Aylanalar: hammasi bir joyda',
    subject: 'math',
    topic: 'Geometry · Circles',
    description:
      "Aylana tenglamasi, yoy uzunligi, sektor yuzi va radianlar. Geometriya savollarining eng ko'p tushadigan qismi.",
    youtubeId: '3jXycxnFHaA',
    durationMin: 12,
    xpReward: 90,
    channel: 'Kara Tutoring',
    homeworkId: 'hw-05',
    materials: [
      { id: 'm1', title: 'Aylana formulalari kartochkasi', type: 'pdf', url: '#', size: '210 KB' },
    ],
  },
  {
    id: 'l-06',
    order: 6,
    title: 'Geometriya va trigonometriya',
    subject: 'math',
    topic: 'Geometry · Trigonometry',
    description:
      "Uchburchaklar, o'xshashlik, SOH-CAH-TOA va maxsus burchaklar — butun bo'lim bitta darsda.",
    youtubeId: 'wPnE8hqMhSk',
    durationMin: 25,
    xpReward: 130,
    channel: 'The SAT Gamified',
    homeworkId: 'hw-06',
    materials: [
      { id: 'm1', title: 'Trigonometriya jadvali', type: 'pdf', url: '#', size: '160 KB' },
      { id: 'm2', title: 'College Board: Math bo‘limi', type: 'link', url: CB_MATH },
    ],
  },
  {
    id: 'l-07',
    order: 7,
    title: 'Asosiy g‘oyani topish',
    subject: 'reading',
    topic: 'Information & Ideas · Main idea',
    description:
      "Qisqa matndan markaziy g'oyani 30 soniyada ajratib olish strategiyasi va tipik tuzoq javoblar.",
    youtubeId: 'zDsP2bvyWZg',
    durationMin: 8,
    xpReward: 70,
    channel: 'Katya SAT',
    homeworkId: 'hw-07',
    materials: [
      { id: 'm1', title: 'Main idea: 5 qadamli algoritm', type: 'pdf', url: '#', size: '240 KB' },
      { id: 'm2', title: 'College Board: Reading & Writing', type: 'link', url: CB_RW },
    ],
  },
  {
    id: 'l-08',
    order: 8,
    title: 'Words in Context',
    subject: 'reading',
    topic: 'Craft & Structure · Vocabulary',
    description:
      "So'zning kontekstdagi ma'nosini aniqlash: o'z so'zing bilan to'ldir, keyin variantlarni solishtir.",
    youtubeId: 'dFQaoOGYhTk',
    durationMin: 11,
    xpReward: 80,
    channel: 'Ivy League Mentors',
    homeworkId: 'hw-08',
    materials: [
      { id: 'm1', title: 'SAT uchun 150 ta akademik so‘z', type: 'pdf', url: '#', size: '520 KB' },
    ],
  },
  {
    id: 'l-09',
    order: 9,
    title: 'Xulosa chiqarish (Inference)',
    subject: 'reading',
    topic: 'Information & Ideas · Inferences',
    description:
      "Matnda to'g'ridan-to'g'ri aytilmagan, ammo mantiqan kelib chiqadigan xulosani topish usullari.",
    youtubeId: 'ANkK_ecpZZY',
    durationMin: 13,
    xpReward: 90,
    channel: 'Ivy League Mentors',
    homeworkId: 'hw-09',
    materials: [
      { id: 'm1', title: 'Inference savollari — namuna tahlil', type: 'worksheet', url: '#', size: '300 KB' },
    ],
  },
  {
    id: 'l-10',
    order: 10,
    title: 'Tinish belgilari: 15 daqiqada',
    subject: 'writing',
    topic: 'Standard English Conventions · Punctuation',
    description:
      "Vergul, nuqtali vergul, ikki nuqta va tire — SAT'da so'raladigan barcha qoidalar qisqa va aniq.",
    youtubeId: 'WCHyeJKWD84',
    durationMin: 15,
    xpReward: 90,
    channel: 'The SAT Gamified',
    homeworkId: 'hw-10',
    materials: [
      { id: 'm1', title: 'Punktuatsiya qoidalari jadvali', type: 'pdf', url: '#', size: '200 KB' },
      { id: 'm2', title: 'College Board: Reading & Writing', type: 'link', url: CB_RW },
    ],
  },
  {
    id: 'l-11',
    order: 11,
    title: 'Grammatika qoidalari',
    subject: 'writing',
    topic: 'Standard English Conventions · Grammar',
    description:
      "Ega-kesim moslashuvi, zamonlar, olmoshlar va modifikatorlar — eng ko'p xato qilinadigan joylar.",
    youtubeId: 'yakLDhT3Wp0',
    durationMin: 12,
    xpReward: 90,
    channel: 'Michael Toohey',
    homeworkId: 'hw-11',
    materials: [
      { id: 'm1', title: 'Grammatika: 12 ta oltin qoida', type: 'pdf', url: '#', size: '330 KB' },
    ],
  },
  {
    id: 'l-12',
    order: 12,
    title: 'Transitions — bog‘lovchilar',
    subject: 'writing',
    topic: 'Expression of Ideas · Transitions',
    description:
      "However, therefore, moreover... Ikki gap orasidagi mantiqiy munosabatni aniqlab, to'g'ri bog'lovchini tanlash.",
    youtubeId: 'kz_P_b3H0oA',
    durationMin: 10,
    xpReward: 80,
    channel: 'Ivy League Mentors',
    homeworkId: 'hw-12',
    materials: [
      { id: 'm1', title: 'Bog‘lovchilar xaritasi', type: 'pdf', url: '#', size: '150 KB' },
    ],
  },
]
