import { useState } from 'react'
import { Award, BookOpen, CalendarCheck, CircleCheck, ClipboardCheck, Lock, LogOut, Moon, RotateCcw, Save, Settings, Sun, Target, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LANGS, useLangStore, useT } from '@/i18n'
import { levelTitle } from '@/lib/levels'
import type { Subject } from '@/types'
import { PageHeader } from '@/components/common/PageHeader'
import { Avatar } from '@/components/common/Avatar'
import { ProgressRing } from '@/components/common/ProgressRing'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useAppStore, useLevel } from '@/store/useAppStore'
import { useAttendance } from '@/hooks/useAttendance'
import { lessons } from '@/data/lessons'
import { badges } from '@/data/badges'
import { getLevelInfo, xpAtLevel } from '@/lib/levels'
import { attendanceRate } from '@/lib/streak'
import { formatDate, toDateKey } from '@/lib/date'
import { cn, formatNumber } from '@/lib/utils'

export default function ProfilePage() {
  const { t } = useT()
  const user = useAppStore((s) => s.user)
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const hwProgress = useAppStore((s) => s.homeworkProgress)
  const attendance = useAttendance()
  const unlocked = useAppStore((s) => s.unlockedBadges)
  const level = useLevel()

  const lessonsDone = lessons.filter((l) => lessonProgress[l.id]?.completed).length
  const doneHw = Object.values(hwProgress).filter((h) => h.status === 'done')
  const avgScore = doneHw.length ? doneHw.reduce((s, h) => s + (h.score ?? 0), 0) / doneHw.length : 0

  const stats = [
    { icon: BookOpen, label: t('profile.stat.lessons'), value: `${lessonsDone}/${lessons.length}` },
    { icon: ClipboardCheck, label: t('profile.stat.homework'), value: String(doneHw.length) },
    { icon: Target, label: t('profile.stat.avg'), value: doneHw.length ? `${Math.round(avgScore * 100)}%` : '—' },
    { icon: CalendarCheck, label: t('profile.stat.attendance'), value: attendance.length ? `${Math.round(attendanceRate(attendance) * 100)}%` : '—' },
    { icon: Award, label: t('profile.stat.badges'), value: `${Object.keys(unlocked).length}/${badges.length}` },
    { icon: Zap, label: t('profile.stat.xp'), value: formatNumber(level.totalXp) },
  ]

  return (
    <>
      <PageHeader title={t('nav.profile')} />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card>
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <Avatar name={user.name} seed={user.avatarSeed} className="size-16 rounded-xl text-xl" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted">
                  {t('level.n', { n: level.level })} · {levelTitle(level.tier)} · {t('profile.memberSince', { date: formatDate(user.joinedAt) })}
                </p>
                <p className="mt-1 text-sm">
                  {t('profile.goal')} <span className="font-semibold">{user.targetScore}</span>{' '}
                  <span className="text-muted">{t('profile.goalRest', { now: user.currentScore, need: Math.max(0, user.targetScore - user.currentScore) })}</span>
                </p>
              </div>
              <ProgressRing value={level.progress} size={84} stroke={7} label={t('level.progressAria')}>
                <div>
                  <div className="text-lg font-semibold tabular-nums">{Math.round(level.progress * 100)}%</div>
                  <div className="text-xs text-muted">{t('level.n', { n: level.level + 1 })}</div>
                </div>
              </ProgressRing>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <Card key={s.label} className="p-4">
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <s.icon className="size-4" /> {s.label}
                </div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</div>
              </Card>
            ))}
          </div>

          <LevelHistory />
        </div>

        <SettingsCard />
      </div>
    </>
  )
}

function LevelHistory() {
  const { t } = useT()
  const level = useLevel()
  const levels = Array.from({ length: level.level + 3 }, (_, i) => i + 1)
  return (
    <Card>
      <CardHeader>
        <CardTitle><Award /> {t('profile.history')}</CardTitle>
      </CardHeader>
      <ol className="relative ml-3 border-l border-border">
        {levels.map((l) => {
          const reached = l <= level.level
          const current = l === level.level
          const info = getLevelInfo(xpAtLevel(l))
          return (
            <li key={l} className="relative mb-4 pl-6 last:mb-0">
              <span
                className={cn(
                  'absolute -left-3 top-0.5 grid size-6 place-items-center rounded-full text-xs font-semibold',
                  current ? 'bg-primary text-white' : reached ? 'bg-mint-500/15 text-mint-500' : 'bg-surface text-subtle ring-1 ring-border',
                )}
              >
                {reached && !current ? <CircleCheck className="size-3.5" /> : !reached ? <Lock className="size-3" /> : l}
              </span>
              <div className={cn('flex flex-wrap items-baseline justify-between gap-2', !reached && 'text-subtle')}>
                <span className="text-sm font-medium">
                  {t('level.n', { n: l })} · {levelTitle(info.tier)}
                  {current && <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-xs font-medium text-primary-text">{t('profile.current')}</span>}
                </span>
                <span className="text-xs tabular-nums text-muted">{formatNumber(xpAtLevel(l))} XP</span>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function SettingsCard() {
  const { t, lang } = useT()
  const setLang = useLangStore((s) => s.setLang)
  const logout = useAppStore((s) => s.logout)
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const updateUser = useAppStore((s) => s.updateUser)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const reset = useAppStore((s) => s.resetProgress)

  const [name, setName] = useState(user.name)
  const [target, setTarget] = useState(user.targetScore)
  const [testDate, setTestDate] = useState(user.testDate.slice(0, 10))
  const [focus, setFocus] = useState<Subject>(user.focus)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const save = () => {
    updateUser({ name: name.trim() || user.name, targetScore: target, testDate: `${testDate}T08:00:00`, focus })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle><Settings /> {t('profile.settings')}</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-4">
        <Field label={t('profile.name')}>
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </Field>
        <Field label={t('profile.target', { n: target })}>
          <input type="range" min={1000} max={1600} step={10} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full accent-[var(--primary)]" aria-label={t('profile.targetAria')} />
        </Field>
        <Field label={t('profile.examDate')}>
          <DatePicker value={testDate} onChange={setTestDate} min={toDateKey(new Date())} />
        </Field>
        <Field label={t('profile.focus')}>
          <div className="grid grid-cols-3 gap-2">
            {(['math', 'reading', 'writing'] as Subject[]).map((s) => (
              <button
                key={s}
                onClick={() => setFocus(s)}
                className={cn('h-9 cursor-pointer rounded-lg border text-sm font-medium transition-colors', focus === s ? 'border-primary bg-primary-soft text-primary-text' : 'border-border hover:bg-surface-sunken')}
                aria-pressed={focus === s}
              >
                {t(`subject.${s}`)}
              </button>
            ))}
          </div>
        </Field>
        <Field label={t('lang.label')}>
          <div className="grid grid-cols-3 gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                lang={l.code}
                onClick={() => setLang(l.code)}
                className={cn('h-9 cursor-pointer rounded-lg border text-sm font-medium transition-colors', lang === l.code ? 'border-primary bg-primary-soft text-primary-text' : 'border-border hover:bg-surface-sunken')}
                aria-pressed={lang === l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label={t('profile.theme')}>
          <div className="grid grid-cols-2 gap-2">
            {(['dark', 'light'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={cn('flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors', theme === th ? 'border-primary bg-primary-soft text-primary-text' : 'border-border hover:bg-surface-sunken')}
                aria-pressed={theme === th}
              >
                {th === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />} {th === 'dark' ? t('theme.dark') : t('theme.light')}
              </button>
            ))}
          </div>
        </Field>
        <Button onClick={save} variant={saved ? 'success' : 'default'}>
          {saved ? <><CircleCheck /> {t('action.saved')}</> : <><Save /> {t('action.save')}</>}
        </Button>
        <Button variant="ghost" className="text-danger-500 hover:text-danger-500" onClick={() => setConfirmReset(true)}>
          <RotateCcw /> {t('profile.reset')}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            logout()
            navigate('/welcome', { replace: true })
          }}
        >
          <LogOut /> {t('account.logout')}
        </Button>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-sm">
          <DialogTitle>{t('profile.resetQ')}</DialogTitle>
          <DialogDescription className="mt-2">
            {t('profile.resetBody')}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>{t('action.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => {
                reset()
                setConfirmReset(false)
              }}
            >
              {t('profile.resetYes')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5" role="group" aria-label={label}>
      <span className="text-xs font-semibold text-muted">{label}</span>
      {children}
    </div>
  )
}
