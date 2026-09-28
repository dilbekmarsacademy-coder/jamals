import type { AppNotification } from '@/types'

/** Text is rendered at display time from `kind` (see lib/notifications.ts) */
export const seedNotifications: Omit<AppNotification, 'createdAt'>[] = [{ id: 'n-welcome', kind: 'info', read: false, href: '/' }]
