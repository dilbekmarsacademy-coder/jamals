import { useState } from 'react'
import { Award, BookOpen, CalendarCheck, CircleCheck, ClipboardCheck, Lock, Moon, RotateCcw, Save, Settings, Sun, Target, Zap } from 'lucide-react'
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
import { SUBJECT_META } from '@/lib/homework'
import { cn, formatNumber } from '@/lib/utils'

export default function ProfilePage() {
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
    { icon: BookOpen, label: 'Tugallangan darslar', value: `${lessonsDone}/${lessons.length}` },
    { icon: ClipboardCheck, label: 'Bajarilgan vazifalar', value: String(doneHw.length) },
    { icon: Target, label: 'O‘rtacha natija', value: doneHw.length ? `${Math.round(avgScore * 100)}%` : '—' },
    { icon: CalendarCheck, label: 'Davomat', value: attendance.length ? `${Math.round(attendanceRate(attendance) * 100)}%` : '—' },
    { icon: Award, label: 'Yutuqlar', value: `${Object.keys(unlocked).length}/${badges.length}` },
    { icon: Zap, label: 'Jami XP', value: formatNumber(level.totalXp) },
  ]

  return (
    <>
      <PageHeader title="Profil" />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card>
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <Avatar name={user.name} seed={user.avatarSeed} className="size-16 rounded-xl text-xl" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted">
                  {level.level}-daraja · {level.title} · {formatDate(user.joinedAt)} dan beri a’zo
                </p>
                <p className="mt-1 text-sm">
                  Maqsad: <span className="font-semibold">{user.targetScore}</span>{' '}
                  <span className="text-muted">· hozir {user.currentScore} · yana {Math.max(0, user.targetScore - user.currentScore)} ball kerak</span>
                </p>
              </div>
              <ProgressRing value={level.progress} size={84} stroke={7} label="Daraja progressi">
                <div>
                  <div className="text-lg font-semibold tabular-nums">{Math.round(level.progress * 100)}%</div>
                  <div className="text-xs text-muted">{level.level + 1}-daraja</div>
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
  const level = useLevel()
  const levels = Array.from({ length: level.level + 3 }, (_, i) => i + 1)
  return (
    <Card>
      <CardHeader>
        <CardTitle><Award /> Daraja tarixi</CardTitle>
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
                  {l}-daraja · {info.title}
                  {current && <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-xs font-medium text-primary-text">Joriy</span>}
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
        <CardTitle><Settings /> Sozlamalar</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-4">
        <Field label="Ism">
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </Field>
        <Field label={`Maqsadli ball: ${target}`}>
          <input type="range" min={1000} max={1600} step={10} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full accent-[var(--primary)]" aria-label="Maqsadli ball" />
        </Field>
        <Field label="SAT imtihon sanasi">
          <DatePicker value={testDate} onChange={setTestDate} min={toDateKey(new Date())} />
        </Field>
        <Field label="Asosiy yo‘nalish">
          <div className="grid grid-cols-3 gap-2">
            {(['math', 'reading', 'writing'] as Subject[]).map((s) => (
              <button
                key={s}
                onClick={() => setFocus(s)}
                className={cn('h-9 cursor-pointer rounded-lg border text-sm font-medium transition-colors', focus === s ? 'border-primary bg-primary-soft text-primary-text' : 'border-border hover:bg-surface-sunken')}
                aria-pressed={focus === s}
              >
                {SUBJECT_META[s].label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Interfeys mavzusi">
          <div className="grid grid-cols-2 gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn('flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors', theme === t ? 'border-primary bg-primary-soft text-primary-text' : 'border-border hover:bg-surface-sunken')}
                aria-pressed={theme === t}
              >
                {t === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />} {t === 'dark' ? 'Qorong‘i' : 'Yorug‘'}
              </button>
            ))}
          </div>
        </Field>
        <Button onClick={save} variant={saved ? 'success' : 'default'}>
          {saved ? <><CircleCheck /> Saqlandi</> : <><Save /> Saqlash</>}
        </Button>
        <Button variant="ghost" className="text-danger-500 hover:text-danger-500" onClick={() => setConfirmReset(true)}>
          <RotateCcw /> Progressni tiklash
        </Button>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Progressni tiklash?</DialogTitle>
          <DialogDescription className="mt-2">
            XP, darslar, uy vazifalari va nishonlar demo holatiga qaytariladi. Bu amalni ortga qaytarib bo‘lmaydi.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>Bekor qilish</Button>
            <Button
              variant="danger"
              onClick={() => {
                reset()
                setConfirmReset(false)
              }}
            >
              Ha, tiklash
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
