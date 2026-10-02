'use client'

import { useNow } from '@/hooks/useNow'
import { HeroHeader } from '@/components/dashboard/HeroHeader'
import { TodayMission } from '@/components/dashboard/TodayMission'
import { ScoreMatrix } from '@/components/dashboard/ScoreMatrix'
import { MiniLeague } from '@/components/dashboard/MiniLeague'
import { WeekAttendance } from '@/components/dashboard/WeekAttendance'
import { HomeworkSnapshot } from '@/components/dashboard/HomeworkSnapshot'
import { CoachBubble } from '@/components/dashboard/CoachBubble'

export default function DashboardPage() {
  const now = useNow(60_000)
  return (
    <div className="space-y-5">
      <HeroHeader now={now} />
      <CoachBubble now={now} />
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TodayMission />
        </div>
        <ScoreMatrix />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MiniLeague now={now} />
        <WeekAttendance now={now} />
        <div className="md:col-span-2 xl:col-span-1">
          <HomeworkSnapshot now={now} />
        </div>
      </div>
    </div>
  )
}
