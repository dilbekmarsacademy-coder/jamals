import { Link } from 'react-router-dom'
import { Clock, Play, Zap } from 'lucide-react'
import type { Lesson, LessonProgress } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubjectPill } from '@/components/common/SubjectPill'

export function TodayLessonCard({ lesson, progress }: { lesson: Lesson; progress?: LessonProgress }) {
  const watched = progress?.watched ?? 0
  const started = watched > 0.02
  return (
    <Card className="flex flex-col gap-5 p-4 sm:flex-row sm:p-5">
      <Link
        to={`/lessons/${lesson.id}`}
        className="group relative block aspect-video overflow-hidden rounded-lg bg-surface-sunken sm:w-[44%] sm:shrink-0"
        aria-label={`${lesson.title} darsini ochish`}
      >
        <img src={`https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`} alt="" className="size-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" />
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-black shadow-lg">
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">~{lesson.durationMin} daq</span>
        {started && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
            <div className="h-full bg-primary" style={{ width: `${watched * 100}%` }} />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Bugungi dars · {lesson.order}/12</p>
        <h2 className="mt-1.5 text-xl font-semibold">{lesson.title}</h2>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{lesson.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted">
          <SubjectPill subject={lesson.subject} />
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> ~{lesson.durationMin} daqiqa</span>
          <span className="inline-flex items-center gap-1"><Zap className="size-3.5 text-flare-500" /> {lesson.xpReward} XP</span>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <Button asChild>
            <Link to={`/lessons/${lesson.id}`}>
              <Play className="fill-current" /> {started ? 'Davom ettirish' : 'Darsni boshlash'}
            </Link>
          </Button>
          {started && <span className="text-sm text-muted">{Math.round(watched * 100)}% ko‘rilgan</span>}
        </div>
      </div>
    </Card>
  )
}
