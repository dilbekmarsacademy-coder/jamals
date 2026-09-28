import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import type { HomeworkStatus, Subject } from '@/types'
import { PageHeader } from '@/components/common/PageHeader'
import { HomeworkCard } from '@/components/homework/HomeworkCard'
import { HomeworkDialog } from '@/components/homework/HomeworkDialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@/hooks/useQuery'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { api } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'
import { getHomeworkStatus, STATUS_META, SUBJECT_META } from '@/lib/homework'
import { cn } from '@/lib/utils'

const COLUMNS: HomeworkStatus[] = ['not_started', 'in_progress', 'overdue', 'done']
type SubjectFilter = 'all' | Subject

export default function HomeworkPage() {
  const { data: list, loading } = useQuery('homework', api.getHomework)
  const progress = useAppStore((s) => s.homeworkProgress)
  const [params, setParams] = useSearchParams()
  const [subject, setSubject] = useState<SubjectFilter>('all')
  const [query, setQuery] = useState('')
  const [mobileCol, setMobileCol] = useState<HomeworkStatus>('not_started')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const items = useMemo(() => {
    const now = new Date()
    const q = query.trim().toLowerCase()
    return (list ?? [])
      .map((hw) => ({ hw, progress: progress[hw.id], status: getHomeworkStatus(progress[hw.id], now) }))
      .filter((x) => x.progress)
      .filter((x) => subject === 'all' || x.hw.subject === subject)
      .filter((x) => !q || x.hw.title.toLowerCase().includes(q) || x.hw.description.toLowerCase().includes(q))
      .sort((a, b) => a.progress.dueDate.localeCompare(b.progress.dueDate))
  }, [list, progress, subject, query])

  const openId = params.get('open')
  const openItem = openId
    ? (() => {
        const hw = list?.find((h) => h.id === openId)
        return hw && progress[hw.id] ? { hw, progress: progress[hw.id], status: getHomeworkStatus(progress[hw.id]) } : null
      })()
    : null

  const byStatus = (s: HomeworkStatus) => items.filter((x) => x.status === s)
  const visibleColumns = isDesktop ? COLUMNS : [mobileCol]

  return (
    <>
      <PageHeader title="Uy vazifalari" subtitle="Vazifalar holati va muddatlari. Kartani bosib tafsilotlarni ko‘ring." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 z-10 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Vazifa qidirish..." className="pl-9 pr-8" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-muted hover:text-foreground" aria-label="Tozalash">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Fan bo‘yicha filter">
          {(['all', 'math', 'reading', 'writing'] as SubjectFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={cn(
                'h-9 cursor-pointer rounded-lg border px-3 text-sm font-medium transition-colors',
                subject === s ? 'border-foreground bg-foreground text-background' : 'border-border bg-surface text-muted hover:text-foreground',
              )}
            >
              {s === 'all' ? 'Hammasi' : SUBJECT_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {!isDesktop && (
        <Tabs value={mobileCol} onValueChange={(v) => setMobileCol(v as HomeworkStatus)} className="mb-4">
          <TabsList className="flex w-full overflow-x-auto">
            {COLUMNS.map((c) => (
              <TabsTrigger key={c} value={c} className="flex-1 px-2 text-xs">
                {STATUS_META[c].label.split(' ')[0]} <span className="ml-1 tabular-nums text-subtle">{byStatus(c).length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        {visibleColumns.map((col) => {
          const meta = STATUS_META[col]
          const colItems = byStatus(col)
          return (
            <section key={col} className="flex flex-col rounded-xl bg-surface-sunken p-3" aria-label={meta.label}>
              <header className="mb-3 flex items-center gap-2 px-1">
                <span className={cn('size-2.5 rounded-full', meta.dot)} />
                <h2 className="text-sm font-semibold">{meta.label}</h2>
                <span className="ml-auto text-[13px] tabular-nums text-muted">{colItems.length}</span>
              </header>
              <div className="flex min-h-24 flex-col gap-3">
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)
                ) : (
                  <AnimatePresence mode="popLayout">
                    {colItems.map((x) => (
                      <HomeworkCard key={x.hw.id} {...x} onOpen={() => setParams({ open: x.hw.id })} />
                    ))}
                  </AnimatePresence>
                )}
                {!loading && colItems.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-subtle">{col === 'overdue' ? 'Muddati o‘tgan vazifa yo‘q' : 'Vazifa yo‘q'}</p>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <HomeworkDialog item={openItem} onClose={() => setParams({})} />
    </>
  )
}
