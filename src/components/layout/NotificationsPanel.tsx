import { AnimatePresence, motion } from 'framer-motion'
import { Award, Bell, CheckCheck, Clock, Flame, Info, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { NotificationKind } from '@/types'
import { timeAgo } from '@/lib/date'
import { renderNotification } from '@/lib/notifications'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const KIND: Record<NotificationKind, { icon: typeof Bell; className: string }> = {
  badge: { icon: Award, className: 'bg-pulsar-500/15 text-pulsar-500' },
  deadline: { icon: Clock, className: 'bg-danger-500/15 text-danger-400' },
  streak: { icon: Flame, className: 'bg-ember-500/15 text-ember-500' },
  level: { icon: Star, className: 'bg-flare-500/15 text-flare-500' },
  info: { icon: Info, className: 'bg-nova-500/15 text-nova-400' },
}

export function NotificationsBell({ align = 'right' }: { align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const notifications = useAppStore((s) => s.notifications)
  const markRead = useAppStore((s) => s.markNotificationRead)
  const markAll = useAppStore((s) => s.markAllNotificationsRead)
  const navigate = useNavigate()
  const { t } = useT()
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label={t('notif.title')} className="relative">
        <Bell className="!size-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'surface-raised fixed inset-x-3 top-16 z-50 overflow-hidden rounded-lg shadow-2xl sm:absolute sm:inset-x-auto sm:top-12 sm:w-96',
              align === 'right' ? 'sm:right-0' : 'sm:left-0',
            )}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="font-semibold">{t('notif.title')}</span>
              {unread > 0 && (
                <button onClick={markAll} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-nova-400 hover:underline">
                  <CheckCheck className="size-3.5" /> {t('notif.markAll')}
                </button>
              )}
            </div>
            <div className="max-h-[60dvh] overflow-y-auto scrollbar-thin">
              {notifications.length === 0 && <p className="p-6 text-center text-sm text-muted">{t('notif.empty')}</p>}
              {notifications.map((n) => {
                const k = KIND[n.kind]
                const Icon = k.icon
                const text = renderNotification(n)
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      markRead(n.id)
                      setOpen(false)
                      if (n.href) navigate(n.href)
                    }}
                    className={cn(
                      'flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition hover:bg-surface-sunken',
                      !n.read && 'bg-primary-soft',
                    )}
                  >
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', k.className)} aria-hidden>
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {text.title}
                        {!n.read && <span className="size-1.5 rounded-full bg-ember-500" />}
                      </span>
                      <span className="line-clamp-2 text-xs text-muted">{text.body}</span>
                      <span className="mt-0.5 block text-xs text-subtle">{timeAgo(n.createdAt)}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
