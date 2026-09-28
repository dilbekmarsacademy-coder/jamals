import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Calculator, CircleCheck, ClipboardCheck, PenLine, PlayCircle } from 'lucide-react'
import type { Subject } from '@/types'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const STEPS = ['Kirish', 'Profil', 'Maqsad', 'Yo‘nalish']

const FEATURES = [
  { icon: PlayCircle, title: 'Video darslar', text: 'Math, Reading va Writing bo‘yicha tizimli dasturi.' },
  { icon: ClipboardCheck, title: 'Har darsdan keyin amaliyot', text: 'SAT formatidagi savollar va batafsil tahlil.' },
  { icon: BarChart3, title: 'Shaffof progress', text: 'Davomat, natijalar va shaxsiy rekordlar bir joyda.' },
]

/** UI-only sign-in + onboarding. No authentication happens — everything stays in localStorage. */
export default function OnboardingPage() {
  const user = useAppStore((s) => s.user)
  const complete = useAppStore((s) => s.completeOnboarding)
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [target, setTarget] = useState(user.targetScore)
  const [current, setCurrent] = useState(user.currentScore)
  const [testDate, setTestDate] = useState(user.testDate.slice(0, 10))
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
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Product side */}
      <aside className="hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex">
        <Logo />
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">SAT’ga tizimli tayyorgarlik</h1>
          <p className="mt-3 text-muted">Dars → amaliyot → tahlil. Har kuni qancha ish qilganingiz va maqsadingizga qancha qolgani aniq ko‘rinib turadi.</p>
          <ul className="mt-8 flex flex-col gap-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-text">
                  <f.icon className="size-[18px]" />
                </span>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-sm text-muted">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-subtle">Demo versiya · ma’lumotlar faqat shu brauzerda saqlanadi</p>
      </aside>

      {/* Form side */}
      <main className="flex flex-col items-center justify-center px-5 py-10 sm:px-12">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />

          <ol className="mb-8 flex items-center gap-2 text-xs" aria-label="Qadamlar">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 flex-col gap-1.5">
                <span className={cn('h-1 rounded-full', i <= step ? 'bg-primary' : 'bg-ring-track')} />
                <span className={cn(i === step ? 'font-medium text-foreground' : 'text-subtle')} aria-current={i === step ? 'step' : undefined}>
                  {label}
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
              <h2 className="text-2xl font-semibold">Hisobingizga kiring</h2>
              <p className="mt-1.5 text-sm text-muted">Yoki ro‘yxatdan o‘tmasdan demo rejimda davom eting.</p>
              <div className="mt-7 flex flex-col gap-4">
                <Field id="email" label="Elektron pochta">
                  <Input id="email" type="email" autoComplete="email" placeholder="ism@misol.uz" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field id="password" label="Parol">
                  <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
                <Button type="submit" className="mt-1 w-full">Kirish</Button>
                <div className="flex items-center gap-3 text-xs text-subtle">
                  <span className="h-px flex-1 bg-border" /> yoki <span className="h-px flex-1 bg-border" />
                </div>
                <Button type="button" variant="secondary" className="w-full" onClick={() => setStep(1)}>
                  Demo rejimda davom etish
                </Button>
                <p className="text-center text-xs text-subtle">Bu interfeys namunasi: haqiqiy autentifikatsiya amalga oshirilmaydi.</p>
              </div>
            </form>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold">Ismingiz</h2>
              <p className="mt-1.5 text-sm text-muted">Profil va reytingda ko‘rsatiladi.</p>
              <div className="mt-7">
                <Field id="name" label="To‘liq ism">
                  <Input id="name" autoFocus autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && canNext && setStep(2)} maxLength={40} />
                </Field>
                {name.length > 0 && !canNext && <p className="mt-1.5 text-xs text-danger-500">Kamida 2 ta belgi kiriting</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold">Maqsad va imtihon sanasi</h2>
              <p className="mt-1.5 text-sm text-muted">Progress shu maqsadga nisbatan hisoblanadi.</p>
              <div className="mt-7 flex flex-col gap-5">
                <Range id="target" label="Maqsadli ball" value={target} min={1000} max={1600} onChange={setTarget} />
                <Range id="current" label="Hozirgi taxminiy ball" value={current} min={400} max={1600} onChange={setCurrent} />
                <Field id="date" label="Imtihon sanasi">
                  <Input id="date" type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold">Asosiy yo‘nalish</h2>
              <p className="mt-1.5 text-sm text-muted">Tavsiyalar shunga moslanadi. Keyinroq profilda o‘zgartirish mumkin.</p>
              <div className="mt-7 flex flex-col gap-2" role="radiogroup" aria-label="Asosiy yo‘nalish">
                {([
                  { id: 'math', label: 'Math', desc: 'Algebra, Advanced Math, geometriya', icon: Calculator },
                  { id: 'reading', label: 'Reading', desc: 'Asosiy g‘oya, xulosa, so‘z ma’nosi', icon: BookOpen },
                  { id: 'writing', label: 'Writing', desc: 'Grammatika, punktuatsiya, bog‘lovchilar', icon: PenLine },
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
                      <span className="block text-sm font-medium">{o.label}</span>
                      <span className="text-[13px] text-muted">{o.desc}</span>
                    </span>
                    {focus === o.id && <CircleCheck className="size-5 text-primary-text" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step > 0 && (
            <div className="mt-8 flex justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft /> Orqaga</Button>
              {step < STEPS.length - 1 ? (
                <Button disabled={!canNext} onClick={() => setStep(step + 1)}>Davom etish <ArrowRight /></Button>
              ) : (
                <Button onClick={finish}>Boshlash <ArrowRight /></Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
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
