# 11 — Alerts & SMS Notifications

## Overview

The alert system has two layers:

1. **Alert Engine** — checks vitals against thresholds every 5 seconds, fires toasts, updates Zustand
2. **SMS Service** — sends real SMS via Africa's Talking API when critical/warning thresholds breach

---

## Default Thresholds

### `src/lib/thresholds.ts`

```ts
import type { Thresholds } from '@/types/settings'

export const DEFAULT_THRESHOLDS: Thresholds = {
  heartRate: {
    min: 60,
    max: 100,
    unit: 'bpm',
    label: 'Heart Rate',
  },
  systolic: {
    min: 90,
    max: 140,
    unit: 'mmHg',
    label: 'Blood Pressure (Systolic)',
  },
  diastolic: {
    min: 60,
    max: 90,
    unit: 'mmHg',
    label: 'Blood Pressure (Diastolic)',
  },
  spo2: {
    min: 95,
    max: 100,
    unit: '%',
    label: 'Blood Oxygen (SpO2)',
  },
  temperature: {
    min: 36.1,
    max: 37.5,
    unit: '°C',
    label: 'Temperature',
  },
  glucose: {
    min: 4.0,
    max: 7.8,
    unit: 'mmol/L',
    label: 'Blood Glucose',
  },
}
```

---

## Threshold Checker

```ts
// src/lib/thresholds.ts

export function checkThresholds(
  vitals: CurrentVitals,
  thresholds: Thresholds,
): AlertBreach[] {
  const breaches: AlertBreach[] = []

  const check = (value: number, key: keyof Thresholds, label: string) => {
    const t = thresholds[key]
    if (value > t.max) {
      breaches.push({
        id: `breach-${key}-${Date.now()}`,
        vital: key,
        value,
        unit: t.unit,
        threshold: t.max,
        direction: 'above',
        message: `${label} is too high: ${value} ${t.unit}`,
        severity: value > t.max * 1.1 ? 'critical' : 'warning',
        timestamp: new Date(),
        isRead: false,
        smsSent: false,
        smsRecipients: [],
      })
    } else if (value < t.min) {
      breaches.push({
        id: `breach-${key}-${Date.now()}`,
        vital: key,
        value,
        unit: t.unit,
        threshold: t.min,
        direction: 'below',
        message: `${label} is too low: ${value} ${t.unit}`,
        severity: value < t.min * 0.9 ? 'critical' : 'warning',
        timestamp: new Date(),
        isRead: false,
        smsSent: false,
        smsRecipients: [],
      })
    }
  }

  check(vitals.heartRate.value, 'heartRate', 'Heart Rate')
  check(vitals.bloodPressure.systolic, 'systolic', 'Blood Pressure (Systolic)')
  check(
    vitals.bloodPressure.diastolic,
    'diastolic',
    'Blood Pressure (Diastolic)',
  )
  check(vitals.spo2.value, 'spo2', 'Blood Oxygen')
  check(vitals.temperature.value, 'temperature', 'Temperature')
  check(vitals.glucose.value, 'glucose', 'Blood Glucose')

  return breaches
}
```

---

## Alert Engine Hook

### `src/hooks/useAlertEngine.ts`

```ts
export function useAlertEngine(): void {
  const { data: vitals } = useCurrentVitals()
  const { thresholds, smsEnabled, toastsEnabled, contacts } = useSettingsStore()
  const { addAlert } = useAlertStore()
  const { mutate: sendSms } = useSendSms()

  // Debounce ref — prevent duplicate alerts within 30s per vital
  const lastAlertTime = useRef<Record<string, number>>({})

  useEffect(() => {
    if (!vitals) return

    const breaches = checkThresholds(vitals, thresholds)

    breaches.forEach((breach) => {
      const lastTime = lastAlertTime.current[breach.vital] ?? 0
      const now = Date.now()

      // Only fire if 30+ seconds since last alert for this vital
      if (now - lastTime < 30_000) return
      lastAlertTime.current[breach.vital] = now

      // 1. Add to Zustand store
      addAlert(breach)

      // 2. Show toast
      if (toastsEnabled) {
        const toastFn =
          breach.severity === 'critical' ? toast.error : toast.warning
        toastFn(`⚠️ ${breach.message}`, {
          description: `Threshold: ${breach.threshold} ${breach.unit}`,
          duration: 8_000,
          action: {
            label: 'View',
            onClick: () => router.navigate({ to: '/dashboard/alerts' }),
          },
        })
      }

      // 3. Send SMS
      if (smsEnabled[breach.severity]) {
        sendSms({ breach, contacts })
      }
    })
  }, [vitals]) // Re-runs every time vitals refresh
}
```

**Mount location:** `DashboardShell.tsx` — called once, runs for the lifetime of the app.

```tsx
// DashboardShell.tsx
export function DashboardShell({ children }: DashboardShellProps) {
  useAlertEngine()  // ← Mount the engine here
  return (...)
}
```

---

## SMS Service

### `src/lib/smsService.ts`

```ts
const AT_API_URL = 'https://api.africastalking.com/version1/messaging'

interface SmsPayload {
  to: string[]
  message: string
}

interface SmsResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendSmsViaAfricasTalking(
  payload: SmsPayload,
): Promise<SmsResult> {
  const apiKey = import.meta.env.VITE_AT_API_KEY
  const username = import.meta.env.VITE_AT_USERNAME

  if (!apiKey || !username) {
    // Graceful fallback — log instead of throwing
    console.warn('[VITALIS SMS] API credentials not set. SMS not sent.')
    return { success: false, error: 'Credentials not configured' }
  }

  try {
    const response = await fetch(AT_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey: apiKey,
      },
      body: new URLSearchParams({
        username,
        to: payload.to.join(','),
        message: payload.message,
        from: 'VITALIS',
      }),
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    return {
      success: true,
      messageId: data?.SMSMessageData?.Recipients?.[0]?.messageId,
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
```

---

## SMS Hook (TanStack Mutation)

### `src/hooks/useSmsNotification.ts`

```ts
interface SendSmsParams {
  breach: AlertBreach
  contacts: ContactInfo
}

export function useSendSms() {
  return useMutation({
    mutationFn: async ({
      breach,
      contacts,
    }: SendSmsParams): Promise<SmsResult> => {
      const message = buildSmsMessage(breach)
      const recipients = [contacts.patientPhone, contacts.doctorPhone].filter(
        Boolean,
      )

      return sendSmsViaAfricasTalking({ to: recipients, message })
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('SMS alert sent to patient and doctor', {
          duration: 4000,
        })
      }
      // Invalidate SMS log so SMSLogPanel refreshes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.smsLog.all() })
    },
    onError: () => {
      toast.error('SMS delivery failed — please check your settings')
    },
  })
}

function buildSmsMessage(breach: AlertBreach): string {
  const severity = breach.severity.toUpperCase()
  return (
    `VITALIS ${severity} ALERT\n` +
    `${breach.message}\n` +
    `Reading: ${breach.value} ${breach.unit}\n` +
    `Safe range: ${breach.direction === 'above' ? 'max' : 'min'} ${breach.threshold} ${breach.unit}\n` +
    `Time: ${breach.timestamp.toLocaleTimeString('en-KE')}\n` +
    `Log in to VITALIS for full details.`
  )
}
```

---

## `.env` Setup

```env
# .env.local
VITE_AT_API_KEY=your_africa_talking_api_key_here
VITE_AT_USERNAME=your_africa_talking_username_here
```

- If credentials are missing, SMS silently fails with a console warning
- Toast UI notifications still work regardless
- Include `.env.local` in `.gitignore`

---

## Toast Setup

Using **sonner** (ships with shadcn):

```tsx
// App.tsx or main.tsx
import { Toaster } from '@/components/ui/sonner'

// Add inside root layout:
;<Toaster position="top-right" richColors expand />
```

Toast variants used:

- `toast.error()` — critical alerts
- `toast.warning()` — warning alerts
- `toast.success()` — SMS sent confirmation
- `toast.info()` — informational notices
