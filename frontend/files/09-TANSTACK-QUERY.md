# 09 — TanStack Query

## Query Client Setup

### `src/lib/queryClient.ts`

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 4_000, // 4 seconds — vitals refresh frequently
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
})
```

---

## Query Keys

All query keys are typed constants — never raw strings in hooks.

```ts
// src/lib/queryKeys.ts
export const QUERY_KEYS = {
  vitals: {
    current: () => ['vitals', 'current'] as const,
    history: (vital: VitalType) => ['vitals', 'history', vital] as const,
  },
  alerts: {
    all: () => ['alerts'] as const,
    byId: (id: string) => ['alerts', id] as const,
  },
  analytics: {
    weekly: () => ['analytics', 'weekly'] as const,
    riskScore: () => ['analytics', 'risk'] as const,
  },
  smsLog: {
    all: () => ['sms', 'log'] as const,
  },
} as const
```

---

## Hook: `useVitalsQuery.ts`

### Current vitals (real-time, updates every 5s)

```ts
export function useCurrentVitals() {
  return useQuery({
    queryKey: QUERY_KEYS.vitals.current(),
    queryFn: async (): Promise<CurrentVitals> => {
      // Simulate network delay
      await delay(200)
      return generateCurrentVitals()
    },
    refetchInterval: 5_000, // Re-fetches every 5 seconds
    refetchIntervalInBackground: true,
  })
}
```

### Vital history (24h)

```ts
export function useVitalHistory(vital: VitalType) {
  return useQuery({
    queryKey: QUERY_KEYS.vitals.history(vital),
    queryFn: async (): Promise<VitalDataPoint[]> => {
      await delay(300)
      return generate24HourHistory(vital)
    },
    staleTime: 60_000, // History doesn't need to update as often
  })
}
```

### Usage in components

```tsx
function VitalDetailCard({ vital }: { vital: VitalType }) {
  const { data, isLoading, isError, refetch } = useCurrentVitals()

  if (isLoading) return <LoadingSpinner label="Loading vitals..." />
  if (isError) return <ErrorBoundary error={error} reset={refetch} />

  return <div>...</div>
}
```

---

## Hook: `useAlertsQuery.ts`

```ts
export function useAlerts() {
  return useQuery({
    queryKey: QUERY_KEYS.alerts.all(),
    queryFn: async (): Promise<AlertEvent[]> => {
      await delay(400)
      return generateAlertHistory(20)
    },
    staleTime: 30_000,
  })
}
```

### Mutations — Mark alert as read

```ts
export function useMarkAlertRead() {
  return useMutation({
    mutationFn: async (alertId: string): Promise<void> => {
      await delay(100)
      // In real app: PATCH /alerts/:id { isRead: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts.all() })
    },
  })
}
```

---

## Hook: `useAnalyticsQuery.ts`

```ts
export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.weekly(),
    queryFn: async (): Promise<WeeklyAnalytics> => {
      await delay(500)
      return generate7DayAnalytics()
    },
    staleTime: 5 * 60_000, // 5 minutes — analytics are not real-time
  })
}

export function useRiskScore() {
  const vitalsQuery = useCurrentVitals()
  return useQuery({
    queryKey: QUERY_KEYS.analytics.riskScore(),
    queryFn: async (): Promise<RiskScore> => {
      await delay(100)
      if (!vitalsQuery.data) return { score: 0, level: 'low' }
      return calculateRiskScore(vitalsQuery.data)
    },
    enabled: !!vitalsQuery.data, // Only runs when vitals are loaded
    refetchInterval: 5_000,
  })
}
```

---

## Hook: `useSmsLogQuery.ts`

```ts
export function useSmsLog() {
  return useQuery({
    queryKey: QUERY_KEYS.smsLog.all(),
    queryFn: async (): Promise<SmsLogEntry[]> => {
      await delay(300)
      return generateSmsLog(10)
    },
    staleTime: 60_000,
  })
}
```

---

## Loading & Error Pattern (Consistent)

All data-dependent components use this pattern:

```tsx
const { data, isLoading, isError, error, refetch } = useCurrentVitals()

if (isLoading) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner label="Loading..." />
    </div>
  )
}

if (isError) {
  return (
    <ErrorBoundary
      error={error instanceof Error ? error : new Error('Unknown error')}
      reset={refetch}
    />
  )
}

// Safe to use `data` here — it is defined
```

---

## Alert Engine Integration

The `useCurrentVitals` query triggers the alert engine as a **side effect**:

```ts
// In useAlertEngine.ts
export function useAlertEngine() {
  const { data: vitals } = useCurrentVitals()
  const settings = useSettingsStore()
  const { addAlert } = useAlertStore()
  const { mutate: sendSms } = useSendSms()

  useEffect(() => {
    if (!vitals) return
    checkThresholds(vitals, settings.thresholds).forEach((breach) => {
      addAlert(breach)
      toast.error(`⚠️ ${breach.message}`, { duration: 6000 })
      if (settings.smsEnabled[breach.severity]) {
        sendSms({ breach, contacts: settings.contacts })
      }
    })
  }, [vitals]) // Runs every time vitals refresh (every 5s)
}
```

Mount `useAlertEngine()` once in `DashboardShell.tsx`.

---

## `delay` Utility

```ts
// src/lib/formatters.ts
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
```
