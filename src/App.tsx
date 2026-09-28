import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'
import DashboardPage from '@/pages/DashboardPage'
import LessonsPage from '@/pages/LessonsPage'
import LessonPage from '@/pages/LessonPage'
import HomeworkPage from '@/pages/HomeworkPage'
import HomeworkRunnerPage from '@/pages/HomeworkRunnerPage'
import LeaderboardPage from '@/pages/LeaderboardPage'
import AttendancePage from '@/pages/AttendancePage'
import ProfilePage from '@/pages/ProfilePage'
import OnboardingPage from '@/pages/OnboardingPage'
import NotFoundPage from '@/pages/NotFoundPage'

function ThemeSync() {
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0A1A' : '#F6F4FF')
  }, [theme])
  return null
}

function TitleSync() {
  const { t, lang } = useT()
  useEffect(() => {
    document.title = t('app.title')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])
  return null
}

function RequireAuth({ children }: { children: ReactNode }) {
  // Signed in = finished onboarding and didn't log out
  const allowed = useAppStore((s) => s.onboarded && s.loggedIn)
  return allowed ? children : <Navigate to="/welcome" replace />
}

function GuestOnly({ children }: { children: ReactNode }) {
  const signedIn = useAppStore((s) => s.onboarded && s.loggedIn)
  return signedIn ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={150}>
        <ThemeSync />
        <TitleSync />
        <BrowserRouter>
          <Routes>
            <Route path="/welcome" element={<GuestOnly><OnboardingPage /></GuestOnly>} />
            <Route
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="lessons" element={<LessonsPage />} />
              <Route path="lessons/:id" element={<LessonPage />} />
              <Route path="homework" element={<HomeworkPage />} />
              <Route path="homework/:id" element={<HomeworkRunnerPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  )
}
