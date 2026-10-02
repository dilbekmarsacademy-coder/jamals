'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Brain, Repeat, Target, TrendingDown, Layers, CircleCheck } from 'lucide-react'
import { DOMAINS, type Domain } from '@/types'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useNow } from '@/hooks/useNow'
import { useDueMistakes } from '@/hooks/useDerived'
import { getHomework, getQuestion } from '@/data/homework'
import { isDue, MAX_BOX } from '@/lib/srs'
import { PageHeader } from '@/components/common/PageHeader'
import { DomainTag, DOMAIN_HEX, DOMAIN_KEY } from '@/components/common/DomainTag'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { QuestionReview } from '@/components/test/ResultsView'
import { CipherSays } from '@/components/brand/Cipher'
import { cn } from '@/lib/utils'

export default function MistakesPage() {
  const { t, tr, locale } = useT()
  const now = useNow(60_000)
  const mistakes = useApex((s) => s.mistakes)
  const stats = useApex((s) => s.domainStats)
  const due = useDueMistakes(now)
  const [filter, setFilter] = useState<'all' | Domain>('all')

  const open = useMemo(() => Object.values(mistakes).filter((m) => !m.mastered), [mistakes])
  const mastered = Object.values(mistakes).length - open.length

  const domains = DOMAINS.map((d) => {
    const s = stats[d]
    const items = open.filter((m) => getQuestion(m.questionId)?.domain === d)
    return { d, accuracy: s.attempted ? s.correct / s.attempted : 1, attempted: s.attempted, open: items.length, due: items.filter((m) => isDue(m, now)).length }
  })
  const weakest = [...domains].sort((a, b) => a.accuracy - b.accuracy)[0]

  const list = open
    .map((m) => ({ m, q: getQuestion(m.questionId)! }))
    .filter(({ q }) => q && (filter === 'all' || q.domain === filter))
    .sort((a, b) => new Date(a.m.dueAt).getTime() - new Date(b.m.dueAt).getTime())

  const rel = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const dueLabel = (iso: string) => {
    const days = Math.ceil((new Date(iso).getTime() - now.getTime()) / 86_400_000)
    return days <= 0 ? t('mistakes.dueNow') : rel.format(days, 'day')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('mistakes.title')}
        subtitle={t('mistakes.subtitle')}
        actions={
          <Button asChild size="lg" variant="violet" className={cn(due.length === 0 && 'pointer-events-none opacity-50')} aria-disabled={due.length === 0}>
            <Link href="/mistakes/retry">
              <Repeat />
              {t('mistakes.retryDue', { count: due.length })}
            </Link>
          </Button>
        }
      />

      {/* Weak spots analyzer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="size-4 text-crimson-fg" />
            {t('mistakes.analyzer')}
          </CardTitle>
        </CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {domains.map(({ d, accuracy, attempted, open: openCount, due: dueCount }) => {
            const pct = Math.round(accuracy * 100)
            const isWeak = weakest.d === d
            return (
              <div key={d} className={cn('relative rounded-2xl border p-4', isWeak ? 'border-crimson/40 bg-crimson/5' : 'border-line bg-surface-2/30')}>
                {isWeak && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-crimson/15 px-2 py-0.5 text-[10px] font-bold uppercase text-crimson-fg">
                    <Target className="size-3" /> {t('mistakes.focus')}
                  </span>
                )}
                <p className="text-sm font-bold text-fg-strong">{t(DOMAIN_KEY[d])}</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-display text-3xl font-extrabold tnum" style={{ color: DOMAIN_HEX[d] }}>
                    {pct}%
                  </span>
                  <span className="mb-1 text-xs text-muted">{t('mistakes.accuracy', { count: attempted })}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-3/70">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DOMAIN_HEX[d] }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted">{t('mistakes.openDue', { open: openCount, due: dueCount })}</span>
                  {openCount > 0 && (
                    <Link href={`/mistakes/retry?domain=${d}`} className="font-semibold text-cyan-fg hover:underline">
                      {t('mistakes.retryShort')}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </CardBody>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px] [&>*]:min-w-0">
        {/* Mistake list */}
        <Card>
          <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CardTitle>{t('mistakes.bank', { count: open.length })}</CardTitle>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full min-w-0 sm:w-auto">
              <TabsList className="flex max-w-full overflow-x-auto scrollbar-thin">
                <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
                {DOMAINS.map((d) => (
                  <TabsTrigger key={d} value={d}>
                    {t(DOMAIN_KEY[d])}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardBody>
            {list.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted">
                <CircleCheck className="size-8 text-emerald-fg" />
                {t('mistakes.empty')}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {list.map(({ m, q }) => {
                  const source = m.source === 'diagnostic' ? t('mistakes.diagnostic') : tr(getHomework(m.source)?.title ?? { en: m.source, uz: m.source, ru: m.source })
                  const dueNow = isDue(m, now)
                  return (
                    <AccordionItem key={m.questionId} value={m.questionId}>
                      <AccordionTrigger>
                        <span className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                          <span className="truncate text-sm font-medium">{q.prompt.split('\n').pop()}</span>
                          <span className="flex shrink-0 items-center gap-2 sm:ml-auto">
                            <DomainTag domain={q.domain} />
                            <span className="inline-flex items-center gap-1 rounded-md bg-surface-3/60 px-1.5 py-0.5 text-[11px] font-semibold tnum text-muted" title={t('mistakes.box')}>
                              <Layers className="size-3" />
                              {m.box}/{MAX_BOX}
                            </span>
                            <span className={cn('text-[11px] font-semibold', dueNow ? 'text-violet-fg' : 'text-subtle')}>{dueLabel(m.dueAt)}</span>
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2 text-xs text-muted">{t('mistakes.meta', { source, count: m.timesWrong })}</p>
                        <QuestionReview q={q} chosen={m.chosen >= 0 ? m.chosen : undefined} />
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </CardBody>
        </Card>

        {/* Leitner boxes */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="size-4 text-violet-fg" />
                {t('mistakes.srs')}
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-2.5">
              {[1, 2, 3, 4].map((b) => {
                const count = open.filter((m) => m.box === b).length
                return (
                  <div key={b} className="flex items-center gap-3">
                    <span className="w-16 text-xs font-semibold text-muted">{t('mistakes.boxN', { n: b })}</span>
                    <div className="flex h-6 flex-1 items-center overflow-hidden rounded-lg bg-surface-3/50">
                      <div className="h-full rounded-lg bg-violet/60" style={{ width: `${(count / Math.max(1, open.length)) * 100}%` }} />
                    </div>
                    <span className="w-6 text-right text-sm font-bold tnum">{count}</span>
                  </div>
                )
              })}
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs font-semibold text-emerald-fg">{t('mistakes.mastered')}</span>
                <div className="h-6 flex-1" />
                <span className="w-6 text-right text-sm font-bold tnum text-emerald-fg">{mastered}</span>
              </div>
              <p className="pt-1 text-xs text-muted">{t('mistakes.srsHint')}</p>
            </CardBody>
          </Card>
          <CipherSays mood="thinking">{t('mistakes.cipher', { domain: t(DOMAIN_KEY[weakest.d]) })}</CipherSays>
        </div>
      </div>
    </div>
  )
}
