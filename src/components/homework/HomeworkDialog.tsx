import { useNavigate } from 'react-router-dom'
import { CalendarClock, CirclePlay, Clock, Play, RotateCcw, Zap, Eye } from 'lucide-react'
import type { Homework, HomeworkProgress, HomeworkStatus } from '@/types'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/pill'
import { SubjectPill } from '@/components/common/SubjectPill'
import { DifficultyBars } from '@/components/common/DifficultyBars'
import { ProgressRing } from '@/components/common/ProgressRing'
import { STATUS_META } from '@/lib/homework'
import { formatDateLong, relativeDue } from '@/lib/date'
import { lessons } from '@/data/lessons'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface Props {
  item: { hw: Homework; progress: HomeworkProgress; status: HomeworkStatus } | null
  onClose: () => void
}

export function HomeworkDialog({ item, onClose }: Props) {
  const navigate = useNavigate()
  const startHomework = useAppStore((s) => s.startHomework)
  if (!item) return <Dialog open={false} />

  const { hw, progress, status } = item
  const meta = STATUS_META[status]
  const lesson = lessons.find((l) => l.id === hw.lessonId)
  const answered = Object.keys(progress.answers).length
  const go = () => {
    startHomework(hw.id)
    navigate(`/homework/${hw.id}`)
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <SubjectPill subject={hw.subject} />
          <Pill className={cn(meta.bg, meta.text, meta.ring)}>
            <span className={cn('size-1.5 rounded-full', meta.dot)} /> {meta.label}
          </Pill>
        </div>
        <DialogTitle className="mt-3">{hw.title}</DialogTitle>
        <DialogDescription className="mt-1">{hw.description}</DialogDescription>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Info icon={<CalendarClock className="size-4" />} label="Muddat" value={formatDateLong(progress.dueDate)} sub={status === 'done' ? undefined : relativeDue(progress.dueDate)} danger={status === 'overdue'} />
          <Info icon={<Clock className="size-4" />} label="Taxminiy vaqt" value={`~${hw.estimatedMin} daqiqa`} sub={`${hw.questions.length} ta savol`} />
          <Info icon={<Zap className="size-4" />} label="Mukofot" value={`${hw.xpReward} XP`} sub={status === 'overdue' ? 'Kechikkani uchun 50%' : 'To‘liq XP 100% natijada'} />
          <div className="rounded-lg border border-border p-3">
            <div className="text-xs text-muted">Qiyinlik</div>
            <div className="mt-1.5"><DifficultyBars level={hw.difficulty} /></div>
          </div>
        </div>

        {lesson && (
          <button
            onClick={() => navigate(`/lessons/${lesson.id}`)}
            className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-surface-sunken"
          >
            <CirclePlay className="size-5 shrink-0 text-muted" />
            <span className="min-w-0 flex-1 text-sm">
              <span className="block text-xs text-muted">Bog‘liq dars</span>
              <span className="block truncate font-semibold">{lesson.title}</span>
            </span>
          </button>
        )}

        {status === 'in_progress' && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border p-3">
            <ProgressRing value={answered / hw.questions.length} size={40} stroke={4}>
              <span className="text-xs font-semibold">{answered}/{hw.questions.length}</span>
            </ProgressRing>
            <span className="text-sm text-muted">To‘xtagan joyingizdan davom etasiz.</span>
          </div>
        )}

        <Button className="mt-6 w-full" variant={status === 'done' ? 'secondary' : 'default'} onClick={go}>
          {status === 'done' ? <><Eye /> Natijani ko‘rish</> : answered > 0 ? <><RotateCcw /> Davom ettirish</> : <><Play className="fill-current" /> Boshlash</>}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function Info({ icon, label, value, sub, danger }: { icon: React.ReactNode; label: string; value: string; sub?: string; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted">{icon} {label}</div>
      <div className="mt-1 text-sm font-medium leading-tight">{value}</div>
      {sub && <div className={cn('text-xs', danger ? 'font-medium text-danger-500' : 'text-muted')}>{sub}</div>}
    </div>
  )
}
