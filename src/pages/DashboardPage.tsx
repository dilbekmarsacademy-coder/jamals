import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { stagger } from '@/components/common/PageTransition'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { TodayLessonCard } from '@/components/dashboard/TodayLessonCard'
import { ProgressCard } from '@/components/dashboard/ProgressCard'
import { HomeworkWidget } from '@/components/dashboard/HomeworkWidget'
import { RankWidget } from '@/components/dashboard/RankWidget'
import { WeeklyActivityChart } from '@/components/dashboard/WeeklyActivityChart'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@/hooks/useQuery'
import { api } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'
import { getWeeklyActivity } from '@/lib/activity'

export default function DashboardPage() {
  const { data: lessons, loading } = useQuery('lessons', api.getLessons)
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const xpLog = useAppStore((s) => s.xpLog)
  const week = useMemo(() => getWeeklyActivity(xpLog), [xpLog])

  // "Today's lesson" = the first unfinished lesson in course order
  const today = lessons?.find((l) => !lessonProgress[l.id]?.completed) ?? lessons?.[lessons.length - 1]
  const weekDelta = week.prevTotal > 0 ? Math.round(((week.total - week.prevTotal) / week.prevTotal) * 100) : null

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={stagger.item}>
        <DashboardHeader weekDelta={weekDelta} />
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <motion.div variants={stagger.item} className="flex flex-col [&>*]:flex-1">
          {loading || !today ? (
            <div className="surface flex flex-col gap-5 rounded-xl p-5 sm:flex-row">
              <Skeleton className="aspect-video sm:w-[44%]" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-auto h-12 w-40" />
              </div>
            </div>
          ) : (
            <TodayLessonCard lesson={today} progress={lessonProgress[today.id]} />
          )}
        </motion.div>
        <motion.div variants={stagger.item} className="flex flex-col [&>*]:flex-1">
          <ProgressCard />
        </motion.div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <motion.div variants={stagger.item} className="flex flex-col [&>*]:flex-1">
          <HomeworkWidget />
        </motion.div>
        <motion.div variants={stagger.item} className="flex flex-col [&>*]:flex-1">
          <RankWidget />
        </motion.div>
        <motion.div variants={stagger.item} className="md:col-span-2 xl:col-span-1 flex flex-col [&>*]:flex-1">
          <WeeklyActivityChart {...week} />
        </motion.div>
      </div>
    </motion.div>
  )
}
