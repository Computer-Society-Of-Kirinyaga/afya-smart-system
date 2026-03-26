# 12 — TypeScript Types

## `src/types/vitals.ts`

```ts
export type VitalType =
  | 'heartRate'
  | 'bloodPressure'
  | 'spo2'
  | 'temperature'
  | 'glucose'

export type VitalStatus = 'normal' | 'warning' | 'critical'

export type TrendDirection = 'up' | 'down' | 'stable'

export interface SingleVital {
  value: number
  unit: string
  timestamp: Date
}

export interface BloodPressureVital {
  systolic: number
  diastolic: number
  unit: string
  timestamp: Date
}

export interface CurrentVitals {
  heartRate: SingleVital
  bloodPressure: BloodPressureVital
  spo2: SingleVital
  temperature: SingleVital
  glucose: SingleVital
}

export interface VitalDataPoint {
  time: string
  value: number
  timestamp: Date
}

export interface VitalDisplayConfig {
  key: VitalType
  label: string
  unit: string
  icon: string // lucide icon name
  colorClass: string // Tailwind text + bg classes
  formatValue: (v: number) => string
}
```

---

## `src/types/alerts.ts`

```ts
export type AlertSeverity = 'critical' | 'warning' | 'info'

export type AlertDirection = 'above' | 'below'

export interface AlertBreach {
  id: string
  vital: string
  value: number
  unit: string
  threshold: number
  direction: AlertDirection
  message: string
  severity: AlertSeverity
  timestamp: Date
  isRead: boolean
  smsSent: boolean
  smsRecipients: string[]
}

// AlertEvent is the same as AlertBreach — aliased for clarity in UI
export type AlertEvent = AlertBreach

export interface AlertTemplate {
  vital: string
  message: string
  threshold: number
  unit: string
}
```

---

## `src/types/analytics.ts`

```ts
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export interface RiskScore {
  score: number // 0–100
  level: RiskLevel
}

export interface DailyVitalSummary {
  day: string
  avg: number
  min: number
  max: number
}

export interface WeeklyAnalytics {
  heartRate: DailyVitalSummary[]
  spo2: DailyVitalSummary[]
  temperature: DailyVitalSummary[]
  glucose: DailyVitalSummary[]
}

export interface VitalStatRow {
  vital: string
  avg: number
  min: number
  max: number
  trend: TrendDirection
  status: VitalStatus
  unit: string
}
```

---

## `src/types/patient.ts`

```ts
export interface Patient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  phone: string
  doctorName: string
  doctorPhone: string
  conditions: string[]
  enrolledAt: Date
}
```

---

## `src/types/settings.ts`

```ts
export interface ThresholdRange {
  min: number
  max: number
  unit: string
  label: string
}

export interface Thresholds {
  heartRate: ThresholdRange
  systolic: ThresholdRange
  diastolic: ThresholdRange
  spo2: ThresholdRange
  temperature: ThresholdRange
  glucose: ThresholdRange
}

export interface ContactInfo {
  patientName: string
  patientPhone: string
  doctorName: string
  doctorPhone: string
}

export interface SmsToggles {
  critical: boolean
  warning: boolean
  info: boolean
}
```

---

## `src/types/sms.ts`

```ts
export interface SmsLogEntry {
  id: string
  recipient: string
  recipientLabel: string
  message: string
  sentAt: Date
  status: 'delivered' | 'failed' | 'pending'
}

export interface SmsResult {
  success: boolean
  messageId?: string
  error?: string
}
```

---

## Re-export index

```ts
// src/types/index.ts — re-export everything for clean imports
export * from './vitals'
export * from './alerts'
export * from './analytics'
export * from './patient'
export * from './settings'
export * from './sms'
```

**Usage:**

```ts
import type { CurrentVitals, VitalStatus, AlertEvent } from '@/types'
```

---

## Strict TypeScript Config

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Forbidden patterns:**

```ts
// ❌ Never use
const x: any = {}
function foo(bar: any) {}
const result = data as any

// ✅ Always use
const x: CurrentVitals = generateCurrentVitals()
function foo(bar: VitalType) {}
const result = data as CurrentVitals // only when truly safe
```
