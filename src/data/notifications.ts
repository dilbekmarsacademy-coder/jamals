import type { AppNotification } from '@/types'

export const seedNotifications: Omit<AppNotification, 'createdAt'>[] = [
  {
    id: 'n-welcome',
    kind: 'info',
    title: 'Jamals’ga xush kelibsiz',
    body: 'Bugungi darsdan boshlang. Tugallangan har bir dars va vazifa uchun XP beriladi.',
    read: false,
    href: '/',
  },
]
