import { motion } from 'framer-motion'
import { CalendarClock, Clock, Zap } from 'lucide-react'
import type { Homework, HomeworkProgress, HomeworkStatus } from '@/types'
import { SubjectPill } from '@/components/common/SubjectPill'
import { DifficultyBars } from '@/components/common/DifficultyBars'
import { formatDate, relativeDue } from '@/lib/date'
import { cn } from '@/lib/utils'

interface Props {
  hw: Homework
  progress: HomeworkProgress
  status: HomeworkStatus
  onOpen: () => void
}

export function HomeworkCard({ hw, progress, status, onOpen }: Props) {
  const answered = Object.keys(progress.answers).length
  return (
    <motion.button
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onOpen}
      className={cn(
        'surface w-full cursor-pointer rounded-lg p-4 text-left shadow-none transition-colors hover:border-border-strong',
        status === 'overdue' && 'border-danger-500/40',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <SubjectPill subject={hw.subject} />
        <DifficultyBars level={hw.difficulty} />
      </div>
      <h3 className="mt-2.5 text-[15px] font-medium leading-snug">{hw.title}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
        <span className={cn('inline-flex items-center gap-1', status === 'overdue' && 'font-medium text-danger-500')} title={`Muddat: ${formatDate(progress.dueDate)}`}>
          <CalendarClock className="size-3.5" />
          {status === 'done' ? `Bajarildi` : relativeDue(progress.dueDate)}
        </span>
        <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> ~{hw.estimatedMin} daq</span>
        <span className="inline-flex items-center gap-1"><Zap className="size-3.5" /> {hw.xpReward} XP</span>
      </div>
      {status === 'in_progress' && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ring-track">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(answered / hw.questions.length) * 100}%` }} />
          </div>
          <span className="text-xs tabular-nums text-muted">{answered}/{hw.questions.length}</span>
        </div>
      )}
      {status === 'done' && progress.score !== undefined && (
        <div className="mt-3 text-[13px] text-muted">Natija: <span className="font-medium text-foreground">{Math.round(progress.score * 100)}%</span></div>
      )}
    </motion.button>
  )
}
