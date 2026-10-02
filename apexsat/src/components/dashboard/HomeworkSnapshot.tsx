'use client'

import Link from 'next/link'
import { ArrowRight, Brain } from 'lucide-react'
import { useT } from '@/i18n'
import { useDueMistakes, useHomeworkList } from '@/hooks/useDerived'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import type { HomeworkStatus } from '@/types'
import { cn } from '@/lib/utils'

const ORDER: HomeworkStatus[] = ['OVERDUE', 'IN_PROGRESS', 'NOT_STARTED', 'COMPLETED']
const COUNT_TONE: Record<HomeworkStatus, string> = {
  OVERDUE: 'text-crimson-fg',
  IN_PROGRESS: 'text-gold-fg',
  NOT_STARTED: 'text-fg-strong',
  COMPLETED: 'text-emerald-fg',
}

export function HomeworkSnapshot({ now }: { now: Date }) {
  const { t, tr } = useT()
  const list = useHomeworkList(now)
  const due = useDueMistakes(now)
  const next = [...list].filter((h) => h.status !== 'COMPLETED').sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.due.getTime() - b.due.getTime())[0]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dash.homework')}</CardTitle>
        <Link href="/homework" className="text-xs font-semibold text-cyan-fg hover:underline">
          {t('common.viewAll')}
        </Link>
      </CardHeader>
      <CardBody className="space-y-4 pt-3">
        <div className="grid grid-cols-4 gap-2">
          {ORDER.map((s) => (
            <div key={s} className="rounded-xl border border-line bg-surface-2/40 px-2 py-2 text-center">
              <p className={cn('font-display text-xl font-extrabold tnum', COUNT_TONE[s])}>{list.filter((h) => h.status === s).length}</p>
              <StatusPill status={s} compact className="mt-1" />
            </div>
          ))}
        </div>
        {next && (
          <Link href={`/homework/${next.hw.id}`} className="group flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-cyan/40 hover:bg-surface-2/50">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{t('dash.nextUp')}</p>
              <p className="truncate text-sm font-semibold text-fg-strong">{tr(next.hw.title)}</p>
            </div>
            <StatusPill status={next.status} />
            <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-cyan-fg" />
          </Link>
        )}
        <div className="flex items-center gap-3 rounded-xl bg-violet/10 px-3 py-2.5">
          <Brain className="size-5 shrink-0 text-violet-fg" />
          <p className="flex-1 text-sm text-fg">{t('dash.mistakesDue', { count: due.length })}</p>
          {due.length > 0 && (
            <Button asChild size="sm" variant="violet">
              <Link href="/mistakes/retry">{t('mistakes.retry')}</Link>
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
