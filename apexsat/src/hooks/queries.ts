'use client'

import { useQuery } from '@tanstack/react-query'
import { api, queryKeys } from '@/lib/api'
import type { Tier } from '@/types'

export const useLessons = () => useQuery({ queryKey: queryKeys.lessons, queryFn: api.lessons })
export const useLessonQuery = (id: string) => useQuery({ queryKey: queryKeys.lesson(id), queryFn: () => api.lesson(id) })
export const useHomeworkCatalog = () => useQuery({ queryKey: queryKeys.homework, queryFn: api.homework })
export const useHomeworkQuery = (id: string) => useQuery({ queryKey: queryKeys.homeworkItem(id), queryFn: () => api.homeworkItem(id) })
export const useLeagueRoster = (tier: Tier, enabled = true) =>
  useQuery({ queryKey: queryKeys.league(tier), queryFn: () => api.league(tier), enabled })
