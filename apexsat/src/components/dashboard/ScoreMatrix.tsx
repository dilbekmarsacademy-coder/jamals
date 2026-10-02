'use client'

import { TrendingUp, Sigma, BookOpenText } from 'lucide-react'
import { motion } from 'framer-motion'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkline } from '@/components/common/Sparkline'

function Ring({ value, max }: { value: number; max: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const frac = Math.min(1, (value - 400) / (max - 400))
  return (
    <svg viewBox="0 0 128 128" className="size-36 -rotate-90" aria-hidden>
      <defs>
        <linearGradient id="score-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--cyan-bright)" />
          <stop offset="1" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="10" />
      <motion.circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="url(#score-ring)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - frac) }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </svg>
  )
}

export function ScoreMatrix() {
  const { t } = useT()
  const predicted = useApex((s) => s.predicted)
  const target = useApex((s) => s.profile.targetScore)
  const history = useApex((s) => s.scoreHistory)
  const total = predicted.math + predicted.rw
  const first = history[0]?.total ?? total
  const gain = total - first
  const gap = target - total

  const rows = [
    { key: 'section.math' as const, value: predicted.math, icon: Sigma, color: 'var(--cyan)' },
    { key: 'section.rw' as const, value: predicted.rw, icon: BookOpenText, color: 'var(--violet)' },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('score.title')}</CardTitle>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald/12 px-2 py-0.5 text-[11px] font-bold text-emerald-fg">
          <TrendingUp className="size-3" />
          {gain >= 0 ? '+' : ''}
          {gain}
        </span>
      </CardHeader>
      <CardBody className="pt-3">
        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center">
            <Ring value={total} max={1600} />
            <div className="absolute text-center">
              <p className="font-display text-3xl font-extrabold tnum text-fg-strong">{total}</p>
              <p className="text-xs tnum text-muted">/ 1600</p>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            {rows.map(({ key, value, icon: Icon, color }) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-fg">
                    <Icon className="size-3.5" style={{ color }} />
                    {t(key)}
                  </span>
                  <span className="font-bold tnum text-fg-strong">{value}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3/70">
                  <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${((value - 200) / 600) * 100}%` }} transition={{ duration: 0.9 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/50 px-3 py-2.5">
          <div>
            <p className="text-xs text-muted">{t('score.target', { target })}</p>
            <p className="text-sm font-bold text-fg-strong">{gap > 0 ? t('score.toGo', { count: gap }) : t('score.reached')}</p>
          </div>
          <Sparkline values={history.map((h) => h.total)} className="h-9 w-28" />
        </div>
      </CardBody>
    </Card>
  )
}
