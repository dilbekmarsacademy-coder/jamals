'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, NotebookPen, FolderDown, Sparkles, Clock } from 'lucide-react'
import { useT } from '@/i18n'
import { useApex } from '@/store/useApex'
import { useLessonQuery } from '@/hooks/queries'
import { useYouTube } from '@/hooks/useYouTube'
import { lessons } from '@/data/lessons'
import type { Lesson } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DomainTag } from '@/components/common/DomainTag'
import { ProgressBar } from '@/components/common/ProgressBar'
import { VideoPlayer, ChapterList } from '@/components/lessons/VideoPlayer'
import { NotesPanel } from '@/components/lessons/NotesPanel'
import { ResourcesPanel } from '@/components/lessons/ResourcesPanel'
import { CompletionModal } from '@/components/lessons/CompletionModal'
import { NotFoundCard } from '@/components/common/NotFoundCard'

function Workspace({ lesson }: { lesson: Lesson }) {
  const { t, tr } = useT()
  const progress = useApex((s) => s.lessons[lesson.id])
  const saveProgress = useApex((s) => s.saveLessonProgress)
  const completeLesson = useApex((s) => s.completeLesson)
  const [modal, setModal] = useState<{ open: boolean; xp: number }>({ open: false, xp: 0 })

  const finish = () => {
    const xp = completeLesson(lesson.id)
    setModal({ open: true, xp })
  }

  const player = useYouTube({
    videoId: lesson.youtubeId,
    startAt: progress && !progress.completed ? progress.position : 0,
    initialWatched: progress?.watched ?? 0,
    onProgress: (watched, position) => saveProgress(lesson.id, watched, position),
    onEnded: finish,
  })

  const idx = lessons.findIndex((l) => l.id === lesson.id)
  const next = lessons[idx + 1]

  return (
    <div className="space-y-5">
      <Link href="/lessons" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg-strong">
        <ArrowLeft className="size-4" /> {t('lesson.back')}
      </Link>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] [&>*]:min-w-0">
        <div className="min-w-0 space-y-4">
          <VideoPlayer player={player} chapters={lesson.chapters} title={tr(lesson.title)} />
          <ChapterList player={player} chapters={lesson.chapters} />

          <div className="glass rounded-2xl p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-bold uppercase tracking-wider text-cyan-fg">{t('mission.module', { n: lesson.module })}</span>
                  <DomainTag domain={lesson.domain} />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {t('mission.mins', { count: lesson.durationMin })}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-gold-fg">
                    <Sparkles className="size-3.5" />+{lesson.xp} XP
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold">{tr(lesson.title)}</h1>
                <p className="mt-1.5 text-sm text-muted">{tr(lesson.summary)}</p>
                <p className="mt-2 text-xs text-subtle">{t('lesson.source', { channel: lesson.channel })}</p>
              </div>
              <div className="w-full shrink-0 sm:w-56">
                <div className="mb-1.5 flex justify-between text-xs text-muted">
                  <span>{t('mission.watched')}</span>
                  <span className="tnum">{Math.round(Math.max(player.watched, progress?.watched ?? 0) * 100)}%</span>
                </div>
                <ProgressBar value={progress?.completed ? 1 : Math.max(player.watched, progress?.watched ?? 0)} tone={progress?.completed ? 'emerald' : 'brand'} />
                {progress?.completed ? (
                  <Button variant="secondary" className="mt-3 w-full" onClick={() => setModal({ open: true, xp: 0 })}>
                    <CheckCircle2 className="text-emerald-fg" />
                    {t('lesson.completed')}
                  </Button>
                ) : (
                  <Button className="mt-3 w-full" onClick={finish}>
                    <CheckCircle2 />
                    {t('lesson.complete')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="glass flex min-h-[520px] flex-col rounded-2xl p-4 xl:sticky xl:top-20 xl:h-[calc(100dvh-7rem)]">
          <Tabs defaultValue="notes" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">
                <NotebookPen /> {t('lesson.tabNotes')}
              </TabsTrigger>
              <TabsTrigger value="resources">
                <FolderDown /> {t('lesson.tabResources')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4 min-h-0 flex-1 data-[state=active]:flex data-[state=active]:flex-col">
              <NotesPanel lessonId={lesson.id} player={player} />
            </TabsContent>
            <TabsContent value="resources" className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin">
              <ResourcesPanel lesson={lesson} />
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      <CompletionModal lesson={lesson} xp={modal.xp} open={modal.open} onOpenChange={(open) => setModal((m) => ({ ...m, open }))} nextLessonId={next?.id} />
    </div>
  )
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isPending } = useLessonQuery(id)
  if (isPending) return <Skeleton className="aspect-video w-full" />
  if (!data) return <NotFoundCard />
  return <Workspace key={data.id} lesson={data} />
}
