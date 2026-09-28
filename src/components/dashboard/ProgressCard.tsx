import { useT } from '@/i18n'
import { levelTitle } from '@/lib/levels'
import { Flame, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressRing } from '@/components/common/ProgressRing'
import { AnimatedNumber } from '@/components/common/AnimatedNumber'
import { useAppStore, useLevel, useStreak } from '@/store/useAppStore'
import { formatNumber } from '@/lib/utils'

export function ProgressCard() {
  const { t } = useT()
  const level = useLevel()
  const { current } = useStreak()
  const bestStreak = useAppStore((s) => s.bestStreak)
  const isRecord = current > 0 && current >= bestStreak

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{t('dash.progress')}</CardTitle>
      </CardHeader>
      <div className="flex items-center gap-5">
        <ProgressRing value={level.progress} size={104} stroke={8}>
          <div>
            <div className="text-2xl font-semibold leading-none">{level.level}</div>
            <div className="mt-1 text-xs text-muted">{t('level.word')}</div>
          </div>
        </ProgressRing>
        <div className="min-w-0">
          <p className="font-semibold">{levelTitle(level.tier)}</p>
          <p className="mt-0.5 text-sm text-muted">
            {t('dash.toNext')} <span className="font-medium text-foreground">{formatNumber(level.xpForLevel - level.xpIntoLevel)} XP</span>
          </p>
          <p className="mt-0.5 text-xs text-subtle tabular-nums">
            {formatNumber(level.xpIntoLevel)} / {formatNumber(level.xpForLevel)}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted"><Flame className="size-3.5 text-ember-500" /> {t('dash.streak')}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{current} <span className="text-sm font-normal text-muted">{t('unit.daysWord')}</span></dd>
          <dd className="text-xs text-muted">{isRecord ? t('dash.personalRecord') : t('dash.record', { n: bestStreak })}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted"><Zap className="size-3.5 text-flare-500" /> {t('dash.totalXp')}</dt>
          <dd className="mt-1 text-xl font-semibold"><AnimatedNumber value={level.totalXp} /></dd>
        </div>
      </dl>
    </Card>
  )
}
