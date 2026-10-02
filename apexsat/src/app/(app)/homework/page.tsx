'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import type { HomeworkStatus, Section } from '@/types'
import { useT, type MessageKey } from '@/i18n'
import { useNow } from '@/hooks/useNow'
import { useHomeworkList } from '@/hooks/useDerived'
import { PageHeader } from '@/components/common/PageHeader'
import { HomeworkCard } from '@/components/homework/HomeworkCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const COLUMNS: { status: HomeworkStatus; key: MessageKey; dot: string }[] = [
  { status: 'NOT_STARTED', key: 'status.notStarted', dot: 'bg-subtle' },
  { status: 'IN_PROGRESS', key: 'status.inProgress', dot: 'bg-gold' },
  { status: 'OVERDUE', key: 'status.overdue', dot: 'bg-crimson' },
  { status: 'COMPLETED', key: 'status.completed', dot: 'bg-emerald' },
]

type Filter = 'ALL' | HomeworkStatus

export default function HomeworkPage() {
  const { t, tr } = useT()
  const now = useNow(30_000)
  const list = useHomeworkList(now)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [section, setSection] = useState<'all' | Section>('all')
  const [query, setQuery] = useState('')

  const visible = list.filter(
    (h) => (section === 'all' || h.hw.section === section) && (!query || tr(h.hw.title).toLowerCase().includes(query.toLowerCase())),
  )
  const columns = filter === 'ALL' ? COLUMNS : COLUMNS.filter((c) => c.status === filter)

  return (
    <div>
      <PageHeader title={t('hw.title')} subtitle={t('hw.subtitle')} />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="flex w-full overflow-x-auto scrollbar-thin lg:w-auto">
            <TabsTrigger value="ALL">
              {t('common.all')} <span className="tnum text-subtle">{visible.length}</span>
            </TabsTrigger>
            {COLUMNS.map((c) => (
              <TabsTrigger key={c.status} value={c.status}>
                <span className={cn('size-2 rounded-full', c.dot)} />
                {t(c.key)}
                <span className="tnum text-subtle">{visible.filter((h) => h.status === c.status).length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Tabs value={section} onValueChange={(v) => setSection(v as typeof section)}>
            <TabsList>
              <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
              <TabsTrigger value="math">{t('section.math')}</TabsTrigger>
              <TabsTrigger value="rw">{t('section.rwShort')}</TabsTrigger>
            </TabsList>
          </Tabs>
          <label className="relative min-w-0 flex-1 lg:w-56 lg:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.search')}
              aria-label={t('common.search')}
              className="h-10 w-full rounded-xl border border-line bg-surface-2/60 pl-9 pr-3 text-sm text-fg-strong outline-none placeholder:text-subtle focus:border-cyan"
            />
          </label>
        </div>
      </div>

      <div className={cn('grid gap-4', filter === 'ALL' ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3')}>
        {columns.map((col) => {
          const items = visible.filter((h) => h.status === col.status).sort((a, b) => a.due.getTime() - b.due.getTime())
          const cards = (
            <AnimatePresence mode="popLayout">
              {items.map((h) => (
                <HomeworkCard key={h.hw.id} {...h} now={now} />
              ))}
            </AnimatePresence>
          )
          if (filter !== 'ALL') return <div key={col.status} className="contents">{cards}{items.length === 0 && <Empty />}</div>
          return (
            <section key={col.status} className="rounded-2xl border border-line bg-surface-2/20 p-3" aria-label={t(col.key)}>
              <h2 className="mb-3 flex items-center gap-2 px-1 text-sm font-bold">
                <span className={cn('size-2.5 rounded-full', col.dot)} />
                {t(col.key)}
                <span className="ml-auto rounded-full bg-surface-3/70 px-2 text-xs tnum text-muted">{items.length}</span>
              </h2>
              <div className="space-y-3">
                {cards}
                {items.length === 0 && <Empty />}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function Empty() {
  const { t } = useT()
  return <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-subtle">{t('hw.emptyColumn')}</p>
}
