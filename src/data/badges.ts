import type { BadgeDefinition } from '@/types'

/** `icon` is a lucide-react icon name resolved in <BadgeIcon />. Unlock rules live in lib/badges.ts */
export const badges: BadgeDefinition[] = [
  {
    id: 'first-orbit', icon: 'Rocket', tier: 'bronze',
    name: { uz: 'Birinchi dars', ru: 'Первый урок', en: 'First lesson' },
    description: { uz: 'Birinchi darsni to‘liq ko‘rdingiz', ru: 'Вы полностью посмотрели первый урок', en: 'You finished your first lesson' },
    hint: { uz: '1 ta darsni oxirigacha ko‘ring', ru: 'Досмотрите 1 урок до конца', en: 'Watch 1 lesson to the end' },
  },
  {
    id: 'lesson-5', icon: 'Route', tier: 'silver',
    name: { uz: '5 ta dars', ru: '5 уроков', en: '5 lessons' },
    description: { uz: '5 ta dars tugallandi', ru: 'Пройдено 5 уроков', en: '5 lessons completed' },
    hint: { uz: '5 ta darsni tugating', ru: 'Пройдите 5 уроков', en: 'Complete 5 lessons' },
  },
  {
    id: 'lesson-all', icon: 'Map', tier: 'cosmic',
    name: { uz: 'Kurs yakunlandi', ru: 'Курс пройден', en: 'Course complete' },
    description: { uz: 'Barcha darslar tugallandi', ru: 'Пройдены все уроки', en: 'All lessons completed' },
    hint: { uz: 'Barcha darslarni tugating', ru: 'Пройдите все уроки', en: 'Complete every lesson' },
  },
  {
    id: 'hw-3', icon: 'ClipboardCheck', tier: 'bronze',
    name: { uz: '3 ta vazifa', ru: '3 задания', en: '3 assignments' },
    description: { uz: '3 ta uy vazifasi bajarildi', ru: 'Выполнено 3 домашних задания', en: '3 assignments completed' },
    hint: { uz: '3 ta uy vazifasini bajaring', ru: 'Выполните 3 домашних задания', en: 'Complete 3 assignments' },
  },
  {
    id: 'hw-10', icon: 'Medal', tier: 'gold',
    name: { uz: '10 ta vazifa', ru: '10 заданий', en: '10 assignments' },
    description: { uz: '10 ta uy vazifasi bajarildi', ru: 'Выполнено 10 домашних заданий', en: '10 assignments completed' },
    hint: { uz: '10 ta uy vazifasini bajaring', ru: 'Выполните 10 домашних заданий', en: 'Complete 10 assignments' },
  },
  {
    id: 'perfect', icon: 'Target', tier: 'silver',
    name: { uz: '100% natija', ru: '100% результат', en: 'Perfect score' },
    description: { uz: 'Vazifada barcha javoblar to‘g‘ri', ru: 'Все ответы в задании верные', en: 'Every answer in an assignment correct' },
    hint: { uz: 'Biror vazifada barcha javoblarni to‘g‘ri toping', ru: 'Ответьте верно на все вопросы задания', en: 'Get every question right in one assignment' },
  },
  {
    id: 'streak-3', icon: 'Flame', tier: 'bronze',
    name: { uz: '3 kunlik seriya', ru: 'Серия 3 дня', en: '3-day streak' },
    description: { uz: '3 kun ketma-ket shug‘ullandingiz', ru: 'Вы занимались 3 дня подряд', en: 'You studied 3 days in a row' },
    hint: { uz: '3 kun ketma-ket shug‘ullaning', ru: 'Занимайтесь 3 дня подряд', en: 'Study 3 days in a row' },
  },
  {
    id: 'streak-7', icon: 'Flame', tier: 'silver',
    name: { uz: '7 kunlik seriya', ru: 'Серия 7 дней', en: '7-day streak' },
    description: { uz: '7 kun ketma-ket shug‘ullandingiz', ru: 'Вы занимались 7 дней подряд', en: 'You studied 7 days in a row' },
    hint: { uz: '7 kun ketma-ket shug‘ullaning', ru: 'Занимайтесь 7 дней подряд', en: 'Study 7 days in a row' },
  },
  {
    id: 'streak-30', icon: 'Sun', tier: 'cosmic',
    name: { uz: '30 kunlik seriya', ru: 'Серия 30 дней', en: '30-day streak' },
    description: { uz: '30 kun ketma-ket shug‘ullandingiz', ru: 'Вы занимались 30 дней подряд', en: 'You studied 30 days in a row' },
    hint: { uz: '30 kun ketma-ket shug‘ullaning', ru: 'Занимайтесь 30 дней подряд', en: 'Study 30 days in a row' },
  },
  {
    id: 'xp-1000', icon: 'Zap', tier: 'bronze',
    name: { uz: '1 000 XP', ru: '1 000 XP', en: '1,000 XP' },
    description: { uz: '1 000 XP to‘plandi', ru: 'Набрано 1 000 XP', en: 'Earned 1,000 XP' },
    hint: { uz: '1 000 XP to‘plang', ru: 'Наберите 1 000 XP', en: 'Earn 1,000 XP' },
  },
  {
    id: 'xp-5000', icon: 'Sparkles', tier: 'gold',
    name: { uz: '5 000 XP', ru: '5 000 XP', en: '5,000 XP' },
    description: { uz: '5 000 XP to‘plandi', ru: 'Набрано 5 000 XP', en: 'Earned 5,000 XP' },
    hint: { uz: '5 000 XP to‘plang', ru: 'Наберите 5 000 XP', en: 'Earn 5,000 XP' },
  },
  {
    id: 'math-master', icon: 'Calculator', tier: 'gold',
    name: { uz: 'Math bo‘limi', ru: 'Раздел Math', en: 'Math section' },
    description: { uz: 'Barcha Math darslari tugallandi', ru: 'Пройдены все уроки Math', en: 'All Math lessons completed' },
    hint: { uz: 'Barcha Math darslarini tugating', ru: 'Пройдите все уроки Math', en: 'Complete every Math lesson' },
  },
  {
    id: 'wordsmith', icon: 'Feather', tier: 'gold',
    name: { uz: 'Reading & Writing', ru: 'Reading & Writing', en: 'Reading & Writing' },
    description: { uz: 'Barcha Reading va Writing darslari tugallandi', ru: 'Пройдены все уроки Reading и Writing', en: 'All Reading and Writing lessons completed' },
    hint: { uz: 'Barcha Reading/Writing darslarini tugating', ru: 'Пройдите все уроки Reading/Writing', en: 'Complete every Reading/Writing lesson' },
  },
  {
    id: 'attendance-90', icon: 'CalendarCheck', tier: 'silver',
    name: { uz: '90% davomat', ru: '90% посещаемости', en: '90% attendance' },
    description: { uz: 'Davomat 90% dan yuqori', ru: 'Посещаемость выше 90%', en: 'Attendance above 90%' },
    hint: { uz: 'Kamida 10 dars kunida davomatni 90% ga yetkazing', ru: 'Держите посещаемость 90% минимум 10 учебных дней', en: 'Reach 90% attendance over at least 10 class days' },
  },
  {
    id: 'early-bird', icon: 'Sunrise', tier: 'bronze',
    name: { uz: 'Erta mashg‘ulot', ru: 'Ранняя тренировка', en: 'Early session' },
    description: { uz: 'Soat 9:00 dan oldin dars tugatdingiz', ru: 'Вы прошли урок до 9:00', en: 'You finished a lesson before 9:00' },
    hint: { uz: 'Ertalab 9:00 dan oldin dars tugating', ru: 'Пройдите урок до 9:00 утра', en: 'Finish a lesson before 9:00 am' },
  },
  {
    id: 'night-owl', icon: 'Moon', tier: 'bronze',
    name: { uz: 'Kechki mashg‘ulot', ru: 'Вечерняя тренировка', en: 'Late session' },
    description: { uz: 'Soat 22:00 dan keyin dars tugatdingiz', ru: 'Вы прошли урок после 22:00', en: 'You finished a lesson after 10 pm' },
    hint: { uz: 'Kechki 22:00 dan keyin dars tugating', ru: 'Пройдите урок после 22:00', en: 'Finish a lesson after 10 pm' },
  },
]
