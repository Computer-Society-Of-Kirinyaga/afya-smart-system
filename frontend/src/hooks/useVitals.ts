import {
    generate24HourHistory,
    generate7DayAnalytics,
    generateAlertEvents,
    generateCurrentVitals,
} from '@/lib/mockData'
import type { AlertEvent, CurrentVitals, VitalDataPoint, VitalType, WeeklyAnalytics } from '@/types/dashboard'
import { useQuery } from '@tanstack/react-query'

// Fetch current vitals
export function useCurrentVitals() {
  return useQuery({
    queryKey: ['vitals', 'current'],
    queryFn: async (): Promise<CurrentVitals> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      return generateCurrentVitals()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

// Fetch 24-hour history for a specific vital
export function use24HourHistory(vitalType: VitalType) {
  return useQuery({
    queryKey: ['vitals', 'history24h', vitalType],
    queryFn: async (): Promise<VitalDataPoint[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      return generate24HourHistory(vitalType)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !!vitalType, // Only fetch if vitalType is provided
  })
}

// Fetch weekly analytics
export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: async (): Promise<WeeklyAnalytics> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400))
      return generate7DayAnalytics()
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
  })
}

// Fetch all alerts
export function useAlerts() {
  return useQuery({
    queryKey: ['alerts', 'all'],
    queryFn: async (): Promise<AlertEvent[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      return generateAlertEvents(15)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (alerts update frequently)
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  })
}
