import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, CircleCheck, ClipboardList, ExternalLink,
  FileText, FlaskConical, Link as LinkIcon, ListChecks, Play, Zap,
} from 'lucide-react'
import type { LessonMaterial } from '@/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SubjectPill } from '@/components/common/SubjectPill'
import { ProgressRing } from '@/components/common/ProgressRing'
import { useQuery } from '@/hooks/useQuery'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { api } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

/** Fraction of real watch time that counts as "lesson completed" */
const COMPLETE_AT = 0.9

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function LessonPage() {
  const { id = '' } = useParams()
  const { data: lessons, loading } = useQuery('lessons', api.getLessons)
  const lesson = lessons?.find((l) => l.id === id)

  if (loading) return <LessonSkeleton />
  if (!lesson || !lessons)
    return (
      <Card className="text-center">
        <p>Dars topilmadi.</p>
        <Button asChild variant="link"><Link to="/lessons">Darslar ro‘yxatiga</Link></Button>
      </Card>
    )

  // key → remount the player cleanly when navigating between lessons
  return <LessonView key={lesson.id} lessonId={lesson.id} />
}

function LessonView({ lessonId }: { lessonId: string }) {
  const { data: lessons = [] } = useQuery('lessons', api.getLessons)
  const lesson = lessons.find((l) => l.id === lessonId)!
  const idx = lessons.indexOf(lesson)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const navigate = useNavigate()

  const progress = useAppStore((s) => s.lessonProgress[lessonId])
  const hwProgress = useAppStore((s) => s.homeworkProgress[lesson.homeworkId])
  const allProgress = useAppStore((s) => s.lessonProgress)
  const setWatched = useAppStore((s) => s.setLessonWatched)
  const completeLesson = useAppStore((s) => s.completeLesson)
  const startHomework = useAppStore((s) => s.startHomework)

  const [liveWatched, setLiveWatched] = useState(progress?.watched ?? 0)
  const completed = !!progress?.completed

  const onProgress = useCallback(
    (f: number) => {
      setLiveWatched(f)
      setWatched(lessonId, f)
      if (f >= COMPLETE_AT) completeLesson(lessonId)
    },
    [lessonId, setWatched, completeLesson],
  )
  const onEnded = useCallback(() => {
    // Reaching the end after watching most of it also counts
    if ((useAppStore.getState().lessonProgress[lessonId]?.watched ?? 0) >= 0.5) completeLesson(lessonId)
  }, [lessonId, completeLesson])

  const player = useYouTubePlayer({
    videoId: lesson.youtubeId,
    initialWatched: progress?.watched ?? 0,
    onProgress,
    onEnded,
  })

  const watched = completed ? 1 : liveWatched
  const goHomework = () => {
    startHomework(lesson.homeworkId)
    navigate(`/homework/${lesson.homeworkId}`)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/lessons" className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-foreground">
          <ArrowLeft className="size-4" /> Barcha darslar
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={!prev} onClick={() => prev && navigate(`/lessons/${prev.id}`)}>
            <ChevronLeft /> Oldingi
          </Button>
          <Button variant="secondary" size="sm" disabled={!next} onClick={() => next && navigate(`/lessons/${next.id}`)}>
            Keyingi <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Player */}
          <div className="overflow-hidden rounded-xl border border-border bg-black">
            <div className="relative aspect-video">
              <div ref={player.containerRef} className="absolute inset-0 [&_iframe]:size-full" />
              {!player.ready && !player.error && (
                <div className="absolute inset-0 grid place-items-center">
                  <img src={`https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
                  <div className="relative grid size-14 place-items-center rounded-full bg-white/95 text-black">
                    <Play className="ml-1 size-6 fill-current" />
                  </div>
                </div>
              )}
              {player.error && (
                <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-white/80">
                  <div>
                    Video yuklanmadi.{' '}
                    <a className="underline" href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`} target="_blank" rel="noreferrer">
                      YouTube’da ochish
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Watch progress → becomes the homework CTA once complete (Watch → Do, no dead end) */}
          <Card className={cn('p-4 sm:p-5', completed && 'border-l-4 border-l-mint-500')}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <ProgressRing value={watched} size={52} stroke={5} color={completed ? 'var(--mint)' : undefined} label="Ko‘rilgan qism">
                  {completed ? <CircleCheck className="size-5 text-mint-500" /> : <span className="text-[13px] font-semibold tabular-nums">{Math.round(watched * 100)}%</span>}
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  {completed ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="font-semibold">Dars tugallandi · +{lesson.xpReward} XP</p>
                      <p className="text-sm text-muted">
                        Keyingi qadam — uy vazifasi.{' '}
                        {hwProgress?.status === 'done' ? 'U allaqachon bajarilgan.' : '3 ta savol, taxminan 10–20 daqiqa.'}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">Ko‘rilgan qism</span>
                        <span className="tabular-nums text-muted">
                          {player.duration ? `${fmt(player.position)} / ${fmt(player.duration)}` : `~${lesson.durationMin} daq`}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ring-track">
                        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${watched * 100}%` }} />
                      </div>
                      <p className="mt-1.5 text-[13px] text-muted">
                        Videoning {Math.round(COMPLETE_AT * 100)}% qismi ko‘rilganda dars tugallanadi (+{lesson.xpReward} XP). Oldinga o‘tkazilgan qism hisobga olinmaydi.
                      </p>
                    </>
                  )}
                </div>
              </div>
              {completed && (
                <Button onClick={goHomework} className="shrink-0">
                  <ClipboardList /> {hwProgress?.status === 'done' ? 'Natijani ko‘rish' : 'Uy vazifasiga o‘tish'} <ArrowRight />
                </Button>
              )}
            </div>
            {!completed && import.meta.env.DEV && (
              <button
                onClick={() => completeLesson(lessonId)}
                className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs text-subtle hover:text-foreground"
                title="Faqat development rejimida ko‘rinadi"
              >
                <FlaskConical className="size-3.5" /> Dev: darsni tugallangan deb belgilash
              </button>
            )}
          </Card>

          {/* Lesson info */}
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <SubjectPill subject={lesson.subject} />
              <span className="text-[13px] text-muted">{lesson.topic}</span>
              <span className="ml-auto flex items-center gap-1 text-[13px] text-muted"><Zap className="size-3.5 text-flare-500" /> {lesson.xpReward} XP</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold">
              <span className="text-subtle">{lesson.order}.</span> {lesson.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{lesson.description}</p>
            <p className="mt-3 text-[13px] text-muted">Video muallifi: <span className="font-medium text-foreground">{lesson.channel}</span> (YouTube)</p>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <Materials materials={lesson.materials} />
          <Card>
            <CardHeader>
              <CardTitle><ListChecks /> Kurs dasturi</CardTitle>
            </CardHeader>
            <ol className="-mx-2 flex max-h-[28rem] flex-col gap-0.5 overflow-y-auto scrollbar-thin">
              {lessons.map((l) => {
                const done = allProgress[l.id]?.completed
                const active = l.id === lessonId
                return (
                  <li key={l.id}>
                    <Link
                      to={`/lessons/${l.id}`}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition',
                        active ? 'bg-primary-soft' : 'hover:bg-surface-sunken',
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-6 shrink-0 place-items-center rounded-md text-xs font-semibold',
                          done ? 'bg-mint-500/15 text-mint-500' : active ? 'bg-primary text-white' : 'bg-surface-sunken text-muted',
                        )}
                      >
                        {done ? <CircleCheck className="size-4" /> : l.order}
                      </span>
                      <span className={cn('min-w-0 flex-1 truncate', active ? 'font-medium' : 'text-muted')}>{l.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Materials({ materials }: { materials: LessonMaterial[] }) {
  const [notice, setNotice] = useState<string | null>(null)
  const ICON = { pdf: FileText, worksheet: ListChecks, link: LinkIcon }
  return (
    <Card>
      <CardHeader>
        <CardTitle><FileText /> Qo‘shimcha materiallar</CardTitle>
      </CardHeader>
      <ul className="flex flex-col gap-2">
        {materials.map((m) => {
          const Icon = ICON[m.type]
          const external = m.type === 'link'
          return (
            <li key={m.id}>
              <a
                href={m.url}
                target={external ? '_blank' : undefined}
                rel="noreferrer"
                onClick={(e) => {
                  if (!external) {
                    e.preventDefault()
                    setNotice(m.id)
                    setTimeout(() => setNotice(null), 2500)
                  }
                }}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-surface-sunken"
              >
                <span className={cn('grid size-8 place-items-center rounded-md bg-surface-sunken', external ? 'text-primary-text' : 'text-muted')}>
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{m.title}</span>
                  <span className="text-xs text-muted">
                    {notice === m.id ? 'Namuna fayl: server ulangach yuklab olish mumkin bo‘ladi' : external ? 'Tashqi havola · yangi oynada ochiladi' : `${m.type.toUpperCase()} · ${m.size}`}
                  </span>
                </span>
                {external && <ExternalLink className="size-4 text-muted" />}
              </a>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function LessonSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-5">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  )
}
