import {
    generate24HourHistory,
    generate7DayAnalytics,
    generateAlertEvents,
    generateCurrentVitals,
} from '@/lib/mockData'
import { useAuth } from '@/store/auth'
import type { AlertEvent, CurrentVitals, VitalDataPoint, VitalType, WeeklyAnalytics } from '@/types/dashboard'
import { useQuery } from '@tanstack/react-query'
import { useHealthReadings, useLatestHealthReading } from './useHealthReadingsApi'

// Fetch current vitals from API (falls back to mock data if API fails)
export function useCurrentVitals() {
  const { userId } = useAuth()
  const apiQuery = useLatestHealthReading(userId || '')

  return useQuery({
    queryKey: ['vitals', 'current'],
    queryFn: async (): Promise<CurrentVitals> => {
      try {
        // If API call succeeds, transform the HealthReading to CurrentVitals
        if (apiQuery.data) {
          return {
            heartRate: apiQuery.data.heart_rate || 0,
            bloodPressure: {
              systolic: apiQuery.data.systolic_bp || 0,
              diastolic: apiQuery.data.diastolic_bp || 0,
            },
            spO2: apiQuery.data.spo2 || 0,
            temperature: apiQuery.data.temperature || 0,
            timestamp: new Date(apiQuery.data.timestamp),
          }
        }
        throw new Error('No data from API')
      } catch {
        // Fall back to mock data if API fails
        await new Promise((resolve) => setTimeout(resolve, 300))
        return generateCurrentVitals()
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !!userId, // Only run if user is authenticated
  })
}

// Fetch 24-hour history for a specific vital
export function use24HourHistory(vitalType: VitalType) {
  const { userId } = useAuth()
  const apiQuery = useHealthReadings(userId || '')

  return useQuery({
    queryKey: ['vitals', 'history24h', vitalType],
    queryFn: async (): Promise<VitalDataPoint[]> => {
      try {
        // Transform API data to VitalDataPoint array
        if (apiQuery.data && Array.isArray(apiQuery.data)) {
          return apiQuery.data.map((reading) => ({
            timestamp: new Date(reading.timestamp),
            value: reading[vitalType as keyof typeof reading] as number || 0,
          }))
        }
        throw new Error('No data from API')
      } catch {
        // Fall back to mock data if API fails
        await new Promise((resolve) => setTimeout(resolve, 300))
        return generate24HourHistory(vitalType)
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !!vitalType && !!userId, // Only fetch if vitalType and userId are provided
  })
}

// Fetch weekly analytics
export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: async (): Promise<WeeklyAnalytics> => {
      try {
        // TODO: Create an API endpoint for aggregated weekly analytics
        throw new Error('No API endpoint yet')
      } catch {
        // Fall back to mock data
        await new Promise((resolve) => setTimeout(resolve, 400))
        return generate7DayAnalytics()
      }
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
      try {
        // TODO: Create an API endpoint for alerts
        throw new Error('No API endpoint yet')
      } catch {
        // Fall back to mock data
        await new Promise((resolve) => setTimeout(resolve, 300))
        return generateAlertEvents(15)
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (alerts update frequently)
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  })
}
