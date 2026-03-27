import { useAuthStore } from '#/store/auth'
import type {
  AlertEvent,
  CurrentVitals,
  VitalDataPoint,
  VitalType,
  WeeklyAnalytics,
} from '@/types/dashboard'
import { useQuery } from '@tanstack/react-query'
import {
  useHealthReadings,
  useLatestHealthReading,
} from './useHealthReadingsApi'

const VITAL_TYPE_TO_KEY: Record<VitalType, string> = {
  heartRate: 'heart_rate',
  spo2: 'spo2',
  temperature: 'temperature',
  glucose: 'glucose',
}

// Fetch current vitals from API
export function useCurrentVitals() {
  const { user } = useAuthStore()
  const apiQuery = useLatestHealthReading(user?.id || '')

  return useQuery({
    queryKey: ['vitals', 'current'],
    queryFn: async (): Promise<CurrentVitals> => {
      if (!apiQuery.data) {
        throw new Error('No data from API')
      }

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
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!user && !!apiQuery.data,
  })
}

// Fetch 24-hour history for a specific vital
export function use24HourHistory(vitalType: VitalType) {
  const { user } = useAuthStore()
  const apiQuery = useHealthReadings(user?.id || '')

  return useQuery({
    queryKey: ['vitals', 'history24h', vitalType],
    queryFn: async (): Promise<VitalDataPoint[]> => {
      if (!apiQuery.data || !Array.isArray(apiQuery.data)) {
        throw new Error('No data from API')
      }

      return apiQuery.data.map((reading) => ({
        timestamp: new Date(reading.timestamp),
        value:
          (reading[
            VITAL_TYPE_TO_KEY[vitalType] as keyof typeof reading
          ] as number) || 0,
        time: new Date(reading.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }))
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!vitalType && !!user && !!apiQuery.data,
  })
}

// Fetch weekly analytics
export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: async (): Promise<WeeklyAnalytics> => {
      throw new Error('No API endpoint yet')
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: false,
  })
}

// Fetch all alerts
export function useAlerts() {
  return useQuery({
    queryKey: ['alerts', 'all'],
    queryFn: async (): Promise<AlertEvent[]> => {
      throw new Error('No API endpoint yet')
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000,
    enabled: false,
  })
}
