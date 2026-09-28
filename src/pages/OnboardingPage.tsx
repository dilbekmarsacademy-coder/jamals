import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Calculator, CircleCheck, ClipboardCheck, PenLine, PlayCircle, UserPlus } from 'lucide-react'
import type { Subject } from '@/types'
import { Logo } from '@/components/brand/Logo'
import { Avatar } from '@/components/common/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { toDateKey } from '@/lib/date'
import { getLevelInfo } from '@/lib/levels'
import { cn, formatNumber } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { useT, type TKey } from '@/i18n'

const STEPS: TKey[] = ['ob.steps.login', 'ob.steps.profile', 'ob.steps.goal', 'ob.steps.focus']

const FEATURES = [
  { icon: PlayCircle, title: 'ob.f1.title', text: 'ob.f1.text' },
  { icon: ClipboardCheck, title: 'ob.f2.title', text: 'ob.f2.text' },
  { icon: BarChart3, title: 'ob.f3.title', text: 'ob.f3.text' },
] as const

/**
 * UI-only sign-in + onboarding. No authentication happens — the account lives in localStorage.
 * If an account already exists in this browser (the user logged out), we offer to continue as that
 * person instead of silently wiping their progress.
 */
export default function OnboardingPage() {
  const { t } = useT()
  const onboarded = useAppStore((s) => s.onboarded)

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Product side */}
      <aside className="hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex">
        <Logo />
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">{t('ob.hero')}</h1>
          <p className="mt-3 text-muted">{t('ob.heroBody')}</p>
          <ul className="mt-8 flex flex-col gap-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-text">
                  <f.icon className="size-[18px]" />
                </span>
                <div>
                  <p className="font-medium">{t(f.title)}</p>
                  <p className="text-sm text-muted">{t(f.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-subtle">{t('ob.demoNote')}</p>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-col items-center justify-center px-5 py-10 sm:px-12">
        <LanguageSwitcher className="absolute right-4 top-4 sm:right-6 sm:top-6" />
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          {onboarded ? <ReturningUser /> : <Onboarding />}
        </div>
      </main>
    </div>
  )
}

/** Signed-out user whose account is still stored in this browser */
function ReturningUser() {
  const { t } = useT()
  const user = useAppStore((s) => s.user)
  const xp = useAppStore((s) => s.xp)
  const login = useAppStore((s) => s.login)
  const startNewAccount = useAppStore((s) => s.startNewAccount)
  const navigate = useNavigate()
  const [confirmNew, setConfirmNew] = useState(false)
  const firstName = user.name.split(' ')[0]

  return (
    <div>
      <h2 className="text-2xl font-semibold">{t('ob.welcomeBack', { name: firstName })}</h2>
      <p className="mt-1.5 text-sm text-muted">{t('ob.welcomeBack.subtitle')}</p>

      <button
        onClick={() => {
          login()
          navigate('/', { replace: true })
        }}
        className="surface mt-7 flex w-full cursor-pointer items-center gap-3 rounded-xl p-4 text-left transition-colors hover:border-primary"
      >
        <Avatar name={user.name} seed={user.avatarSeed} className="size-11 rounded-lg" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{t('ob.continueAs', { name: user.name })}</span>
          <span className="text-[13px] text-muted">{t('ob.accountStats', { level: getLevelInfo(xp).level, xp: formatNumber(xp) })}</span>
        </span>
        <ArrowRight className="size-5 text-muted" />
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-border" /> {t('ob.or')} <span className="h-px flex-1 bg-border" />
      </div>
      <Button variant="secondary" className="w-full" onClick={() => setConfirmNew(true)}>
        <UserPlus /> {t('ob.newAccount')}
      </Button>

      <Dialog open={confirmNew} onOpenChange={setConfirmNew}>
        <DialogContent className="max-w-sm">
          <DialogTitle>{t('ob.newAccount')}</DialogTitle>
          <DialogDescription className="mt-2">{t('ob.newAccount.warn')}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmNew(false)}>{t('action.cancel')}</Button>
            <Button
              variant="danger"
              onClick={() => {
                startNewAccount()
                setConfirmNew(false)
              }}
            >
              {t('ob.newAccount.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Onboarding() {
  const { t } = useT()
  const user = useAppStore((s) => s.user)
  const complete = useAppStore((s) => s.completeOnboarding)
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [target, setTarget] = useState(user.targetScore)
  const [current, setCurrent] = useState(user.currentScore)
  const [testDate, setTestDate] = useState(toDateKey(new Date(user.testDate)))
  const [focus, setFocus] = useState<Subject>(user.focus)

  const finish = () => {
    complete({
      name: name.trim() || user.name,
      avatarSeed: (name.trim() || user.name).toLowerCase(),
      targetScore: target,
      currentScore: current,
      testDate: `${testDate}T08:00:00`,
      focus,
    })
    navigate('/', { replace: true })
  }

  const canNext = step !== 1 || name.trim().length >= 2

  return (
    <>
      <ol className="mb-8 flex items-center gap-2 text-xs" aria-label={t('ob.stepsAria')}>
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span className={cn('h-1 rounded-full', i <= step ? 'bg-primary' : 'bg-ring-track')} />
            <span className={cn(i === step ? 'font-medium text-foreground' : 'text-subtle')} aria-current={i === step ? 'step' : undefined}>
              {t(label)}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setStep(1)
          }}
        >
          <h2 className="text-2xl font-semibold">{t('ob.login.title')}</h2>
          <p className="mt-1.5 text-sm text-muted">{t('ob.login.subtitle')}</p>
          <div className="mt-7 flex flex-col gap-4">
            <Field id="email" label={t('ob.email')}>
              <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field id="password" label={t('ob.password')}>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button type="submit" className="mt-1 w-full">{t('ob.login')}</Button>
            <div className="flex items-center gap-3 text-xs text-subtle">
              <span className="h-px flex-1 bg-border" /> {t('ob.or')} <span className="h-px flex-1 bg-border" />
            </div>
            <Button type="button" variant="secondary" className="w-full" onClick={() => setStep(1)}>
              {t('ob.demo')}
            </Button>
            <p className="text-center text-xs text-subtle">{t('ob.noAuth')}</p>
          </div>
        </form>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-semibold">{t('ob.name.title')}</h2>
          <p className="mt-1.5 text-sm text-muted">{t('ob.name.subtitle')}</p>
          <div className="mt-7">
            <Field id="name" label={t('ob.name.label')}>
              <Input id="name" autoFocus autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && canNext && setStep(2)} maxLength={40} />
            </Field>
            {name.length > 0 && !canNext && <p className="mt-1.5 text-xs text-danger-500">{t('ob.name.min')}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-semibold">{t('ob.goal.title')}</h2>
          <p className="mt-1.5 text-sm text-muted">{t('ob.goal.subtitle')}</p>
          <div className="mt-7 flex flex-col gap-5">
            <Range id="target" label={t('ob.goal.target')} value={target} min={1000} max={1600} onChange={setTarget} />
            <Range id="current" label={t('ob.goal.current')} value={current} min={400} max={1600} onChange={setCurrent} />
            <Field id="date" label={t('ob.goal.date')}>
              <DatePicker id="date" value={testDate} onChange={setTestDate} min={toDateKey(new Date())} />
            </Field>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-semibold">{t('ob.focus.title')}</h2>
          <p className="mt-1.5 text-sm text-muted">{t('ob.focus.subtitle')}</p>
          <div className="mt-7 flex flex-col gap-2" role="radiogroup" aria-label={t('ob.focus.title')}>
            {([
              { id: 'math', desc: 'ob.focus.math', icon: Calculator },
              { id: 'reading', desc: 'ob.focus.reading', icon: BookOpen },
              { id: 'writing', desc: 'ob.focus.writing', icon: PenLine },
            ] as const).map((o) => (
              <button
                key={o.id}
                role="radio"
                aria-checked={focus === o.id}
                onClick={() => setFocus(o.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-left transition-colors',
                  focus === o.id ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-sunken',
                )}
              >
                <o.icon className="size-5 shrink-0 text-muted" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{t(`subject.${o.id}`)}</span>
                  <span className="text-[13px] text-muted">{t(o.desc)}</span>
                </span>
                {focus === o.id && <CircleCheck className="size-5 text-primary-text" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {step > 0 && (
        <div className="mt-8 flex justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft /> {t('action.back')}</Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canNext} onClick={() => setStep(step + 1)}>{t('action.continue')} <ArrowRight /></Button>
          ) : (
            <Button onClick={finish}>{t('ob.start')} <ArrowRight /></Button>
          )}
        </div>
      )}
    </>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function Range({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <output htmlFor={id} className="text-lg font-semibold tabular-nums">{value}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={10} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[var(--primary)]" />
      <div className="flex justify-between text-xs text-subtle"><span>{min}</span><span>{max}</span></div>
    </div>
  )
}
