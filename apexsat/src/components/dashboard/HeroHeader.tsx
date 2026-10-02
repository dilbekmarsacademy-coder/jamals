'use client'

import { Flame, Snowflake, CalendarClock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useLevel, useStreak } from '@/hooks/useDerived'
import { Avatar } from '@/components/common/Avatar'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Countdown } from '@/components/common/Countdown'
import { cn } from '@/lib/utils'

export function HeroHeader({ now }: { now: Date }) {
  const { t, tr, n, locale } = useT()
  const profile = useApex((s) => s.profile)
  const lvl = useLevel()
  const { streak, activeToday, freezes } = useStreak(now)
  const hour = now.getHours()
  const greeting = hour < 5 ? 'greet.night' : hour < 12 ? 'greet.morning' : hour < 18 ? 'greet.afternoon' : 'greet.evening'
  const testDate = new Date(profile.testDate)

  return (
    <section className="glass relative overflow-hidden rounded-3xl p-5 sm:p-6">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_100%_at_100%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1.3fr_auto_auto] lg:items-center">
        {/* Profile + level */}
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} hue={profile.avatarHue} className="size-14 text-base" ring />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">{t(greeting)}</p>
            <h1 className="truncate text-2xl font-extrabold sm:text-[28px]">{profile.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="rounded-md bg-brand-gradient px-1.5 py-0.5 font-extrabold text-white">{t('level.short', { level: lvl.level })}</span>
              <span className="font-semibold text-fg-strong">{tr(lvl.title)}</span>
            </div>
            <div className="mt-2 flex max-w-sm items-center gap-3">
              <ProgressBar value={lvl.progress} height="h-2" label={t('level.progress')} />
              <span className="shrink-0 text-xs tnum text-muted">
                {n(lvl.into)} / {n(lvl.need)} XP
              </span>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2/50 px-4 py-3">
          <motion.div
            animate={activeToday ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity }}
            className={cn('grid size-12 place-items-center rounded-xl', activeToday ? 'bg-orange/15' : 'bg-surface-3/60')}
          >
            <Flame className={cn('size-7', activeToday ? 'fill-orange/50 text-orange' : 'text-orange/70')} />
          </motion.div>
          <div>
            <p className="font-display text-xl font-extrabold tnum text-fg-strong">{t('streak.days', { count: streak })}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <Snowflake className="size-3.5 text-cyan-fg" />
              {t('streak.freezes', { count: freezes })}
            </p>
            {!activeToday && streak > 0 && <p className="mt-0.5 text-[11px] font-semibold text-orange-fg">{t('streak.keepAlive')}</p>}
          </div>
        </div>

        {/* SAT countdown */}
        <div className="rounded-2xl border border-line bg-surface-2/50 px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
            <CalendarClock className="size-3.5 text-violet-fg" />
            {t('countdown.title', { date: testDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) })}
          </p>
          <Countdown target={testDate} />
        </div>
      </div>
    </section>
  )
}
