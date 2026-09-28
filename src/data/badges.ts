import type { BadgeDefinition } from '@/types'

/** `icon` is a lucide-react icon name resolved in <BadgeIcon />. Unlock rules live in lib/badges.ts */
export const badges: BadgeDefinition[] = [
  { id: 'first-orbit', name: 'Birinchi dars', description: 'Birinchi darsni to‘liq ko‘rdingiz', icon: 'Rocket', tier: 'bronze', hint: '1 ta darsni oxirigacha ko‘ring' },
  { id: 'lesson-5', name: '5 ta dars', description: '5 ta dars tugallandi', icon: 'Route', tier: 'silver', hint: '5 ta darsni tugating' },
  { id: 'lesson-all', name: 'Kurs yakunlandi', description: 'Barcha darslar tugallandi', icon: 'Map', tier: 'cosmic', hint: 'Barcha darslarni tugating' },
  { id: 'hw-3', name: '3 ta vazifa', description: '3 ta uy vazifasi bajarildi', icon: 'ClipboardCheck', tier: 'bronze', hint: '3 ta uy vazifasini bajaring' },
  { id: 'hw-10', name: '10 ta vazifa', description: '10 ta uy vazifasi bajarildi', icon: 'Medal', tier: 'gold', hint: '10 ta uy vazifasini bajaring' },
  { id: 'perfect', name: '100% natija', description: 'Vazifada barcha javoblar to‘g‘ri', icon: 'Target', tier: 'silver', hint: 'Biror vazifada barcha javoblarni to‘g‘ri toping' },
  { id: 'streak-3', name: '3 kunlik seriya', description: '3 kun ketma-ket shug‘ullandingiz', icon: 'Flame', tier: 'bronze', hint: '3 kun ketma-ket shug‘ullaning' },
  { id: 'streak-7', name: '7 kunlik seriya', description: '7 kun ketma-ket shug‘ullandingiz', icon: 'Flame', tier: 'silver', hint: '7 kun ketma-ket shug‘ullaning' },
  { id: 'streak-30', name: '30 kunlik seriya', description: '30 kun ketma-ket shug‘ullandingiz', icon: 'Sun', tier: 'cosmic', hint: '30 kun ketma-ket shug‘ullaning' },
  { id: 'xp-1000', name: '1 000 XP', description: '1 000 XP to‘plandi', icon: 'Zap', tier: 'bronze', hint: '1 000 XP to‘plang' },
  { id: 'xp-5000', name: '5 000 XP', description: '5 000 XP to‘plandi', icon: 'Sparkles', tier: 'gold', hint: '5 000 XP to‘plang' },
  { id: 'math-master', name: 'Math bo‘limi', description: 'Barcha Math darslari tugallandi', icon: 'Calculator', tier: 'gold', hint: 'Barcha Math darslarini tugating' },
  { id: 'wordsmith', name: 'Reading & Writing', description: 'Barcha Reading va Writing darslari tugallandi', icon: 'Feather', tier: 'gold', hint: 'Barcha Reading/Writing darslarini tugating' },
  { id: 'attendance-90', name: '90% davomat', description: 'Davomat 90% dan yuqori', icon: 'CalendarCheck', tier: 'silver', hint: 'Davomatni 90% ga yetkazing' },
  { id: 'early-bird', name: 'Erta mashg‘ulot', description: 'Soat 9:00 dan oldin dars tugatdingiz', icon: 'Sunrise', tier: 'bronze', hint: 'Ertalab 9:00 dan oldin dars tugating' },
  { id: 'night-owl', name: 'Kechki mashg‘ulot', description: 'Soat 22:00 dan keyin dars tugatdingiz', icon: 'Moon', tier: 'bronze', hint: 'Kechki 22:00 dan keyin dars tugating' },
]
