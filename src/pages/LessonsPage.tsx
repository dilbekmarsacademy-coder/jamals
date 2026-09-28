import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CircleCheck, Play, Zap } from 'lucide-react'
import type { Subject } from '@/types'
import { PageHeader } from '@/components/common/PageHeader'
import { SubjectPill } from '@/components/common/SubjectPill'
import { ProgressRing } from '@/components/common/ProgressRing'
import { stagger } from '@/components/common/PageTransition'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@/hooks/useQuery'
import { api } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'

type Filter = 'all' | Subject

export default function LessonsPage() {
  const { data: lessons, loading } = useQuery('lessons', api.getLessons)
  const progress = useAppStore((s) => s.lessonProgress)
  const [filter, setFilter] = useState<Filter>('all')

  const list = (lessons ?? []).filter((l) => filter === 'all' || l.subject === filter)
  const completed = (lessons ?? []).filter((l) => progress[l.id]?.completed).length
  const total = lessons?.length ?? 0

  return (
    <>
      <PageHeader
        title="Darslar"
        subtitle="Har bir darsdan so‘ng unga bog‘liq uy vazifasi ochiladi."
        action={
          <div className="surface flex items-center gap-3 rounded-lg px-4 py-2.5">
            <ProgressRing value={total ? completed / total : 0} size={40} stroke={4} label="Kurs progressi">
              <span className="text-xs font-semibold tabular-nums">{total ? Math.round((completed / total) * 100) : 0}%</span>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-medium">{completed} / {total} dars tugallandi</div>
              <div className="text-xs text-muted">Kurs progressi</div>
            </div>
          </div>
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="mb-5">
        <TabsList>
          <TabsTrigger value="all">Hammasi</TabsTrigger>
          <TabsTrigger value="math">Math</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="writing">Writing</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface overflow-hidden rounded-xl">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="mt-2 h-4 w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div key={filter} variants={stagger.container} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((l) => {
            const p = progress[l.id]
            const watched = p?.watched ?? 0
            return (
              <motion.div key={l.id} variants={stagger.item}>
                <Link to={`/lessons/${l.id}`} className="surface group block h-full overflow-hidden rounded-xl transition-colors hover:border-border-strong">
                  <div className="relative aspect-video overflow-hidden bg-surface-sunken">
                    <img src={`https://img.youtube.com/vi/${l.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover" />
                                                            <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">~{l.durationMin} daq</span>
                    {p?.completed ? (
                      <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
                        <CircleCheck className="size-3.5 text-mint-400" /> Tugallangan
                      </span>
                    ) : (
                      <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <Play className="ml-0.5 size-4 fill-current" />
                      </span>
                    )}
                    {watched > 0 && !p?.completed && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                        <div className="h-full bg-primary" style={{ width: `${watched * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <SubjectPill subject={l.subject} />
                      <span className="flex items-center gap-1 text-[13px] text-muted">
                        <Zap className="size-3.5 text-flare-500" /> {l.xpReward} XP
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-semibold leading-snug"><span className="text-subtle">{l.order}.</span> {l.title}</h3>
                    <p className="mt-1 text-[13px] text-muted">{l.topic}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </>
  )
}
